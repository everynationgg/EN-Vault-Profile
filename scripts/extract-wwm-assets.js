const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadDir = 'C:/Users/yoggn/.gemini/antigravity-ide/brain/bd923fe8-93a3-40d6-8d43-7106c3c3cf16/.user_uploaded';
const outDir = path.join(__dirname, '../public/assets/themes/where_winds_meet');
const brandingDir = path.join(__dirname, '../public/assets/branding');

async function run() {
  const placeholdersImg = sharp(uploadDir + '/media_1788536584101.png');
  const { data, info } = await placeholdersImg.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // 1. Crop 3D EN Medallion from top right
  // Medallion only (1024x576): { minX: 878, maxX: 943, minY: 86, maxY: 148, w: 65, h: 62 }
  // Let's crop with a couple px padding
  await sharp(uploadDir + '/media_1788536584101.png')
    .extract({ left: 876, top: 85, width: 70, height: 65 })
    .png()
    .toFile(path.join(brandingDir, 'en_vault_medallion.png'));
  console.log('Saved en_vault_medallion.png');

  // 2. Crop 1 Where Winds Meet Achievement Badge
  // Badge 1 (1024x576): minX: 403, maxX: 491, minY: 390, maxY: 474
  await sharp(uploadDir + '/media_1788536584101.png')
    .extract({ left: 402, top: 388, width: 90, height: 88 })
    .png()
    .toFile(path.join(outDir, 'where_winds_meet_achievement_badge.png'));
  console.log('Saved where_winds_meet_achievement_badge.png');

  // 3. Find center X of each badge
  const ranges = [
    [400, 495],
    [500, 595],
    [600, 695],
    [700, 795],
    [800, 895]
  ];
  ranges.forEach(([start, end], idx) => {
    let minX = width, maxX = 0;
    for (let y = 390; y < 475; y++) {
      for (let x = start; x < end; x++) {
        const a = data[(y * width + x) * channels + 3];
        if (a > 20) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
        }
      }
    }
    const cx = (minX + maxX) / 2;
    console.log('Badge ' + (idx + 1) + ': 1024 cx=' + cx.toFixed(1) + ', 1200 cx=' + (cx * 1200 / 1024).toFixed(1));
  });
}

run().catch(console.error);
