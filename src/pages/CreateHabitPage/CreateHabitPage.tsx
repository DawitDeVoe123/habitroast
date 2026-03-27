import { useState } from 'react';
import { Page } from '@/components/Page.tsx';

interface HabitFormData {
    name: string;
    description: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    reminderTime: string;
    roastLevel: 'mild' | 'medium' | 'savage';
    accountabilityCircle: string[];
}

export const CreateHabitPage = () => {
    const [formData, setFormData] = useState<HabitFormData>({
        name: '',
        description: '',
        frequency: 'daily',
        reminderTime: '09:00',
        roastLevel: 'medium',
        accountabilityCircle: [],
    });

    const [newFriend, setNewFriend] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addFriend = () => {
        if (newFriend.trim() && !formData.accountabilityCircle.includes(newFriend.trim())) {
            setFormData((prev) => ({
                ...prev,
                accountabilityCircle: [...prev.accountabilityCircle, newFriend.trim()],
            }));
            setNewFriend('');
        }
    };

    const removeFriend = (friend: string) => {
        setFormData((prev) => ({
            ...prev,
            accountabilityCircle: prev.accountabilityCircle.filter((f) => f !== friend),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Store habit in localStorage for now
        const existingHabits = JSON.parse(localStorage.getItem('habits') || '[]');
        const newHabit = {
            ...formData,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            streak: 0,
            lastCompleted: null,
        };
        localStorage.setItem('habits', JSON.stringify([...existingHabits, newHabit]));

        setIsSubmitting(false);
        setShowSuccess(true);

        // Navigate back after 2 seconds
        setTimeout(() => {
            window.history.back();
        }, 2000);
    };

    if (showSuccess) {
        return (
            <Page back={true}>
                <div style={{
                    padding: '20px',
                    maxWidth: '400px',
                    margin: '0 auto',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    textAlign: 'center',
                    paddingTop: '60px',
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
                    <h2 style={{ marginBottom: '10px' }}>Habit Created!</h2>
                    <p style={{ color: 'var(--tg-theme-hint-color, #666)' }}>
                        Your habit "{formData.name}" has been created. Get ready to be roasted! 🔥
                    </p>
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
                <header style={{
                    marginBottom: '30px',
                }}>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>➕ Create New Habit</h1>
                    <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                        Set up your habit and prepare to be held accountable! 🔥
                    </p>
                </header>

                <form onSubmit={handleSubmit}>
                    {/* Habit Name */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}>
                            Habit Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Morning workout"
                            required
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
                        />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}>
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="What's this habit about?"
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--tg-theme-hint-color, #ddd)',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                resize: 'vertical',
                                background: 'var(--tg-theme-bg-color, white)',
                                color: 'var(--tg-theme-text-color, #1A1A1A)',
                            }}
                        />
                    </div>

                    {/* Frequency */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}>
                            Frequency *
                        </label>
                        <select
                            name="frequency"
                            value={formData.frequency}
                            onChange={handleInputChange}
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
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    {/* Reminder Time */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}>
                            Reminder Time
                        </label>
                        <input
                            type="time"
                            name="reminderTime"
                            value={formData.reminderTime}
                            onChange={handleInputChange}
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
                        />
                    </div>

                    {/* Roast Level */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}>
                            Roast Level 🔥
                        </label>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: '8px',
                        }}>
                            {(['mild', 'medium', 'savage'] as const).map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, roastLevel: level }))}
                                    style={{
                                        padding: '12px 8px',
                                        borderRadius: '8px',
                                        border: formData.roastLevel === level
                                            ? '2px solid var(--tg-theme-button-color, #FF6B35)'
                                            : '1px solid var(--tg-theme-hint-color, #ddd)',
                                        background: formData.roastLevel === level
                                            ? 'var(--tg-theme-button-color, #FF6B35)'
                                            : 'transparent',
                                        color: formData.roastLevel === level
                                            ? 'var(--tg-theme-button-text-color, white)'
                                            : 'var(--tg-theme-text-color, #1A1A1A)',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: formData.roastLevel === level ? 'bold' : 'normal',
                                    }}
                                >
                                    {level === 'mild' && '😊 Mild'}
                                    {level === 'medium' && '😈 Medium'}
                                    {level === 'savage' && '💀 Savage'}
                                </button>
                            ))}
                        </div>
                        <p style={{
                            margin: '8px 0 0 0',
                            fontSize: '12px',
                            color: 'var(--tg-theme-hint-color, #666)',
                        }}>
                            {formData.roastLevel === 'mild' && 'Gentle nudges when you miss'}
                            {formData.roastLevel === 'medium' && 'Playful jabs to keep you going'}
                            {formData.roastLevel === 'savage' && 'Brutally honest roasts 🔥'}
                        </p>
                    </div>

                    {/* Accountability Circle */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}>
                            Accountability Circle 👥
                        </label>
                        <p style={{
                            margin: '0 0 12px 0',
                            fontSize: '12px',
                            color: 'var(--tg-theme-hint-color, #666)',
                        }}>
                            Add friends who will see your progress and roast you!
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            marginBottom: '12px',
                        }}>
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
                                type="button"
                                onClick={addFriend}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'var(--tg-theme-button-color, #FF6B35)',
                                    color: 'var(--tg-theme-button-text-color, white)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                            >
                                Add
                            </button>
                        </div>
                        {formData.accountabilityCircle.length > 0 && (
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px',
                            }}>
                                {formData.accountabilityCircle.map((friend) => (
                                    <div
                                        key={friend}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '6px 12px',
                                            borderRadius: '16px',
                                            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                                            fontSize: '14px',
                                        }}
                                    >
                                        <span>@{friend}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFriend(friend)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '0',
                                                fontSize: '16px',
                                                color: 'var(--tg-theme-hint-color, #666)',
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !formData.name.trim()}
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '12px',
                            border: 'none',
                            background: isSubmitting || !formData.name.trim()
                                ? 'var(--tg-theme-hint-color, #ccc)'
                                : 'var(--tg-theme-button-color, #FF6B35)',
                            color: 'var(--tg-theme-button-text-color, white)',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: isSubmitting || !formData.name.trim() ? 'not-allowed' : 'pointer',
                            marginTop: '10px',
                        }}
                    >
                        {isSubmitting ? 'Creating...' : '🔥 Create Habit'}
                    </button>
                </form>
            </div>
        </Page>
    );
};
