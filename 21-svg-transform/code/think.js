jQuery(function($){

  var $svg = $('svg'),
      $area = $(".text-area"),
      $template = $('.letter'),
      letters ={
        max_path_num:0,
        max_point_num:0
      },
      show_text={
        aniFlag:false,
        index:0,
        textArray:[],
        $letters:null,
      };


  init();

  function init(){
    $svg.on('click',onclickSVG);
    loadLetters();
    testLetterByClick($('.test .letter'));
    loadTransformLetters();
    showText();
  }

  function onclickSVG(){
    var i;
    for(i=0;i<show_text.$letters.length;++i){
      var $ani  = $(show_text.$letters[i]).find('animate');
      $ani[0].beginElement();
    }
    if(++show_text.index>=show_text.textArray.length){
      show_text.index = 0;
    }
    showText();
  }

  function showText(){
    var i,char,nextChar,$letter,$animate,nextStr,
        str = show_text.textArray[show_text.index];
    i = show_text.index+1;
    if(i>=show_text.textArray.length){
      i = 0;
    }
    nextStr = show_text.textArray[i];
    for(i=0;i<show_text.$letters.length;++i){
      $letter = $(show_text.$letters[i]);
      char = i<str.length?
          str.charAt(i):"empty";
      nextchar = i<nextStr.length?
          nextStr.charAt(i):"empty";
      $animate = $letter.find('animate');
      $letter.attr('key',char);
      $letter.attr('d',valueToPath(letters[char]));
      $animate.attr('from',valueToPath(letters[char]));
      $animate.attr('to',valueToPath(letters[nextchar]));
      //console.log(letters[char]);
    }
  }
  function loadTransformLetters(){
    var $transform_letters = $('.transform-letters');
    show_text.textArray =
      $transform_letters.attr('letters').split(';');
    show_text.$letters = $('.text-area .letter');
    console.log(show_text);
  }

  function testLetterByClick($ele){
    var a=[],i=0,n;
    for(var n in letters){
      a.push(n);
    }
    $ele[0].setAttribute("d",valueToPath(letters['0']));
    $(document).on('click',function(){
      var e = $ele.find('animate')[0];
      if(i<a.length-1){
        ++i;
      }
      $ele[0].setAttribute("d",valueToPath(letters[a[i-1]]));
      e.setAttribute("from",valueToPath(letters[a[i-1]]));
      e.setAttribute("to",valueToPath(letters[a[i]]));
      e.beginElement();
    });
  }

  function loadLetters(){
    var i,
        $letters = $('#letters path');
    $letters.each(function(n){
      var $this = $(this),
          d = $this.attr('d'),
          key = $this.attr('key');
      letters[key] = pathToValue(d);
    });
    for(var i in letters){
      toMaxPathes(letters[i]);
    }
    console.log(letters);
  }
  function pathToValue(pathes){
    var i,j,k,path,command,points;
    pathes = matchPathes(pathes);
    for(i=0;i<pathes.length;++i){
      pathes[i] = matchPath(pathes[i]);
      points=[];
      for(j=0;j<pathes[i].length;++j){
        pathes[i][j] = matchCommand(pathes[i][j]);
        toAbsCommand(pathes[i][j],points);
      }
    }
    console.log(pathes);
    return pathes;
  }
  function matchPathes(pathes){
    var res;
    res = pathes.match(/M[^M]*[zZ]/g);
    if(res.length> letters.max_path_num){
      letters.max_path_num = res.length;
    }
    return res;
  }
  function matchPath(path){
    var res;
    res = path.match(/[a-zA-Z][^a-zA-Z]*/g);
    if(res.length > letters.max_point_num){
      letters.max_point_num = res.length;
    }
    return res;
  }
  function matchCommand(command){
    var res;
    res=command.match(/[a-zA-Z]|(-?([^a-zA-Z,\s-])+)/g);
    commandStrToDigital(res);
    return res;
  }
  function commandStrToDigital(command){
    var k;
    for(k=1;k<command.length;++k){
      command[k] *=1;
    }
  }
  function toAbsCommand(command,points){
    var point=null,
        pre=[[0,0],null];
    if(points && points.length>0){
      pre = points[points.length-1];
    }
    switch (command[0]) {
      case 'M':
        point=[[command[1],command[2]],command];
        break;
      case 'h':
      case 'H':
        hToL(command,pre);
        point=lToC(command,pre);
        break;
      case 'v':
      case 'V':
        vToL(command,pre);
        point=lToC(command,pre);
        break;
      case 'l':
      case "L":
        point=lToC(command,pre);
        break;
      case 's':
      case 'S':
        point = sToC(command,pre);
        break;
      case 'c':
      case 'C':
        point=cToC(command,pre);
        break;
      default:
        break;
    }
    points.push(point);
  }
  function hToL(command,pre){
    if(command[0] == 'h'){
      command[1]+=pre[0][0];
    }
    command[0] = 'L';
    command[2] = pre[0][1];
    return [[command[1],command[2]],command];
  }
  function vToL(command,pre){
    if(command[0] == 'v'){
      command[1]+=pre[0][1];
    }
    command[0] = 'L';
    command[2] = command[1];
    command[1] = pre[0][0];
    return [[command[1],command[2]],command];
  }
  function lToC(command,pre){
    if(command[0] == 'l'){
      command[1]+=pre[0][0];
      command[2]+=pre[0][1];
    }
    command[0]='C';
    command[5] = command[1];
    command[6] = command[2];
    command[1] = pre[0][0];
    command[2] = pre[0][1];
    command[3] = command[5];
    command[4] = command[6];
    return [[command[5],command[6]],command];
  }
  function sToC(command,pre){
    if(command[0]=='s'){
      command[1]+=pre[0][0];
      command[2]+=pre[0][1];
      command[3]+=pre[0][0];
      command[4]+=pre[0][1];
    }
    command[0] ='C';
    command[5] = command[3];
    command[6] = command[4];
    command[3] = command[1];
    command[4] = command[2];
    command[1] =pre[1][5]*2 - pre[1][3];
    command[2] =pre[1][6]*2 - pre[1][4];
    return [[command[5],command[6]],command];
  }
  function cToC(command,pre){
    if(command[0] == 'c'){
      command[0] = 'C';
      command[1] += pre[0][0];
      command[2] += pre[0][1];
      command[3] += pre[0][0];
      command[4] += pre[0][1];
      command[5] += pre[0][0];
      command[6] += pre[0][1];
    }
    return [[command[5],command[6]],command];
  }
  function toMaxPathes(pathes){
    var i,j,
        addPath = letters.max_path_num - pathes.length;
    for(i=0;i<addPath;++i){
      pathes.push(clonePath(pathes[0]));
    }
    for(i=0;i<pathes.length;++i){
      toMaxCommand(pathes[i]);
    }
  }
  function toMaxCommand(path){
    var i,j,
        add = letters.max_point_num - path.length;
    for(i=0;i<add;++i){
      n=1+Math.round(Math.random()*(path.length-2));
      path.splice(n,0,addCCommand(path[n-1]));
    }
  }

  function clonePath(path){
    var i,j,newPath =[];
    for(i=0;i<path.length;++i){
      newPath.push([]);
      for(j=0;j<path[i].length;++j){
        newPath[i].push(path[i][j]);
      }
    }
    return newPath;
  }

  function addCCommand(point){
    var x,y;
    if(point[0]=='M'){
      x = point[1];
      y = point[2];
    }else{
      x = point[5];
      y = point[6];
    }
    var newPoints=['C',x,y,x,y,x,y];
    return newPoints;
  }

  function valueToPath(pathes){
    var i,j,k,str="";
    for(i=0;i<pathes.length;++i){
      for(j=0;j<pathes[i].length;++j){
        for(k=0;k<pathes[i][j].length;++k){
          str+=pathes[i][j][k];
          if(k==pathes[i][j].length-1){
            str+=" ";
          }else if(k!=0){
            str+=",";
          }
        }
      }
    }
    //console.log(str);
    return str;
  }

});
