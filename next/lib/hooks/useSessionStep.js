import { useEffect, useState } from 'react';

export function useSessionStep(stepName) {
  const [state, setState] = useState({ loading: true, active: false, banned: false });

  useEffect(() => {
    let cancelled = false;

    async function updateStep() {
      try {
        const response = await fetch('/.netlify/functions/update-session-state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ step: stepName }),
        });
        const data = await response.json();

        if (cancelled) return;
        setState({
          loading: false,
          active: Boolean(data?.active),
          banned: Boolean(data?.banned),
          redirectUrl: data?.redirectUrl,
        });

        if (data?.banned && data?.redirectUrl && typeof globalThis !== 'undefined') {
          globalThis.location.href = data.redirectUrl;
        }
      } catch (error) {
        if (cancelled) return;
        if (process.env.NODE_ENV === 'development') {
          console.debug('Oturum adımı güncellenemedi:', error);
        }
        setState({ loading: false, active: false, banned: false, error: true });
      }
    }

    updateStep();

    return () => {
      cancelled = true;
    };
  }, [stepName]);

  return state;
}

export default useSessionStep;