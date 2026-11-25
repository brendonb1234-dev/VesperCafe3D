import {
  AESTHETIC_PRESETS,
  DEVELOPMENT_PHASES,
  REQUIRED_3D_ASSETS,
} from '../data/cafeData';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function generateStandaloneBlueprintHtml(): string {
  const assetRows = REQUIRED_3D_ASSETS.map(
    (a, idx) => `
      <tr>
        <td class="mono">${String(idx + 1).padStart(2, '0')}</td>
        <td><strong>${escapeHtml(a.name)}</strong><br/><span class="muted">${escapeHtml(a.priority)}</span></td>
        <td class="mono">${escapeHtml(a.fileName)}</td>
        <td>${escapeHtml(a.format)}<br/><span class="muted">${escapeHtml(a.polyBudget)}</span></td>
        <td>${escapeHtml(a.textureSpec)}</td>
        <td>${escapeHtml(a.usage)}</td>
        <td>${escapeHtml(a.recommendedSources)}</td>
      </tr>`,
  ).join('');

  const phaseCards = DEVELOPMENT_PHASES.map(
    (p) => `
      <article class="phase-card">
        <div class="phase-meta">
          <span class="mono">${escapeHtml(p.phase)}</span>
          <span>·</span>
          <span>${escapeHtml(p.duration)}</span>
          <span>·</span>
          <span>Owner: ${escapeHtml(p.owner)}</span>
        </div>
        <h3>${escapeHtml(p.title)}</h3>
        <div class="phase-grid">
          <div>
            <h4>Core Objectives</h4>
            <ul>
              ${p.objectives.map((o) => `<li>${escapeHtml(o)}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h4>Key Deliverables</h4>
            <ul>
              ${p.deliverables.map((d) => `<li>${escapeHtml(d)}</li>`).join('')}
            </ul>
            <p class="exit-gate"><strong>Exit Gate:</strong> ${escapeHtml(p.exitGate)}</p>
          </div>
        </div>
      </article>`,
  ).join('');

  const presetRows = Object.values(AESTHETIC_PRESETS)
    .map(
      (pr) => `
      <tr>
        <td><strong>${escapeHtml(pr.name)}</strong></td>
        <td class="mono">${escapeHtml(pr.timeWindow)}</td>
        <td>${escapeHtml(pr.materialNote)}</td>
        <td>${escapeHtml(pr.lightingSpec)}</td>
        <td class="mono">${escapeHtml(pr.bgHex)} / ${escapeHtml(pr.keyLightHex)}</td>
      </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>3D Commercial Cafe Website — Complete IDE Implementation Blueprint</title>
  <style>
    :root {
      --bg: #F6F5F2;
      --surface: #FFFFFF;
      --subtle: #EFECE6;
      --ink: #171614;
      --muted: #5C574F;
      --accent: #94632E;
      --border: rgba(23, 22, 20, 0.12);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--ink);
      line-height: 1.6;
    }
    .wrap {
      max-width: 1180px;
      margin: 0 auto;
      padding: 40px 24px 80px;
    }
    header {
      border-bottom: 1px solid var(--border);
      padding-bottom: 28px;
      margin-bottom: 40px;
    }
    .kicker {
      font-size: 12px;
      color: var(--muted);
      margin-bottom: 8px;
    }
    h1 {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 40px;
      line-height: 1.15;
      margin: 0 0 12px;
      font-weight: 600;
    }
    h2 {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 28px;
      margin: 48px 0 16px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
    }
    h3 {
      font-size: 18px;
      margin: 0 0 12px;
    }
    h4 {
      font-size: 13px;
      margin: 0 0 8px;
      color: var(--muted);
    }
    p { margin: 0 0 14px; color: var(--muted); }
    .mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12.5px;
    }
    .muted { color: var(--muted); font-size: 12px; }
    nav.toc {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 18px;
    }
    nav.toc a {
      color: var(--accent);
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
    }
    nav.toc a:hover { text-decoration: underline; }
    .flow-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin: 20px 0;
    }
    .flow-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px;
    }
    .flow-step {
      font-size: 11px;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
      font-size: 13px;
      margin: 18px 0 28px;
    }
    th, td {
      text-align: left;
      padding: 12px 14px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }
    th {
      background: var(--subtle);
      font-weight: 600;
      font-size: 12px;
    }
    .phase-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 22px;
      margin-bottom: 16px;
    }
    .phase-meta {
      display: flex;
      gap: 8px;
      font-size: 12px;
      color: var(--muted);
      margin-bottom: 8px;
    }
    .phase-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-top: 14px;
    }
    ul { margin: 0; padding-left: 18px; font-size: 13.5px; color: var(--muted); }
    li { margin-bottom: 6px; }
    .exit-gate {
      margin-top: 14px;
      padding: 10px 12px;
      background: var(--subtle);
      border-radius: 8px;
      font-size: 12.5px;
      color: var(--ink);
    }
    pre {
      background: #171614;
      color: #F6F5F2;
      padding: 18px;
      border-radius: 10px;
      overflow-x: auto;
      font-size: 12.5px;
      line-height: 1.55;
    }
    .checklist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    .box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px;
    }
    footer {
      margin-top: 56px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
      font-size: 12px;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div class="kicker">Technical Specification &amp; IDE Implementation Guide · Vesper Roastery &amp; Cafe Architecture</div>
      <h1>3D Commercial Cafe Website — Complete Flow, Assets &amp; Execution Blueprint</h1>
      <p>
        A production-ready engineering plan designed to translate a physical specialty cafe's interior materials,
        day-to-night lighting rhythm, and spatial floor plan into a high-converting 3D commercial website with full ordering,
        customization, POS integration, and table reservation logic.
      </p>
      <nav class="toc">
        <a href="#aesthetic-bridge">1. Cafe Aesthetic Connectivity</a>
        <a href="#system-flow">2. End-to-End Business Flow</a>
        <a href="#assets-3d">3. Required 3D Models (.GLB)</a>
        <a href="#ide-structure">4. IDE Structure &amp; Code</a>
        <a href="#phases">5. Phase-Wise Plan</a>
        <a href="#testing-deploy">6. Testing &amp; Deployment</a>
      </nav>
    </header>

    <section id="aesthetic-bridge">
      <h2>1. Physical Cafe-to-Website Aesthetic Connectivity</h2>
      <p>
        Instead of treating 3D as an isolated gimmick, bind the physical interior's real surfaces (honed travertine counter,
        smoked walnut joinery, brushed brass espresso equipment, and speckled ceramic cups) directly to both CSS design tokens
        and Three.js PBR lighting rigs. Customers recognize the exact visual mood before stepping through the door.
      </p>
      <table>
        <thead>
          <tr>
            <th>Interior Ambiance Preset</th>
            <th>Cafe Hours</th>
            <th>Physical Materials Bridged</th>
            <th>3D &amp; Interior Lighting Spec</th>
            <th>Scene / Key Hex</th>
          </tr>
        </thead>
        <tbody>
          ${presetRows}
        </tbody>
      </table>
    </section>

    <section id="system-flow">
      <h2>2. End-to-End User &amp; Business Logic Flow</h2>
      <div class="flow-grid">
        <div class="flow-card">
          <div class="flow-step">Step 01 · Aesthetic Entry</div>
          <h3>3D Tasting Bar Stage</h3>
          <p>Visitor lands on a sunlit 3D espresso bar stage synced to current cafe hours (Morning / Dusk / Evening). Orbit, switch objects, and inspect exploded craft layers.</p>
        </div>
        <div class="flow-card">
          <div class="flow-step">Step 02 · Menu Conversion</div>
          <h3>Drink &amp; Bean Customizer</h3>
          <p>Click "Customize &amp; Order" from the 3D stage or menu grid. Configure size, milk, roast origin, extra shots, grind, or warming with live tabular pricing.</p>
        </div>
        <div class="flow-card">
          <div class="flow-step">Step 03 · Commerce &amp; POS</div>
          <h3>Bag, Checkout &amp; KDS</h3>
          <p>Choose Counter Pickup or Serve-to-Table, apply promo codes, tip baristas, pay via Stripe/Square or Pay at Counter, and push orders to the Kitchen Display System.</p>
        </div>
        <div class="flow-card">
          <div class="flow-step">Step 04 · Spatial Booking</div>
          <h3>Architectural Floor Plan</h3>
          <p>Guests choose an exact table (Window Alcove, Travertine Bar, Walnut Booth, Courtyard) matching party size and open slots with transactional lock validation.</p>
        </div>
      </div>
    </section>

    <section id="assets-3d">
      <h2>3. Required 3D Elements to Download / Source (.GLB &amp; .HDR)</h2>
      <p>
        Download or commission the following 10 optimized assets for your IDE project. Keep every model pivoted at
        <strong>bottom-center (Y = 0)</strong>, scaled to real-world meters, and compressed with Draco geometry + KTX2/WebP textures
        so the initial above-the-fold WebGL payload remains under <strong>3.5 MB</strong>.
      </p>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>3D Asset Name</th>
            <th>Target IDE Path</th>
            <th>Format &amp; Poly Budget</th>
            <th>PBR Texture Spec</th>
            <th>Commercial / UX Role</th>
            <th>Recommended Sources</th>
          </tr>
        </thead>
        <tbody>
          ${assetRows}
        </tbody>
      </table>

      <h3>Recommended Asset Optimization CLI Pipeline (Run in IDE Terminal)</h3>
      <pre><code># Install gltf-transform CLI for Draco + WebP/KTX2 optimization
npm install -g @gltf-transform/cli

# Optimize each downloaded .glb (reduces 12 MB raw models down to ~400 KB)
gltf-transform optimize raw/cortado-stoneware-set.glb public/models/cortado-stoneware-set.glb \\
  --compress draco \\
  --texture-compress webp \\
  --texture-size 1024</code></pre>
    </section>

    <section id="ide-structure">
      <h2>4. Recommended IDE Folder Architecture &amp; GLTF Loader Starter</h2>
      <pre><code>cafe-3d-commerce/
├── public/
│   ├── models/                      # Draco-compressed .glb cafe objects
│   │   ├── espresso-machine-brass.glb
│   │   ├── cortado-stoneware-set.glb
│   │   ├── pourover-chemex-walnut.glb
│   │   ├── artisan-croissant-plate.glb
│   │   ├── portafilter-beans-set.glb
│   │   └── travertine-counter-slab.glb
│   ├── hdri/                        # 1K PMREM environment maps (morning/dusk/night)
│   └── draco/                       # Draco decoder WASM files (self-hosted, zero CDN lag)
├── src/
│   ├── data/                        # Menu SKUs, modifier pricing, floor plan coordinates
│   ├── three/
│   │   ├── loader.ts                # GLTFLoader + DRACOLoader + RGBELoader singleton
│   │   ├── lightingRig.ts           # Morning / Dusk / Evening lighting state interpolation
│   │   └── CafeStage3D.tsx          # React WebGL lifecycle container + OrbitControls
│   ├── components/                  # MenuSection, CustomizeModal, CartDrawer, FloorPlanReserve
│   ├── services/                    # Stripe/Square payments, POS webhook adapter, reservation API
│   └── App.tsx
├── server/                          # Express / Next.js API routes (orders, webhooks, reservations)
└── tests/                           # Vitest pricing unit tests + Playwright E2E flows</code></pre>

      <h3>Production Three.js GLTF + Draco Loader Pattern</h3>
      <pre><code>import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

export const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

export async function loadCafeAsset(url: string): Promise&lt;THREE.Group&gt; {
  const gltf = await gltfLoader.loadAsync(url);
  gltf.scene.traverse((child) =&gt; {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return gltf.scene;
}

export async function applyCafeHdri(renderer: THREE.WebGLRenderer, scene: THREE.Scene, hdrUrl: string) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const hdrTex = await new RGBELoader().loadAsync(hdrUrl);
  const envMap = pmrem.fromEquirectangular(hdrTex).texture;
  scene.environment = envMap;
  hdrTex.dispose();
  pmrem.dispose();
}</code></pre>
    </section>

    <section id="phases">
      <h2>5. Phase-Wise Development Distribution (8-Week Production Plan)</h2>
      ${phaseCards}
    </section>

    <section id="testing-deploy">
      <h2>6. Testing Matrix &amp; Production Deployment Strategy</h2>
      <div class="checklist-grid">
        <div class="box">
          <h3>Unit &amp; Business Logic Testing (Vitest)</h3>
          <ul>
            <li>Drink modifier calculation (size + oat milk + single origin + extra shot).</li>
            <li>Promo code validation, tax rounding (8.25%), tip percentages, and cart mutations.</li>
            <li>Reservation overlap checks and party-size capacity constraints.</li>
          </ul>
        </div>
        <div class="box">
          <h3>End-to-End &amp; Visual QA (Playwright)</h3>
          <ul>
            <li>Full checkout funnel: 3D inspect → Customize → Promo → Order confirmation receipt.</li>
            <li>Interactive floor plan table selection, booking confirmation, and cancellation flow.</li>
            <li>Verify graceful 2D studio image fallback when WebGL is disabled or reduced-motion is set.</li>
          </ul>
        </div>
        <div class="box">
          <h3>WebGL &amp; Performance Profiling</h3>
          <ul>
            <li>Core Web Vitals: LCP &lt; 2.5s, CLS &lt; 0.05, INP &lt; 200ms on mobile 4G throttling.</li>
            <li>GPU memory ceiling &lt; 150 MB; zero leaked geometries/textures across route changes.</li>
            <li>Software-WebGL detection caps pixel ratio at 1.0 and disables costly transmission passes.</li>
          </ul>
        </div>
        <div class="box">
          <h3>Deployment &amp; Edge Caching</h3>
          <ul>
            <li>Host frontend + API on Vercel / Cloud Run; serve <code>.glb</code> and <code>.hdr</code> via Cloudflare R2 CDN.</li>
            <li>Set <code>Cache-Control: public, max-age=31536000, immutable</code> on versioned 3D models.</li>
            <li>Enable Brotli compression for <code>.glb</code>, <code>.wasm</code>, and JS chunks; wire Stripe/Square webhook secrets via environment variables.</li>
          </ul>
        </div>
      </div>
    </section>

    <footer>
      Generated by Vesper Roastery &amp; Cafe 3D Architecture Studio · Open directly in VS Code, Cursor, or any browser as your master IDE implementation reference.
    </footer>
  </div>
</body>
</html>`;
}
