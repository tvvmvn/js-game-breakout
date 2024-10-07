(function () {
  /* canvas */
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 350;
  canvas.style.backgroundColor = "#000";
  /* contants */
  const ARROW_RIGHT = "ArrowRight";
  const ARROW_LEFT = "ArrowLeft";
  
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
    constructor() {
      this.width = 80;
      this.height = 20;
      this.top = 0;
      this.left = 0;
      this.right = 0;
      this.bottom = 0;
      this.status = 1;
      this.color = "pink";
    }
  }
  
  class BrickStack {
    constructor(ball) {
      this.row_count = 6;
      this.column_count = 5;
      this.top = 30;
      this.left = 30;
      this.padding = 10;
      this.brickCount = this.row_count * this.column_count;
      this.bricks = [];
      this.ball = ball;

      // initializing bricks
      for (var r = 0; r < this.row_count; r++) {
        this.bricks[r] = [];
        
        for (var c = 0; c < this.column_count; c++) {
          var brick = new Brick();
          brick.left = this.left + (c * (brick.width + this.padding));
          brick.top = this.top + (r * (brick.height + this.padding));
          brick.right = brick.left + brick.width;
          brick.bottom = brick.top + brick.height;

          this.bricks[r][c] = brick;
        }
      }
    }
  
    render() {
      for (var r = 0; r < this.row_count; r++) {
        for (var c = 0; c < this.column_count; c++) {
          var brick = this.bricks[r][c];
  
          if (brick.status == 1) {
            if (
              this.ball.right > brick.left
              && this.ball.left < brick.right
              && this.ball.bottom > brick.top
              && this.ball.top < brick.bottom
            ) {
              brick.status = 0;
              this.brickCount--;
              this.ball.dy = -this.ball.dy;
            }
  
            ctx.fillStyle = brick.color;
            ctx.fillRect(brick.left, brick.top, brick.width, brick.height);
          }
        }
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
    constructor(paddle, ball, brickStack) {
      this.over = false;
      this.end = false;
      this.top = (canvas.height + 20) / 2;
      this.left = canvas.width / 2;
      this.ball = ball;
      this.brickStack = brickStack;
      this.paddle = paddle;
    }

    setOver() {
      if (this.ball.outOfPaddle) {
        this.over = true;
      }
    }

    setEnd() {
      if (this.brickStack.brickCount < 1) {
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
  var paddle = new Paddle();
  var ball = new Ball(paddle);
  var brickStack = new BrickStack(ball);
  var game = new Game(paddle, ball, brickStack);

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
    ball.render();
    brickStack.render();
    paddle.render();
    game.render();

    if (!game.end && !game.over)
      requestAnimationFrame(main);
  }

  main();
})();  
