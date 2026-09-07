const sharp = require('sharp');

const uploadDir = 'C:/Users/yoggn/.gemini/antigravity-ide/brain/bd923fe8-93a3-40d6-8d43-7106c3c3cf16/.user_uploaded';

async function measureAvatar() {
  const img = sharp(uploadDir + '/media_1788536584177.png');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  console.log('Avatar frame image info:', info);

  // Measure the circular hole (where alpha is 0 in the central avatar area)
  // Let's sample horizontal line across the center of avatar ~ y = 250 in 1024-space
  let holeLeft = width, holeRight = 0, holeTop = height, holeBottom = 0;
  for (let y = 100; y < 400; y++) {
    for (let x = 100; x < 400; x++) {
      const a = data[(y * width + x) * channels + 3];
      // In the middle of the avatar aperture, alpha is 0
      if (a === 0) {
        if (x < holeLeft) holeLeft = x;
        if (x > holeRight) holeRight = x;
        if (y < holeTop) holeTop = y;
        if (y > holeBottom) holeBottom = y;
      }
    }
  }
  const cx1024 = (holeLeft + holeRight) / 2;
  const cy1024 = (holeTop + holeBottom) / 2;
  const r1024 = (holeRight - holeLeft) / 2;
  console.log('Aperture in 1024x576:', { holeLeft, holeRight, holeTop, holeBottom, cx1024, cy1024, r1024 });
  console.log('Aperture in 1200x675:', {
    cx1200: (cx1024 * 1200 / 1024).toFixed(1),
    cy1200: (cy1024 * 675 / 576).toFixed(1),
    r1200: (r1024 * 1200 / 1024).toFixed(1)
  });
}

measureAvatar().catch(console.error);
