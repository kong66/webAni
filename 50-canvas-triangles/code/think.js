// window.requestAnimFrame = (function() {
//   return (
//     window.requestAnimationFrame ||
//     window.webkitRequestAnimationFrame ||
//     window.mozRequestAnimationFrame ||
//     window.oRequestAnimationFrame ||
//     window.msRequestAnimationFrame ||
//     function(/* function */ callback, /* DOMElement */ element) {
//       window.setTimeout(callback, 1000 / 60);
//     }
//   );
// })();
//
// window.requestTimeout = function(fn, delay) {
//   if (
//     !window.requestAnimationFrame &&
//     !window.webkitRequestAnimationFrame &&
//     !(
//       window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame
//     ) && // Firefox 5 ships without cancel support
//     !window.oRequestAnimationFrame &&
//     !window.msRequestAnimationFrame
//   )
//     return window.setTimeout(fn, delay);
//
//   var start = new Date().getTime(),
//     handle = new Object();
//
//   function loop() {
//     var current = new Date().getTime(),
//       delta = current - start;
//
//     delta >= delay ? fn.call() : (handle.value = requestAnimFrame(loop));
//   }
//
//   handle.value = requestAnimFrame(loop);
//   return handle;
// };
//
// window.requestInterval = function(fn, delay) {
//   var requestAnimFrame = (function() {
//       return (
//         window.requestAnimationFrame ||
//         function(callback, element) {
//           window.setTimeout(callback, 1000 / 60);
//         }
//       );
//     })(),
//     start = new Date().getTime(),
//     handle = {};
//   function loop() {
//     handle.value = requestAnimFrame(loop);
//     var current = new Date().getTime(),
//       delta = current - start;
//     if (delta >= delay) {
//       fn.call();
//       start = new Date().getTime();
//     }
//   }
//   handle.value = requestAnimFrame(loop);
//   return handle;
// };


var canvas,ctx,h,w,size,
    randomRatio = 2,
    triangles = [],
    grid = [],
    columns,rows;



  function init() {
    canvas = document.createElement("canvas");
    document.getElementById("bg").appendChild(canvas);
    ctx = canvas.getContext("2d");
    window.onresize = resizeFunc;
    resize();
    createGrid();
    createTriangles();

    update();
    //requestInterval(update, 30);
  }
  function resizeFunc() {
    resize();
    createGrid();
    createTriangles();
  }

  init();
  function resize() {
    h = canvas.height = window.innerHeight;
    w = canvas.width = window.innerWidth;
    size = w >= h ? w / 8 : h / 8;
    columns = Math.round( w / size+6);
    rows = Math.round( h / size+6);
  }

  function Point(r,c){
    this.row = r;
    this.col = c;
    this.x;
    this.y;
    this.startX;
    this.startY;
    this.endX;
    this.endY;
    this.startTime;
    this.totalTime = 4+Math.random()*6;


    this.init = function(){
      var pos = this.createPos();
      this.x = pos.x;
      this.y = pos.y;
      this.startX = this.x;
      this.startY = this.y;
      pos = this.createPos();
      this.endX = pos.x;
      this.endY = pos.y;
      this.startTime = (new Date()).getTime();
    };


    this.createPos = function(){
      return {x:(this.col-3)*size + Math.random()*size*randomRatio,
              y:(this.row-3)*size + Math.random()*size*randomRatio};
    };
    this.render = function(time){
      var pos,dur;
      dur= (time - this.startTime)/1000;
      if(dur>=this.totalTime){
        this.startX = this.x = this.endX;
        this.startY = this.y = this.endY;
        pos = this.createPos();
        this.endX = pos.x;
        this.endY = pos.y;
        this.startTime =  time;
        this.totalTime = 4+Math.random()*6;
      }else{
        this.x = this.startX + (this.endX - this.startX)*dur/this.totalTime;
        this.y = this.startY + (this.endY - this.startY)*dur/this.totalTime;
      }
    };

    this.init();
  }
  function Triangle(p1,p2,p3){
      this.pointA = p1;
      this.pointB = p2;
      this.pointC = p3;
      this.hue;
      this.bright ;
      this.startHue;
      this.startBright;
      this.endHue = 180+Math.round(Math.random() * 20);
      this.endBright = 180+Math.round(Math.random() * 20);
      this.startTime;
      this.totalTime;

      this.reset = function(){
        this.startTime = (new Date()).getTime();
        this.totalTime = 0.1+Math.random()*2;
        this.hue = this.startHue = this.endHue;
        this.bright = this.startBright = this.endBright;
        this.endHue = 180+Math.round(Math.random() * 20);
        this.endBright = 25+Math.round(Math.random() * 25);
      };
      this.reset();
      this.draw = function(){
          var color;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(this.pointA.x,this.pointA.y);
          ctx.lineTo(this.pointB.x,this.pointB.y);
          ctx.lineTo(this.pointC.x,this.pointC.y);
          ctx.closePath();
          color = "hsl(" + this.hue + ",100%,"+this.bright+"%)";

          //console.log(color);
          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.stroke();
          ctx.fill();
          ctx.restore();
      };

      this.renderColor = function(t){
        var dur;
        dur = (t - this.startTime)/1000;
        if(dur>= this.totalTime){
          this.reset();
        }else{
          this.hue = this.startHue + (this.endHue - this.startHue)*dur/this.totalTime;
          this.bright = this.startBright + (this.endBright - this.startBright)*dur/this.totalTime;
        }
      };
      this.render = function(t){
        this.renderColor(t);
        this.draw();
      };

  }

  function renderPoints(t){
    var i,j;
    for(i=0;i<grid.length;++i){
      for(j=0;j<grid[i].length;++j){
        grid[i][j].render(t);
      }
    }
  }

  function createGrid() {
    var i,j;
    grid = [];
    for (i=0;i<rows;++i){
      for(j=0;j<columns;++j){
        if(j==0){
          grid[i]=[];
        }
        grid[i][j]=new Point(i,j);
      }
    }
  }

  function createTriangles() {
    var i,j,row,col,point1,point2,point3,point4;
    triangles = [];
    for (i = 0; i < rows-1; i ++) {
      for (j = 0; j < columns-1; j ++) {

        point1 = grid[i][j];
        point2 = grid[i+1][j];
        point3 = grid[i+1][j+1];
        point4 = grid[i][j+1];

        triangles.push(new Triangle(point1,point2,point4));
        triangles.push(new Triangle(point2,point3,point4));

      }
    }
  }


  function renderTriangles(t) {
    var i;
    for (i=0;i < triangles.length;++i) {
      triangles[i].render(t);
    }
  }

  function drawText(){
    ctx.save();
    ctx.fillStyle= 'rgba(255,255,255,.5)';
    ctx.textAlign= 'center';
    ctx.textBaseline = 'middle';
    ctx.font= '200px impact';
    ctx.fillText('KONG66', canvas.width/2, canvas.height/2);
    ctx.restore();
  }

  function update() {
    var t = (new Date()).getTime();
    renderPoints(t);
    renderTriangles(t);
    drawText();
    window.requestAnimationFrame(update);
  }
