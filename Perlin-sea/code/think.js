jQuery(function($){
  var $sea = $('.sea'),
      i,j,
      $wave,
      $waves=[],
      side = 20;

  for(i=0;i<30;++i){
    for(j=0;j<30;++j){
      $wave = $('<div class="wave"></div>');
      $wave.css('width',side);
      $wave.css('height',side);
      $wave.css('top',side*j);
      $wave.css('left',side*i);
      $wave.t = side*j;
      $wave.l = side*i;
      $sea.append($wave);
      $waves.push($wave);
    }
  }
  var perlin = new Perlin(255);
  test();
  function test(t){
    var i,j,wave,x,y,h,color;
    for(i=0;i<$waves.length;++i){
      wave = $waves[i];
      x = wave.l;
      y = wave.t;
      h = perlin.OctavePerlin(x/10,y/10,t,6,2);
      // console.log("x,y="+x+","+y+" h="+h);

      // color = h*100+155;
      // console.log(color);
      h = (h*50).toFixed(2);
      wave.css('transform','translateZ('+h+"px)");
      // wave.css('background-color',"rgb(0,0,"+color+")");
    }
  }
  window.setInterval(function(){
    var date = new Date();
    test(date.getTime()*0.00001);
  },1000/30);

});
