jQuery(function($){

  var $text = $('.text');
  init();

  function init(){
    var i,str="",temp = $("<span>KONG66</span>");
    for(i=0;i<1000;++i){
      $text.append(temp.clone());
    }
    $('.text span').each(function(){
      setAni($(this));
    });
  }
  function getRandomInt(s,e){
    return s+Math.round(Math.random()*(e-s));
  }

  function setAni($word){
    $word.css({
      // animationDelay:(Math.random()*5+1)+"s",
      animationDelay:(Math.random()*2+1)+"s",
    });
  }


});
