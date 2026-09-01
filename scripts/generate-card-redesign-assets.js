// Generate High-Fidelity SVGs for the Redesigned Profile Card
const fs = require('fs');
const path = require('path');

function writeSvg(relPath, content) {
  const fullPath = path.join(__dirname, '..', relPath);
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
}

// --------------------------------------------------------------------
// 1. HIGH-FIDELITY CORNER BEVELS CARD FRAME (1200 x 675 px)
// --------------------------------------------------------------------
writeSvg('public/assets/frames/card_vault_legendary.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
  <defs>
    <!-- Outer Gold Gradient -->
    <linearGradient id="goldBevel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="25%" stop-color="#FCD34D"/>
      <stop offset="60%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>

    <!-- Inner Violet Bevel -->
    <linearGradient id="purpleBevel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5D0FE"/>
      <stop offset="35%" stop-color="#C084FC"/>
      <stop offset="70%" stop-color="#7E22CE"/>
      <stop offset="100%" stop-color="#3B0764"/>
    </linearGradient>

    <!-- Crystal Shading -->
    <linearGradient id="crystalFacetA" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E879F9"/>
      <stop offset="100%" stop-color="#6B21A8"/>
    </linearGradient>
    <linearGradient id="crystalFacetB" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>

    <filter id="outerGlow" x="-5%" y="-5%" width="110%" height="110%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Outer Beveled Gold & Purple Border -->
  <rect x="8" y="8" width="1184" height="659" rx="20" stroke="url(#goldBevel)" stroke-width="5" fill="none" filter="url(#outerGlow)"/>
  <rect x="16" y="16" width="1168" height="643" rx="14" stroke="url(#purpleBevel)" stroke-width="3" fill="none"/>
  <rect x="22" y="22" width="1156" height="631" rx="10" stroke="rgba(192, 132, 252, 0.35)" stroke-width="1.5" fill="none"/>

  <!-- TOP-LEFT 3D ORNATE CRYSTAL CORNER -->
  <g transform="translate(0,0)">
    <!-- Gold Wing Bracket -->
    <polygon points="8,105 35,60 60,35 105,8 45,8 8,45" fill="url(#goldBevel)"/>
    <!-- Outer Violet Facet -->
    <polygon points="12,75 30,45 45,30 75,12 25,12 12,25" fill="url(#crystalFacetA)"/>
    <!-- Center Crystal Gem Diamond -->
    <polygon points="40,40 55,25 70,40 55,55" fill="url(#crystalFacetA)"/>
    <polygon points="40,40 55,25 48,40" fill="#FFFFFF" opacity="0.6"/>
    <!-- Inner Accent Diamond -->
    <polygon points="20,20 32,12 40,24 28,32" fill="url(#crystalFacetB)"/>
  </g>

  <!-- TOP-RIGHT 3D ORNATE CRYSTAL CORNER -->
  <g transform="translate(1200,0) scale(-1, 1)">
    <polygon points="8,105 35,60 60,35 105,8 45,8 8,45" fill="url(#goldBevel)"/>
    <polygon points="12,75 30,45 45,30 75,12 25,12 12,25" fill="url(#crystalFacetA)"/>
    <polygon points="40,40 55,25 70,40 55,55" fill="url(#crystalFacetA)"/>
    <polygon points="40,40 55,25 48,40" fill="#FFFFFF" opacity="0.6"/>
    <polygon points="20,20 32,12 40,24 28,32" fill="url(#crystalFacetB)"/>
  </g>

  <!-- BOTTOM-LEFT 3D ORNATE CRYSTAL CORNER -->
  <g transform="translate(0,675) scale(1, -1)">
    <polygon points="8,105 35,60 60,35 105,8 45,8 8,45" fill="url(#goldBevel)"/>
    <polygon points="12,75 30,45 45,30 75,12 25,12 12,25" fill="url(#crystalFacetA)"/>
    <polygon points="40,40 55,25 70,40 55,55" fill="url(#crystalFacetA)"/>
    <polygon points="40,40 55,25 48,40" fill="#FFFFFF" opacity="0.6"/>
    <polygon points="20,20 32,12 40,24 28,32" fill="url(#crystalFacetB)"/>
  </g>

  <!-- BOTTOM-RIGHT 3D ORNATE CRYSTAL CORNER -->
  <g transform="translate(1200,675) scale(-1, -1)">
    <polygon points="8,105 35,60 60,35 105,8 45,8 8,45" fill="url(#goldBevel)"/>
    <polygon points="12,75 30,45 45,30 75,12 25,12 12,25" fill="url(#crystalFacetA)"/>
    <polygon points="40,40 55,25 70,40 55,55" fill="url(#crystalFacetA)"/>
    <polygon points="40,40 55,25 48,40" fill="#FFFFFF" opacity="0.6"/>
    <polygon points="20,20 32,12 40,24 28,32" fill="url(#crystalFacetB)"/>
  </g>
</svg>`);

// --------------------------------------------------------------------
// 2. ORNATE AVATAR FRAME WITH BOTTOM GEMSTONE & 4 STARS
// --------------------------------------------------------------------
writeSvg('public/assets/frames/avatar_vault_seeker.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" fill="none">
  <defs>
    <linearGradient id="avRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5D0FE"/>
      <stop offset="35%" stop-color="#C084FC"/>
      <stop offset="70%" stop-color="#7E22CE"/>
      <stop offset="100%" stop-color="#3B0764"/>
    </linearGradient>
    <linearGradient id="avGemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="25%" stop-color="#E879F9"/>
      <stop offset="70%" stop-color="#9333EA"/>
      <stop offset="100%" stop-color="#3B0764"/>
    </linearGradient>
    <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Outer Ring Glow -->
  <circle cx="160" cy="155" r="142" stroke="url(#avRingGrad)" stroke-width="8" fill="none" filter="url(#ringGlow)"/>
  <circle cx="160" cy="155" r="132" stroke="#E879F9" stroke-width="2" stroke-dasharray="14 8" fill="none"/>
  <circle cx="160" cy="155" r="126" stroke="rgba(255,255,255,0.4)" stroke-width="1" fill="none"/>

  <!-- Top Celestial Star -->
  <g transform="translate(160, 14)">
    <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#FFFFFF"/>
    <circle cx="0" cy="0" r="2" fill="#E879F9"/>
  </g>
  <!-- Left Star -->
  <g transform="translate(19, 155)">
    <polygon points="0,-10 2,-2 10,0 2,2 0,10 -2,2 -10,0 -2,-2" fill="#FFFFFF"/>
  </g>
  <!-- Right Star -->
  <g transform="translate(301, 155)">
    <polygon points="0,-10 2,-2 10,0 2,2 0,10 -2,2 -10,0 -2,-2" fill="#FFFFFF"/>
  </g>

  <!-- Bottom Hanging Gemstone Jewel Crest -->
  <g transform="translate(160, 285)">
    <!-- Outer Crest Bracket -->
    <polygon points="0,-15 32,8 0,38 -32,8" fill="#581C87" stroke="#FDE68A" stroke-width="2"/>
    <!-- Diamond Gem Inner -->
    <polygon points="0,-10 22,8 0,28 -22,8" fill="url(#avGemGrad)"/>
    <!-- Facet Light Highlights -->
    <polygon points="0,-10 22,8 0,8" fill="#FFFFFF" opacity="0.75"/>
    <polygon points="-22,8 0,-10 0,8" fill="#E879F9" opacity="0.5"/>
    <!-- Center Core Dot -->
    <circle cx="0" cy="8" r="3" fill="#FFFFFF"/>
  </g>
</svg>`);

// --------------------------------------------------------------------
// 3. TITLE FRAME BANNER (Matching reference screenshot)
// --------------------------------------------------------------------
writeSvg('public/assets/titles/title_vault_seeker_banner.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 76" fill="none">
  <defs>
    <linearGradient id="bannerGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="30%" stop-color="#FBBF24"/>
      <stop offset="70%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
    <linearGradient id="bannerBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E1338"/>
      <stop offset="50%" stop-color="#0F0921"/>
      <stop offset="100%" stop-color="#080414"/>
    </linearGradient>
    <linearGradient id="gemPurple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5D0FE"/>
      <stop offset="50%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#581C87"/>
    </linearGradient>
    <filter id="bannerGlow" x="-5%" y="-10%" width="110%" height="120%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Main Banner Plaque -->
  <path d="M 28 14 L 512 14 L 534 38 L 512 62 L 28 62 L 6 38 Z" fill="url(#bannerBg)" stroke="url(#bannerGold)" stroke-width="3" filter="url(#bannerGlow)"/>
  <path d="M 38 20 L 502 20 L 520 38 L 502 56 L 38 56 L 20 38 Z" stroke="#A855F7" stroke-width="1.5" stroke-opacity="0.6" fill="none"/>

  <!-- Left End Wing Diamonds -->
  <polygon points="6,38 18,26 28,38 18,50" fill="url(#bannerGold)"/>
  <polygon points="12,38 18,32 24,38 18,44" fill="url(#gemPurple)"/>

  <!-- Right End Wing Diamonds -->
  <polygon points="534,38 522,26 512,38 522,50" fill="url(#bannerGold)"/>
  <polygon points="528,38 522,32 516,38 522,44" fill="url(#gemPurple)"/>

  <!-- Top Center Gem Crest -->
  <g transform="translate(270, 14)">
    <polygon points="0,-12 16,0 0,12 -16,0" fill="url(#bannerGold)"/>
    <polygon points="0,-8 10,0 0,8 -10,0" fill="url(#gemPurple)"/>
    <circle cx="0" cy="0" r="2" fill="#FFFFFF"/>
  </g>

  <!-- Bottom Center Gem Accent -->
  <g transform="translate(270, 62)">
    <polygon points="0,-8 10,0 0,8 -10,0" fill="url(#bannerGold)"/>
    <polygon points="0,-5 6,0 0,5 -6,0" fill="url(#gemPurple)"/>
  </g>
</svg>`);

// --------------------------------------------------------------------
// 4. THE 5 CANONICAL 3D SHOWCASE BADGES (Matching Reference Screenshot)
// --------------------------------------------------------------------

// Badge 1: EARLY BIRD (Violet Twin-Blade Crest)
writeSvg('public/assets/badges/badge_early_bird.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="ebPurp" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5D0FE"/>
      <stop offset="40%" stop-color="#C084FC"/>
      <stop offset="75%" stop-color="#7E22CE"/>
      <stop offset="100%" stop-color="#3B0764"/>
    </linearGradient>
    <filter id="ebGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Outer Beveled Hex Ring -->
  <polygon points="50,6 84,24 84,68 50,92 16,68 16,24" fill="#170D28" stroke="url(#ebPurp)" stroke-width="3.5" filter="url(#ebGlow)"/>
  <polygon points="50,14 76,28 76,64 50,84 24,64 24,28" stroke="#E879F9" stroke-width="1.5" fill="none" opacity="0.6"/>
  <!-- Center Crystalline Wings / Crest -->
  <polygon points="50,22 62,45 50,72 38,45" fill="url(#ebPurp)"/>
  <polygon points="50,22 62,45 50,45" fill="#FFFFFF" opacity="0.6"/>
  <polygon points="62,45 74,52 64,66 54,60" fill="url(#ebPurp)"/>
  <polygon points="38,45 26,52 36,66 46,60" fill="url(#ebPurp)"/>
</svg>`);

// Badge 2: VOICE CHATTER (Blue Shield)
writeSvg('public/assets/badges/badge_voice_chatter.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="vcBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#BAE6FD"/>
      <stop offset="40%" stop-color="#38BDF8"/>
      <stop offset="75%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#0C4A6E"/>
    </linearGradient>
    <filter id="vcGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Shield Frame -->
  <path d="M 50 8 L 84 20 L 80 58 C 80 76 50 92 50 92 C 50 92 20 76 20 58 L 16 20 Z" fill="#081A2F" stroke="url(#vcBlue)" stroke-width="3.5" filter="url(#vcGlow)"/>
  <path d="M 50 16 L 76 26 L 72 56 C 72 70 50 82 50 82 C 50 82 28 70 28 56 L 24 26 Z" stroke="#7DD3FC" stroke-width="1.5" fill="none" opacity="0.6"/>
  <!-- Center Core Crystal Shield -->
  <polygon points="50,28 66,42 50,72 34,42" fill="url(#vcBlue)"/>
  <polygon points="50,28 66,42 50,48" fill="#FFFFFF" opacity="0.6"/>
</svg>`);

// Badge 3: TRIVIA MASTER (Golden Star in Octagon)
writeSvg('public/assets/badges/badge_trivia_master.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="tmGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="35%" stop-color="#F59E0B"/>
      <stop offset="75%" stop-color="#B45309"/>
      <stop offset="100%" stop-color="#451A03"/>
    </linearGradient>
    <filter id="tmGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Cog / Ornate Octagon Frame -->
  <polygon points="50,6 68,14 84,28 92,48 84,70 68,86 50,94 32,86 16,70 8,48 16,28 32,14" fill="#241405" stroke="url(#tmGold)" stroke-width="3.5" filter="url(#tmGlow)"/>
  <circle cx="50" cy="50" r="32" stroke="#FDE68A" stroke-width="1.5" stroke-dasharray="6 4" fill="none" opacity="0.6"/>
  <!-- Center 3D Gold Star -->
  <g transform="translate(50, 50)">
    <polygon points="0,-24 7,-7 24,-5 11,8 15,24 0,15 -15,24 -11,8 -24,-5 -7,-7" fill="url(#tmGold)"/>
    <polygon points="0,-24 7,-7 0,0" fill="#FFFBEB"/>
    <polygon points="24,-5 11,8 0,0" fill="#FDE68A"/>
    <polygon points="15,24 0,15 0,0" fill="#F59E0B"/>
    <polygon points="-15,24 -11,8 0,0" fill="#D97706"/>
    <polygon points="-24,-5 -7,-7 0,0" fill="#B45309"/>
  </g>
</svg>`);

// Badge 4: BOSS SLAYER (Crimson Mask/Crest)
writeSvg('public/assets/badges/badge_boss_slayer_v2.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="bsCrim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FECDD3"/>
      <stop offset="35%" stop-color="#F43F5E"/>
      <stop offset="70%" stop-color="#BE123C"/>
      <stop offset="100%" stop-color="#4C0519"/>
    </linearGradient>
    <filter id="bsGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Outer Demon Crest Frame -->
  <polygon points="50,6 74,18 88,40 80,72 50,94 20,72 12,40 26,18" fill="#240710" stroke="url(#bsCrim)" stroke-width="3.5" filter="url(#bsGlow)"/>
  <!-- Horns and Mask -->
  <polygon points="50,22 62,38 72,28 66,54 50,76 34,54 28,28 38,38" fill="url(#bsCrim)"/>
  <polygon points="50,22 62,38 50,46" fill="#FFFFFF" opacity="0.6"/>
  <polygon points="44,50 50,56 56,50 50,64" fill="#FFE4E6"/>
</svg>`);

// Badge 5: COMMUNITY PILLAR (Emerald Gem Shield)
writeSvg('public/assets/badges/badge_community_pillar.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="cpEm" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A7F3D0"/>
      <stop offset="35%" stop-color="#10B981"/>
      <stop offset="70%" stop-color="#047857"/>
      <stop offset="100%" stop-color="#064E3B"/>
    </linearGradient>
    <filter id="cpGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Hexagon Pillar Frame -->
  <polygon points="50,6 86,26 86,72 50,92 14,72 14,26" fill="#042017" stroke="url(#cpEm)" stroke-width="3.5" filter="url(#cpGlow)"/>
  <polygon points="50,14 78,30 78,66 50,84 22,66 22,30" stroke="#6EE7B7" stroke-width="1.5" fill="none" opacity="0.6"/>
  <!-- Center Emerald Crystal Gem -->
  <polygon points="50,26 68,44 50,74 32,44" fill="url(#cpEm)"/>
  <polygon points="50,26 68,44 50,50" fill="#FFFFFF" opacity="0.65"/>
  <polygon points="50,26 32,44 50,50" fill="#A7F3D0" opacity="0.4"/>
</svg>`);

console.log('Successfully generated all high-fidelity profile card redesign assets!');
