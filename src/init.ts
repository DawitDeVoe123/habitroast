import { initData, retrieveLaunchParams } from '@telegram-apps/sdk-react';

/**
 * Initializes the Telegram Mini Apps environment.
 * Handles both production and mock environments.
 */
export async function init(): Promise<void> {
  try {
    // Initialize the SDK
    initData.restore();

    // Log launch params for debugging
    const lp = retrieveLaunchParams();
    console.log('Launch params:', lp);
  } catch (error) {
    // Running outside Telegram - this is expected in Vercel/web browser
    console.log('Running outside Telegram (expected in web browser):', error);
  }
}

// For TypeScript, declare the Telegram WebApp object
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
      };
    };
  }
}
