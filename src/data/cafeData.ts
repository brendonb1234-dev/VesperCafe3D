export type ModelKey = 'cortado' | 'pourover' | 'croissant' | 'portafilter';
export type AestheticPresetKey = 'travertine' | 'walnut' | 'obsidian';
export type MenuCategory = 'All' | 'Espresso Bar' | 'Filter & Cold' | 'Viennoiserie' | 'Roastery Bags';

export interface AestheticPreset {
  id: AestheticPresetKey;
  name: string;
  timeWindow: string;
  materialNote: string;
  lightingSpec: string;
  bgHex: string;
  fogHex: string;
  keyLightHex: string;
  keyIntensity: number;
  hemiSkyHex: string;
  hemiGroundHex: string;
  hemiIntensity: number;
  rimLightHex: string;
  rimIntensity: number;
  swatchHex: string;
  counterMaterial: 'travertine' | 'walnut' | 'slate';
}

export const AESTHETIC_PRESETS: Record<AestheticPresetKey, AestheticPreset> = {
  travertine: {
    id: 'travertine',
    name: 'Travertine Morning',
    timeWindow: '07:00 – 12:30',
    materialNote: 'Honed Roman travertine bar, unbleached linen, brushed brass',
    lightingSpec: '5200K east window sunlight · soft limestone bounce',
    bgHex: '#EAE7E0',
    fogHex: '#EAE7E0',
    keyLightHex: '#FFF6E5',
    keyIntensity: 2.35,
    hemiSkyHex: '#E6EFF8',
    hemiGroundHex: '#B6A896',
    hemiIntensity: 1.05,
    rimLightHex: '#FFE8C8',
    rimIntensity: 0.9,
    swatchHex: '#DDD6C7',
    counterMaterial: 'travertine',
  },
  walnut: {
    id: 'walnut',
    name: 'Smoked Walnut Dusk',
    timeWindow: '12:30 – 17:30',
    materialNote: 'Oiled American walnut joinery, amber glass, warm plaster',
    lightingSpec: '3400K golden-hour crosslight · warm timber glow',
    bgHex: '#2A231E',
    fogHex: '#2A231E',
    keyLightHex: '#FFD59E',
    keyIntensity: 2.55,
    hemiSkyHex: '#8FA4BC',
    hemiGroundHex: '#5C402B',
    hemiIntensity: 0.85,
    rimLightHex: '#FFB96E',
    rimIntensity: 1.35,
    swatchHex: '#5A3E2B',
    counterMaterial: 'walnut',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Evening Espresso Bar',
    timeWindow: '17:30 – 22:00',
    materialNote: 'Honed basalt stone, burnished brass pendants, smoked stoneware',
    lightingSpec: '2700K focused pendant spot · cool indigo ambient fill',
    bgHex: '#151517',
    fogHex: '#151517',
    keyLightHex: '#FFCA8A',
    keyIntensity: 2.7,
    hemiSkyHex: '#4E607A',
    hemiGroundHex: '#26211D',
    hemiIntensity: 0.72,
    rimLightHex: '#D6A165',
    rimIntensity: 1.5,
    swatchHex: '#222226',
    counterMaterial: 'slate',
  },
};

export interface ModelShowcaseInfo {
  id: ModelKey;
  title: string;
  category: string;
  price: number;
  summary: string;
  partsBreakdown: string[];
  linkedMenuId: string;
}

export const MODEL_SHOWCASE_INFO: Record<ModelKey, ModelShowcaseInfo> = {
  cortado: {
    id: 'cortado',
    title: 'Signature Stoneware Cortado',
    category: 'Espresso Bar · 4.5 oz',
    price: 5.5,
    summary: 'Double ristretto pulled at 9 bars, balanced 1:1 with micro-textured organic milk in hand-thrown speckled stoneware.',
    partsBreakdown: [
      'Hand-thrown speckled stoneware vessel',
      'Matching rimmed ceramic saucer',
      'Micro-foam rosetta crema crown',
      'Brushed brass demitasse spoon',
    ],
    linkedMenuId: 'sig-cortado',
  },
  pourover: {
    id: 'pourover',
    title: 'Single-Origin Pour-Over Carafe',
    category: 'Filter Bar · 10 oz',
    price: 7.5,
    summary: 'Hand-poured washed Ethiopia Yirgacheffe brewed through unbleached paper in our walnut-collared borosilicate carafe.',
    partsBreakdown: [
      'Hourglass borosilicate glass carafe',
      'Split oiled American walnut collar',
      'Raw leather tie & brass cinch bead',
      'Fluted paper cone & amber extraction',
    ],
    linkedMenuId: 'ethiopia-pourover',
  },
  croissant: {
    id: 'croissant',
    title: 'Cultured Butter Croissant',
    category: 'Viennoiserie · Baked 06:30',
    price: 5.25,
    summary: '72-hour cold-fermented sourdough pastry laminated with 84% Normandy cultured butter for crisp honeycomb layers.',
    partsBreakdown: [
      '27-layer laminated butter crescent',
      'Matte speckled stoneware service plate',
      'Cultured sea-salt butter ramekin',
      'Brushed brass & steel pastry knife',
    ],
    linkedMenuId: 'butter-croissant',
  },
  portafilter: {
    id: 'portafilter',
    title: 'Vesper House Reserve Beans',
    category: 'Roastery · 340g Whole Bean',
    price: 22.0,
    summary: 'Our flagship espresso calibration: washed Colombia Huila and natural Ethiopia Sidama roasted daily on a cast-iron drum.',
    partsBreakdown: [
      '58mm machined brass & steel portafilter',
      'Precision-perforated 20g filter basket',
      'Turned walnut handle with brass pommel',
      'Small-batch roasted Arabica scatter',
    ],
    linkedMenuId: 'vesper-house-beans',
  },
};

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'All'>;
  subtitle: string;
  description: string;
  basePrice: number;
  image: string;
  tastingNotes: string;
  servingSpec: string;
  customizable: 'drink' | 'pastry' | 'beans';
  modelKey?: ModelKey;
  availability: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'sig-cortado',
    name: 'Signature Stoneware Cortado',
    category: 'Espresso Bar',
    subtitle: 'Double ristretto · textured milk',
    description: 'Equal parts syrupy double ristretto and velvety steamed milk served at 135°F for peak sweetness.',
    basePrice: 5.5,
    image: '/src/assets/images/drink_signature_cortado_1795357296256.jpg',
    tastingNotes: 'Toasted hazelnut, dark cocoa, brown sugar',
    servingSpec: '4.5 oz',
    customizable: 'drink',
    modelKey: 'cortado',
    availability: 'Available all day',
  },
  {
    id: 'ethiopia-pourover',
    name: 'Yirgacheffe Chemex Pour-Over',
    category: 'Filter & Cold',
    subtitle: 'Washed single origin · hand poured',
    description: 'Brewed to order tableside in a walnut-collared borosilicate carafe for tea-like clarity and bright aromatics.',
    basePrice: 7.5,
    image: '/src/assets/images/drink_pourover_carafe_1795357703859.jpg',
    tastingNotes: 'Bergamot blossom, white peach, honey',
    servingSpec: '10 oz carafe',
    customizable: 'drink',
    modelKey: 'pourover',
    availability: 'Brewed to order · 4 min',
  },
  {
    id: 'yuzu-espresso-tonic',
    name: 'Blood Orange Espresso Tonic',
    category: 'Filter & Cold',
    subtitle: 'Double espresso · botanical tonic',
    description: 'Chilled botanical quinine tonic poured over hand-carved crystal ice and layered with fresh single-origin espresso.',
    basePrice: 6.75,
    image: '/src/assets/images/drink_iced_espresso_tonic_1795357666824.jpg',
    tastingNotes: 'Candied citrus peel, crisp quinine, caramel',
    servingSpec: '12 oz iced',
    customizable: 'drink',
    availability: 'Seasonal signature',
  },
  {
    id: 'butter-croissant',
    name: 'Normandy Butter Croissant',
    category: 'Viennoiserie',
    subtitle: '72-hour laminated sourdough',
    description: 'Shatteringly crisp caramelized crust giving way to an airy, fragrant honeycomb interior baked fresh every morning.',
    basePrice: 5.25,
    image: '/src/assets/images/pastry_artisan_croissant_1795357670764.jpg',
    tastingNotes: 'Cultured butter, toasted wheat, sea salt',
    servingSpec: 'Baked 06:30',
    customizable: 'pastry',
    modelKey: 'croissant',
    availability: 'Limited morning batch',
  },
  {
    id: 'vesper-house-beans',
    name: 'Vesper House Reserve Blend',
    category: 'Roastery Bags',
    subtitle: '340g whole bean · medium roast',
    description: 'Roasted twice weekly in our architectural glass roastery. Calibrated for espresso, moka pot, and rich milk drinks.',
    basePrice: 22.0,
    image: '/src/assets/images/roastery_coffee_bag_1795357666709.jpg',
    tastingNotes: 'Roasted almond, milk chocolate, dried fig',
    servingSpec: '340g bag',
    customizable: 'beans',
    modelKey: 'portafilter',
    availability: 'Roasted this week',
  },
  {
    id: 'velvet-flat-white',
    name: 'Velvet Oat Flat White',
    category: 'Espresso Bar',
    subtitle: 'Double espresso · barista oat',
    description: 'Silky micro-foamed oat milk folded into our bright seasonal espresso blend for a clean, lingering finish.',
    basePrice: 6.0,
    image: '/src/assets/images/drink_signature_cortado_1795357296256.jpg',
    tastingNotes: 'Sweet oat, marzipan, stone fruit',
    servingSpec: '6 oz',
    customizable: 'drink',
    modelKey: 'cortado',
    availability: 'Available all day',
  },
];

export interface CafeTable {
  id: string;
  label: string;
  zone: 'Fluted Travertine Bar' | 'Sunlit Window Alcove' | 'Smoked Walnut Booths' | 'Limestone Courtyard';
  seats: number;
  x: number;
  y: number;
  w: number;
  h: number;
  shape: 'rect' | 'round';
  aestheticFeature: string;
  busySlots: string[];
}

export const CAFE_TABLES: CafeTable[] = [
  {
    id: 'B1',
    label: 'Bar 01',
    zone: 'Fluted Travertine Bar',
    seats: 2,
    x: 420,
    y: 120,
    w: 58,
    h: 44,
    shape: 'rect',
    aestheticFeature: 'Direct view of the brushed brass La Marzocco espresso bar',
    busySlots: ['09:00', '10:30'],
  },
  {
    id: 'B2',
    label: 'Bar 02',
    zone: 'Fluted Travertine Bar',
    seats: 2,
    x: 500,
    y: 120,
    w: 58,
    h: 44,
    shape: 'rect',
    aestheticFeature: 'Front-row pour-over extraction tasting station',
    busySlots: ['10:30', '13:30'],
  },
  {
    id: 'W1',
    label: 'Window 01',
    zone: 'Sunlit Window Alcove',
    seats: 2,
    x: 70,
    y: 95,
    w: 56,
    h: 56,
    shape: 'round',
    aestheticFeature: 'East-facing steel casement window with morning sun shadows',
    busySlots: ['09:00', '12:00'],
  },
  {
    id: 'W2',
    label: 'Window 02',
    zone: 'Sunlit Window Alcove',
    seats: 2,
    x: 70,
    y: 195,
    w: 56,
    h: 56,
    shape: 'round',
    aestheticFeature: 'Quiet linen armchair nook overlooking courtyard greenery',
    busySlots: ['15:00'],
  },
  {
    id: 'W3',
    label: 'Window 03',
    zone: 'Sunlit Window Alcove',
    seats: 4,
    x: 70,
    y: 295,
    w: 84,
    h: 56,
    shape: 'rect',
    aestheticFeature: 'Sunlit travertine table ideal for creative meetings',
    busySlots: ['10:30', '12:00'],
  },
  {
    id: 'S1',
    label: 'Walnut 01',
    zone: 'Smoked Walnut Booths',
    seats: 4,
    x: 240,
    y: 265,
    w: 96,
    h: 64,
    shape: 'rect',
    aestheticFeature: 'Custom oiled American walnut banquette with acoustic plaster wall',
    busySlots: ['12:00', '13:30'],
  },
  {
    id: 'S2',
    label: 'Walnut 02',
    zone: 'Smoked Walnut Booths',
    seats: 6,
    x: 380,
    y: 265,
    w: 118,
    h: 64,
    shape: 'rect',
    aestheticFeature: 'Communal smoked walnut tasting table under brass pendant lights',
    busySlots: ['13:30', '17:00'],
  },
  {
    id: 'C1',
    label: 'Patio 01',
    zone: 'Limestone Courtyard',
    seats: 2,
    x: 565,
    y: 235,
    w: 54,
    h: 54,
    shape: 'round',
    aestheticFeature: 'Open-air cobblestone courtyard with olive tree shade',
    busySlots: ['15:00'],
  },
  {
    id: 'C2',
    label: 'Patio 02',
    zone: 'Limestone Courtyard',
    seats: 4,
    x: 555,
    y: 315,
    w: 76,
    h: 54,
    shape: 'rect',
    aestheticFeature: 'Heated limestone terrace corner for afternoon espresso flights',
    busySlots: ['17:00'],
  },
];

export const RESERVATION_SLOTS = ['08:00', '09:00', '10:30', '12:00', '13:30', '15:00', '17:00', '18:30'];

export interface BlueprintAssetItem {
  id: string;
  name: string;
  fileName: string;
  format: string;
  polyBudget: string;
  textureSpec: string;
  usage: string;
  recommendedSources: string;
  priority: 'Core Hero' | 'Menu Showcase' | 'Environment' | 'Lighting';
}

export const REQUIRED_3D_ASSETS: BlueprintAssetItem[] = [
  {
    id: 'asset-01',
    name: 'Commercial Brass Espresso Machine',
    fileName: '/public/models/espresso-machine-brass.glb',
    format: 'GLB (Draco + KTX2)',
    polyBudget: '18,000 – 25,000 tris',
    textureSpec: '2K PBR (BaseColor, Roughness, Metallic, Normal)',
    usage: 'Hero interior backdrop & interactive barista bar centerpiece',
    recommendedSources: 'Sketchfab (CC-BY / Pro), CGTrader, BlenderKit',
    priority: 'Core Hero',
  },
  {
    id: 'asset-02',
    name: 'Stoneware Ceramic Cup, Saucer & Brass Spoon',
    fileName: '/public/models/cortado-stoneware-set.glb',
    format: 'GLB (Draco)',
    polyBudget: '4,500 – 7,000 tris',
    textureSpec: '1K PBR + 512px Latte Art Albedo swap map',
    usage: 'Interactive 360° hero drink inspector & exploded-view layer model',
    recommendedSources: 'Poly Haven, Sketchfab, Blender procedural lathe',
    priority: 'Core Hero',
  },
  {
    id: 'asset-03',
    name: 'Borosilicate Pour-Over Carafe (Walnut Collar)',
    fileName: '/public/models/pourover-chemex-walnut.glb',
    format: 'GLB (Transmission PBR)',
    polyBudget: '5,000 – 8,000 tris',
    textureSpec: '1K Wood Grain + IOR 1.52 Glass Physical Material',
    usage: 'Filter coffee menu showcase & interactive glass refraction demo',
    recommendedSources: 'BlenderKit, Turbosquid, Sketchfab',
    priority: 'Menu Showcase',
  },
  {
    id: 'asset-04',
    name: 'Laminated French Butter Croissant & Plate',
    fileName: '/public/models/artisan-croissant-plate.glb',
    format: 'GLB (Photogrammetry)',
    polyBudget: '6,000 – 10,000 tris',
    textureSpec: '2K Photogrammetry Albedo + Normal + Roughness',
    usage: 'Viennoiserie menu 3D preview (photogrammetry recommended for flaky crust)',
    recommendedSources: 'Poly Haven (Food Scans), Quixel Megascans / Fab, Sketchfab',
    priority: 'Menu Showcase',
  },
  {
    id: 'asset-05',
    name: '58mm Espresso Portafilter & Roasted Coffee Beans',
    fileName: '/public/models/portafilter-beans-set.glb',
    format: 'GLB (Instanced Beans)',
    polyBudget: '5,500 tris + 300-tri bean instance',
    textureSpec: '1K Brushed Steel + Walnut Handle + Instanced Bean Roast Map',
    usage: 'Roastery bean section, scroll parallax scatter & craft breakdown',
    recommendedSources: 'Sketchfab, BlenderKit, Three.js InstancedMesh',
    priority: 'Menu Showcase',
  },
  {
    id: 'asset-06',
    name: 'Fluted Travertine Espresso Counter Plinth',
    fileName: '/public/models/travertine-counter-slab.glb',
    format: 'GLB (Draco)',
    polyBudget: '3,000 – 6,000 tris',
    textureSpec: '2K Tileable Travertine, Smoked Walnut & Basalt PBR swaps',
    usage: 'Physical café aesthetic bridge — material swaps sync with interior lighting',
    recommendedSources: 'AmbientCG (CC0 PBR Materials), Poly Haven, custom Blender extrusion',
    priority: 'Environment',
  },
  {
    id: 'asset-07',
    name: 'Minimalist Roastery Coffee Bag (250g / 340g)',
    fileName: '/public/models/roastery-pouch-340g.glb',
    format: 'GLB (UV-Mapped Front)',
    polyBudget: '2,500 – 4,000 tris',
    textureSpec: '1K Matte Kraft / Linen + dynamic label UV slot per roast origin',
    usage: 'E-commerce subscription & whole-bean bag configurator',
    recommendedSources: 'CGTrader, YellowImages 3D, Sketchfab',
    priority: 'Menu Showcase',
  },
  {
    id: 'asset-08',
    name: 'Architectural Cafe Bistro Table, Chair & Pendant Lamp',
    fileName: '/public/models/cafe-bistro-furniture.glb',
    format: 'GLB (Modular Kit)',
    polyBudget: '8,000 – 12,000 tris',
    textureSpec: '1K Oak/Walnut + Linen Fabric Sheen + Brushed Brass',
    usage: 'Optional 3D table reservation seat preview & spatial walk-through',
    recommendedSources: 'Poly Haven (Furniture), Sketchfab, Dimensiva',
    priority: 'Environment',
  },
  {
    id: 'asset-09',
    name: 'Indoor Olive Tree / Ficus Botanical Planter',
    fileName: '/public/models/courtyard-olive-planter.glb',
    format: 'GLB (Alpha-Cutout Leaves)',
    polyBudget: '7,000 – 11,000 tris',
    textureSpec: '1K Leaf Atlas (AlphaTest) + Travertine Planter Pot',
    usage: 'Softens architectural stone edges in courtyard & window scenes',
    recommendedSources: 'Fab (Quixel), Poly Haven, BlenderKit',
    priority: 'Environment',
  },
  {
    id: 'asset-10',
    name: 'Interior Cafe Studio HDRI Maps (Morning / Golden / Night)',
    fileName: '/public/hdri/cafe-morning-1k.hdr (+ dusk & night)',
    format: 'HDR / EXR (1K PMREM)',
    polyBudget: 'N/A (~1.2 MB per HDR)',
    textureSpec: '32-bit Equirectangular IBL for realistic brass & glass reflections',
    usage: 'Drives real-time Morning / Golden Hour / Evening Bar lighting transitions',
    recommendedSources: 'Poly Haven HDRIs (CC0 — e.g. brown_photostudio, studio_small, venice_sunset)',
    priority: 'Lighting',
  },
];

export interface DevelopmentPhase {
  phase: string;
  title: string;
  duration: string;
  owner: string;
  objectives: string[];
  deliverables: string[];
  exitGate: string;
}

export const DEVELOPMENT_PHASES: DevelopmentPhase[] = [
  {
    phase: 'Phase 01',
    title: 'Cafe Aesthetic Tokenization & Spatial UX Architecture',
    duration: 'Week 1',
    owner: 'Design Lead + Cafe Owner',
    objectives: [
      'Audit physical cafe materials (travertine stone, smoked walnut, brushed brass, ceramic glaze) and measure real lighting Kelvin shifts across morning, afternoon, and evening.',
      'Convert interior swatches and spatial zones into a shared CSS & Three.js PBR material token system.',
      'Wireframe commercial conversion funnels: 3D Hero -> Menu Customizer -> Bag/Checkout -> Floor-Plan Table Booking.',
    ],
    deliverables: [
      'Material & Lighting Token Sheet (Morning 5200K / Dusk 3400K / Evening 2700K)',
      'Architectural Floor Plan SVG coordinate map for all reservable tables',
      'Menu SKU schema with modifier pricing rules & allergens',
    ],
    exitGate: 'Cafe owner sign-off on visual parity between physical interior photos and digital theme tokens.',
  },
  {
    phase: 'Phase 02',
    title: '3D Asset Pipeline, Compression & Interactive WebGL Stage',
    duration: 'Weeks 2 – 3',
    owner: 'Creative Developer / 3D Technical Artist',
    objectives: [
      'Source or model all 10 required .glb assets, normalize pivot points to bottom-center (Y=0), and clean UV seams in Blender.',
      'Compress meshes via gltf-transform (Draco geometry + KTX2/WebP textures) so total initial 3D payload stays under 3.5 MB.',
      'Build the Three.js / React stage with PMREM environment reflections, software-WebGL detection, smooth exponential camera damping, and exploded-view kinematics.',
    ],
    deliverables: [
      'Optimized /public/models/*.glb bundle + /public/hdri/*.hdr lighting set',
      'Reusable Three.js Stage controller with OrbitControls, camera presets & Aesthetic Sync',
      'Graceful 2D studio image fallback for low-power devices & prefers-reduced-motion',
    ],
    exitGate: '60 FPS on desktop GPU, >= 30 FPS on mid-tier mobile, zero WebGL memory leaks on unmount.',
  },
  {
    phase: 'Phase 03',
    title: 'Full Commercial Business Logic (Ordering, Customization & POS)',
    duration: 'Weeks 4 – 5',
    owner: 'Full-Stack Engineer',
    objectives: [
      'Implement live menu filtering, drink/pastry modifier configurator (milk, roast, shots, temperature), and dynamic price calculation.',
      'Build persistent Shopping Bag, promo code validation, tax/tip computation, Counter Pickup vs. Table Service routing, and Stripe/Square payment intents.',
      'Connect confirmed orders to Kitchen Display System (KDS) / Square or Toast POS webhooks with live order status tracking.',
    ],
    deliverables: [
      'REST/Webhook API endpoints (/api/menu, /api/orders, /api/payments/intent)',
      'Order state machine (Received -> Pulling Espresso -> Plating -> Ready)',
      'Automated digital receipt & SMS/email pickup notification flow',
    ],
    exitGate: 'End-to-end sandbox checkout succeeds with tax, tip, promo codes, and live status progression.',
  },
  {
    phase: 'Phase 04',
    title: 'Spatial Table Reservation Engine & Cafe Operations Admin',
    duration: 'Week 6',
    owner: 'Full-Stack Engineer',
    objectives: [
      'Connect the interactive floor plan SVG to real-time seat inventory with double-booking locks and party-size matching.',
      'Add table turnover buffer rules (60m coffee / 90m brunch) and optional pre-order linking to a booked table.',
      'Provide lightweight owner controls to toggle sold-out pastries, update seasonal beans, and switch default ambiance presets.',
    ],
    deliverables: [
      'Transactional reservation database schema (tables, slots, reservations, hold locks)',
      'Host stand view for check-in, no-show release, and table status overrides',
      'Owner CMS / inventory toggle panel for daily bakery batch counts',
    ],
    exitGate: 'Concurrent reservation stress test confirms zero double-booked tables across 50 simultaneous requests.',
  },
  {
    phase: 'Phase 05',
    title: 'Cross-Device QA, WebGL Profiling & Accessibility Testing',
    duration: 'Week 7',
    owner: 'QA Engineer + Frontend Lead',
    objectives: [
      'Run Playwright E2E tests covering drink customization, promo codes, checkout, and table reservation cancellation.',
      'Audit Core Web Vitals (LCP < 2.5s, CLS < 0.05), WebGL context loss recovery, and GPU texture memory ceilings (< 150 MB VRAM).',
      'Verify WCAG 2.1 AA contrast, keyboard navigation across 3D dock controls, and screen-reader labels on SVG floor plan tables.',
    ],
    deliverables: [
      'Automated E2E test suite (Playwright) & unit tests (Vitest) for pricing/tax/inventory math',
      'Lighthouse Performance/Accessibility/SEO report (>= 90 across mobile & desktop)',
      'Cross-browser matrix verification (Safari iOS/macOS, Chrome, Edge, Firefox)',
    ],
    exitGate: 'Zero P0/P1 bugs, Lighthouse >= 90, and verified fallback rendering when WebGL is disabled.',
  },
  {
    phase: 'Phase 06',
    title: 'Edge Deployment, CDN Asset Delivery & Post-Launch Telemetry',
    duration: 'Week 8',
    owner: 'DevOps / Release Engineer',
    objectives: [
      'Configure immutable CDN caching (Cache-Control: max-age=31536000) for compressed .glb and .hdr assets on Cloudflare R2 / Vercel Edge.',
      'Deploy production frontend & Node/Express API with automated GitHub Actions CI/CD, staging preview URLs, and Sentry error tracking.',
      'Conduct soft launch with live cafe QR table codes linking diners straight into the 3D menu & table ordering flow.',
    ],
    deliverables: [
      'Production CI/CD pipeline + zero-downtime staging-to-prod promotion',
      'CDN asset compression & Brotli delivery rules for WebGL bundles',
      'Custom table QR plaques & analytics funnel (3D Inspect -> Add to Bag -> Order Paid)',
    ],
    exitGate: 'Live production cutover with real payment test, POS ticket print verification, and uptime alerting active.',
  },
];
