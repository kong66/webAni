jQuery(function($){
  var ctx =
        document.getElementById('canvas').getContext('2d'),
      $canvas = $('#canvas'),
      $win = $(window),
      balls = [],
      config=[],
      R = 2,
      maxV = 1,
      minV = 0.1,
      minDis = 160,
      maxNum = 100;
      hasMouse = false,
      mouse_ball = {
        x:-100,
        y:-100,
        vx:0,
        vy:0,
        r:R*2,
        color:'orange'},

  init();

  function init(){
    $win.on('resize',initCanvas);
    $canvas.on('mouseenter',onmouseenter);
    $canvas.on('mouseleave',onmouseleave);
    $canvas.on('mousemove',onmousemove);
    initCanvas();
    createBalls();
    window.requestAnimationFrame(update);
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
        x:[0,$canvas.myW],
        y:[-R,-R],
        vx:[-maxV,maxV],
        vy:[minV,maxV]
      },
      {
        x:[0,$canvas.myW],
        y:[$canvas.myH + R,$canvas.myH + R],
        vx:[-maxV,maxV],
        vy:[-maxV,-minV]
      },
      {
        x:[-R,-R],
        y:[0,$canvas.myH],
        vx:[minV,maxV],
        vy:[-maxV,maxV]
      },
      {
        x:[$canvas.myW+R,$canvas.myW+R],
        y:[0,$canvas.myH],
        vx:[-maxV,-minV],
        vy:[-maxV,maxV]
      }];
  }
  function initCanvas(){
    $canvas.myW = $win.width();
    $canvas.myH = $win.height();
    $canvas.attr('width',$canvas.myW+"");
    $canvas.attr('height',$canvas.myH+"");
    createConfig();
  }

  function createBalls(){
    for (var i=0; i < 30; ++i) {
      balls.push(createBall());
    }
  }

  function createBall(){
    var info = config[getRandomInt(0,config.length-1)];
    var ball = {
       x:getRandomFloat(info.x[0],info.x[1]),
       y:getRandomFloat(info.y[0],info.y[1]),
       vx:getRandomFloat(info.vx[0],info.vx[1]),
       vy:getRandomFloat(info.vy[0],info.vy[1]),
       r: R,
       color: "gray"
     };
     return ball;
  }


  function update(){
    ctx.clearRect(0, 0, $canvas.myW, $canvas.myH);
    renderPosition();
    renderBalls();
    renderLines();
    window.requestAnimationFrame(update);
  }
  function renderPosition(){
    var nexBalls = [],ball;
    for(i=0;i<balls.length;++i){
      ball = balls[i];
      ball.x += ball.vx;
      ball.y += ball.vy;
      if(ball.x > -minDis &&
        ball.x < $canvas.myW+ minDis &&
        ball.y > -minDis &&
        ball.y < $canvas.myH + minDis){
          nexBalls.push(ball);
        }
    }
    balls = nexBalls;
    //console.log(balls.length);
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
          renderLine(balls[i].x, balls[i].y,balls[j].x, balls[j].y,alpha);
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

  function getRandomFloat(min,max){
    return min + Math.random() * (max - min);
  }
  function getRandomInt(min,max){
    var r = min + Math.round(Math.random()*(max - min));
    //console.log(r);
    return r;
  }
  function getDisOf(ball1, ball2){
    var  dx = Math.abs(ball1.x - ball2.x),
       dy = Math.abs(ball1.y - ball2.y);

    return Math.sqrt(dx*dx + dy*dy);
}

});
