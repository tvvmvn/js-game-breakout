(function () {
  /* canvas */
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 350;
  canvas.style.backgroundColor = "#000";
  
  /* class */
  class Ball {
    constructor(paddle) {
      this.x = canvas.width / 2;
      this.y = canvas.height - 30;
      this.radius = 10;
      this.top = 0;
      this.left = 0;
      this.right = 0;
      this.bottom = 0;
      this.color = "#fff";
      this.dx = 3;
      this.dy = -3;
      this.paddle = paddle;
      this.outOfPaddle = false;
    }
    
    render() {
      this.right = this.x + this.radius;
      this.left = this.x - this.radius;
      this.top = this.y - this.radius;
      this.bottom = this.y + this.radius;

      if (this.right > canvas.width) {
        this.dx = -this.dx;
      }
  
      if (this.left < 0) {
        this.dx = -this.dx;
      }
  
      if (this.top < 0) {
        this.dy = -this.dy;
      }
  
      if (this.bottom > canvas.height - this.paddle.height) {
        if (this.right >= this.paddle.left && this.left <= this.paddle.right) {
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
  
  class Brick {
    constructor(ball, x, y) {
      this.offsetX = 30;
      this.offsetY = 30;
      this.width = 80;
      this.height = 20;
      this.padding = 10;
      this.left = this.offsetX + (x * (this.width + this.padding));
      this.top = this.offsetY + (y * (this.height + this.padding));
      this.right =  this.left + this.width;
      this.bottom = this.top + this.height;
      this.active = true;
      this.color = "pink";
      this.ball = ball;
    }

    render() {
      if (this.active) {
        if (this.ball.right > this.left
          && this.ball.left < this.right
          && this.ball.bottom > this.top
          && this.ball.top < this.bottom
        ) {
          // collision
          this.active = false;
          this.ball.dy = -this.ball.dy;
          brickCount--;
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this.left, this.top, this.width, this.height);
      }
    }
  }
  
  class Paddle {  
    constructor() {
      this.width = 80;
      this.height = 10;
      this.top = canvas.height - this.height;
      this.left = (canvas.width - 30) / 2;
      this.right = this.left + this.width;
      this.color = "#ddd";
    } 
    
    render() {
      if (leftKeyPressed && this.left > 0) {
        this.left -= 5;
      }
      
      if (rightKeyPressed && this.right < canvas.width) {
        this.left += 5;
      }

      this.right = this.left + this.width;
  
      ctx.fillStyle = this.color;
      ctx.fillRect(this.left, this.top, this.width, this.height);
    }
  }
  
  class Game { // Umpire
    constructor(paddle, ball) {
      this.over = false;
      this.end = false;
      this.top = (canvas.height + 20) / 2;
      this.left = canvas.width / 2;
      this.ball = ball;
      this.paddle = paddle;
    }

    setOver() {
      if (this.ball.outOfPaddle) {
        this.over = true;
      }
    }

    setEnd() {
      if (brickCount < 1) {
        this.end = true;
      }
    }
    
    render() {
      this.setOver();
      this.setEnd();

      var message = "";

      if (this.over) {
        message = "GAME OVER";
      } else if (this.end) {
        message = "YOU WIN!";
      }

      ctx.font = "16px Monospace";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(message, this.left, this.top);
    }
  }
  
  /* variables */
  var rowCount = 5;
  var colCount = 5;
  var brickCount = rowCount * colCount;
  var bricks = [];
  var paddle = new Paddle();
  var ball = new Ball(paddle);
  var game = new Game(paddle, ball);

  for (var r = 0; r < rowCount; r++) {
    bricks[r] = [];
    for (var c = 0; c < colCount; c++) {
      bricks[r][c] = new Brick(ball, r, c);
    }
  }

  /* run the game */
  function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.render();
    // bricks 
    for (var r = 0; r < rowCount; r++) {
      for (var c = 0; c < colCount; c++) {
        bricks[r][c].render();
      }
    }
    paddle.render();
    game.render();

    if (!game.end && !game.over)
      requestAnimationFrame(main);
  }

  main();

  /* controller */
  var leftKeyPressed = false;
  var rightKeyPressed = false;

  document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowRight") {
      rightKeyPressed = true;
    }

    if (e.key == "ArrowLeft") {
      leftKeyPressed = true;
    }
  });

  document.addEventListener("keyup", function (e) {
    if (e.key == "ArrowRight") {
      rightKeyPressed = false;
    }

    if (e.key == "ArrowLeft") {
      leftKeyPressed = false;
    }
  });
})();  
