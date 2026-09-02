const fs = require('fs');
const path = require('path');

// Simple PNG dimension reader without external deps
function getPngDimensions(filePath) {
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(24);
  fs.readSync(fd, buffer, 0, 24, 0);
  fs.closeSync(fd);
  
  if (buffer.toString('ascii', 1, 4) === 'PNG') {
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  }
  return null;
}

const dir = path.join(__dirname, '../public/assets/themes/mystic_cat');
const files = fs.readdirSync(dir);

files.forEach(f => {
  const p = path.join(dir, f);
  const dim = getPngDimensions(p);
  console.log(`${f}: ${dim ? `${dim.width}x${dim.height}px` : 'unknown'}`);
});
