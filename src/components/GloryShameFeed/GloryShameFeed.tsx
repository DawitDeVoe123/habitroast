import { useState, useEffect } from 'react';

interface FeedItem {
    id: number;
    type: 'glory' | 'shame';
    username: string;
    habitName: string;
    timestamp: string;
    streak?: number;
    message: string;
}

interface Habit {
    id: number;
    name: string;
    streak: number;
    completedDates: string[];
    accountabilityCircle: string[];
    roastLevel: 'mild' | 'medium' | 'savage';
}

interface Circle {
    id: number;
    name: string;
    members: { username: string }[];
}

export const GloryShameFeed = () => {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [circles, setCircles] = useState<Circle[]>([]);

    useEffect(() => {
        loadData();
        generateFeed();
    }, []);

    const loadData = () => {
        const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]');
        const storedCircles = JSON.parse(localStorage.getItem('circles') || '[]');
        setHabits(storedHabits);
        setCircles(storedCircles);
    };

    const generateFeed = () => {
        const storedHabits: Habit[] = JSON.parse(localStorage.getItem('habits') || '[]');
        const storedCircles: Circle[] = JSON.parse(localStorage.getItem('circles') || '[]');
        const today = new Date().toISOString().split('T')[0];
        const items: FeedItem[] = [];

        // Generate glory items (completed today)
        storedHabits.forEach((habit) => {
            if (habit.completedDates?.includes(today)) {
                habit.accountabilityCircle.forEach((username) => {
                    items.push({
                        id: Date.now() + Math.random(),
                        type: 'glory',
                        username,
                        habitName: habit.name,
                        timestamp: new Date().toISOString(),
                        streak: habit.streak,
                        message: getGloryMessage(habit.name, habit.streak),
                    });
                });
            }
        });

        // Generate shame items (not completed today)
        storedHabits.forEach((habit) => {
            if (!habit.completedDates?.includes(today) && habit.accountabilityCircle.length > 0) {
                habit.accountabilityCircle.forEach((username) => {
                    items.push({
                        id: Date.now() + Math.random(),
                        type: 'shame',
                        username,
                        habitName: habit.name,
                        timestamp: new Date().toISOString(),
                        streak: habit.streak,
                        message: getShameMessage(habit.name, habit.roastLevel),
                    });
                });
            }
        });

        // Sort by timestamp (newest first)
        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setFeedItems(items.slice(0, 20)); // Keep last 20 items
    };

    const getGloryMessage = (habitName: string, streak: number): string => {
        const messages = [
            `Crushed "${habitName}"! ${streak} day streak! 🔥`,
            `Another day, another win for "${habitName}"! 💪`,
            `"${habitName}" completed! Streak on fire! 🔥`,
            `Nailed "${habitName}"! ${streak} days strong! 💪`,
            `"${habitName}" done! Future self is proud! 🎉`,
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const getShameMessage = (habitName: string, roastLevel: string): string => {
        const messages = {
            mild: [
                `"${habitName}" still pending... gentle nudge! 😊`,
                `Don't forget "${habitName}" today! ⏰`,
                `"${habitName}" waiting for you! 💪`,
            ],
            medium: [
                `"${habitName}" not done yet? Your streak is watching! 😈`,
                `Come on! "${habitName}" won't do itself! 🔥`,
                `"${habitName}" still pending? Step it up! 💪`,
            ],
            savage: [
                `"${habitName}" still not done? Even my grandma does better! 💀`,
                `Seriously? "${habitName}" is still pending? 🔥`,
                `"${habitName}" not completed? Your streak is crying! 😤`,
            ],
        };
        const levelMessages = messages[roastLevel as keyof typeof messages] || messages.medium;
        return levelMessages[Math.floor(Math.random() * levelMessages.length)];
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

    if (feedItems.length === 0) {
        return (
            <div style={{
                background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
            }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📭</div>
                <h3 style={{ margin: '0 0 10px 0' }}>No activity yet</h3>
                <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                    Complete habits or add friends to your circle to see activity here!
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
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>
                📢 Today's Glory/Shame Feed
            </h3>
            <div style={{ display: 'grid', gap: '10px' }}>
                {feedItems.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            background: 'var(--tg-theme-bg-color, white)',
                            padding: '12px',
                            borderRadius: '8px',
                            borderLeft: item.type === 'glory' ? '4px solid #4CAF50' : '4px solid #ff4444',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px' }}>
                                    {item.type === 'glory' ? '✅' : '❌'}
                                </span>
                                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                    @{item.username}
                                </span>
                            </div>
                            <span style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                {formatTime(item.timestamp)}
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--tg-theme-text-color, #1A1A1A)' }}>
                            {item.message}
                        </p>
                        {item.streak !== undefined && item.type === 'glory' && (
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
                                🔥 {item.streak} day streak
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
