jQuery(function($){
	var $btns = $('.btn-group'),
			$cube = $('.cube'),
			$dice = $('.dice');
	$btns.on('click',onclick_btn);
	$cube.on('transitionend',onAniEnd);

	function onclick_btn(e){
		var point,
				prePoint,
				pointStr,
				num,
				$btn;
		if(!$dice.hasClass('ani') && e.target.tagName =="BUTTON"){
			$btn = $(e.target);
			point = parseInt($btn.attr('point'));
			pointStr = $cube.attr('point').match(/\d/);
			num = pointStr && pointStr.length>0 && pointStr[0];
			prePoint = parseInt(num);
			if(prePoint != point){
				$cube.attr("point","p"+point);
				$dice.addClass('ani');
				// console.log('ani');
			}
		}
	}
	function onAniEnd(e){
		// console.log("xxx");
		$dice.removeClass('ani');
	}

});
