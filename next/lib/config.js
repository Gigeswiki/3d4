const DB_URL_ENV_KEYS = [
  'NEON_DATABASE_URL',
  'DATABASE_URL',
  'PG_CONNECTION_STRING',
  'POSTGRES_URL',
  'SUPABASE_DB_URL',
];

function getDatabaseUrl() {
  for (const key of DB_URL_ENV_KEYS) {
    const value = process.env[key];
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }
  return null;
}

module.exports = {
  DB_URL_ENV_KEYS,
  getDatabaseUrl,
};
