/* eslint-disable unicorn/prefer-top-level-await */
// migrate.js
const { Client } = require('pg');
const fs = require('node:fs');
const path = require('node:path');
const { getDatabaseUrl, DB_URL_ENV_KEYS } = require('./lib/config');

// D1 (SQLite) SQL'ini PostgreSQL'e dönüştüren basit bir fonksiyon
function convertToPg(sqliteSql) {
    return sqliteSql
        .replaceAll('INTEGER PRIMARY KEY AUTOINCREMENT', 'SERIAL PRIMARY KEY')
        .replaceAll('-- D1 Uyumlu SQL Şeması', '-- PostgreSQL Uyumlu SQL Şeması');
}

(async () => {
    const connectionString = getDatabaseUrl();
    if (!connectionString) {
        console.error(`Hata: ${DB_URL_ENV_KEYS.join(', ')} ortam değişkenlerinden en az biri ayarlanmamış.`);
        process.exit(1);
    }

    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log('Veritabanına başarıyla bağlanıldı.');

        const sqlFilePath = path.join(__dirname, 'edevletaidat.sql');
        const sqliteSql = fs.readFileSync(sqlFilePath, 'utf8');
        const pgSql = convertToPg(sqliteSql);

        console.log('PostgreSQL\'e dönüştürülmüş SQL çalıştırılıyor...');

        // SQL komutlarını tek tek çalıştır
        const commands = pgSql.split(';').filter((cmd) => cmd.trim() !== '');
        for (const command of commands) {
            await client.query(command);
        }

        console.log('Veritabanı şeması başarıyla oluşturuldu.');
    } catch (err) {
        console.error('Veritabanı göçü sırasında hata oluştu:', err);
        process.exit(1);
    } finally {
        await client.end();
        console.log('Veritabanı bağlantısı kapatıldı.');
    }
})();
