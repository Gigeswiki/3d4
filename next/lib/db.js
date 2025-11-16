const { Pool, neonConfig } = require('@neondatabase/serverless');

neonConfig.fetchConnectionCache = true;

const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.warn('NEON_DATABASE_URL tanımlı değil. Veritabanı sorguları başarısız olacaktır.');
}

const pool = connectionString
  ? new Pool({
      connectionString,
    })
  : null;

async function query(text, params = []) {
  if (!pool) {
    throw new Error('Veritabanı bağlantısı yapılandırılmamış. NEON_DATABASE_URL kontrol edin.');
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
    throw new Error('Veritabanı bağlantısı yapılandırılmamış.');
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