var ctx,
    canvas,
    numCtx,
    w,h,textW,textH,
    balls = [],
    coordinates=[],
    textArray = ['K','O','N','G','6','6'],
    index = 0,
    R = 4,
    colors = ['#2196f3','#03a9f4','#00bcd4','#009688','#3f51b5','#673ab7','#9e9e9e'];

init();

function init(){
  var textCanvas;
  canvas=document.getElementById('canvas');
  ctx=canvas.getContext('2d');
  textCanvas = document.getElementById('textCanvas');
  numCtx = textCanvas.getContext('2d');
  textW = textCanvas.width;
  textH = textCanvas.height;
  window.onresize = resizeCanvas;
  resizeCanvas();
  createBalls();
  collect();
  requestAniFrame(update);
}
function resizeCanvas(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
function createBalls(){
  var n = 500,i=0,ball;
  for(i=0;i<n;++i){
    ball = new Ball();
    balls.push(ball);
    ball.render(0);
  }
}
function update(t){
  ctx.clearRect(0, 0, w, h);
  renderBalls(t);
  requestAniFrame(update);
}
function renderBalls(t){
  var i;
  for(i=0;i<balls.length;++i){
    balls[i].render(t);
  }
}

function collect(){
  drawText(textArray[index]);
  getTextCoordinates();
  makeupText();
  if(++index==textArray.length){
    index = 0;
  }
  setTimeout(disperse,3000);
}
function disperse(){
  for(var i=0;i< coordinates.length;++i){
    balls[i].reset(true,0,0,1000,1000);
  }
  setTimeout(collect,2000);
}

function makeupText(){
  var i,x,y;
  for(i=0;i< coordinates.length;++i){
    x = coordinates[i].x + w/2 - textW/2;
    y = coordinates[i].y + h/2 - textH/2;
    balls[i].reset(false,x,y,500,1000);
  }
}
function drawText(text){
  numCtx.clearRect(0,0,textW,textH);
  numCtx.fillStyle = '#ff1111';
  numCtx.textAlign = 'center';
  numCtx.font = 'bold 400px Arial';
  numCtx.fillText(text,300,300);
}
function getTextCoordinates(){
  var imgData,x,y,i;
  imgData = numCtx.getImageData(0,0,textW,textH).data;
  coordinates = [];
  for(i=0;i<imgData.length;i+=4){
    if(imgData[i]!==0){
      x =  (i/4)%textW;
      y = Math.floor(i/4/textW);
      if( x%(R*2+3)==0 &&
       y%(R*2+3)==0){
        coordinates.push({x:x,y:y});
      }
    }
  }
}

function Ball(){
  this.autoRender;
  this.startX;
  this.startY;
  this.x;
  this.y;
  this.endX;
  this.endY;
  this.r = R;
  this.t = 0;
  this.old = 0;
  this.delay;
  this.dur = 4000;
  this.color;
  this.init = function(){
    var hue,brightness;
    hue = randomInt(0,30);
    brightness = randomInt(30,70);
    this.color = "hsl("+hue+",90%,"+brightness+"%)";
  };
  this.init();
  this.reset=function(auto,ex,ey,delay,dur){
    this.autoRender = auto;
    this.t = 0;
    this.old = 0;
    this.delay = (delay&& randomInt(0,delay) ) || randomInt(0,3000);
    this.dur = dur || this.dur;
    this.x = this.x || randomInt(0,w);
    this.y = this.y || randomInt(0,h);
    this.startX = this.x;
    this.startY = this.y;
    this.endX = ex || randomInt(0,w);
    this.endY = ey || randomInt(0,h);
  };
  this.reset(true);
  this.render= function(t){
    if(!this.old){
      this.old = t;
    }
    this.t = t - this.old;
    if(this.t >= this.delay){
      if(this.t > this.dur + this.delay){
        if(this.autoRender){
          this.reset(true);
        }
      }else{
        this.lerp();
      }
    }
    this.draw();
  };
  this.draw = function(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  };
  this.lerp = function(){
    var nor;
    if(this.t> this.delay){
      nor = normal(this.t-this.delay,0,this.dur );
      this.x = lerp_easeInOutCubic(nor,this.startX,this.endX);
      this.y = lerp_easeInOutCubic(nor,this.startY,this.endY);
    }
  };
}
