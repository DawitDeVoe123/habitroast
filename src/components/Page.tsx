import { useNavigate } from 'react-router-dom';
import { backButton } from '@telegram-apps/sdk-react';
import { type PropsWithChildren, useEffect } from 'react';
import { isRunningInTelegram } from '@/mockEnv';

export function Page({ children, back = true }: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean
}>) {
  const navigate = useNavigate();

  useEffect(() => {
    // Only use backButton if running in Telegram
    if (!isRunningInTelegram) {
      return;
    }

    try {
      if (back) {
        backButton.show();
        return backButton.onClick(() => {
          navigate(-1);
        });
      }
      backButton.hide();
    } catch (e) {
      // SDK not initialized yet - this is expected when running outside Telegram
      console.log('Back button not available:', e);
    }
  }, [back, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--hr-bg-primary)'
    }}>
      {/* Custom Back Button - visible when not in Telegram */}
      {!isRunningInTelegram && back && (
        <div style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '12px 16px',
          background: 'var(--hr-bg-secondary)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <button
            onClick={handleGoBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--hr-bg-card)',
              color: 'var(--hr-primary-light)',
              cursor: 'pointer',
              fontSize: '20px',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--hr-shadow-sm)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--hr-primary)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'var(--hr-bg-card)';
              e.currentTarget.style.color = 'var(--hr-primary-light)';
            }}
          >
            ←
          </button>
          <span style={{
            color: 'var(--hr-text-secondary)',
            fontSize: '14px',
            fontWeight: '500',
          }}>
            Go Back
          </span>
        </div>
      )}
      {/* Telegram native back button handler - also show custom for consistency */}
      {isRunningInTelegram && back && (
        <div style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '12px 16px',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <button
            onClick={handleGoBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--hr-bg-card)',
              color: 'var(--hr-primary-light)',
              cursor: 'pointer',
              fontSize: '20px',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--hr-shadow-sm)',
            }}
          >
            ←
          </button>
        </div>
      )}
      {children}
    </div>
  );
}
