/* eslint-disable prefer-top-level-await */
const { Client } = require('pg');
const crypto = require('node:crypto');

(async () => {
  const connectionString = process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    console.error('NEON_DATABASE_URL ortam değişkeni ayarlanmamış.');
    process.exit(1);
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('Neon veritabanına bağlanıldı.');

    await client.query('ALTER TABLE IF EXISTS sazan ADD COLUMN IF NOT EXISTS session_token TEXT UNIQUE');
    await client.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_session_token ON sazan(session_token)');

    const { rows } = await client.query("SELECT id FROM sazan WHERE session_token IS NULL OR session_token = ''");

    for (const row of rows) {
      const token = crypto.randomBytes(24).toString('hex');
      await client.query('UPDATE sazan SET session_token = $1 WHERE id = $2', [token, row.id]);
    }

    console.log(`Toplam ${rows.length} kayıt güncellendi.`);
  } catch (error) {
    console.error('session_token kolonunu güncellerken hata oluştu:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Veritabanı bağlantısı kapatıldı.');
  }
})();
