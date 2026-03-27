import { useState, useEffect } from 'react';

interface StreakSavior {
    id: number;
    habitId: number;
    habitName: string;
    friendUsername: string;
    savedAt: string;
    weekNumber: number;
}

interface Habit {
    id: number;
    name: string;
    streak: number;
    lastCompleted: string | null;
    completedDates: string[];
    accountabilityCircle: string[];
}

export const StreakSavior = () => {
    const [saviors, setSaviors] = useState<StreakSavior[]>([]);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
    const [selectedFriend, setSelectedFriend] = useState<string>('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const storedSaviors = JSON.parse(localStorage.getItem('streakSaviors') || '[]');
        const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]');
        setSaviors(storedSaviors);
        setHabits(storedHabits);
    };

    const getCurrentWeekNumber = (): number => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now.getTime() - start.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    };

    const canSaveStreak = (habitId: number, friendUsername: string): boolean => {
        const currentWeek = getCurrentWeekNumber();
        const existingSavior = saviors.find(
            (s) =>
                s.habitId === habitId &&
                s.friendUsername === friendUsername &&
                s.weekNumber === currentWeek
        );
        return !existingSavior;
    };

    const saveStreak = () => {
        if (selectedHabit && selectedFriend) {
            const habit = habits.find((h) => h.id === selectedHabit);
            if (habit && canSaveStreak(selectedHabit, selectedFriend)) {
                const newSavior: StreakSavior = {
                    id: Date.now(),
                    habitId: selectedHabit,
                    habitName: habit.name,
                    friendUsername: selectedFriend,
                    savedAt: new Date().toISOString(),
                    weekNumber: getCurrentWeekNumber(),
                };

                const updatedSaviors = [...saviors, newSavior];
                localStorage.setItem('streakSaviors', JSON.stringify(updatedSaviors));
                setSaviors(updatedSaviors);

                // Update habit streak
                const updatedHabits = habits.map((h) => {
                    if (h.id === selectedHabit) {
                        const today = new Date().toISOString().split('T')[0];
                        return {
                            ...h,
                            streak: h.streak + 1,
                            lastCompleted: new Date().toISOString(),
                            completedDates: [...(h.completedDates || []), today],
                        };
                    }
                    return h;
                });
                localStorage.setItem('habits', JSON.stringify(updatedHabits));
                setHabits(updatedHabits);

                setSelectedHabit(null);
                setSelectedFriend('');
                alert(`🎉 ${selectedFriend} saved your "${habit.name}" streak!`);
            }
        }
    };

    const getAvailableFriends = (habitId: number): string[] => {
        const habit = habits.find((h) => h.id === habitId);
        if (!habit) return [];

        const currentWeek = getCurrentWeekNumber();
        const usedFriends = saviors
            .filter((s) => s.habitId === habitId && s.weekNumber === currentWeek)
            .map((s) => s.friendUsername);

        return habit.accountabilityCircle.filter((friend) => !usedFriends.includes(friend));
    };

    const getSaviorHistory = (habitId: number): StreakSavior[] => {
        return saviors.filter((s) => s.habitId === habitId);
    };

    return (
        <div style={{
            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
            padding: '16px',
            borderRadius: '12px',
        }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>🦸 Streak Savior</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                Friends can save your streak once per week!
            </p>

            {/* Save Streak Form */}
            <div style={{
                background: 'var(--tg-theme-bg-color, white)',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '12px',
            }}>
                <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                }}>
                    Select Habit
                </label>
                <select
                    value={selectedHabit || ''}
                    onChange={(e) => setSelectedHabit(parseInt(e.target.value))}
                    style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid var(--tg-theme-hint-color, #ddd)',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        background: 'var(--tg-theme-bg-color, white)',
                        color: 'var(--tg-theme-text-color, #1A1A1A)',
                        marginBottom: '8px',
                    }}
                >
                    <option value="">Select a habit...</option>
                    {habits.map((habit) => (
                        <option key={habit.id} value={habit.id}>
                            {habit.name}
                        </option>
                    ))}
                </select>

                {selectedHabit && (
                    <>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}>
                            Select Friend
                        </label>
                        <select
                            value={selectedFriend}
                            onChange={(e) => setSelectedFriend(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid var(--tg-theme-hint-color, #ddd)',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                                background: 'var(--tg-theme-bg-color, white)',
                                color: 'var(--tg-theme-text-color, #1A1A1A)',
                                marginBottom: '8px',
                            }}
                        >
                            <option value="">Select a friend...</option>
                            {getAvailableFriends(selectedHabit).map((friend) => (
                                <option key={friend} value={friend}>
                                    @{friend}
                                </option>
                            ))}
                        </select>

                        {getAvailableFriends(selectedHabit).length === 0 && (
                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#ff4444' }}>
                                No friends available this week
                            </p>
                        )}

                        <button
                            onClick={saveStreak}
                            disabled={!selectedFriend || getAvailableFriends(selectedHabit).length === 0}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: 'none',
                                background: !selectedFriend || getAvailableFriends(selectedHabit).length === 0
                                    ? 'var(--tg-theme-hint-color, #ccc)'
                                    : 'var(--tg-theme-button-color, #FF6B35)',
                                color: 'var(--tg-theme-button-text-color, white)',
                                cursor: !selectedFriend || getAvailableFriends(selectedHabit).length === 0 ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold',
                            }}
                        >
                            🦸 Save Streak
                        </button>
                    </>
                )}
            </div>

            {/* Savior History */}
            {saviors.length > 0 && (
                <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Recent Saves</h4>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        {saviors.slice(-5).reverse().map((savior) => (
                            <div
                                key={savior.id}
                                style={{
                                    background: 'var(--tg-theme-bg-color, white)',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                }}
                            >
                                <div style={{ fontWeight: 'bold' }}>
                                    🦸 @{savior.friendUsername}
                                </div>
                                <div style={{ color: 'var(--tg-theme-hint-color, #666)' }}>
                                    Saved "{savior.habitName}" on {new Date(savior.savedAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Info */}
            <div style={{
                marginTop: '12px',
                padding: '8px',
                background: 'var(--tg-theme-bg-color, white)',
                borderRadius: '6px',
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color, #666)',
            }}>
                <p style={{ margin: '0 0 4px 0' }}>
                    • Each friend can save once per week
                </p>
                <p style={{ margin: '0 0 4px 0' }}>
                    • Creates social bonding
                </p>
                <p style={{ margin: 0 }}>
                    • Your streak continues!
                </p>
            </div>
        </div>
    );
};
