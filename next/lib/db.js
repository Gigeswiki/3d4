const { Pool, neonConfig } = require('@neondatabase/serverless');
const { getDatabaseUrl, DB_URL_ENV_KEYS } = require('./config');

neonConfig.fetchConnectionCache = true;

const connectionString = getDatabaseUrl();

if (!connectionString) {
  console.warn(
    `Veritabanı bağlantı dizesi tanımlı değil. Lütfen şu ortam değişkenlerinden birini ayarlayın: ${DB_URL_ENV_KEYS.join(', ')}`,
  );
}

const pool = connectionString
  ? new Pool({
      connectionString,
    })
  : null;

async function query(text, params = []) {
  if (!pool) {
    throw new Error(
      `Veritabanı bağlantısı yapılandırılmamış. Lütfen ${DB_URL_ENV_KEYS.join(', ')} değişkenlerinden birini sağlayın.`,
    );
  }

  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

async function withTransaction(callback) {
  if (!pool) {
    throw new Error(
      `Veritabanı bağlantısı yapılandırılmamış. Lütfen ${DB_URL_ENV_KEYS.join(', ')} değişkenlerinden birini sağlayın.`,
    );
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  query,
  withTransaction,
};