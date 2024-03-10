(function () {
  /* struct */

  class Ball {
    constructor(x, y, radius, dx, dy, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.dx = dx;
      this.dy = dy;
      this.color = color;
    }
  }

  class Brick {
    constructor(x, y, width, height, status, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.status = status;
      this.color = color;
    }
  }

  class Paddle {
    constructor(x, y, width, height, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
    }
  }

  class Game {
    constructor(over, end, score) {
      this.over = over;
      this.end = end;
      this.score = score;
    }
  }

  /* contants */

  // Stage
  const STAGE_OFFSET_X = 10;
  const STAGE_OFFSET_Y = 50;
  const STAGE_WIDTH = 480;
  const STAGE_HEIGHT = 300;

  // Grid
  const OFFSET_X = STAGE_OFFSET_X + 20;
  const OFFSET_Y = STAGE_OFFSET_Y + 20;
  const PADDING = 10;
  const ROW_COUNT = 6;
  const COLUMN_COUNT = 5;
  const ARROW_RIGHT = "ArrowRight";
  const ARROW_LEFT = "ArrowLeft";

  /* variables */

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var bricks;
  var brickCount;
  var ball;
  var paddle;
  var game;
  var leftKeyPressed;
  var rightKeyPressed;
  var start = false;

  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style["backgroundColor"] = "#000";
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  /* run the game */

  setInterval(run, 10);

  function run() {
    clearCanvas();

    drawTitle()
    drawStage();
    
    // game status
    if (!start) {
      initialize();
      drawMessage("Press any key to start game");
      return;
    } 

    drawBall();
    drawPaddle();
    drawBricks();

    if (game.over || game.end) {
      if (game.over) {
        drawMessage("GAME OVER");
      }
      
      if (game.end) {
        drawMessage("YOU WIN!");
      }    
    } else {
      setBall()
      setBricks();
      setPaddle();

      // set ball x, y
      ball.x += ball.dx;
      ball.y += ball.dy;
    }
  }

  function initialize() {
    // ball
    ball = new Ball(
      STAGE_OFFSET_X + (STAGE_WIDTH / 2),
      STAGE_OFFSET_Y + (STAGE_HEIGHT - 30),
      10,
      2,
      -2,
      "#fff"
    );

    // paddle
    paddle = new Paddle(
      STAGE_OFFSET_X + ((STAGE_WIDTH - 30) / 2),
      STAGE_OFFSET_Y + (STAGE_HEIGHT - 10),
      30,
      5,
      "#fff"
    );

    // bricks
    bricks = [];
    brickCount = 0;

    for (var r = 0; r < ROW_COUNT; r++) {
      bricks[r] = [];

      for (var c = 0; c < COLUMN_COUNT; c++) {
        var bool = Math.round(Math.random());

        if (bool == 1) {
          brickCount++;
        }

        var brick = new Brick(0, 0, 80, 20, bool, "pink");

        bricks[r][c] = brick;
      }
    }

    // key
    leftKeyPressed = false;
    rightKeyPressed = false;

    // game
    game = new Game(false, false, 0);
  }

  /* functions */

  // Bricks
  function setBricks() {
    for (var r = 0; r < ROW_COUNT; r++) {
      for (var c = 0; c < COLUMN_COUNT; c++) {
        var brick = bricks[r][c];

        if (brick.status == 1) {
          if (
            ball.x + ball.radius > brick.x
            && ball.x + ball.radius < brick.x + brick.width
            && ball.y + ball.radius > brick.y
            && ball.y - ball.radius < brick.y + brick.height
          ) {
            ball.dy = -ball.dy;
            brick.status = 0;
            game.score++;

            if (game.score == brickCount) {
              game.end = true;
            }
          }
        }
      }
    }
  }

  // Ball
  function setBall() {
    // right
    if (ball.x + ball.dx > STAGE_OFFSET_X + STAGE_WIDTH - ball.radius) {
      ball.dx = -ball.dx;
    }

    // left
    if (ball.x + ball.dx < STAGE_OFFSET_X + ball.radius) {
      ball.dx = -ball.dx;
    }

    // top
    if (ball.y + ball.dy < STAGE_OFFSET_Y + ball.radius) {
      ball.dy = -ball.dy;
    }

    // bottom
    if (ball.y > STAGE_OFFSET_Y + STAGE_HEIGHT - ball.radius - 10) {
      if ( // into paddle
        ball.x + ball.radius > paddle.x
        && ball.x - ball.radius < paddle.x + paddle.width
      ) {
        ball.dy = -ball.dy;
      } else { // out of paddle
        game.over = true;
      }
    }
  }

  // Paddle
  function setPaddle() {
    if (
      rightKeyPressed
      && paddle.x + paddle.width < STAGE_OFFSET_X + STAGE_WIDTH - 4
    ) {
      paddle.x += 4;
    }

    if (
      leftKeyPressed
      && paddle.x > STAGE_OFFSET_X + 4
    ) {
      paddle.x -= 4;
    }
  }

  /* draw */

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawTitle() {
    ctx.font = "20px Monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(
      "B R E A K O U T",
      STAGE_OFFSET_X + (STAGE_WIDTH / 2),
      30,
    );
  }

  function drawStage() {
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "#fff";
    ctx.rect(STAGE_OFFSET_X, STAGE_OFFSET_Y, STAGE_WIDTH, STAGE_HEIGHT)
    ctx.stroke();
  }

  function drawBricks() {
    for (var r = 0; r < ROW_COUNT; r++) {
      for (var c = 0; c < COLUMN_COUNT; c++) {
        var brick = bricks[r][c];

        if (brick.status == 1) {
          brick.x = OFFSET_X + (c * (brick.width + PADDING));
          brick.y = OFFSET_Y + (r * (brick.height + PADDING));

          ctx.fillStyle = brick.color;
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        }
      }
    }
  }

  function drawPaddle() {
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  }

  function drawMessage(message) {
    ctx.font = "16px Monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(
      message,
      STAGE_OFFSET_X + (STAGE_WIDTH / 2),
      STAGE_OFFSET_Y + ((STAGE_HEIGHT + 20) / 2)
    );
  }

  /* control */

  function keyDownHandler(e) {
    if (!start) {
      start = true;
      return;
    }

    if (game.end || game.over) {
      start = false;
      return;
    }

    if (e.key == ARROW_RIGHT) {
      rightKeyPressed = true;
    }

    if (e.key == ARROW_LEFT) {
      leftKeyPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.key == ARROW_RIGHT) {
      rightKeyPressed = false;
    }

    if (e.key == ARROW_LEFT) {
      leftKeyPressed = false;
    }
  }
})()
