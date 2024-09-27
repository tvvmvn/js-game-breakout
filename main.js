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
  canvas.style["backgroundColor"] = "#000";
  
  /* contants */
  const ARROW_RIGHT = "ArrowRight";
  const ARROW_LEFT = "ArrowLeft";
  
  /* class */
  class Stage {
    OFFSET_X = 10;
    OFFSET_Y = 50;
    WIDTH = 480;
    HEIGHT = 300;

    render() {
      ctx.font = "20px Monospace";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(
        "B R E A K O U T",
        this.OFFSET_X + (this.WIDTH / 2),
        30,
      );
  
      ctx.beginPath();
      ctx.lineWidth = "4";
      ctx.strokeStyle = "#fff";
      ctx.rect(this.OFFSET_X, this.OFFSET_Y, this.WIDTH, this.HEIGHT)
      ctx.stroke();
    }
  }

  class Ball {
    radius = 10;
    dx = 2;
    dy = -2;
    color = "#fff";

    constructor(stage) {
      this.stage = stage;

      this.x = this.stage.OFFSET_X + (this.stage.WIDTH / 2);
      this.y = this.stage.OFFSET_Y + (this.stage.HEIGHT - 30);
    }
  
    render() {
      // right
      if (this.x + this.dx > this.stage.OFFSET_X + this.stage.WIDTH - this.radius) {
        this.dx = -this.dx;
      }
  
      // left
      if (this.x + this.dx < this.stage.OFFSET_X + this.radius) {
        this.dx = -this.dx;
      }
  
      // top
      if (this.y + this.dy < this.stage.OFFSET_Y + this.radius) {
        this.dy = -this.dy;
      }
  
      // bottom
      if (this.y > this.stage.OFFSET_Y + this.stage.HEIGHT - this.radius - 10) {
        if ( 
          this.x + this.radius >= paddle.x
          && this.x - this.radius <= paddle.x + paddle.width
        ) {
          this.dy = -this.dy;
        } else {
          game.over = true;
        }
      }
  
      if (!game.end && !game.over) {
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
    PADDING = 10;
    ROW_COUNT = 5;
    COLUMN_COUNT = 5;
    bricks = [];
    brickCount = this.ROW_COUNT * this.COLUMN_COUNT;
    
    constructor(stage, ball) {
      this.stage = stage;
      this.ball = ball;
      
      this.OFFSET_X = this.stage.OFFSET_X + 20;
      this.OFFSET_Y = this.stage.OFFSET_Y + 20;

      for (var r = 0; r < this.ROW_COUNT; r++) {
        this.bricks[r] = [];
        
        for (var c = 0; c < this.COLUMN_COUNT; c++) {
          var brick = new Brick();

          this.bricks[r][c] = brick;
        }
      }
    }
  
    render() {
      for (var r = 0; r < this.ROW_COUNT; r++) {
        for (var c = 0; c < this.COLUMN_COUNT; c++) {
          var brick = this.bricks[r][c];
  
          if (brick.status == 1) {
            brick.x = this.OFFSET_X + (c * (brick.width + this.PADDING));
            brick.y = this.OFFSET_Y + (r * (brick.height + this.PADDING));
  
            if (
              this.ball.x + this.ball.radius > brick.x
              && this.ball.x + this.ball.radius < brick.x + brick.width
              && this.ball.y + this.ball.radius > brick.y
              && this.ball.y - this.ball.radius < brick.y + brick.height
            ) {
              brick.status = 0;
              game.score++;
              this.ball.dy = -this.ball.dy;
  
              if (game.score == this.brickCount) {
                game.end = true;
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
    
    constructor(stage) {
      this.stage = stage;

      this.x = this.stage.OFFSET_X + ((this.stage.WIDTH - 30) / 2);
      this.y = this.stage.OFFSET_Y + (this.stage.HEIGHT - 10);
    } 

    render() {
      if (!game.end && !game.over) {
        if (
          rightKeyPressed
          && this.x + this.width < this.stage.OFFSET_X + this.stage.WIDTH - 4
        ) {
          this.x += 4;
        }
    
        if (
          leftKeyPressed
          && this.x > this.stage.OFFSET_X + 4
        ) {
          this.x -= 4;
        }
      }
  
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Message {
    message = "";

    constructor(stage) {
      this.stage = stage;
      this.x = this.stage.OFFSET_X + (this.stage.WIDTH / 2);
      this.y = this.stage.OFFSET_Y + ((this.stage.HEIGHT + 20) / 2);
    }

    render() {
      if (game.over) {
        this.message = "GAME OVER";
      } else if (game.end) {
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
  var stage = new Stage();
  var ball = new Ball(stage);
  var brickStack = new BrickStack(stage, ball);
  var paddle = new Paddle(stage);
  var message = new Message(stage);
  var game = new Game();

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
