
  var canvas,
    ctx,
    w,h,
    text;

  init();
  function init(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
  	window.onresize = resize;
    resize();
    requestAniFrame(update);
  }
	function resize() {
		w = canvas.width = window.innerWidth;
		h = canvas.height = window.innerHeight;
    text = new Shape(w/2, h/2, "KONG66");
    text.getPos();
	}
  function Shape(x, y, str) {
    this.cx = x;
    this.cy = y;
    this.font = 200;
    this.grid = 5;
    this.text = str;
    this.particles = [];
    this.getPos = function() {
      var idata,buffer32,x,y;
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = 'middle';
      ctx.font = "bold " + this.font + "px Arial";
      ctx.fillText(this.text, this.cx, this.cy);
      idata = ctx.getImageData(0, 0, w, h);
      buffer32 = new Uint32Array(idata.data.buffer);
      for (y = 0; y < h; y += this.grid) {
        for (x = 0; x < w; x += this.grid) {
          if (buffer32[y * w + x]) {
            this.particles.push(new Particle(x, y));
          }
        }
      }
      ctx.clearRect(0, 0, w, h);
      ctx.restore();
    };
  }

  function Particle(x, y) {
    this.r;
    this.maxR;
    this.x;
    this.y;
    this.grow;
    this.startPos = [x, y];
    this.vx = 0;
    this.vy = 0;
    this.friction = .99;
    this.color;
    this.gravity = 0.05,
    this.rSpeed = 0.2,

    this.colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
      '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
      '#FF5722'
    ];
    this.getSpeed = function() {
      return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    };
    this.setSpeed = function(speed) {
      var heading = this.getHeading();
      this.vx = Math.cos(heading) * speed;
      this.vy = Math.sin(heading) * speed;
    };
    this.getHeading = function() {
      return Math.atan2(this.vy, this.vx);
    };
    this.setHeading = function(heading) {
      var speed = this.getSpeed();
      this.vx = Math.cos(heading) * speed;
      this.vy = Math.sin(heading) * speed;
    };
    this.angleTo = function(p2) {
      return Math.atan2(p2.y - this.y, p2.x - this.x);
    };
    this.getRandomColor=function(){
      return this.colors[Math.floor(
        Math.random()*this.colors.length)];
    };
    this.reset=function(){
      this.x = this.startPos[0];
      this.grow = false;
      this.y = this.startPos[1];
      this.r = 1;
      this.setHeading(randomInt(degreesToRads(0), degreesToRads(360)));
      this.setSpeed(randomFloat(0.1,0.5));
      this.maxR = randomInt(this.r, this.r+6);
      this.color = this.getRandomColor() ;
    };
    this.reset();
    this.update = function(heading) {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vy *= this.friction;
      this.vx *= this.friction;
      if(this.r < this.maxR &&
        this.grow === false){
        this.r += this.rSpeed;
      }else{
        this.grow = true;
      }
      if(this.grow === true){
        this.r -= this.rSpeed;
      }
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x,this.y,this.r,Math.PI*2,false);
      ctx.fill();

      if (this.y < 0 || this.r < 1) {
        this.reset();
      }
    };
  }

  function update() {
    var i;
    ctx.clearRect(0,0,w,h);
    for (i=0; i < text.particles.length; i++) {
      text.particles[i].update();
    }
    requestAniFrame(update);
  }
