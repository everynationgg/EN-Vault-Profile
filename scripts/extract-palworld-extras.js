const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '../public/assets/themes/palworld');

async function extractEmblemAndBadge() {
  const bg = sharp(path.join(outDir, 'palworld_profile_background.jpg'));

  // Top center emblem (Yellow Bunny Crest with leaves):
  // in 1200x675: center at x=600, y=85. Crop 160x160: left=520, top=5
  await sharp(path.join(outDir, 'palworld_profile_background.jpg'))
    .extract({ left: 520, top: 5, width: 160, height: 160 })
    .png()
    .toFile(path.join(outDir, 'palworld_emblem.png'));
  console.log('Saved palworld_emblem.png');

  // Lamball bottom-left badge:
  // in 1200x675: center at x=80, y=595. Crop 130x130: left=15, top=530
  await sharp(path.join(outDir, 'palworld_profile_background.jpg'))
    .extract({ left: 15, top: 530, width: 130, height: 130 })
    .png()
    .toFile(path.join(outDir, 'palworld_badge_lamball.png'));
  console.log('Saved palworld_badge_lamball.png');

  // Yellow bunny top-left badge:
  // in 1200x675: left=15, top=15, width=130, height=130
  await sharp(path.join(outDir, 'palworld_profile_background.jpg'))
    .extract({ left: 15, top: 15, width: 130, height: 130 })
    .png()
    .toFile(path.join(outDir, 'palworld_badge_bunny.png'));
  console.log('Saved palworld_badge_bunny.png');
}

extractEmblemAndBadge().catch(console.error);
