const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;

let snake = [{ x: 10, y: 10 }];
let food = randomFood();
let dx = 1;
let dy = 0;
let score = 0;

function gameLoop() {
  update();
  draw();
}

function update() {
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy,
  };

  // // Wall collision (gameover)
  // if (
  //   head.x < 0 ||
  //   head.y < 0 ||
  //   head.x >= TILE_COUNT ||
  //   head.y >= TILE_COUNT
  // ) {
  //   return gameOver();
  // }

  // Wall collision (wrap around)
  if (head.x < 0) {
    head.x = TILE_COUNT - 1;
  } else if (head.x > TILE_COUNT - 1) {
    head.x = 0;
  } else if (head.y < 0) {
    head.y = TILE_COUNT - 1;
  } else if (head.y > TILE_COUNT - 1) {
    head.y = 0;
  }

  // Self collision
  for (let segment of snake) {
    if (segment.x === head.x && segment.y === head.y) {
      return gameOver();
    }
  }

  snake.unshift(head);

  // Food collision
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Snake
  ctx.fillStyle = "lime";
  snake.forEach((part) => {
    ctx.fillRect(part.x * GRID_SIZE, part.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  });

  // Food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * TILE_COUNT),
    y: Math.floor(Math.random() * TILE_COUNT),
  };
}

function gameOver() {
  alert(`Game Over! Score: ${score}`);
  snake = [{ x: 10, y: 10 }];
  dx = 1;
  dy = 0;
  score = 0;
  food = randomFood();
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (dy === 0) {
        dx = 0;
        dy = -1;
      }
      break;
    case "ArrowDown":
      if (dy === 0) {
        dx = 0;
        dy = 1;
      }
      break;
    case "ArrowLeft":
      if (dx === 0) {
        dx = -1;
        dy = 0;
      }
      break;
    case "ArrowRight":
      if (dx === 0) {
        dx = 1;
        dy = 0;
      }
      break;
  }
});

setInterval(gameLoop, 150);
