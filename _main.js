var canvas = document.getElementById("myCanvas");
canvas.width = 500;
canvas.height = 300;
canvas.style.backgroundColor = "#000";
var ctx = canvas.getContext("2d");

class Ball {
  radius = 10;
  x = canvas.width / 2;
  y = canvas.height - 30;
  left = 0;
  right = 0;
  top = 0;
  bottom = 0;
  dx = 3;
  dy = -3;
  color = "#f1f1f1";

  outOfPaddle(paddleLeft, paddleRight) {
    if (this.bottom > canvas.height) {
      if (this.left > paddleRight || this.right < paddleLeft) {
        return true;
      } else {
        return false;
      }
    }
  }
  
  draw() {
    this.left = this.x - this.radius;
    this.right = this.x + this.radius;
    this.top = this.y - this.radius;
    this.bottom = this.y + this.radius;

    if (this.left < 0 || this.right > canvas.width) {
      this.dx = -this.dx;
    }
  
    if (this.top < 0 || this.bottom > canvas.height) {
      this.dy = -this.dy;
    } 
  
    this.x += this.dx;
    this.y += this.dy;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

class Paddle {
  height = 7.5;
  width = 80;
  x = (canvas.width - this.width) / 2;
  color = "#ddd";

  draw(leftPressed, rightPressed) {
    if (rightPressed && this.x < canvas.width - this.width) {
      this.x += 7;
    } else if (leftPressed && this.x > 0) {
      this.x -= 7;
    }

    ctx.beginPath();
    ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

class Brick {
  x = 0;
  y = 0;
  width = 80;
  height = 20;
  color = "pink";
  padding = 10;
  active = 1;

  constructor(r, c, offsetLeft, offsetTop) {
    this.x = (c * (this.width + this.padding)) + offsetLeft;
    this.y = (r * (this.height + this.padding)) + offsetTop;
  }
}

class WallOfBricks {
  offsetTop = 30;
  offsetLeft = 30;
  rowCount = 4;
  columnCount = 5;
  bricks = [];
  brickCount = this.rowCount * this.columnCount;

  constructor() {
    for (var r = 0; r < this.rowCount; r++) {
      this.bricks[r] = [];

      for (var c = 0; c < this.columnCount; c++) {
        this.bricks[r][c] = new Brick(r, c, this.offsetLeft, this.offsetTop);
      }
    }
  }

  collisionDetection(ballLeft, ballRight, ballTop, ballBottom) {
    for (var r = 0; r < this.rowCount; r++) {
      for (var c = 0; c < this.columnCount; c++) {
        var brick = this.bricks[r][c];

        if (brick.active == 1) {
          if (
              ballRight > brick.x 
              && ballLeft < brick.x + brick.width 
              && ballBottom > brick.y 
              && ballTop < brick.y + brick.height
            ) {
            brick.active = 0;

            return true;
          }
        }
      }
    }

    return false;
  }

  draw() {
    for (var r = 0; r < this.rowCount; r++) {
      for (var c = 0; c < this.columnCount; c++) {
        var brick = this.bricks[r][c];

        if (brick.active == 1) {
          ctx.beginPath();
          ctx.rect(brick.x, brick.y, brick.width, brick.height);
          ctx.fillStyle = brick.color;
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }
}

class Message {
  textColor = "#fff";

  draw(message) {
    ctx.font = "16px Monospace";
    ctx.fillStyle = this.textColor;
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
  }
}

class Game {
  wallOfBricks = new WallOfBricks();
  ball = new Ball();
  paddle = new Paddle();
  message = new Message();
  over = false;
  end = false;
  leftPressed = false;
  rightPressed = false;

  clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  // it has flow
  render() {
    this.clearCanvas();
    this.wallOfBricks.draw();
    this.ball.draw();
    this.paddle.draw(this.leftPressed, this.rightPressed);

    if (this.wallOfBricks.collisionDetection(this.ball.left, this.ball.right, this.ball.top, this.ball.bottom)) {
      this.ball.dy = -this.ball.dy;
      this.wallOfBricks.brickCount--;
    }
    
    if (this.ball.outOfPaddle(this.paddle.x, this.paddle.x + this.paddle.width)) {
      this.message.draw("GAME OVER");
    } else if (this.wallOfBricks.brickCount < 1)  {
      this.message.draw("YOU WIN!");
    } else {
      requestAnimationFrame(() => this.render());
    }
  }

  keyHandler(key, pressed) {
    if (key == "ArrowLeft") {
      if (pressed) {
        this.leftPressed = true;
      } else {
        this.leftPressed = false;
      }
    } else if (key == "ArrowRight") {
      if (pressed) {
        this.rightPressed = true;
      } else {
        this.rightPressed = false;
      }
    }
  }
}

var game = new Game();
document.addEventListener("keydown", (e) => game.keyHandler(e.key, true));
document.addEventListener("keyup", (e) => game.keyHandler(e.key, false));

game.render();