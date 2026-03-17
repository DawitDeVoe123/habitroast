import { useEffect, useState } from 'react';
import { Page } from '@/components/Page.tsx';

// Define the User type
interface User {
  firstName?: string;
  id: number;
  lastName?: string;
  username?: string;
}

export const IndexPage = () => {
  const [user, setUser] = useState<User | null>(null);

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
              Ready to get roasted? 🔥
            </p>
          </div>
        )}

        {/* Main Actions */}
        <div style={{
          display: 'grid',
          gap: '12px'
        }}>
          <button
            onClick={() => alert('✨ Habit creator coming soon!')}
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
            onClick={() => alert('👥 Your accountability circle coming soon!')}
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
            onClick={() => alert(roasts[Math.floor(Math.random() * roasts.length)])}
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

        {/* Glory/Shame Feed Preview */}
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
            Today's Glory/Shame
          </h3>
          <p style={{
            color: 'var(--tg-theme-hint-color, #666)',
            fontStyle: 'italic',
            margin: 0
          }}>
            Your circle activity will appear here...
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginTop: '20px'
        }}>
          <div style={{
            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
            padding: '12px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>0</div>
            <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color, #666)' }}>
              Current Streak
            </div>
          </div>
          <div style={{
            background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
            padding: '12px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>0</div>
            <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color, #666)' }}>
              Habits Tracked
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};