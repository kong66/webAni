$(function(){
	//************eye动画**************
	var $doc = $(document),
			$eyelids = $('.eyelid');


	(function(){
		$('body').on('mousemove',onMouseMove);
		$('body').on('click',blink);
		$eyelids.on("animationiteration",endBlink);
		blink();
	})();

	function blink(){
		$eyelids.css({animationPlayState:"running"});
	}
	function endBlink(){
		$eyelids.css({animationPlayState:"paused"});
	}
	function onMouseMove(e){
		$('.rim').each(function(){
			moveBall(e,$(this));
		});
		endTime = new Date();
	}
	function moveBall(e,$rim){
		var $ball,$eyelid,
				lidTop,
				ballR,rimR,
				scrollH,scrollW,
				rimLeft,rimTop,
				cx,cy,
				mouseDX,mouseDY,mouseDis,
				r,rx,ry,
				ballLeft,ballTop,
				ballX,ballY;

		$ball = $rim.find('.ball');
		$eyelid = $rim.find('.eyelid');
		rimR = $rim.width()/2,
		ballR = $ball.width()/2;
		//文档滚动偏移量
		scrollH = $doc.scrollTop();
		scrollW = $doc.scrollLeft();
		//文档坐标
		rimLeft = $rim.offset().left;
		rimTop = $rim.offset().top;
		//窗口坐标
		rimLeft -= scrollW;
		rimTop -= scrollH;
		//眼圈中点坐标
		cx = rimLeft + rimR;
		cy = rimTop + rimR;
		//眼睛中心指向鼠标的向量
		mouseDX = e.clientX - cx;
		mouseDY = e.clientY - cy;
		//向量长度
		mouseDis = Math.sqrt(mouseDX*mouseDX + mouseDY*mouseDY);
		//单位向量
		if(mouseDis>1){
			mouseDX /= mouseDis;
			mouseDY /= mouseDis;
		}else{
			mouseDX=0;
			mouseDY=0;
		}
		//眼珠离开中心距离，鼠标在外：眼球半径，在内：距离鼠标距离
		r = Math.min(rimR-ballR , mouseDis);
		//眼圈中心 到 眼珠的向量
		rx = r*mouseDX;
		ry = r*mouseDY;
		//眼珠中心坐标 = 中心坐标 + 眼珠向量
		ballX = cx + rx;
		ballY = cy + ry;
		//眼珠左上角坐标,如果居中，无需进行这步计算
		ballLeft = ballX - ballR;
		ballTop = ballY - ballR;
		//相对父对象坐标
		//left,top针对已定位父元素的内容定位，不包括border
		ballLeft -= rimLeft;
		ballTop -= rimTop;
		//设置css
		$ball.css({
					left:ballLeft+'px',
					top:ballTop+'px',
				});
		lidTop = Math.max(ballTop-ballR*2,0.1);
		$eyelid.css({transform:"scaleY("+lidTop/rimR+")"});
	}
});
