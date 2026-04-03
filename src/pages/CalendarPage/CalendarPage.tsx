import { useState, useEffect } from 'react';
import { Page } from '@/components/Page.tsx';

interface Habit {
    id: number;
    name: string;
    streak: number;
    completedDates: string[];
    roastLevel: 'mild' | 'medium' | 'savage';
}

export const CalendarPage = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        loadHabits();
    }, []);

    const loadHabits = () => {
        const storedHabits: Habit[] = JSON.parse(localStorage.getItem('habits') || '[]');
        setHabits(storedHabits);
        if (storedHabits.length > 0 && !selectedHabit) {
            setSelectedHabit(storedHabits[0].id);
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        return { daysInMonth, startingDay };
    };

    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);

    const isCompleted = (day: number) => {
        if (!selectedHabit) return false;
        const habit = habits.find(h => h.id === selectedHabit);
        if (!habit) return false;

        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateStr = date.toISOString().split('T')[0];
        return habit.completedDates?.includes(dateStr);
    };

    const getCompletionRate = () => {
        if (!selectedHabit) return 0;
        const habit = habits.find(h => h.id === selectedHabit);
        if (!habit) return 0;

        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        let completed = 0;
        let total = 0;

        for (let d = 1; d <= Math.min(today.getDate(), daysInMonth); d++) {
            total++;
            const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d).toISOString().split('T')[0];
            if (habit.completedDates?.includes(dateStr)) completed++;
        }

        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const selectedHabitData = habits.find(h => h.id === selectedHabit);

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
                        📅 Calendar
                    </h1>
                    <p style={{ margin: 0, color: 'var(--hr-text-secondary)', fontSize: '14px' }}>
                        Visualize your habit completion history
                    </p>
                </header>

                {/* Habit Selector */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: 'var(--hr-text-secondary)',
                        fontSize: '14px',
                    }}>
                        Select Habit
                    </label>
                    <select
                        value={selectedHabit || ''}
                        onChange={(e) => setSelectedHabit(Number(e.target.value))}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            background: 'var(--hr-bg-card)',
                            color: 'var(--hr-text-primary)',
                            fontSize: '16px',
                            cursor: 'pointer',
                        }}
                    >
                        {habits.map((habit) => (
                            <option key={habit.id} value={habit.id}>
                                {habit.name} 🔥 {habit.streak} days
                            </option>
                        ))}
                    </select>
                </div>

                {/* Stats */}
                {selectedHabitData && (
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '20px',
                    }}>
                        <div style={{
                            flex: 1,
                            background: 'var(--hr-bg-card)',
                            padding: '14px',
                            borderRadius: '12px',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--hr-primary-light)' }}>
                                {selectedHabitData.streak}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--hr-text-secondary)' }}>
                                Current Streak
                            </div>
                        </div>
                        <div style={{
                            flex: 1,
                            background: 'var(--hr-bg-card)',
                            padding: '14px',
                            borderRadius: '12px',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--hr-success)' }}>
                                {getCompletionRate()}%
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--hr-text-secondary)' }}>
                                This Month
                            </div>
                        </div>
                        <div style={{
                            flex: 1,
                            background: 'var(--hr-bg-card)',
                            padding: '14px',
                            borderRadius: '12px',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--hr-accent-gold)' }}>
                                {selectedHabitData.completedDates?.length || 0}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--hr-text-secondary)' }}>
                                Total Done
                            </div>
                        </div>
                    </div>
                )}

                {/* Calendar */}
                <div style={{
                    background: 'var(--hr-bg-card)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                }}>
                    {/* Month Navigator */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                    }}>
                        <button
                            onClick={prevMonth}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'var(--hr-bg-elevated)',
                                color: 'var(--hr-primary-light)',
                                cursor: 'pointer',
                                fontSize: '18px',
                            }}
                        >
                            ←
                        </button>
                        <h2 style={{ margin: 0, color: 'var(--hr-text-primary)', fontSize: '18px' }}>
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h2>
                        <button
                            onClick={nextMonth}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'var(--hr-bg-elevated)',
                                color: 'var(--hr-primary-light)',
                                cursor: 'pointer',
                                fontSize: '18px',
                            }}
                        >
                            →
                        </button>
                    </div>

                    {/* Day Names */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '4px',
                        marginBottom: '8px',
                    }}>
                        {dayNames.map((day) => (
                            <div
                                key={day}
                                style={{
                                    textAlign: 'center',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: 'var(--hr-text-secondary)',
                                    padding: '8px 0',
                                }}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '4px',
                    }}>
                        {/* Empty cells for days before the 1st */}
                        {Array.from({ length: startingDay }).map((_, index) => (
                            <div key={`empty-${index}`} style={{ padding: '8px 0' }} />
                        ))}

                        {/* Days of the month */}
                        {Array.from({ length: daysInMonth }).map((_, index) => {
                            const day = index + 1;
                            const completed = isCompleted(day);
                            const isToday = new Date().getDate() === day &&
                                new Date().getMonth() === currentMonth.getMonth() &&
                                new Date().getFullYear() === currentMonth.getFullYear();

                            return (
                                <div
                                    key={day}
                                    style={{
                                        aspectRatio: '1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '10px',
                                        fontSize: '14px',
                                        fontWeight: completed ? 'bold' : 'normal',
                                        background: completed
                                            ? 'var(--hr-gradient-primary)'
                                            : isToday
                                                ? 'var(--hr-bg-elevated)'
                                                : 'transparent',
                                        color: completed
                                            ? 'white'
                                            : isToday
                                                ? 'var(--hr-primary-light)'
                                                : 'var(--hr-text-primary)',
                                        cursor: 'pointer',
                                        border: isToday ? '2px solid var(--hr-primary)' : 'none',
                                    }}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '24px',
                        marginTop: '20px',
                        paddingTop: '16px',
                        borderTop: '1px solid rgba(139, 92, 246, 0.1)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '4px',
                                background: 'var(--hr-gradient-primary)',
                            }} />
                            <span style={{ fontSize: '12px', color: 'var(--hr-text-secondary)' }}>
                                Completed
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '4px',
                                border: '2px solid var(--hr-primary)',
                                background: 'transparent',
                            }} />
                            <span style={{ fontSize: '12px', color: 'var(--hr-text-secondary)' }}>
                                Today
                            </span>
                        </div>
                    </div>
                </div>

                {/* Completion Summary */}
                <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    background: 'var(--hr-bg-card)',
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                }}>
                    <h3 style={{ margin: '0 0 16px 0', color: 'var(--hr-text-primary)', fontSize: '16px' }}>
                        📊 Monthly Summary
                    </h3>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            position: 'relative',
                        }}>
                            <svg width="80" height="80" viewBox="0 0 80 80">
                                <circle
                                    cx="40"
                                    cy="40"
                                    r="35"
                                    fill="none"
                                    stroke="var(--hr-bg-elevated)"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="40"
                                    cy="40"
                                    r="35"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="8"
                                    strokeDasharray={`${getCompletionRate() * 2.2} 220`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 40 40)"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#8B5CF6" />
                                        <stop offset="100%" stopColor="#7C3AED" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: 'var(--hr-text-primary)',
                            }}>
                                {getCompletionRate()}%
                            </div>
                        </div>
                        <div>
                            <p style={{ margin: '0 0 8px 0', color: 'var(--hr-text-primary)', fontSize: '14px' }}>
                                {getCompletionRate() >= 80
                                    ? '🎉 Amazing month!'
                                    : getCompletionRate() >= 50
                                        ? '💪 Good progress!'
                                        : '🚀 Keep going!'}
                            </p>
                            <p style={{ margin: 0, color: 'var(--hr-text-secondary)', fontSize: '13px' }}>
                                {getCompletionRate()}% completion rate for {monthNames[currentMonth.getMonth()]}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
};
