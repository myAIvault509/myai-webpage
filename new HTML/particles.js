const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let W, H, nodes = [], mouse = { x: -9999, y: -9999 };
const N = 80;
const BLUE   = [59, 130, 255];
const PURPLE = [155, 92, 255];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function rand(a, b) { return a + Math.random() * (b - a); }

function init() {
  nodes = [];
  for (let i = 0; i < N; i++) {
    nodes.push({
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25),
      r: rand(1.2, 2.8),
      color: Math.random() < 0.5 ? BLUE : PURPLE,
    });
  }
}

function lerpColor(c1, c2, t) {
  return [
    Math.round(c1[0] + (c2[0]-c1[0])*t),
    Math.round(c1[1] + (c2[1]-c1[1])*t),
    Math.round(c1[2] + (c2[2]-c1[2])*t),
  ];
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  // connections
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 140) {
        const a = (1 - d / 140) * 0.18;
        const mid = lerpColor(nodes[i].color, nodes[j].color, 0.5);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${mid},${a})`;
        ctx.lineWidth = 0.8;
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // nodes
  for (let i = 0; i < N; i++) {
    const n = nodes[i];
    const dx = n.x - mouse.x, dy = n.y - mouse.y;
    const dm = Math.sqrt(dx*dx + dy*dy);
    const glow = dm < 120 ? (1 - dm / 120) : 0;

    if (dm < 80 && dm > 0) {
      n.vx += (dx / dm) * 0.05;
      n.vy += (dy / dm) * 0.05;
    }

    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r + glow * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${n.color},${0.35 + glow * 0.5})`;
    ctx.fill();

    n.x += n.vx; n.y += n.vy;
    n.vx *= 0.99; n.vy *= 0.99;
    if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
    if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;
  }

  requestAnimationFrame(draw);
}

window.addEventListener('resize', () => { resize(); init(); });
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

resize(); init(); draw();
