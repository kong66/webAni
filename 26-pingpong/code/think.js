$(function(){

	//******************鼠标通过橡皮筋拖动大白**********************
	var $bigWhite = $(".bigWhite"),
			$win = $(window),
			$doc = $(document),
			deltaX=0,
			deltaY=0,
			mouseX=0,
			mouseY=0,
			preTimeStamp=0,
			vX=0,
			vY=0,
			a=0.01,
			k=0.001,
			m = 1,
			height = $win.height(),
			width = $win.width(),
			h = $bigWhite.height(),
			w = $bigWhite.width(),
			timerHandler=0,
			bw_pos_x = 0,
			bw_pos_y = 0;

	$bigWhite.on("mousedown",onMouseDown);

	function onMouseDown(e){
		$this = $(this);
		if(timerHandler){
			clearTimeout(timerHandler);
			timerHandler = 0;
		}

		$this.addClass("drag");
		bw_pos_x = $bigWhite.offset().left - $doc.scrollLeft();
		bw_pos_y = $bigWhite.offset().top - $doc.scrollTop();
		deltaX = bw_pos_x - e.screenX;
		deltaY = bw_pos_y - e.screenY;
		mouseX = e.screenX;
		mouseY = e.screenY;
		$bigWhite.css({"position":"fixed","left":bw_pos_x,"top":bw_pos_y});
		$doc.on("mouseup",onMouseUp);
		$doc.on("mousemove",onMouseMove);
	}
	function onMouseUp(e){
		if($bigWhite.hasClass("drag")){
			$bigWhite.removeClass("drag");
			if(timerHandler){
				clearTimeout(timerHandler);
				timerHandler = 0;
			}
			slide();
			$doc.off("mouseup",onMouseUp);
			$doc.off("mousemove",onMouseMove);
		}
	}

	function onMouseMove(e){
		if(!$bigWhite.hasClass("drag"))
			return;
		mouseX = e.screenX;
		mouseY = e.screenY;
		if(!timerHandler){
				pull();
		}
	}
	function pull(){
		bw_pos_x += vX * 10;
		bw_pos_y += vY * 10;

		if(bw_pos_x<0){
			bw_pos_x=0;
		}else if(bw_pos_x + w > width){
			bw_pos_x=width-w;
		}
		if(bw_pos_y<0){
			bw_pos_y=0;
		}else if(bw_pos_y+h > height){
			bw_pos_y=height-h;
		}

		$bigWhite.css({"left":bw_pos_x,"top":bw_pos_y});


		var dx = mouseX-(bw_pos_x-deltaX);
		var dy = mouseY-(bw_pos_y-deltaY);
		var d = Math.sqrt(Math.pow(dx,2),Math.pow(dy,2));

		var Fx = dx * k ;
		var Fy = dy * k ;

		var vMod = Math.sqrt(Math.pow(vX,2),Math.pow(vY,2));
		var f = a;//mg=1
		var fx = vMod>0 ? -vX/vMod*f : (d>0? dx/d*f : 0);
		var fy = vMod>0 ? -vY/vMod*f : (d>0? dy/d*f : 0);

		if(Math.abs(fx)>Math.abs(Fx) && vX*(fx+Fx)<0 && Math.abs(vX)< Math.abs(10*(fx+Fx))){
			vX = 0;
		}
		else {
			vX += 10* (fx + Fx); //m=1;
		}
		if(Math.abs(fy)>Math.abs(Fy) && Math.abs(vY)< Math.abs(10*(fy+Fy))){
			vY = 0;
		}
		else {
			vY += 10* (fy + Fy);
		}

		if(vMod!=0){
				timerHandler = setTimeout(pull,10);
		}
		else {
				timerHandler = 0;
		}
	}

	function slide(){
		var sx = $bigWhite.offset().left -$doc.scrollLeft()+ vX*10;
		var sy = $bigWhite.offset().top -$doc.scrollTop() +vY*10;

		if(sx<0){
			sx=0;
			vX = -vX;
		}else if(sx + w > width){
			sx=width-w;
			vX = -vX;
		}
		if(sy<0){
			sy=0;
			vY = -vY;
		}else if(sy+h > height){
			sy=height-h;
			vY = -vY;
		}
		$bigWhite.css({"left":sx,"top":sy});

		var vMod = Math.sqrt(Math.pow(vX,2)+Math.pow(vY,2));

		if(vMod >10*a)
		{
			vX = vX/vMod*(vMod - 10*a);
			vY = vY/vMod*(vMod - 10*a);
		}
		else {
			vX = 0;
			vY = 0;
			vMod = 0;
		}

		if(vMod!=0){
				timerHandler = setTimeout(slide,10);
		}
		else {
				timerHandler = 0;
		}
	}
	//******************鼠标直接拖动大白**********************
	/*
	var $bigWhite = $(".bigWhite");
	var $doc =$(document);
	var deltaX=0;
	var deltaY=0;
	var preScreenX=0;
	var preScreenY=0;
	var preTimeStamp=0;
	var vX=0;
	var vY=0;
	var a=0.001;
	var height = $(window).height();
	var width = $(window).width();
	var h = $bigWhite.height();
	var w = $bigWhite.width();
	var timerHandler=0;

	$bigWhite.on("mousedown",onMouseDown);

	function onMouseDown(e){
		$this = $(this);
		if(timerHandler){
			clearTimeout(timerHandler);
			timerHandler = 0;
		}
		$this.addClass("drag");
		var x_toScreen = $bigWhite.offset().left - $doc.scrollLeft();
		var y_toScreen = $bigWhite.offset().top - $doc.scrollTop();
		deltaX = x_toScreen - e.screenX;
		deltaY = y_toScreen - e.screenY;
		$bigWhite.css({"position":"fixed","left":x_toScreen,"top":y_toScreen});
		$doc.on("mouseup",onMouseUp);
		$doc.on("mousemove",onMouseMove);
	}
	function onMouseUp(e){
		if($bigWhite.hasClass("drag")){
			$bigWhite.removeClass("drag");
			slide();
			$doc.off("mouseup",onMouseUp);
			$doc.off("mousemove",onMouseMove);
		}
	}

	function onMouseMove(e){
		if(!$bigWhite.hasClass("drag"))
			return;
		//console.log("screen x,y="+e.screenX+","+e.screenY);
		var sx = e.screenX+deltaX;
		var sy = e.screenY+deltaY;
		if(sx<0){
			sx=0;
		}else if(sx + w > width){
			sx=width-w;
		}
		if(sy<0){
			sy=0;
		}else if(sy+h > height){
			sy=height-h;
		}
		$bigWhite.css({"left":sx,"top":sy});

		vX = (e.screenX-preScreenX)/(e.timeStamp-preTimeStamp);
		vY = (e.screenY-preScreenY)/(e.timeStamp-preTimeStamp);
		preScreenX = e.screenX;
		preScreenY = e.screenY;
		preTimeStamp = e.timeStamp;
	}

	function slide(){
		var sx = $bigWhite.offset().left -$doc.scrollLeft()+ vX*10;
		var sy = $bigWhite.offset().top -$doc.scrollTop() +vY*10;

		if(sx<0){
			sx=0;
			vX = -vX;
		}else if(sx + w > width){
			sx=width-w;
			vX = -vX;
		}
		if(sy<0){
			sy=0;
			vY = -vY;
		}else if(sy+h > height){
			sy=height-h;
			vY = -vY;
		}
		var vMod = Math.sqrt(Math.pow(vX,2)+Math.pow(vY,2));

		//console.log("vMod="+vMod);
		if(vMod >10*a)
		{
			vX = vX/vMod*(vMod - 10*a);
			vY = vY/vMod*(vMod - 10*a);
		}
		else {
			vX = 0;
			vY = 0;
			vMod = 0;
		}
		//console.log("vX,vY="+vX+","+vY);

		$bigWhite.css({"left":sx,"top":sy});
		if(vMod != 0){
				timerHandler = setTimeout(slide,10);
		}
		else {
				timerHandler = 0;
		}
	}*/
});
