jQuery(function($){
  var ctx =
      document.getElementById('canvas').getContext('2d'),
      canvas = document.getElementById('canvas'),
      numCtx = document.getElementById('number').getContext('2d'),
      number = document.getElementById('number'),
      balls = [],
      coordinates=[],
      textArray = ['K','O','N','G','6','6'],
      index = 0;
      R = 4;

  init();

  function init(){
    window.onresize = initCanvas;
    initCanvas();
    createBalls();
    collect();
    window.requestAnimationFrame(update);
  }

  function collect(){
    getTextCoordinates(textArray[index]);
    makeupText();
    if(++index==textArray.length){
      index = 0;
    }
    setTimeout(disperse,3000);

  }
  function disperse(){
    for(var i=0;i< coordinates.length;++i){
      balls[i].reset(true,0,0,60,60);
    }
    setTimeout(collect,2000);
  }

  function makeupText(){
    var i,x,y;
    for(i=0;i< coordinates.length;++i){
      x = coordinates[i].x + canvas.width/2 - number.width/2;
      y = coordinates[i].y + canvas.height/2 - number.height/2;
      balls[i].reset(false,x,y,30,60);
    }
  }

  function getTextCoordinates(text){
    var imgData,x,y,i;
    numCtx.clearRect(0,0,number.width,number.height);
    numCtx.fillStyle = '#ff1111';
    numCtx.textAlign = 'center';
    numCtx.font = 'bold 400px Arial';
    numCtx.fillText(text,300,300);

    imgData = numCtx.getImageData(0,0,
      number.width,number.height).data;
    coordinates = [];
    for(i=imgData.length;i>=0;i-=4){
      if(imgData[i]!==0){
        x =  (i/4)%number.width;
        // y = Math.floor(i/4/canvas.width);
        y = Math.floor(Math.floor(i/number.width)/4)
        if(x && (x%(R*2+3)==0) && y && (y%(R*2+3)==0)){
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
    this.F = 0;
    this.delay;
    this.totalF = 120;
    this.color = 'rgb('+
      randomInt(0,255)+','+
      randomInt(0,255)+','+
      randomInt(0,255)+')';

    this.reset=function(auto,ex,ey,delay,dur){
      this.autoRender = auto;
      this.F = 0;
      this.delay = (delay&& randomInt(0,delay) ) || randomInt(0,120);
      this.totalF = dur || this.totalF;
      this.x = this.x || randomInt(0,canvas.width);
      this.y = this.y || randomInt(0,canvas.height);
      this.startX = this.x;
      this.startY = this.y;
      this.endX = ex || randomInt(0,canvas.width);
      this.endY = ey || randomInt(0,canvas.height);
    };
    this.reset(true);
    this.render= function(){
      if(this.F >this.delay && this.F < this.totalF + this.delay){
        this.lerp();
      }
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
      if(++this.F > this.totalF + this.delay){
        if(this.autoRender){
          this.reset(true);
        }
      }
    };
    this.lerp = function(){
      var nor;
      if(this.F> this.delay){
        nor = normal(this.F- this.delay,0,this.totalF );
        this.x = lerp(nor,this.startX,this.endX);
        this.y = lerp(nor,this.startY,this.endY);
      }
    };
  }
  function createBalls(){
    var n = 500,
        i=0,ball;
    for(i=0;i<n;++i){
      ball = new Ball();
      balls.push(ball);
      ball.render();
    }
  }
  function initCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }


  function update(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderBalls();
    window.requestAnimationFrame(update);
  }
  function renderBalls(){
    var i;
    for(i=0;i<balls.length;++i){
      balls[i].render();
    }
  }

  function getRandomFloat(min,max){
    return min + Math.random() * (max - min);
  }

  function randomInt(min,max){
    var r = min + Math.round(Math.random()*(max - min));
    return r;
  }
  function lerp(normal,min,max){
    normal = easeInOutCubic(normal);
    return min + (max - min)*normal;
  }
  function normal(value,min,max){
    return (value - min)/(max - min);
  }
  function easeInOutCubic(nor){
      if ((nor/=0.5) < 1) return 0.5*Math.pow(nor,3);
      return 0.5 * (Math.pow((nor-2),3) + 2);
  }

});
