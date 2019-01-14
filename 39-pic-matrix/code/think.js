jQuery(function($){
  var $bg = $('.bg'),
      $box = $('.box'),
      $allPieces,
      mx,my,
      index=0,
      bgs=['bg2.jpg','bg3.jpg','bg1.jpg'],
      aniState=0,
      aniCount = 0;

  init();
  function onclick(){
    if(!aniState){
      aniState++;
      $box.addClass('out');
    }
  }
  function onTransitionEnd(){
    if(++aniCount == $allPieces.length){
      if(aniState==1){
        aniState++;
        changeAllBG();
        setAllPiecesStyle();
        $box.removeClass('out');
        $box.addClass('in');
      }else if(aniState == 2){
        aniState = 0;
        $box.removeClass('in');
      }
      aniCount = 0;
    }
  }

  function init(){
    createPieces();
    setAllPiecesStyle();
    changeAllBG();
    $(document).on('mousemove',onmousemove);
    $(document).on('click',onclick);
  }
  function createPieces(){
    var $piece,i;
    for(i=0;i<160;++i){
      $piece = $('<div class="piece"></div>');
      $box.append($piece);
      $piece.on('animationend',onTransitionEnd);
    }
    $allPieces=$('.piece');
  }
  function setAllPiecesStyle(){
    var r=450,levels=5,nums,minR,maxR,w;
    nums = Math.floor($allPieces.length/levels);
    for(var i=0;i<levels;++i){
      for(var j=0;j<nums;++j){
        var $this = $($allPieces.get(i*nums+j));
        maxR = r/levels * (i+1);
        minR = r/levels * i;
        w = r/(i+1);
        setPieceStyle($this,minR,maxR,w,i);
      }
      console.log("minR,maxR,w=  "+minR+"   "+maxR+"   "+w);
    }
  }
  function setPieceStyle($this,minR,maxR,maxW,z){
    var deg,r,w,h,top,left,z;
    w = randomInt(maxW*0.8,maxW);
    h = randomInt(maxW*0.8,maxW);
    deg = randomInt(0,360);
    r = randomInt(minR,maxR);
    top = 400 + Math.sin(deg)*r - h/2;
    left = 500 + Math.cos(deg)*r - w/2;

    $this.css({
      width:w+"",
      height:h+"",
      top:top+"px",
      left:left+"px",
      backgroundPosition:(-left)+"px "+(-top)+"px",
      animationDelay:Math.random()*1+"s"
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
  }
  function move(){
    var $this = $(this);
    var left = $this[0].left + mx * 0.02 * $this[0].z;
    var top = $this[0].top + my * 0.02 * $this[0].z;
    $this.css({
      top:top,
      left:left,
      // backgroundPosition:(-left)+"px "+(-top)+"px"
    });

  }

});
