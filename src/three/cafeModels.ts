import * as THREE from 'three';
import {
  createEspressoPuckTexture,
  createLatteArtTexture,
  createPastryCrustTexture,
  createSlateTexture,
  createStonewareTexture,
  createTravertineTexture,
  createWalnutTexture,
} from './proceduralTextures';

export interface CafeMaterialLibrary {
  stoneware: THREE.MeshStandardMaterial;
  stonewareInner: THREE.MeshStandardMaterial;
  latteArt: THREE.MeshStandardMaterial;
  brass: THREE.MeshPhysicalMaterial;
  steel: THREE.MeshStandardMaterial;
  walnut: THREE.MeshStandardMaterial;
  leather: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  amberCoffee: THREE.MeshPhysicalMaterial;
  paperFilter: THREE.MeshStandardMaterial;
  croissantCrust: THREE.MeshStandardMaterial;
  butter: THREE.MeshStandardMaterial;
  espressoPuck: THREE.MeshStandardMaterial;
  coffeeBean: THREE.MeshStandardMaterial;
  counterTravertine: THREE.MeshStandardMaterial;
  counterWalnut: THREE.MeshStandardMaterial;
  counterSlate: THREE.MeshStandardMaterial;
  steam: THREE.MeshBasicMaterial;
  dispose: () => void;
}

export function createCafeMaterials(
  anisotropy: number,
  isSoftwareGl: boolean,
): CafeMaterialLibrary {
  const stonewareTex = createStonewareTexture(anisotropy);
  const latteTex = createLatteArtTexture(anisotropy);
  const travertineTex = createTravertineTexture(anisotropy);
  const walnutTex = createWalnutTexture(anisotropy);
  const slateTex = createSlateTexture(anisotropy);
  const pastryTex = createPastryCrustTexture(anisotropy);
  const puckTex = createEspressoPuckTexture(anisotropy);

  const stoneware = new THREE.MeshStandardMaterial({
    map: stonewareTex,
    roughness: 0.62,
    metalness: 0.04,
  });

  const stonewareInner = new THREE.MeshStandardMaterial({
    color: 0xe6dfd2,
    roughness: 0.28,
    metalness: 0.05,
  });

  const latteArt = new THREE.MeshStandardMaterial({
    map: latteTex,
    roughness: 0.24,
    metalness: 0.02,
  });

  const brass = new THREE.MeshPhysicalMaterial({
    color: 0xc99c58,
    metalness: 0.94,
    roughness: 0.22,
    clearcoat: 0.35,
    anisotropy: 0.6,
  });

  const steel = new THREE.MeshStandardMaterial({
    color: 0xd6d8dc,
    metalness: 0.92,
    roughness: 0.18,
  });

  const walnut = new THREE.MeshStandardMaterial({
    map: walnutTex,
    roughness: 0.54,
    metalness: 0.03,
  });

  const leather = new THREE.MeshStandardMaterial({
    color: 0x6b4125,
    roughness: 0.78,
    metalness: 0.02,
  });

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xf7fbff,
    metalness: 0.02,
    roughness: 0.06,
    transmission: isSoftwareGl ? 0 : 0.92,
    transparent: true,
    opacity: isSoftwareGl ? 0.32 : 1,
    ior: 1.52,
    thickness: 0.35,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const amberCoffee = new THREE.MeshPhysicalMaterial({
    color: 0x7b330b,
    metalness: 0.02,
    roughness: 0.12,
    clearcoat: 0.85,
    transparent: true,
    opacity: 0.88,
  });

  const paperFilter = new THREE.MeshStandardMaterial({
    color: 0xe4d5be,
    roughness: 0.92,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });

  const croissantCrust = new THREE.MeshStandardMaterial({
    map: pastryTex,
    roughness: 0.44,
    metalness: 0.04,
  });

  const butter = new THREE.MeshStandardMaterial({
    color: 0xf6e4a8,
    roughness: 0.32,
    metalness: 0.02,
  });

  const espressoPuck = new THREE.MeshStandardMaterial({
    map: puckTex,
    roughness: 0.86,
    metalness: 0.02,
  });

  const coffeeBean = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.36,
    metalness: 0.08,
  });

  const counterTravertine = new THREE.MeshStandardMaterial({
    map: travertineTex,
    roughness: 0.72,
    metalness: 0.03,
  });

  const counterWalnut = new THREE.MeshStandardMaterial({
    map: walnutTex,
    roughness: 0.48,
    metalness: 0.05,
  });

  const counterSlate = new THREE.MeshStandardMaterial({
    map: slateTex,
    roughness: 0.56,
    metalness: 0.12,
  });

  const steam = new THREE.MeshBasicMaterial({
    color: 0xfffaf2,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const allMaterials = [
    stoneware,
    stonewareInner,
    latteArt,
    brass,
    steel,
    walnut,
    leather,
    glass,
    amberCoffee,
    paperFilter,
    croissantCrust,
    butter,
    espressoPuck,
    coffeeBean,
    counterTravertine,
    counterWalnut,
    counterSlate,
    steam,
  ];
  const allTextures = [
    stonewareTex,
    latteTex,
    travertineTex,
    walnutTex,
    slateTex,
    pastryTex,
    puckTex,
  ];

  return {
    stoneware,
    stonewareInner,
    latteArt,
    brass,
    steel,
    walnut,
    leather,
    glass,
    amberCoffee,
    paperFilter,
    croissantCrust,
    butter,
    espressoPuck,
    coffeeBean,
    counterTravertine,
    counterWalnut,
    counterSlate,
    steam,
    dispose: () => {
      allMaterials.forEach((m) => m.dispose());
      allTextures.forEach((t) => t.dispose());
    },
  };
}

function registerExplodable(obj: THREE.Object3D, offset: [number, number, number]) {
  obj.userData.basePos = obj.position.clone();
  obj.userData.explodeOffset = new THREE.Vector3(offset[0], offset[1], offset[2]);
}

function enableShadows(group: THREE.Object3D, cast = true, receive = true) {
  group.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = cast;
      child.receiveShadow = receive;
    }
  });
}

/**
 * 1. Signature Stoneware Cortado (6 composite parts + volumetric steam wisps)
 */
export function buildCortadoModel(mats: CafeMaterialLibrary): {
  group: THREE.Group;
  steamMeshes: THREE.Mesh[];
} {
  const group = new THREE.Group();
  group.name = 'cortado';

  // Part 1: Hand-thrown ceramic saucer (LatheGeometry, grounded at Y=0)
  const saucerPts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.68, 0.0),
    new THREE.Vector2(0.76, 0.03),
    new THREE.Vector2(1.16, 0.14),
    new THREE.Vector2(1.22, 0.2),
    new THREE.Vector2(1.16, 0.215),
    new THREE.Vector2(0.7, 0.11),
    new THREE.Vector2(0.56, 0.085),
    new THREE.Vector2(0.0, 0.085),
  ];
  const saucer = new THREE.Mesh(new THREE.LatheGeometry(saucerPts, 56), mats.stoneware);
  registerExplodable(saucer, [0, -0.22, 0]);
  group.add(saucer);

  // Part 2: Tapered stoneware cup body (LatheGeometry with foot ring + lip)
  const cupGroup = new THREE.Group();
  cupGroup.position.set(0, 0.085, 0);
  const cupPts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.46, 0.0),
    new THREE.Vector2(0.5, 0.08),
    new THREE.Vector2(0.64, 0.34),
    new THREE.Vector2(0.72, 0.72),
    new THREE.Vector2(0.74, 0.96),
    new THREE.Vector2(0.7, 0.99),
    new THREE.Vector2(0.66, 0.95),
    new THREE.Vector2(0.62, 0.65),
    new THREE.Vector2(0.48, 0.22),
    new THREE.Vector2(0.0, 0.14),
  ];
  const cupBody = new THREE.Mesh(new THREE.LatheGeometry(cupPts, 56), mats.stoneware);
  cupGroup.add(cupBody);

  // Part 3: Curved artisanal ceramic handle (TubeGeometry)
  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.68, 0.79, 0),
    new THREE.Vector3(0.95, 0.82, 0),
    new THREE.Vector3(1.06, 0.62, 0),
    new THREE.Vector3(0.92, 0.37, 0),
    new THREE.Vector3(0.57, 0.31, 0),
  ]);
  const handle = new THREE.Mesh(new THREE.TubeGeometry(handleCurve, 32, 0.068, 16, false), mats.stoneware);
  cupGroup.add(handle);

  // Subtle brass foot accent ring on cup base
  const footTrim = new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.012, 10, 48), mats.brass);
  footTrim.rotation.x = Math.PI / 2;
  footTrim.position.y = 0.02;
  cupGroup.add(footTrim);

  registerExplodable(cupGroup, [0, 0.24, 0]);
  group.add(cupGroup);

  // Part 4: Espresso + Rosetta micro-foam surface disc
  const cremaGeo = new THREE.CylinderGeometry(0.66, 0.64, 0.04, 48);
  const cremaMesh = new THREE.Mesh(cremaGeo, [mats.stonewareInner, mats.latteArt, mats.stonewareInner]);
  cremaMesh.position.set(0, 0.95, 0);
  cremaMesh.rotation.y = -Math.PI / 6;
  registerExplodable(cremaMesh, [0, 0.68, 0]);
  group.add(cremaMesh);

  // Part 5: Brushed brass demitasse spoon resting beside saucer
  const spoonGroup = new THREE.Group();
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.75, 0.03, 0),
    new THREE.Vector3(-0.15, 0.035, 0),
    new THREE.Vector3(0.32, 0.055, 0),
  ]);
  const spoonStem = new THREE.Mesh(new THREE.TubeGeometry(stemCurve, 20, 0.022, 10, false), mats.brass);
  spoonStem.scale.set(1, 0.45, 1.35);
  spoonGroup.add(spoonStem);

  const spoonBowl = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 16, 0, Math.PI * 2, Math.PI * 0.55, Math.PI * 0.45), mats.brass);
  spoonBowl.scale.set(1.4, 0.48, 0.92);
  spoonBowl.position.set(0.48, 0.075, 0);
  spoonGroup.add(spoonBowl);

  spoonGroup.position.set(0.28, 0.01, 1.18);
  spoonGroup.rotation.y = -0.34;
  registerExplodable(spoonGroup, [0.35, 0.16, 0.42]);
  group.add(spoonGroup);

  // Part 6: Delicate rising steam wisps
  const steamMeshes: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const steamCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(angle) * 0.16, 1.05, Math.sin(angle) * 0.16),
      new THREE.Vector3(Math.cos(angle + 0.6) * 0.24, 1.38, Math.sin(angle + 0.6) * 0.2),
      new THREE.Vector3(Math.cos(angle - 0.3) * 0.12, 1.72, Math.sin(angle - 0.3) * 0.14),
      new THREE.Vector3(Math.cos(angle + 0.4) * 0.19, 2.02, Math.sin(angle + 0.4) * 0.18),
    ]);
    const steamMesh = new THREE.Mesh(
      new THREE.TubeGeometry(steamCurve, 24, 0.045 - i * 0.006, 8, false),
      mats.steam,
    );
    steamMesh.castShadow = false;
    steamMesh.receiveShadow = false;
    steamMesh.userData.phase = i * 2.1;
    steamMesh.userData.baseY = 0;
    group.add(steamMesh);
    steamMeshes.push(steamMesh);
  }

  enableShadows(group, true, true);
  steamMeshes.forEach((s) => {
    s.castShadow = false;
    s.receiveShadow = false;
  });

  return { group, steamMeshes };
}

/**
 * 2. Sculptural Borosilicate Pour-Over Carafe + Tasting Glass (6 composite parts)
 */
export function buildPourOverModel(mats: CafeMaterialLibrary): THREE.Group {
  const group = new THREE.Group();
  group.name = 'pourover';

  // Part 1: Luminous amber coffee inside lower chamber
  const liquidPts = [
    new THREE.Vector2(0.0, 0.04),
    new THREE.Vector2(0.56, 0.04),
    new THREE.Vector2(0.74, 0.2),
    new THREE.Vector2(0.7, 0.48),
    new THREE.Vector2(0.58, 0.68),
    new THREE.Vector2(0.0, 0.68),
  ];
  const liquid = new THREE.Mesh(new THREE.LatheGeometry(liquidPts, 48), mats.amberCoffee);
  liquid.position.set(-0.22, 0, 0);
  liquid.renderOrder = 1;
  registerExplodable(liquid, [0, 0.12, 0]);
  group.add(liquid);

  // Part 2: Hourglass borosilicate glass carafe
  const carafePts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.58, 0.0),
    new THREE.Vector2(0.79, 0.22),
    new THREE.Vector2(0.74, 0.56),
    new THREE.Vector2(0.42, 1.06),
    new THREE.Vector2(0.36, 1.24),
    new THREE.Vector2(0.54, 1.62),
    new THREE.Vector2(0.75, 2.02),
    new THREE.Vector2(0.78, 2.06),
    new THREE.Vector2(0.73, 2.06),
    new THREE.Vector2(0.51, 1.63),
    new THREE.Vector2(0.33, 1.24),
    new THREE.Vector2(0.39, 1.04),
    new THREE.Vector2(0.71, 0.55),
    new THREE.Vector2(0.75, 0.22),
    new THREE.Vector2(0.54, 0.04),
    new THREE.Vector2(0.0, 0.04),
  ];
  const carafe = new THREE.Mesh(new THREE.LatheGeometry(carafePts, 56), mats.glass);
  carafe.position.set(-0.22, 0, 0);
  carafe.renderOrder = 3;
  registerExplodable(carafe, [0, 0.0, 0]);
  group.add(carafe);

  // Part 3: Sculpted oiled smoked walnut collar + raw leather tie & brass bead
  const collarGroup = new THREE.Group();
  collarGroup.position.set(-0.22, 0, 0);

  const collarPts = [
    new THREE.Vector2(0.48, 0.94),
    new THREE.Vector2(0.55, 0.98),
    new THREE.Vector2(0.45, 1.22),
    new THREE.Vector2(0.54, 1.5),
    new THREE.Vector2(0.51, 1.54),
    new THREE.Vector2(0.47, 1.5),
    new THREE.Vector2(0.38, 1.22),
    new THREE.Vector2(0.44, 0.96),
  ];
  const woodCollar = new THREE.Mesh(new THREE.LatheGeometry(collarPts, 48), mats.walnut);
  collarGroup.add(woodCollar);

  const leatherCord = new THREE.Mesh(new THREE.TorusGeometry(0.455, 0.022, 12, 48), mats.leather);
  leatherCord.rotation.x = Math.PI / 2;
  leatherCord.position.y = 1.23;
  collarGroup.add(leatherCord);

  const brassBead = new THREE.Mesh(new THREE.SphereGeometry(0.068, 24, 18), mats.brass);
  brassBead.position.set(0.47, 1.23, 0.14);
  collarGroup.add(brassBead);

  const laceTailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.47, 1.21, 0.14),
    new THREE.Vector3(0.54, 0.98, 0.2),
    new THREE.Vector3(0.62, 0.72, 0.25),
  ]);
  const laceTail = new THREE.Mesh(new THREE.TubeGeometry(laceTailCurve, 18, 0.015, 8, false), mats.leather);
  collarGroup.add(laceTail);

  registerExplodable(collarGroup, [0, 0.42, 0.35]);
  group.add(collarGroup);

  // Part 4: Unbleached paper filter cone in top funnel
  const filterPts = [
    new THREE.Vector2(0.02, 1.32),
    new THREE.Vector2(0.48, 1.72),
    new THREE.Vector2(0.73, 2.18),
    new THREE.Vector2(0.71, 2.18),
    new THREE.Vector2(0.46, 1.72),
    new THREE.Vector2(0.01, 1.34),
  ];
  const filterCone = new THREE.Mesh(new THREE.LatheGeometry(filterPts, 36), mats.paperFilter);
  filterCone.position.set(-0.22, 0, 0);
  registerExplodable(filterCone, [0, 0.88, 0]);
  group.add(filterCone);

  // Part 5: Companion borosilicate tasting glass with amber coffee
  const tastingGroup = new THREE.Group();
  tastingGroup.position.set(0.95, 0, 0.28);

  const miniLiquid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.31, 0.25, 0.38, 36),
    mats.amberCoffee,
  );
  miniLiquid.position.y = 0.23;
  miniLiquid.renderOrder = 1;
  tastingGroup.add(miniLiquid);

  const miniGlassPts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.26, 0.0),
    new THREE.Vector2(0.36, 0.78),
    new THREE.Vector2(0.34, 0.78),
    new THREE.Vector2(0.24, 0.04),
    new THREE.Vector2(0.0, 0.04),
  ];
  const miniGlass = new THREE.Mesh(new THREE.LatheGeometry(miniGlassPts, 36), mats.glass);
  miniGlass.renderOrder = 3;
  tastingGroup.add(miniGlass);

  registerExplodable(tastingGroup, [0.45, 0.22, 0.28]);
  group.add(tastingGroup);

  enableShadows(group, true, true);
  carafe.castShadow = false;
  miniGlass.castShadow = false;

  return group;
}

/**
 * 3. Laminated Normandy Butter Croissant + Plate + Butter Ramekin (6 composite parts)
 */
export function buildCroissantModel(mats: CafeMaterialLibrary): THREE.Group {
  const group = new THREE.Group();
  group.name = 'croissant';

  // Part 1: Matte speckled stoneware service plate (grounded Y=0)
  const platePts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.94, 0.0),
    new THREE.Vector2(1.26, 0.08),
    new THREE.Vector2(1.36, 0.16),
    new THREE.Vector2(1.31, 0.175),
    new THREE.Vector2(1.18, 0.1),
    new THREE.Vector2(0.9, 0.065),
    new THREE.Vector2(0.0, 0.065),
  ];
  const plate = new THREE.Mesh(new THREE.LatheGeometry(platePts, 64), mats.stoneware);
  registerExplodable(plate, [0, -0.22, 0]);
  group.add(plate);

  // Part 2: Multi-lobe crescent croissant (7 sculpted laminated dough rings)
  const pastryGroup = new THREE.Group();
  pastryGroup.position.set(-0.04, 0.14, 0.02);

  const segments = [
    { x: -0.78, y: 0.12, z: 0.34, rx: 0.15, ry: 0.62, rz: -0.24, sx: 0.28, sy: 0.22, sz: 0.26 },
    { x: -0.52, y: 0.22, z: 0.14, rx: 0.08, ry: 0.38, rz: -0.14, sx: 0.38, sy: 0.31, sz: 0.35 },
    { x: -0.22, y: 0.31, z: 0.02, rx: 0.04, ry: 0.16, rz: -0.05, sx: 0.45, sy: 0.39, sz: 0.43 },
    { x: 0.05, y: 0.34, z: -0.02, rx: 0.0, ry: 0.0, rz: 0.0, sx: 0.48, sy: 0.43, sz: 0.46 },
    { x: 0.32, y: 0.3, z: 0.04, rx: 0.05, ry: -0.2, rz: 0.08, sx: 0.44, sy: 0.38, sz: 0.41 },
    { x: 0.58, y: 0.21, z: 0.17, rx: 0.1, ry: -0.44, rz: 0.16, sx: 0.36, sy: 0.29, sz: 0.33 },
    { x: 0.82, y: 0.12, z: 0.36, rx: 0.16, ry: -0.68, rz: 0.24, sx: 0.25, sy: 0.2, sz: 0.24 },
  ];

  const lobeGeo = new THREE.SphereGeometry(0.75, 24, 18);
  segments.forEach((s) => {
    const lobe = new THREE.Mesh(lobeGeo, mats.croissantCrust);
    lobe.position.set(s.x, s.y, s.z);
    lobe.rotation.set(s.rx, s.ry, s.rz);
    lobe.scale.set(s.sx, s.sy, s.sz);
    pastryGroup.add(lobe);
  });

  // Top folded lamination crest rib
  const crestCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.62, 0.28, 0.2),
    new THREE.Vector3(-0.18, 0.5, 0.0),
    new THREE.Vector3(0.24, 0.48, 0.02),
    new THREE.Vector3(0.66, 0.26, 0.22),
  ]);
  const crest = new THREE.Mesh(new THREE.TubeGeometry(crestCurve, 28, 0.09, 12, false), mats.croissantCrust);
  crest.scale.set(1, 0.65, 1.35);
  pastryGroup.add(crest);

  registerExplodable(pastryGroup, [0, 0.45, 0]);
  group.add(pastryGroup);

  // Part 3: Cultured butter ceramic ramekin + whipped butter mound
  const ramekinGroup = new THREE.Group();
  ramekinGroup.position.set(1.18, 0, -0.78);

  const ramekinPts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.32, 0.0),
    new THREE.Vector2(0.35, 0.32),
    new THREE.Vector2(0.31, 0.33),
    new THREE.Vector2(0.29, 0.06),
    new THREE.Vector2(0.0, 0.06),
  ];
  const ramekin = new THREE.Mesh(new THREE.LatheGeometry(ramekinPts, 32), mats.stoneware);
  ramekinGroup.add(ramekin);

  const butterMound = new THREE.Mesh(new THREE.SphereGeometry(0.27, 24, 16), mats.butter);
  butterMound.scale.set(1, 0.42, 1);
  butterMound.position.y = 0.24;
  ramekinGroup.add(butterMound);

  registerExplodable(ramekinGroup, [0.35, 0.26, -0.32]);
  group.add(ramekinGroup);

  // Part 4: Brushed brass & steel butter knife
  const knifeGroup = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.CapsuleGeometry(0.036, 0.55, 8, 16), mats.brass);
  handle.rotation.z = Math.PI / 2;
  handle.position.set(-0.32, 0.04, 0);
  knifeGroup.add(handle);

  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, -0.025);
  bladeShape.lineTo(0.62, -0.045);
  bladeShape.quadraticCurveTo(0.7, 0, 0.62, 0.055);
  bladeShape.lineTo(0, 0.03);
  bladeShape.closePath();

  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.012,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 2,
  });
  bladeGeo.rotateX(Math.PI / 2);
  const blade = new THREE.Mesh(bladeGeo, mats.steel);
  blade.position.set(-0.02, 0.044, 0);
  knifeGroup.add(blade);

  knifeGroup.position.set(0.3, 0.01, 1.32);
  knifeGroup.rotation.y = -0.22;
  registerExplodable(knifeGroup, [0.22, 0.14, 0.4]);
  group.add(knifeGroup);

  enableShadows(group, true, true);
  return group;
}

/**
 * 4. 58mm Espresso Portafilter & Instanced Roasted Coffee Beans (6 composite parts + 42 beans)
 */
export function buildPortafilterModel(mats: CafeMaterialLibrary): THREE.Group {
  const group = new THREE.Group();
  group.name = 'portafilter';

  // Part 1: Stainless double spout assembly (grounded on pedestal)
  const spoutGroup = new THREE.Group();
  const spoutCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.18, 28), mats.steel);
  spoutCollar.position.set(-0.42, 0.16, 0);
  spoutGroup.add(spoutCollar);

  const leftSpoutCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.42, 0.12, 0),
    new THREE.Vector3(-0.42, 0.09, 0.14),
    new THREE.Vector3(-0.42, 0.02, 0.22),
  ]);
  const rightSpoutCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.42, 0.12, 0),
    new THREE.Vector3(-0.42, 0.09, -0.14),
    new THREE.Vector3(-0.42, 0.02, -0.22),
  ]);
  spoutGroup.add(new THREE.Mesh(new THREE.TubeGeometry(leftSpoutCurve, 16, 0.042, 12, false), mats.steel));
  spoutGroup.add(new THREE.Mesh(new THREE.TubeGeometry(rightSpoutCurve, 16, 0.042, 12, false), mats.steel));

  registerExplodable(spoutGroup, [0, -0.28, 0]);
  group.add(spoutGroup);

  // Part 2: Machined 58mm portafilter head & locking lugs
  const headGroup = new THREE.Group();
  headGroup.position.set(-0.42, 0.24, 0);

  const headPts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.42, 0.03),
    new THREE.Vector2(0.55, 0.16),
    new THREE.Vector2(0.57, 0.44),
    new THREE.Vector2(0.61, 0.48),
    new THREE.Vector2(0.53, 0.48),
    new THREE.Vector2(0.51, 0.16),
    new THREE.Vector2(0.0, 0.06),
  ];
  const headShell = new THREE.Mesh(new THREE.LatheGeometry(headPts, 48), mats.steel);
  headGroup.add(headShell);

  // Locking ears
  const earGeo = new THREE.BoxGeometry(0.22, 0.075, 1.32);
  const ears = new THREE.Mesh(earGeo, mats.steel);
  ears.position.set(0, 0.36, 0);
  headGroup.add(ears);

  // Brass neck connector
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.34, 24), mats.brass);
  neck.rotation.z = Math.PI / 2;
  neck.position.set(0.68, 0.28, 0);
  headGroup.add(neck);

  registerExplodable(headGroup, [0, 0.14, 0]);
  group.add(headGroup);

  // Part 3: Precision stainless basket + tamped dark espresso puck
  const basketGroup = new THREE.Group();
  basketGroup.position.set(-0.42, 0.32, 0);

  const basketPts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.48, 0.0),
    new THREE.Vector2(0.5, 0.4),
    new THREE.Vector2(0.57, 0.44),
    new THREE.Vector2(0.49, 0.44),
    new THREE.Vector2(0.46, 0.03),
    new THREE.Vector2(0.0, 0.03),
  ];
  const basket = new THREE.Mesh(new THREE.LatheGeometry(basketPts, 48), mats.steel);
  basketGroup.add(basket);

  const puck = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.45, 0.16, 40), mats.espressoPuck);
  puck.position.y = 0.28;
  basketGroup.add(puck);

  registerExplodable(basketGroup, [0, 0.68, 0]);
  group.add(basketGroup);

  // Part 4: Turned smoked walnut handle with brushed brass pommel
  const handleGroup = new THREE.Group();
  handleGroup.position.set(0.42, 0.52, 0);
  handleGroup.rotation.z = -Math.PI / 2 - 0.06;

  const handlePts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.11, 0.0),
    new THREE.Vector2(0.13, 0.25),
    new THREE.Vector2(0.175, 0.85),
    new THREE.Vector2(0.19, 1.15),
    new THREE.Vector2(0.14, 1.24),
    new THREE.Vector2(0.0, 1.26),
  ];
  const woodHandle = new THREE.Mesh(new THREE.LatheGeometry(handlePts, 36), mats.walnut);
  handleGroup.add(woodHandle);

  const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.115, 0.1, 28), mats.brass);
  ferrule.position.y = 0.04;
  handleGroup.add(ferrule);

  const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.145, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), mats.brass);
  pommel.position.y = 1.18;
  handleGroup.add(pommel);

  registerExplodable(handleGroup, [0.58, 0.24, 0]);
  group.add(handleGroup);

  // Part 5: InstancedMesh of 42 roasted Arabica coffee beans with per-instance roast tint
  const beanGeo = new THREE.SphereGeometry(0.095, 14, 10);
  beanGeo.scale(1.25, 0.62, 0.86);
  const beanCount = 42;
  const beansInstanced = new THREE.InstancedMesh(beanGeo, mats.coffeeBean, beanCount);

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  const roastPalette = [0x3d2212, 0x4c2b17, 0x2f190d, 0x57341c, 0x381e10];

  for (let i = 0; i < beanCount; i++) {
    const angle = (i / beanCount) * Math.PI * 2 * 2.3 + (i % 5) * 0.22;
    const radius = 0.72 + ((i * 37) % 100) * 0.0085;
    const x = Math.cos(angle) * radius + 0.1;
    const z = Math.sin(angle) * radius * 0.82;
    const scaleJitter = 0.85 + ((i * 19) % 30) * 0.01;

    dummy.position.set(x, 0.045 * scaleJitter, z);
    dummy.rotation.set(
      ((i * 13) % 10) * 0.05,
      angle + (i % 7) * 0.4,
      ((i * 7) % 10) * 0.04,
    );
    dummy.scale.setScalar(scaleJitter);
    dummy.updateMatrix();
    beansInstanced.setMatrixAt(i, dummy.matrix);

    color.setHex(roastPalette[i % roastPalette.length]);
    beansInstanced.setColorAt(i, color);
  }
  beansInstanced.instanceMatrix.needsUpdate = true;
  if (beansInstanced.instanceColor) beansInstanced.instanceColor.needsUpdate = true;
  beansInstanced.computeBoundingSphere();
  beansInstanced.castShadow = true;
  beansInstanced.receiveShadow = true;

  registerExplodable(beansInstanced, [0, -0.1, 0]);
  group.add(beansInstanced);

  enableShadows(group, true, true);
  return group;
}

/**
 * Architectural Fluted Café Tasting Counter Plinth (connects physical interior to 3D stage)
 */
export function buildCounterPedestal(mats: CafeMaterialLibrary): {
  group: THREE.Group;
  surfaceMeshes: THREE.Mesh[];
} {
  const group = new THREE.Group();
  const surfaceMeshes: THREE.Mesh[] = [];

  // Honed counter top slab (top surface strictly at Y = -0.005 so models at Y=0 sit flush)
  const topSlab = new THREE.Mesh(
    new THREE.CylinderGeometry(2.35, 2.38, 0.16, 72),
    mats.counterTravertine,
  );
  topSlab.position.y = -0.085;
  topSlab.receiveShadow = true;
  topSlab.castShadow = true;
  group.add(topSlab);
  surfaceMeshes.push(topSlab);

  // Thin brushed brass architectural inlay ring along counter reveal
  const brassInlay = new THREE.Mesh(new THREE.TorusGeometry(2.34, 0.016, 12, 96), mats.brass);
  brassInlay.rotation.x = Math.PI / 2;
  brassInlay.position.y = -0.17;
  group.add(brassInlay);

  // Monolithic fluted column drum beneath slab (echoes the fluted travertine bar in the cafe)
  const coreBase = new THREE.Mesh(
    new THREE.CylinderGeometry(2.08, 2.12, 1.45, 48),
    mats.counterTravertine,
  );
  coreBase.position.y = -0.9;
  coreBase.receiveShadow = true;
  group.add(coreBase);
  surfaceMeshes.push(coreBase);

  const fluteCount = 36;
  const fluteGeo = new THREE.CylinderGeometry(0.11, 0.11, 1.44, 12);
  for (let i = 0; i < fluteCount; i++) {
    const a = (i / fluteCount) * Math.PI * 2;
    const flute = new THREE.Mesh(fluteGeo, mats.counterTravertine);
    flute.position.set(Math.cos(a) * 2.12, -0.9, Math.sin(a) * 2.12);
    flute.receiveShadow = true;
    group.add(flute);
    surfaceMeshes.push(flute);
  }

  return { group, surfaceMeshes };
}
