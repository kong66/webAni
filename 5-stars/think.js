jQuery(function($){
	var $sky = $('.sky'),
			$win = $(window),
			$star = $('.star'),
			w,
			h,
			period = 5,
			colors=["#78b6e3","#fff","#fffda8","#fedc00","#db7000","#ad3406"];
	$win.on('resize',onResize);
	refreshWH();
	createStarEles();

	function onResize(){
		refreshWH();
	}
	function refreshWH(){
		w = $win.width();
		h = $win.height();
	}
	function createStarEles(){
		var i,
				$stars;
		for(i=0;i<30;++i){
			$sky.append($star.clone());
		}
		$stars = $('.star');
		$stars.each(function(){
			var $this = $(this);
			createStars($this);
			$this.on("animationend",onAniEnd);
		});
	}
	function createStars($s){
		var color,
				x,y,
				blur,
				spread,
				i,
				boxShadow ="",
				dur,
				begin,
				delay=0;
		for(i=0;i<30;++i){
			color =colors[Math.floor(Math.random()*colors.length)];
			x = parseInt(2*w*Math.random()-w/2);
			y = parseInt(2*h*Math.random()-h/2);
			blur = parseInt(10 * Math.random()+2);
			spread = parseInt(6* Math.random());
			if(i!=0){
				boxShadow += ",";
			}
			boxShadow += x +"px "+ y+"px "
				+ blur + "px "+color;
		}
		begin = parseFloat($s.attr('begin'));
		if(!begin){
			begin = getRandomTime();
			delay = begin;
		}
		dur = getRandomTime();
		$s.attr('begin',dur);
		dur += period - begin;
		$s.css({
			boxShadow:boxShadow,
			animationDuration:dur+"s",
			animationDelay:delay+"s",
		});
		$s.addClass('ani');

	}
	function getRandomTime(){
		return Math.floor(Math.random()*(period*10))/10;
	}
	function createShadow(){

	}
	function onAniEnd(e){
		$this = $(this);
		$this.removeClass('ani');
		e.target.offsetWidth;
		createStars($this);

		// window.setTimeout(function(){
		// 	createStars($this);
		// },0);
	}
});﻿
