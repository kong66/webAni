jQuery(function($){

  var $svg = $('svg'),
      $pieces = $('.text path'),
      $rect = $('rect'),
      delta = (1000/30).toFixed(2)*1,
      array = [];

  function AniInfo(t,tx,ty,sx,sy,r){
    this.tx = tx[0];
    this.ty = tx[0];
    this.sx = sx[0];
    $ele.sy = sy[0];
    $ele.r = r[0];
    $ele.aniDur = t;
    $ele.tx_del = ((tx[1] - tx[0])/t*delta);
    $ele.ty_del = ((ty[1] - ty[0])/t*delta);
    $ele.sx_del = ((sx[1] - sx[0])/t*delta);
    $ele.sy_del = ((sy[1] - sy[0])/t*delta);
    $ele.r_del = ((r[1] - r[0])/t*delta);
  }
  $pieces.each(function(index){
    //if(index==0)
    {
      var $this = $(this),
          tx = Math.random()*1200-600,
          ty = Math.random()*1200-600,
          deg = Math.random()*360,
          dur = Math.random()*1000+1000;
      array.push($this);
      // setAniInfo($this,dur,[0,tx],[0,ty],[1,1],[1,1],[0,deg]);
      setAniInfo($this,3000,[0,50],[0,50],[1,2],[1,2],[0,135]);
    }
  });
  window.setInterval(function(){
    for(var it in array){
      actAni(array[it]);
    }
  },delta);

  // setAniInfo($rect,3000,[0,50],[0,50],[1,2],[1,2],[0,135]);
  // window.setInterval(function(){
  //   actAni($rect)
  // },delta);

  function setAniInfo($ele,t,tx,ty,sx,sy,r){

    var d = $ele[0].getAttribute("d");
    var str = d.match(/\d+\.?\d*,\d+\.?\d*/);
    var c = str[0].split(",");
    //console.log(c);
    // var x = $ele[0].getAttribute("x")*1,
    //     y = $ele[0].getAttribute("y")*1,
    //     width = $ele[0].getAttribute("width")*1,
    //     height = $ele[0].getAttribute("height")*1;
    // //console.log("******"+x+","+y+",");
    // $ele.cx = x*1+width/2;
    // $ele.cy = y*1+height/2;
    $ele.cx = c[0]*1;
    $ele.cy = c[1]*1;
    console.log("cx,cy="+$ele.cx+","+$ele.cy);
    $ele.tx = tx[0];
    $ele.ty = tx[0];
    $ele.sx = sx[0];
    $ele.sy = sy[0];
    $ele.r = r[0];
    $ele.aniDur = t;
    $ele.tx_del = ((tx[1] - tx[0])/t*delta);
    $ele.ty_del = ((ty[1] - ty[0])/t*delta);
    $ele.sx_del = ((sx[1] - sx[0])/t*delta);
    $ele.sy_del = ((sy[1] - sy[0])/t*delta);
    $ele.r_del = ((r[1] - r[0])/t*delta);
  }
  function actAni($ele){
    if($ele.aniDur<=0)
      return;
    $ele.aniDur -= delta;
    $ele.tx += $ele.tx_del;
    $ele.ty += $ele.ty_del;
    $ele.sx += $ele.sx_del;
    $ele.sy += $ele.sy_del;
    $ele.r  += $ele.r_del;
    setStyle($ele);
  }

  function setStyle($ele){

    style = getTranslateStyle($ele.tx,$ele.ty)
          + getScaleStyle($ele.cx,$ele.cy,$ele.sx,$ele.sy)
          + getRotateStyle($ele.cx,$ele.cy,$ele.r);
    //console.log(style);
    $ele.css("transform",style);
  }
  function getTranslateStyle(tx,ty){
    // tx = tx.toFixed(3);
    // ty = ty.toFixed(3);
    return "translate("+tx+"px,"+ty+"px)";
  }
  function getScaleStyle(cx,cy,sx,sy){
    var tx = -cx*(sx - 1),
        ty = -cy*(sy - 1);

    // tx = tx.toFixed(3);
    // ty = ty.toFixed(3);
    // sx = sx.toFixed(3);
    // sy = sy.toFixed(3);
    return " translate("+tx+"px,"+ty+"px) scale("+sx+","+sy+")";
  }
  function getRotateStyle(cx,cy,deg){
    // cx = cx.toFixed(3);
    // cy = cy.toFixed(3);
    // deg = deg.toFixed(3);
    return " translate("+cx+"px,"+cy
      +"px) rotate("+deg+"deg) "
      +" translate("+(-cx)+"px,"+(-cy)+"px)";
  }
});
