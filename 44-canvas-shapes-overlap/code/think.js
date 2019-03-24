var canvas,
    ctx,
    fps = 6,
    oldTime,
    waitTime =0,
    shapes=[],
    cw, ch,
    shapeNum = 10;


function randomInt( min, max ) {
	return Math.round(randomFloat(min, max));
}
function randomFloat( min, max ) {
	return Math.random() * ( max - min ) + min;
}



function Shape( ) {
  this.points = [];
  this.createPoints = function() {
    var n,r,deg;
    this.points.length = 0;

    r = randomInt( 50,100 );
    n = randomInt(3,4);
    while(n--){
      deg = randomFloat( 0, Math.PI * 2 ),
      x = Math.round( Math.cos( deg ) * r ),
      y = Math.round( Math.sin( deg ) * r );
      this.points.push({
        x: x,
        y: y,
        deg: deg
      });
    }
    this.points.sort( this.sortByDegree );
  };
  this.sortByDegree = function(a,b){
    return ( a.deg - b.deg );
  };
  this.render = function() {
    var n = this.points.length - 1;
    ctx.save();
    ctx.translate( cw / 2, ch / 2 );
    ctx.beginPath();
    ctx.moveTo( this.points[n].x, this.points[n].y );
    while( n-- ) {
      ctx.lineTo( this.points[n].x, this.points[n].y );
    }
    ctx.closePath();

    ctx.fillStyle = 'hsla('
        +randomInt(0,360) +',20%, '
        + randomInt( 0, 100 ) + '%, '
        + randomFloat( 0.2, 0.8 ) + ')';
    ctx.fill();
    ctx.restore();
  };
}

function renderShapes(){
  var i,j,shape;
  for( j = 0; j < shapeNum; j++ ) {
    shape = shapes[j];
    shape.createPoints();
    shape.render();
  }
}

function createShapes(){
  var i,shape;
  for(i=0;i<shapeNum;++i){
    shapes.push(new Shape());
  }
}


function doAni() {
  var newTime;
  requestAniFrame( doAni );
  newTime = Date.now();
  waitTime += newTime - oldTime;
  oldTime = newTime;
  if( waitTime > 1000 / fps ) {
    waitTime -= 1000 / fps;
    renderBG();
    renderShapes();
  }
}

function renderBG(){
  ctx.clearRect( 0, 0, cw, ch );
}

function resize() {
  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
}
function init(){
  canvas = document.getElementById( 'canvas' ),
  ctx = canvas.getContext( '2d' ),
  window.onresize = resize;
  resize();
  createShapes();
  oldTime = Date.now();
  doAni();
}
init();
