var canvas = document.getElementById("myCanvas");
canvas.width = 500;
canvas.height = 300;
canvas.style.backgroundColor = "#000";
var ctx = canvas.getContext("2d");

class Ball {
  radius = 10;
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  left = 0;
  right = 0;
  top = 0;
  bottom = 0;
  color = "#f1f1f1";

  updateDx() {
    this.dx = -this.dx;
  }

  updateDy() {
    this.dy = -this.dy;
  }

  outOfPaddle(paddleLeft, paddleRight) {
    if (this.bottom > canvas.height) {
      if (this.right < paddleLeft || this.left > paddleRight) {
        return true;
      } 
    }

    return false;
  }

  setCrds() {
    this.left = this.x - this.radius;
    this.right = this.x + this.radius;
    this.top = this.y - this.radius;
    this.bottom = this.y + this.radius;
  
    if (this.left < 0 || this.right > canvas.width) {
      this.updateDx();
    } else if (this.top < 0 || this.bottom > canvas.height) {
      this.updateDy();
    } 
  
    this.x += this.dx;
    this.y += this.dy;
  }

  render() {  
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
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

  setX(n) {
    this.x += n;
  }

  render() {
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
  active = true;

  constructor(offsetLeft, offsetTop, r, c) {
    this.x = offsetLeft + (c * (this.width + this.padding));
    this.y = offsetTop + (r * (this.height + this.padding));
  }

  collisionDetection(ball) {
    if (
      ball.right > this.x
      && ball.left < this.x + this.width
      && ball.bottom > this.y
      && ball.top < this.y + this.height
    ) {
      return true;
    }

    return false;
  }

  render() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
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
  offsetTop = 30;
  offsetLeft = 30;
  rowCount = 4;
  columnCount = 5;
  bricks = [];
  ball = new Ball();
  paddle = new Paddle();
  message = new Message();
  score = 0;
  leftPressed = false;
  rightPressed = false;
  timer;

  constructor() {
    this.timer = setInterval(() => this.actionPerformed(), 10);

    // initialize bricks
    for (var r = 0; r < this.rowCount; r++) {
      this.bricks[r] = [];
      for (var c = 0; c < this.columnCount; c++) {
        this.bricks[r][c] = new Brick(this.offsetLeft, this.offsetTop, r, c);
      }
    }
  }

  clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  actionPerformed() {
    this.clearScreen();

    // Bricks
    for (var r = 0; r < this.rowCount; r++) {
      for (var c = 0; c < this.columnCount; c++) {
        var brick = this.bricks[r][c];

        if (brick.active) {
          if (brick.collisionDetection(this.ball)) {
            brick.active = false;
            this.score++;
            this.ball.updateDy();
            
            if (this.score == this.rowCount * this.columnCount) {
              this.message.render("YOU WIN!");
              clearInterval(this.timer);
            }
          }
          
          brick.render();
        }
      }
    }

    // Ball    
    this.ball.render();
    this.ball.setCrds();
    
    if (this.ball.outOfPaddle(this.paddle.x, this.paddle.x + this.paddle.width)) {
      this.message.render("GAME OVER");
      clearInterval(this.timer);
    }
    // Paddle
    if (this.rightPressed && this.paddle.x + this.paddle.width < canvas.width) {
      this.paddle.setX(5);
    } else if (this.leftPressed && this.paddle.x > 0) {
      this.paddle.setX(-5);
    } 

    this.paddle.render();
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