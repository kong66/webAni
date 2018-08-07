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
        x = (e.pageX - svgL)/svgW*1000,
        y = (e.pageY - svgT)/svgH*1000;
        console.log("x,y:"+x+","+y);
        $newRipple = $ripple.clone();
        $ripples.append($newRipple);
        $newRipple.attr("transform","translate("+x+","+y+")");
        $ani = $newRipple.find('animate');
        for(i=0;i<$ani.length;++i){
          $ani[i].beginElement();
        }
        // $ani[0].onend = function(){
        //   $newRipple.remove();
        // }

  });

});
