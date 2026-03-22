import { useState, useEffect, ReactNode } from 'react';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';
import { useLaunchParams, useSignal, miniApp } from '@tma.js/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

import { routes } from '@/navigation/routes.tsx';

// Error boundary component to catch Telegram SDK errors
function TelegramWrapper({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Try to access Telegram SDK
      const lp = useLaunchParams();
      const isDark = useSignal(miniApp.isDark);
      setIsReady(true);
    } catch (e) {
      // SDK not available - running outside Telegram
      setError('Running outside Telegram');
      setIsReady(true); // Still render, just with defaults
    }
  }, []);

  if (!isReady) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}

export function App() {
  // Use defaults for when outside Telegram
  let appearance = 'dark';
  let platform = 'desktop';

  try {
    const lp = useLaunchParams();
    const isDark = useSignal(miniApp.isDark);
    appearance = isDark ? 'dark' : 'light';
    platform = ['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base';
  } catch (e) {
    // Running outside Telegram - use defaults
    console.log('Using default appearance/platform');
  }

  return (
    <AppRoot appearance={appearance} platform={platform}>
      <HashRouter>
        <Routes>
          {routes.map((route) => <Route key={route.path} {...route} />)}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AppRoot>
  );
}
