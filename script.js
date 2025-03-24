const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");

canvas.width = 400;
canvas.height = 400;

const box = 20;
let snake = [
  { x: box * 5, y: box * 5 }, // Primer segmento de la serpiente
  { x: box * 4, y: box * 5 }  // Segundo segmento de la serpiente
];
let direction = "RIGHT";
let food = {
  x: Math.floor(Math.random() * canvas.width / box) * box,
  y: Math.floor(Math.random() * canvas.height / box) * box
};
let score = 0;
let speed = 400; // Velocidad inicial (lenta)
let gameInterval;

// Dibujar el tablero
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

    // Incrementar velocidad cada vez que agarres una ficha
    if (speed > 50) {
      clearInterval(gameInterval);
      speed -= 20; // Reducir el intervalo para hacer el juego más rápido
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
    alert("¡Juego terminado! Puntuación: " + score);
    location.reload();
  }
}

// Cambiar dirección según las teclas presionadas
document.addEventListener("keydown", event => {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Iniciar el juego
gameInterval = setInterval(draw, speed);