jQuery(function($){

  var $svg = $('svg'),
      $ripple = $('#ripple'),
      $ripples = $('#ripples'),
      $doc = $(document),
      svgL = $svg.offset().left,
      svgT = $svg.offset().top,
      svgW = $svg.height(),
      svgH = $svg.width();


  $svg.on("click",function(e){
    var i,
        $ani,
        $newRipple,
        matrix = $svg[0].getScreenCTM().inverse(),
        svgPoint = $svg[0].createSVGPoint(),
        svgXY;
        svgPoint.x = e.clientX;
        svgPoint.y = e.clientY;
        svgXY = svgPoint.matrixTransform(matrix);

        console.log("x,y:"+e.clientX+","+e.clientY);
        console.log("px,py:"+svgXY.x+","+svgXY.y);

        $newRipple = $ripple.clone();
        $ripples.append($newRipple);
        $newRipple.attr("transform","translate("+svgXY.x+","+svgXY.y+")");
        $ani = $newRipple.find('animate');
        $newRipple.myEndAniNum = 0;
        $newRipple.myOnEnd = function(){
          if(++$newRipple.myEndAniNum==$ani.length){
            $newRipple.remove();
            console.log("ani end");
          }
          else{
            console.log("over****");
          }
        };
        for(i=0;i<$ani.length;++i){
          $ani[i].beginElement();
          $ani[i].onend= $newRipple.myOnEnd;
        }
  });

});
