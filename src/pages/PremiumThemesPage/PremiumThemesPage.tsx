import { useState, useEffect } from 'react';
import { Page } from '@/components/Page.tsx';

interface Theme {
    id: number;
    name: string;
    description: string;
    emoji: string;
    price: number;
    unlocked: boolean;
    preview: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
    };
}

export const PremiumThemesPage = () => {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<number | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);

    useEffect(() => {
        loadThemes();
    }, []);

    const loadThemes = () => {
        const storedThemes = JSON.parse(localStorage.getItem('premiumThemes') || '[]');

        if (storedThemes.length === 0) {
            const defaultThemes: Theme[] = [
                {
                    id: 1,
                    name: 'Midnight Ember',
                    description: 'Our signature dark purple theme with ember accents - Free!',
                    emoji: '🌙',
                    price: 0,
                    unlocked: true,
                    preview: {
                        primary: '#8B5CF6',
                        secondary: '#7C3AED',
                        accent: '#EF4444',
                        background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1025 100%)',
                    },
                },
                {
                    id: 2,
                    name: 'Sunset Blaze',
                    description: 'Warm orange and red gradients for fiery motivation',
                    emoji: '🌅',
                    price: 50,
                    unlocked: false,
                    preview: {
                        primary: '#FF6B35',
                        secondary: '#FF8C42',
                        accent: '#FFD700',
                        background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                    },
                },
                {
                    id: 2,
                    name: 'Ocean Deep',
                    description: 'Calming blue tones for focused consistency',
                    emoji: '🌊',
                    price: 50,
                    unlocked: false,
                    preview: {
                        primary: '#0098EA',
                        secondary: '#45B7D1',
                        accent: '#96E6A1',
                        background: 'linear-gradient(135deg, #0098EA 0%, #45B7D1 100%)',
                    },
                },
                {
                    id: 3,
                    name: 'Forest Growth',
                    description: 'Green palette symbolizing growth and progress',
                    emoji: '🌲',
                    price: 50,
                    unlocked: false,
                    preview: {
                        primary: '#4CAF50',
                        secondary: '#81C784',
                        accent: '#AED581',
                        background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
                    },
                },
                {
                    id: 4,
                    name: 'Royal Purple',
                    description: 'Elegant purple theme for premium users',
                    emoji: '👑',
                    price: 100,
                    unlocked: false,
                    preview: {
                        primary: '#9C27B0',
                        secondary: '#BA68C8',
                        accent: '#E1BEE7',
                        background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
                    },
                },
                {
                    id: 5,
                    name: 'Midnight Gold',
                    description: 'Luxurious dark theme with gold accents',
                    emoji: '✨',
                    price: 100,
                    unlocked: false,
                    preview: {
                        primary: '#1A1A1A',
                        secondary: '#2D2D2D',
                        accent: '#FFD700',
                        background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
                    },
                },
                {
                    id: 6,
                    name: 'Cherry Blossom',
                    description: 'Soft pink theme for gentle motivation',
                    emoji: '🌸',
                    price: 75,
                    unlocked: false,
                    preview: {
                        primary: '#E91E63',
                        secondary: '#F48FB1',
                        accent: '#FCE4EC',
                        background: 'linear-gradient(135deg, #E91E63 0%, #F48FB1 100%)',
                    },
                },
            ];
            localStorage.setItem('premiumThemes', JSON.stringify(defaultThemes));
            setThemes(defaultThemes);
        } else {
            setThemes(storedThemes);
        }
    };

    const purchaseTheme = async (themeId: number) => {
        const theme = themes.find(t => t.id === themeId);
        if (!theme || theme.unlocked) return;

        setIsPurchasing(true);

        // Simulate purchase with Telegram Stars
        // In a real app, this would integrate with Telegram's payment API
        await new Promise(resolve => setTimeout(resolve, 1500));

        const updatedThemes = themes.map(t =>
            t.id === themeId ? { ...t, unlocked: true } : t
        );

        localStorage.setItem('premiumThemes', JSON.stringify(updatedThemes));
        setThemes(updatedThemes);
        setSelectedTheme(themeId);
        setIsPurchasing(false);

        alert(`🎉 You've unlocked the "${theme.name}" theme!`);
    };

    const applyTheme = (themeId: number) => {
        const theme = themes.find(t => t.id === themeId);
        if (!theme || !theme.unlocked) return;

        // Apply theme to the app
        localStorage.setItem('activeTheme', JSON.stringify(theme));
        setSelectedTheme(themeId);

        alert(`✨ "${theme.name}" theme applied!`);
    };

    const getActiveTheme = () => {
        const activeTheme = localStorage.getItem('activeTheme');
        return activeTheme ? JSON.parse(activeTheme) : null;
    };

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
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '26px', color: 'var(--hr-text-primary)' }}>🎨 Premium Themes</h1>
                    <p style={{ margin: 0, color: 'var(--hr-text-secondary)', fontSize: '14px' }}>
                        Unlock beautiful themes with Telegram Stars ⭐
                    </p>
                </header>

                {/* Current Theme */}
                {getActiveTheme() && (
                    <div style={{
                        background: 'var(--hr-bg-card)',
                        padding: '18px',
                        borderRadius: '16px',
                        marginBottom: '24px',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--hr-text-secondary)' }}>Current Theme</h3>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                        }}>
                            <span style={{ fontSize: '36px' }}>{getActiveTheme().emoji}</span>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--hr-text-primary)' }}>
                                    {getActiveTheme().name}
                                </div>
                                <div style={{ fontSize: '13px', color: 'var(--hr-text-secondary)' }}>
                                    {getActiveTheme().description}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Themes Grid */}
                <div style={{
                    display: 'grid',
                    gap: '18px',
                }}>
                    {themes.map((theme) => (
                        <div
                            key={theme.id}
                            style={{
                                background: theme.unlocked
                                    ? 'var(--hr-bg-card)'
                                    : 'var(--hr-bg-secondary)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: selectedTheme === theme.id
                                    ? '2px solid var(--hr-primary)'
                                    : '1px solid rgba(139, 92, 246, 0.2)',
                            }}
                        >
                            {/* Preview */}
                            <div style={{
                                height: '100px',
                                background: theme.preview.background,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                            }}>
                                <span style={{ fontSize: '48px' }}>{theme.emoji}</span>
                                {theme.unlocked && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: 'var(--hr-success)',
                                        color: 'white',
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                    }}>
                                        ✓ Unlocked
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div style={{ padding: '18px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '12px',
                                }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: 'var(--hr-text-primary)' }}>
                                            {theme.name}
                                        </h3>
                                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--hr-text-secondary)' }}>
                                            {theme.description}
                                        </p>
                                    </div>
                                    {!theme.unlocked && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            background: 'var(--hr-gradient-gold)',
                                            color: '#0F0A1A',
                                            padding: '6px 14px',
                                            borderRadius: '16px',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                        }}>
                                            ⭐ {theme.price}
                                        </div>
                                    )}
                                </div>

                                {/* Color Preview */}
                                <div style={{
                                    display: 'flex',
                                    gap: '10px',
                                    marginBottom: '14px',
                                }}>
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '14px',
                                        background: theme.preview.primary,
                                        border: '2px solid rgba(255,255,255,0.2)',
                                    }} />
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '14px',
                                        background: theme.preview.secondary,
                                        border: '2px solid rgba(255,255,255,0.2)',
                                    }} />
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '14px',
                                        background: theme.preview.accent,
                                        border: '2px solid rgba(255,255,255,0.2)',
                                    }} />
                                </div>

                                {/* Action Button */}
                                {theme.unlocked ? (
                                    <button
                                        onClick={() => applyTheme(theme.id)}
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            borderRadius: '10px',
                                            border: 'none',
                                            background: selectedTheme === theme.id
                                                ? 'var(--hr-gradient-primary)'
                                                : 'var(--hr-bg-elevated)',
                                            color: selectedTheme === theme.id
                                                ? 'white'
                                                : 'var(--hr-text-primary)',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {selectedTheme === theme.id ? '✓ Applied' : 'Apply Theme'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => purchaseTheme(theme.id)}
                                        disabled={isPurchasing}
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            borderRadius: '10px',
                                            border: 'none',
                                            background: isPurchasing
                                                ? 'var(--hr-bg-elevated)'
                                                : 'var(--hr-gradient-primary)',
                                            color: 'white',
                                            cursor: isPurchasing ? 'not-allowed' : 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {isPurchasing ? 'Purchasing...' : `Unlock for ⭐ ${theme.price}`}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info */}
                <div style={{
                    marginTop: '24px',
                    padding: '18px',
                    background: 'var(--hr-bg-card)',
                    borderRadius: '16px',
                    fontSize: '14px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                }}>
                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--hr-text-primary)' }}>How it works:</h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--hr-text-secondary)', lineHeight: '1.8' }}>
                        <li>Earn Telegram Stars by completing habits</li>
                        <li>Unlock premium themes to customize your app</li>
                        <li>Apply themes to change the look and feel</li>
                        <li>Stand out with unique visual styles!</li>
                    </ul>
                </div>
            </div>
        </Page>
    );
};
