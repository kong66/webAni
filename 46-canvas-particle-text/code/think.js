jQuery(function($){
  var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    w,h,
    grid = 5,
    duration = 0.4,
    speed =0.1,
    radius = 2,
    gravity = 0,
    colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
      '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
      '#FF5722'
    ];

	function resize() {
		w = canvas.width = window.innerWidth;
		h = canvas.height = window.innerHeight;
	}
	resize();
	window.onresize = resize;

  function Shape(x, y, texte) {
    this.x = x;
    this.y = y;
    this.size = 120;

    this.text = texte;
    this.placement = [];
    this.vectors = [];

    this.getValue = function() {
      ctx.textAlign = "center";
      ctx.font = "bold " + this.size + "px arial";
      ctx.fillText(this.text, this.x, this.y);


      var idata = ctx.getImageData(0, 0, w, h);

      var buffer32 = new Uint32Array(idata.data.buffer);

      for (var y = 0; y < h; y += grid) {
        for (var x = 0; x < w; x += grid) {

          if (buffer32[y * w + x]) {
            this.placement.push(new Particle(x, y));
          }
        }
      }
      ctx.clearRect(0, 0, w, h);

    };
  }

  function Particle(x, y, type) {
    this.radius = 1.1;
    this.futurRadius = randomInt(radius, radius+3);
    this.rebond = randomInt(1, 5);
    this.x = x;
    this.y = y;
    this.dying = false;
    this.base = [x, y]
    this.vx = 0;
    this.vy = 0;
    this.type = type;
    this.friction = .99;
    this.color = colors[Math.floor(Math.random() * colors.length)];
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

    this.update = function(heading) {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += gravity;
      this.vy *= this.friction;
      if(this.radius < this.futurRadius && this.dying === false){
        this.radius += duration;
      }else{
        this.dying = true;
      }
      if(this.dying === true){
        this.radius -= duration;
      }
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();

      if (this.y < 0 || this.radius < 1) {
        this.x = this.base[0];
        this.dying = false;
        this.y = this.base[1];
        this.radius = 1.1;
        this.setSpeed(speed);
        this.futurRadius = randomInt(radius, radius+3);
        this.setHeading(randomInt(degreesToRads(0), degreesToRads(360)));
      }

    };

    this.setSpeed(randomInt(.1, .5));
    this.setHeading(randomInt(degreesToRads(0), degreesToRads(360)));
  }

  var message = new Shape(w / 2, h / 2 + 50, "KONG66");

  message.getValue();

  update();

  function change() {
    ctx.clearRect(0, 0, W, H);

    gridX = parseFloat(element4.value);
    gridY = parseFloat(element4.value);
    message.placement = [];
    message.text = fieldvalue.value;
    message.getValue();
  }


  function changeV() {
      gravity = parseFloat(element2.value);
      duration =  parseFloat(element3.value);
      speed = parseFloat(element5.value);
      radius = parseFloat(element6.value);
  }

  var fps = 100;
  function update() {
    setTimeout(function() {
      ctx.clearRect(0, 0, w,h);


      for (var i = 0; i < message.placement.length; i++) {
        message.placement[i].update();
      }

      requestAnimationFrame(update);
    }, 1000 / fps);
  }
  function randomInt(min, max) {
    return min + Math.random() * (max - min + 1);
  }
  function degreesToRads(degrees) {
    return degrees / 180 * Math.PI;
  }


});
