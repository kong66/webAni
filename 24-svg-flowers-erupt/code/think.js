jQuery(function($){

  var svgNS=$('svg').attr('xmlns'),
      $svg = $('svg'),
      $root = $('.root'),
      frameTime = (1000/30).toFixed(2)*1,
      animals={},
      names=[],
      maxPolygonNum = 0,
      aniNum = 0,
      $flowers = [],
      timer=-1,
      $templates,
      minh,
      maxh,
      maxw,
      minw,
      x0,y0,
      colors=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#00bcd4","#03a9f4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722","#795548","#9e9e9e","#607d8b"];
var id = 10;
  init();

  function init(){
    initCurveParam();
    $svg.on('click',onClickSVG);
    loadTemplate();
  }
  function onClickSVG(){
    var $item;
    $item = cloneTemplate();
    actAni2($item);
  }
  function loadTemplate(){
    $templates = $('.template');
  }
  function initCurveParam(){
    minh = 0;
    maxh = 600;
    maxw = 600;
    minw = -600;
    x0 = 600;
    y0 = 800;
  }
  function getRandomTemplate(){
    var index = getRandomIndex($templates.length-1);
    return $($templates[index]);
  }
  function getRandomColor(){
    var index = getRandomIndex(colors.length-1);
    return colors[index];
  }
  function cloneTemplate(){
    var $tem = getRandomTemplate();
    var $newItem = $tem.clone();
    $root.append($newItem);
    $newItem.attr("fill",getRandomColor());
    $newItem.attr('id',++id);
    setFlyParams($newItem);
    return $newItem;
  }
  // y = a*(x-x0)*(x-x0-w) + y0;
  // a = 4*(y0-y)/(w*w)
  function setFlyParams($flower){

    var x0 = 600,
        y0 = 800,
        vx0 = getRandom(-0.15,0.15),//0.1
        vy0 = getRandom(-0.3,-0.6),//0.53332 6s
        g = 0.000177;
    $flower.moveInfo = new MoveInfo(x0,y0,vx0,vy0,g);
  }
  function MoveInfo(x0,y0,vx0,vy0,g){
    this.x0 = x0;
    this.y0 = y0;
    this.x = x0;
    this.y = y0;
    this.vx0 = vx0;
    this.vy0 = vy0;
    this.vy = vy0;
    this.t = 0;
    this.g = g;
    this.update = function(delta){
      this.t += delta;
      this.x = this.x0 + this.vx0* this.t;
      this.vy = this.vy0 + this.g*this.t;
      this.y = this.y0 + (this.vy0+this.vy)/2*this.t;
      //console.log('x,y='+this.x+" "+this.y);
    };
  }

  function actAni2($item){
    var x,
        y;
    window.setInterval(function(){
      $item.moveInfo.update(1000/30);
      x = $item.moveInfo.x;
      y = $item.moveInfo.y;
      $item.attr("transform","translate("+x+","+y+")");
      //console.log($item.attr('id'));
    },1000/30);
  }


  function getRandom(begin,end){
    return begin + Math.random()*(end-begin);
  }
  function getRandomIndex(max){
    return Math.round(Math.random()*max);
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
});
