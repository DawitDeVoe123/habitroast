import { useState, useEffect } from 'react';
import { Page } from '@/components/Page.tsx';

interface Challenge {
    id: string;
    title: string;
    description: string;
    points: number;
    emoji: string;
    completed: boolean;
    category: 'physical' | 'mental' | 'social' | 'creative' | 'funny';
}

const challenges: Omit<Challenge, 'completed'>[] = [
    // Physical Challenges
    { id: 'p1', title: '100 Jump Jacks', description: 'Do 100 jumping jacks! Feel the burn!', points: 50, emoji: '🏃', category: 'physical' },
    { id: 'p2', title: '30-Second Abs', description: 'Hold a plank for 30 seconds. You got this!', points: 40, emoji: '💪', category: 'physical' },
    { id: 'p3', title: '10 Push-Ups', description: 'Drop and give me 10! Or 5. We won\'t tell.', points: 35, emoji: '🙆', category: 'physical' },
    { id: 'p4', title: 'Dance Party', description: 'Dance to one full song. No judgment!', points: 45, emoji: '💃', category: 'physical' },
    { id: 'p5', title: 'Walk 1000 Steps', description: 'Take a 1000 step walk. Nature is healing!', points: 30, emoji: '🚶', category: 'physical' },
    { id: 'p6', title: 'Stretch Hour', description: 'Stretch for 5 minutes. Be flexible!', points: 25, emoji: '🧘', category: 'physical' },

    // Mental Challenges
    { id: 'm1', title: 'Brain Teaser', description: 'Solve a riddle. Hint: Think outside the box!', points: 30, emoji: '🧩', category: 'mental' },
    { id: 'm2', title: 'Learn a Fact', description: 'Learn one new interesting fact today.', points: 20, emoji: '🧠', category: 'mental' },
    { id: 'm3', title: 'Meditation', description: 'Meditate for 2 minutes. Clear your mind!', points: 25, emoji: '🧘‍♂️', category: 'mental' },
    { id: 'm4', title: 'Journal Entry', description: 'Write about what you\'re grateful for.', points: 35, emoji: '📝', category: 'mental' },
    { id: 'm5', title: 'Memory Lane', description: 'Remember and write down 3 happy memories.', points: 30, emoji: '📓', category: 'mental' },
    { id: 'm6', title: 'Goal Setter', description: 'Write 3 goals you want to achieve this week.', points: 25, emoji: '🎯', category: 'mental' },

    // Social Challenges
    { id: 's1', title: 'Send a Text', description: 'Text someone you love. Make their day!', points: 40, emoji: '💕', category: 'social' },
    { id: 's2', title: 'Compliment Quest', description: 'Give 3 genuine compliments today.', points: 45, emoji: '✨', category: 'social' },
    { id: 's3', title: 'Call Grandma', description: 'Call someone who matters. Time is precious!', points: 50, emoji: '📞', category: 'social' },
    { id: 's4', title: 'High Five', description: 'Give someone a high five! Spread the joy!', points: 20, emoji: '🙌', category: 'social' },
    { id: 's5', title: 'Apology', description: 'Apologize for something trivial. It\'s freeing!', points: 30, emoji: '🙇', category: 'social' },
    { id: 's6', title: 'Share the Love', description: 'Share this app with a friend!', points: 35, emoji: '📤', category: 'social' },

    // Creative Challenges
    { id: 'c1', title: 'Draw Something', description: 'Draw something. Even stick figures count!', points: 30, emoji: '🎨', category: 'creative' },
    { id: 'c2', title: 'Mini Poem', description: 'Write a haiku. 5-7-5. Be poetic!', points: 25, emoji: '📜', category: 'creative' },
    { id: 'c3', title: 'Photo Challenge', description: 'Take a photo of something beautiful.', points: 25, emoji: '📸', category: 'creative' },
    { id: 'c4', title: 'Meme Maker', description: 'Create a funny meme. Roast yourself!', points: 35, emoji: '😂', category: 'creative' },
    { id: 'c5', title: 'Song Remixer', description: 'Rewrite lyrics to a song. Be creative!', points: 40, emoji: '🎵', category: 'creative' },
    { id: 'c6', title: 'Caption This', description: 'Come up with a funny caption for your day.', points: 20, emoji: '💬', category: 'creative' },

    // Funny Challenges
    { id: 'f1', title: 'Roast Yourself', description: 'Write a funny self-roast. Own it!', points: 30, emoji: '🔥', category: 'funny' },
    { id: 'f2', title: 'Silly Dance', description: 'Do the silliest dance you can imagine.', points: 35, emoji: '🕺', category: 'funny' },
    { id: 'f3', title: 'Tell a Joke', description: 'Learn and tell a joke. Make someone laugh!', points: 25, emoji: '🤡', category: 'funny' },
    { id: 'f4', title: 'Selfie Time', description: 'Take the most ridiculous selfie possible.', points: 30, emoji: '🤳', category: 'funny' },
    { id: 'f5', title: 'Accent Mode', description: 'Speak in a funny accent for 1 minute.', points: 35, emoji: '🎭', category: 'funny' },
    { id: 'f6', title: 'Impression', description: 'Do an impression of someone. Be brave!', points: 40, emoji: '🎤', category: 'funny' },
    { id: 'f7', title: 'Tongue Twister', description: 'Say "Peter Piper" 10 times fast. I dare you!', points: 20, emoji: '👅', category: 'funny' },
    { id: 'f8', title: 'Goofy Face', description: 'Make the funniest face and save it!', points: 25, emoji: '😜', category: 'funny' },
];

const categoryInfo: Record<string, { label: string; emoji: string; color: string }> = {
    physical: { label: 'Physical', emoji: '🏃', color: '#10B981' },
    mental: { label: 'Mental', emoji: '🧠', color: '#8B5CF6' },
    social: { label: 'Social', emoji: '💕', color: '#F472B6' },
    creative: { label: 'Creative', emoji: '🎨', color: '#F59E0B' },
    funny: { label: 'Funny', emoji: '😂', color: '#EF4444' },
};

const defaultCategories = ['physical', 'mental', 'social', 'creative', 'funny'] as const;

export const ChallengesPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = () => {
        const stored = localStorage.getItem('completedChallenges');
        if (stored) {
            setCompletedChallenges(JSON.parse(stored));
        }
    };

    const saveProgress = () => {
        localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
    };

    const handleComplete = (challengeId: string, points: number) => {
        if (!completedChallenges.includes(challengeId)) {
            setCompletedChallenges([...completedChallenges, challengeId]);
            saveProgress();
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
        }
    };

    const getFilteredChallenges = () => {
        if (!selectedCategory) return challenges;
        return challenges.filter(c => c.category === selectedCategory);
    };

    const getCategoryStats = (category: string) => {
        const categoryChallenges = challenges.filter(c => c.category === category);
        const completed = categoryChallenges.filter(c => completedChallenges.includes(c.id)).length;
        const totalPoints = categoryChallenges.filter(c => completedChallenges.includes(c.id)).reduce((sum, c) => sum + c.points, 0);
        return { completed, total: categoryChallenges.length, totalPoints };
    };

    const getTotalStats = () => {
        const completed = completedChallenges.length;
        const totalPoints = challenges.filter(c => completedChallenges.includes(c.id)).reduce((sum, c) => sum + c.points, 0);
        return { completed, total: challenges.length, totalPoints };
    };

    const totalStats = getTotalStats();

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
                {/* Confetti Effect */}
                {showConfetti && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        pointerEvents: 'none',
                        zIndex: 1000,
                        overflow: 'hidden',
                    }}>
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    left: `${Math.random() * 100}%`,
                                    top: '-20px',
                                    fontSize: `${Math.random() * 20 + 10}px`,
                                    animation: `confetti-${i} 2s ease-out forwards`,
                                    animationDelay: `${Math.random() * 0.5}s`,
                                }}
                            >
                                🎉
                            </div>
                        ))}
                    </div>
                )}

                {/* Header */}
                <header style={{ marginBottom: '24px' }}>
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '26px', color: 'var(--hr-text-primary)' }}>
                        🎯 Daily Challenges
                    </h1>
                    <p style={{ margin: 0, color: 'var(--hr-text-secondary)', fontSize: '14px' }}>
                        Fun challenges to boost your mood! ✨
                    </p>
                </header>

                {/* Overall Stats */}
                <div style={{
                    background: 'var(--hr-gradient-primary)',
                    padding: '20px',
                    borderRadius: '16px',
                    marginBottom: '24px',
                    color: 'white',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                                {totalStats.completed}/{totalStats.total}
                            </div>
                            <div style={{ fontSize: '14px', opacity: 0.9 }}>
                                Challenges Completed
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                                {totalStats.totalPoints}
                            </div>
                            <div style={{ fontSize: '14px', opacity: 0.9 }}>
                                Points Earned
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '20px',
                    overflowX: 'auto',
                    paddingBottom: '4px',
                }}>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '20px',
                            border: 'none',
                            background: !selectedCategory ? 'var(--hr-primary)' : 'var(--hr-bg-card)',
                            color: !selectedCategory ? 'white' : 'var(--hr-text-secondary)',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        All
                    </button>
                    {defaultCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '10px 16px',
                                borderRadius: '20px',
                                border: 'none',
                                background: selectedCategory === cat ? categoryInfo[cat].color : 'var(--hr-bg-card)',
                                color: selectedCategory === cat ? 'white' : 'var(--hr-text-secondary)',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {categoryInfo[cat].emoji} {categoryInfo[cat].label}
                        </button>
                    ))}
                </div>

                {/* Challenge List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {getFilteredChallenges().map((challenge) => {
                        const isCompleted = completedChallenges.includes(challenge.id);
                        const catColor = categoryInfo[challenge.category].color;
                        const catStats = getCategoryStats(challenge.category);

                        return (
                            <div
                                key={challenge.id}
                                style={{
                                    background: 'var(--hr-bg-card)',
                                    padding: '16px',
                                    borderRadius: '14px',
                                    border: `1px solid ${isCompleted ? 'rgba(16, 185, 129, 0.4)' : 'rgba(139, 92, 246, 0.2)'}`,
                                    opacity: isCompleted ? 0.7 : 1,
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{
                                        fontSize: '28px',
                                        lineHeight: 1,
                                    }}>
                                        {challenge.emoji}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '4px',
                                        }}>
                                            <h3 style={{
                                                margin: 0,
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                color: 'var(--hr-text-primary)',
                                                textDecoration: isCompleted ? 'line-through' : 'none',
                                            }}>
                                                {challenge.title}
                                            </h3>
                                            <span style={{
                                                background: catColor,
                                                padding: '4px 10px',
                                                borderRadius: '10px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: 'white',
                                            }}>
                                                +{challenge.points}
                                            </span>
                                        </div>
                                        <p style={{
                                            margin: '0 0 10px 0',
                                            fontSize: '13px',
                                            color: 'var(--hr-text-secondary)',
                                        }}>
                                            {challenge.description}
                                        </p>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                            <span style={{
                                                fontSize: '11px',
                                                color: catColor,
                                                fontWeight: '600',
                                            }}>
                                                {categoryInfo[challenge.category].emoji} {categoryInfo[challenge.category].label}
                                            </span>
                                            <button
                                                onClick={() => handleComplete(challenge.id, challenge.points)}
                                                disabled={isCompleted}
                                                style={{
                                                    padding: '8px 20px',
                                                    borderRadius: '20px',
                                                    border: 'none',
                                                    background: isCompleted
                                                        ? 'var(--hr-success)'
                                                        : 'var(--hr-primary)',
                                                    color: 'white',
                                                    cursor: isCompleted ? 'default' : 'pointer',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    opacity: isCompleted ? 0.8 : 1,
                                                }}
                                            >
                                                {isCompleted ? '✓ Done!' : 'Complete'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Motivational Footer */}
                <div style={{
                    marginTop: '24px',
                    padding: '20px',
                    background: 'var(--hr-bg-card)',
                    borderRadius: '14px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '36px', marginBottom: '12px' }}>
                        {totalStats.completed >= 20 ? '🏆' : totalStats.completed >= 10 ? '🌟' : totalStats.completed >= 5 ? '💪' : '🚀'}
                    </div>
                    <p style={{ margin: 0, color: 'var(--hr-text-primary)', fontSize: '15px', fontWeight: '600' }}>
                        {totalStats.completed >= 20
                            ? "You're a CHALLENGE MASTER! 👑"
                            : totalStats.completed >= 10
                                ? "Amazing progress! Keep crushing it! 🔥"
                                : totalStats.completed >= 5
                                    ? "You're on fire! 🎉"
                                    : "Every challenge is a step to greatness! ✨"}
                    </p>
                </div>
            </div>
        </Page>
    );
};