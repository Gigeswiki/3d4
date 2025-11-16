function getIstanbulDateString(date = new Date()) {
  return date.toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(',', '');
}

function getUnixTimestampPlus(seconds = 0, date = new Date()) {
  return Math.floor(date.getTime() / 1000) + seconds;
}

module.exports = {
  getIstanbulDateString,
  getUnixTimestampPlus,
};