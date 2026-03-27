import { useState, useEffect } from 'react';

interface VictoryRoast {
    id: number;
    habitId: number;
    habitName: string;
    streak: number;
    message: string;
    timestamp: string;
}

interface Habit {
    id: number;
    name: string;
    streak: number;
    lastCompleted: string | null;
    completedDates: string[];
    roastLevel: 'mild' | 'medium' | 'savage';
}

export const VictoryRoast = () => {
    const [victoryRoasts, setVictoryRoasts] = useState<VictoryRoast[]>([]);
    const [habits, setHabits] = useState<Habit[]>([]);

    useEffect(() => {
        loadData();
        checkForVictories();
    }, []);

    const loadData = () => {
        const storedRoasts = JSON.parse(localStorage.getItem('victoryRoasts') || '[]');
        const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]');
        setVictoryRoasts(storedRoasts);
        setHabits(storedHabits);
    };

    const checkForVictories = () => {
        const storedHabits: Habit[] = JSON.parse(localStorage.getItem('habits') || '[]');
        const storedRoasts: VictoryRoast[] = JSON.parse(localStorage.getItem('victoryRoasts') || '[]');
        const today = new Date().toISOString().split('T')[0];

        const newRoasts: VictoryRoast[] = [];

        storedHabits.forEach((habit) => {
            // Check if habit was completed today
            if (habit.completedDates?.includes(today)) {
                // Check if we already have a victory roast for this streak
                const existingRoast = storedRoasts.find(
                    (r) => r.habitId === habit.id && r.streak === habit.streak
                );

                if (!existingRoast) {
                    // Generate victory roast
                    const message = generateVictoryMessage(habit.name, habit.streak, habit.roastLevel);
                    const newRoast: VictoryRoast = {
                        id: Date.now() + Math.random(),
                        habitId: habit.id,
                        habitName: habit.name,
                        streak: habit.streak,
                        message,
                        timestamp: new Date().toISOString(),
                    };
                    newRoasts.push(newRoast);
                }
            }
        });

        if (newRoasts.length > 0) {
            const updatedRoasts = [...storedRoasts, ...newRoasts];
            localStorage.setItem('victoryRoasts', JSON.stringify(updatedRoasts));
            setVictoryRoasts(updatedRoasts);
        }
    };

    const generateVictoryMessage = (habitName: string, streak: number, roastLevel: string): string => {
        const messages = {
            mild: [
                `🎉 Amazing! You completed "${habitName}" and extended your ${streak}-day streak!`,
                `🔥 On fire! "${habitName}" done! ${streak} days and counting!`,
                `💪 Beast mode! You crushed "${habitName}"! ${streak}-day streak!`,
                `🏆 Champion! "${habitName}" completed! ${streak} days strong!`,
                `⭐ Superstar! You did "${habitName}"! ${streak}-day streak alive!`,
            ],
            medium: [
                `🚀 Unstoppable! "${habitName}" done! ${streak} days and growing!`,
                `✨ Incredible! You completed "${habitName}"! ${streak}-day streak!`,
                `🎯 Perfect! "${habitName}" done! ${streak} days of consistency!`,
                `💥 Crushing it! "${habitName}" completed! ${streak}-day streak!`,
                `🔥 On fire! "${habitName}" done! ${streak} days strong!`,
            ],
            savage: [
                `💀 Dominated! "${habitName}" crushed! ${streak}-day streak!`,
                `🔥 Destroyed! "${habitName}" done! ${streak} days of pure power!`,
                `💪 Beast mode activated! "${habitName}" completed! ${streak}-day streak!`,
                `🏆 Unstoppable force! "${habitName}" done! ${streak} days strong!`,
                `⚡ Electric! "${habitName}" completed! ${streak}-day streak alive!`,
            ],
        };

        const levelMessages = messages[roastLevel as keyof typeof messages] || messages.medium;
        return levelMessages[Math.floor(Math.random() * levelMessages.length)];
    };

    const getStreakEmoji = (streak: number): string => {
        if (streak >= 30) return '🏆';
        if (streak >= 14) return '🔥';
        if (streak >= 7) return '💪';
        if (streak >= 3) return '⭐';
        return '✨';
    };

    const formatTime = (timestamp: string): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    if (victoryRoasts.length === 0) {
        return (
            <div style={{
                background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
            }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏆</div>
                <h3 style={{ margin: '0 0 10px 0' }}>No victories yet</h3>
                <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                    Complete habits to earn victory roasts!
                </p>
            </div>
        );
    }

    return (
        <div style={{
            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
            padding: '16px',
            borderRadius: '12px',
        }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>🏆 Victory Roasts</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                Celebrate your streaks with positive roasts!
            </p>

            <div style={{ display: 'grid', gap: '10px' }}>
                {victoryRoasts.slice(-10).reverse().map((roast) => (
                    <div
                        key={roast.id}
                        style={{
                            background: 'var(--tg-theme-bg-color, white)',
                            padding: '12px',
                            borderRadius: '8px',
                            borderLeft: '4px solid #4CAF50',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px' }}>{getStreakEmoji(roast.streak)}</span>
                                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                    {roast.habitName}
                                </span>
                            </div>
                            <span style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                {formatTime(roast.timestamp)}
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--tg-theme-text-color, #1A1A1A)' }}>
                            {roast.message}
                        </p>
                        <div style={{
                            marginTop: '6px',
                            display: 'inline-block',
                            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '12px',
                            color: 'var(--tg-theme-button-color, #FF6B35)',
                            fontWeight: 'bold',
                        }}>
                            🔥 {roast.streak} day streak
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats */}
            <div style={{
                marginTop: '12px',
                padding: '8px',
                background: 'var(--tg-theme-bg-color, white)',
                borderRadius: '6px',
                fontSize: '12px',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Total Victories:</span>
                    <span style={{ fontWeight: 'bold' }}>{victoryRoasts.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Best Streak:</span>
                    <span style={{ fontWeight: 'bold' }}>
                        {Math.max(...victoryRoasts.map((r) => r.streak), 0)} days
                    </span>
                </div>
            </div>
        </div>
    );
};
