import { initData, type ThemeParams, retrieveLaunchParams, type InitData } from '@telegram-apps/sdk-react';

/**
 * Initializes the mock environment for development.
 * This function is called only in development mode.
 */
export function initMockEnvironment(): void {
  // We don't need to do anything here for now
  console.log('Mock environment initialized');
}

/**
 * Initializes the Telegram Mini Apps environment.
 */
export async function init(): Promise<void> {
  try {
    // Initialize the SDK
    initData.restore();

    // Log launch params for debugging
    const lp = retrieveLaunchParams();
    console.log('Launch params:', lp);
  } catch (error) {
    console.error('Failed to initialize Telegram Mini Apps:', error);
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