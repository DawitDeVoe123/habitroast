import { useState, useEffect } from 'react';
import { Page } from '@/components/Page.tsx';

interface Habit {
    id: number;
    name: string;
    streak: number;
    completedDates: string[];
    roastLevel: 'mild' | 'medium' | 'savage';
    stakeAmount?: number;
}

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: string;
    progress?: number;
    maxProgress?: number;
}

export const AnalyticsPage = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const storedHabits: Habit[] = JSON.parse(localStorage.getItem('habits') || '[]');
        setHabits(storedHabits);
        loadAchievements(storedHabits);
    };

    const loadAchievements = (habits: Habit[]) => {
        const storedAchievements: Achievement[] = JSON.parse(localStorage.getItem('achievements') || '[]');

        // Calculate achievements based on habits
        const calculatedAchievements: Achievement[] = [
            {
                id: 'first_habit',
                name: 'Getting Started',
                description: 'Create your first habit',
                icon: '🎯',
                unlocked: habits.length >= 1,
                unlockedAt: habits.length >= 1 ? new Date().toISOString() : undefined,
                progress: habits.length,
                maxProgress: 1,
            },
            {
                id: 'five_habits',
                name: 'Habit Builder',
                description: 'Create 5 different habits',
                icon: '🏗️',
                unlocked: habits.length >= 5,
                progress: habits.length,
                maxProgress: 5,
            },
            {
                id: 'streak_7',
                name: 'Week Warrior',
                description: 'Maintain a 7-day streak',
                icon: '🔥',
                unlocked: habits.some(h => h.streak >= 7),
                progress: Math.max(...habits.map(h => h.streak), 0),
                maxProgress: 7,
            },
            {
                id: 'streak_30',
                name: 'Monthly Master',
                description: 'Maintain a 30-day streak',
                icon: '💎',
                unlocked: habits.some(h => h.streak >= 30),
                progress: Math.max(...habits.map(h => h.streak), 0),
                maxProgress: 30,
            },
            {
                id: 'streak_100',
                name: 'Century Champion',
                description: 'Reach 100-day streak',
                icon: '👑',
                unlocked: habits.some(h => h.streak >= 100),
                progress: Math.max(...habits.map(h => h.streak), 0),
                maxProgress: 100,
            },
            {
                id: 'total_completions_10',
                name: 'Getting Started',
                description: 'Complete 10 habits total',
                icon: '✅',
                unlocked: habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0) >= 10,
                progress: habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0),
                maxProgress: 10,
            },
            {
                id: 'total_completions_50',
                name: 'Consistency King',
                description: 'Complete 50 habits total',
                icon: '👑',
                unlocked: habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0) >= 50,
                progress: habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0),
                maxProgress: 50,
            },
            {
                id: 'total_completions_100',
                name: 'Habit Legend',
                description: 'Complete 100 habits total',
                icon: '🏆',
                unlocked: habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0) >= 100,
                progress: habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0),
                maxProgress: 100,
            },
            {
                id: 'all_roast_levels',
                name: 'Roast Explorer',
                description: 'Try all roast levels',
                icon: '😈',
                unlocked: [...new Set(habits.map(h => h.roastLevel))].length === 3,
                progress: [...new Set(habits.map(h => h.roastLevel))].length,
                maxProgress: 3,
            },
            {
                id: 'staker',
                name: 'Risk Taker',
                description: 'Create your first staked habit',
                icon: '⭐',
                unlocked: habits.some(h => h.stakeAmount && h.stakeAmount > 0),
                progress: habits.filter(h => h.stakeAmount && h.stakeAmount > 0).length,
                maxProgress: 1,
            },
        ];

        setAchievements(calculatedAchievements);
        localStorage.setItem('achievements', JSON.stringify(calculatedAchievements));
    };

    // Calculate stats
    const totalCompletions = habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0);
    const longestStreak = Math.max(...habits.map(h => h.streak), 0);
    const currentStreak = habits.reduce((sum, h) => sum + h.streak, 0);
    const totalStars = habits.reduce((sum, h) => sum + (h.stakeAmount || 0), 0);

    // Calculate completion rate
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => h.completedDates?.includes(today)).length;
    const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

    // Get data for charts
    const getChartData = () => {
        const labels: string[] = [];
        const data: number[] = [];

        const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en', { weekday: 'short' });

            labels.push(dayName);

            let completions = 0;
            habits.forEach(h => {
                if (h.completedDates?.includes(dateStr)) completions++;
            });
            data.push(completions);
        }

        return { labels, data };
    };

    const chartData = getChartData();
    const maxValue = Math.max(...chartData.data, 1);

    return (
        <Page back={true}>
            <div style={{
                padding: '20px',
                maxWidth: '400px',
                margin: '0 auto',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                background: 'var(--hr-bg-primary)',
                minHeight: '100vh',
            }}>
                {/* Header */}
                <header style={{ marginBottom: '24px' }}>
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '26px', color: 'var(--hr-text-primary)' }}>
                        📊 Analytics
                    </h1>
                    <p style={{ margin: 0, color: 'var(--hr-text-secondary)', fontSize: '14px' }}>
                        Track your progress and achievements
                    </p>
                </header>

                {/* Time Range Selector */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '24px',
                }}>
                    {(['week', 'month', 'all'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '10px',
                                border: 'none',
                                background: timeRange === range ? 'var(--hr-primary)' : 'var(--hr-bg-card)',
                                color: timeRange === range ? 'white' : 'var(--hr-text-secondary)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                textTransform: 'capitalize',
                            }}
                        >
                            {range}
                        </button>
                    ))}
                </div>

                {/* Stats Overview */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '24px',
                }}>
                    <div style={{
                        background: 'var(--hr-bg-card)',
                        padding: '16px',
                        borderRadius: '14px',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--hr-primary-light)' }}>
                            {currentStreak}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--hr-text-secondary)' }}>
                            Total Streak Days
                        </div>
                    </div>
                    <div style={{
                        background: 'var(--hr-bg-card)',
                        padding: '16px',
                        borderRadius: '14px',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--hr-accent-gold)' }}>
                            {longestStreak}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--hr-text-secondary)' }}>
                            Best Streak
                        </div>
                    </div>
                    <div style={{
                        background: 'var(--hr-bg-card)',
                        padding: '16px',
                        borderRadius: '14px',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--hr-success)' }}>
                            {totalCompletions}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--hr-text-secondary)' }}>
                            Total Completions
                        </div>
                    </div>
                    <div style={{
                        background: 'var(--hr-bg-card)',
                        padding: '16px',
                        borderRadius: '14px',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--hr-accent-warm)' }}>
                            {completionRate}%
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--hr-text-secondary)' }}>
                            Today's Rate
                        </div>
                    </div>
                </div>

                {/* Completion Chart */}
                <div style={{
                    background: 'var(--hr-bg-card)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    marginBottom: '24px',
                }}>
                    <h3 style={{ margin: '0 0 16px 0', color: 'var(--hr-text-primary)', fontSize: '16px' }}>
                        📈 Daily Completions
                    </h3>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '4px',
                        height: '120px',
                    }}>
                        {chartData.data.map((value, index) => (
                            <div
                                key={index}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        width: '100%',
                                        height: `${(value / maxValue) * 100}%`,
                                        minHeight: value > 0 ? '8px' : '2px',
                                        background: value > 0
                                            ? 'var(--hr-gradient-primary)'
                                            : 'var(--hr-bg-elevated)',
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'height 0.3s ease',
                                    }}
                                />
                                <span style={{
                                    fontSize: '10px',
                                    color: 'var(--hr-text-muted)',
                                    marginTop: '4px',
                                }}>
                                    {chartData.labels[index]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Habits Breakdown */}
                <div style={{
                    background: 'var(--hr-bg-card)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    marginBottom: '24px',
                }}>
                    <h3 style={{ margin: '0 0 16px 0', color: 'var(--hr-text-primary)', fontSize: '16px' }}>
                        🎯 Habits Breakdown
                    </h3>
                    {habits.length === 0 ? (
                        <p style={{ margin: 0, color: 'var(--hr-text-secondary)', fontSize: '14px' }}>
                            No habits yet. Create one to track your progress!
                        </p>
                    ) : (
                        habits.slice(0, 5).map((habit) => (
                            <div
                                key={habit.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 0',
                                    borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: '600', color: 'var(--hr-text-primary)' }}>
                                        {habit.name}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--hr-text-secondary)' }}>
                                        🔥 {habit.streak} day streak
                                    </div>
                                </div>
                                <div style={{
                                    background: 'var(--hr-gradient-primary)',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    color: 'white',
                                    fontWeight: '600',
                                }}>
                                    {habit.completedDates?.length || 0} done
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Achievements Preview */}
                <div style={{
                    background: 'var(--hr-bg-card)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                }}>
                    <h3 style={{ margin: '0 0 16px 0', color: 'var(--hr-text-primary)', fontSize: '16px' }}>
                        🏆 Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '8px',
                    }}>
                        {achievements.slice(0, 10).map((achievement) => (
                            <div
                                key={achievement.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '8px',
                                    borderRadius: '12px',
                                    background: achievement.unlocked
                                        ? 'rgba(139, 92, 246, 0.2)'
                                        : 'var(--hr-bg-elevated)',
                                    opacity: achievement.unlocked ? 1 : 0.5,
                                }}
                                title={achievement.description}
                            >
                                <span style={{ fontSize: '24px' }}>{achievement.icon}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Page>
    );
};
