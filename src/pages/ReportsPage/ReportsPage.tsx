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

interface WeeklyData {
    day: string;
    completed: number;
    total: number;
}

export const ReportsPage = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const storedHabits: Habit[] = JSON.parse(localStorage.getItem('habits') || '[]');
        setHabits(storedHabits);
    };

    // Calculate weekly data
    const getWeeklyData = (): WeeklyData[] => {
        const data: WeeklyData[] = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en', { weekday: 'short' });

            let completed = 0;
            habits.forEach(habit => {
                if (habit.completedDates?.includes(dateStr)) {
                    completed++;
                }
            });

            data.push({
                day: dayName,
                completed,
                total: habits.length,
            });
        }

        return data;
    };

    // Calculate monthly data
    const getMonthlyData = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let completedDays = 0;
        let totalPossible = 0;

        for (let day = 1; day <= today.getDate(); day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];

            let dayCompleted = 0;
            habits.forEach(habit => {
                if (habit.completedDates?.includes(dateStr)) {
                    dayCompleted++;
                }
            });

            if (dayCompleted > 0) completedDays++;
            totalPossible++;
        }

        return {
            completedDays,
            totalPossible,
            completionRate: totalPossible > 0 ? Math.round((completedDays / totalPossible) * 100) : 0,
            monthName: today.toLocaleDateString('en', { month: 'long', year: 'numeric' }),
        };
    };

    // Calculate stats
    const getWeeklyStats = () => {
        const weeklyData = getWeeklyData();
        const totalCompleted = weeklyData.reduce((sum, d) => sum + d.completed, 0);
        const totalPossible = weeklyData.reduce((sum, d) => sum + d.total, 0);
        const avgPerDay = totalCompleted / 7;

        // Find best day
        const bestDay = weeklyData.reduce((best, d) =>
            d.completed > best.completed ? d : best, weeklyData[0]);

        // Find streak days
        const streakDays = weeklyData.filter(d => d.completed === d.total).length;

        return {
            totalCompleted,
            totalPossible,
            avgPerDay: avgPerDay.toFixed(1),
            bestDay: bestDay?.day || '-',
            bestDayCount: bestDay?.completed || 0,
            streakDays,
        };
    };

    const weeklyStats = getWeeklyStats();
    const monthlyData = getMonthlyData();

    // Get habit performance
    const getHabitPerformance = () => {
        return habits.map(habit => {
            const today = new Date();
            let completedThisWeek = 0;
            let completedThisMonth = 0;

            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                if (habit.completedDates?.includes(dateStr)) completedThisWeek++;
            }

            for (let i = 0; i < today.getDate(); i++) {
                const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
                const dateStr = date.toISOString().split('T')[0];
                if (habit.completedDates?.includes(dateStr)) completedThisMonth++;
            }

            return {
                name: habit.name,
                streak: habit.streak,
                weekly: completedThisWeek,
                monthly: completedThisMonth,
            };
        }).sort((a, b) => b.weekly - a.weekly);
    };

    const habitPerformance = getHabitPerformance();

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
                        📈 Reports
                    </h1>
                    <p style={{ margin: 0, color: 'var(--hr-text-secondary)', fontSize: '14px' }}>
                        Weekly and monthly progress summaries
                    </p>
                </header>

                {/* Report Type Selector */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '24px',
                }}>
                    <button
                        onClick={() => setReportType('weekly')}
                        style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            background: reportType === 'weekly' ? 'var(--hr-primary)' : 'var(--hr-bg-card)',
                            color: reportType === 'weekly' ? 'white' : 'var(--hr-text-secondary)',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                        }}
                    >
                        📅 Weekly
                    </button>
                    <button
                        onClick={() => setReportType('monthly')}
                        style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            background: reportType === 'monthly' ? 'var(--hr-primary)' : 'var(--hr-bg-card)',
                            color: reportType === 'monthly' ? 'white' : 'var(--hr-text-secondary)',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                        }}
                    >
                        📆 Monthly
                    </button>
                </div>

                {reportType === 'weekly' ? (
                    <>
                        {/* Weekly Summary */}
                        <div style={{
                            background: 'var(--hr-gradient-primary)',
                            padding: '24px',
                            borderRadius: '16px',
                            marginBottom: '20px',
                            color: 'white',
                        }}>
                            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
                                This Week's Summary
                            </h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '16px',
                            }}>
                                <div>
                                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                                        {weeklyStats.totalCompleted}
                                    </div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                                        Completions
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                                        {weeklyStats.avgPerDay}
                                    </div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                                        Avg/Day
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                                        {weeklyStats.bestDay}
                                    </div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                                        Best Day
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                                        {weeklyStats.streakDays}
                                    </div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                                        Perfect Days
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Breakdown */}
                        <div style={{
                            background: 'var(--hr-bg-card)',
                            padding: '20px',
                            borderRadius: '16px',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            marginBottom: '20px',
                        }}>
                            <h3 style={{ margin: '0 0 16px 0', color: 'var(--hr-text-primary)', fontSize: '16px' }}>
                                Daily Breakdown
                            </h3>
                            {getWeeklyData().map((day, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 0',
                                        borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                                    }}
                                >
                                    <span style={{
                                        width: '40px',
                                        fontSize: '14px',
                                        color: 'var(--hr-text-secondary)',
                                    }}>
                                        {day.day}
                                    </span>
                                    <div style={{ flex: 1, height: '8px', background: 'var(--hr-bg-elevated)', borderRadius: '4px' }}>
                                        <div
                                            style={{
                                                width: `${(day.completed / day.total) * 100}%`,
                                                height: '100%',
                                                background: 'var(--hr-gradient-primary)',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </div>
                                    <span style={{
                                        width: '50px',
                                        textAlign: 'right',
                                        fontSize: '14px',
                                        color: 'var(--hr-text-primary)',
                                        fontWeight: '600',
                                    }}>
                                        {day.completed}/{day.total}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Monthly Summary */}
                        <div style={{
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                            padding: '24px',
                            borderRadius: '16px',
                            marginBottom: '20px',
                            color: 'white',
                        }}>
                            <h2 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
                                {monthlyData.monthName}
                            </h2>
                            <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>
                                {monthlyData.completionRate}%
                            </div>
                            <div style={{ fontSize: '14px', opacity: 0.9 }}>
                                Completion Rate
                            </div>
                        </div>

                        {/* Monthly Stats */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            marginBottom: '20px',
                        }}>
                            <div style={{
                                background: 'var(--hr-bg-card)',
                                padding: '16px',
                                borderRadius: '14px',
                                border: '1px solid rgba(139, 92, 246, 0.2)',
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--hr-primary-light)' }}>
                                    {monthlyData.completedDays}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--hr-text-secondary)' }}>
                                    Days Completed
                                </div>
                            </div>
                            <div style={{
                                background: 'var(--hr-bg-card)',
                                padding: '16px',
                                borderRadius: '14px',
                                border: '1px solid rgba(139, 92, 246, 0.2)',
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--hr-success)' }}>
                                    {monthlyData.totalPossible - monthlyData.completedDays}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--hr-text-secondary)' }}>
                                    Days Missed
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Habit Performance */}
                <div style={{
                    background: 'var(--hr-bg-card)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                }}>
                    <h3 style={{ margin: '0 0 16px 0', color: 'var(--hr-text-primary)', fontSize: '16px' }}>
                        🏃 Habit Performance
                    </h3>
                    {habitPerformance.length === 0 ? (
                        <p style={{ margin: 0, color: 'var(--hr-text-secondary)', fontSize: '14px' }}>
                            No habits to show. Create one to track progress!
                        </p>
                    ) : (
                        habitPerformance.map((habit, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: '14px 0',
                                    borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px',
                                }}>
                                    <span style={{ fontWeight: '600', color: 'var(--hr-text-primary)' }}>
                                        {habit.name}
                                    </span>
                                    <span style={{
                                        background: 'var(--hr-gradient-primary)',
                                        padding: '4px 10px',
                                        borderRadius: '10px',
                                        fontSize: '12px',
                                        color: 'white',
                                    }}>
                                        🔥 {habit.streak} days
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--hr-text-secondary)' }}>
                                    <span>Week: {habit.weekly}/7</span>
                                    <span>Month: {habit.monthly}/30</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Motivational Message */}
                <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    background: 'var(--hr-bg-card)',
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                        {monthlyData.completionRate >= 80 ? '🏆' : monthlyData.completionRate >= 50 ? '💪' : '🚀'}
                    </div>
                    <p style={{ margin: 0, color: 'var(--hr-text-primary)', fontSize: '15px', fontWeight: '600' }}>
                        {monthlyData.completionRate >= 80
                            ? "You're on fire! Keep crushing it!"
                            : monthlyData.completionRate >= 50
                                ? "Great progress! Almost at 100%!"
                                : "Every day is a fresh start! Let's go!"}
                    </p>
                </div>
            </div>
        </Page>
    );
};
