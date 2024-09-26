/*
OOP

# Paddle
keyDownHandler()

# Bricks or Brick
drawBricks()

# Ball
drawBall()

# Umpire (Game)

# Background
*/

(function () {
  /* canvas */
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style["backgroundColor"] = "#000";
  
  /* contants */
  const STAGE_OFFSET_X = 10;
  const STAGE_OFFSET_Y = 50;
  const STAGE_WIDTH = 480;
  const STAGE_HEIGHT = 300;
  const OFFSET_X = STAGE_OFFSET_X + 20;
  const OFFSET_Y = STAGE_OFFSET_Y + 20;
  const ARROW_RIGHT = "ArrowRight";
  const ARROW_LEFT = "ArrowLeft";
  
  // Class
  class Ball {
    constructor(x, y, radius, dx, dy, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.dx = dx;
      this.dy = dy;
      this.color = color;
    }
  
    render() {
      // right
      if (this.x + this.dx > STAGE_OFFSET_X + STAGE_WIDTH - this.radius) {
        this.dx = -this.dx;
      }
  
      // left
      if (this.x + this.dx < STAGE_OFFSET_X + this.radius) {
        this.dx = -this.dx;
      }
  
      // top
      if (this.y + this.dy < STAGE_OFFSET_Y + this.radius) {
        this.dy = -this.dy;
      }
  
      // bottom
      if (this.y > STAGE_OFFSET_Y + STAGE_HEIGHT - this.radius - 10) {
        if ( 
          this.x + this.radius >= paddle.x
          && this.x - this.radius <= paddle.x + paddle.width
        ) {
          this.dy = -this.dy;
        } else {
          game.over = true;
        }
      }
  
      if (!game.end && !game.over) {
        this.x += this.dx;
        this.y += this.dy;
      }
  
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
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
  
  class BrickStack {
    PADDING = 10;
    ROW_COUNT = 5;
    COLUMN_COUNT = 5;
    bricks = [];
    brickCount = this.ROW_COUNT * this.COLUMN_COUNT;
  
    constructor() {
      for (var r = 0; r < this.ROW_COUNT; r++) {
        this.bricks[r] = [];
        
        for (var c = 0; c < this.COLUMN_COUNT; c++) {
          var brick = new Brick(0, 0, 80, 20, 1, "pink");
          
          this.bricks[r][c] = brick;
        }
      }
    }
  
    render() {
      for (var r = 0; r < this.ROW_COUNT; r++) {
        for (var c = 0; c < this.COLUMN_COUNT; c++) {
          var brick = this.bricks[r][c];
  
          if (brick.status == 1) {
            brick.x = OFFSET_X + (c * (brick.width + this.PADDING));
            brick.y = OFFSET_Y + (r * (brick.height + this.PADDING));
  
            if (
              ball.x + ball.radius > brick.x
              && ball.x + ball.radius < brick.x + brick.width
              && ball.y + ball.radius > brick.y
              && ball.y - ball.radius < brick.y + brick.height
            ) {
              brick.status = 0;
              game.score++;
              ball.dy = -ball.dy;
  
              if (game.score == this.brickCount) {
                game.end = true;
              }
            }
  
            ctx.fillStyle = brick.color;
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
          }
        }
      }
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

    render() {
      if (!game.end && !game.over) {
        if (
          rightKeyPressed
          && this.x + this.width < STAGE_OFFSET_X + STAGE_WIDTH - 4
        ) {
          this.x += 4;
        }
    
        if (
          leftKeyPressed
          && this.x > STAGE_OFFSET_X + 4
        ) {
          this.x -= 4;
        }
      }
  
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  
  class Game { // Umpire
    constructor(over, end, score) {
      this.over = over;
      this.end = end;
      this.score = score;
    }

    drawMessage(message) {
      ctx.font = "16px Monospace";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(
        message,
        STAGE_OFFSET_X + (STAGE_WIDTH / 2),
        STAGE_OFFSET_Y + ((STAGE_HEIGHT + 20) / 2)
      );
    }

    render() {
      ctx.font = "20px Monospace";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(
        "B R E A K O U T",
        STAGE_OFFSET_X + (STAGE_WIDTH / 2),
        30,
      );
  
      ctx.beginPath();
      ctx.lineWidth = "4";
      ctx.strokeStyle = "#fff";
      ctx.rect(STAGE_OFFSET_X, STAGE_OFFSET_Y, STAGE_WIDTH, STAGE_HEIGHT)
      ctx.stroke();
    }
  }
  
  /* variables */
  var ball = new Ball(
    STAGE_OFFSET_X + (STAGE_WIDTH / 2),
    STAGE_OFFSET_Y + (STAGE_HEIGHT - 30),
    10,
    2,
    -2,
    "#fff"
  );
  var brickStack = new BrickStack();
  var paddle = new Paddle(
    STAGE_OFFSET_X + ((STAGE_WIDTH - 30) / 2),
    STAGE_OFFSET_Y + (STAGE_HEIGHT - 10),
    50,
    5,
    "#fff"
  );
  var game = new Game(false, false, 0);

  /* controller */
  var leftKeyPressed = false;
  var rightKeyPressed = false;

  document.addEventListener("keydown", function (e) {
    if (e.key == ARROW_RIGHT) {
      rightKeyPressed = true;
    }

    if (e.key == ARROW_LEFT) {
      leftKeyPressed = true;
    }
  });

  document.addEventListener("keyup", function (e) {
    if (e.key == ARROW_RIGHT) {
      rightKeyPressed = false;
    }

    if (e.key == ARROW_LEFT) {
      leftKeyPressed = false;
    }
  });

  /* run the game */
  function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render();
    ball.render();
    brickStack.render();
    paddle.render();

    if (game.over) {
      game.drawMessage("GAME OVER");
    }
    
    if (game.end) {
      game.drawMessage("YOU WIN!");
    }  
  }

  setInterval(main, 10);
})();  
