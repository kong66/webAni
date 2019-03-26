var canvas,
    ctx,
    data,
    w,h,
    text="KONG66";
    var index = 0;
    var offsetX = 10;
    flag = false;

init();
function init(){
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  window.onresize = resize;
  resize();
  update();
  setInterval(function(){
    flag = !flag;
  },2000);
}

function resize() {
	w = canvas.width = window.innerWidth;
	h = canvas.height = window.innerHeight;
  data = ctx.createImageData(w, h);
}
function noise() {
  var i,
      buff = data.data,
      n = buff.length;
  for(i=0; i<n; i+=4){
    buff[i] = buff[i+1] = buff[i+2] = randomInt(0,255);
    buff[i+3] = 255;
  }
	ctx.putImageData(data, 0, 0);
}

function update() {
  ctx.clearRect(0,0,w,h);
  if(flag){
	   noise();
   }else{
     drawText();
   }
	requestAniFrame(update);
}

function drawText(){
  var i,rectH=[h/2-100,h/2+100];
  ctx.fillStyle= 'white';
  ctx.textAlign= 'center';
  ctx.textBaseline = 'middle';
  ctx.font= '200px impact';
  for(i=0;i<6;++i){
      rectH.push(randomInt(rectH[0],rectH[rectH.length-1]));
  }
  rectH.sort();
  for(i=0;i<rectH.length-1;++i){
    drawTextInRect(rectH[i],rectH[i+1]);
  }
}
function drawTextInRect(top,bottom){
  var offsetX = randomInt(-3,3);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0,top,w,bottom -top);
  ctx.clip();
  ctx.fillText(text, w/2+offsetX, h/2);
  ctx.restore();
}
