/*
OOP Modeling

# Stage
# Bricks, Brick
# Ball
# Paddle
# Message
# Game
*/

(function () {
  /* canvas */
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  
  /* contants */
  const ARROW_RIGHT = "ArrowRight";
  const ARROW_LEFT = "ArrowLeft";
  
  /* class */
  class Stage {
    constructor() {
      this.width = 480;
      this.height = 300;
      this.top = 10;
      this.left = 10;
      this.right = this.left + this.width;
      this.bottom = this.top + this.height;
      this.color = "#111";
    }

    render() {  
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.fillRect(this.left, this.top, this.width, this.height)
      ctx.stroke();
    }
  }

  class Ball {
    constructor(stage, paddle) {
      this.x = stage.left + (stage.width / 2);
      this.y = stage.bottom - 30;
      this.radius = 10;
      this.top = 0;
      this.left = 0;
      this.right = 0;
      this.bottom = 0;
      this.color = "#fff";
      this.dx = 2;
      this.dy = -2;
      this.stage = stage;
      this.paddle = paddle;
    }
    
    render() {
      this.right = this.x + this.radius;
      this.left = this.x - this.radius;
      this.top = this.y - this.radius;
      this.bottom = this.y + this.radius;

      if (this.right > this.stage.right) {
        this.dx = -this.dx;
      }
  
      if (this.left < this.stage.left) {
        this.dx = -this.dx;
      }
  
      if (this.top < this.stage.top) {
        this.dy = -this.dy;
      }
  
      if (this.bottom + 10 > this.stage.bottom) {
        if (
          this.right >= this.paddle.left 
          && this.left <= this.paddle.right
        ) {
          this.dy = -this.dy;
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
    constructor(stage, ball) {
      this.row_count = 5;
      this.column_count = 5;
      this.top = stage.top + 20;
      this.left = stage.left + 20;
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
    constructor(stage) {
      this.width = 50;
      this.height = 5;
      this.top = stage.top + (stage.height - 10);
      this.left = stage.left + ((stage.width - 30) / 2);
      this.right = this.left + this.width;
      this.color = "#fff";
      this.stage = stage;
    } 
    
    render() {
      
      if (leftKeyPressed && this.left > this.stage.left) {
        this.left -= 4;
      }
      
      if (rightKeyPressed && this.right < this.stage.right) {
        this.left += 4;
      }

      this.right = this.left + this.width;
  
      ctx.fillStyle = this.color;
      ctx.fillRect(this.left, this.top, this.width, this.height);
    }
  }
  
  class Game { // Umpire
    constructor(stage, paddle, ball, brickStack) {
      this.over = false;
      this.end = false;
      this.top = stage.top + ((stage.height + 20) / 2);
      this.left = stage.left + (stage.width / 2);
      this.stage = stage;
      this.ball = ball;
      this.brickStack = brickStack;
      this.paddle = paddle;
    }
    
    render() {
      if (this.ball.bottom + 10 > this.stage.bottom) {
        if ( 
          this.ball.right < this.paddle.left
          || this.ball.left > this.paddle.right
        ) {
          this.over = true;
        } 
      }

      if (this.brickStack.brickCount < 1) {
        this.end = true;
      }

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
  var stage = new Stage();
  var paddle = new Paddle(stage);
  var ball = new Ball(stage, paddle);
  var brickStack = new BrickStack(stage, ball);
  var game = new Game(stage, paddle, ball, brickStack);

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
    stage.render();
    ball.render();
    brickStack.render();
    paddle.render();
    game.render();

    if (!game.end && !game.over)
      requestAnimationFrame(main);
  }

  main();
})();  
