
var canvas = document.getElementById('canvas'),
    ctx =
      document.getElementById('canvas').getContext('2d'),
    balls = [],
    config=[],
    R = 2,
    h,w,
    maxV = 1,
    minV = 0.1,
    minDis = 160,
    maxNum = 100,
    hasMouse = false,
    mouse_ball = {
      x:-100,
      y:-100,
      vx:0,
      vy:0,
      r:R*2,
      color:'orange'};

init();

function init(){
  window.onresize = initCanvas;
  canvas.onmouseenter = onmouseenter;
  canvas.onmouseleave = onmouseleave;
  canvas.onmousemove = onmousemove;
  initCanvas();
  createBalls();
  window.requestAniFrame(update);
}
function onmouseenter(){
  hasMouse = true;
  balls.unshift(mouse_ball);
}
function onmouseleave(){
  hasMouse = false;
  balls.shift();
}
function onmousemove(e){
  if(hasMouse){
    mouse_ball.x = e.clientX;
    mouse_ball.y = e.clientY;
  }
}

function createConfig(){
  config = [
    {
      x:[0,w],
      y:[-R,-R],
      vx:[-maxV,maxV],
      vy:[minV,maxV]
    },
    {
      x:[0,w],
      y:[h + R,h + R],
      vx:[-maxV,maxV],
      vy:[-maxV,-minV]
    },
    {
      x:[-R,-R],
      y:[0,h],
      vx:[minV,maxV],
      vy:[-maxV,maxV]
    },
    {
      x:[w+R,w+R],
      y:[0,h],
      vx:[-maxV,-minV],
      vy:[-maxV,maxV]
    }];
}
function initCanvas(){
  canvas.width = w = window.innerWidth;
  canvas.height = h = window.innerHeight;
  createConfig();
}

function createBalls(){
  for (var i=0; i < maxNum; ++i) {
    balls.push(createBall());
  }
}

function createBall(){
  var info = config[randomInt(0,config.length-1)];
  var ball = {
     x:randomFloat(info.x[0],info.x[1]),
     y:randomFloat(info.y[0],info.y[1]),
     vx:randomFloat(info.vx[0],info.vx[1]),
     vy:randomFloat(info.vy[0],info.vy[1]),
     r: R,
     color: "gray"
   };
   return ball;
}


function update(t){
  console.log(t);
  ctx.clearRect(0, 0, w, h);
  renderPosition();
  renderBalls();
  renderLines();
  window.requestAniFrame(update);
}
function renderPosition(){
  var activeBalls = [],ball;
  for(i=0;i<balls.length;++i){
    ball = balls[i];
    ball.x += ball.vx;
    ball.y += ball.vy;
    if(ball.x > -minDis &&
      ball.x < w+ minDis &&
      ball.y > -minDis &&
      ball.y < h + minDis){
        activeBalls.push(ball);
      }
  }
  balls = activeBalls;
  if(balls.length< maxNum){
    balls.push(createBall());
  }
}
function renderBalls(){
    for(i=0;i<balls.length;++i){
      ctx.fillStyle = balls[i].color;
      ctx.beginPath();
      ctx.arc(balls[i].x, balls[i].y, balls[i].r, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fill();
    }
}
function renderLines(){
  var f, alpha,i,j;
  for (i = 0; i < balls.length; i++) {
    for (j = i + 1; j < balls.length; j++) {
       f = getDisOf(balls[i], balls[j]) / minDis;
       if(f < 1){
        alpha = 1 - f;
        renderLine(balls[i].x,balls[i].y,
          balls[j].x, balls[j].y,alpha);
       }
    }
  }
}

function renderLine(x1,y1,x2,y2,a){
  ctx.strokeStyle = 'rgba(150,150,150,'+a+')';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
  ctx.closePath();
}

function randomFloat(min,max){
  return min + Math.random() * (max - min);
}
function randomInt(min,max){
  return Math.round(randomFloat(min,max));
}
function getDisOf(ball1, ball2){
  var dx = Math.abs(ball1.x - ball2.x),
      dy = Math.abs(ball1.y - ball2.y);
  return Math.sqrt(dx*dx + dy*dy);
}
