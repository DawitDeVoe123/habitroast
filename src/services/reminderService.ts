// Reminder Service for Telegram Notifications
// This service handles notification permissions and scheduling

interface Reminder {
    habitId: number;
    habitName: string;
    time: string; // HH:MM format
    enabled: boolean;
    lastNotified: string | null;
}

interface Habit {
    id: number;
    name: string;
    reminderTime: string;
    roastLevel: 'mild' | 'medium' | 'savage';
    completedDates: string[];
}

class ReminderService {
    private checkInterval: ReturnType<typeof setInterval> | null = null;
    private readonly STORAGE_KEY = 'habit_reminders';
    private readonly CHECK_INTERVAL_MS = 30000; // Check every 30 seconds for more accuracy
    private audioContext: AudioContext | null = null;
    private notificationSound: HTMLAudioElement | null = null;

    // Initialize the reminder service
    init() {
        this.startChecking();
        this.requestNotificationPermission();
        this.preloadNotificationSound();
    }

    // Preload notification sound
    private preloadNotificationSound() {
        try {
            this.notificationSound = new Audio();
            // Use a base64 encoded notification sound or a reliable URL
            this.notificationSound.volume = 0.7;
        } catch (error) {
            console.log('Could not preload notification sound:', error);
        }
    }

    // Play notification sound
    private playNotificationSound() {
        try {
            // Try Web Audio API first for more reliable sound
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            // Create a pleasant notification tone
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Pleasant ascending tone (like a notification ping)
            oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5

            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);

            // Play a second tone for emphasis
            setTimeout(() => {
                if (this.audioContext && this.audioContext.state !== 'suspended') {
                    const osc2 = this.audioContext.createOscillator();
                    const gain2 = this.audioContext.createGain();
                    osc2.connect(gain2);
                    gain2.connect(this.audioContext.destination);
                    osc2.frequency.setValueAtTime(783.99, this.audioContext.currentTime);
                    gain2.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                    gain2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
                    osc2.start(this.audioContext.currentTime);
                    osc2.stop(this.audioContext.currentTime + 0.4);
                }
            }, 200);

        } catch (error) {
            console.log('Could not play notification sound:', error);
        }
    }

    // Request notification permission from Telegram
    private async requestNotificationPermission() {
        try {
            // @ts-ignore - Telegram WebApp is injected globally
            const tg = window.Telegram?.WebApp;
            if (tg) {
                // Telegram Mini Apps don't have a direct notification API
                // We'll use the browser's Notification API as a fallback
                if ('Notification' in window) {
                    const permission = await Notification.requestPermission();
                    console.log('Notification permission:', permission);
                }
            }
        } catch (error) {
            console.log('Notification permission request failed:', error);
        }
    }

    // Start checking for due reminders
    private startChecking() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }

        this.checkInterval = setInterval(() => {
            this.checkDueReminders();
        }, this.CHECK_INTERVAL_MS);

        // Also check immediately on init
        this.checkDueReminders();
    }

    // Stop checking for reminders
    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    // Check for due reminders and send notifications
    private checkDueReminders() {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const today = now.toISOString().split('T')[0];

        const habits: Habit[] = JSON.parse(localStorage.getItem('habits') || '[]');
        const reminders: Reminder[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');

        habits.forEach((habit) => {
            const reminder = reminders.find((r) => r.habitId === habit.id);

            // Check if reminder is enabled and time matches
            if (reminder && reminder.enabled && reminder.time === currentTime) {
                // Check if already notified today
                if (reminder.lastNotified !== today) {
                    // Check if habit is not completed today
                    const isCompletedToday = habit.completedDates?.includes(today);

                    if (!isCompletedToday) {
                        this.sendNotification(habit);

                        // Update last notified date
                        const updatedReminders = reminders.map((r) =>
                            r.habitId === habit.id ? { ...r, lastNotified: today } : r
                        );
                        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedReminders));
                    }
                }
            }
        });
    }

    // Send a notification for a habit
    private sendNotification(habit: Habit) {
        // Always play sound first
        this.playNotificationSound();

        const roastMessages = {
            mild: [
                `Hey! Don't forget to complete "${habit.name}" today! 😊`,
                `Time for "${habit.name}"! You've got this! 💪`,
                `Gentle reminder: "${habit.name}" is waiting for you! ⏰`,
            ],
            medium: [
                `Still haven't done "${habit.name}"? Your streak is watching! 😈`,
                `Come on! "${habit.name}" won't do itself! 🔥`,
                `Your future self will thank you for doing "${habit.name}"! ⏰`,
            ],
            savage: [
                `Seriously? "${habit.name}" is still pending? Even my grandma does better! 💀`,
                `Your streak for "${habit.name}" is about to die! Do it NOW! 🔥`,
                `I'm disappointed. "${habit.name}" should be done by now! 😤`,
            ],
        };

        const messages = roastMessages[habit.roastLevel] || roastMessages.medium;
        const message = messages[Math.floor(Math.random() * messages.length)];

        // Try to use Telegram's native notification
        this.sendTelegramNotification(habit.name, message);

        // Also trigger in-app visual notification
        this.showInAppNotification(habit.name, message, habit.roastLevel);
    }

    // Show in-app notification (toast)
    private showInAppNotification(habitName: string, message: string, roastLevel: string) {
        // Create toast notification element
        const toast = document.createElement('div');
        toast.id = 'habit-roast-notification';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(139, 92, 246, 0.5);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            max-width: 90%;
            text-align: center;
            animation: slideIn 0.3s ease-out;
        `;

        const emoji = roastLevel === 'savage' ? '💀' : roastLevel === 'medium' ? '😈' : '⏰';
        toast.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 8px;">${emoji}</div>
            <div style="font-weight: bold; margin-bottom: 4px;">Time for: ${habitName}</div>
            <div style="opacity: 0.9;">${message}</div>
        `;

        // Add animation keyframes if not already added
        if (!document.getElementById('roast-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'roast-notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(-50%) translateY(0); opacity: 1; }
                    to { transform: translateX(-50%) translateY(-100px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove any existing toast
        const existing = document.getElementById('habit-roast-notification');
        if (existing) existing.remove();

        document.body.appendChild(toast);

        // Auto-dismiss after 8 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 8000);
    }

    // Send notification via Telegram or browser
    private sendTelegramNotification(title: string, body: string) {
        try {
            // @ts-ignore - Telegram WebApp is injected globally
            const tg = window.Telegram?.WebApp;

            if (tg) {
                // For Telegram Mini Apps, we can use browser notifications
                this.sendBrowserNotification(title, body);
            } else {
                // Fallback to browser notification
                this.sendBrowserNotification(title, body);
            }
        } catch (error) {
            console.log('Failed to send Telegram notification:', error);
            this.sendBrowserNotification(title, body);
        }
    }

    // Send browser notification
    private sendBrowserNotification(title: string, body: string) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`🔥 ${title}`, {
                body,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: `habit-reminder-${Date.now()}`,
                requireInteraction: true,
            });
        } else {
            // Fallback to console if notifications are not supported
            console.log(`Notification: ${title} - ${body}`);
        }
    }

    // Save reminder settings for a habit
    saveReminder(habitId: number, habitName: string, time: string, enabled: boolean = true) {
        const reminders: Reminder[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');

        const existingIndex = reminders.findIndex((r) => r.habitId === habitId);

        if (existingIndex >= 0) {
            reminders[existingIndex] = {
                ...reminders[existingIndex],
                habitName,
                time,
                enabled,
            };
        } else {
            reminders.push({
                habitId,
                habitName,
                time,
                enabled,
                lastNotified: null,
            });
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reminders));
    }

    // Get reminder for a habit
    getReminder(habitId: number): Reminder | null {
        const reminders: Reminder[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        return reminders.find((r) => r.habitId === habitId) || null;
    }

    // Get all reminders
    getAllReminders(): Reminder[] {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    }

    // Toggle reminder enabled/disabled
    toggleReminder(habitId: number, enabled: boolean) {
        const reminders: Reminder[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');

        const updatedReminders = reminders.map((r) =>
            r.habitId === habitId ? { ...r, enabled } : r
        );

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedReminders));
    }

    // Delete reminder for a habit
    deleteReminder(habitId: number) {
        const reminders: Reminder[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        const updatedReminders = reminders.filter((r) => r.habitId !== habitId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedReminders));
    }

    // Clean up reminders for deleted habits
    cleanupReminders() {
        const habits: Habit[] = JSON.parse(localStorage.getItem('habits') || '[]');
        const reminders: Reminder[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');

        const habitIds = habits.map((h) => h.id);
        const updatedReminders = reminders.filter((r) => habitIds.includes(r.habitId));

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedReminders));
    }
}

// Export singleton instance
export const reminderService = new ReminderService();
