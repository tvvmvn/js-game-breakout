var canvas = document.getElementById("myCanvas");
canvas.width = 500;
canvas.height = 300;
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
  outOfPaddle = false;
  
  render(paddleLeft, paddleRight) {
    this.left = this.x - this.radius;
    this.right = this.x + this.radius;
    this.top = this.y - this.radius;
    this.bottom = this.y + this.radius;

    if (this.left < 0 || this.right > canvas.width) {
      this.dx = -this.dx;
    }
  
    if (this.top < 0) {
      this.dy = -this.dy;
    } 
    
    if (this.bottom > canvas.height) {
      if (this.left < paddleRight && this.right > paddleLeft) {
        this.dy = -this.dy;
      } else {
        this.outOfPaddle = true;
      }
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

  render(leftPressed, rightPressed) {
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
}

class WallOfBricks {
  offsetTop = 30;
  offsetLeft = 30;
  rowCount = 4;
  columnCount = 5;
  bricks = [];
  brickCount = this.rowCount * this.columnCount;
  collision = false;

  constructor() {
    for (var r = 0; r < this.rowCount; r++) {
      this.bricks[r] = [];

      for (var c = 0; c < this.columnCount; c++) {
        this.bricks[r][c] = new Brick();
      }
    }
  }

  render(ballLeft, ballRight, ballTop, ballBottom) {
    for (var r = 0; r < this.rowCount; r++) {
      for (var c = 0; c < this.columnCount; c++) {
        var brick = this.bricks[r][c];

        if (brick.active == 1) {
          brick.x = (c * (brick.width + brick.padding)) + this.offsetLeft;
          brick.y = (r * (brick.height + brick.padding)) + this.offsetTop;
          
          if (
              ballRight > brick.x 
              && ballLeft < brick.x + brick.width 
              && ballBottom > brick.y 
              && ballTop < brick.y + brick.height
            ) {
            brick.active = 0;
            this.brickCount--;
            this.collision = true;
          }

          ctx.beginPath();
          ctx.rect(brick.x, brick.y, brick.width, brick.height);
          ctx.fillStyle = brick.color;
          ctx.fill();
          ctx.closePath();
        }
      }
    }

    return false;
  }
}

class Background {
  backgroundColor = "#000";

  render() {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = this.backgroundColor;
    ctx.fill();
    ctx.closePath();
  }
}

class Message {
  textColor = "#fff";

  render(message) {
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
  background = new Background();
  message = new Message();
  over = false;
  end = false;
  leftPressed = false;
  rightPressed = false;
  
  // it has flow
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.background.render();
    this.wallOfBricks.render(this.ball.left, this.ball.right, this.ball.top, this.ball.bottom);

    if (this.wallOfBricks.collision) {
      this.ball.dy = -this.ball.dy;
      this.wallOfBricks.collision = false;
    }

    this.ball.render(this.paddle.x, this.paddle.x + this.paddle.width);
    this.paddle.render(this.leftPressed, this.rightPressed);
    
    if (this.ball.outOfPaddle) {
      this.message.render("GAME OVER");
    } else if (this.wallOfBricks.brickCount < 1)  {
      this.message.render("YOU WIN!");
    } else {
      requestAnimationFrame(() => this.render());
    }
  }

  keyDownHandler(e) {
    if (e.keyCode == 39) {
      this.rightPressed = true;
    } else if (e.keyCode == 37) {
      this.leftPressed = true;
    }
  }
  
  keyUpHandler(e) {
    if (e.keyCode == 39) {
      this.rightPressed = false;
    } else if (e.keyCode == 37) {
      this.leftPressed = false;
    }
  }
}

var game = new Game();
document.addEventListener("keydown", (e) => game.keyDownHandler(e));
document.addEventListener("keyup", (e) => game.keyUpHandler(e));

game.render();