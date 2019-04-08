var canvas,
    ctx,
    bar,
    progress,
    loadSpeed=0.5;

init();

function init(){
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  progress = 0;
  window.onresize = resize;
  resize();
  bar = new Bar();
  updateAni();
}
function drawLinearGradient(){
  var gra = ctx.createLinearGradient(0,0,300,300);
  gra.addColorStop(0,'red');
  gra.addColorStop(0.5,'green');
  gra.addColorStop(1,'blue');
  ctx.fillStyle = gra;
  ctx.fillRect(0,0,300,300);
}

function updateAni() {
  progress += loadSpeed;
  if(progress>100){
    progress = 0;
  }
  renderBG();
  bar.render(progress);
  requestAnimationFrame(updateAni);
}
function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if(bar){
    bar.resize();
  }
}

function renderBG() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width,canvas.height);
}

function Bar() {
  this.curWidth;
  this.hue;
  this.minHue = 0;
  this.maxHue = 90;
  this.w;
  this.h;
  this.l;
  this.t;
  this.bgColor='#333';
  this.density = 10;
  this.particles = [];

  this.reset =function(){
    this.curWidth = 0;
    this.hue = this.minHue;
    this.resize();
  };
  this.resize =function(){
    this.w = canvas.width>800?600:canvas.width*0.8;
    this.h = 25;
    this.l = (canvas.width - this.w)/2;
    this.t = (canvas.height - this.h)/2;
  };
  this.reset();
  this.render = function(ratio) {
    this.caculate(ratio);
    this.drawBG();
    this.drawBar();
    this.renderParticle();
  };
  this.caculate=function(ratio){
    ratio = ratio>100? 1:ratio/100;
    bar.hue = this.minHue +
      ratio*(this.maxHue - this.minHue);
    bar.curWidth =this.w*ratio;
    bar.curWidth = bar.curWidth>this.w?
      this.w : bar.curWidth;
  };
  this.drawBG = function(){
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(this.l,this.t,this.w,this.h);
  };
  this.drawBar=function(){
    ctx.fillStyle = 'hsla(' + this.hue + ', 100%, 40%, 1)';
    ctx.fillRect(this.l, this.t, this.curWidth, this.h);
    var grad = ctx.createLinearGradient(
      this.l,this.t,this.l+this.curWidth,this.t+this.h);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(1, "rgba(0,0,0,0.7)");
    ctx.fillStyle = grad;
    ctx.fillRect(this.l, this.t, this.curWidth, this.h);
  };
  this.renderParticle = function(){
    var i,activeParticels=[];
    for(i=0;i<this.density;++i){
      this.particles.push(new Particle(this.l+this.curWidth,this.t));
    }
    for(i=0;i<this.particles.length;++i){
      if(this.particles[i].active){
        activeParticels.push(this.particles[i]);
        this.particles[i].render();
      }
    }
    this.particles = activeParticels.slice(0);
    // console.log('particles number = '+this.particles.length);
  };
}

function Particle(l,t) {
  this.x = l;
  this.y = t;
  this.vx =-( 0.8 + Math.random() * 1);
  this.vy = -(1 + Math.random() * 3);
  this.g = 0.1;
  this.curAlpha = 1;
  this.alphaSpeed = 0.01;
  this.active = true;

  this.render = function() {
    if(this.active){
      this.calculate();
      this.draw();
    }
  }
  this.draw=function(){
    ctx.fillStyle = 'hsla(' + (bar.hue + 0.3) + ', 100%, 40%,'+this.curAlpha + ')';
    var size = Math.random() * 2;
    ctx.fillRect(this.x, this.y, size, size);
  };
  this.calculate = function(){
    this.x += this.vx;
    this.vy  += this.g;
    this.y += this.vy;
    this.curAlpha = Math.max(0,
      this.curAlpha -this.alphaSpeed);
    if(this.curAlpha ==0){
      this.active = false;
    }
  };
}
