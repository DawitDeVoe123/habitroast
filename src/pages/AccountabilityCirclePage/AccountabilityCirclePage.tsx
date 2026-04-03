import { useState, useEffect } from 'react';
import { Page } from '@/components/Page.tsx';

interface Friend {
    username: string;
    addedAt: string;
    habits: number[];
}

interface Habit {
    id: number;
    name: string;
    accountabilityCircle: string[];
}

export const AccountabilityCirclePage = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [newFriend, setNewFriend] = useState('');
    const [habits, setHabits] = useState<Habit[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const storedFriends = JSON.parse(localStorage.getItem('friends') || '[]');
        const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]');
        setFriends(storedFriends);
        setHabits(storedHabits);
    };

    const addFriend = () => {
        if (newFriend.trim() && !friends.some((f) => f.username === newFriend.trim())) {
            const newFriendObj: Friend = {
                username: newFriend.trim(),
                addedAt: new Date().toISOString(),
                habits: [],
            };
            const updatedFriends = [...friends, newFriendObj];
            localStorage.setItem('friends', JSON.stringify(updatedFriends));
            setFriends(updatedFriends);
            setNewFriend('');
        }
    };

    const removeFriend = (username: string) => {
        const updatedFriends = friends.filter((f) => f.username !== username);
        localStorage.setItem('friends', JSON.stringify(updatedFriends));
        setFriends(updatedFriends);
    };

    const getHabitsForFriend = (username: string) => {
        return habits.filter((habit) => habit.accountabilityCircle.includes(username));
    };

    const roasts = [
        "Your friend's consistency is better than yours! 😈",
        "Even your accountability partner is disappointed.",
        "At least someone in your circle is trying!",
        "Your friends are watching... and judging. 🔥",
        "Time to step up your game!",
    ];

    const getRandomRoast = () => {
        return roasts[Math.floor(Math.random() * roasts.length)];
    };

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
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>👥 Accountability Circle</h1>
                    <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                        Your friends who will roast you when you fail! 🔥
                    </p>
                </header>

                {/* Add Friend */}
                <div style={{
                    background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                    }}>
                        Add a Friend
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={newFriend}
                            onChange={(e) => setNewFriend(e.target.value)}
                            placeholder="Friend's username"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFriend())}
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
                            onClick={addFriend}
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
                            {friends.length}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--hr-text-secondary)' }}>
                            Friends
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
                            {habits.filter((h) => h.accountabilityCircle.length > 0).length}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--hr-text-secondary)' }}>
                            Shared Habits
                        </div>
                    </div>
                </div>

                {/* Friends List */}
                {friends.length === 0 ? (
                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '40px 20px',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '15px' }}>👥</div>
                        <h3 style={{ margin: '0 0 10px 0' }}>No friends yet</h3>
                        <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)' }}>
                            Add friends to your accountability circle!
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {friends.map((friend) => {
                            const friendHabits = getHabitsForFriend(friend.username);
                            return (
                                <div
                                    key={friend.username}
                                    style={{
                                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                                        padding: '16px',
                                        borderRadius: '12px',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '24px' }}>👤</span>
                                                <h3 style={{ margin: 0, fontSize: '16px' }}>@{friend.username}</h3>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                                Added {new Date(friend.addedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFriend(friend.username)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                fontSize: '18px',
                                                color: '#ff4444',
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    {friendHabits.length > 0 ? (
                                        <div>
                                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold', color: 'var(--tg-theme-hint-color, #666)' }}>
                                                Watching these habits:
                                            </p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {friendHabits.map((habit) => (
                                                    <span
                                                        key={habit.id}
                                                        style={{
                                                            background: 'var(--tg-theme-bg-color, white)',
                                                            padding: '4px 10px',
                                                            borderRadius: '12px',
                                                            fontSize: '12px',
                                                        }}
                                                    >
                                                        {habit.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)', fontStyle: 'italic' }}>
                                            Not watching any habits yet
                                        </p>
                                    )}

                                    <div style={{
                                        marginTop: '12px',
                                        padding: '10px',
                                        background: 'var(--tg-theme-bg-color, white)',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        color: 'var(--tg-theme-hint-color, #666)',
                                        fontStyle: 'italic',
                                    }}>
                                        "{getRandomRoast()}"
                                    </div>
                                </div>
                            );
                        })}
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
                        <li>Add friends to your accountability circle</li>
                        <li>When creating habits, add them to your circle</li>
                        <li>They'll see your progress and can roast you!</li>
                        <li>Motivation through friendly competition 🔥</li>
                    </ul>
                </div>
            </div>
        </Page>
    );
};
