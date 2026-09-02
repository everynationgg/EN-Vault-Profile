const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/yoggn/Downloads/EN Vault Profile';
const destDir = path.join(__dirname, '../public/assets/themes/mystic_cat');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
console.log('Files in source directory:');
files.forEach(f => {
  const srcFile = path.join(srcDir, f);
  const destFile = path.join(destDir, f.replace(/\s+/g, '_').toLowerCase());
  fs.copyFileSync(srcFile, destFile);
  const stat = fs.statSync(destFile);
  console.log(`- Copied: ${f} -> ${destFile} (${Math.round(stat.size / 1024)} KB)`);
});
