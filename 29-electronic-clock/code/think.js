jQuery(function($){
	var tubeMap={
					"0":['.up.center','.up.left','.up.right','.down.left','.down.right','.down.center'],
					"1":['.up.right','.down.right'],
					"2":['.up.center','.up.right','.middle.center','.down.left','.down.center'],
					"3":['.up.center','.up.right','.middle.center','.down.right','.down.center'],
					"4":['.up.left','.up.right','.middle.center','.down.right'],
					"5":['.up.center','.up.right','.middle.center','.down.right','.down.center'],
					"6":['.up.center','.up.left','.middle.center','.down.left','.down.right','.down.center'],
					"7":['.up.center','.up.right','.down.right'],
					"8":['.up.center','.up.left','.up.right','.middle.center','.down.left','.down.right','.down.center'],
					"9":['.up.center','.up.left','.up.right','.middle.center','.down.right','.down.center']
				},
			$nums = $('.number');
	clock();
	window.setInterval(clock,1000);
	function clock(){
		var t = new Date(),
				h = t.getHours(),
				m = t.getMinutes(),
				s = t.getSeconds(),
				nums = [];

		getNum(h,nums);
		getNum(m,nums);
		getNum(s,nums);
		$nums.each(function(index){
			refreshNumStyle(index,nums[index],$(this));
		});
	}

	function refreshNumStyle(index,number,$num){
		var $branchs = $num.find('.branch'),
				lightBranch = tubeMap[number];

		$branchs.filter(".light").each(function(){
			$(this).removeClass('light');
		});
		for(i=0;i<lightBranch.length;++i){
			var $b = $branchs.filter(lightBranch[i]);
			$b.addClass('light');
		}
	}

	function getNum(t,nums){
		nums.push(Math.floor(t/10));
		nums.push(t%10);
	}

});
