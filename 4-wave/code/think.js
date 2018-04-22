jQuery(function($){
	var $bg = $('.bg'),
			$win = $(window),
			w,
			h;
	$win.on('resize',onResize);
	refreshWH();
	resetDivs();
	function onResize(){
		$bg.empty();
		refreshWH();
		resetDivs();
		console.log('n='+$('.bg div').length);
	}
	function refreshWH(){
		w = $win.width();
		h = $win.height();
	}
	function resetDivs(){
		var i,
				side = Math.min(w,h)/10,
				n;
		n = Math.floor(w/side) * Math.floor(h/side);
		
		for(i=0;i<n;++i){
			var $ele = $('<div></div>');
			$ele.css({
				width:w/10+"px",
				height:h/10+"px"
			});
			$bg.append($ele);
		}
	}
});﻿
