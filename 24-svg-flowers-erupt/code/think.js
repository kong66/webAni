jQuery(function($){

  var svgNS=$('svg').attr('xmlns'),
      $svg = $('svg'),
      $root = $('.root'),
      frameTime = (1000/30).toFixed(2)*1,
      flowers = {},
      dots=[],
      shapes=[],
      $dot,
      timer=-1,
      templates={},
      aniElements=[],
      aniNum=0,
      flowerNum = 20,
      colors=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#00bcd4","#03a9f4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722","#795548","#9e9e9e","#607d8b"];
var id = 10;
  init();

  function init(){
    loadTemplate();
    $svg.on('click',onClickSVG);
  }
  function onClickSVG(e){
    var svgPos;
    svgPos = getSVGPos(e);
    createFireworks(svgPos);
    startAni();
  }

  function startAni(){
    if(aniElements.length>0 && timer==-1){
      timer = window.setInterval(actAni,frameTime);
    }
  }
  function stopAni(){
    if(aniElements.length == 0 && timer!=-1){
      window.clearInterval(timer);
      timer = 0;
    }
  }
  function actAni(){
    var i,item,finish;
    for(i=0;i<aniElements.length;++i){
      item = aniElements[i];
      finish = item.moveInfo.update(frameTime);
      setPos(item);
    }
    if(aniElements.length==0){
      console.log("*************");
      stopAni();
    }
  }
  function createFireworks(svgPos){
    var $flower,i;
    for(i=0;i<flowerNum;++i){
      $flower = getRandomFlower();
      setColor($flower);
      setFlyParams($flower,svgPos);
    }
  }
  function loadTemplate(){
    var i,$item,shape,$temps;
    $temps = $('.template');
    for(i=0;i<$temps.length;++i){
      $item = $($temps[i]);
      shape = $item.attr('shape');
      $item.shape = shape;
      if(!(shape in flowers)){
        flowers[shape] = [];
      }
      templates[shape] = $item;
      shapes.push(shape);
    }
  }

  function setPos($flower){
    var x,y,temp;
    x = $flower.moveInfo.x;
    y = $flower.moveInfo.y;
    $flower.attr("transform","translate("+x+","+y+")");
  }

  function setColor($flower){
    $flower.attr("fill",getRandomColor());
  }

  function setFlyParams($flower,svgPos){
    var x0 = svgPos.x,
        y0 = svgPos.y,
        vx0 = getRandom(-0.2,0.2),//0.1
        vy0 = getRandom(-0.2,0.2),//0.53332 6s
        g = 0.00015,
        delay = 0,
        dur = 6000;
    $flower.moveInfo = new MoveInfo(x0,y0,vx0,vy0,g,dur,delay);
  }
  function MoveInfo(x0,y0,vx0,vy0,g,dur,delay){
    this.x0 = x0;
    this.y0 = y0;
    this.x = x0;
    this.y = y0;
    this.vx0 = vx0;
    this.vy0 = vy0;
    this.vy = vy0;
    this.time = 0;
    this.g = g;
    this.dur = dur;
    this.delay = delay;
    this.update = function(delta){
      var finish = false;
      if(this.time < this.delay + this.dur){
        if(this.time > this.delay){
          this.time += delta;
          this.x = this.x0 + this.vx0* this.time;
          this.vy = this.vy0 + this.g*this.time;
          this.y = this.y0 + (this.vy0+this.vy)/2*this.time;
          //console.log('x,y='+this.x+" "+this.y);
        }
        this.time += delta;
      }else{
        finish = true;
      }
      return finish;
    };
    this.reset =function (x0,y0,vx0,vy0,g,dur,delay){
      this.x0 = x0;
      this.y0 = y0;
      this.x = x0;
      this.y = y0;
      this.vx0 = vx0;
      this.vy0 = vy0;
      this.vy = vy0;
      this.time = 0;
      this.g = g;
      this.dur = dur;
      this.delay = delay;
    };
  }
  function getRandomFlower(){
    var index,shape,temp,$flower;
    index = getRandomIndex(shapes.length-1);
    shape = shapes[index];
    if(flowers[shape].length>0){
      $flower = flowers[shape].pop();
    }else{
      $flower = templates[shape].clone();
    }
    $root.append($flower);
    aniElements.push($flower);
    return $flower;
  }
  function getRandomColor(){
    var index = getRandomIndex(colors.length-1);
    return colors[index];
  }
  function getRandom(begin,end){
    return begin + Math.random()*(end-begin);
  }
  function getRandomIndex(max){
    return Math.round(Math.random()*max);
  }
  function getSVGPos(e){
    var matrix,svgPoint,svgXY;
    matrix = $svg[0].getScreenCTM().inverse(),
    svgPoint = $svg[0].createSVGPoint(),
    svgXY;
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    svgXY = svgPoint.matrixTransform(matrix);
    return svgXY;
  }
  function interpolate(begin,end,t,dur){
    var k = t/dur,
        res;
    if(Math.abs(t-dur)<frameTime){
      res = end;
    }else{
      res = begin + (end-begin)*k;
    }
    return res;
  }

  function NodeList(){
    this.count = 0;
    this.head = node;
    this.tail = node;

    this.push =function(node){

    };
    this.remove =function(node){

    };
    this.
  }
  function Node(data){
    this.data = data;
    this.prev = null;
    this.next = null;
  }
});
