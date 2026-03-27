// AI Roast Generator Service
// Generates personalized roast messages based on missed habits

interface Habit {
    id: number;
    name: string;
    streak: number;
    lastCompleted: string | null;
    completedDates: string[];
    roastLevel: 'mild' | 'medium' | 'savage';
    description?: string;
}

interface RoastContext {
    habitName: string;
    habitDescription?: string;
    currentStreak: number;
    daysMissed: number;
    roastLevel: 'mild' | 'medium' | 'savage';
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    dayOfWeek: string;
}

class AIRoastService {
    // Generate personalized roast based on context
    generateRoast(context: RoastContext): string {
        const { habitName, habitDescription, currentStreak, daysMissed, roastLevel, timeOfDay, dayOfWeek } = context;

        // Build context-aware roast
        const roast = this.buildRoastMessage(context);
        return roast;
    }

    // Build roast message based on context
    private buildRoastMessage(context: RoastContext): string {
        const { habitName, currentStreak, daysMissed, roastLevel, timeOfDay, dayOfWeek } = context;
        // Use all destructured variables
        console.log(`Generating roast for ${habitName} at ${timeOfDay} on ${dayOfWeek}`);

        // Get base message based on roast level
        const baseMessages = this.getBaseMessages(roastLevel);

        // Select random base message
        const baseMessage = baseMessages[Math.floor(Math.random() * baseMessages.length)];

        // Personalize the message
        let message = baseMessage
            .replace(/{habit}/g, habitName)
            .replace(/{streak}/g, currentStreak.toString())
            .replace(/{days}/g, daysMissed.toString())
            .replace(/{time}/g, timeOfDay)
            .replace(/{day}/g, dayOfWeek);

        return message;
    }

    // Get base messages based on roast level
    private getBaseMessages(roastLevel: string): string[] {
        const messages = {
            mild: [
                "Hey! Don't forget to complete \"{habit}\" today! 😊",
                "Time for \"{habit}\"! You've got this! 💪",
                "Gentle reminder: \"{habit}\" is waiting for you! ⏰",
                "Your \"{habit}\" streak is at {streak} days. Keep it going! 🔥",
                "Just a friendly nudge about \"{habit}\"! 😊",
                "Your future self will thank you for doing \"{habit}\"! ⏰",
                "Don't let your {streak}-day streak die! Complete \"{habit}\"! 💪",
                "It's {time} on {day} - perfect time for \"{habit}\"! ⏰",
            ],
            medium: [
                "Still haven't done \"{habit}\"? Your streak is watching! 😈",
                "Come on! \"{habit}\" won't do itself! 🔥",
                "Your future self will thank you for doing \"{habit}\"! ⏰",
                "I'm disappointed. \"{habit}\" should be done by now! 😤",
                "Your {streak}-day streak for \"{habit}\" is about to die! Do it NOW! 🔥",
                "Seriously? \"{habit}\" is still pending? Even my grandma does better! 💀",
                "Your consistency is showing... and it's not pretty! Complete \"{habit}\"! 😈",
                "It's {time} on {day} and \"{habit}\" is still not done? Step it up! 🔥",
            ],
            savage: [
                "Seriously? \"{habit}\" is still pending? Even my grandma does better! 💀",
                "Your streak for \"{habit}\" is about to die! Do it NOW! 🔥",
                "I'm disappointed. \"{habit}\" should be done by now! 😤",
                "Your consistency is a joke. \"{habit}\" is waiting! 💀",
                "Even my grandma has better consistency than you! Complete \"{habit}\"! 🔥",
                "Your {streak}-day streak is about to end! Do \"{habit}\" NOW! 💀",
                "I can't believe you missed \"{habit}\" again! Your streak is crying! 😤",
                "It's {time} on {day} and you still haven't done \"{habit}\"? Pathetic! 💀",
            ],
        };

        return messages[roastLevel as keyof typeof messages] || messages.medium;
    }

    // Generate victory roast for completed habits
    generateVictoryRoast(habitName: string, streak: number): string {
        const victoryMessages = [
            `🎉 Amazing! You completed "${habitName}" and extended your ${streak}-day streak!`,
            `🔥 On fire! "${habitName}" done! ${streak} days and counting!`,
            `💪 Beast mode! You crushed "${habitName}"! ${streak}-day streak!`,
            `🏆 Champion! "${habitName}" completed! ${streak} days strong!`,
            `⭐ Superstar! You did "${habitName}"! ${streak}-day streak alive!`,
            `🚀 Unstoppable! "${habitName}" done! ${streak} days and growing!`,
            `✨ Incredible! You completed "${habitName}"! ${streak}-day streak!`,
            `🎯 Perfect! "${habitName}" done! ${streak} days of consistency!`,
        ];

        return victoryMessages[Math.floor(Math.random() * victoryMessages.length)];
    }

    // Generate streak saver message
    generateStreakSaverMessage(habitName: string, friendUsername: string): string {
        const messages = [
            `🆘 ${friendUsername} saved your "${habitName}" streak! You owe them!`,
            `💪 ${friendUsername} checked in for "${habitName}"! Your streak lives!`,
            `🙏 ${friendUsername} has your back! "${habitName}" streak saved!`,
            `🦸 ${friendUsername} is your hero! "${habitName}" streak continues!`,
            `❤️ ${friendUsername} saved your "${habitName}" streak! True friendship!`,
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }

    // Generate stake lost message
    generateStakeLostMessage(habitName: string, amount: number): string {
        const messages = [
            `💸 You lost ${amount} Telegram Stars for missing "${habitName}"!`,
            `😢 ${amount} Stars gone! You missed "${habitName}"!`,
            `💔 ${amount} Stars lost! "${habitName}" was not completed!`,
            `😭 Your ${amount} Stars are gone! "${habitName}" missed!`,
            `💸 ${amount} Stars evaporated! You forgot "${habitName}"!`,
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }

    // Generate stake won message
    generateStakeWonMessage(habitName: string, amount: number): string {
        const messages = [
            `🏆 You won ${amount * 2} Telegram Stars for completing "${habitName}" for 7 days!`,
            `🎉 ${amount * 2} Stars earned! You crushed "${habitName}"!`,
            `💰 ${amount * 2} Stars won! "${habitName}" streak paid off!`,
            `⭐ ${amount * 2} Stars yours! "${habitName}" consistency rewarded!`,
            `🏆 ${amount * 2} Stars! You dominated "${habitName}"!`,
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }

    // Get time of day
    getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }

    // Get day of week
    getDayOfWeek(): string {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date().getDay()];
    }

    // Generate contextual roast for a habit
    generateContextualRoast(habit: Habit): string {
        const today = new Date().toISOString().split('T')[0];
        const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toISOString().split('T')[0] : null;

        let daysMissed = 0;
        if (lastCompleted) {
            const lastDate = new Date(lastCompleted);
            const todayDate = new Date(today);
            const diffTime = todayDate.getTime() - lastDate.getTime();
            daysMissed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        }

        const context: RoastContext = {
            habitName: habit.name,
            habitDescription: habit.description,
            currentStreak: habit.streak,
            daysMissed,
            roastLevel: habit.roastLevel,
            timeOfDay: this.getTimeOfDay(),
            dayOfWeek: this.getDayOfWeek(),
        };

        return this.generateRoast(context);
    }
}

// Export singleton instance
export const aiRoastService = new AIRoastService();
