import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '@/components/Page.tsx';
import { GloryShameFeed } from '@/components/GloryShameFeed/GloryShameFeed';

// Grid Icon Button Component
const GridIconButton = ({
  emoji,
  label,
  onClick,
  badge,
  gradient
}: {
  emoji: string;
  label: string;
  onClick: () => void;
  badge?: number;
  gradient?: string;
}) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '16px 8px',
      background: gradient || 'var(--hr-bg-card)',
      border: gradient ? 'none' : '1px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minHeight: '100px',
      position: 'relative',
      boxShadow: gradient ? '0 4px 16px rgba(139, 92, 246, 0.3)' : 'none',
    }}
  >
    {badge && (
      <span style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: 'var(--hr-accent-gold)',
        color: '#1a1a2e',
        fontSize: '11px',
        fontWeight: 'bold',
        padding: '2px 8px',
        borderRadius: '10px',
      }}>
        {badge}
      </span>
    )}
    <span style={{ fontSize: '32px' }}>{emoji}</span>
    <span style={{
      fontSize: '12px',
      fontWeight: '600',
      color: gradient ? 'white' : 'var(--hr-text-primary)',
    }}>{label}</span>
  </button>
);

// Define the User type
interface User {
  firstName?: string;
  id: number;
  lastName?: string;
  username?: string;
}

interface Habit {
  id: number;
  name: string;
  streak: number;
  lastCompleted: string | null;
  completedDates: string[];
  roastLevel: 'mild' | 'medium' | 'savage';
  stakeAmount?: number;
}

export const IndexPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get Telegram user data from the native WebApp
    try {
      // @ts-ignore - Telegram WebApp is injected globally
      const tg = window.Telegram?.WebApp;
      if (tg?.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
        console.log('User loaded:', tg.initDataUnsafe.user);
      } else {
        // Mock user for development
        setUser({ firstName: 'Roast Seeker', id: 12345 });
      }
    } catch (error) {
      console.log('Running in dev mode with mock data');
      setUser({ firstName: 'Roast Seeker', id: 12345 });
    }

    // Load habits from localStorage
    const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]');
    setHabits(storedHabits);
  }, []);

  // Array of roast messages
  const roasts = [
    "You missed yesterday. Again. 😈",
    "Your habit streak is crying.",
    "Even your future self is disappointed.",
    "My grandma has better consistency.",
    "At this point, just give up? Just kidding... unless? 🔥",
    "Your habits are like my jokes - nonexistent.",
    "The only thing consistent about you is inconsistency.",
    "Your streak is so short, it's basically a dot."
  ];

  const getRandomRoast = () => {
    return roasts[Math.floor(Math.random() * roasts.length)];
  };

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates?.includes(today);
  };

  const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
  const completedToday = habits.filter((habit) => isCompletedToday(habit)).length;
  const pendingToday = habits.length - completedToday;

  const getRoastEmoji = (level: string) => {
    switch (level) {
      case 'mild': return '😊';
      case 'medium': return '😈';
      case 'savage': return '💀';
      default: return '🔥';
    }
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
        <header style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '30px',
          padding: '16px',
          background: 'var(--hr-gradient-midnight)',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}>
          <span style={{
            fontSize: '42px',
            background: 'var(--hr-gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>🔥</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', color: 'var(--hr-text-primary)' }}>HabitRoast</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--hr-primary-light)' }}>Midnight Ember Edition</p>
          </div>
        </header>

        {/* Welcome Card */}
        {user && (
          <div style={{
            background: 'var(--hr-bg-card)',
            padding: '18px',
            borderRadius: '16px',
            marginBottom: '20px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            boxShadow: 'var(--hr-shadow-sm)',
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
              👋 Welcome, <strong style={{ color: 'var(--hr-primary-light)' }}>{user.firstName || 'Roast Seeker'}</strong>!
            </p>
            <p style={{ margin: 0, color: 'var(--hr-text-secondary)', fontSize: '14px' }}>
              {habits.length === 0
                ? "Ready to get roasted? Create your first habit! 🔥"
                : pendingToday > 0
                  ? `You have ${pendingToday} habit${pendingToday > 1 ? 's' : ''} pending today! 🔥`
                  : "All habits completed today! 🎉"
              }
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'var(--hr-bg-card)',
            padding: '16px',
            borderRadius: '14px',
            textAlign: 'center',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', background: 'var(--hr-gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {habits.length}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--hr-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Habits
            </div>
          </div>
          <div style={{
            background: 'var(--hr-bg-card)',
            padding: '16px',
            borderRadius: '14px',
            textAlign: 'center',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', background: 'var(--hr-gradient-ember)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {totalStreak}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--hr-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Streak
            </div>
          </div>
          <div style={{
            background: 'var(--hr-bg-card)',
            padding: '16px',
            borderRadius: '14px',
            textAlign: 'center',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', background: 'var(--hr-gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {completedToday}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--hr-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Done Today
            </div>
          </div>
        </div>

        {/* Main Actions - Icon Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <GridIconButton
            emoji="➕"
            label="Create"
            onClick={() => navigate('/create-habit')}
            gradient="var(--hr-gradient-primary)"
          />
          <GridIconButton
            emoji="📋"
            label="Habits"
            onClick={() => navigate('/habits')}
            badge={habits.length > 0 ? habits.length : undefined}
          />
          <GridIconButton
            emoji="👥"
            label="Circle"
            onClick={() => navigate('/accountability-circle')}
          />
          <GridIconButton
            emoji="⚔️"
            label="Battles"
            onClick={() => navigate('/streak-battles')}
          />
          <GridIconButton
            emoji="⭐"
            label="Stake"
            onClick={() => navigate('/stake')}
          />
          <GridIconButton
            emoji="🎁"
            label="Invite"
            onClick={() => navigate('/invite')}
          />
          <GridIconButton
            emoji="🏆"
            label="Ranks"
            onClick={() => navigate('/leaderboard')}
          />
          <GridIconButton
            emoji="🎯"
            label="Challenge"
            onClick={() => navigate('/challenges')}
          />
          <GridIconButton
            emoji="📅"
            label="Calendar"
            onClick={() => navigate('/calendar')}
          />
          <GridIconButton
            emoji="📈"
            label="Reports"
            onClick={() => navigate('/reports')}
          />
          <GridIconButton
            emoji="🎨"
            label="Themes"
            onClick={() => navigate('/premium-themes')}
          />
          <GridIconButton
            emoji="🔥"
            label="Roast"
            onClick={() => alert(getRandomRoast())}
            gradient="var(--hr-gradient-ember)"
          />
        </div>

        {/* Today's Progress */}
        {habits.length > 0 && (
          <div style={{
            marginTop: '30px',
            padding: '18px',
            background: 'var(--hr-bg-card)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              color: 'var(--hr-text-primary)',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span>📊</span> Today's Progress
            </h3>
            {habits.slice(0, 3).map((habit) => (
              <div
                key={habit.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{getRoastEmoji(habit.roastLevel)}</span>
                  <span style={{ fontSize: '15px', color: 'var(--hr-text-primary)' }}>{habit.name}</span>
                  {habit.stakeAmount && habit.stakeAmount > 0 && (
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--hr-accent-gold)',
                      background: 'rgba(251, 191, 36, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '8px',
                    }}>⭐{habit.stakeAmount}</span>
                  )}
                </div>
                {isCompletedToday(habit) ? (
                  <span style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: 'var(--hr-success)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}>
                    ✓ Done
                  </span>
                ) : (
                  <span style={{
                    background: 'rgba(249, 115, 22, 0.2)',
                    color: 'var(--hr-accent-warm)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}>
                    Pending
                  </span>
                )}
              </div>
            ))}
            {habits.length > 3 && (
              <button
                onClick={() => navigate('/habits')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--hr-primary-light)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginTop: '12px',
                  padding: '0',
                  width: '100%',
                  textAlign: 'center',
                  fontWeight: '600',
                }}
              >
                View all {habits.length} habits →
              </button>
            )}
          </div>
        )}

        {/* Empty State */}
        {habits.length === 0 && (
          <div style={{
            marginTop: '30px',
            padding: '40px 20px',
            background: 'var(--hr-bg-card)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '56px',
              marginBottom: '20px',
              background: 'var(--hr-gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>🎯</div>
            <h3 style={{ margin: '0 0 12px 0', color: 'var(--hr-text-primary)', fontSize: '20px' }}>No habits yet!</h3>
            <p style={{ margin: 0, color: 'var(--hr-text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
              Create your first habit and start getting roasted! 🔥
            </p>
          </div>
        )}

        {/* Motivational Quote */}
        <div style={{
          marginTop: '24px',
          padding: '18px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          textAlign: 'center',
        }}>
          <p style={{
            margin: 0,
            fontStyle: 'italic',
            color: 'var(--hr-text-secondary)',
            fontSize: '14px',
            lineHeight: '1.6',
          }}>
            "{pendingToday > 0
              ? `You have ${pendingToday} habit${pendingToday > 1 ? 's' : ''} to complete. Don't let your streak die! 🔥`
              : 'All done! Your future self is proud. 🎉'
            }"
          </p>
        </div>

        {/* Glory/Shame Feed */}
        <div style={{ marginTop: '20px' }}>
          <GloryShameFeed />
        </div>
      </div>
    </Page>
  );
};
