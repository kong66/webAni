jQuery(function($){

  var $svg = $('svg'),
      $text = $('.text');
      $letters = $('.text>.letter'),
      $rect = $('rect'),
      frameTime = (1000/30).toFixed(2)*1,
      array = [],
      aniNum = 0,
      timer = null,
      aniState =0;

  init();

  function init(){
    $letters.each(function(n){
      var $pieces = $(this).find("path");
      array.push([]);
      $pieces.each(function(index){
          var $this = $(this),
              tx = Math.random()*1000-500,
              ty = Math.random()*300-150,
              r = Math.random()*360,
              dur = Math.random()*1000+2000;
          array[n].push($this);
          setAniInfo($this,800*n,dur,
            [
              ["tx",[0,tx]  ],
              ["ty",[0,ty]  ],
              ["sx",[1,0.5] ],
              ["sy",[1,0.5] ],
              ["r", [0,r]   ],
              ["o", [1,0]   ]
            ]);
      });
    });

    $text.on("click",onClickText);
  }
  function onClickText(){
    if(aniState==0){
      onAniState();
    }
  }
  function startAni(direction){
    var letter,it,it2;
    for(it in array){
      letter = array[it];
      for(it2 in letter){
          letter[it2].ani = true;
          letter[it2].dir = direction;
          letter[it2].timer = 0;
          ++aniNum;
      }
    }
    doAni();
  }

  function onAniState(){
    if(aniState==0){
      aniState++;
      startAni(true);
    }else if(aniState==1){
      aniState++;
      startAni(false);
    }else{
      aniState = 0;
    }
  }

  function doAni(){
    timer = window.setInterval(function(){
      var letter,it,it2;
      for(it in array){
        letter = array[it];
        for(it2 in letter){
          if(actAni(letter[it2])){
            --aniNum;
          }
        }
      }
      if(0 == aniNum){
        window.clearInterval(timer);
        timer = 0;
        onAniState();
      }
    },frameTime);
  }

  function setAniInfo($ele,delay,dur,aniArray){
    var i;
    var c = getCenter($ele);
    $ele.center = c;
    $ele.dur = dur;
    $ele.timer = 0;
    $ele.delay = delay;
    $ele.ani = false;
    $ele.dir = true;
    for(i in aniArray){
      $ele[aniArray[i][0]] = aniArray[i][1];
    }
  }
  function getCenter($ele){
    // var d = $ele[0].getAttribute("d");
    // var str = d.match(/\d+\.?\d*,\d+\.?\d*/);
    // var c = str[0].split(",");
    //console.log(c);
    // var x = $ele[0].getAttribute("x")*1,
    //     y = $ele[0].getAttribute("y")*1,
    //     width = $ele[0].getAttribute("width")*1,
    //     height = $ele[0].getAttribute("height")*1;
    // //console.log("******"+x+","+y+",");
    // $ele.cx = x*1+width/2;
    // $ele.cy = y*1+height/2;
    return [0,0];
  }
  function actAni($ele){
    var ret = false;
    if($ele.ani){
      if($ele.timer <= $ele.dur + $ele.delay ){
        $ele.timer += frameTime;
        if($ele.timer>=$ele.delay){
          setStyle($ele);
        }
      }else{
        $ele.ani = false;
        ret = true;
      }
    }
    return ret;
  }

  function setStyle($ele){

    var transformStyle = getTranslateStyle($ele)
          + getScaleStyle($ele);
          // + getRotateStyle($ele.cx,$ele.cy,$ele.r);

    $ele.css("transform",transformStyle);
    $ele.css("stroke-opacity",getOpacityStyle($ele));
    $ele.css("fill-opacity",getOpacityStyle($ele));
  }
  function getOpacityStyle($ele){
    var o = getInterpolation($ele,"o");
    return o+"";
  }
  function getTranslateStyle($ele){
    var tx = getInterpolation($ele,"tx"),
        ty = getInterpolation($ele,"ty");
    return "translate("+tx+"px,"+ty+"px)";
  }
  function getScaleStyle($ele){
    var sx = getInterpolation($ele,"sx"),
        sy = getInterpolation($ele,"sy"),
        cx = $ele.center[0],
        cy = $ele.center[1],
        tx = -cx*(sx - 1),
        ty = -cy*(sy - 1);
    return " translate("+tx+"px,"+ty+"px) scale("+sx+","+sy+")";
  }
  function getRotateStyle($ele){
    var r = getInterpolation($ele,"r"),
        cx = $ele.center[0],
        cy = $ele.center[1];
    return " translate("+cx+"px,"+cy
      +"px) rotate("+r+"deg) "
      +" translate("+(-cx)+"px,"+(-cy)+"px)";
  }
  function getInterpolation($ele,attr){
    var begin = $ele[attr][0],
        end = $ele[attr][1],
        t = $ele.timer - $ele.delay,
        k = t/$ele.dur,
        res;
    if(Math.abs(t-$ele.dur)<frameTime){
      res = $ele.dir ? end:begin;
    }else{
      res = $ele.dir ?
      (begin + (end-begin)*k) : (end + (begin-end)*k);
    }
    return res;
  }
});
