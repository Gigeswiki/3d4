function parseForwardedHeader(header = '') {
  if (!header) return null;
  return header.split(',').map((ip) => ip.trim()).find(Boolean) || null;
}

function getClientIp(event) {
  const headers = event?.headers || {};
  const cloudflareIp = headers['cf-connecting-ip'] || headers['CF-Connecting-IP'];
  if (cloudflareIp) return cloudflareIp;

  const forwardedFor = headers['x-forwarded-for'] || headers['X-Forwarded-For'];
  const forwardedIp = parseForwardedHeader(forwardedFor);
  if (forwardedIp) return forwardedIp;

  const clientIp = headers['x-client-ip'] || headers['X-Client-Ip'];
  if (clientIp) return clientIp;

  return event?.requestContext?.identity?.sourceIp || '0.0.0.0';
}

module.exports = {
  getClientIp,
};