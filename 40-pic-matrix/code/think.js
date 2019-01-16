jQuery(function($){
  var $bg = $('.bg'),
      $box = $('.box'),
      pieces=[],
      side = 20,
      bgs=['bg2.jpg','bg3.jpg','bg1.jpg'];

  init();
  // changeBG();
  // setDelay();
  function changeBG(){
    var down = $('.down');
    // down.css({backgroundImage:"url("+bgs[1]+")"});
  }
  $box.on('click',function(e){
    var c = $(e.target);
    var h = c.parent().attr('i')*1;
    var v = c.parent().attr('j')*1;
    console.log('h,v='+h+" "+v);
    var t = 0;
    q = [];
    for(i=0;i<$box.nw;++i){

    }
  });
  function setDelay(){
    var t = 0;
    for(var i=0;i<$box.nw;++i){
      t += 0.05;
      for(var j=0;j<$box.nh;++j){
        setPieceDelay(pieces[i*$box.nw+j],t);
      }
    }
  }
  function setPieceDelay($piece,t){
    $piece.up.css({animationDelay:t+"s"});
    $piece.down.css({animationDelay:t+"s"});
    console.log($piece.attr('test')+"="+t);
  }

  function init(){
    var i,j,left,top,piece,up,down;
    $box.nw = Math.ceil($box.width()/side);
    $box.nh = Math.ceil($box.height()/side);
    for(i=0;i<$box.nw;++i){
      for(j=0;j<$box.nh;++j){
        piece = $('<div class="piece"></div>');
        up = $('<div class="up"></div>');
        down = $('<div class="down"></div>');
        left,top;
        left = j*side;
        top = i*side;
        piece.attr('i',i);
        piece.attr('j',j);
        up.css({
          backgroundPosition:(-left)+"px "+(-top)+"px",});
        down.css({backgroundPosition:(-left)+"px "+(-top)+"px",});
        piece.css({
          left:left,
          top:top,
          width:side,
          height:side,
        });
        $box.append(piece);
        piece.append(up);
        piece.append(down);
        piece.up = up;
        piece.down = down;
        piece.i = i;
        piece.j = j;
        if(!pieces){
          pieces = [];
        }
        if(!pieces[i]){
          pieces[i] = [];
        }
        pieces[i][j]= piece;
      }
    }

  }


});
