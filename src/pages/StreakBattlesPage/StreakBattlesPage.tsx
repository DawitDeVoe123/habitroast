import { useState, useEffect } from 'react';
import { Page } from '@/components/Page.tsx';

interface Battle {
    id: number;
    name: string;
    duration: 7 | 14 | 30;
    startDate: string;
    endDate: string;
    participants: string[];
    status: 'active' | 'completed';
    winner?: string;
}

interface LeaderboardEntry {
    username: string;
    totalStreak: number;
    completedToday: number;
    totalHabits: number;
    rank: number;
}

interface Habit {
    id: number;
    name: string;
    streak: number;
    completedDates: string[];
    accountabilityCircle: string[];
}

export const StreakBattlesPage = () => {
    const [battles, setBattles] = useState<Battle[]>([]);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [newBattleName, setNewBattleName] = useState('');
    const [newBattleDuration, setNewBattleDuration] = useState<7 | 14 | 30>(7);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        loadData();
        generateLeaderboard();
    }, []);

    const loadData = () => {
        const storedBattles = JSON.parse(localStorage.getItem('battles') || '[]');
        const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]');
        setBattles(storedBattles);
        setHabits(storedHabits);
    };

    const generateLeaderboard = () => {
        const storedHabits: Habit[] = JSON.parse(localStorage.getItem('habits') || '[]');
        const allUsers = new Set<string>();

        // Collect all users from habits
        storedHabits.forEach((habit) => {
            habit.accountabilityCircle.forEach((username) => {
                allUsers.add(username);
            });
        });

        // Calculate stats for each user
        const entries: LeaderboardEntry[] = Array.from(allUsers).map((username) => {
            const userHabits = storedHabits.filter((h) =>
                h.accountabilityCircle.includes(username)
            );
            const totalStreak = userHabits.reduce((sum, h) => sum + h.streak, 0);
            const today = new Date().toISOString().split('T')[0];
            const completedToday = userHabits.filter((h) =>
                h.completedDates?.includes(today)
            ).length;
            const totalHabits = userHabits.length;

            return {
                username,
                totalStreak,
                completedToday,
                totalHabits,
                rank: 0,
            };
        });

        // Sort by total streak (descending)
        entries.sort((a, b) => b.totalStreak - a.totalStreak);

        // Assign ranks
        entries.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        setLeaderboard(entries);
    };

    const createBattle = () => {
        if (newBattleName.trim()) {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + newBattleDuration);

            const newBattle: Battle = {
                id: Date.now(),
                name: newBattleName.trim(),
                duration: newBattleDuration,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                participants: [],
                status: 'active',
            };

            const updatedBattles = [...battles, newBattle];
            localStorage.setItem('battles', JSON.stringify(updatedBattles));
            setBattles(updatedBattles);
            setNewBattleName('');
            setShowCreateForm(false);
        }
    };

    const joinBattle = (battleId: number, username: string) => {
        const updatedBattles = battles.map((battle) => {
            if (battle.id === battleId && !battle.participants.includes(username)) {
                return {
                    ...battle,
                    participants: [...battle.participants, username],
                };
            }
            return battle;
        });
        localStorage.setItem('battles', JSON.stringify(updatedBattles));
        setBattles(updatedBattles);
    };

    const deleteBattle = (battleId: number) => {
        const updatedBattles = battles.filter((b) => b.id !== battleId);
        localStorage.setItem('battles', JSON.stringify(updatedBattles));
        setBattles(updatedBattles);
    };

    const getDaysRemaining = (endDate: string): number => {
        const end = new Date(endDate);
        const now = new Date();
        const diffMs = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    const getBattleProgress = (battle: Battle): number => {
        const start = new Date(battle.startDate);
        const end = new Date(battle.endDate);
        const now = new Date();
        const totalMs = end.getTime() - start.getTime();
        const elapsedMs = now.getTime() - start.getTime();
        return Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
    };

    const getRankEmoji = (rank: number): string => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${rank}`;
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
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>⚔️ Streak Battles</h1>
                    <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                        Compete with friends in 7/14/30 day challenges! 🏆
                    </p>
                </header>

                {/* Leaderboard */}
                <div style={{
                    background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>🏆 Leaderboard</h3>
                    {leaderboard.length === 0 ? (
                        <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontStyle: 'italic' }}>
                            No data yet. Add friends to your habits to see rankings!
                        </p>
                    ) : (
                        <div style={{ display: 'grid', gap: '8px' }}>
                            {leaderboard.slice(0, 5).map((entry) => (
                                <div
                                    key={entry.username}
                                    style={{
                                        background: 'var(--tg-theme-bg-color, white)',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '20px' }}>{getRankEmoji(entry.rank)}</span>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                                @{entry.username}
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                                {entry.totalHabits} habits
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--tg-theme-button-color, #FF6B35)' }}>
                                            🔥 {entry.totalStreak}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                            {entry.completedToday} today
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Battle */}
                {showCreateForm ? (
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
                            Battle Name
                        </label>
                        <input
                            type="text"
                            value={newBattleName}
                            onChange={(e) => setNewBattleName(e.target.value)}
                            placeholder="e.g., Fitness Challenge"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--tg-theme-hint-color, #ddd)',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                background: 'var(--tg-theme-bg-color, white)',
                                color: 'var(--tg-theme-text-color, #1A1A1A)',
                                marginBottom: '12px',
                            }}
                        />

                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}>
                            Duration
                        </label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                            {[7, 14, 30].map((days) => (
                                <button
                                    key={days}
                                    onClick={() => setNewBattleDuration(days as 7 | 14 | 30)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: newBattleDuration === days
                                            ? '2px solid var(--tg-theme-button-color, #FF6B35)'
                                            : '1px solid var(--tg-theme-hint-color, #ddd)',
                                        background: newBattleDuration === days
                                            ? 'var(--tg-theme-button-color, #FF6B35)'
                                            : 'transparent',
                                        color: newBattleDuration === days
                                            ? 'var(--tg-theme-button-text-color, white)'
                                            : 'var(--tg-theme-text-color, #1A1A1A)',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: newBattleDuration === days ? 'bold' : 'normal',
                                    }}
                                >
                                    {days} days
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={createBattle}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'var(--tg-theme-button-color, #FF6B35)',
                                    color: 'var(--tg-theme-button-text-color, white)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                            >
                                Create Battle
                            </button>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--tg-theme-hint-color, #ddd)',
                                    background: 'transparent',
                                    color: 'var(--tg-theme-text-color, #1A1A1A)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'var(--tg-theme-button-color, #FF6B35)',
                            color: 'var(--tg-theme-button-text-color, white)',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginBottom: '20px',
                        }}
                    >
                        ⚔️ Create New Battle
                    </button>
                )}

                {/* Active Battles */}
                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>🔥 Active Battles</h3>
                    {battles.filter((b) => b.status === 'active').length === 0 ? (
                        <div style={{
                            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                            padding: '20px',
                            borderRadius: '12px',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚔️</div>
                            <h4 style={{ margin: '0 0 10px 0' }}>No active battles</h4>
                            <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                                Create a battle to start competing!
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {battles
                                .filter((b) => b.status === 'active')
                                .map((battle) => (
                                    <div
                                        key={battle.id}
                                        style={{
                                            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                                            padding: '16px',
                                            borderRadius: '12px',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <div>
                                                <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>⚔️ {battle.name}</h4>
                                                <p style={{ margin: 0, fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                                    {battle.duration} day challenge
                                                </p>
                                            </div>
                                            <span style={{
                                                background: 'var(--tg-theme-button-color, #FF6B35)',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                            }}>
                                                {getDaysRemaining(battle.endDate)} days left
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div style={{
                                            background: 'var(--tg-theme-bg-color, white)',
                                            borderRadius: '8px',
                                            height: '8px',
                                            marginBottom: '12px',
                                            overflow: 'hidden',
                                        }}>
                                            <div style={{
                                                background: 'var(--tg-theme-button-color, #FF6B35)',
                                                height: '100%',
                                                width: `${getBattleProgress(battle)}%`,
                                                borderRadius: '8px',
                                            }} />
                                        </div>

                                        {/* Participants */}
                                        <div style={{ marginBottom: '12px' }}>
                                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold' }}>
                                                Participants ({battle.participants.length})
                                            </p>
                                            {battle.participants.length === 0 ? (
                                                <p style={{ margin: 0, fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)', fontStyle: 'italic' }}>
                                                    No participants yet
                                                </p>
                                            ) : (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                    {battle.participants.map((username) => (
                                                        <span
                                                            key={username}
                                                            style={{
                                                                background: 'var(--tg-theme-bg-color, white)',
                                                                padding: '4px 10px',
                                                                borderRadius: '12px',
                                                                fontSize: '12px',
                                                            }}
                                                        >
                                                            @{username}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => {
                                                    const username = prompt('Enter your username:');
                                                    if (username) joinBattle(battle.id, username);
                                                }}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: 'var(--tg-theme-button-color, #FF6B35)',
                                                    color: 'var(--tg-theme-button-text-color, white)',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                Join Battle
                                            </button>
                                            <button
                                                onClick={() => deleteBattle(battle.id)}
                                                style={{
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ff4444',
                                                    background: 'transparent',
                                                    color: '#ff4444',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div style={{
                    padding: '16px',
                    background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                    borderRadius: '12px',
                    fontSize: '14px',
                }}>
                    <h4 style={{ margin: '0 0 8px 0' }}>How it works:</h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--tg-theme-hint-color, #666)' }}>
                        <li>Create 7, 14, or 30 day challenges</li>
                        <li>Invite friends to join your battle</li>
                        <li>Compete on streaks and completions</li>
                        <li>Leaderboard tracks everyone's progress</li>
                        <li>Creates competition and accountability! 🔥</li>
                    </ul>
                </div>
            </div>
        </Page>
    );
};
