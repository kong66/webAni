jQuery(function($){
	var w,
			h,
			period = 5,
			colors=["#78b6e3","#fff","#fffda8","#fedc00","#db7000","#ad3406"];

	(function(){
		$(window).on('resize',onResize);
		refreshWH();
		createStars();
	})();

	function onResize(){
		refreshWH();
	}
	function refreshWH(){
		var $win = $(window);
		w = $win.width();
		h = $win.height();
	}
	function createStars(){
		var i,
				$sky = $('.sky'),
				$star = $('.star'),
				stars = [$star],
				item;

		for(i=0;i<30;++i){
			item = $star.clone();
			stars.push(item);
			$sky.append(item);
		}
		for(i=0;i<stars.length;++i){
			item = stars[i];
			setStar(item);
			item.on("animationend",onAniEnd);
		}
	}
	function setStar($s){
		setAni($s);
		setShadow($s);
		$s.addClass('ani');

	}
	function getRandomTime(){
		return Math.floor(Math.random()*(period*10))/10;
	}
	function setAni($s){
		var dur,
				begin,
				delay=0;
			// begin = parseFloat($s.attr('begin'));
			begin = $s.mybegin;
			if(!begin){
				begin = getRandomTime();
				delay = begin;
			}
			dur = getRandomTime();
			// $s.attr('begin',dur);
			$s.mybegin = dur;
			dur += period - begin;
			$s.css({
				animationDuration:dur+"s",
				animationDelay:delay+"s",
			});
	}
	function setShadow($s){
		var color,
				x,y,
				blur,
				spread,
				i,
				boxShadow ="";

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
		$s.css({boxShadow:boxShadow});
	}
	function onAniEnd(e){
		$this = $(this);
		$this.removeClass('ani');
		//**********方法1
		e.target.offsetWidth;
		//void element.offsetWidth;
		//**********方法2
		// window.setTimeout(function(){
		// 	setStar($this);
		// },0);
		setStar($this);
	}
});﻿
