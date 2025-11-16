// migrate.js
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { getDatabaseUrl, DB_URL_ENV_KEYS } = require('./lib/config');

// D1 (SQLite) SQL'ini PostgreSQL'e dönüştüren basit bir fonksiyon
function convertToPg(sqliteSql) {
    let pgSql = sqliteSql
        .replaceAll(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY')
        .replaceAll(/CREATE TABLE IF NOT EXISTS/g, 'CREATE TABLE IF NOT EXISTS')
        .replaceAll(/CREATE INDEX IF NOT EXISTS/g, 'CREATE INDEX IF NOT EXISTS')
        .replaceAll(/TEXT/g, 'TEXT')
        .replaceAll(/INTEGER/g, 'INTEGER');

    // SQLite'a özgü ifadeleri kaldır
    pgSql = pgSql.replaceAll(/-- D1 Uyumlu SQL Şeması/g, '-- PostgreSQL Uyumlu SQL Şeması');

    return pgSql;
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
