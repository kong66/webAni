jQuery(function($){

  var $text = $('.text'),
      bgs=['bg1.jpg','bg2.jpg','bg3.jpg'],
      in_anis=['fly-in','blink-in'],
      out_anis=['fly-out','blink-out'],
      $bg = $('.bg'),
      wordsNum=1000,
      cur = 2,
      ani_index = 1,
      inAni = 0,
      finishNum=0;


  init();

  function init(){
    var i,str="",
        temp = $("<span>KONG66</span>"),
        $new;
    for(i=0;i<wordsNum;++i){
      $new = temp.clone();
      $new.on('animationend',onAnimationFinish);
      $text.append($new);
    }
    $text.on('click',onClickText);
    setBackground();
  }
  function onClickText(){
    if(!inAni){
      setAllAni();
      inAni = 1;
      if(++cur==bgs.length){
        cur = 0;
        if(++ani_index == in_anis.length){
          ani_index = 0;
        }
      }
      $text.addClass(out_anis[ani_index]);
    }
  }

  function onAnimationFinish(){
    console.log(finishNum);
    if(++finishNum == wordsNum){
      finishNum = 0;
      if(inAni==1){
        setAllAni();
        $text.removeClass(out_anis[ani_index]);
        $text.addClass(in_anis[ani_index]);
        inAni = 2;
        setBackground();
      }else if(inAni==2){
        setAllAni();
        $text.removeClass(in_anis[ani_index]);
        inAni = 0;
      }
    }
  }
  function setBackground(){
    $bg.css({backgroundImage:"url("+bgs[cur]+")"});
  }

  function getRandomInt(s,e){
    return s+Math.round(Math.random()*(e-s));
  }
  function setAllAni(){
    $('.text span').each(function(){
      setAni($(this));
    });
  }
  function setAni($word){
    $word.css({
      animationDelay:(Math.random()*2)+"s",
    });
  }


});
