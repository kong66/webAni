jQuery(function($){
  var $bg = $('.bg'),
      $box = $('.box'),
      set,
      side = 50,
      bgs=['bg1.jpg','bg2.jpg','bg3.jpg','bg4.jpg','bg5.jpg'];

  init();

  function onclick(e){
    if($box.hasClass('fall')){
      return;
    }
    setAni();
    if(++$box.index==bgs.length){
      $box.index = 0;
    }
    $box.$pic.attr('src',bgs[$box.index]);
    $box.addClass('fall');
  }

  function setAni(){
    var i,j,t,z = $box.nh*$box.nw;
    for(i=0;i<$box.nw;++i){
      t = Math.random()*0.4;
      for(j=0;j<$box.nh;++j){
        t += Math.random()*0.4;
        set[j][i].css({
          animationDelay:t.toFixed(3)+"s,0s",
          transform:"rotate("+90*Math.random()+"deg)",
          transitionDelay:t.toFixed(3)+"s",
          zIndex:(z--)+""
        });
        // console.log("i,j="+i+" "+j+" "+t);
      }
    }
  }


  function onAnimationEnd(e){
    var piece;
    if(e.originalEvent.animationName == "fall"){
      piece = $(e.target);
      piece.css({transform:'rotate(0)'});
      if(++$box.counter==$box.total){
        $box.counter = 0;
        changeBG(set,bgs[$box.index]);
        $box.removeClass('fall');
      }
    }
  }
  function init(){
    $box.nw = Math.ceil($box.width()/side);
    $box.nh = Math.ceil($box.height()/side);
    $box.index = 0;
    $box.counter = 0;
    $box.total = $box.nw*$box.nh;
    $box.$set = $('.set');
    $box.$pic = $('.pic');
    $box.on('animationend',onAnimationEnd);
    $box.$pic.on('click',onclick);
    createPieces();
    changeBG(set,bgs[$box.index]);
  }
  function createPieces(){
    var i,j,piece,$before,$after;
    for(i=0;i<$box.nh;++i){
      for(j=0;j<$box.nw;++j){
        piece = $('<div class="piece"></div>');
        piece.css({
          left:j*side+"px",
          top:i*side+"px",
          width:side+"px",
          height:side+"px",
          backgroundPosition:(-j*side)+"px "+(-i*side)+"px",
          backgroundSize:$box.width()+"px "+$box.height()+"px"
        });
        $box.$set.append(piece);
        if(!set){
          set = [];
        }
        if(!set[i]){
          set[i] = [];
        }
        set[i][j]= piece;
        // piece.i = i;
        // piece.j = j;
        // piece.attr('i',i);
        // piece.attr('j',j);
        //console.log('i,j='+i+" "+j);
      }
    }
  }
  function changeBG(set,bg){
    var i,j;
    for(i=0;i<set.length;++i){
      for(j=0;j<set[i].length;++j){
        set[i][j].css({
          backgroundImage:"url("+bg+")"
        });
      }
    }
  }


});
