$(function(){

	//************鼠标通过橡皮筋拖动大白**********************
	var $bigWhite = $(".bigWhite"),
			$win = $(window),
			$doc = $(document),
			width,height,
			w = $bigWhite.width(),
			h = $bigWhite.height(),
			mouseX,mouseY,
			posX,posY,
			vx,vy,vmod,
			fx,fy,Fx,Fy,Fmod,
			u = 0.001,
			k = 0.0001,//m = 1,g=1,
			timer=-1,
			frameT = (1000/30).toFixed(2)*1;

	init();

	function init(){
		refreshWH();
		$bigWhite.on("mousedown",onMouseDown);
		$win.on("resize",onResizeWindow);
		posX = $bigWhite.offset().left;
		posY = $bigWhite.offset().top;
		vx = 0;
		vy = 0;
	}
	function startAni(){
		if(timer==-1){
			timer = window.setInterval(update,frameT);
		}
	}
	function stopAni(){
		if(timer!=-1){
			window.clearInterval(timer);
			timer = -1;
		}
	}
	function update(){
		checkBorder();
		caculateForce();
		caculateFriction();
		caculateVelocity();
		setPosStyle();
		if(vmod==0 && !isDrag()){
			stopAni();
		}
	}
	function checkBorder(){
		posX += vx*frameT;
		posY += vy*frameT;
		if(posX + w/2 > width){
			posX = width - w/2;
			vx = -vx;
		}else if(posX < w/2){
			posX = w/2;
			vx = -vx;
		}
		if(posY + h/2 > height){
			posY = height - h/2;
			vy = -vy;
		}else if(posY < 0){
			posY = h/2;
			vy = -vy;
		}
	}

	function caculateForce(){
		if(isDrag()){
			dx = mouseX - posX;
			dy = mouseY - posY;
			Fx = dx * k;
			Fy = dy * k;
		}else{
			Fx = 0;
			Fy = 0;
		}
		Fmod = Math.sqrt(Fx*Fx + Fy*Fy);
		//console.log("F="+Fx+","+Fy);
	}
	function caculateFriction(){
		vmod = Math.sqrt(vx*vx + vy*vy);
		fx = vmod>0 ? -vx/vmod*u : (Fmod>0? Fx/Fmod*u : 0);
		fy = vmod>0 ? -vy/vmod*u : (Fmod>0? Fy/Fmod*u : 0);
		//console.log("f="+fx+","+fy);
	}
	function caculateVelocity(){
		if(Math.abs(fx)>Math.abs(Fx) && vx*(fx+Fx)<0 && Math.abs(vx)< Math.abs(frameT*(fx+Fx))){
			vx = 0;
		}
		else {
			vx += frameT* (fx + Fx); //m=1;
		}
		if(Math.abs(fy)>Math.abs(Fy) && vy*(fy+Fy)<0 && Math.abs(vy)< Math.abs(frameT*(fy+Fy))){
			vy = 0;
		}
		else {
			vy += frameT* (fy + Fy); //m=1;
		}
		//console.log("v="+vx+","+vy);
	}

	function setPosStyle(){
		$bigWhite.css({
			"left":posX,
			"top":posY
		});
		if(vmod>0){
			$bigWhite.addClass('move');
		}else{
			$bigWhite.removeClass('move');
		}
	}


	function onMouseDown(e){
		registerUpAndDown();
		startAni();
		beginDrag();
		mouseX = e.clientX;
		mouseY = e.clientY;
	}


	function onMouseUp(e){
		endDrag();
		unregisterUpAndDown();
		mouseX = e.clientX;
		mouseY = e.clientY;
	}

	function onMouseMove(e){
		if(!isDrag())
			return;
		mouseX = e.clientX;
		mouseY = e.clientY;
	}

	function isDrag(){
		return $bigWhite.hasClass("drag");
	}
	function beginDrag(){
		$bigWhite.addClass('drag');
	}
	function endDrag(){
		$bigWhite.removeClass('drag');
	}
	function refreshWH(){
		height = $win.height();
		width = $win.width();
	}
	function onResizeWindow(){
		refreshWH();
	}
	function registerUpAndDown(){
		$doc.on("mouseup",onMouseUp);
		$doc.on("mousemove",onMouseMove);
	}
	function unregisterUpAndDown(){
		$doc.off("mouseup",onMouseUp);
		$doc.off("mousemove",onMouseMove);
	}
});
