// Script to generate all SVG static cosmetic assets for EN Profile
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
  const fullPath = path.join(__dirname, d);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Helper to write SVG file
function writeSvg(relPath, content) {
  const fullPath = path.join(__dirname, relPath);
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
  console.log('Created:', relPath);
}

// --------------------------------------------------------------------
// 1. BRANDING ASSETS
// --------------------------------------------------------------------
writeSvg('public/assets/branding/en_logo.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="none">
  <defs>
    <linearGradient id="enGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#818CF8"/>
      <stop offset="100%" stop-color="#C084FC"/>
    </linearGradient>
  </defs>
  <g transform="translate(10, 10)">
    <!-- EN Shield Crest -->
    <path d="M20 0 L36 8 L36 28 L20 40 L4 28 L4 8 Z" fill="#0F172A" stroke="url(#enGrad)" stroke-width="2.5"/>
    <path d="M20 6 L30 12 L30 25 L20 33 L10 25 L10 12 Z" fill="url(#enGrad)" opacity="0.2"/>
    <path d="M14 16 L26 16 M14 20 L22 20 M14 24 L26 24" stroke="url(#enGrad)" stroke-width="2" stroke-linecap="round"/>
  </g>
  <text x="58" y="32" font-family="Rajdhani, Outfit, sans-serif" font-weight="800" font-size="20" fill="#FFFFFF" letter-spacing="3">EVERY NATION</text>
  <text x="59" y="44" font-family="Rajdhani, Outfit, sans-serif" font-weight="600" font-size="10" fill="#94A3B8" letter-spacing="4">VAULT PROFILE</text>
</svg>`);

writeSvg('public/assets/branding/vault_coin_icon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="#1E1B18" stroke="url(#goldGrad)" stroke-width="4" filter="url(#goldGlow)"/>
  <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="url(#goldGrad)" opacity="0.25"/>
  <path d="M50 25 L65 45 L55 45 L55 75 L45 75 L45 45 L35 45 Z" fill="url(#goldGrad)"/>
</svg>`);

// --------------------------------------------------------------------
// 2. CARD FRAMES (1200 x 675 px)
// --------------------------------------------------------------------
writeSvg('public/assets/frames/card_silver.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <linearGradient id="silverBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="25%" stop-color="#64748B"/>
      <stop offset="50%" stop-color="#F8FAFC"/>
      <stop offset="75%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <filter id="subtleGlow" x="-5%" y="-5%" width="110%" height="110%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <!-- Outer Rounded Border -->
  <rect x="6" y="6" width="1188" height="663" rx="28" stroke="url(#silverBorder)" stroke-width="3.5" fill="none" filter="url(#subtleGlow)"/>
  <rect x="14" y="14" width="1172" height="647" rx="22" stroke="#475569" stroke-width="1" stroke-opacity="0.4" fill="none"/>
  
  <!-- Corner Tech Accents -->
  <!-- Top Left -->
  <path d="M 6 60 L 6 34 A 28 28 0 0 1 34 6 L 60 6" stroke="#FFFFFF" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <circle cx="70" cy="18" r="3" fill="#38BDF8"/>
  <circle cx="82" cy="18" r="2" fill="#94A3B8"/>
  <!-- Top Right -->
  <path d="M 1140 6 L 1166 6 A 28 28 0 0 1 1194 34 L 1194 60" stroke="#FFFFFF" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <circle cx="1130" cy="18" r="3" fill="#38BDF8"/>
  <!-- Bottom Left -->
  <path d="M 6 615 L 6 641 A 28 28 0 0 0 34 669 L 60 669" stroke="#FFFFFF" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <!-- Bottom Right -->
  <path d="M 1140 669 L 1166 669 A 28 28 0 0 0 1194 641 L 1194 615" stroke="#FFFFFF" stroke-width="4.5" fill="none" stroke-linecap="round"/>
</svg>`);

writeSvg('public/assets/frames/card_violet.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <linearGradient id="violetBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C084FC"/>
      <stop offset="50%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#7E22CE"/>
    </linearGradient>
    <filter id="neonGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="8" result="blur1"/>
      <feGaussianBlur stdDeviation="3" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur1"/>
        <feMergeNode in="blur2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect x="6" y="6" width="1188" height="663" rx="28" stroke="url(#violetBorder)" stroke-width="4" fill="none" filter="url(#neonGlow)"/>
  <rect x="16" y="16" width="1168" height="643" rx="20" stroke="#9333EA" stroke-width="1.5" stroke-dasharray="8 6" stroke-opacity="0.6" fill="none"/>
  
  <!-- Cyber Violet Corner Conduits -->
  <path d="M 10 70 L 10 36 A 26 26 0 0 1 36 10 L 70 10 L 80 20 L 30 20 L 20 30 L 20 80 Z" fill="#C084FC" opacity="0.9"/>
  <path d="M 1190 70 L 1190 36 A 26 26 0 0 0 1164 10 L 1130 10 L 1120 20 L 1170 20 L 1180 30 L 1180 80 Z" fill="#C084FC" opacity="0.9"/>
  <path d="M 10 605 L 10 639 A 26 26 0 0 0 36 665 L 70 665 L 80 655 L 30 655 L 20 645 L 20 595 Z" fill="#C084FC" opacity="0.9"/>
  <path d="M 1190 605 L 1190 639 A 26 26 0 0 1 1164 665 L 1130 665 L 1120 655 L 1170 655 L 1180 645 L 1180 595 Z" fill="#C084FC" opacity="0.9"/>
</svg>`);

writeSvg('public/assets/frames/card_flame.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <linearGradient id="flameBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="30%" stop-color="#F59E0B"/>
      <stop offset="70%" stop-color="#EF4444"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <filter id="solarGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect x="6" y="6" width="1188" height="663" rx="28" stroke="url(#flameBorder)" stroke-width="4.5" fill="none" filter="url(#solarGlow)"/>
  <rect x="15" y="15" width="1170" height="645" rx="20" stroke="#F59E0B" stroke-width="1.5" stroke-opacity="0.5" fill="none"/>
  
  <!-- Solar Crest Points -->
  <polygon points="600,4 620,16 580,16" fill="#FDE68A"/>
  <polygon points="600,671 620,659 580,659" fill="#FDE68A"/>
  <polygon points="4,337.5 16,317.5 16,357.5" fill="#FDE68A"/>
  <polygon points="1196,337.5 1184,317.5 1184,357.5" fill="#FDE68A"/>
  
  <circle cx="34" cy="34" r="6" fill="#F59E0B"/>
  <circle cx="1166" cy="34" r="6" fill="#F59E0B"/>
  <circle cx="34" cy="641" r="6" fill="#F59E0B"/>
  <circle cx="1166" cy="641" r="6" fill="#F59E0B"/>
</svg>`);

writeSvg('public/assets/frames/card_obsidian.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <linearGradient id="obsidianGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F43F5E"/>
      <stop offset="50%" stop-color="#881337"/>
      <stop offset="100%" stop-color="#E11D48"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="1188" height="663" rx="28" stroke="url(#obsidianGrad)" stroke-width="5" fill="none"/>
  <path d="M 6 120 L 30 90 L 30 30 L 90 30 L 120 6" stroke="#F43F5E" stroke-width="3" fill="none"/>
  <path d="M 1194 120 L 1170 90 L 1170 30 L 1110 30 L 1080 6" stroke="#F43F5E" stroke-width="3" fill="none"/>
  <rect x="18" y="18" width="1164" height="639" rx="18" stroke="#334155" stroke-width="1.5" fill="none"/>
</svg>`);

writeSvg('public/assets/frames/card_celestial.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <linearGradient id="celestialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="25%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#C084FC"/>
      <stop offset="75%" stop-color="#FDE68A"/>
      <stop offset="100%" stop-color="#FFFFFF"/>
    </linearGradient>
    <filter id="celestialGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="7" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect x="6" y="6" width="1188" height="663" rx="28" stroke="url(#celestialGrad)" stroke-width="5" fill="none" filter="url(#celestialGlow)"/>
  <polygon points="600,1 615,15 600,29 585,15" fill="#FFFFFF"/>
  <polygon points="600,646 615,660 600,674 585,660" fill="#FFFFFF"/>
</svg>`);

// --------------------------------------------------------------------
// 3. AVATAR FRAMES
// --------------------------------------------------------------------
writeSvg('public/assets/frames/avatar_silver.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none">
  <defs>
    <linearGradient id="avSilver" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#94A3B8"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
  </defs>
  <circle cx="80" cy="80" r="74" stroke="url(#avSilver)" stroke-width="4.5" fill="none"/>
  <circle cx="80" cy="80" r="67" stroke="#475569" stroke-width="1.5" stroke-dasharray="6 4" fill="none"/>
  <circle cx="80" cy="6" r="4" fill="#38BDF8"/>
  <circle cx="80" cy="154" r="4" fill="#38BDF8"/>
</svg>`);

writeSvg('public/assets/frames/avatar_violet.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none">
  <defs>
    <linearGradient id="avViolet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E879F9"/>
      <stop offset="50%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#7E22CE"/>
    </linearGradient>
    <filter id="avVGlow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <circle cx="80" cy="80" r="74" stroke="url(#avViolet)" stroke-width="5" fill="none" filter="url(#avVGlow)"/>
  <!-- Lightning Prongs -->
  <polygon points="80,0 86,14 74,14" fill="#E879F9"/>
  <polygon points="80,160 86,146 74,146" fill="#E879F9"/>
  <polygon points="0,80 14,74 14,86" fill="#E879F9"/>
  <polygon points="160,80 146,74 146,86" fill="#E879F9"/>
</svg>`);

writeSvg('public/assets/frames/avatar_flame.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none">
  <defs>
    <linearGradient id="avFlame" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>
  </defs>
  <circle cx="80" cy="80" r="74" stroke="url(#avFlame)" stroke-width="5" fill="none"/>
  <!-- Solar Crown Rays -->
  <polygon points="80,2 88,16 72,16" fill="#FDE68A"/>
  <polygon points="135,25 130,40 120,30" fill="#F59E0B"/>
  <polygon points="25,25 40,30 30,40" fill="#F59E0B"/>
  <circle cx="80" cy="80" r="67" stroke="#F59E0B" stroke-width="1.5" stroke-opacity="0.6" fill="none"/>
</svg>`);

writeSvg('public/assets/frames/avatar_quantum.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none">
  <defs>
    <linearGradient id="avQuantum" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
  </defs>
  <circle cx="80" cy="80" r="74" stroke="url(#avQuantum)" stroke-width="4.5" stroke-dasharray="24 12" fill="none"/>
  <circle cx="80" cy="80" r="66" stroke="#38BDF8" stroke-width="1.5" fill="none"/>
  <rect x="74" y="2" width="12" height="6" rx="2" fill="#38BDF8"/>
  <rect x="74" y="152" width="12" height="6" rx="2" fill="#38BDF8"/>
</svg>`);

writeSvg('public/assets/frames/avatar_crown.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none">
  <defs>
    <linearGradient id="avCrown" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
  </defs>
  <circle cx="80" cy="80" r="74" stroke="url(#avCrown)" stroke-width="5" fill="none"/>
  <!-- Top Imperial Crown -->
  <path d="M55 18 L65 30 L80 10 L95 30 L105 18 L100 36 L60 36 Z" fill="url(#avCrown)"/>
  <circle cx="80" cy="8" r="3.5" fill="#38BDF8"/>
  <circle cx="55" cy="16" r="2.5" fill="#EF4444"/>
  <circle cx="105" cy="16" r="2.5" fill="#EF4444"/>
</svg>`);

// --------------------------------------------------------------------
// 4. THEME LAYERS (1200 x 675 px)
// --------------------------------------------------------------------
// Silver Theme Layers
writeSvg('public/assets/themes/silver_base.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <radialGradient id="silverBaseGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="60%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#silverBaseGrad)"/>
</svg>`);

writeSvg('public/assets/themes/silver_circuit.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <pattern id="silverGrid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#334155" stroke-width="0.75" stroke-opacity="0.35"/>
      <circle cx="60" cy="0" r="1.5" fill="#475569" fill-opacity="0.5"/>
    </pattern>
  </defs>
  <rect width="1200" height="675" fill="url(#silverGrid)"/>
  <!-- Circuit Traces -->
  <path d="M 200 675 L 350 525 L 600 525 L 650 475 L 900 475 L 1050 325" stroke="#475569" stroke-width="2" stroke-opacity="0.3" fill="none"/>
  <path d="M 100 0 L 250 150 L 500 150 L 550 200 L 800 200 L 950 350" stroke="#38BDF8" stroke-width="1.5" stroke-opacity="0.25" fill="none"/>
</svg>`);

writeSvg('public/assets/themes/silver_vignette.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <radialGradient id="silverVignette" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="70%" stop-color="#000000" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
    </radialGradient>
    <linearGradient id="topSheen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#silverVignette)"/>
  <rect width="1200" height="200" fill="url(#topSheen)"/>
</svg>`);

// Violet Theme Layers
writeSvg('public/assets/themes/violet_base.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <radialGradient id="violetBaseGrad" cx="40%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#2E1065"/>
      <stop offset="45%" stop-color="#1E1B4B"/>
      <stop offset="100%" stop-color="#090514"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#violetBaseGrad)"/>
</svg>`);

writeSvg('public/assets/themes/violet_lightning.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <pattern id="violetHex" width="40" height="69.28" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 20 11.55 L 0 0 L 0 23.09 L 20 34.64 L 40 23.09 Z M 0 34.64 L 20 46.19 L 40 34.64 L 40 57.74 L 20 69.28 L 0 57.74 Z" fill="none" stroke="#7C3AED" stroke-width="0.8" stroke-opacity="0.25"/>
    </pattern>
  </defs>
  <rect width="1200" height="675" fill="url(#violetHex)"/>
  <!-- Stylized Lightning Arcs -->
  <path d="M 1200 100 L 1050 220 L 980 180 L 850 320 L 780 280 L 620 450" stroke="#C084FC" stroke-width="2" stroke-opacity="0.4" fill="none"/>
  <path d="M 0 500 L 180 400 L 260 440 L 420 320 L 500 360 L 650 200" stroke="#A855F7" stroke-width="1.8" stroke-opacity="0.35" fill="none"/>
</svg>`);

writeSvg('public/assets/themes/violet_glow.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <radialGradient id="violetGlowGrad" cx="25%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#C084FC" stop-opacity="0.25"/>
      <stop offset="60%" stop-color="#9333EA" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#violetGlowGrad)"/>
</svg>`);

// Flame Theme Layers
writeSvg('public/assets/themes/flame_base.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <radialGradient id="flameBaseGrad" cx="50%" cy="80%" r="80%">
      <stop offset="0%" stop-color="#451A03"/>
      <stop offset="45%" stop-color="#1C1917"/>
      <stop offset="100%" stop-color="#0C0A09"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#flameBaseGrad)"/>
</svg>`);

writeSvg('public/assets/themes/flame_embers.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <!-- Glowing Floating Embers -->
  <circle cx="150" cy="500" r="3" fill="#FDE68A" opacity="0.8"/>
  <circle cx="280" cy="380" r="4.5" fill="#F59E0B" opacity="0.7"/>
  <circle cx="420" cy="540" r="2.5" fill="#EF4444" opacity="0.8"/>
  <circle cx="680" cy="420" r="4" fill="#FDE68A" opacity="0.75"/>
  <circle cx="850" cy="310" r="3.5" fill="#F59E0B" opacity="0.6"/>
  <circle cx="990" cy="480" r="5" fill="#F59E0B" opacity="0.8"/>
  <circle cx="1120" cy="360" r="3" fill="#EF4444" opacity="0.7"/>
  
  <path d="M 0 675 Q 300 550 600 675 T 1200 675 Z" fill="#F59E0B" opacity="0.05"/>
</svg>`);

writeSvg('public/assets/themes/flame_radiance.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <radialGradient id="solarRadiance" cx="80%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.25"/>
      <stop offset="50%" stop-color="#D97706" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#solarRadiance)"/>
</svg>`);

// --------------------------------------------------------------------
// 5. MILESTONE EMBLEMS (Lv 1, 20, 40, 60, 80, 100)
// --------------------------------------------------------------------
writeSvg('public/assets/emblems/emblem_lv1.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="emb1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#CBD5E1"/>
      <stop offset="100%" stop-color="#64748B"/>
    </linearGradient>
  </defs>
  <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" stroke="url(#emb1)" stroke-width="4" fill="#0F172A"/>
  <path d="M50,22 L75,37 L75,63 L50,78 L25,63 L25,37 Z" fill="url(#emb1)" opacity="0.2"/>
  <text x="50" y="58" font-family="Rajdhani, sans-serif" font-weight="700" font-size="24" fill="#E2E8F0" text-anchor="middle">I</text>
</svg>`);

writeSvg('public/assets/emblems/emblem_lv20.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="emb20" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
  </defs>
  <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" stroke="url(#emb20)" stroke-width="4.5" fill="#1C1917"/>
  <!-- Iron Vanguard Blades -->
  <path d="M50 20 L68 50 L50 42 L32 50 Z" fill="url(#emb20)"/>
  <text x="50" y="74" font-family="Rajdhani, sans-serif" font-weight="800" font-size="18" fill="#F59E0B" text-anchor="middle">20</text>
</svg>`);

writeSvg('public/assets/emblems/emblem_lv40.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="emb40" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
  </defs>
  <polygon points="50,5 92,26 92,74 50,95 8,74 8,26" stroke="url(#emb40)" stroke-width="5" fill="#0C4A6E"/>
  <!-- Archon Twin Wings -->
  <path d="M50 16 L74 38 L62 60 L50 50 L38 60 L26 38 Z" fill="url(#emb40)" opacity="0.85"/>
  <text x="50" y="78" font-family="Rajdhani, sans-serif" font-weight="800" font-size="18" fill="#FFFFFF" text-anchor="middle">40</text>
</svg>`);

writeSvg('public/assets/emblems/emblem_lv60.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="emb60" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E879F9"/>
      <stop offset="100%" stop-color="#9333EA"/>
    </linearGradient>
  </defs>
  <polygon points="50,4 94,25 94,75 50,96 6,75 6,25" stroke="url(#emb60)" stroke-width="5" fill="#3B0764"/>
  <!-- Electrum Reaper Scythe Cross -->
  <path d="M30 20 Q50 35 70 20 L50 65 Z" fill="url(#emb60)"/>
  <text x="50" y="80" font-family="Rajdhani, sans-serif" font-weight="800" font-size="18" fill="#F3E8FF" text-anchor="middle">60</text>
</svg>`);

writeSvg('public/assets/emblems/emblem_lv80.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="emb80" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185"/>
      <stop offset="100%" stop-color="#E11D48"/>
    </linearGradient>
  </defs>
  <polygon points="50,3 96,24 96,76 50,97 4,76 4,24" stroke="url(#emb80)" stroke-width="5.5" fill="#4C0519"/>
  <!-- Paragon Monolith Diamond -->
  <polygon points="50,15 76,45 50,68 24,45" fill="url(#emb80)"/>
  <text x="50" y="82" font-family="Rajdhani, sans-serif" font-weight="800" font-size="18" fill="#FFFFFF" text-anchor="middle">80</text>
</svg>`);

writeSvg('public/assets/emblems/emblem_lv100.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="emb100" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="30%" stop-color="#FDE68A"/>
      <stop offset="70%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#C084FC"/>
    </linearGradient>
    <filter id="cstGlow">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <polygon points="50,2 98,24 98,76 50,98 2,76 2,24" stroke="url(#emb100)" stroke-width="6" fill="#0A0817" filter="url(#cstGlow)"/>
  <!-- Sovereign Star -->
  <polygon points="50,10 60,35 85,38 65,54 72,78 50,64 28,78 35,54 15,38 40,35" fill="url(#emb100)"/>
  <text x="50" y="85" font-family="Rajdhani, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">100</text>
</svg>`);

// --------------------------------------------------------------------
// 6. TITLES
// --------------------------------------------------------------------
writeSvg('public/assets/titles/title_pioneer.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 40" fill="none">
  <defs>
    <linearGradient id="tPioneer" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0"/>
      <stop offset="30%" stop-color="#38BDF8" stop-opacity="0.8"/>
      <stop offset="70%" stop-color="#38BDF8" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#38BDF8" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path d="M 10 38 L 230 38" stroke="url(#tPioneer)" stroke-width="2"/>
  <polygon points="120,34 125,38 120,42 115,38" fill="#38BDF8"/>
  <polygon points="10,38 16,34 16,42" fill="#38BDF8"/>
  <polygon points="230,38 224,34 224,42" fill="#38BDF8"/>
</svg>`);

writeSvg('public/assets/titles/title_vanguard.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 40" fill="none">
  <defs>
    <linearGradient id="tVanguard" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C084FC" stop-opacity="0"/>
      <stop offset="50%" stop-color="#A855F7" stop-opacity="1"/>
      <stop offset="100%" stop-color="#C084FC" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path d="M 20 38 L 220 38" stroke="url(#tVanguard)" stroke-width="2.5"/>
  <polygon points="30,34 40,38 30,42" fill="#C084FC"/>
  <polygon points="210,34 200,38 210,42" fill="#C084FC"/>
</svg>`);

writeSvg('public/assets/titles/title_raider.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 40" fill="none">
  <defs>
    <linearGradient id="tRaider" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F43F5E" stop-opacity="0"/>
      <stop offset="50%" stop-color="#E11D48" stop-opacity="1"/>
      <stop offset="100%" stop-color="#F43F5E" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path d="M 15 38 L 225 38" stroke="url(#tRaider)" stroke-width="2"/>
  <polygon points="120,32 126,38 120,44 114,38" fill="#F43F5E"/>
</svg>`);

writeSvg('public/assets/titles/title_archon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 40" fill="none">
  <defs>
    <linearGradient id="tArchon" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0"/>
      <stop offset="50%" stop-color="#FDE68A" stop-opacity="1"/>
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path d="M 10 38 L 230 38" stroke="url(#tArchon)" stroke-width="3"/>
  <polygon points="120,30 128,38 120,46 112,38" fill="#FDE68A"/>
</svg>`);

writeSvg('public/assets/titles/title_sovereign.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 40" fill="none">
  <defs>
    <linearGradient id="tSov" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0"/>
      <stop offset="30%" stop-color="#FDE68A" stop-opacity="1"/>
      <stop offset="70%" stop-color="#C084FC" stop-opacity="1"/>
      <stop offset="100%" stop-color="#38BDF8" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path d="M 5 38 L 235 38" stroke="url(#tSov)" stroke-width="3.5"/>
  <polygon points="120,28 130,38 120,48 110,38" fill="#FFFFFF"/>
</svg>`);

// --------------------------------------------------------------------
// 7. ACHIEVEMENT BADGES (5 Showcase Slots)
// --------------------------------------------------------------------
writeSvg('public/assets/badges/badge_boss.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none">
  <defs>
    <linearGradient id="bgBoss" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EF4444"/>
      <stop offset="100%" stop-color="#991B1B"/>
    </linearGradient>
  </defs>
  <circle cx="40" cy="40" r="38" fill="#1C1917" stroke="url(#bgBoss)" stroke-width="3"/>
  <!-- Skull Icon -->
  <path d="M40 18 C30 18 24 24 24 34 C24 42 28 46 32 48 L32 56 L48 56 L48 48 C52 46 56 42 56 34 C56 24 50 18 40 18 Z" fill="url(#bgBoss)"/>
  <circle cx="34" cy="34" r="3.5" fill="#1C1917"/>
  <circle cx="46" cy="34" r="3.5" fill="#1C1917"/>
  <rect x="36" y="50" width="2.5" height="6" fill="#1C1917"/>
  <rect x="41.5" y="50" width="2.5" height="6" fill="#1C1917"/>
</svg>`);

writeSvg('public/assets/badges/badge_vault.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none">
  <defs>
    <linearGradient id="bgVault" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
  </defs>
  <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="#1C1917" stroke="url(#bgVault)" stroke-width="3"/>
  <!-- Coin Stack -->
  <ellipse cx="40" cy="32" rx="18" ry="7" fill="url(#bgVault)"/>
  <path d="M22 32 C22 37 30 42 40 42 C50 42 58 37 58 32 L58 42 C58 47 50 52 40 52 C30 52 22 47 22 42 Z" fill="url(#bgVault)" opacity="0.8"/>
  <path d="M22 42 C22 47 30 52 40 52 C50 52 58 47 58 42 L58 52 C58 57 50 62 40 62 C30 62 22 57 22 52 Z" fill="url(#bgVault)" opacity="0.6"/>
</svg>`);

writeSvg('public/assets/badges/badge_quest.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none">
  <defs>
    <linearGradient id="bgQuest" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0369A1"/>
    </linearGradient>
  </defs>
  <circle cx="40" cy="40" r="38" fill="#0F172A" stroke="url(#bgQuest)" stroke-width="3"/>
  <!-- Compass Needle -->
  <polygon points="40,16 48,38 40,34 32,38" fill="#38BDF8"/>
  <polygon points="40,64 48,42 40,46 32,42" fill="#94A3B8"/>
  <circle cx="40" cy="40" r="4" fill="#FFFFFF"/>
</svg>`);

writeSvg('public/assets/badges/badge_trivia.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none">
  <defs>
    <linearGradient id="bgTrivia" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C084FC"/>
      <stop offset="100%" stop-color="#7E22CE"/>
    </linearGradient>
  </defs>
  <circle cx="40" cy="40" r="38" fill="#180B26" stroke="url(#bgTrivia)" stroke-width="3"/>
  <!-- Brain / Neural Node -->
  <circle cx="40" cy="28" r="6" fill="url(#bgTrivia)"/>
  <circle cx="28" cy="46" r="5" fill="url(#bgTrivia)"/>
  <circle cx="52" cy="46" r="5" fill="url(#bgTrivia)"/>
  <circle cx="40" cy="58" r="4" fill="url(#bgTrivia)"/>
  <line x1="40" y1="28" x2="28" y2="46" stroke="#C084FC" stroke-width="2"/>
  <line x1="40" y1="28" x2="52" y2="46" stroke="#C084FC" stroke-width="2"/>
  <line x1="28" y1="46" x2="40" y2="58" stroke="#C084FC" stroke-width="2"/>
  <line x1="52" y1="46" x2="40" y2="58" stroke="#C084FC" stroke-width="2"/>
</svg>`);

writeSvg('public/assets/badges/badge_guild.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none">
  <defs>
    <linearGradient id="bgTrophy" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
  </defs>
  <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="#1C1917" stroke="url(#bgTrophy)" stroke-width="3"/>
  <!-- Trophy Cup -->
  <path d="M26 22 L54 22 L50 42 C48 48 44 50 40 50 C36 50 32 48 30 42 Z" fill="url(#bgTrophy)"/>
  <path d="M36 50 L44 50 L46 58 L34 58 Z" fill="url(#bgTrophy)"/>
  <rect x="30" y="58" width="20" height="4" rx="1" fill="url(#bgTrophy)"/>
  <path d="M26 26 C20 26 18 32 20 36 C22 40 26 40 28 40" stroke="url(#bgTrophy)" stroke-width="2" fill="none"/>
  <path d="M54 26 C60 26 62 32 60 36 C58 40 54 40 52 40" stroke="url(#bgTrophy)" stroke-width="2" fill="none"/>
</svg>`);

writeSvg('public/assets/badges/badge_conqueror.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none">
  <defs>
    <linearGradient id="bgZap" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#818CF8"/>
      <stop offset="100%" stop-color="#C084FC"/>
    </linearGradient>
  </defs>
  <circle cx="40" cy="40" r="38" fill="#0B1329" stroke="url(#bgZap)" stroke-width="3"/>
  <!-- Lightning Bolt -->
  <polygon points="44,14 26,40 38,40 34,66 54,36 42,36" fill="url(#bgZap)"/>
</svg>`);

writeSvg('public/assets/badges/badge_streak.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none">
  <defs>
    <linearGradient id="bgStreak" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="35%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>
  </defs>
  <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="#1C1917" stroke="url(#bgStreak)" stroke-width="3"/>
  <!-- Flame Core -->
  <path d="M40 16 C40 16 52 30 52 44 C52 54 45 62 40 62 C35 62 28 54 28 44 C28 34 36 24 40 16 Z" fill="url(#bgStreak)"/>
  <path d="M40 34 C40 34 46 42 46 48 C46 54 42 58 40 58 C38 58 34 54 34 48 C34 44 38 38 40 34 Z" fill="#FEF3C7"/>
</svg>`);

console.log('Successfully generated all SVG static cosmetic assets for EN Profile!');
