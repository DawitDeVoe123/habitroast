import { useState, useEffect } from 'react';
import { Page } from '@/components/Page.tsx';

interface Stake {
    id: number;
    habitId: number;
    habitName: string;
    amount: number;
    depositedAt: string;
    status: 'active' | 'lost' | 'won';
    lostAt?: string;
    wonAt?: string;
}

interface Habit {
    id: number;
    name: string;
    streak: number;
    completedDates: string[];
    stakeAmount?: number;
}

export const StakePage = () => {
    const [stakes, setStakes] = useState<Stake[]>([]);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [starsAtRisk, setStarsAtRisk] = useState(0);
    const [showDepositForm, setShowDepositForm] = useState(false);
    const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
    const [depositAmount, setDepositAmount] = useState(10);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const storedStakes = JSON.parse(localStorage.getItem('stakes') || '[]');
        const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]');
        const storedStars = parseInt(localStorage.getItem('totalStars') || '100');

        setStakes(storedStakes);
        setHabits(storedHabits);
        setTotalStars(storedStars);

        // Calculate stars at risk
        const activeStakes = storedStakes.filter((s: Stake) => s.status === 'active');
        const atRisk = activeStakes.reduce((sum: number, s: Stake) => sum + s.amount, 0);
        setStarsAtRisk(atRisk);
    };

    const depositStake = () => {
        if (selectedHabit && depositAmount > 0 && depositAmount <= totalStars) {
            const habit = habits.find((h) => h.id === selectedHabit);
            if (habit) {
                const newStake: Stake = {
                    id: Date.now(),
                    habitId: habit.id,
                    habitName: habit.name,
                    amount: depositAmount,
                    depositedAt: new Date().toISOString(),
                    status: 'active',
                };

                const updatedStakes = [...stakes, newStake];
                const updatedStars = totalStars - depositAmount;

                localStorage.setItem('stakes', JSON.stringify(updatedStakes));
                localStorage.setItem('totalStars', updatedStars.toString());

                setStakes(updatedStakes);
                setTotalStars(updatedStars);
                setStarsAtRisk(starsAtRisk + depositAmount);
                setShowDepositForm(false);
                setSelectedHabit(null);
                setDepositAmount(10);
            }
        }
    };

    const checkStakes = () => {
        const today = new Date().toISOString().split('T')[0];
        const updatedStakes = stakes.map((stake) => {
            if (stake.status === 'active') {
                const habit = habits.find((h) => h.id === stake.habitId);
                if (habit) {
                    const completedToday = habit.completedDates?.includes(today);
                    if (!completedToday) {
                        // Habit not completed today - stake is lost
                        return {
                            ...stake,
                            status: 'lost' as const,
                            lostAt: new Date().toISOString(),
                        };
                    }
                }
            }
            return stake;
        });

        localStorage.setItem('stakes', JSON.stringify(updatedStakes));
        setStakes(updatedStakes);

        // Recalculate stars at risk
        const activeStakes = updatedStakes.filter((s) => s.status === 'active');
        const atRisk = activeStakes.reduce((sum, s) => sum + s.amount, 0);
        setStarsAtRisk(atRisk);
    };

    const claimWinnings = (stakeId: number) => {
        const stake = stakes.find((s) => s.id === stakeId);
        if (stake && stake.status === 'active') {
            const habit = habits.find((h) => h.id === stake.habitId);
            if (habit && habit.streak >= 7) {
                // Won! Double the stake
                const winnings = stake.amount * 2;
                const updatedStars = totalStars + winnings;

                const updatedStakes = stakes.map((s) =>
                    s.id === stakeId
                        ? { ...s, status: 'won' as const, wonAt: new Date().toISOString() }
                        : s
                );

                localStorage.setItem('stakes', JSON.stringify(updatedStakes));
                localStorage.setItem('totalStars', updatedStars.toString());

                setStakes(updatedStakes);
                setTotalStars(updatedStars);
                setStarsAtRisk(starsAtRisk - stake.amount);

                alert(`🎉 Congratulations! You won ${winnings} Telegram Stars!`);
            }
        }
    };

    const getStakeEmoji = (status: string) => {
        switch (status) {
            case 'active': return '⏳';
            case 'won': return '🏆';
            case 'lost': return '💸';
            default: return '⭐';
        }
    };

    const getStakeColor = (status: string) => {
        switch (status) {
            case 'active': return 'var(--tg-theme-button-color, #FF6B35)';
            case 'won': return '#4CAF50';
            case 'lost': return '#ff4444';
            default: return 'var(--tg-theme-hint-color, #666)';
        }
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
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>⭐ Stake & Roast</h1>
                    <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                        Deposit Telegram Stars and lose them if you miss your habits! 💸
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
                            ⭐ {totalStars}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                            Total Stars
                        </div>
                    </div>
                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '12px',
                        borderRadius: '10px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4444' }}>
                            ⚠️ {starsAtRisk}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                            At Risk
                        </div>
                    </div>
                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '12px',
                        borderRadius: '10px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
                            🏆 {stakes.filter((s) => s.status === 'won').length}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                            Won
                        </div>
                    </div>
                </div>

                {/* Deposit Stake */}
                {showDepositForm ? (
                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                        padding: '16px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                    }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}>
                            Select Habit
                        </label>
                        <select
                            value={selectedHabit || ''}
                            onChange={(e) => setSelectedHabit(parseInt(e.target.value))}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--tg-theme-hint-color, #ddd)',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                background: 'var(--tg-theme-bg-color, white)',
                                color: 'var(--tg-theme-text-color, #1A1A1A)',
                                marginBottom: '12px',
                            }}
                        >
                            <option value="">Select a habit...</option>
                            {habits.map((habit) => (
                                <option key={habit.id} value={habit.id}>
                                    {habit.name}
                                </option>
                            ))}
                        </select>

                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}>
                            Deposit Amount (Stars)
                        </label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                            {[5, 10, 25, 50].map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => setDepositAmount(amount)}
                                    disabled={amount > totalStars}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: depositAmount === amount
                                            ? '2px solid var(--tg-theme-button-color, #FF6B35)'
                                            : '1px solid var(--tg-theme-hint-color, #ddd)',
                                        background: depositAmount === amount
                                            ? 'var(--tg-theme-button-color, #FF6B35)'
                                            : 'transparent',
                                        color: depositAmount === amount
                                            ? 'var(--tg-theme-button-text-color, white)'
                                            : 'var(--tg-theme-text-color, #1A1A1A)',
                                        cursor: amount > totalStars ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: depositAmount === amount ? 'bold' : 'normal',
                                        opacity: amount > totalStars ? 0.5 : 1,
                                    }}
                                >
                                    ⭐ {amount}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={depositStake}
                                disabled={!selectedHabit || depositAmount > totalStars}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: !selectedHabit || depositAmount > totalStars
                                        ? 'var(--tg-theme-hint-color, #ccc)'
                                        : 'var(--tg-theme-button-color, #FF6B35)',
                                    color: 'var(--tg-theme-button-text-color, white)',
                                    cursor: !selectedHabit || depositAmount > totalStars ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                            >
                                Deposit ⭐ {depositAmount}
                            </button>
                            <button
                                onClick={() => setShowDepositForm(false)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--tg-theme-hint-color, #ddd)',
                                    background: 'transparent',
                                    color: 'var(--tg-theme-text-color, #1A1A1A)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowDepositForm(true)}
                        disabled={habits.length === 0}
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '12px',
                            border: 'none',
                            background: habits.length === 0
                                ? 'var(--tg-theme-hint-color, #ccc)'
                                : 'var(--tg-theme-button-color, #FF6B35)',
                            color: 'var(--tg-theme-button-text-color, white)',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: habits.length === 0 ? 'not-allowed' : 'pointer',
                            marginBottom: '20px',
                        }}
                    >
                        ⭐ Deposit Stake
                    </button>
                )}

                {/* Check Stakes Button */}
                <button
                    onClick={checkStakes}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid var(--tg-theme-button-color, #FF6B35)',
                        background: 'transparent',
                        color: 'var(--tg-theme-button-color, #FF6B35)',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginBottom: '20px',
                    }}
                >
                    🔍 Check Stakes Now
                </button>

                {/* Active Stakes */}
                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>⏳ Active Stakes</h3>
                    {stakes.filter((s) => s.status === 'active').length === 0 ? (
                        <div style={{
                            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                            padding: '20px',
                            borderRadius: '12px',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '15px' }}>⭐</div>
                            <h4 style={{ margin: '0 0 10px 0' }}>No active stakes</h4>
                            <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                                Deposit stars to start staking!
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {stakes
                                .filter((s) => s.status === 'active')
                                .map((stake) => {
                                    const habit = habits.find((h) => h.id === stake.habitId);
                                    const canClaim = habit && habit.streak >= 7;
                                    return (
                                        <div
                                            key={stake.id}
                                            style={{
                                                background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                                                padding: '16px',
                                                borderRadius: '12px',
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                <div>
                                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                                                        {getStakeEmoji(stake.status)} {stake.habitName}
                                                    </h4>
                                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                                        Deposited {new Date(stake.depositedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span style={{
                                                    background: getStakeColor(stake.status),
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                }}>
                                                    ⭐ {stake.amount}
                                                </span>
                                            </div>

                                            {canClaim && (
                                                <button
                                                    onClick={() => claimWinnings(stake.id)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        background: '#4CAF50',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    🏆 Claim Winnings (⭐ {stake.amount * 2})
                                                </button>
                                            )}

                                            {!canClaim && habit && (
                                                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                                    🔥 {habit.streak}/7 day streak to claim
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>

                {/* Stake History */}
                <div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>📊 Stake History</h3>
                    {stakes.length === 0 ? (
                        <div style={{
                            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
                            padding: '20px',
                            borderRadius: '12px',
                            textAlign: 'center',
                        }}>
                            <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
                                No stake history yet
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '8px' }}>
                            {stakes.map((stake) => (
                                <div
                                    key={stake.id}
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
                                            {getStakeEmoji(stake.status)} {stake.habitName}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                            {new Date(stake.depositedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', color: getStakeColor(stake.status) }}>
                                            ⭐ {stake.amount}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
                                            {stake.status === 'won' && `+${stake.amount * 2}`}
                                            {stake.status === 'lost' && `-${stake.amount}`}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                        <li>Deposit Telegram Stars on your habits</li>
                        <li>If you miss a day, you lose your stars</li>
                        <li>Maintain a 7-day streak to double your stake</li>
                        <li>Creates real consequences for missing habits</li>
                        <li>Direct revenue through stake losses</li>
                    </ul>
                </div>
            </div>
        </Page>
    );
};
