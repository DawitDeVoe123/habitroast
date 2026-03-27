import { mockTelegramEnv, emitEvent, isTMA } from '@telegram-apps/sdk-react';

// Export a flag to indicate if we're running in Telegram
export let isRunningInTelegram = false;

// Export a promise that resolves when the mock environment is set up
export const mockEnvReady = (async () => {
  const inTelegram = await isTMA('complete');
  isRunningInTelegram = inTelegram;

  if (!inTelegram) {
    const themeParams = {
      accent_text_color: '#6ab2f2',
      bg_color: '#17212b',
      button_color: '#5288c1',
      button_text_color: '#ffffff',
      destructive_text_color: '#ec3942',
      header_bg_color: '#17212b',
      hint_color: '#708499',
      link_color: '#6ab3f3',
      secondary_bg_color: '#232e3c',
      section_bg_color: '#17212b',
      section_header_text_color: '#6ab3f3',
      subtitle_text_color: '#708499',
      text_color: '#f5f5f5',
    } as const;
    const noInsets = { left: 0, top: 0, bottom: 0, right: 0 } as const;

    mockTelegramEnv({
      onEvent(e) {
        // Handle Telegram Mini Apps events - events are tuples [eventName, eventData]
        const [eventName] = e;
        if (eventName === 'web_app_request_theme') {
          return emitEvent('theme_changed', { theme_params: themeParams });
        }
        if (eventName === 'web_app_request_viewport') {
          return emitEvent('viewport_changed', {
            height: window.innerHeight,
            width: window.innerWidth,
            is_expanded: true,
            is_state_stable: true,
          });
        }
        if (eventName === 'web_app_request_content_safe_area') {
          return emitEvent('content_safe_area_changed', noInsets);
        }
        if (eventName === 'web_app_request_safe_area') {
          return emitEvent('safe_area_changed', noInsets);
        }
      },
      launchParams: new URLSearchParams([
        ['tgWebAppThemeParams', JSON.stringify(themeParams)],
        ['tgWebAppData', new URLSearchParams([
          ['auth_date', (new Date().getTime() / 1000 | 0).toString()],
          ['hash', 'some-hash'],
          ['signature', 'some-signature'],
          ['user', JSON.stringify({ id: 1, first_name: 'Vladislav' })],
        ]).toString()],
        ['tgWebAppVersion', '8.4'],
        ['tgWebAppPlatform', 'tdesktop'],
      ]),
    });

    console.info('⚠️ Environment mocked (running outside Telegram)');
    console.info('⚠️ Limited functionality - some SDK methods may not work');
  }
})();
