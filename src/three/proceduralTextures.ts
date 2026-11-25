import * as THREE from 'three';

function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('2D canvas context unavailable');
  }
  return [canvas, ctx];
}

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function finalizeColorTexture(
  canvas: HTMLCanvasElement,
  anisotropy: number,
  repeatX = 1,
  repeatY = 1,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  if (repeatX !== 1 || repeatY !== 1) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
  }
  tex.needsUpdate = true;
  return tex;
}

export function createStonewareTexture(anisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const rand = seededRandom(4201);

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#E8E1D5');
  grad.addColorStop(0.55, '#DDD3C3');
  grad.addColorStop(1, '#CBBFA9');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle horizontal potter's wheel throw lines
  for (let y = 0; y < 512; y += 3) {
    const alpha = 0.018 + rand() * 0.025;
    ctx.fillStyle = rand() > 0.5 ? `rgba(110, 92, 72, ${alpha})` : `rgba(255, 250, 240, ${alpha})`;
    ctx.fillRect(0, y, 512, 1.5);
  }

  // Natural iron-oxide ceramic speckles matching artisanal stoneware
  for (let i = 0; i < 1650; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const r = 0.4 + Math.pow(rand(), 2.2) * 2.3;
    const dark = 36 + Math.floor(rand() * 48);
    ctx.fillStyle = `rgba(${dark + 16}, ${dark + 6}, ${dark - 4}, ${0.25 + rand() * 0.55})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return finalizeColorTexture(canvas, anisotropy, 1, 1);
}

export function createLatteArtTexture(anisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const cx = 256;
  const cy = 256;

  // Rich golden-brown espresso crema radial base
  const bg = ctx.createRadialGradient(cx, cy, 20, cx, cy, 256);
  bg.addColorStop(0, '#8A5226');
  bg.addColorStop(0.58, '#A96B36');
  bg.addColorStop(0.84, '#8A4F22');
  bg.addColorStop(1, '#582F12');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle crema micro-bubble marbling
  const rand = seededRandom(8812);
  for (let i = 0; i < 380; i++) {
    const a = rand() * Math.PI * 2;
    const d = 140 + rand() * 110;
    ctx.fillStyle = `rgba(235, 204, 165, ${0.06 + rand() * 0.08})`;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1 + rand() * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Delicate poured micro-foam Rosetta petals
  ctx.save();
  ctx.translate(cx, cy + 12);

  const drawPetal = (offsetY: number, spread: number, thickness: number, alpha: number) => {
    ctx.fillStyle = `rgba(250, 243, 232, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, offsetY + thickness * 0.45);
    ctx.bezierCurveTo(
      -spread * 0.45,
      offsetY - thickness * 0.9,
      -spread,
      offsetY - thickness * 0.2,
      -spread * 0.92,
      offsetY + thickness * 0.55,
    );
    ctx.bezierCurveTo(
      -spread * 0.55,
      offsetY + thickness * 1.15,
      -spread * 0.15,
      offsetY + thickness * 0.7,
      0,
      offsetY + thickness * 0.65,
    );
    ctx.bezierCurveTo(
      spread * 0.15,
      offsetY + thickness * 0.7,
      spread * 0.55,
      offsetY + thickness * 1.15,
      spread * 0.92,
      offsetY + thickness * 0.55,
    );
    ctx.bezierCurveTo(
      spread,
      offsetY - thickness * 0.2,
      spread * 0.45,
      offsetY - thickness * 0.9,
      0,
      offsetY + thickness * 0.45,
    );
    ctx.fill();
  };

  // Base wrap leaves
  drawPetal(72, 138, 34, 0.9);
  drawPetal(36, 128, 28, 0.93);
  drawPetal(2, 108, 24, 0.95);
  drawPetal(-30, 86, 20, 0.96);
  drawPetal(-58, 62, 17, 0.97);

  // Top tulip heart crown
  ctx.fillStyle = 'rgba(252, 246, 236, 0.98)';
  ctx.beginPath();
  ctx.moveTo(0, -112);
  ctx.bezierCurveTo(-40, -138, -54, -92, 0, -68);
  ctx.bezierCurveTo(54, -92, 40, -138, 0, -112);
  ctx.fill();

  // Espresso pull-through stem line
  ctx.strokeStyle = 'rgba(130, 74, 34, 0.65)';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -96);
  ctx.lineTo(0, 102);
  ctx.stroke();

  ctx.restore();

  return finalizeColorTexture(canvas, anisotropy, 1, 1);
}

export function createTravertineTexture(anisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const rand = seededRandom(1923);

  ctx.fillStyle = '#DED5C6';
  ctx.fillRect(0, 0, 512, 512);

  // Horizontal sedimentary limestone banding
  for (let i = 0; i < 90; i++) {
    const y = rand() * 512;
    const h = 2 + rand() * 14;
    const tone = 195 + Math.floor(rand() * 34);
    ctx.fillStyle = `rgba(${tone}, ${tone - 9}, ${tone - 22}, ${0.14 + rand() * 0.22})`;
    ctx.fillRect(0, y, 512, h);
  }

  // Natural honed travertine mineral pores
  for (let i = 0; i < 620; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const w = 3 + rand() * 16;
    const h = 1 + rand() * 2.8;
    ctx.fillStyle = `rgba(128, 114, 94, ${0.14 + rand() * 0.25})`;
    ctx.beginPath();
    ctx.ellipse(x, y, w * 0.5, h * 0.5, (rand() - 0.5) * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  return finalizeColorTexture(canvas, anisotropy, 2, 2);
}

export function createWalnutTexture(anisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const rand = seededRandom(5519);

  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, '#473021');
  grad.addColorStop(0.5, '#583B28');
  grad.addColorStop(1, '#3E281B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Organic wood grain fiber ribbons
  for (let i = 0; i < 180; i++) {
    const yBase = (i / 180) * 512;
    const amp = 2 + rand() * 9;
    const freq = 0.008 + rand() * 0.012;
    const phase = rand() * Math.PI * 2;
    ctx.strokeStyle =
      rand() > 0.35
        ? `rgba(28, 16, 9, ${0.15 + rand() * 0.25})`
        : `rgba(116, 82, 54, ${0.1 + rand() * 0.16})`;
    ctx.lineWidth = 1 + rand() * 2.5;
    ctx.beginPath();
    for (let x = 0; x <= 512; x += 16) {
      const y = yBase + Math.sin(x * freq + phase) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  return finalizeColorTexture(canvas, anisotropy, 1, 1);
}

export function createSlateTexture(anisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const rand = seededRandom(7731);

  ctx.fillStyle = '#252528';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 420; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const r = 10 + rand() * 48;
    const v = 28 + Math.floor(rand() * 24);
    ctx.fillStyle = `rgba(${v}, ${v}, ${v + 3}, 0.14)`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Faint mineral quartz veins
  ctx.strokeStyle = 'rgba(130, 128, 122, 0.11)';
  ctx.lineWidth = 1.2;
  for (let j = 0; j < 8; j++) {
    let x = rand() * 512;
    let y = rand() * 512;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let step = 0; step < 12; step++) {
      x += (rand() - 0.3) * 45;
      y += (rand() - 0.5) * 35;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  return finalizeColorTexture(canvas, anisotropy, 2, 2);
}

export function createPastryCrustTexture(anisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const rand = seededRandom(3390);

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#D79A4A');
  grad.addColorStop(0.45, '#BA7228');
  grad.addColorStop(0.85, '#8F4C16');
  grad.addColorStop(1, '#B87129');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Flaky laminated pastry striations
  for (let i = 0; i < 240; i++) {
    const y = rand() * 512;
    ctx.strokeStyle =
      rand() > 0.45
        ? `rgba(248, 212, 146, ${0.15 + rand() * 0.24})`
        : `rgba(104, 48, 12, ${0.18 + rand() * 0.25})`;
    ctx.lineWidth = 1 + rand() * 2.2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(256, y + (rand() - 0.5) * 14, 512, y + (rand() - 0.5) * 8);
    ctx.stroke();
  }

  // Subtle baked sugar blister flecks
  for (let i = 0; i < 520; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    ctx.fillStyle = `rgba(92, 42, 10, ${0.08 + rand() * 0.18})`;
    ctx.beginPath();
    ctx.arc(x, y, 0.8 + rand() * 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  return finalizeColorTexture(canvas, anisotropy, 1, 1);
}

export function createEspressoPuckTexture(anisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(256, 256);
  const rand = seededRandom(9904);

  ctx.fillStyle = '#332014';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 2600; i++) {
    const x = rand() * 256;
    const y = rand() * 256;
    const shade = 28 + Math.floor(rand() * 44);
    ctx.fillStyle = `rgb(${shade + 18}, ${shade + 6}, ${shade - 4})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Concentric tamper polish ring
  ctx.strokeStyle = 'rgba(20, 12, 8, 0.35)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(128, 128, 114, 0, Math.PI * 2);
  ctx.stroke();

  return finalizeColorTexture(canvas, anisotropy, 1, 1);
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(256, 256);
  const grad = ctx.createRadialGradient(128, 128, 14, 128, 128, 122);
  grad.addColorStop(0, 'rgba(14, 11, 8, 0.55)');
  grad.addColorStop(0.55, 'rgba(14, 11, 8, 0.22)');
  grad.addColorStop(1, 'rgba(14, 11, 8, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
