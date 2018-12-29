jQuery(function($){

  var $fire = $('.fire'),
      $tem = $('.particle:first'),
      particles_array=[],
      total=8;

  init();

  function init(){
    var i,j,particles,x,$text;
    for(i=0;i<total;++i){
      particles = getParticles(getRandomInt(30,50));
      x = getRandomInt(0,90);
      for(j in particles){
        setAni(particles[j],x);
      }
    }
    $text=$('.fire-text');
    $text.on('click',function(){
      $fire.toggleClass('burning');
      });
  }
  function getRandomInt(s,e){
    return s+Math.round(Math.random()*(e-s));
  }

  function getParticles(n){
    var i,particle,particles=[];
    for(i=0;i<n;++i){
      particle = $tem.clone();
      particles.push(particle);
      $fire.append(particle);
    }
    return particles;
  }

  function setAni($particle,xCenter){
    var left,delay,radius;
    radius = Math.random()>0.3? 3:10;
    left = (xCenter+Math.random()*radius)+"%";
    delay = Math.random()+"s";

    $particle.css({
      left:left,
      animationDelay:delay
    });
  }


});
