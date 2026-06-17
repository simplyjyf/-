const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const tabButtons = document.querySelectorAll(".tab-button");
const lessonNotes = document.querySelectorAll(".lesson-note");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.note;
    tabButtons.forEach((item) => item.classList.remove("active"));
    lessonNotes.forEach((note) => note.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(targetId)?.classList.add("active");
  });
});

const initialHash = window.location.hash.replace("#", "");
if (initialHash) {
  const hashButton = document.querySelector(`[data-note="${initialHash}"]`);
  const hashNote = document.getElementById(initialHash);
  if (hashButton && hashNote) {
    tabButtons.forEach((item) => item.classList.remove("active"));
    lessonNotes.forEach((note) => note.classList.remove("active"));
    hashButton.classList.add("active");
    hashNote.classList.add("active");
  }
}

const forumForm = document.getElementById("forum-form");
const forumInput = document.getElementById("forum-input");
const forumPreview = document.getElementById("forum-preview");

if (forumForm && forumInput && forumPreview) {
  forumForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = forumInput.value.trim();
    if (!value) {
      forumInput.focus();
      return;
    }
    forumPreview.hidden = false;
    forumPreview.querySelector("p").textContent = value;
    forumInput.value = "";
  });
}

const modelCanvases = {
  parabola: document.getElementById("parabola-model"),
  wave: document.getElementById("wave-model"),
  pendulum: document.getElementById("pendulum-model"),
  projectile: document.getElementById("projectile-model"),
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setupCanvas(canvas) {
  if (!canvas) return null;
  const context = canvas.getContext("2d");
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width));
  const height = Math.max(220, Math.floor(rect.height));
  const pixelWidth = Math.floor(width * ratio);
  const pixelHeight = Math.floor(height * ratio);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { context, width, height };
}

function drawGrid(context, width, height, step = 32) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(3, 12, 18, 0.24)";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "rgba(137, 214, 255, 0.1)";
  context.lineWidth = 1;
  for (let x = 0; x <= width; x += step) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = 0; y <= height; y += step) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
}

function drawGlowingLine(context, points, color, width = 2) {
  if (points.length < 2) return;
  context.save();
  context.lineJoin = "round";
  context.lineCap = "round";
  context.shadowColor = color;
  context.shadowBlur = 16;
  context.strokeStyle = color;
  context.lineWidth = width;
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
  context.stroke();
  context.restore();
}

function drawPoint(context, x, y, color, radius = 5) {
  context.save();
  context.fillStyle = color;
  context.shadowColor = color;
  context.shadowBlur = 18;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function renderParabola(time) {
  const canvasState = setupCanvas(modelCanvases.parabola);
  if (!canvasState) return;
  const { context, width, height } = canvasState;
  drawGrid(context, width, height, 34);
  const centerX = width / 2;
  const centerY = height * 0.58;
  const scale = Math.min(width, height) / 8;
  const a = 0.24 + Math.sin(time * 0.001) * 0.08;
  const shift = Math.sin(time * 0.0007) * 1.25;
  const points = [];
  for (let px = -4.2; px <= 4.2; px += 0.08) {
    const y = a * (px - shift) * (px - shift) - 1.15;
    points.push({ x: centerX + px * scale, y: centerY - y * scale });
  }
  context.strokeStyle = "rgba(237, 248, 255, 0.28)";
  context.beginPath();
  context.moveTo(0, centerY);
  context.lineTo(width, centerY);
  context.moveTo(centerX, 0);
  context.lineTo(centerX, height);
  context.stroke();
  drawGlowingLine(context, points, "#42d9ff", 3);
  const vertexX = centerX + shift * scale;
  const vertexY = centerY + 1.15 * scale;
  drawPoint(context, vertexX, vertexY, "#78f2b4", 7);
  context.fillStyle = "rgba(237, 248, 255, 0.8)";
  context.font = "14px Noto Sans SC, sans-serif";
  context.fillText("y = ax² + bx + c", 24, 32);
  context.fillText("顶点随参数移动", Math.max(24, vertexX - 54), Math.max(26, vertexY - 18));
}

function renderWave(time) {
  const canvasState = setupCanvas(modelCanvases.wave);
  if (!canvasState) return;
  const { context, width, height } = canvasState;
  drawGrid(context, width, height, 30);
  const mid = height * 0.55;
  const amplitude = height * 0.22;
  const points = [];
  for (let x = 0; x <= width; x += 4) {
    const y = mid + Math.sin(x * 0.035 + time * 0.003) * amplitude;
    points.push({ x, y });
  }
  drawGlowingLine(context, points, "#78f2b4", 3);
  context.strokeStyle = "rgba(237, 248, 255, 0.26)";
  context.beginPath();
  context.moveTo(0, mid);
  context.lineTo(width, mid);
  context.stroke();
  const markerX = (time * 0.06) % width;
  const markerY = mid + Math.sin(markerX * 0.035 + time * 0.003) * amplitude;
  drawPoint(context, markerX, markerY, "#f2c76e", 6);
  context.fillStyle = "rgba(237, 248, 255, 0.8)";
  context.font = "14px Noto Sans SC, sans-serif";
  context.fillText("y = A sin(ωx + φ)", 20, 30);
}

function renderPendulum(time) {
  const canvasState = setupCanvas(modelCanvases.pendulum);
  if (!canvasState) return;
  const { context, width, height } = canvasState;
  drawGrid(context, width, height, 30);
  const originX = width / 2;
  const originY = 44;
  const length = Math.min(width, height) * 0.48;
  const angle = Math.sin(time * 0.0022) * 0.62;
  const bobX = originX + Math.sin(angle) * length;
  const bobY = originY + Math.cos(angle) * length;
  context.strokeStyle = "rgba(237, 248, 255, 0.24)";
  context.beginPath();
  context.arc(originX, originY, length, Math.PI * 0.72, Math.PI * 0.28, true);
  context.stroke();
  context.strokeStyle = "#42d9ff";
  context.lineWidth = 2;
  context.shadowColor = "#42d9ff";
  context.shadowBlur = 14;
  context.beginPath();
  context.moveTo(originX, originY);
  context.lineTo(bobX, bobY);
  context.stroke();
  context.shadowBlur = 0;
  drawPoint(context, originX, originY, "#edf8ff", 4);
  drawPoint(context, bobX, bobY, "#78f2b4", 13);
  context.fillStyle = "rgba(237, 248, 255, 0.8)";
  context.font = "14px Noto Sans SC, sans-serif";
  context.fillText("T = 2π√(L/g)", 20, 30);
}

function renderProjectile(time) {
  const canvasState = setupCanvas(modelCanvases.projectile);
  if (!canvasState) return;
  const { context, width, height } = canvasState;
  drawGrid(context, width, height, 32);
  const ground = height * 0.78;
  const startX = width * 0.12;
  const speedX = width * 0.52;
  const speedY = height * 0.7;
  const gravity = height * 0.86;
  const duration = (2 * speedY) / gravity;
  const t = ((time * 0.00075) % duration);
  const trail = [];
  for (let sample = 0; sample <= duration; sample += duration / 80) {
    const x = startX + speedX * sample;
    const y = ground - (speedY * sample - 0.5 * gravity * sample * sample);
    trail.push({ x, y });
  }
  drawGlowingLine(context, trail, "#f2c76e", 2.5);
  const ballX = startX + speedX * t;
  const ballY = ground - (speedY * t - 0.5 * gravity * t * t);
  context.strokeStyle = "rgba(237, 248, 255, 0.28)";
  context.beginPath();
  context.moveTo(0, ground);
  context.lineTo(width, ground);
  context.stroke();
  context.setLineDash([6, 8]);
  context.strokeStyle = "rgba(120, 242, 180, 0.44)";
  context.beginPath();
  context.moveTo(ballX, ballY);
  context.lineTo(ballX, ground);
  context.stroke();
  context.setLineDash([]);
  drawPoint(context, ballX, ballY, "#42d9ff", 8);
  context.fillStyle = "rgba(237, 248, 255, 0.8)";
  context.font = "14px Noto Sans SC, sans-serif";
  context.fillText("x: 匀速  |  y: 匀变速", 20, 30);
}

let modelFrameId;

function renderModels(time = 0) {
  renderParabola(time);
  renderWave(time);
  renderPendulum(time);
  renderProjectile(time);
  if (!reduceMotion && Object.values(modelCanvases).some(Boolean)) {
    modelFrameId = requestAnimationFrame(renderModels);
  }
}

if (Object.values(modelCanvases).some(Boolean)) {
  renderModels();
  window.addEventListener("resize", () => {
    if (reduceMotion) {
      renderModels(performance.now());
      return;
    }
    cancelAnimationFrame(modelFrameId);
    renderModels(performance.now());
  });
}
