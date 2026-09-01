# EN Profile (`EN-Vault-Profile`)

Standalone, member-facing profile customization website and visual studio for the **ENOS / Every Nation GG** community ecosystem.

Hosted on **Vercel** (`profile.engg.online`), this application allows Discord community members to customize, preview in real time, and export their canonical **1200 × 675 px (16:9)** digital identity card earned through active participation in ENOS.

---

## 🚀 Key Features

* **Canonical 1200 × 675 px Profile Card:** 16:9 aspect ratio identity card with dynamic Discord avatar, custom display name typography, honorary title & title frames, milestone emblems, level progression bar, Vault Coins balance, and 5-slot achievement showcase.
* **Dedicated Level 1–100 Progression Curve:**
  * **Anchors:** Level 1 = 0 EXP, Level 30 ≈ 83,429 EXP (1 Year of consistent activity), Level 100 = 417,143 EXP (5 Years of master participation).
  * **EXP Sources:** Daily Quests (+50 EXP, max 150/day), Daily Trivia (+25 EXP/day), Weekly World Boss (+75 EXP/AP, max 375/week). Max weekly cap: ~1,600 EXP.
* **3 Starter Preset Identities (100% Free):**
  * 🛡️ **Silver Vanguard:** Clean minimalist metallic chrome and brushed aluminum aesthetics.
  * ⚡ **Electric Violet:** High-voltage cyber-plasma and neon lightning aesthetics.
  * 🔥 **Flaming Golden Orange:** Radiant solar-forged gold and volcanic ember aesthetics.
* **Interactive Customizer Studio Mode:**
  * Glowing hotspot callout dots positioned over customizable card regions.
  * Bottom cosmetic drawer with live client-side preview.
  * Custom HEX color pickers with luxury swatches.
  * Curated typography font selector (Rajdhani, Cinzel, Orbitron, Outfit, Montserrat, Exo 2, Inter).
  * Stackable multi-layer background reordering.
  * 5-slot achievement showcase organizer.
* **Zero-Cost / Free-Tier CDN Architecture:**
  * 100% of static cosmetic artwork (Frames, Themes, Emblems, Badges) is vector SVG served via Vercel Edge CDN.
  * **0 KB Supabase Storage used for static cosmetics.** Supabase only stores lightweight text records and equipped JSON configurations.
* **Client-Side Real-Time Composition:**
  * Zero server-side image render latency on cosmetic tweaks.
  * Direct 1200 × 675 lossless PNG export via HTML5 canvas compositor.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
* **Styling:** Ultra-modern Vanilla CSS Design System with dark luxury glassmorphism and neon accents
* **Database:** Supabase PostgreSQL (ENOS central instance)
* **Authentication:** NextAuth v5 with Discord OAuth2 provider
* **CDN / Hosting:** Vercel (`profile.engg.online`)

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and set your credentials:
```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
AUTH_SECRET="your-auth-secret"
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
DISCORD_GUILD_ID="your-discord-guild-id"
```

### 3. Database Migration
Run the SQL scripts in `supabase/migrations/` on your Supabase PostgreSQL instance:
* `supabase/migrations/001_initial_schema.sql` (Tables, RLS policies, Level functions, Triggers)
* `supabase/migrations/002_seed_starter_assets.sql` (Asset catalog seed data)

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 Asset Catalog Structure

* `public/assets/branding/` - Every Nation GG logos & Vault Coin icons
* `public/assets/frames/` - 1200×675 Card outer frames and circular avatar frames
* `public/assets/themes/` - Stackable base, circuit, and ambient theme layers
* `public/assets/emblems/` - Level milestone emblems (Lv 1, 20, 40, 60, 80, 100)
* `public/assets/titles/` - Title frames and banners
* `public/assets/badges/` - 5-slot achievement showcase trophies

---

## 📄 License
Official component of Every Nation GG / ENOS Ecosystem. All rights reserved.
>>>>>>> 7de3f9a (feat: complete EN Profile standalone visual studio and canonical card customization platform)
