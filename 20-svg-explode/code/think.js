jQuery(function($){

  var $svg = $('svg'),
      $text = $('.text');
      $letters = $('.text>.letter'),
      $rect = $('rect'),
      frameTime = (1000/30).toFixed(2)*1,
      pieces = null,
      aniNum = 0,
      timer = null,
      aniState =0;

  init();

  function init(){
    loadPieces();
    $text.on("click",onClickText);
  }
  function loadPieces(){
    pieces =[];
    $letters.each(function(n){
      var $pieces = $(this).find("path");
      pieces.push([]);
      $pieces.each(function(index){
          var $this = $(this);
          pieces[n].push($this);
        });
      });
  }
  function setInfo(){
    var i,j,$this,tx,ty,r,dur,delay;
    for(i=0;i<pieces.length;++i){
      for(j=0;j<pieces[i].length;++j){
        $piece = pieces[i][j];
        tx = getRandom(-500,500),
        ty = getRandom(-300,300),
        r = getRandom(30,1080),
        dur = getRandom(2000,3000);
        delay = 800*i;
        setAniInfo($piece,delay,dur,
          [ ["tx",[0,tx]  ],
            ["ty",[0,ty]  ],
            ["sx",[1,0.2] ],
            ["sy",[1,0.2] ],
            ["r", [0,r]   ],
            ["o", [1,0]   ]  ]);
      }
    }
  }
  function getRandom(begin,end){
    return begin + Math.random()*(end-begin);
  }
  function onClickText(){
    if(aniState==0){
      setInfo();
      onAniState();
    }
  }
  function startAni(direction){
    var letter,it,it2;
    for(it in pieces){
      letter = pieces[it];
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
      for(it in pieces){
        letter = pieces[it];
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
    // if($ele.attr("id")!="XMLID_110_")
    //   return [0,0];
    var i,j,
        points=[],
        ave=[0,0],
        commands = $ele.attr("d").match(/[a-zA-Z][^a-zA-Z]*/g);
        console.log(commands);

    for(i=0;i<commands.length;++i){
      commands[i] =
        commands[i].match(/[a-zA-Z]|(-?([^a-zA-Z,\s-])+)/g);
      console.log(commands[i]);
      for(j=1;j<commands[i].length;++j){
        commands[i][j] *=1;
      }
      caculatePoints(commands[i],points);
    }
    for(i=0;i<points.length;++i){
      ave[0]+=points[i][0];
      ave[1]+=points[i][1];
    }
    ave[0] /=points.length;
    ave[1] /=points.length;
    return ave;
  }
  function caculatePoints(command,points){
    var point=null,
        pre;
    if(points && points.length>0){
      pre = points[points.length-1];
    }
    switch (command[0]) {
      case 'M':
        point=[command[1],command[2]];
        break;
      case 'L':
        point=[command[1],command[2]];
        break;
      case 'l':
        point=[pre[0]+command[1],pre[1]+command[2]];
        break;
      case 'H':
        point=[command[1],pre[1]];
        break;
      case 'h':
        point=[pre[0]+command[1],pre[1]];
        break;
      case 'V':
        point=[pre[0],command[1]];
        break;
      case 'v':
        point=[pre[0],pre[1]+command[1]];
        break;
      case 'C':
        point=[command[5],command[6]];
        break;
      case 'c':
        point=[pre[0]+command[5],pre[1]+command[6]];
        break;
      default:
        break;
    }
    if(point){
      points.push(point);
    }
  }
  function actAni($ele){
    var ret = false;
    if($ele.ani){
      if($ele.timer < $ele.dur + $ele.delay ){
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
          + getScaleStyle($ele)
          + getRotateStyle($ele);

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
