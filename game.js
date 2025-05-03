
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let balls = [];
let cueBall = { x: canvas.width / 2, y: canvas.height / 2, vx: 0, vy: 0, radius: 15 };
let isDragging = false;
let startX, startY;
let score = 0;

function createBalls() {
  const colors = ["#ff66cc", "#00ffff", "#ffff00", "#ff9933", "#99ff66", "#cc99ff"];
  for (let i = 0; i < 6; i++) {
    balls.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0,
      vy: 0,
      radius: 15,
      color: colors[i],
    });
  }
}
createBalls();

canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  isDragging = true;
});

canvas.addEventListener("touchend", (e) => {
  if (isDragging) {
    const touch = e.changedTouches[0];
    let dx = startX - touch.clientX;
    let dy = startY - touch.clientY;
    cueBall.vx = dx * 0.1;
    cueBall.vy = dy * 0.1;
    isDragging = false;
    snoopTalk();
  }
});

function snoopTalk() {
  const comments = [
    "Damn nephew, you lit!",
    "Smokin' shot!",
    "Ride the galaxy wave!",
    "That's a cosmic claaap!",
    "Smooooth like Gin & Juice."
  ];
  document.getElementById("snoop-comment").innerText = comments[Math.floor(Math.random() * comments.length)];
}

function update() {
  cueBall.x += cueBall.vx;
  cueBall.y += cueBall.vy;
  cueBall.vx *= 0.98;
  cueBall.vy *= 0.98;

  balls.forEach((ball, index) => {
    const dx = cueBall.x - ball.x;
    const dy = cueBall.y - ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < cueBall.radius + ball.radius) {
      balls.splice(index, 1);
      score++;
      document.getElementById("counter").innerText = score;
      snoopTalk();
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff33";
  ctx.beginPath();
  ctx.arc(cueBall.x, cueBall.y, cueBall.radius, 0, Math.PI * 2);
  ctx.fill();

  balls.forEach(ball => {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
