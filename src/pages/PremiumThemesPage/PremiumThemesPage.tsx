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
                fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
                {/* Header */}
                <header style={{ marginBottom: '20px' }}>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>🎨 Premium Themes</h1>
                    <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                        Unlock beautiful themes with Telegram Stars ⭐
                    </p>
                </header>

                {/* Current Theme */}
                {getActiveTheme() && (
                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '16px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                    }}>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Current Theme</h3>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}>
                            <span style={{ fontSize: '32px' }}>{getActiveTheme().emoji}</span>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    {getActiveTheme().name}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                    {getActiveTheme().description}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Themes Grid */}
                <div style={{
                    display: 'grid',
                    gap: '16px',
                }}>
                    {themes.map((theme) => (
                        <div
                            key={theme.id}
                            style={{
                                background: theme.unlocked
                                    ? 'var(--tg-theme-secondary-bg-color, #f0f0f0)'
                                    : 'var(--tg-theme-bg-color, white)',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: selectedTheme === theme.id
                                    ? '2px solid var(--tg-theme-button-color, #FF6B35)'
                                    : '1px solid var(--tg-theme-hint-color, #ddd)',
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
                                        top: '8px',
                                        right: '8px',
                                        background: '#4CAF50',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                    }}>
                                        ✓ Unlocked
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div style={{ padding: '16px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '8px',
                                }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>
                                            {theme.name}
                                        </h3>
                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                            {theme.description}
                                        </p>
                                    </div>
                                    {!theme.unlocked && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            background: 'var(--tg-theme-button-color, #FF6B35)',
                                            color: 'var(--tg-theme-button-text-color, white)',
                                            padding: '6px 12px',
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
                                    gap: '8px',
                                    marginBottom: '12px',
                                }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '12px',
                                        background: theme.preview.primary,
                                    }} />
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '12px',
                                        background: theme.preview.secondary,
                                    }} />
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '12px',
                                        background: theme.preview.accent,
                                    }} />
                                </div>

                                {/* Action Button */}
                                {theme.unlocked ? (
                                    <button
                                        onClick={() => applyTheme(theme.id)}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: selectedTheme === theme.id
                                                ? 'var(--tg-theme-button-color, #FF6B35)'
                                                : 'var(--tg-theme-hint-color, #ccc)',
                                            color: selectedTheme === theme.id
                                                ? 'var(--tg-theme-button-text-color, white)'
                                                : 'var(--tg-theme-text-color, #1A1A1A)',
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
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: isPurchasing
                                                ? 'var(--tg-theme-hint-color, #ccc)'
                                                : 'var(--tg-theme-button-color, #FF6B35)',
                                            color: 'var(--tg-theme-button-text-color, white)',
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
                    marginTop: '20px',
                    padding: '16px',
                    background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                    borderRadius: '12px',
                    fontSize: '14px',
                }}>
                    <h4 style={{ margin: '0 0 8px 0' }}>How it works:</h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--tg-theme-hint-color, #666)' }}>
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
