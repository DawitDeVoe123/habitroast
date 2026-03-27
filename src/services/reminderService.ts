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
    private readonly CHECK_INTERVAL_MS = 60000; // Check every minute

    // Initialize the reminder service
    init() {
        this.startChecking();
        this.requestNotificationPermission();
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
            // Fallback to alert if notifications are not supported
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
