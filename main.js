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
    width = 480;
    height = 300;
    top = 10;
    left = 10;
    right = this.left + this.width;
    bottom = this.top + this.height;
    color = "#111";

    render() {  
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.fillRect(this.left, this.top, this.width, this.height)
      ctx.stroke();
    }
  }

  class Ball {
    radius = 10;
    dx = 2;
    dy = -2;
    color = "#fff";

    constructor(game, stage, paddle) {
      this.game = game;
      this.stage = stage;
      this.paddle = paddle;
      this.x = stage.left + (stage.width / 2);
      this.y = stage.bottom - 30;
    }
    
    render() {
      if (this.x + this.radius > this.stage.right) {
        this.dx = -this.dx;
      }
  
      if (this.x - this.radius < this.stage.left) {
        this.dx = -this.dx;
      }
  
      if (this.y - this.radius < this.stage.top) {
        this.dy = -this.dy;
      }
  
      if (this.y + this.radius + 10 > this.stage.bottom) {
        if ( 
          this.x + this.radius >= this.paddle.left
          && this.x - this.radius <= this.paddle.left + this.paddle.width
        ) {
          this.dy = -this.dy;
        } else {
          this.game.over = true;
        }
      }
  
      if (!this.game.end && !this.game.over) {
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
    width = 80;
    height = 20;
    left = 0;
    top = 0;
    status = 1;
    color = "pink";
  }
  
  class BrickStack {
    padding = 10;
    row_count = 5;
    column_count = 5;
    brickCount = this.row_count * this.column_count;
    bricks = [];
    
    constructor(game, stage, ball) {
      this.game = game;
      this.ball = ball;
      this.left = stage.left + 20;
      this.top = stage.top + 20;

      for (var r = 0; r < this.row_count; r++) {
        this.bricks[r] = [];
        
        for (var c = 0; c < this.column_count; c++) {
          var brick = new Brick();

          this.bricks[r][c] = brick;
        }
      }
    }
  
    render() {
      for (var r = 0; r < this.row_count; r++) {
        for (var c = 0; c < this.column_count; c++) {
          var brick = this.bricks[r][c];
  
          if (brick.status == 1) {
            brick.left = this.left + (c * (brick.width + this.padding));
            brick.top = this.top + (r * (brick.height + this.padding));
  
            if (
              this.ball.x + this.ball.radius > brick.left
              && this.ball.x + this.ball.radius < brick.left + brick.width
              && this.ball.y + this.ball.radius > brick.top
              && this.ball.y - this.ball.radius < brick.top + brick.height
            ) {
              brick.status = 0;
              this.game.score++;
              this.ball.dy = -this.ball.dy;
  
              if (this.game.score == this.brickCount) {
                this.game.end = true;
              }
            }
  
            ctx.fillStyle = brick.color;
            ctx.fillRect(brick.left, brick.top, brick.width, brick.height);
          }
        }
      }
    }
  }
  
  class Paddle {  
    width = 50;
    height = 5;
    color = "#fff";
    
    constructor(game, stage) {
      this.game = game;
      this.stage = stage;
      this.left = stage.left + ((stage.width - 30) / 2);
      this.top = stage.top + (stage.height - 10);
    } 
    
    render() {
      var right = this.left + this.width;

      if (!this.game.end && !this.game.over) {
        if (leftKeyPressed && this.left > this.stage.left) {
          this.left -= 4;
        }

        if (rightKeyPressed && right < this.stage.right) {
          this.left += 4;
        }
      }
  
      ctx.fillStyle = this.color;
      ctx.fillRect(this.left, this.top, this.width, this.height);
    }
  }

  class Message {
    message = "";

    constructor(game, stage) {
      this.game = game;
      this.left = stage.left + (stage.width / 2);
      this.top = stage.top + ((stage.height + 20) / 2);
    }

    render() {
      if (this.game.over) {
        this.message = "GAME OVER";
      } else if (this.game.end) {
        this.message = "YOU WIN!";
      } 

      ctx.font = "16px Monospace";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(this.message, this.left, this.top);
    }
  }
  
  class Game { // Umpire
    over = false;
    end = false;
    score = 0;
  }
  
  /* variables */
  var game = new Game();
  var stage = new Stage();
  var paddle = new Paddle(game, stage);
  var ball = new Ball(game, stage, paddle);
  var brickStack = new BrickStack(game, stage, ball);
  var message = new Message(game, stage);

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
    message.render();
  }

  setInterval(main, 10);
})();  
