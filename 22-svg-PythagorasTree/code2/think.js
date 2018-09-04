jQuery(function($){
  var $tree = $('.tree'),
      $root = $('.root'),
      $win = $(window),
      $svg = $('svg'),
      rootPoints,
      treePoints,
      k = 4/5,
      angle = 40,
      ratio = 1/2,
      treeEle = [],
      layers = 10,
      svgNS=$('svg').attr('xmlns'),
      hue=0,
      timer=-1;

  init();

  $svg.on("mousemove",onMouseMove);
  $svg.on("click",refreshTreeHue);

  function onMouseMove(e){
    k = 8/10 - (e.clientY/$win.height())*6/10;
    ratio = 8/10 - (e.clientX/$win.width())*6/10;
    initRoot();
    createTreePoints(layers);
    refreshTreeXY();
  }

  function init(){
    initRoot();
    createTreePoints(layers);
    drawTree();
  }
  function initRoot(){
    var root,
        x1 = $root.attr("x1")*1,
        y1 = $root.attr("y1")*1,
        x2 = $root.attr('x2')*1,
        y2 = $root.attr('y2')*1;
    root = [  [x1,y1],
              [x2,y2]  ];
    treePoints = [];
    treePoints.push([root]);
  }
  function createTreePoints(n){
    var i,j,
        prevLayer,
        nextLayer,
        leaf,
        newLeafs,
        t1;
    t1 = (new Date()).getTime();
    for(i=0;i<n;++i){
      prevLayer = treePoints[treePoints.length-1];
      nextLayer = [];
      for(j=0;j<prevLayer.length;++j){
        leaf = prevLayer[j];
        newLeafs = getLeafCoordinate(leaf);
        nextLayer.push(newLeafs[0]);
        nextLayer.push(newLeafs[1]);
      }
      treePoints.push(nextLayer);
    }
    t2 = (new Date()).getTime();
    //console.log(t2 - t1);
  }
  function refreshTreeXY(){
    var i,j,leafXY;
    for(i=0;i<treePoints.length;++i){
      for(j=0;j<treePoints[i].length;++j){
        leafXY = treePoints[i][j];
        setLinePoint(treeEle[i][j],leafXY);
      }
    }
  }

  function refreshTreeHue(){
    if(timer>=0)
      return;
    var i,n=0;
    refreshHue();
    timer = window.setInterval(function(){
      for(i=0;i<treeEle[n].length;++i){
        refreshLeafHue(n,treeEle[n][i]);
      }
      if(++n>= treeEle.length){
        window.clearInterval(timer);
        timer = -1;
      }
    },200);
  }
  function refreshLeafHue(n,leafEle){
    leafEle.attr("stroke",getColorStr(n));
  }
  function getLeafCoordinate(leaf){
    var res,
        ax,ay,bx,by,dx,dy,cx,cy,ex,ey,
        ab_mod,bc_mod,bd_mod,be_mod,ed_mod,ec_mod,
        bex,bey,edx,edy,ecx,ecy,
        abx,aby,bdx,bdy,bcx,bcy;
    ax = leaf[0][0];
    ay = leaf[0][1];
    bx = leaf[1][0];
    by = leaf[1][1];
    abx = bx - ax;
    aby = by - ay;
    ab_mod = Math.sqrt(abx*abx + aby*aby);
    bd_mod = bc_mod = ab_mod*k;

    be_mod = bd_mod*Math.cos(Math.PI*angle*(1-ratio)/180);
    bex = abx*be_mod/ab_mod;
    bey = aby*be_mod/ab_mod;
    ed_mod= bd_mod*Math.sin(Math.PI*angle*(1-ratio)/180);
    edx = -bey*ed_mod/be_mod;
    edy = bex*ed_mod/be_mod;
    bdx = bex + edx;
    bdy = bey + edy;
    dx = bx + bdx;
    dy = by + bdy;

    be_mod = bd_mod*Math.cos(Math.PI*angle*ratio/180);
    bex = abx*be_mod/ab_mod;
    bey = aby*be_mod/ab_mod;
    ec_mod= bd_mod*Math.sin(Math.PI*angle*ratio/180);
    ecx = bey*ec_mod/be_mod;
    ecy = -bex*ec_mod/be_mod;
    bcx = bex + ecx;
    bcy = bey + ecy;
    cx = bx + bcx;
    cy = by + bcy;

    res = [[[bx,by],[cx,cy]],
            [[bx,by],[dx,dy]]];
    return res;
  }
  function drawTree(){
    var i,j,layer,leaf;
    refreshHue();
    treeEle = [];
    for(i=0;i<treePoints.length;++i){
      layer = treePoints[i];
      treeEle.push([]);
      for(j=0;j<layer.length;++j){
        treeEle[i].push(drawLine(layer[j],i));
      }
    }
  }
  function drawLine(leafXY,layerN){
    var line,$p;
    line = document.createElementNS(
      svgNS,"line");

    $p = $(line);
    setLinePoint($p,leafXY);
    $p.attr("stroke",getColorStr(layerN));
    $tree.append($p);
    return $p;
  }
  function getColorStr(layerN){
    var lightness = layerN /layers*80+10;
    return "hsl("+hue+",100%,"+lightness+"%)";
  }
  function refreshHue(){
    hue = Math.round(Math.random()*360);
  }
  function setLinePoint($p,leafXY){
    $p.attr("x1",leafXY[0][0]+"");
    $p.attr("y1",leafXY[0][1]+"");
    $p.attr("x2",leafXY[1][0]+"");
    $p.attr("y2",leafXY[1][1]+"");
  }

});
