const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/assets/emblems');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const emblems = [
  { file: 'emblem_lv1.svg', color: '#94A3B8', name: 'Initiate' },
  { file: 'emblem_lv20.svg', color: '#F59E0B', name: 'Vanguard' },
  { file: 'emblem_lv40.svg', color: '#C084FC', name: 'Archon' },
  { file: 'emblem_lv60.svg', color: '#10B981', name: 'Reaper' },
  { file: 'emblem_lv80.svg', color: '#EF4444', name: 'Paragon' },
  { file: 'emblem_lv100.svg', color: '#E0E7FF', name: 'Sovereign' },
];

emblems.forEach(e => {
  const svg = `
<svg width="200" height="220" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="crestGlow_${e.name}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="${e.color}" stopOpacity="0.8"/>
      <stop offset="100%" stopColor="${e.color}" stopOpacity="0"/>
    </radialGradient>
    <linearGradient id="crestGold_${e.name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FDE68A"/>
      <stop offset="50%" stopColor="#D97706"/>
      <stop offset="100%" stopColor="#78350F"/>
    </linearGradient>
  </defs>
  
  <circle cx="100" cy="110" r="85" fill="url(#crestGlow_${e.name})" opacity="0.3"/>

  <!-- Outer Wings -->
  <path d="M100 20 L150 70 L180 130 L150 170 L100 200 L50 170 L20 130 L50 70 Z" fill="#0A0614" stroke="url(#crestGold_${e.name})" stroke-width="4"/>
  
  <!-- Faceted Gem Shape -->
  <polygon points="100,45 155,95 135,160 100,185 65,160 45,95" fill="${e.color}" fill-opacity="0.25" stroke="${e.color}" stroke-width="3"/>
  <polygon points="100,55 140,100 100,170 60,100" fill="${e.color}" fill-opacity="0.5" stroke="#FFFFFF" stroke-width="1.5"/>

  <!-- Inner Diamond -->
  <polygon points="100,75 125,110 100,145 75,110" fill="#FFFFFF" fill-opacity="0.9"/>
  <circle cx="100" cy="110" r="10" fill="${e.color}"/>
</svg>
`;
  fs.writeFileSync(path.join(outDir, e.file), svg.trim(), 'utf8');
  console.log(`Generated ${e.file}`);
});
