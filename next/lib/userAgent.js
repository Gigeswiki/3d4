function detectBrowser(userAgent = '') {
  const ua = userAgent.toLowerCase();
  if (ua.includes('msie') || ua.includes('trident')) return 'Internet Explorer';
  if (ua.includes('firefox')) return 'Mozilla Firefox';
  if (ua.includes('opr/') || ua.includes('opera')) return 'Opera';
  if (ua.includes('edg/')) return 'Microsoft Edge';
  if (ua.includes('chrome')) return 'Google Chrome';
  if (ua.includes('safari')) return 'Safari';
  return 'Bilinmiyor';
}

function detectDevice(userAgent = '') {
  const ua = userAgent.toLowerCase();
  const mobileRegex = /(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i;
  return mobileRegex.test(ua) ? 'Mobil' : 'Bilgisayar';
}

module.exports = {
  detectBrowser,
  detectDevice,
};