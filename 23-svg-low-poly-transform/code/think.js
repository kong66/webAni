jQuery(function($){

  var svgNS=$('svg').attr('xmlns'),
      $svg = $('svg'),
      frameTime = (1000/30).toFixed(2)*1,
      animals={},
      names=[],
      maxPolygonNum = 0,
      aniNum = 0,
      $polygons = [],
      emptyPolygon = {color:0,points:[0,0,0,0,0,0]},
      timer=-1;

  init();

  function init(){
    loadAnimals();
    createPolygons();
    setPolygonsStyle();
    setPolygonsAniInfo();
    $svg.on('click',onClickSVG);
  }

  function onClickSVG(){
    if(timer<0){
      clearTimer();
      setPolygonsAniInfo();
      startAni();
    }
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
    var i;
    for(i=0;i<$polygons.length;++i){
      $polygons[i].timer_c = 0;
      $polygons[i].timer_p = 0;
    }
  }
  function actAni(){
    var i,end=0;
    for(i=0;i<$polygons.length;++i){
      if(actPolygonAni($polygons[i])){
        ++end;
      }
    }
    return end ==i;
  }
  function actPolygonAni($p){
    var c,p;
    c = actPolygonAni_c($p);
    p = actPolygonAni_p($p);
    return c&&p;
  }
  function actPolygonAni_c($p){
    if($p.timer_p< $p.dur_p){
      $p.attr("points",getPointsInterpolation($p));
      $p.timer_p += frameTime;
      return false;
    }else{
      return true;
    }
  }
  function actPolygonAni_p($p){
    if($p.timer_c< $p.dur_c){
      $p.attr("fill",getColorInterpolation($p));
      $p.timer_c += frameTime;
      return false;
    }else{
      return true;
    }
  }

  function getPointsInterpolation($p){
    var i,point,curPoints=[];
    for(i=0;i<$p.from.points.length;++i){
      point = interpolate(
        $p.from.points[i],
        $p.to.points[i],
        $p.timer_p,
        $p.dur_p
      );
      curPoints.push(point);
    }
    return curPoints.join(',');
  }
  function getColorInterpolation($p){
    var res;
    res = interpolate(
            $p.from.color,
            $p.to.color,
            $p.timer_c,
            $p.dur_c);
    return intToColor(res);
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
    var i,j,$p,$from,$to,cur,next;
    cur = getCurAnimal();
    next = getNextAnimal();
    for(i=0;i<$polygons.length;++i){
      $p = $polygons[i];
      if(i<cur.length){
        $from = cur[i];
      }else{
        $from = cur[getRandomIndex(cur.length-1)];
      }
      if(i<next.length){
        $to = next[i];
      }else{
        $to = next[getRandomIndex(next.length-1)];
      }

      setPolygonAniInfo($p,$from,$to);
    }
  }
  function setPolygonAniInfo($p,$from,$to){
    $p.from = $from;
    $p.to = $to;
    $p.timer_c = 0;
    $p.timer_p = 0;
    $p.dur_c = getRandom(100,500);
    $p.dur_p = getRandom(1000,2000);
  }

  function setPolygonsStyle(){
    var animal,i,j,$p,$a;
    animal = getCurAnimal();
    for(i=0,j=0;i<$polygons.length;++i,++j){
      $p = $polygons[i];
      if(j< animal.length){
        $a = animal[j];
      }else{
        $a = animal[Math.round(Math.random()*(animal.length-1))];
      }
      setPolygonStyle($a,$p);
    }
  }
  function setPolygonStyle($a,$p){
    $p.attr("fill",intToColor($a.color));
    $p.attr("points",$a.points.join(','));
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
    var $animals = $('def .animal'),
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
