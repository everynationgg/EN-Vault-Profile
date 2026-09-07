const fs = require('fs');
const path = require('path');
const framesDir = path.join(__dirname, '../public/assets/frames');
const titlesDir = path.join(__dirname, '../public/assets/titles');

console.log('--- FRAMES ---');
fs.readdirSync(framesDir).forEach(f => {
  const content = fs.readFileSync(path.join(framesDir, f), 'utf8');
  const m = content.match(/viewBox=["']([^"']+)["']/);
  console.log(f, 'viewBox:', m ? m[1] : 'none');
});

console.log('--- TITLES ---');
fs.readdirSync(titlesDir).forEach(f => {
  const content = fs.readFileSync(path.join(titlesDir, f), 'utf8');
  const m = content.match(/viewBox=["']([^"']+)["']/);
  console.log(f, 'viewBox:', m ? m[1] : 'none');
});

