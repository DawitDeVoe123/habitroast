import { useState, useEffect } from 'react';
import { Page } from '@/components/Page.tsx';

interface Habit {
    id: number;
    name: string;
    description: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    reminderTime: string;
    roastLevel: 'mild' | 'medium' | 'savage';
    accountabilityCircle: string[];
    createdAt: string;
    streak: number;
    lastCompleted: string | null;
    completedDates: string[];
}

export const HabitsPage = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

    useEffect(() => {
        loadHabits();
    }, []);

    const loadHabits = () => {
        const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]');
        setHabits(storedHabits);
    };

    const markComplete = (habitId: number) => {
        const today = new Date().toISOString().split('T')[0];
        const updatedHabits = habits.map((habit) => {
            if (habit.id === habitId) {
                const alreadyCompletedToday = habit.completedDates?.includes(today);
                if (!alreadyCompletedToday) {
                    const newStreak = habit.streak + 1;
                    return {
                        ...habit,
                        streak: newStreak,
                        lastCompleted: new Date().toISOString(),
                        completedDates: [...(habit.completedDates || []), today],
                    };
                }
            }
            return habit;
        });
        localStorage.setItem('habits', JSON.stringify(updatedHabits));
        setHabits(updatedHabits);
    };

    const deleteHabit = (habitId: number) => {
        const updatedHabits = habits.filter((habit) => habit.id !== habitId);
        localStorage.setItem('habits', JSON.stringify(updatedHabits));
        setHabits(updatedHabits);
        setSelectedHabit(null);
    };

    const getRoastEmoji = (level: string) => {
        switch (level) {
            case 'mild': return '😊';
            case 'medium': return '😈';
            case 'savage': return '💀';
            default: return '🔥';
        }
    };

    const getFrequencyEmoji = (frequency: string) => {
        switch (frequency) {
            case 'daily': return '📅';
            case 'weekly': return '📆';
            case 'monthly': return '🗓️';
            default: return '⏰';
        }
    };

    const isCompletedToday = (habit: Habit) => {
        const today = new Date().toISOString().split('T')[0];
        return habit.completedDates?.includes(today);
    };

    const filteredHabits = habits.filter((habit) => {
        if (filter === 'active') return habit.streak > 0;
        if (filter === 'completed') return isCompletedToday(habit);
        return true;
    });

    const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
    const completedToday = habits.filter((habit) => isCompletedToday(habit)).length;

    if (selectedHabit) {
        return (
            <Page back={true}>
                <div style={{
                    padding: '20px',
                    maxWidth: '400px',
                    margin: '0 auto',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }}>
                    <button
                        onClick={() => setSelectedHabit(null)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--tg-theme-button-color, #FF6B35)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            marginBottom: '20px',
                            padding: '0',
                        }}
                    >
                        ← Back to habits
                    </button>

                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <span style={{ fontSize: '32px' }}>{getRoastEmoji(selectedHabit.roastLevel)}</span>
                            <div>
                                <h2 style={{ margin: '0 0 5px 0' }}>{selectedHabit.name}</h2>
                                <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                                    {getFrequencyEmoji(selectedHabit.frequency)} {selectedHabit.frequency}
                                </p>
                            </div>
                        </div>

                        {selectedHabit.description && (
                            <p style={{ margin: '0 0 15px 0', color: 'var(--tg-theme-text-color, #1A1A1A)' }}>
                                {selectedHabit.description}
                            </p>
                        )}

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px',
                            marginBottom: '15px',
                        }}>
                            <div style={{
                                background: 'var(--tg-theme-bg-color, white)',
                                padding: '12px',
                                borderRadius: '8px',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--tg-theme-button-color, #FF6B35)' }}>
                                    {selectedHabit.streak}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                    Day Streak 🔥
                                </div>
                            </div>
                            <div style={{
                                background: 'var(--tg-theme-bg-color, white)',
                                padding: '12px',
                                borderRadius: '8px',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--tg-theme-button-color, #FF6B35)' }}>
                                    {selectedHabit.completedDates?.length || 0}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                    Total Completions
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                                Reminder: {selectedHabit.reminderTime}
                            </p>
                            <p style={{ margin: 0, fontSize: '14px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                Roast Level: {getRoastEmoji(selectedHabit.roastLevel)} {selectedHabit.roastLevel}
                            </p>
                        </div>

                        {selectedHabit.accountabilityCircle.length > 0 && (
                            <div>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                                    Accountability Circle:
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {selectedHabit.accountabilityCircle.map((friend) => (
                                        <span
                                            key={friend}
                                            style={{
                                                background: 'var(--tg-theme-bg-color, white)',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                            }}
                                        >
                                            @{friend}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gap: '10px' }}>
                        {!isCompletedToday(selectedHabit) && (
                            <button
                                onClick={() => markComplete(selectedHabit.id)}
                                style={{
                                    background: 'var(--tg-theme-button-color, #FF6B35)',
                                    color: 'var(--tg-theme-button-text-color, white)',
                                    border: 'none',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    width: '100%',
                                }}
                            >
                                ✅ Mark Complete for Today
                            </button>
                        )}

                        {isCompletedToday(selectedHabit) && (
                            <div style={{
                                background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                                padding: '16px',
                                borderRadius: '12px',
                                textAlign: 'center',
                                color: 'var(--tg-theme-hint-color, #666)',
                            }}>
                                ✅ Completed today! Great job!
                            </div>
                        )}

                        <button
                            onClick={() => deleteHabit(selectedHabit.id)}
                            style={{
                                background: 'transparent',
                                color: '#ff4444',
                                border: '2px solid #ff4444',
                                padding: '16px',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                width: '100%',
                            }}
                        >
                            🗑️ Delete Habit
                        </button>
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
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>📋 My Habits</h1>
                    <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                        Track your progress and get roasted! 🔥
                    </p>
                </header>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '10px',
                    marginBottom: '20px',
                }}>
                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '12px',
                        borderRadius: '10px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--tg-theme-button-color, #FF6B35)' }}>
                            {habits.length}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                            Total Habits
                        </div>
                    </div>
                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '12px',
                        borderRadius: '10px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--tg-theme-button-color, #FF6B35)' }}>
                            {totalStreak}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                            Total Streak
                        </div>
                    </div>
                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '12px',
                        borderRadius: '10px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--tg-theme-button-color, #FF6B35)' }}>
                            {completedToday}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                            Done Today
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '20px',
                }}>
                    {(['all', 'active', 'completed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '8px',
                                border: filter === f
                                    ? '2px solid var(--tg-theme-button-color, #FF6B35)'
                                    : '1px solid var(--tg-theme-hint-color, #ddd)',
                                background: filter === f
                                    ? 'var(--tg-theme-button-color, #FF6B35)'
                                    : 'transparent',
                                color: filter === f
                                    ? 'var(--tg-theme-button-text-color, white)'
                                    : 'var(--tg-theme-text-color, #1A1A1A)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: filter === f ? 'bold' : 'normal',
                            }}
                        >
                            {f === 'all' && 'All'}
                            {f === 'active' && '🔥 Active'}
                            {f === 'completed' && '✅ Done'}
                        </button>
                    ))}
                </div>

                {/* Habits List */}
                {filteredHabits.length === 0 ? (
                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '40px 20px',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '15px' }}>📭</div>
                        <h3 style={{ margin: '0 0 10px 0' }}>No habits yet</h3>
                        <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)' }}>
                            Create your first habit to start tracking!
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {filteredHabits.map((habit) => (
                            <div
                                key={habit.id}
                                onClick={() => setSelectedHabit(habit)}
                                style={{
                                    background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    border: isCompletedToday(habit)
                                        ? '2px solid #4CAF50'
                                        : '1px solid transparent',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '24px' }}>{getRoastEmoji(habit.roastLevel)}</span>
                                            <h3 style={{ margin: 0, fontSize: '16px' }}>{habit.name}</h3>
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                            <span>{getFrequencyEmoji(habit.frequency)} {habit.frequency}</span>
                                            <span>🔥 {habit.streak} day streak</span>
                                        </div>
                                    </div>
                                    {isCompletedToday(habit) && (
                                        <span style={{
                                            background: '#4CAF50',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                        }}>
                                            ✓ Done
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Page>
    );
};
