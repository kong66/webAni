jQuery(function($){
	var $btnGroup = $('.btn-group'),
			$cube = $('.cube'),
			$dice = $('.dice');
	$btnGroup.on('click',onclick_btn);
	$cube.on('transitionend',onAniEnd);

	function onclick_btn(e){
		var point,
				$btn;
		if(!$dice.hasClass('ani') && e.target.tagName =="BUTTON"){
			$btn = $(e.target);
			point = parseInt($btn.attr('point'));
			if(setPoint(point)){
				$dice.addClass('ani');
			}
		}
	}
	function setPoint(point){
		var prePoint,
				pointStr,
				num;
		pointStr = $cube.attr('point').match(/\d/);
		num = pointStr && pointStr.length>0 && pointStr[0];
		prePoint = parseInt(num);
		if(prePoint != point){
			$cube.attr("point","p"+point);
			return true;
		}else {
			return false;
		}
	}
	function onAniEnd(e){
		$dice.removeClass('ani');
	}

});
