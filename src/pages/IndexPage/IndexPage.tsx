import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '@/components/Page.tsx';

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
    <Page back={false}>
      <div style={{
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '30px'
        }}>
          <span style={{ fontSize: '40px' }}>🔥</span>
          <h1 style={{ margin: 0 }}>HabitRoast</h1>
        </header>

        {/* Welcome Card */}
        {user && (
          <div style={{
            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
            padding: '15px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ margin: '0 0 5px 0' }}>
              👋 Welcome, <strong>{user.firstName || 'Roast Seeker'}</strong>!
            </p>
            <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
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
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
            padding: '12px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--tg-theme-button-color, #FF6B35)' }}>
              {habits.length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
              Habits
            </div>
          </div>
          <div style={{
            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
            padding: '12px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--tg-theme-button-color, #FF6B35)' }}>
              {totalStreak}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
              Total Streak
            </div>
          </div>
          <div style={{
            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
            padding: '12px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--tg-theme-button-color, #FF6B35)' }}>
              {completedToday}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color, #666)' }}>
              Done Today
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div style={{
          display: 'grid',
          gap: '12px'
        }}>
          <button
            onClick={() => navigate('/create-habit')}
            style={{
              background: 'var(--tg-theme-button-color, #FF6B35)',
              color: 'var(--tg-theme-button-text-color, white)',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            ➕ Create New Habit
          </button>

          <button
            onClick={() => navigate('/habits')}
            style={{
              background: 'transparent',
              color: 'var(--tg-theme-text-color, #1A1A1A)',
              border: '2px solid var(--tg-theme-button-color, #FF6B35)',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            📋 My Habits {habits.length > 0 && `(${habits.length})`}
          </button>

          <button
            onClick={() => navigate('/accountability-circle')}
            style={{
              background: 'transparent',
              color: 'var(--tg-theme-text-color, #1A1A1A)',
              border: '2px solid var(--tg-theme-button-color, #FF6B35)',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            👥 My Accountability Circle
          </button>

          <button
            onClick={() => alert(getRandomRoast())}
            style={{
              background: 'var(--tg-theme-text-color, #1A1A1A)',
              color: 'var(--tg-theme-bg-color, white)',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            🔥 Roast Me Now
          </button>
        </div>

        {/* Today's Progress */}
        {habits.length > 0 && (
          <div style={{
            marginTop: '30px',
            padding: '15px',
            background: 'var(--tg-theme-secondary-bg-color, #fafafa)',
            borderRadius: '12px',
            border: '1px solid var(--tg-theme-hint-color, #eee)'
          }}>
            <h3 style={{
              margin: '0 0 10px 0',
              color: 'var(--tg-theme-text-color, #1A1A1A)'
            }}>
              Today's Progress
            </h3>
            {habits.slice(0, 3).map((habit) => (
              <div
                key={habit.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--tg-theme-hint-color, #eee)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{getRoastEmoji(habit.roastLevel)}</span>
                  <span style={{ fontSize: '14px' }}>{habit.name}</span>
                </div>
                {isCompletedToday(habit) ? (
                  <span style={{
                    background: '#4CAF50',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}>
                    ✓ Done
                  </span>
                ) : (
                  <span style={{
                    background: 'var(--tg-theme-button-color, #FF6B35)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '10px',
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
                  color: 'var(--tg-theme-button-color, #FF6B35)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginTop: '10px',
                  padding: '0',
                  width: '100%',
                  textAlign: 'center',
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
            padding: '30px 15px',
            background: 'var(--tg-theme-secondary-bg-color, #fafafa)',
            borderRadius: '12px',
            border: '1px solid var(--tg-theme-hint-color, #eee)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎯</div>
            <h3 style={{ margin: '0 0 10px 0' }}>No habits yet!</h3>
            <p style={{ margin: 0, color: 'var(--tg-theme-hint-color, #666)', fontSize: '14px' }}>
              Create your first habit and start getting roasted! 🔥
            </p>
          </div>
        )}

        {/* Motivational Quote */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <p style={{
            margin: 0,
            fontStyle: 'italic',
            color: 'var(--tg-theme-hint-color, #666)',
            fontSize: '14px',
          }}>
            "{pendingToday > 0
              ? `You have ${pendingToday} habit${pendingToday > 1 ? 's' : ''} to complete. Don't let your streak die! 🔥`
              : 'All done! Your future self is proud. 🎉'
            }"
          </p>
        </div>
      </div>
    </Page>
  );
};
