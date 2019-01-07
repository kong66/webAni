jQuery(function($){
  var x,y,
      drag=false,
      $circles = $('.trails'),
      $temp = $('.circle.template');

  $(document).on('mousedown',mousedown);
  $(document).on('mouseup',mouseup);
  $(document).on('mousemove',mousemove);

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


});
