jQuery(function($){
  var x,y,
      drag=false,
      $circles = $('.trails'),
      $temp = $('.circle.template');

  $(document).on('mousedown',mousedown);
  $(document).on('mouseup',mouseup);
  $(document).on('mousemove',mousemove);
  createSnow();

  function mousedown(e){
    drag = true;
  }

  function mousemove(e){
    if(drag){
      x = e.clientX;
      y = e.clientY;
      var $new = $temp.clone();
      $circles.append($new);
      $new.removeClass('template');
      $new.css({
        left:x+"px",
        top:y+"px"
      });
      $new.on('animationend',onAniFinished);
    }
  }

  function mouseup(){
    drag = false;
  }

  function onAniFinished(){
    $(this).remove();
  }

  function createSnow(){
    var i,snow,snowflake,temp,level;
    snow = $('.snow');
    temp = snow.children(':first');
    for(i=0;i<300;++i){
      snowflake = temp.clone();
      snow.append(snowflake);
      level = 1+Math.round(Math.random()*4);
      snowflake.addClass('level'+level);
      snowflake.css({
        top:-(50+Math.random()*150)+"%",
        left:Math.random()*100+"%",
        animationDuration:(30/(level*2)+Math.random()*3)+"s",
      });
    }
  }

});
