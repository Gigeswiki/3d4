const crypto = require('node:crypto');

const COOKIE_NAME = 'sessionToken';
const ADMIN_COOKIE_NAME = 'adminSession';

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

function getSessionToken(headers = {}, isAdmin = false) {
  const cookieHeader = headers.cookie || headers.Cookie || '';
  const cookies = parseCookies(cookieHeader);
  return cookies[isAdmin ? ADMIN_COOKIE_NAME : COOKIE_NAME] || null;
}

function buildCookie(token, { maxAge = 60 * 60 * 6, isAdmin = false } = {}) {
  const secure = process.env.NETLIFY_DEV === 'true' ? '' : ' Secure;';
  return `${isAdmin ? ADMIN_COOKIE_NAME : COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=${maxAge}`;
}

function createSessionToken() {
  return crypto.randomBytes(24).toString('hex');
}

module.exports = {
  COOKIE_NAME,
  ADMIN_COOKIE_NAME,
  getSessionToken,
  buildCookie,
  createSessionToken,
};