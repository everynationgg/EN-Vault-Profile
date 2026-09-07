const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadDir = 'C:/Users/yoggn/.gemini/antigravity-ide/brain/bd923fe8-93a3-40d6-8d43-7106c3c3cf16/.user_uploaded';
const outDir = path.join(__dirname, '../public/assets/themes/palworld');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('--- Processing Palworld Assets ---');
  
  // 1. Avatar Frame (media_1788619483968.png)
  // Original is 1024x576 transparent PNG with avatar frame on the left.
  // Resize to standard 1200x675 transparent PNG canvas.
  await sharp(path.join(uploadDir, 'media_1788619483968.png'))
    .resize(1200, 675, { kernel: 'lanczos3' })
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(path.join(outDir, 'palworld_avatar_frame.png'));
  console.log('1. Saved palworld_avatar_frame.png (1200x675 full canvas)');

  // Also create a tightly cropped avatar frame version for preview thumbnails & modular use
  // From our earlier bbox measurement in 1024x576: { minX: 113, maxX: 377, minY: 120, maxY: 391, w: 264, h: 271 }
  await sharp(path.join(uploadDir, 'media_1788619483968.png'))
    .extract({ left: 110, top: 118, width: 272, height: 276 })
    .png({ quality: 95 })
    .toFile(path.join(outDir, 'palworld_avatar_frame_crop.png'));
  console.log('   Saved palworld_avatar_frame_crop.png (for preview tile)');

  // 2. Title Banner (media_1788619484007.png)
  // Original is 1024x576 transparent PNG with banner on the right.
  // Resize to standard 1200x675 transparent PNG canvas.
  await sharp(path.join(uploadDir, 'media_1788619484007.png'))
    .resize(1200, 675, { kernel: 'lanczos3' })
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(path.join(outDir, 'palworld_title_frame.png'));
  console.log('2. Saved palworld_title_frame.png (1200x675 full canvas)');

  // Also create cropped title banner for preview tile
  // From bbox in 1024x576: { minX: 435, maxX: 923, minY: 159, maxY: 327, w: 488, h: 168 }
  await sharp(path.join(uploadDir, 'media_1788619484007.png'))
    .extract({ left: 430, top: 155, width: 498, height: 176 })
    .png({ quality: 95 })
    .toFile(path.join(outDir, 'palworld_title_crop.png'));
  console.log('   Saved palworld_title_crop.png (for preview tile)');

  // 3. Card Frame + Background (media_1788619484071.jpg)
  // Full panoramic background with frame: 1200x675 JPEG
  await sharp(path.join(uploadDir, 'media_1788619484071.jpg'))
    .resize(1200, 675, { kernel: 'lanczos3' })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'palworld_profile_background.jpg'));
  console.log('3. Saved palworld_profile_background.jpg (1200x675)');

  // Also create palworld_card_frame.png with transparent inner area!
  // In media_1788619484071.jpg, let's see what the outer frame looks like.
  // Outer frame borders: width of border is roughly 40-50px in 1024, or ~50-60px in 1200.
  // Top center emblem, bottom center emblem, corner totems.
  // Let's create an alpha mask that keeps the border & corner totems and makes center transparent!
}

run().catch(console.error);
