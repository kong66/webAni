jQuery(function($){
  var $tree = $('.tree'),
      $root = $('.root'),
      $win = $(window),
      $svg = $('svg'),
      rootPoints,
      treePoints,
      k = 2/5,
      treeEle = [],
      layers = 12,
      svgNS=$('svg').attr('xmlns'),
      hue=0,
      timer=-1;

  init();

  $svg.on("mousemove",onMouseMove);
  $svg.on("click",refreshTreeHue);

  function onMouseMove(e){
    k = 8/10 - (e.clientX/$win.width())*6/10;
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
        x = $root.attr("x")*1,
        y = $root.attr("y")*1,
        width = $root.attr('width')*1,
        height = $root.attr('height')*1;
    root = [  [x,y],
              [x+width,y],
              [x+width,y+height],
              [x,y+height]  ];
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
    console.log(t2 - t1);
  }
  function refreshTreeXY(){
    var i,j,leafXY;
    for(i=0;i<treePoints.length;++i){
      for(j=0;j<treePoints[i].length;++j){
        leafXY = treePoints[i][j];
        refreshLeafXY(i,j,leafXY);
      }
    }
  }
  function refreshLeafXY(i,j,leafXY){
    treeEle[i][j].attr("points",getPointsStr(leafXY));
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
    leafEle.attr("fill",getColorStr(n));
  }
  function getLeafCoordinate(leaf){
    var res,
        ax,ay,bx,by,cx,cy,dx,dy,ex,ey,fx,fy,gx,gy,hx,hy,
        abx,aby,adx,ady,dbx,dby,
        ab_mod,ad_mod,db_mod,cd_mod,
        acx,acy,cex,cey,
        bcx,bcy,cgx,cgy;
    ax = leaf[0][0];
    ay = leaf[0][1];
    bx = leaf[1][0];
    by = leaf[1][1];
    dx = ax + (bx - ax)*k;
    dy = ay + (by - ay)*k;
    abx = bx - ax;
    aby = by - ay;
    ab_mod = Math.sqrt(abx*abx + aby*aby);
    adx = dx - ax;
    ady = dy - ay;
    ad_mod = Math.sqrt(adx*adx + ady*ady);
    dbx = bx - dx;
    dby = by - dy;
    db_mod = Math.sqrt(dbx*dbx + dby*dby);
    cd_mod = Math.sqrt(ad_mod * db_mod);
    if(true){
      if(ab_mod>0.1){
        cx = dx + (+aby)/ab_mod*cd_mod;
        cy = dy + (-abx)/ab_mod*cd_mod;
      }else{
        if(ad_mod>db_mod){
          cx = bx;
          cy = by;
        }else{
          cx = ax;
          cy = ay;
        }
      }
      acx = cx - ax;
      acy = cy - ay;
      cex = acy;
      cey = -acx;
      ex = cx + cex;
      ey = cy + cey;
      fx = ax + cex;
      fy = ay + cey;
      bcx = cx - bx;
      bcy = cy - by;
      cgx = -bcy;
      cgy = bcx;
      gx = cx + cgx;
      gy = cy + cgy;
      hx = bx + cgx;
      hy = by + cgy;
      res= [  [[fx,fy],[ex,ey],[cx,cy],[ax,ay]],
              [[gx,gy],[hx,hy],[bx,by],[cx,cy]]   ];
    }else{
      res=[ [[0,0],[0,0],[0,0],[0,0]],
            [[0,0],[0,0],[0,0],[0,0]],   ];
    }
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
        treeEle[i].push(drawPolygon(layer[j],i));
      }
    }
  }
  function drawPolygon(leafXY,layerN){
    var polygon,points,$p;
    polygon = document.createElementNS(
      svgNS,"polygon");
    $p = $(polygon);
    points = getPointsStr(leafXY);
    $p.attr("points",points);
    $p.attr("fill",getColorStr(layerN));
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
  function getPointsStr(leafXY){
    var n,points="";
    for(n=0;n<leafXY.length;++n){
      points+=leafXY[n][0] + "," + leafXY[n][1] +" ";
    }
    return points;
  }

});
