import { useState, useRef } from 'react';

interface StreakCardProps {
    habitName: string;
    streak: number;
    roastLevel: 'mild' | 'medium' | 'savage';
    username?: string;
}

export const StreakCard = ({ habitName, streak, roastLevel, username }: StreakCardProps) => {
    const [isSharing, setIsSharing] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const getRoastEmoji = () => {
        switch (roastLevel) {
            case 'mild': return '😊';
            case 'medium': return '😈';
            case 'savage': return '💀';
            default: return '🔥';
        }
    };

    const getStreakMessage = () => {
        if (streak === 0) return "Let's get started! 💪";
        if (streak < 7) return "Building momentum! 🔥";
        if (streak < 14) return "On fire! 🔥🔥";
        if (streak < 30) return "Unstoppable! 🔥🔥🔥";
        return "Legendary! 🏆🔥🔥🔥";
    };

    const getCardColor = () => {
        if (streak >= 30) return 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)'; // Gold
        if (streak >= 14) return 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'; // Purple
        if (streak >= 7) return 'linear-gradient(135deg, #10B981 0%, #059669 100%)'; // Emerald
        return 'linear-gradient(135deg, #0F0A1A 0%, #1A1025 100%)'; // Dark
    };

    const shareToTelegram = async () => {
        setIsSharing(true);

        // Create a canvas to generate the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            setIsSharing(false);
            return;
        }

        // Set canvas size
        canvas.width = 600;
        canvas.height = 400;

        // Draw background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        if (streak >= 30) {
            gradient.addColorStop(0, '#FBBF24');
            gradient.addColorStop(1, '#F59E0B');
        } else if (streak >= 14) {
            gradient.addColorStop(0, '#8B5CF6');
            gradient.addColorStop(1, '#7C3AED');
        } else if (streak >= 7) {
            gradient.addColorStop(0, '#10B981');
            gradient.addColorStop(1, '#059669');
        } else {
            gradient.addColorStop(0, '#0F0A1A');
            gradient.addColorStop(1, '#1A1025');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw decorative elements
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(50, 50, 100, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(canvas.width - 50, canvas.height - 50, 150, 0, Math.PI * 2);
        ctx.fill();

        // Draw text
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw emoji
        ctx.font = '80px Arial';
        ctx.fillText(getRoastEmoji(), canvas.width / 2, 100);

        // Draw habit name
        ctx.font = 'bold 36px Arial';
        ctx.fillText(habitName, canvas.width / 2, 180);

        // Draw streak number
        ctx.font = 'bold 120px Arial';
        ctx.fillText(streak.toString(), canvas.width / 2, 280);

        // Draw "day streak" text
        ctx.font = '24px Arial';
        ctx.fillText('day streak', canvas.width / 2, 340);

        // Draw message
        ctx.font = '20px Arial';
        ctx.fillText(getStreakMessage(), canvas.width / 2, 380);

        // Draw username if provided
        if (username) {
            ctx.font = '16px Arial';
            ctx.fillText(`@${username}`, canvas.width / 2, 420);
        }

        // Convert to blob and share
        canvas.toBlob(async (blob) => {
            if (blob) {
                try {
                    // Try to use Telegram's share functionality
                    // @ts-ignore - Telegram WebApp is injected globally
                    const tg = window.Telegram?.WebApp;

                    if (tg && typeof (tg as any).openTelegramLink === 'function') {
                        // Create a file from the blob
                        const file = new File([blob], 'streak-card.png', { type: 'image/png' });

                        // Create a URL for the file
                        const url = URL.createObjectURL(file);

                        // Open Telegram share with the image
                        (tg as any).openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`🔥 I'm on a ${streak}-day streak for "${habitName}"! ${getStreakMessage()}`)}`);
                    } else {
                        // Fallback: download the image
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `streak-${habitName}-${streak}-days.png`;
                        a.click();
                        URL.revokeObjectURL(url);
                        alert('Streak card downloaded! Share it on Telegram Stories! 📸');
                    }
                } catch (error) {
                    console.error('Error sharing:', error);
                    // Fallback: download the image
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `streak-${habitName}-${streak}-days.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                    alert('Streak card downloaded! Share it on Telegram Stories! 📸');
                }
            }
            setIsSharing(false);
        }, 'image/png');
    };

    return (
        <div
            ref={cardRef}
            style={{
                background: getCardColor(),
                padding: '24px',
                borderRadius: '16px',
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}
        >
            {/* Decorative circles */}
            <div
                style={{
                    position: 'absolute',
                    top: '-50px',
                    left: '-50px',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '-75px',
                    right: '-75px',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                }}
            />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Emoji */}
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                    {getRoastEmoji()}
                </div>

                {/* Habit Name */}
                <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 'bold' }}>
                    {habitName}
                </h2>

                {/* Streak Number */}
                <div style={{ fontSize: '72px', fontWeight: 'bold', lineHeight: 1, margin: '16px 0' }}>
                    {streak}
                </div>

                {/* Day Streak Text */}
                <div style={{ fontSize: '16px', opacity: 0.9, marginBottom: '12px' }}>
                    day streak
                </div>

                {/* Message */}
                <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '16px' }}>
                    {getStreakMessage()}
                </div>

                {/* Username */}
                {username && (
                    <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '16px' }}>
                        @{username}
                    </div>
                )}

                {/* Share Button */}
                <button
                    onClick={shareToTelegram}
                    disabled={isSharing}
                    style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        padding: '12px 24px',
                        borderRadius: '24px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: isSharing ? 'not-allowed' : 'pointer',
                        opacity: isSharing ? 0.7 : 1,
                        transition: 'all 0.2s ease',
                    }}
                >
                    {isSharing ? '📤 Sharing...' : '📤 Share to Telegram Stories'}
                </button>
            </div>
        </div>
    );
};
