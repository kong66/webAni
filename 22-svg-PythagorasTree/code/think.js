jQuery(function($){
  var $tree = $('.tree'),
      $root = $('.root'),
      tree =[],
      k = 2/5,
      svgNS=$('svg').attr('xmlns');//"http://www.w3.org/2000/svg";

  init();

  function init(){
    var root,
        x = $root.attr("x")*1,
        y = $root.attr("y")*1,
        width = $root.attr('width')*1,
        height = $root.attr('height')*1;
    root = [  [x,y],
              [x+width,y],
              [x+width,y+height],
              [x,y+height]  ];
    tree.push([root]);
    createTree(13);
    //drawTree();
    drawTreeAni();
    //console.log(tree);
  }
  function createTree(n){
    var i,j,
        layer,
        leaf,
        newLeafs,
        newLayer;
    for(i=0;i<n;++i){
      layer = tree[tree.length-1];
      newLayer = [];
      for(j=0;j<layer.length;++j){
        leaf = layer[j];
        newLeafs = createNewLeaf(leaf);
        newLayer.push(newLeafs[0]);
        newLayer.push(newLeafs[1]);
      }
      tree.push(newLayer);
    }
  }
  function createNewLeaf(leaf){
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
    //ad_mod2 = adx*adx + ady*ady;
    dbx = bx - dx;
    dby = by - dy;
    db_mod = Math.sqrt(dbx*dbx + dby*dby);
    //db_mod2 = dbx*dbx + dby*dby;
    cd_mod = Math.sqrt(ad_mod * db_mod);
    //cd_mod = Math.pow(ad_mod2 * db_mod2,1/4);
    cx = dx + (+aby)/ab_mod*cd_mod;
    cy = dy + (-abx)/ab_mod*cd_mod;
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
    return res;
  }

  function drawTree(){
    var i,j,layer,leaf;
    for(i=0;i<tree.length;++i){
      layer = tree[i];
      for(j=0;j<layer.length;++j){
        leaf = layer[j];
        drawPolygon(leaf);
      }
    }
  }
  function drawTreeAni(){
    var i=0,timer;
    timer = window.setInterval(function(){
      drawTree_layer(i);
      if(i==tree.length-1){
        window.clearInterval(timer);
        timer = 0;
      }else{
        ++i;
      }
    },1000);
  }
  function drawTree_layer(n){
    var layer = tree[n];
    for(j=0;j<layer.length;++j){
      leaf = layer[j];
      drawPolygon(leaf);
    }
  }

  function drawPolygon(leaf){
    var polygon,points,i;
    polygon = document.createElementNS(
      svgNS,"polygon");
    points ="";
    for(i=0;i<leaf.length;++i){
      points+=leaf[i][0] + "," + leaf[i][1] +" ";
    }
    polygon.setAttribute("points",points);
    $tree.append($(polygon));
  }

});
