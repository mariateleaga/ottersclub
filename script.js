// ---- Screens ----
const screens = {
  1: document.getElementById("screen1"),
  2: document.getElementById("screen2"),
  3: document.getElementById("screen3"),
  4: document.getElementById("screen4"),
  5: document.getElementById("screen5"),
  6: document.getElementById("screen6"),
};

function showScreen(n){
  Object.values(screens).forEach(s => s.classList.add("hidden"));
  screens[n].classList.remove("hidden");

  // quando entri nello screen3, spara confetti
  if(n === 3) fireConfetti();
  // quando esci dallo screen3, pulisci canvas
  if(n !== 3) stopConfetti();
}

// ---- Home -> domanda
document.getElementById("startBtn").addEventListener("click", () => showScreen(2));

// ---- Opzioni -> vittoria
document.querySelectorAll(".option").forEach(btn => {
  btn.addEventListener("click", () => showScreen(3));
});

// ---- Back home
document.querySelectorAll(".backHome").forEach(btn => {
  btn.addEventListener("click", () => showScreen(1));
});

// ---- Easter eggs: label cursore
const cursorLabel = document.getElementById("cursorLabel");
function showLabel(text){
  cursorLabel.textContent = text;
  cursorLabel.style.display = "block";
}
function hideLabel(){
  cursorLabel.style.display = "none";
}

document.addEventListener("mousemove", e => {
  cursorLabel.style.left = e.clientX + "px";
  cursorLabel.style.top  = e.clientY + "px";
});

const intimo = document.getElementById("intimo");
const bottiglia = document.getElementById("bottiglia");

intimo.addEventListener("mouseenter", () => showLabel("Shhhh qui c'è un segreto"));
intimo.addEventListener("mouseleave", hideLabel);

bottiglia.addEventListener("mouseenter", () => showLabel("Hai trovato il messaggio misterioso"));
bottiglia.addEventListener("mouseleave", hideLabel);

intimo.addEventListener("click", () => showScreen(4));
bottiglia.addEventListener("click", () => showScreen(5));

// ---- Busta spicy: click per mostrare foto
const envelope = document.getElementById("envelope");
envelope.addEventListener("click", () => {
  showScreen(6);
});

// ---------------- CONFETTI (no librerie) ----------------
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let confettiPieces = [];
let confettiAnim = null;
let confettiEndAt = 0;

// palette "colorati" ma che stanno bene con i nostri toni
const palette = [
  "#a00006",   // nostro colore 2
  "#ffffff",
  "#ffd1dc",
  "#ff6b6b",
  "#ffb3c7",
  "#f7cad0",
  "#c9184a"
];

function resizeCanvas(){
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = Math.floor(canvas.clientWidth * dpr);
  canvas.height = Math.floor(canvas.clientHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", () => {
  // ridimensiona solo se screen3 è visibile
  if(!screens[3].classList.contains("hidden")) resizeCanvas();
});

function makeConfetti(count=180){
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  confettiPieces = Array.from({length: count}, () => ({
    x: Math.random()*w,
    y: -20 - Math.random()*h*0.2,
    size: 6 + Math.random()*6,
    vy: 2 + Math.random()*4,
    vx: -1.5 + Math.random()*3,
    rot: Math.random()*Math.PI,
    vr: -0.15 + Math.random()*0.3,
    color: palette[Math.floor(Math.random()*palette.length)],
    shape: Math.random() < 0.2 ? "heart" : "rect"
  }));
}

function drawHeart(x, y, size){
  const s = size;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x - s/2, y - s/2, x - s, y + s/3, x, y + s);
  ctx.bezierCurveTo(x + s, y + s/3, x + s/2, y - s/2, x, y);
  ctx.closePath();
  ctx.fill();
}

function tickConfetti(){
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  ctx.clearRect(0,0,w,h);

  confettiPieces.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    if(p.x < -20) p.x = w + 20;
    if(p.x > w + 20) p.x = -20;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;

    if(p.shape === "heart"){
      drawHeart(0, 0, p.size);
    } else {
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.8);
    }
    ctx.restore();
  });

  if(performance.now() < confettiEndAt){
    confettiAnim = requestAnimationFrame(tickConfetti);
  } else {
    stopConfetti();
  }
}

function fireConfetti(){
  resizeCanvas();
  makeConfetti(200);
  confettiEndAt = performance.now() + 2800;

  if(confettiAnim) cancelAnimationFrame(confettiAnim);
  confettiAnim = requestAnimationFrame(tickConfetti);
}

function stopConfetti(){
  if(confettiAnim){
    cancelAnimationFrame(confettiAnim);
    confettiAnim = null;
  }
  ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight);
  confettiPieces = [];
}