const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '../public/assets/themes/palworld');

async function createCardFrame() {
  const bg = sharp(path.join(outDir, 'palworld_profile_background.jpg'));
  const { width, height } = await bg.metadata();

  // Create SVG mask for the inner transparent area
  // In 1200x675:
  // Outer frame has:
  // Top-left banner extends to x=140, y=260
  // Top-right banner extends to x=1060, y=260
  // Top center emblem extends to y=150, x=530..670
  // Bottom center emblem extends to y=525, x=530..670
  // Bottom-left lamball extends to x=160, y=515
  // Bottom-right lamball extends to x=1040, y=515
  // Top bar inner edge: y=82
  // Bottom bar inner edge: y=593
  // Left bar inner edge: x=82
  // Right bar inner edge: x=1118

  // We construct an SVG path mask where black = transparent (the center landscape), white = opaque (the frame and totems)
  const maskSvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <!-- Whole canvas white (keep frame) -->
    <rect width="1200" height="675" fill="white" />

    <!-- Center hole punched out in black (transparent) with margin away from banners/totems -->
    <!-- Top-left banner reaches ~150px, Top center reaches y=155, Top-right reaches ~1050 -->
    <path d="
      M 160 90
      L 520 90
      Q 540 160 600 160
      Q 660 160 680 90
      L 1040 90
      L 1040 270
      L 1115 270
      L 1115 510
      L 1040 510
      L 1040 585
      L 680 585
      Q 660 515 600 515
      Q 540 515 520 585
      L 160 585
      L 160 510
      L 85 510
      L 85 270
      L 160 270
      Z
    " fill="black" />
  </svg>`;

  const maskBuffer = await sharp(Buffer.from(maskSvg))
    .png()
    .toBuffer();

  // Composite the mask onto the image as an alpha channel
  const rawBg = await sharp(path.join(outDir, 'palworld_profile_background.jpg'))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rawMask = await sharp(maskBuffer)
    .resize(1200, 675)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Apply mask to alpha channel
  for (let i = 0; i < rawBg.data.length / 4; i++) {
    const maskVal = rawMask.data[i * rawMask.info.channels]; // red channel of mask
    rawBg.data[i * 4 + 3] = maskVal; // set alpha
  }

  await sharp(rawBg.data, {
    raw: {
      width: 1200,
      height: 675,
      channels: 4,
    },
  })
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(path.join(outDir, 'palworld_card_frame.png'));

  console.log('Saved palworld_card_frame.png (1200x675 with transparent center!)');
}

createCardFrame().catch(console.error);
