import { useNavigate } from 'react-router-dom';
import { backButton } from '@telegram-apps/sdk-react';
import { type PropsWithChildren, useEffect } from 'react';

export function Page({ children, back = true }: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean
}>) {
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [back]);

  return <>{children}</>;
}
