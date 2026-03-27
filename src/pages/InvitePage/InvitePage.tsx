import { useState, useEffect } from 'react';
import { Page } from '@/components/Page.tsx';

interface Invite {
    id: number;
    username: string;
    invitedAt: string;
    status: 'pending' | 'accepted';
}

interface PremiumTemplate {
    id: number;
    name: string;
    description: string;
    emoji: string;
    requiredInvites: number;
    unlocked: boolean;
}

export const InvitePage = () => {
    const [invites, setInvites] = useState<Invite[]>([]);
    const [templates, setTemplates] = useState<PremiumTemplate[]>([]);
    const [newInviteUsername, setNewInviteUsername] = useState('');
    const [showShareLink, setShowShareLink] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const storedInvites = JSON.parse(localStorage.getItem('invites') || '[]');
        const storedTemplates = JSON.parse(localStorage.getItem('premiumTemplates') || '[]');

        setInvites(storedInvites);

        // Initialize default templates if none exist
        if (storedTemplates.length === 0) {
            const defaultTemplates: PremiumTemplate[] = [
                {
                    id: 1,
                    name: 'Morning Routine',
                    description: 'Complete your morning routine every day',
                    emoji: '🌅',
                    requiredInvites: 3,
                    unlocked: false,
                },
                {
                    id: 2,
                    name: 'Fitness Challenge',
                    description: '30-day fitness challenge template',
                    emoji: '💪',
                    requiredInvites: 3,
                    unlocked: false,
                },
                {
                    id: 3,
                    name: 'Reading Habit',
                    description: 'Read for 30 minutes daily',
                    emoji: '📚',
                    requiredInvites: 3,
                    unlocked: false,
                },
                {
                    id: 4,
                    name: 'Meditation',
                    description: 'Daily meditation practice',
                    emoji: '🧘',
                    requiredInvites: 3,
                    unlocked: false,
                },
                {
                    id: 5,
                    name: 'Water Intake',
                    description: 'Drink 8 glasses of water daily',
                    emoji: '💧',
                    requiredInvites: 3,
                    unlocked: false,
                },
                {
                    id: 6,
                    name: 'Sleep Schedule',
                    description: 'Maintain a consistent sleep schedule',
                    emoji: '😴',
                    requiredInvites: 3,
                    unlocked: false,
                },
            ];
            localStorage.setItem('premiumTemplates', JSON.stringify(defaultTemplates));
            setTemplates(defaultTemplates);
        } else {
            setTemplates(storedTemplates);
        }
    };

    const generateInviteLink = () => {
        const link = `https://t.me/HabitRoastBot?start=invite_${Date.now()}`;
        return link;
    };

    const copyInviteLink = () => {
        const link = generateInviteLink();
        navigator.clipboard.writeText(link);
        alert('Invite link copied to clipboard! 📋');
    };

    const shareInviteLink = () => {
        const link = generateInviteLink();
        const text = `🔥 Join me on HabitRoast! Get roasted into building better habits! ${link}`;

        // Try to use Telegram's share functionality
        // @ts-ignore - Telegram WebApp is injected globally
        const tg = window.Telegram?.WebApp;
        if (tg && typeof (tg as any).openTelegramLink === 'function') {
            (tg as any).openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`);
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(text);
            alert('Invite message copied to clipboard! 📋');
        }
    };

    const addInvite = () => {
        if (newInviteUsername.trim()) {
            const newInvite: Invite = {
                id: Date.now(),
                username: newInviteUsername.trim(),
                invitedAt: new Date().toISOString(),
                status: 'pending',
            };

            const updatedInvites = [...invites, newInvite];
            localStorage.setItem('invites', JSON.stringify(updatedInvites));
            setInvites(updatedInvites);
            setNewInviteUsername('');

            // Check if any templates should be unlocked
            checkTemplateUnlocks(updatedInvites);
        }
    };

    const checkTemplateUnlocks = (currentInvites: Invite[]) => {
        const acceptedInvites = currentInvites.filter((invite) => invite.status === 'accepted').length;

        const updatedTemplates = templates.map((template) => {
            if (!template.unlocked && acceptedInvites >= template.requiredInvites) {
                return { ...template, unlocked: true };
            }
            return template;
        });

        localStorage.setItem('premiumTemplates', JSON.stringify(updatedTemplates));
        setTemplates(updatedTemplates);
    };

    const simulateAcceptInvite = (inviteId: number) => {
        const updatedInvites = invites.map((invite) =>
            invite.id === inviteId ? { ...invite, status: 'accepted' as const } : invite
        );
        localStorage.setItem('invites', JSON.stringify(updatedInvites));
        setInvites(updatedInvites);
        checkTemplateUnlocks(updatedInvites);
    };

    const getAcceptedInvitesCount = () => {
        return invites.filter((invite) => invite.status === 'accepted').length;
    };

    const getPendingInvitesCount = () => {
        return invites.filter((invite) => invite.status === 'pending').length;
    };

    const getUnlockedTemplatesCount = () => {
        return templates.filter((template) => template.unlocked).length;
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
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>🎁 Invite to Unlock</h1>
                    <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                        Invite friends to unlock premium habit templates! 🚀
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
                            {getAcceptedInvitesCount()}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                            Accepted
                        </div>
                    </div>
                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '12px',
                        borderRadius: '10px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--tg-theme-button-color, #FF6B35)' }}>
                            {getPendingInvitesCount()}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                            Pending
                        </div>
                    </div>
                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '12px',
                        borderRadius: '10px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--tg-theme-button-color, #FF6B35)' }}>
                            {getUnlockedTemplatesCount()}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                            Unlocked
                        </div>
                    </div>
                </div>

                {/* Share Invite Link */}
                <div style={{
                    background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>📤 Share Invite Link</h3>
                    <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                        Share this link with friends to unlock premium templates!
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={copyInviteLink}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'var(--tg-theme-button-color, #FF6B35)',
                                color: 'var(--tg-theme-button-text-color, white)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold',
                            }}
                        >
                            📋 Copy Link
                        </button>
                        <button
                            onClick={shareInviteLink}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '8px',
                                border: '2px solid var(--tg-theme-button-color, #FF6B35)',
                                background: 'transparent',
                                color: 'var(--tg-theme-button-color, #FF6B35)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold',
                            }}
                        >
                            📤 Share
                        </button>
                    </div>
                </div>

                {/* Add Invite */}
                <div style={{
                    background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>➕ Add Invite</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={newInviteUsername}
                            onChange={(e) => setNewInviteUsername(e.target.value)}
                            placeholder="Friend's username"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInvite())}
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
                            onClick={addInvite}
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
                </div>

                {/* Invites List */}
                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>👥 Invites</h3>
                    {invites.length === 0 ? (
                        <div style={{
                            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                            padding: '20px',
                            borderRadius: '12px',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📭</div>
                            <h4 style={{ margin: '0 0 10px 0' }}>No invites yet</h4>
                            <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                                Invite friends to unlock premium templates!
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '8px' }}>
                            {invites.map((invite) => (
                                <div
                                    key={invite.id}
                                    style={{
                                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                            @{invite.username}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                            {new Date(invite.invitedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {invite.status === 'pending' ? (
                                            <button
                                                onClick={() => simulateAcceptInvite(invite.id)}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    background: 'var(--tg-theme-button-color, #FF6B35)',
                                                    color: 'var(--tg-theme-button-text-color, white)',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                Simulate Accept
                                            </button>
                                        ) : (
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                background: '#4CAF50',
                                                color: 'white',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                            }}>
                                                ✓ Accepted
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Premium Templates */}
                <div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>🎁 Premium Templates</h3>
                    <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                        Unlock premium habit templates by inviting friends!
                    </p>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                style={{
                                    background: template.unlocked
                                        ? 'var(--tg-theme-secondary-bg-color, #f0f0f0)'
                                        : 'var(--tg-theme-bg-color, white)',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: template.unlocked
                                        ? '2px solid #4CAF50'
                                        : '1px solid var(--tg-theme-hint-color, #ddd)',
                                    opacity: template.unlocked ? 1 : 0.7,
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '24px' }}>{template.emoji}</span>
                                        <div>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>
                                                {template.name}
                                            </h4>
                                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                                {template.description}
                                            </p>
                                        </div>
                                    </div>
                                    {template.unlocked ? (
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            background: '#4CAF50',
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                        }}>
                                            ✓ Unlocked
                                        </span>
                                    ) : (
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            background: 'var(--tg-theme-hint-color, #ccc)',
                                            color: 'var(--tg-theme-text-color, #1A1A1A)',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                        }}>
                                            🔒 {template.requiredInvites} invites
                                        </span>
                                    )}
                                </div>
                                {!template.unlocked && (
                                    <div style={{
                                        marginTop: '8px',
                                        background: 'var(--tg-theme-bg-color, white)',
                                        borderRadius: '6px',
                                        height: '6px',
                                        overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            background: 'var(--tg-theme-button-color, #FF6B35)',
                                            height: '100%',
                                            width: `${(getAcceptedInvitesCount() / template.requiredInvites) * 100}%`,
                                            borderRadius: '6px',
                                        }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
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
                        <li>Share your invite link with friends</li>
                        <li>When they join, you get credit</li>
                        <li>3 accepted invites unlock premium templates</li>
                        <li>Creates a viral loop for growth!</li>
                    </ul>
                </div>
            </div>
        </Page>
    );
};
