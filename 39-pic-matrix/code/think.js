jQuery(function($){
  var $bg = $('.bg'),
      $pieces = $('.pieces'),
      $allPieces,
      mx,my,
      index=0,
      bgs=['bg1.jpg','bg2.jpg','bg3.jpg'],
      aniState=0,
      aniCount = 0;

  init();
  function onclick(){
    if(!aniState){
      aniState++;
      setOutAni();
      $allPieces.addClass('out');
    }

  }
  function onTransitionEnd(){
    console.log("agdafads="+aniCount);
    if(++aniCount == $allPieces.length){
      if(aniState==1){
        aniState++;
        changeAllBG();
        setAllPiecesStyle();
        $allPieces.removeClass('out');
        $allPieces.addClass('in');
      }else if(aniState == 2){
        aniState = 0;
        $allPieces.removeClass('in');
      }
      aniCount = 0;
    }
  }
  function setOutAni(){
    $allPieces.each(function(){
      $(this).css({
        transitionDelay:Math.random()*1+"s",
        left:'-100%'
      });
    });
  }
  function setInAni(){
    $allPieces.each(function(){
      $(this).css({
        transitionDelay:Math.random()*1+"s",
      });
    });
  }
  function init(){
    createPieces();
    setAllPiecesStyle();
    changeAllBG();
    // $(document).on('mousemove',onmousemove);
    $(document).on('click',onclick);
  }
  function createPieces(){
    var $piece,i;
    for(i=0;i<100;++i){
      $piece = $('<div class="piece"></div>');
      $pieces.append($piece);
      $piece.on('transitionend',onTransitionEnd);
    }
    $allPieces=$('.piece');
  }
  function setAllPiecesStyle(){
    $allPieces.each(setPieceStyle);
  }
  function setPieceStyle(){
    var $this = $(this),
        w,h,top,left,z;
    w = randomInt(50,250);
    h = randomInt(50,250);
    top = randomInt(0,800-h);
    left = randomInt(0,1000-w);
    z = randomInt(0,10);
    $this.css({
      width:w+"",
      height:h+"",
      top:top+"px",
      left:left+"px",
      backgroundPosition:(-left)+"px "+(-top)+"px",
      transform:"translate("+z+"px)"
    });
    $this[0].top = top;
    $this[0].left = left;
    $this[0].z = z;
  }

  function randomInt(begin,end){
    return Math.round(Math.random()*(end-begin)+begin);
  }

  function changeAllBG(){
    $allPieces.each(changeBG);
    if(++index==bgs.length){
      index = 0;
    }
  }
  function changeBG(){
    var $this = $(this);
    $this.css({
      backgroundImage:"url("+bgs[index]+")"
    });
  }
  function onmousemove(e){
    mx = $(window).width()/2 - e.clientX ;
    my =   $(window).height()/2 -e.clientY ;
    $allPieces.each(move);
    console.log("x,y="+mx+" "+my);
  }
  function move(){
    var $this = $(this);
    //var left = parseFloat($this.css('left'));
    //var top = parseFloat($this.css('top'));
    var left = $this[0].left + mx * 0.01* $this[0].z;
    var top = $this[0].top+my *0.01 *$this[0].z;
    $this.css({
      top:top,
      left:left,
      // backgroundPosition:(-left)+"px "+(-top)+"px"
    });

  }

});
