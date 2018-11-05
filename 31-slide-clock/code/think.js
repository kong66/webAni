jQuery(function($){

    var $numbers,time;
    init();
    function init(){
      time = [0,0,0,0,0];
      $numbers = $('.number');
      $numbers.find('.card.after').on("animationend",onfinish);
      window.setInterval(refreshTime,1000);
      //$(document).on('click',refreshTime);
    }

    function refreshTime(){
      var t,h,m,s,nums=[],i,$number;
      t = new Date();
      h = t.getHours();
      m = t.getMinutes();
      s = t.getSeconds();

      nums = nums.concat(getNums(h),getNums(m),getNums(s));
      console.log(nums);
      for(i=0;i<nums.length;++i){
        if(nums[i]==time[i])
          continue;
        time[i]= nums[i];
        $number = $numbers.eq(i);
        refreshNumber($number,nums[i]);
        $number.addClass('active');
      }
    }

    function getNums(num){
      return [Math.floor(num/10),num%10];
    }

    function refreshNumber($number,num){
      var $text;
      $text = $number.find('.card.after .text span');
      $text.text(num+"");
      $number.addClass('active');
    }
    function onfinish(){
      var $a,$b,$number = $(this).closest('.number');
      $number.removeClass('active');
      $b = $number.find('.card.before');
      $a = $number.find('.card.after');
      $a.removeClass('after').addClass('before');
      $b.removeClass('before').addClass('after');
    }


});
