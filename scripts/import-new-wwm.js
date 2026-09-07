const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadDir = 'C:/Users/yoggn/.gemini/antigravity-ide/brain/bd923fe8-93a3-40d6-8d43-7106c3c3cf16/.user_uploaded';
const outDir = path.join(__dirname, '../public/assets/themes/where_winds_meet');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function process() {
  console.log('1. Processing Frame (Background + Outer Frame)...');
  await sharp(uploadDir + '/media_1788536584230.jpg')
    .resize(1200, 675, { kernel: 'lanczos3' })
    .jpeg({ quality: 95 })
    .toFile(outDir + '/where_winds_meet_profile_background.jpg');
  console.log('   -> where_winds_meet_profile_background.jpg done!');

  console.log('2. Processing Avatar Frame (1200x675 full canvas)...');
  await sharp(uploadDir + '/media_1788536584177.png')
    .resize(1200, 675, { kernel: 'lanczos3' })
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(outDir + '/where_winds_meet_avatar_frame.png');
  console.log('   -> where_winds_meet_avatar_frame.png done!');

  console.log('3. Processing Title Frame (1200x675 full canvas)...');
  await sharp(uploadDir + '/media_1788536584137.png')
    .resize(1200, 675, { kernel: 'lanczos3' })
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(outDir + '/where_winds_meet_title_frame.png');
  console.log('   -> where_winds_meet_title_frame.png done!');

  console.log('4. Copying reference & placeholders for calibration...');
  await sharp(uploadDir + '/media_1788536584210.jpg')
    .resize(1200, 675, { kernel: 'lanczos3' })
    .toFile(outDir + '/where_winds_meet_reference_look.jpg');

  await sharp(uploadDir + '/media_1788536584101.png')
    .resize(1200, 675, { kernel: 'lanczos3' })
    .toFile(outDir + '/where_winds_meet_placeholders.png');

  console.log('All files imported successfully!');
}

process().catch(console.error);
