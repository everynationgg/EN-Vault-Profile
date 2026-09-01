// Extended Asset Generator for EN Vault Profile
const fs = require('fs');
const path = require('path');

const dirs = [
  'public/assets/branding',
  'public/assets/frames',
  'public/assets/themes',
  'public/assets/emblems',
  'public/assets/titles',
  'public/assets/badges'
];

dirs.forEach(d => {
  const fullPath = path.join(__dirname, '..', d);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

function writeSvg(relPath, content) {
  const fullPath = path.join(__dirname, '..', relPath);
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
}

// --------------------------------------------------------------------
// CARD FRAMES
// --------------------------------------------------------------------
writeSvg('public/assets/frames/card_crimson.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <linearGradient id="crimsonBrd" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185"/>
      <stop offset="50%" stop-color="#E11D48"/>
      <stop offset="100%" stop-color="#881337"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="1188" height="663" rx="24" stroke="url(#crimsonBrd)" stroke-width="4.5" fill="none"/>
  <rect x="16" y="16" width="1168" height="643" rx="18" stroke="#E11D48" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="8 6" fill="none"/>
  <polygon points="6,60 30,6 60,6 6,60" fill="#FB7185"/>
  <polygon points="1194,60 1170,6 1140,6 1194,60" fill="#FB7185"/>
</svg>`);

writeSvg('public/assets/frames/card_emerald.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <linearGradient id="emBrd" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="50%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#064E3B"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="1188" height="663" rx="24" stroke="url(#emBrd)" stroke-width="4.5" fill="none"/>
  <rect x="16" y="16" width="1168" height="643" rx="18" stroke="#10B981" stroke-width="1.5" stroke-opacity="0.4" fill="none"/>
  <circle cx="28" cy="28" r="5" fill="#34D399"/>
  <circle cx="1172" cy="28" r="5" fill="#34D399"/>
</svg>`);

// Ornate Corner Bevels Frame (Matching reference screenshot exactly!)
writeSvg('public/assets/frames/card_vault_legendary.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <linearGradient id="vltGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="40%" stop-color="#F59E0B"/>
      <stop offset="70%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
    <linearGradient id="vltPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E879F9"/>
      <stop offset="50%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#6B21A8"/>
    </linearGradient>
    <filter id="vaultGlow" x="-5%" y="-5%" width="110%" height="110%">
      <feGaussianBlur stdDeviation="5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Outer Gold Border -->
  <rect x="6" y="6" width="1188" height="663" rx="24" stroke="url(#vltGoldGrad)" stroke-width="4.5" fill="none" filter="url(#vaultGlow)"/>
  <rect x="14" y="14" width="1172" height="647" rx="18" stroke="url(#vltPurpleGrad)" stroke-width="2.5" fill="none"/>
  
  <!-- Ornate Crystalline Corner Crystals (Top-Left) -->
  <g transform="translate(0, 0)">
    <polygon points="6,90 25,45 45,25 90,6 30,6 6,30" fill="url(#vltPurpleGrad)"/>
    <polygon points="20,20 40,30 30,40" fill="#FDE68A"/>
    <polygon points="4,40 18,18 40,4" stroke="#E879F9" stroke-width="2" fill="none"/>
  </g>
  <!-- Top-Right -->
  <g transform="translate(1200, 0) scale(-1, 1)">
    <polygon points="6,90 25,45 45,25 90,6 30,6 6,30" fill="url(#vltPurpleGrad)"/>
    <polygon points="20,20 40,30 30,40" fill="#FDE68A"/>
    <polygon points="4,40 18,18 40,4" stroke="#E879F9" stroke-width="2" fill="none"/>
  </g>
  <!-- Bottom-Left -->
  <g transform="translate(0, 675) scale(1, -1)">
    <polygon points="6,90 25,45 45,25 90,6 30,6 6,30" fill="url(#vltGoldGrad)"/>
    <polygon points="20,20 40,30 30,40" fill="#E879F9"/>
  </g>
  <!-- Bottom-Right -->
  <g transform="translate(1200, 675) scale(-1, -1)">
    <polygon points="6,90 25,45 45,25 90,6 30,6 6,30" fill="url(#vltGoldGrad)"/>
    <polygon points="20,20 40,30 30,40" fill="#E879F9"/>
  </g>
</svg>`);

// --------------------------------------------------------------------
// AVATAR FRAMES
// --------------------------------------------------------------------
writeSvg('public/assets/frames/avatar_crimson.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none">
  <defs>
    <linearGradient id="avCrim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185"/>
      <stop offset="50%" stop-color="#E11D48"/>
      <stop offset="100%" stop-color="#881337"/>
    </linearGradient>
  </defs>
  <circle cx="80" cy="80" r="74" stroke="url(#avCrim)" stroke-width="5" fill="none"/>
  <polygon points="80,0 88,16 72,16" fill="#FB7185"/>
  <polygon points="80,160 88,144 72,144" fill="#FB7185"/>
</svg>`);

writeSvg('public/assets/frames/avatar_emerald.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none">
  <defs>
    <linearGradient id="avEm" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="50%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#064E3B"/>
    </linearGradient>
  </defs>
  <circle cx="80" cy="80" r="74" stroke="url(#avEm)" stroke-width="5" fill="none"/>
  <circle cx="80" cy="6" r="4" fill="#34D399"/>
  <circle cx="80" cy="154" r="4" fill="#34D399"/>
</svg>`);

// Ornate Violet Crest Avatar Frame (Matching reference screenshot exactly!)
writeSvg('public/assets/frames/avatar_vault_seeker.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none">
  <defs>
    <linearGradient id="avSeeker" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E879F9"/>
      <stop offset="50%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#6B21A8"/>
    </linearGradient>
    <filter id="avGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Outer Ornate Ring -->
  <circle cx="80" cy="80" r="74" stroke="url(#avSeeker)" stroke-width="5.5" fill="none" filter="url(#avGlow)"/>
  <circle cx="80" cy="80" r="67" stroke="#C084FC" stroke-width="1.5" stroke-dasharray="10 5" fill="none"/>
  <!-- Top Crest Diamond -->
  <polygon points="80,0 89,14 80,24 71,14" fill="#E879F9"/>
  <!-- Bottom Crest Gem -->
  <polygon points="80,136 92,150 80,164 68,150" fill="#E879F9"/>
  <circle cx="80" cy="150" r="3.5" fill="#FFFFFF"/>
</svg>`);

// --------------------------------------------------------------------
// FULL BACKGROUND THEMES (Matching reference screenshot tiles!)
// --------------------------------------------------------------------
writeSvg('public/assets/themes/bg_violet_storm.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <radialGradient id="vStorm" cx="30%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#3B0764"/>
      <stop offset="40%" stop-color="#1E1B4B"/>
      <stop offset="100%" stop-color="#07040D"/>
    </radialGradient>
    <linearGradient id="vLtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E879F9"/>
      <stop offset="100%" stop-color="#A855F7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#vStorm)"/>
  <!-- Lightning Arcs Surrounding Avatar and Borders -->
  <path d="M 0 150 L 140 220 L 90 280 L 180 340 L 100 420 L 220 480" stroke="url(#vLtGrad)" stroke-width="2.5" opacity="0.6" fill="none"/>
  <path d="M 1200 180 L 1080 240 L 1120 310 L 1020 380 L 1100 460 L 980 520" stroke="url(#vLtGrad)" stroke-width="2.5" opacity="0.6" fill="none"/>
  <circle cx="170" cy="225" r="130" fill="#A855F7" opacity="0.12"/>
</svg>`);

writeSvg('public/assets/themes/bg_molten_cavern.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <radialGradient id="mCavern" cx="50%" cy="80%" r="85%">
      <stop offset="0%" stop-color="#7C2D12"/>
      <stop offset="40%" stop-color="#291409"/>
      <stop offset="100%" stop-color="#080402"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#mCavern)"/>
  <circle cx="200" cy="500" r="4" fill="#F59E0B" opacity="0.8"/>
  <circle cx="450" cy="420" r="5" fill="#EF4444" opacity="0.7"/>
  <circle cx="850" cy="480" r="4.5" fill="#FBBF24" opacity="0.75"/>
</svg>`);

writeSvg('public/assets/themes/bg_emerald_grove.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <radialGradient id="eGrove" cx="50%" cy="50%" r="80%">
      <stop offset="0%" stop-color="#064E3B"/>
      <stop offset="50%" stop-color="#022C22"/>
      <stop offset="100%" stop-color="#01140E"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#eGrove)"/>
  <circle cx="300" cy="300" r="6" fill="#34D399" opacity="0.4"/>
  <circle cx="900" cy="200" r="8" fill="#10B981" opacity="0.3"/>
</svg>`);

writeSvg('public/assets/themes/bg_deep_chasm.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <radialGradient id="dChasm" cx="60%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#0C4A6E"/>
      <stop offset="50%" stop-color="#082F49"/>
      <stop offset="100%" stop-color="#020B14"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#dChasm)"/>
</svg>`);

writeSvg('public/assets/themes/bg_solar_flare.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <radialGradient id="sFlare" cx="80%" cy="20%" r="80%">
      <stop offset="0%" stop-color="#B45309"/>
      <stop offset="45%" stop-color="#451A03"/>
      <stop offset="100%" stop-color="#0B0604"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#sFlare)"/>
</svg>`);

console.log('Successfully generated all additional UI reference assets!');
