jQuery(function($){

  var $path1 = $("#text_a"),
      $path2 = $("#text_q"),
      pathes1,
      pathes2,
      $ele = $("#abc");
  pathes1 = pathToValue($path1);
  toUpperCaseCommand(pathes1);
  pathes2 = pathToValue($path2);
  toUpperCaseCommand(pathes2);
  toSameNumPath(pathes1,pathes2);

  $ele.attr("d",valueToPath(pathes1));
  var p = $ele.find("animate")[0];
  p.setAttribute("from",valueToPath(pathes1));
  p.setAttribute("to",valueToPath(pathes2));
  p.beginElement();

  function pathToValue($path){
    var i,j,k,
        pathes = $path.attr("d").match(/M[^M]*[zZ]/g);
    for(i=0;i<pathes.length;++i){
      pathes[i] = pathes[i].match(/[a-zA-Z][^a-zA-Z]*/g);
      for(j=0;j<pathes[i].length;++j){
        pathes[i][j]=pathes[i][j].match(/[a-zA-Z]|(-?([^a-zA-Z,\s-])+)/g);
        for(k=1;k<pathes[i][j].length;++k){
          pathes[i][j][k] *=1;
        }
      }
    }
    return pathes;
  }
  function toUpperCaseCommand(pathes){
    var i,j,k,points;
    for(i=0;i<pathes.length;++i){
      points=[];
      for(j=0;j<pathes[i].length;++j){
        toAbasolutePoint(pathes[i][j],points);
      }
    }
  }

  function toAbasolutePoint(command,points){
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
  function toSameNumPath(target,source){
    var i,j,addNum,pathesA,pathesB;
    if(target.length < source.length){
      pathesA = target;
      pathesB = source;
    }else{
      pathesB = target;
      pathesA = source;
    }
    addNum = Math.abs(target.length - source.length);
    for(i=0;i<addNum;++i){
      pathesA.push(clonePath(pathesA[0]));
    }
    for(i=0;i<pathesA.length;++i){
      for(j=0;j<pathesA[i].length;++j){
        toSameNumPoints(pathesA[i],pathesB[i]);
      }
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
  function toSameNumPoints(pathA,pathB){
    var less,i,j,point,n;
    if(pathA.length!=pathB.length){
      if(pathA.length < pathB.length){
        less = pathA;
      }else{
        less = pathB;
      }
      addNum = Math.abs(pathA.length - pathB.length);
      if(less.length>2){
        for(i=0;i<addNum;++i){
          n=1 + Math.round(Math.random()*(less.length-3));
          less.splice(n+1,0,clonePoint(less[n]));
        }
      }

    }
  }
  function clonePoint(point){
    var newPoints=['C',point[5],point[6],
      point[5],point[6],point[5],point[6]];
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
    console.log(str);
    return str;
  }

});
