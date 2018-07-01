jQuery(function($){
  var $svgEle = $('svg text'),
      $pathAni = $('svg defs path animate'),
      inAni = false;

  $svgEle.on(
    'mouseover',
    function onmouseover(e){
      // console.log("mouseOver");
      $pathAni[0].beginElement();
    });

  $svgEle.on(
    'mouseout',
    function onmouseout(e){
      // console.log("mouseOut");
      // $pathAni[0].endElement();
    });

  $pathAni[0].onend = function(){
    // console.log("onend");
  };
  $pathAni[0].onbegin = function(){
    // console.log("onbegin");
  };





});
