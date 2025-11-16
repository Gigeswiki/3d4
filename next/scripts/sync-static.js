const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    return;
  }

  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    ensureDir(dest);
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function cleanDirectory(dest) {
  if (!fs.existsSync(dest)) return;
  for (const entry of fs.readdirSync(dest)) {
    const entryPath = path.join(dest, entry);
    fs.rmSync(entryPath, { recursive: true, force: true });
  }
}

function syncPair(srcRelative, destRelative) {
  const src = path.join(rootDir, srcRelative);
  const dest = path.join(rootDir, destRelative);
  if (!fs.existsSync(src)) {
    return;
  }

  ensureDir(dest);
  cleanDirectory(dest);
  copyRecursive(src, dest);
}

try {
  syncPair('assets', path.join('public', 'assets'));
  syncPair(path.join('admin', 'assets'), path.join('public', 'admin'));
  console.log('Statik assetler senkronize edildi.');
} catch (error) {
  console.error('Statik assetleri kopyalarken hata oluştu:', error);
  process.exit(1);
}