const fs = require('fs');
const path = require('path');

const targetDirs = [
  'C:/Users/yoggn/Downloads',
  'C:/Users/yoggn/Pictures',
  'C:/Users/yoggn/Desktop',
  'C:/Users/yoggn/AppData/Local/Temp',
  'C:/Users/yoggn/.gemini/antigravity-ide',
  'c:/Users/yoggn/EN Vault Profile',
];

const now = Date.now();
const oneHourAgo = now - 3600 * 1000;

function scan(dir, depth = 0) {
  if (depth > 4) return;
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const f of files) {
      const full = path.join(dir, f.name);
      if (f.isDirectory()) {
        if (!f.name.startsWith('.') && f.name !== 'node_modules' && f.name !== '.next') {
          scan(full, depth + 1);
        }
      } else if (f.isFile() && /\.(png|jpe?g|webp)$/i.test(f.name)) {
        const stat = fs.statSync(full);
        if (stat.mtimeMs > oneHourAgo) {
          console.log(`Found: ${full} (${Math.round(stat.size / 1024)} KB, ${new Date(stat.mtimeMs).toLocaleTimeString()})`);
        }
      }
    }
  } catch (e) {}
}

for (const d of targetDirs) {
  scan(d);
}
