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
    offset_x = 10;
    offset_y = 10;
    width = 480;
    height = 300;
    color = "#111";

    render() {  
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.fillRect(this.offset_x, this.offset_y, this.width, this.height)
      ctx.stroke();
    }
  }

  class Ball {
    radius = 10;
    dx = 2;
    dy = -2;
    color = "#fff";
    rightMost;
    leftMost;

    constructor(game, stage, paddle) {
      this.game = game;
      this.x = stage.offset_x + (stage.width / 2);
      this.y = stage.offset_y + (stage.height - 30);
      this.leftWall = stage.offset_x;
      this.rightWall = stage.offset_x + stage.width;
      this.ceiling = stage.offset_y;
      this.bottom = stage.offset_y + stage.height;
    }
    
    render() {
      var leftMost = paddle.x;
      var rightMost = paddle.x + paddle.width;

      if (this.x + this.radius > this.rightWall) {
        this.dx = -this.dx;
      }
  
      if (this.x - this.radius < this.leftWall) {
        this.dx = -this.dx;
      }
  
      if (this.y - this.radius < this.ceiling) {
        this.dy = -this.dy;
      }
  
      if (this.y + this.radius + 10 > this.bottom) {
        if ( 
          this.x + this.radius >= leftMost
          && this.x - this.radius <= rightMost
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
    x = 0;
    y = 0;
    width = 80;
    height = 20;
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
      this.offset_x = stage.offset_x + 20;
      this.offset_y = stage.offset_y + 20;

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
            brick.x = this.offset_x + (c * (brick.width + this.padding));
            brick.y = this.offset_y + (r * (brick.height + this.padding));
  
            if (
              this.ball.x + this.ball.radius > brick.x
              && this.ball.x + this.ball.radius < brick.x + brick.width
              && this.ball.y + this.ball.radius > brick.y
              && this.ball.y - this.ball.radius < brick.y + brick.height
            ) {
              brick.status = 0;
              this.game.score++;
              this.ball.dy = -this.ball.dy;
  
              if (this.game.score == this.brickCount) {
                this.game.end = true;
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
    width = 50;
    height = 5;
    color = "#fff";
    
    constructor(game, stage) {
      this.game = game;
      this.x = stage.offset_x + ((stage.width - 30) / 2);
      this.y = stage.offset_y + (stage.height - 10);
      this.leftWall = stage.offset_x + 4;
      this.rightWall = stage.offset_x + stage.width - 4;
    } 
    
    render() {
      var rightMost = this.x + this.width;

      if (!this.game.end && !this.game.over) {
        if (leftKeyPressed && this.x > this.leftWall) {
          this.x -= 4;
        }

        if (rightKeyPressed && rightMost < this.rightWall) {
          this.x += 4;
        }
      }
  
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Message {
    message = "";

    constructor(game, stage) {
      this.game = game;
      this.x = stage.offset_x + (stage.width / 2);
      this.y = stage.offset_y + ((stage.height + 20) / 2);
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
      ctx.fillText(this.message, this.x, this.y);
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
