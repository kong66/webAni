jQuery(function($){

    var $numbers,time;
    init();
    function init(){
      time = [0,0,0,0,0];
      $numbers = $('.wheel.number');
      $numbers.find('.cell.down')
              .on("animationend",onfinish);
      window.setInterval(refreshTime,1000);
      // $(document).on('click',refreshTime);
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
      $text = $number.find('.up .text');
      $text.text(num+"");
      $number.addClass('active');
    }
    function onfinish(){
      var $up,
          $middle,
          $down,
          $number = $(this).closest('.wheel');
      $number.removeClass('active');
      $up = $number.find('.up');
      $middle = $number.find('.middle');
      $down = $number.find('.down');
      $up.removeClass('up').addClass('middle');
      $middle.removeClass('middle').addClass('down');
      $down.removeClass('down').addClass('up');
    }


});
