const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const controls = document.getElementById("controls");

function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth * 0.9, 400); // Máximo 400px
  canvas.height = canvas.width;
}
resizeCanvas();

const box = canvas.width / 20; // Tamaño dinámico del cuadro
let snake = [
  { x: box * 5, y: box * 5 },
  { x: box * 4, y: box * 5 }
];
let direction = "RIGHT";
let food = {
  x: Math.floor(Math.random() * canvas.width / box) * box,
  y: Math.floor(Math.random() * canvas.height / box) * box
};
let score = 0;
let speed = 400;
let gameInterval;

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  const head = { ...snake[0] };
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = `Puntaje: ${score}`;
    food = {
      x: Math.floor(Math.random() * canvas.width / box) * box,
      y: Math.floor(Math.random() * canvas.height / box) * box
    };

    // Validar que la comida no aparezca en la serpiente
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
      console.warn("Comida generada en la serpiente, regenerando...");
      food = {
        x: Math.floor(Math.random() * canvas.width / box) * box,
        y: Math.floor(Math.random() * canvas.height / box) * box
      };
    }

    if (speed > 50) {
      clearInterval(gameInterval);
      speed -= 20;
      gameInterval = setInterval(draw, speed);
    }
  } else {
    snake.pop();
  }

  snake.unshift(head);

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    console.error("Colisión detectada:", head);
    alert("¡Juego terminado! Puntuación: " + score);
    location.reload();
  }

  console.log("Estado del juego:", { head, snake, food, score, direction });
}

// Cambiar dirección con teclado
document.addEventListener("keydown", event => {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Controles táctiles
document.getElementById("up").addEventListener("click", () => {
  if (direction !== "DOWN") direction = "UP";
});
document.getElementById("down").addEventListener("click", () => {
  if (direction !== "UP") direction = "DOWN";
});
document.getElementById("left").addEventListener("click", () => {
  if (direction !== "RIGHT") direction = "LEFT";
});
document.getElementById("right").addEventListener("click", () => {
  if (direction !== "LEFT") direction = "RIGHT";
});

// Redimensionar canvas al cambiar tamaño de ventana
window.addEventListener("resize", resizeCanvas);

// Iniciar el juego
gameInterval = setInterval(draw, speed);
