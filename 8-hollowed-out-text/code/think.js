jQuery(
  function($){
    var $tex = $('svg'),
        $win = $(window),
        $doc = $(document),
        cw,
        ch,
        imgW,
        imgH;

    init();
    $win.on("resize",onResize);
    $doc.on("mousemove",onMouseMove);

    function onResize(){
      init();
    }
    function init(){
      cw = $win.width();
      ch = $win.height();
      imgW = $tex.css("background-size");
    }
    function onMouseMove(e){
      var x = e.clientX/cw*100,
          y = e.clientY/ch*100;
      console.log("x,y="+x+","+y);
      $tex.css(
        {
          backgroundPosition:x+"% "+ y+"%",
        }
      );
    }
  }
);
