jQuery(function($){

    var $bgBlend = $('.background-blend'),
        $mixpic = $('.mix-blend'),
        exchange_a = false,
        exchange_b = false,
        $firstImg = $('img:first-child'),
        $lastImg = $('img:last-child'),
        $selectBG = $('select.bg'),
        $selectPic = $('select.mix');

    $selectBG.on('change',onchange_blend);
    $selectPic.on('change',onchange_mix);
    $('input.a').on('change',onchebox_change_a);
    $('input.b').on('change',onchebox_change_b);

    function onchange_blend(e){
      refreshBG(e.target.value);
    }
    function onchange_mix(e){
      refreshPic(e.target.value);
    }
    function onchebox_change_a(e){
      exchange_a = e.target.checked;
      if(exchange_a){
        $bgBlend.removeClass('exchange');
      }else{
        $bgBlend.addClass('exchange');
      }
    }
    function onchebox_change_b(e){
      exchange_b = e.target.checked;
      if(exchange_b){
        $mixpic.removeClass('exchange');
      }else{
        $mixpic.addClass('exchange');
      }
      refreshPic();
    }
    function refreshBG(value){
      value = value || $selectBG[0].value;
      $bgBlend.css('background-blend-mode',value);
    }
    function refreshPic(value){
      value = value || $selectPic[0].value;
      if(exchange_b){
        $firstImg.css('mix-blend-mode',value);
        $lastImg.css('mix-blend-mode','normal');
      }else {
        $lastImg.css('mix-blend-mode',value);
        $firstImg.css('mix-blend-mode','normal');
      }
    }

});
