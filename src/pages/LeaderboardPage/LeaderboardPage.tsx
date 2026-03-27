import { useState, useEffect } from 'react';
import { Page } from '@/components/Page.tsx';

interface LeaderboardEntry {
    id: number;
    username: string;
    totalStreak: number;
    habitsCount: number;
    rank: number;
    isCurrentUser?: boolean;
}

interface Circle {
    id: number;
    name: string;
    members: string[];
}

export const LeaderboardPage = () => {
    const [activeTab, setActiveTab] = useState<'global' | 'circle'>('global');
    const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [circleLeaderboard, setCircleLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [circles, setCircles] = useState<Circle[]>([]);
    const [selectedCircle, setSelectedCircle] = useState<number | null>(null);

    useEffect(() => {
        loadLeaderboards();
    }, []);

    const loadLeaderboards = () => {
        // Load habits from localStorage
        const habits = JSON.parse(localStorage.getItem('habits') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

        // Calculate global leaderboard
        const userStreaks: { [key: string]: { totalStreak: number; habitsCount: number } } = {};

        habits.forEach((habit: any) => {
            const username = habit.username || 'Anonymous';
            if (!userStreaks[username]) {
                userStreaks[username] = { totalStreak: 0, habitsCount: 0 };
            }
            userStreaks[username].totalStreak += habit.streak || 0;
            userStreaks[username].habitsCount += 1;
        });

        const globalEntries: LeaderboardEntry[] = Object.entries(userStreaks)
            .map(([username, data], index) => ({
                id: index + 1,
                username,
                totalStreak: data.totalStreak,
                habitsCount: data.habitsCount,
                rank: 0,
                isCurrentUser: username === currentUser.username,
            }))
            .sort((a, b) => b.totalStreak - a.totalStreak)
            .map((entry, index) => ({ ...entry, rank: index + 1 }));

        setGlobalLeaderboard(globalEntries);

        // Load circles
        const storedCircles = JSON.parse(localStorage.getItem('circles') || '[]');
        setCircles(storedCircles);

        // Calculate circle leaderboard if circles exist
        if (storedCircles.length > 0) {
            const firstCircle = storedCircles[0];
            setSelectedCircle(firstCircle.id);
            calculateCircleLeaderboard(firstCircle.id, habits);
        }
    };

    const calculateCircleLeaderboard = (circleId: number, habits: any[]) => {
        const circle = circles.find(c => c.id === circleId);
        if (!circle) return;

        const userStreaks: { [key: string]: { totalStreak: number; habitsCount: number } } = {};

        habits.forEach((habit: any) => {
            const username = habit.username || 'Anonymous';
            if (circle.members.includes(username)) {
                if (!userStreaks[username]) {
                    userStreaks[username] = { totalStreak: 0, habitsCount: 0 };
                }
                userStreaks[username].totalStreak += habit.streak || 0;
                userStreaks[username].habitsCount += 1;
            }
        });

        const circleEntries: LeaderboardEntry[] = Object.entries(userStreaks)
            .map(([username, data], index) => ({
                id: index + 1,
                username,
                totalStreak: data.totalStreak,
                habitsCount: data.habitsCount,
                rank: 0,
            }))
            .sort((a, b) => b.totalStreak - a.totalStreak)
            .map((entry, index) => ({ ...entry, rank: index + 1 }));

        setCircleLeaderboard(circleEntries);
    };

    const handleCircleChange = (circleId: number) => {
        setSelectedCircle(circleId);
        const habits = JSON.parse(localStorage.getItem('habits') || '[]');
        calculateCircleLeaderboard(circleId, habits);
    };

    const getRankEmoji = (rank: number) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${rank}`;
        }
    };

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1: return '#FFD700';
            case 2: return '#C0C0C0';
            case 3: return '#CD7F32';
            default: return 'var(--tg-theme-hint-color, #666)';
        }
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
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>🏆 Leaderboard</h1>
                    <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                        Compete with friends and climb the ranks! 🚀
                    </p>
                </header>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '20px',
                }}>
                    <button
                        onClick={() => setActiveTab('global')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: activeTab === 'global' ? '2px solid var(--tg-theme-button-color, #FF6B35)' : '1px solid var(--tg-theme-hint-color, #ddd)',
                            background: activeTab === 'global' ? 'var(--tg-theme-button-color, #FF6B35)' : 'transparent',
                            color: activeTab === 'global' ? 'var(--tg-theme-button-text-color, white)' : 'var(--tg-theme-text-color, #1A1A1A)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                        }}
                    >
                        🌍 Global
                    </button>
                    <button
                        onClick={() => setActiveTab('circle')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: activeTab === 'circle' ? '2px solid var(--tg-theme-button-color, #FF6B35)' : '1px solid var(--tg-theme-hint-color, #ddd)',
                            background: activeTab === 'circle' ? 'var(--tg-theme-button-color, #FF6B35)' : 'transparent',
                            color: activeTab === 'circle' ? 'var(--tg-theme-button-text-color, white)' : 'var(--tg-theme-text-color, #1A1A1A)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                        }}
                    >
                        👥 Circle
                    </button>
                </div>

                {/* Circle Selector */}
                {activeTab === 'circle' && circles.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}>
                            Select Circle
                        </label>
                        <select
                            value={selectedCircle || ''}
                            onChange={(e) => handleCircleChange(Number(e.target.value))}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--tg-theme-hint-color, #ddd)',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                background: 'var(--tg-theme-bg-color, white)',
                                color: 'var(--tg-theme-text-color, #1A1A1A)',
                            }}
                        >
                            {circles.map((circle) => (
                                <option key={circle.id} value={circle.id}>
                                    {circle.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Leaderboard */}
                <div style={{
                    background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 1fr 80px 80px',
                        gap: '10px',
                        padding: '12px 16px',
                        background: 'var(--tg-theme-button-color, #FF6B35)',
                        color: 'var(--tg-theme-button-text-color, white)',
                        fontWeight: 'bold',
                        fontSize: '12px',
                    }}>
                        <div>Rank</div>
                        <div>User</div>
                        <div style={{ textAlign: 'center' }}>Streak</div>
                        <div style={{ textAlign: 'center' }}>Habits</div>
                    </div>

                    {/* Entries */}
                    {(activeTab === 'global' ? globalLeaderboard : circleLeaderboard).length === 0 ? (
                        <div style={{
                            padding: '40px 20px',
                            textAlign: 'center',
                            color: 'var(--tg-theme-hint-color, #666)',
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📊</div>
                            <p style={{ margin: 0 }}>
                                {activeTab === 'global'
                                    ? 'No data yet. Start tracking habits to appear on the leaderboard!'
                                    : 'No circle members found. Create a circle and invite friends!'}
                            </p>
                        </div>
                    ) : (
                        (activeTab === 'global' ? globalLeaderboard : circleLeaderboard).map((entry) => (
                            <div
                                key={entry.id}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '60px 1fr 80px 80px',
                                    gap: '10px',
                                    padding: '12px 16px',
                                    borderBottom: '1px solid var(--tg-theme-hint-color, #eee)',
                                    background: entry.isCurrentUser ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                                }}
                            >
                                <div style={{
                                    fontWeight: 'bold',
                                    color: getRankColor(entry.rank),
                                    fontSize: '16px',
                                }}>
                                    {getRankEmoji(entry.rank)}
                                </div>
                                <div style={{
                                    fontWeight: entry.isCurrentUser ? 'bold' : 'normal',
                                    color: entry.isCurrentUser ? 'var(--tg-theme-button-color, #FF6B35)' : 'var(--tg-theme-text-color, #1A1A1A)',
                                }}>
                                    {entry.username}
                                    {entry.isCurrentUser && ' (You)'}
                                </div>
                                <div style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: 'var(--tg-theme-button-color, #FF6B35)',
                                }}>
                                    🔥 {entry.totalStreak}
                                </div>
                                <div style={{
                                    textAlign: 'center',
                                    color: 'var(--tg-theme-hint-color, #666)',
                                }}>
                                    {entry.habitsCount}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginTop: '20px',
                }}>
                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '16px',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--tg-theme-button-color, #FF6B35)' }}>
                            {activeTab === 'global' ? globalLeaderboard.length : circleLeaderboard.length}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                            {activeTab === 'global' ? 'Total Users' : 'Circle Members'}
                        </div>
                    </div>
                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '16px',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--tg-theme-button-color, #FF6B35)' }}>
                            {activeTab === 'global'
                                ? globalLeaderboard.reduce((sum, e) => sum + e.totalStreak, 0)
                                : circleLeaderboard.reduce((sum, e) => sum + e.totalStreak, 0)}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                            Total Streak Days
                        </div>
                    </div>
                </div>

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
                        <li>Track habits to earn streak days</li>
                        <li>Compete globally or within your circles</li>
                        <li>Top streaks earn medals 🥇🥈🥉</li>
                        <li>Stay consistent to climb the ranks!</li>
                    </ul>
                </div>
            </div>
        </Page>
    );
};
