const canvas = document.getElementById("animaciones");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const letras = "アァイィウエオカキクケコサシスセソタチツテトナニヌネqwertyuiopasdfghjklñzxcvbnm0123456789!#$%&/()=?¡'¡¿";
const fontSize = 16;
let columnas = Math.floor(canvas.width / fontSize);
let gotas = Array(columnas).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0F0";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < columnas; i++) {
    const letra = letras.charAt(Math.floor(Math.random() * letras.length));
    ctx.fillText(letra, i * fontSize, gotas[i] * fontSize);

    if (gotas[i] * fontSize > canvas.height && Math.random() > 0.975) {
      gotas[i] = 0;
    }
    gotas[i]++;
  }
}

const fireworks = [];

canvas.addEventListener("click", function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  fireworks.push(new Firework(x, y));
});

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = Math.random() * 10 + 5; 
   this.angle = Math.random() * Math.PI * 2;
    this.radius = Math.random() * 4; 
    this.color = "#00ff00";
    this.alpha = 1;
    this.gravity = 0.2;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= 0.02;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

class Firework {
  constructor(x, y) {
    this.particles = [];
    for (let i = 0; i < 1000; i++) { 
      this.particles.push(new Particle(x, y));
    }
  }

  update() {
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => p.alpha > 0);
  }

  draw() {
    this.particles.forEach(p => p.draw());
  }

  isDead() {
    return this.particles.length === 0;
  }
}

function animate() {
  drawMatrix();

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].draw();
    if (fireworks[i].isDead()) {
      fireworks.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();
