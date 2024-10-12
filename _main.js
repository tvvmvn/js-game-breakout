var canvas = document.getElementById("myCanvas");
canvas.width = 500;
canvas.height = 300;
var ctx = canvas.getContext("2d");

class Game {
  ballRadius = 10;
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  paddleHeight = 7.5;
  paddleWidth = 80;
  paddleX = (canvas.width - this.paddleWidth) / 2;
  brickRowCount = 4;
  brickColumnCount = 5;
  brickWidth = 80;
  brickHeight = 20;
  brickPadding = 10;
  brickOffsetTop = 30;
  brickOffsetLeft = 30;
  bricks = [];
  over = false;
  backgroundColor = "#000";
  ballColor = "#f1f1f1";
  paddleColor = "#ddd";
  bricksColor = "pink";
  textColor = "red";
  rightPressed = false;
  leftPressed = false;

  constructor() {
    for (var r = 0; r < this.brickRowCount; r++) {
      this.bricks[r] = [];

      for (var c = 0; c < this.brickColumnCount; c++) {
        this.bricks[r][c] = { x: 0, y: 0, status: 1 };
      }
    }
  }
  
  drawBall() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = this.ballColor;
    ctx.fill();
    ctx.closePath();
  }
  
  drawPaddle() {
    ctx.beginPath();
    ctx.rect(this.paddleX, canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
    ctx.fillStyle = this.paddleColor;
    ctx.fill();
    ctx.closePath();
  }
  
  drawBricks() {
    for (var r = 0; r < this.brickRowCount; r++) {
      for (var c = 0; c < this.brickColumnCount; c++) {
        var brick = this.bricks[r][c];

        if (brick.status == 1) {
          brick.x = (c * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
          brick.y = (r * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;
          
          if (
              this.x + this.ballRadius > brick.x 
              && this.x - this.ballRadius < brick.x + this.brickWidth 
              && this.y + this.ballRadius > brick.y 
              && this.y - this.ballRadius < brick.y + this.brickHeight
            ) {
            this.dy = -this.dy;
            brick.status = 0;
          }

          ctx.beginPath();
          ctx.rect(brick.x, brick.y, this.brickWidth, this.brickHeight);
          ctx.fillStyle = this.bricksColor;
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }
  
  drawBackground() {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = this.backgroundColor;
    ctx.fill();
    ctx.closePath();
  }

  drawOver() {
    ctx.font = "16px Monospace";
    ctx.fillStyle = this.textColor;
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }
  
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    this.drawBackground();
    this.drawBricks();
    this.drawBall();
    this.drawPaddle();
  
    if (this.x - this.ballRadius < 0 || this.x + this.ballRadius > canvas.width) {
      this.dx = -this.dx;
    }

    if (this.y - this.ballRadius < 0) {
      this.dy = -this.dy;
    } 
    
    if (this.y + this.ballRadius > canvas.height) {
      if (this.x + this.ballRadius > this.paddleX && this.x - this.ballRadius < this.paddleX + this.paddleWidth) {
        this.dy = -this.dy;
      } else {
        this.over = true;
        this.drawOver();
      }
    }
  
    if (this.rightPressed && this.paddleX < canvas.width - this.paddleWidth) {
      this.paddleX += 7;
    } else if (this.leftPressed && this.paddleX > 0) {
      this.paddleX -= 7;
    }
  
    this.x += this.dx;
    this.y += this.dy;

    if (!this.over)
      requestAnimationFrame(() => this.render());
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