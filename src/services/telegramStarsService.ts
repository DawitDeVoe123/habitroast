/**
 * Telegram Stars Service
 * 
 * This service handles integration with Telegram's Stars payment system.
 * It allows users to:
 * - Check their Telegram Stars balance
 * - Deposit stars for staking
 * - Win stars through streaks
 * - Purchase premium themes
 * 
 * Note: In production, this would integrate with Telegram's actual payment API.
 * The current implementation simulates the experience for development.
 */

export interface StarsTransaction {
    id: string;
    type: 'deposit' | 'withdraw' | 'earned' | 'spent' | 'reward';
    amount: number;
    description: string;
    timestamp: string;
    status: 'pending' | 'completed' | 'failed';
}

class TelegramStarsService {
    private readonly STORAGE_KEY = 'telegram_stars_balance';
    private readonly TRANSACTIONS_KEY = 'telegram_stars_transactions';
    private balance: number = 0;
    private transactions: StarsTransaction[] = [];

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        // Try to get balance from localStorage
        const storedBalance = localStorage.getItem(this.STORAGE_KEY);
        this.balance = storedBalance ? parseInt(storedBalance) : 100; // Give 100 stars for demo

        // Load transactions
        const storedTransactions = localStorage.getItem(this.TRANSACTIONS_KEY);
        this.transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
    }

    private saveToStorage() {
        localStorage.setItem(this.STORAGE_KEY, this.balance.toString());
        localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(this.transactions));
    }

    private addTransaction(transaction: Omit<StarsTransaction, 'id' | 'timestamp'>) {
        const newTransaction: StarsTransaction = {
            ...transaction,
            id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
        };
        this.transactions.unshift(newTransaction);

        // Keep only last 50 transactions
        if (this.transactions.length > 50) {
            this.transactions = this.transactions.slice(0, 50);
        }

        this.saveToStorage();
        return newTransaction;
    }

    /**
     * Get the current Telegram Stars balance
     */
    getBalance(): number {
        return this.balance;
    }

    /**
     * Get transaction history
     */
    getTransactions(): StarsTransaction[] {
        return this.transactions;
    }

    /**
     * Deposit stars for staking
     * This would open Telegram's payment popup in production
     */
    async depositStars(amount: number, habitName: string): Promise<{ success: boolean; message: string }> {
        if (amount <= 0) {
            return { success: false, message: 'Amount must be positive' };
        }

        if (amount > this.balance) {
            // In production, this would open Telegram's Stars purchase flow
            return {
                success: false,
                message: `Insufficient stars. You need ${amount} stars but only have ${this.balance}. Opening Telegram Stars purchase...`
            };
        }

        // Deduct from balance
        this.balance -= amount;
        this.addTransaction({
            type: 'deposit',
            amount: -amount,
            description: `Deposited ${amount} stars for "${habitName}" stake`,
            status: 'completed',
        });

        this.saveToStorage();
        return { success: true, message: `Successfully deposited ${amount} stars!` };
    }

    /**
     * Withdraw stars (when stake is won or cancelled)
     */
    withdrawStars(amount: number, reason: string): boolean {
        if (amount <= 0) return false;

        this.balance += amount;
        this.addTransaction({
            type: 'withdraw',
            amount: amount,
            description: reason,
            status: 'completed',
        });

        this.saveToStorage();
        return true;
    }

    /**
     * Earn stars (from winning streaks)
     */
    earnStars(amount: number, reason: string): boolean {
        if (amount <= 0) return false;

        this.balance += amount;
        this.addTransaction({
            type: 'earned',
            amount: amount,
            description: reason,
            status: 'completed',
        });

        this.saveToStorage();
        return true;
    }

    /**
     * Lose stars (from missing habits)
     */
    loseStars(amount: number, habitName: string): boolean {
        if (amount <= 0) return false;

        this.balance -= amount;
        this.addTransaction({
            type: 'spent',
            amount: -amount,
            description: `Lost ${amount} stars for missing "${habitName}"`,
            status: 'completed',
        });

        this.saveToStorage();
        return true;
    }

    /**
     * Spend stars (for premium themes, etc.)
     */
    spendStars(amount: number, item: string): boolean {
        if (amount <= 0) return false;
        if (amount > this.balance) return false;

        this.balance -= amount;
        this.addTransaction({
            type: 'spent',
            amount: -amount,
            description: `Spent ${amount} stars on "${item}"`,
            status: 'completed',
        });

        this.saveToStorage();
        return true;
    }

    /**
     * Open Telegram Stars purchase webview
     * In production, this would use Telegram's actual payment API
     */
    async purchaseStars(): Promise<void> {
        // Check if running in Telegram
        try {
            // @ts-ignore - Telegram WebApp is injected globally
            const tg = window.Telegram?.WebApp;
            if (tg) {
                // Open Telegram's Stars purchase page
                // Use window.open as fallback for external links
                window.open('https://t.me/stars', '_blank');
            } else {
                // For development, give bonus stars
                this.balance += 50;
                this.addTransaction({
                    type: 'reward',
                    amount: 50,
                    description: 'Bonus stars (dev mode)',
                    status: 'completed',
                });
                this.saveToStorage();
                alert('+50 Stars added! (Dev mode - in production, this would open Telegram Stars)');
            }
        } catch {
            // Fallback for development
            this.balance += 50;
            this.addTransaction({
                type: 'reward',
                amount: 50,
                description: 'Bonus stars (dev mode)',
                status: 'completed',
            });
            this.saveToStorage();
            alert('+50 Stars added! (Dev mode)');
        }
    }

    /**
     * Check if user can afford a certain amount
     */
    canAfford(amount: number): boolean {
        return this.balance >= amount;
    }

    /**
     * Get formatted balance display
     */
    getFormattedBalance(): string {
        return `⭐ ${this.balance.toLocaleString()}`;
    }

    /**
     * Reset balance (for testing)
     */
    resetBalance() {
        this.balance = 100;
        this.transactions = [];
        this.saveToStorage();
    }
}

export const telegramStarsService = new TelegramStarsService();
