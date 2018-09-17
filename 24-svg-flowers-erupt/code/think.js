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
    var x0,y0,w,h,a;
    x0 = 600;
    y0=800;
    w =getRandom(minw,maxw);
    h = getRandom(minh,maxh);
    if(Math.abs(w)<1){
      a = 1;
    }else{
      a = 4*(y0-h)/(w*w);
    }
    console.log("w="+w+"  h="+h+"  a="+a);
    $flower.curve={
      x0:x0,
      y0:y0,
      w: w,
      h: h,
      a: a
    };

  }



  function actAni2($item){
    var x0 = $item.curve.x0,
        y0 = $item.curve.y0,
        a = $item.curve.a,
        w = $item.curve.w,
        x = x0,
        y = 0;

    window.setInterval(function(){
      if(w>0){
        x+=5;
      }else{
        x-=5;
      }
      y = a*(x-x0)*(x-x0-w) + y0;
      $item.attr("transform","translate("+x+","+y+")");
      //console.log($item.attr('id'));
    },1000/30);
  }

  function test(){
    var x= 600,y,
        $rect = $('rect');
    window.setInterval(function(){
      x+=5;
      y = 1/90*(x-600)*(x-1200) + 1000;
      $rect.attr("x",x);
      $rect.attr("y",y);

    },1000/30);
  }


  function startAni(){
    timer = window.setInterval(function(){
      if(actAni()){
        onAniEnd();
      }
    },frameTime);
  }
  function onAniEnd(){
    window.clearInterval(timer);
    timer = -1;
    if(++aniNum >= names.length){
      aniNum=0;
    }
  }
  function clearTimer(){
    var i,j;
    for(i=0;i<$polygons.length;++i){
      for(j=0;j<$polygons[i].aniArray.length;++j){
        $polygons[i].aniArray[j].clear();
      }
    }
  }
  function actAni(){
    var i,end=0;
    for(i=0;i<$polygons.length;++i){
      if(actPolygonAni($polygons[i])){
        ++end;
      }else{
        setPolygonStyle($polygons[i]);
      }
    }
    return end ==i;
  }
  function actPolygonAni($p){
    var endAni = true,i;
    for(i=0;i<$p.aniArray.length;++i){
      if(!actAniInfo($p.aniArray[i])){
        endAni = false;
      }
    }
    return endAni;
  }
  function actAniInfo(aniInfo){
    if(aniInfo.timer < aniInfo.dur + aniInfo.delay){
      if(aniInfo.timer> aniInfo.delay){
        aniInfo.cur = interpolate(aniInfo.begin,aniInfo.end,aniInfo.timer-aniInfo.delay,aniInfo.dur);
      }
      aniInfo.timer += frameTime;
      return false;
    }else{
      return true;
    }
  }

  function getCurAnimal(){
    return animals[names[aniNum]];
  }
  function getNextAnimal(){
    var i = aniNum;
    if(++i>= names.length){
      i=0;
    }
    return animals[names[i]];
  }
  function setPolygonsAniInfo(){
    var i,j,$p,from,to,cur,next;
    cur = getCurAnimal();
    next = getNextAnimal();
    for(i=0;i<$polygons.length;++i){
      $p = $polygons[i];
      if(i<cur.length){
        from = cur[i];
      }else{
        from = cur[getRandomIndex(cur.length-1)];
      }
      if(i<next.length){
        to = next[i];
      }else{
        to = next[getRandomIndex(next.length-1)];
      }
      setPolygonAniInfo($p,from,to);
    }
  }
  function setPolygonAniInfo($p,from,to){
    var i, info,dur_c,dur_p;
    $p.aniArray = [];
    dur_p = getRandom(1000,2000);
    dur_c = getRandom(100,500);
    info = new AniInfo(from.color,to.color,dur_c,dur_p/2);
    $p.aniArray.push(info);
    for(i=0;i<from.points.length;++i){
      info = new AniInfo(from.points[i],to.points[i],dur_p,0);
      $p.aniArray.push(info);
    }
  }
  function AniInfo(begin,end,dur,delay){
    this.begin = begin;
    this.cur = begin;
    this.end = end;
    this.dur = dur;
    this.delay = delay;
    this.timer = 0;
    this.clear = function(){
      this.timer = 0;
      this.cur = begin;
    }
  }

  function setPolygonsStyle(){
    for(i=0;i<$polygons.length;++i){
      setPolygonStyle($polygons[i]);
    }
  }
  function setPolygonStyle($p){
    $p.attr('points',getPointsStyle($p));
    $p.attr('fill',getColorStyle($p));
  }
  function getPointsStyle($p){
    var a=[],it,res = $p.aniArray.slice(1,7);
    for(it in res){
      a.push(res[it].cur);
    }
    return a.join(',');
  }
  function getColorStyle($p){
    var res = $p.aniArray[0].cur;
    return intToColor(res);
  }
  function intToColor(color){
    var n=0,str="",i=Math.pow(16,5);
    while(i>=1){
      n = Math.floor(color/i);
      str+=n.toString(16);
      color %=i;
      i/=16;
    }
    return "#"+str;
  }

  function createPolygons(){
    var i,
        $g = $('.show_group'),
        $p;
    for(i=0;i<maxPolygonNum;++i){
      $p = createPolygon($g);
      $g.append($p);
      $polygons.push($p);
    }
  }
  function createPolygon($g){
    var polygon,$p;
    polygon = document.createElementNS(svgNS,"polygon");
    $p = $(polygon);
    return $p;
  }

  function loadAnimals(){
    var $animals = $('defs .animal'),
        i;
    $animals.each(function(index){
      var $this = $(this),
          id = $this.attr('id'),
          $polygons = $this.find('polygon');
      names.push(id);
      animals[id] = [];
      if($polygons.length> maxPolygonNum){
        maxPolygonNum = $polygons.length;
      }
      $polygons.each(function(){
        var $polygon = $(this),
            color,
            points;
        color = getfillColor($polygon);
        points = getPoints($polygon);
        animals[id].push({
          color:color,
          points:points
        });
      });
    });

  }
  function getfillColor($polygon){
    var color;
    color = $polygon.attr("style")
              .match(/fill:#[a-fA-F0-9]+;/)[0];
    color = color.replace(/(fill:#)/,"")
              .replace(/;/,"");
    return parseInt(color,16);
  }
  function getPoints($polygon){
    var points;
    points = $polygon.attr("points").match(/-?[0-9]+/g);
    for(i in points){
      points[i] *=1;
    }
    return points;
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