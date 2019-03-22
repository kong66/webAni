var canvas,
    ctx,
    loadSpeed = 1,
    curValue=0,
    circleThick = 15,
    R = 80,
    w = 4*Math.PI/(3*R),
    fiSpeed= Math.PI/10;
    fi = 0;

init();
function init(){
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  window.onresize = resize;
  resize();
  updateAni();
  setInterval(updateAni, 30);
}
function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
function updateAni() {
  render();
}


function render(){
  curValue +=loadSpeed;
  if(curValue>100){
    curValue = 0;
    fi = 0;
  }
  renderBG();
  renderCircle();
  renderWave();
  renderText();
}
function renderBG(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function renderCircle(){
  ctx.save();
  var angle = curValue/100* Math.PI*2;
  ctx.lineWidth = circleThick;
  ctx.strokeStyle= '#22a7f0';
  ctx.shadowColor='rgba(34,167,250,0.9)';
  ctx.shadowBlur=curValue;
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height/2, R,
    -Math.PI/2, angle-Math.PI/2, false);
  ctx.stroke();
  ctx.restore();
}
function renderWave(){
  ctx.save();
  setCircleClip();
  fi += fiSpeed;
  drawWave(6,-w,fi,'rgba(34,167,250,0.9)');
  drawWave(8,w,fi,'rgba(0,0,255,0.5)');
  ctx.restore();
}

function setCircleClip(){
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height/2,
    R-circleThick/3*2,0,Math.PI*2, false);
  ctx.clip();
}
function drawWave(a,w,fi,color){
  var i,x,y,sx,sy
  ctx.lineWidth =1 ;
  ctx.strokeStyle= 'black';
  ctx.fillStyle= color;
  ctx.beginPath();
  sx = canvas.width/2 - R;
  sy = canvas.height/2 + R;
  ctx.moveTo(sx,sy);
  ctx.lineTo(sx,sy-curValue/100*2*R);
  for(i=0;i<R*2;++i){
    x = sx + i;
    y = a*Math.sin(w*i+fi)+sy-curValue/100*2*R;
    ctx.lineTo(x,y);
  }
  ctx.lineTo(sx+2*R,sy);
  ctx.closePath();
  ctx.fill();
}

function renderText(){
  ctx.save();
  ctx.fillStyle= 'orange';
  ctx.textAlign= 'center';
  ctx.textBaseline = 'middle'
  ctx.font= '30px impact';
  ctx.fillText(curValue+'%', canvas.width/2, canvas.height/2);
  ctx.restore();
}
