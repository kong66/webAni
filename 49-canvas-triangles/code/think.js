var canvas,ctx,
    h,w,size,
    mouseTarget = {x:0,y:0},
    mousePos={x:0,y:0},
    triangles = [],
    grid = [],
    columns,rows,
    centerDIs;

function init() {
  canvas = document.createElement("canvas");
  document.getElementById("bg").appendChild(canvas);
  ctx = canvas.getContext("2d");
  window.onresize = resizeFunc;
  canvas.onmousemove = onmouseMove;
  resize();
  createGrid();
  createTriangles(grid);
  renderTriangles();
  drawText();
  requestInterval(update, 30);
}
function resizeFunc() {
  resize();
  createGrid();
  createTriangles(grid);
}
function resize() {
  h = canvas.height = window.innerHeight;
  w = canvas.width = window.innerWidth;
  size = w >= h ? w / 16 : h / 16;
  columns = Math.round( w / size+6);
  rows = Math.round( h / size+6);
  centerDIs = Math.sqrt(w*w/4+h*h/4);
  Point.prototype.dodgeThreshold= size*3;
}
function onmouseMove(e) {
  var rect = canvas.getBoundingClientRect();
  mouseTarget.x = e.clientX - rect.left,
  mouseTarget.y = e.clientY - rect.top
}
function updateMousePos(){
  mousePos.x += (mouseTarget.x-mousePos.x)/10;
  mousePos.y += (mouseTarget.y-mousePos.y)/10;
}
function update() {
  updateMousePos();
  renderPoints(grid);
  renderTriangles();
  drawText();
}

function Point(r,c){
  this.row = r;
  this.col = c;
  this.x;
  this.y;
  this.ox;
  this.oy;
  this.init = function(){
    var pos = this.createPos();
    this.x = pos.x;
    this.y = pos.y;
    this.ox = this.x;
    this.oy = this.y;
    this.startTime = (new Date()).getTime();
  };
  this.createPos = function(){
    return {
      x:(this.col-3+Math.random()*this.randomRatio)*size,
      y:(this.row-3+Math.random()*this.randomRatio)*size
    };
  };
  this.render = function(time){
    this.caculete_point_onMouse();
  };
  this.caculete_point_onMouse = function(){
    var dx,dy,d,offsetX,offsetY,dodgeDis;
    this.x = this.ox;
    this.y = this.oy;
    dx = this.x - mouseTarget.x;
    dy = this.y - mouseTarget.y;
    dy == 0 ? (dy = 0.001) : dy;
    dx == 0 ? (dx = 0.001) : dx;
    d = Math.sqrt(dx * dx + dy * dy);
    if (d < this.dodgeThreshold) {
      dodgeDis = (this.dodgeThreshold-d)*this.dodgeRatio;
      offsetX = dodgeDis * dx/d;
      offsetY = dodgeDis * dy/d;
      this.x += offsetX;
      this.y += offsetY;
    }
  };
  this.init();
}
Point.prototype.dodgeThreshold= 200;
Point.prototype.dodgeRatio = 0.3;
Point.prototype.randomRatio = 0.9;
function Triangle(p1,p2,p3){
    this.pointA = p1;
    this.pointB = p2;
    this.pointC = p3;
    this.hue;
    this.bright ;
    this.maxBrightness = 90;
    this.reset = function(){
      this.caculate_hue();
      this.caculate_brightness();
    };
    this.render =function(){
      this.draw();
    };
    this.draw = function(){
        var color;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.pointA.x,this.pointA.y);
        ctx.lineTo(this.pointB.x,this.pointB.y);
        ctx.lineTo(this.pointC.x,this.pointC.y);
        ctx.closePath();
        color = "hsl("+this.hue + ",80%,"+this.bright+"%)";
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    };
    this.caculate_hue = function(){
      this.hue = Math.round(Math.random()* 20 + 220);
    };
    this.caculate_brightness = function() {
      var i,dis,
          aveX=0,aveY = 0,
          points = [this.pointA,this.pointB,this.pointC];
      for (i = 0; i < points.length; i++) {
        aveX += points[i].x;
        aveY += points[i].y;
      }
      aveX /=3;
      aveY /=3;
      aveX -= w/2;
      aveY -= h/2;
      dis=Math.sqrt(aveX*aveX+aveY*aveY)/2;
      this.bright = Math.round(this.maxBrightness*(1-dis/centerDIs));
    };
    this.reset();
}
function createGrid() {
  var row,i,j;
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
function createTriangles(grid) {
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
function renderPoints() {
  var i,j;
  for (i = 0; i < grid.length; i++) {
    for (j = 0; j < grid[i].length; j++) {
      grid[i][j].render();
    }
  }
}
function renderTriangles() {
  var i;
  for (i=0;i < triangles.length;++i) {
    triangles[i].render();
  }
}
function drawText(){
  ctx.save();
  ctx.fillStyle= 'rgba(255,0,0,.3)';
  ctx.textAlign= 'center';
  ctx.textBaseline = 'middle';
  ctx.font= '200px impact';
  ctx.fillText('KONG66', canvas.width/2, canvas.height/2);
  ctx.restore();
}

init();
