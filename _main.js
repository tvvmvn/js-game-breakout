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
  color = "#f1f1f1";
  
  draw(dx, dy) {  
    var x = this.x += dx;
    var y = this.y += dy;

    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

class Paddle {
  height = 10;
  width = 80;
  x = (canvas.width - this.width) / 2;
  color = "#ddd";

  draw(move) {
    var x = this.x += move;

    ctx.beginPath();
    ctx.rect(x, canvas.height - this.height, this.width, this.height);
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
        this.bricks[r][c] = new Brick();
        var brick = this.bricks[r][c];
        
        brick.x = (c * (brick.width + brick.padding)) + this.offsetLeft;
        brick.y = (r * (brick.height + brick.padding)) + this.offsetTop;
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
  dx = 2;
  dy = -2;
  wallOfBricks = new WallOfBricks();
  ball = new Ball();
  paddle = new Paddle();
  message = new Message();
  over = false;
  end = false;
  leftPressed = false;
  rightPressed = false;
  timer;

  constructor() {
    this.timer = setInterval(() => this.actionPerformed(), 10);
  }

  clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  // it has flow
  actionPerformed() {
    this.clearCanvas();

    // Wall of bricks
    if (this.wallOfBricks.collisionDetection(this.ball.left, this.ball.right, this.ball.top, this.ball.bottom)) {
      this.dy = -this.dy;
      this.wallOfBricks.brickCount--;
      
      if (this.wallOfBricks.brickCount < 1)  {
        this.message.draw("YOU WIN!");
        clearInterval(this.timer);
      } 
    }

    this.wallOfBricks.draw();

    // Ball
    this.ball.left = this.ball.x - this.ball.radius;
    this.ball.right = this.ball.x + this.ball.radius;
    this.ball.top = this.ball.y - this.ball.radius;
    this.ball.bottom = this.ball.y + this.ball.radius;

    if (this.ball.left < 0 || this.ball.right > canvas.width) {
      this.dx = -this.dx;
    } else if (this.ball.top < 0) {
      this.dy = -this.dy;
    } else if (this.ball.bottom > canvas.height - this.paddle.height) {
      if (this.ball.right > this.paddle.x && this.ball.left < this.paddle.x + this.paddle.width) {
        this.dy = -this.dy;
      } else {
        this.message.draw("GAME OVER");
        clearInterval(this.timer);
      }
    }

    this.ball.draw(this.dx, this.dy);

    // Paddle
    if (this.rightPressed && this.paddle.x + this.paddle.width < canvas.width) {
      this.paddle.draw(5);
    } else if (this.leftPressed && this.paddle.x > 0) {
      this.paddle.draw(-5);
    } else {
      this.paddle.draw(0);
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