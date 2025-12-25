const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GRID_SIZE = 10;
const TILE_COUNT = canvas.width / GRID_SIZE;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static splat(value) {
    return new Point(value, value);
  }

  static random() {
    return new Point(
      Math.floor(Math.random() * TILE_COUNT),
      Math.floor(Math.random() * TILE_COUNT),
    );
  }

  offset(dx, dy) {
    return new Point(this.x + dx, this.y + dy);
  }

  isEq(other) {
    return this.x === other.x && this.y === other.y;
  }
}

class GameObject {
  constructor(point) {
    this.point = point;
  }

  get color() {
    throw new Error("Not implemented");
  }

  get score() {
    throw new Error("Not implemented");
  }

  onCollision(snake) {
    this.point = Point.random();
  }
}

class Food extends GameObject {
  constructor(point) {
    super(point);
  }

  get color() {
    return "red";
  }

  get score() {
    return 1;
  }

  onCollision(snake) {
    super.onCollision(snake);
  }
}

class PowerUp extends GameObject {
  constructor(point) {
    super(point);
  }

  get color() {
    return "blue";
  }

  get score() {
    return +3;
  }

  onCollision(snake) {
    super.onCollision(snake);
    const head = snake[snake.length - 1];

    for (let head = 0; head < 3; head++) {
      snake.push(new Point(head.x, head.y));
    }
  }
}
class Rock extends GameObject {
  constructor(point) {
    super(point);
  }

  get color() {
    return "grey";
  }

  get score() {
    return -1;
  }

  onCollision(snake) {
    super.onCollision(snake);

    snake.pop();

    if (snake.length > 1) {
      snake.pop();
    }
  }
}

class ObjectList {
  #data = [];

  constructor() {
    this.#data = [];
  }

  push(object) {
    this.#data.push(object);
  }

  randomize() {
    this.#data = [];

    this.#data.push(new Food(Point.random()));
    this.#data.push(new Food(Point.random()));

    this.#data.push(new Rock(Point.random()));

    this.#data.push(new PowerUp(Point.random()));
  }

  *[Symbol.iterator]() {
    for (const object of this.#data) {
      yield object;
    }
  }
}

const objects = new ObjectList();

objects.randomize();

let snake = [Point.splat(10)];

let dx = 1;
let dy = 0;
let score = 0;

function gameLoop() {
  update();
  draw();
}

function update() {
  const head = snake[0].offset(dx, dy);

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
  for (const point of snake) {
    if (point.isEq(head)) {
      return gameOver();
    }
  }

  snake.unshift(head);

  for (const object of objects) {
    if (object.point.isEq(head)) {
      score += object.score;
      object.onCollision(snake);
      return;
    }
  }

  snake.pop();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Snake
  ctx.fillStyle = "lime";
  for (const point of snake) {
    ctx.fillRect(
      point.x * GRID_SIZE,
      point.y * GRID_SIZE,
      GRID_SIZE,
      GRID_SIZE,
    );
  }

  for (const object of objects) {
    ctx.fillStyle = object.color;
    ctx.fillRect(
      object.point.x * GRID_SIZE,
      object.point.y * GRID_SIZE,
      GRID_SIZE,
      GRID_SIZE,
    );
  }
}

function gameOver() {
  alert(`Game Over! Score: ${score}`);
  snake = [Point.splat(10)];
  dx = 1;
  dy = 0;
  score = 0;
  objects.randomize();
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

setInterval(gameLoop, 60);
