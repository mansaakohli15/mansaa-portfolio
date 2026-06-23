// ============================================================
// PROCEDURAL NEURAL FIELD
// A deterministic, seeded canvas drawing replacing the original
// 240-image photo sequence. Same scrub mechanic (progress 0..1
// drives the frame), but rendered live with code — no image
// assets to ship, fully on-brand, never looks stock.
// ============================================================

// Small deterministic PRNG so the same "frame index" always
// renders identically (mimics a real frame sequence).
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildNodes(count, seed) {
  const rand = mulberry32(seed);
  const nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: rand(),
      y: rand(),
      r: 1.2 + rand() * 2.2,
      phase: rand() * Math.PI * 2,
      speed: 0.3 + rand() * 0.7,
      depth: rand(),
    });
  }
  return nodes;
}

const NODE_COUNT = 90;
const nodes = buildNodes(NODE_COUNT, 1337);

// theme: { bg, accent, accent2 } as "r,g,b" strings
export function drawNeuralField(ctx, width, height, progress, opts = {}) {
  const {
    accent = "139,92,246", // violet
    accent2 = "34,211,238", // cyan
    converge = false, // true = nodes pull toward center (used near scroll end)
    time = progress * 8,
  } = opts;

  ctx.clearRect(0, 0, width, height);

  // backdrop vignette
  const grd = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.7
  );
  grd.addColorStop(0, "rgba(10,8,20,1)");
  grd.addColorStop(1, "rgba(2,2,4,1)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);

  const positions = nodes.map((n) => {
    let px = n.x * width + Math.sin(time * n.speed + n.phase) * 14 * (0.3 + n.depth);
    let py = n.y * height + Math.cos(time * n.speed + n.phase) * 14 * (0.3 + n.depth);

    if (converge) {
      const pull = Math.min(1, (progress - 0.55) / 0.4);
      px = px + (cx - px) * pull * (0.3 + n.depth * 0.5);
      py = py + (cy - py) * pull * (0.3 + n.depth * 0.5);
    }
    return { ...n, px, py };
  });

  // connections — only between near neighbours, fades with distance
  const maxDist = minDim * 0.18;
  ctx.lineWidth = 1;
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const a = positions[i];
      const b = positions[j];
      const dx = a.px - b.px;
      const dy = a.py - b.py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.18 * (0.4 + a.depth);
        const useAccent2 = (i + j) % 5 === 0;
        ctx.strokeStyle = `rgba(${useAccent2 ? accent2 : accent},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.px, a.py);
        ctx.lineTo(b.px, b.py);
        ctx.stroke();
      }
    }
  }

  // nodes
  positions.forEach((n) => {
    const pulse = 0.6 + 0.4 * Math.sin(time * n.speed * 2 + n.phase);
    const radius = n.r * (0.8 + n.depth) * (converge ? 1 + progress * 0.3 : 1);
    const col = n.depth > 0.5 ? accent2 : accent;
    ctx.beginPath();
    ctx.fillStyle = `rgba(${col},${0.55 + 0.35 * pulse})`;
    ctx.arc(n.px, n.py, radius, 0, Math.PI * 2);
    ctx.fill();

    // soft glow on the brighter, "closer" nodes
    if (n.depth > 0.7) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${col},${0.08 * pulse})`;
      ctx.arc(n.px, n.py, radius * 5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // scanlines (very subtle, sells the "system" aesthetic)
  ctx.globalAlpha = 0.025;
  ctx.fillStyle = "#fff";
  for (let y = 0; y < height; y += 3) {
    ctx.fillRect(0, y, width, 1);
  }
  ctx.globalAlpha = 1;
}
