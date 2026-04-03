import { useState, useEffect } from 'react';
import { Page } from '@/components/Page.tsx';

interface CircleMember {
    username: string;
    joinedAt: string;
    habits: number[];
    totalStreak: number;
    completedToday: number;
}

interface Circle {
    id: number;
    name: string;
    createdAt: string;
    members: CircleMember[];
    maxMembers: number;
}

interface Habit {
    id: number;
    name: string;
    streak: number;
    completedDates: string[];
    accountabilityCircle: string[];
}

export const CirclePage = () => {
    const [circles, setCircles] = useState<Circle[]>([]);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [newCircleName, setNewCircleName] = useState('');
    const [newMemberUsername, setNewMemberUsername] = useState('');
    const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const storedCircles = JSON.parse(localStorage.getItem('circles') || '[]');
        const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]');
        setCircles(storedCircles);
        setHabits(storedHabits);
    };

    const createCircle = () => {
        if (newCircleName.trim() && circles.length < 5) {
            const newCircle: Circle = {
                id: Date.now(),
                name: newCircleName.trim(),
                createdAt: new Date().toISOString(),
                members: [],
                maxMembers: 5,
            };
            const updatedCircles = [...circles, newCircle];
            localStorage.setItem('circles', JSON.stringify(updatedCircles));
            setCircles(updatedCircles);
            setNewCircleName('');
            setShowCreateForm(false);
        }
    };

    const addMember = (circleId: number) => {
        if (newMemberUsername.trim()) {
            const updatedCircles = circles.map((circle) => {
                if (circle.id === circleId && circle.members.length < circle.maxMembers) {
                    const alreadyMember = circle.members.some(
                        (m) => m.username === newMemberUsername.trim()
                    );
                    if (!alreadyMember) {
                        const newMember: CircleMember = {
                            username: newMemberUsername.trim(),
                            joinedAt: new Date().toISOString(),
                            habits: [],
                            totalStreak: 0,
                            completedToday: 0,
                        };
                        return {
                            ...circle,
                            members: [...circle.members, newMember],
                        };
                    }
                }
                return circle;
            });
            localStorage.setItem('circles', JSON.stringify(updatedCircles));
            setCircles(updatedCircles);
            setNewMemberUsername('');
        }
    };

    const removeMember = (circleId: number, username: string) => {
        const updatedCircles = circles.map((circle) => {
            if (circle.id === circleId) {
                return {
                    ...circle,
                    members: circle.members.filter((m) => m.username !== username),
                };
            }
            return circle;
        });
        localStorage.setItem('circles', JSON.stringify(updatedCircles));
        setCircles(updatedCircles);
    };

    const deleteCircle = (circleId: number) => {
        const updatedCircles = circles.filter((c) => c.id !== circleId);
        localStorage.setItem('circles', JSON.stringify(updatedCircles));
        setCircles(updatedCircles);
        setSelectedCircle(null);
    };

    const getMemberStats = (username: string) => {
        const memberHabits = habits.filter((h) =>
            h.accountabilityCircle.includes(username)
        );
        const totalStreak = memberHabits.reduce((sum, h) => sum + h.streak, 0);
        const today = new Date().toISOString().split('T')[0];
        const completedToday = memberHabits.filter((h) =>
            h.completedDates?.includes(today)
        ).length;
        return { totalStreak, completedToday, totalHabits: memberHabits.length };
    };

    const nudgeMember = (username: string) => {
        // In a real app, this would send a notification
        // For now, we'll just show an alert
        const messages = [
            `Hey @${username}! Your accountability circle is watching! 👀`,
            `@${username}, don't let your streak die! 🔥`,
            `Reminder: @${username} has habits to complete! ⏰`,
            `@${username}, your circle needs you! 💪`,
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        alert(message);
    };

    if (selectedCircle) {
        return (
            <Page back={true}>
                <div style={{
                    padding: '20px',
                    maxWidth: '400px',
                    margin: '0 auto',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }}>
                    <button
                        onClick={() => setSelectedCircle(null)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--hr-primary-light)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            marginBottom: '20px',
                            padding: '0',
                        }}
                    >
                        ← Back to circles
                    </button>

                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div>
                                <h2 style={{ margin: '0 0 5px 0' }}>👥 {selectedCircle.name}</h2>
                                <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                                    {selectedCircle.members.length}/{selectedCircle.maxMembers} members
                                </p>
                            </div>
                            <button
                                onClick={() => deleteCircle(selectedCircle.id)}
                                style={{
                                    background: '#ff4444',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                }}
                            >
                                Delete
                            </button>
                        </div>

                        {/* Add Member */}
                        {selectedCircle.members.length < selectedCircle.maxMembers && (
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                }}>
                                    Add Member
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        value={newMemberUsername}
                                        onChange={(e) => setNewMemberUsername(e.target.value)}
                                        placeholder="Username"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMember(selectedCircle.id))}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--tg-theme-hint-color, #ddd)',
                                            fontSize: '16px',
                                            boxSizing: 'border-box',
                                            background: 'var(--tg-theme-bg-color, white)',
                                            color: 'var(--tg-theme-text-color, #1A1A1A)',
                                        }}
                                    />
                                    <button
                                        onClick={() => addMember(selectedCircle.id)}
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: 'var(--hr-primary)',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Members List */}
                        <div>
                            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Members</h3>
                            {selectedCircle.members.length === 0 ? (
                                <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontStyle: 'italic' }}>
                                    No members yet. Add friends to your circle!
                                </p>
                            ) : (
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {selectedCircle.members.map((member) => {
                                        const stats = getMemberStats(member.username);
                                        return (
                                            <div
                                                key={member.username}
                                                style={{
                                                    background: 'var(--tg-theme-bg-color, white)',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                            <span style={{ fontSize: '20px' }}>👤</span>
                                                            <span style={{ fontWeight: 'bold' }}>@{member.username}</span>
                                                        </div>
                                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => nudgeMember(member.username)}
                                                        style={{
                                                            background: 'var(--hr-primary)',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '6px 12px',
                                                            borderRadius: '12px',
                                                            fontSize: '12px',
                                                            fontWeight: 'bold',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        👋 Nudge
                                                    </button>
                                                </div>
                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '1fr 1fr 1fr',
                                                    gap: '8px',
                                                    marginTop: '8px',
                                                }}>
                                                    <div style={{
                                                        background: 'var(--hr-bg-card)',
                                                        padding: '8px',
                                                        borderRadius: '6px',
                                                        textAlign: 'center',
                                                        border: '1px solid rgba(139, 92, 246, 0.2)',
                                                    }}>
                                                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--hr-primary-light)' }}>
                                                            {stats.totalStreak}
                                                        </div>
                                                        <div style={{ fontSize: '10px', color: 'var(--hr-text-secondary)' }}>
                                                            Streak
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        background: 'var(--hr-bg-card)',
                                                        padding: '8px',
                                                        borderRadius: '6px',
                                                        textAlign: 'center',
                                                        border: '1px solid rgba(139, 92, 246, 0.2)',
                                                    }}>
                                                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--hr-primary-light)' }}>
                                                            {stats.completedToday}
                                                        </div>
                                                        <div style={{ fontSize: '10px', color: 'var(--hr-text-secondary)' }}>
                                                            Today
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        background: 'var(--hr-bg-card)',
                                                        padding: '8px',
                                                        borderRadius: '6px',
                                                        textAlign: 'center',
                                                        border: '1px solid rgba(139, 92, 246, 0.2)',
                                                    }}>
                                                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--hr-primary-light)' }}>
                                                            {stats.totalHabits}
                                                        </div>
                                                        <div style={{ fontSize: '10px', color: 'var(--hr-text-secondary)' }}>
                                                            Habits
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeMember(selectedCircle.id, member.username)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ff4444',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        marginTop: '8px',
                                                        padding: '0',
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Page>
        );
    }

    return (
        <Page back={true}>
            <div style={{
                padding: '20px',
                maxWidth: '400px',
                margin: '0 auto',
                fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
                {/* Header */}
                <header style={{ marginBottom: '20px' }}>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>👥 Accountability Circles</h1>
                    <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                        Create groups of 3-5 friends to track progress together! 🔥
                    </p>
                </header>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '20px',
                }}>
                    <div style={{
                        background: 'var(--hr-bg-card)',
                        padding: '12px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--hr-primary-light)' }}>
                            {circles.length}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--hr-text-secondary)' }}>
                            Circles
                        </div>
                    </div>
                    <div style={{
                        background: 'var(--hr-bg-card)',
                        padding: '12px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--hr-primary-light)' }}>
                            {circles.reduce((sum, c) => sum + c.members.length, 0)}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--hr-text-secondary)' }}>
                            Total Members
                        </div>
                    </div>
                </div>

                {/* Create Circle */}
                {showCreateForm ? (
                    <div style={{
                        background: 'var(--hr-bg-card)',
                        padding: '16px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}>
                            Circle Name
                        </label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                            <input
                                type="text"
                                value={newCircleName}
                                onChange={(e) => setNewCircleName(e.target.value)}
                                placeholder="e.g., Fitness Squad"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), createCircle())}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--tg-theme-hint-color, #ddd)',
                                    fontSize: '16px',
                                    boxSizing: 'border-box',
                                    background: 'var(--tg-theme-bg-color, white)',
                                    color: 'var(--tg-theme-text-color, #1A1A1A)',
                                }}
                            />
                            <button
                                onClick={createCircle}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'var(--hr-primary)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                            >
                                Create
                            </button>
                        </div>
                        <button
                            onClick={() => setShowCreateForm(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--hr-text-secondary)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                padding: '0',
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        disabled={circles.length >= 5}
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '12px',
                            border: 'none',
                            background: circles.length >= 5
                                ? 'var(--hr-bg-elevated)'
                                : 'var(--hr-primary)',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: circles.length >= 5 ? 'not-allowed' : 'pointer',
                            marginBottom: '20px',
                        }}
                    >
                        ➕ Create New Circle {circles.length >= 5 && '(Max 5)'}
                    </button>
                )}

                {/* Circles List */}
                {circles.length === 0 ? (
                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '40px 20px',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '15px' }}>👥</div>
                        <h3 style={{ margin: '0 0 10px 0' }}>No circles yet</h3>
                        <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)' }}>
                            Create your first accountability circle!
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {circles.map((circle) => (
                            <div
                                key={circle.id}
                                onClick={() => setSelectedCircle(circle)}
                                style={{
                                    background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: 'var(--hr-text-primary)' }}>👥 {circle.name}</h3>
                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--hr-text-secondary)' }}>
                                            {circle.members.length}/{circle.maxMembers} members
                                        </p>
                                    </div>
                                    <span style={{
                                        background: 'var(--hr-primary)',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                    }}>
                                        {circle.members.length} 👥
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info */}
                <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                    borderRadius: '12px',
                    fontSize: '14px',
                }}>
                    <h4 style={{ margin: '0 0 8px 0' }}>How it works:</h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--tg-theme-hint-color, #666)' }}>
                        <li>Create circles with 3-5 friends</li>
                        <li>Everyone sees each other's progress</li>
                        <li>Nudge friends who are slacking</li>
                        <li>Compete on streaks and completions</li>
                        <li>No one wants to be the ❌ in the group!</li>
                    </ul>
                </div>
            </div>
        </Page>
    );
};
