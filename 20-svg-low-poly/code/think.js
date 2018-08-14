jQuery(function($){

  var $svg = $('svg'),
      $triangles = $('polygon:lt(60)'),
      svgNS="http://www.w3.org/2000/svg",
      hueFilters = [document.getElementById("HueRoateA"),
          document.getElementById("HueRoateB")],
      filterIndex = 0,
      ok = true;

  (function(){
    changeFilter();
    $triangles.each(function(index){
      init(this,index);
    });
  })();

  $svg.on("click",onclickTriangles);

  function onclickTriangles(){
    if(ok){
      //ok = false;
      changeFilter();

      $triangles.endNum = $triangles.length;
      console.log($triangles.endNum);
      $triangles.each(function(index){

        // onClickTriangle(this,function(){
        //   if(--$triangles.endNum == 0){
        //     ok = true;
        //     console.log("ok");
        //   }
        // });
      });
    }
  }
  function changeFilter(){
    filterIndex = (filterIndex+1)%2;
    hueFilters[filterIndex].children[0].setAttribute("values", Math.round(Math.random()*360)+"");
  }
  function setFilter(polygon){
    var filter = hueFilters[filterIndex],
        id = filter.getAttribute("id"),
        str = "url(#"+id+")";
    polygon.setAttribute("filter",str);
  }

  function init(polygon,index){
    var points;
    polygon.mycolor = $(polygon).css("fill");
    points = $(polygon).attr("points").split(/,|\s/),
    polygon.cx = (points[0]*1 + points[2]*1 +points[4]*1)/3,
    polygon.cy = (points[1]*1 + points[3]*1 +points[5]*1)/3;
    setFilter(polygon);
    createAni2(polygon,index);
  }

  function onClickTriangle(polygon,aniEnd){
    polygon.anis[0].beginElement();
    polygon.anis[0].onend= aniGrayEnd;

    function aniGrayEnd(){
      setFilter(polygon);
      polygon.aniNum = 2;
      polygon.aniEnd = aniHideEnd;
      polygon.anis[1].onend = polygon.aniEnd;
      polygon.anis[2].onend = polygon.aniEnd;
      polygon.anis[1].beginElement();
      polygon.anis[2].beginElement();
    }

    function aniHideEnd(){
      if(--polygon.aniNum==0){
        polygon.aniNum = 4;
        polygon.aniEnd = aniShowEnd;
        polygon.anis[3].onend = polygon.aniEnd;
        polygon.anis[4].onend = polygon.aniEnd;
        polygon.anis[5].onend = polygon.aniEnd;
        polygon.anis[6].onend = polygon.aniEnd;
        polygon.anis[3].beginElement();
        polygon.anis[4].beginElement();
        polygon.anis[5].beginElement();
        polygon.anis[6].beginElement();
      }

    }
    function aniShowEnd(){
      if(--polygon.aniNum==0){
        aniEnd();
      }
    }
  }
  function createAni2(polygon,index){
    var ani,begin,dur,from,to;

    dur = Math.random()*3+0.5;
    begin = "triangles.click";
    ani = createAnimateNode(polygon,index,"fill-opacity",
      "1","0",
      dur,begin,"freeze","replace");
    ani.onend = function(){
      setFilter(polygon);
    };
    createAnimateNode(polygon,index,  "translate",
      "0,0", polygon.cx+","+polygon.cy,
      dur,begin,"freeze","sum");
    createAnimateNode(polygon,index,"scale",
      "1","0",dur,begin,"freeze","sum");


    begin = begin+"+"+dur+"s";
    createAnimateNode(polygon,index,"fill-opacity",
      "0","1",
      dur,begin,"freeze","replace");
    createAnimateNode(polygon,index,  "translate",
      polygon.cx+","+polygon.cy,  "0,0",
      dur,begin,"freeze","sum");

    createAnimateNode(polygon,index,"scale",
      "0","1",dur,begin,"freeze","sum");

  }
  function createAni(polygon,index){
    var ani,begin,dur,from,to;

    dur = Math.random()*3+0.5;
    begin = "indefinite";
    createAnimateNode(polygon,index,"fill",
      polygon.mycolor,"gray",
      dur,begin,"freeze","replace");

    createAnimateNode(polygon,index,"fill-opacity",
      "1","0",
      dur,begin,"freeze","replace");

    createAnimateNode(polygon,index,"translate",
      polygon.cx+","+polygon.cy,
      polygon.cx+","+(polygon.cy+300),
      dur,begin,"remove","sum");


    dur = Math.random()*3+0.5;
    createAnimateNode(polygon,index,  "translate",
      polygon.cx+","+polygon.cy,
      "0,0",dur,begin,"freeze","sum");

    createAnimateNode(polygon,index,"scale",
      "0","1",dur,begin,"freeze","sum");

    createAnimateNode(polygon,index,"fill-opacity",
      "0","1",3,begin,"freeze","replace");

    createAnimateNode(polygon,index,"fill",
      "gray",polygon.mycolor,
      0.5,begin,"freeze","replace");
  }

  function createAnimateNode(node,index,attr,
    from,to,dur,begin,fill,additive,keytimes,values){
    var ani,idStr;
    if(attr=="scale" ||
       attr=="translate" ||
       attr=="rotate"){
      ani = document.createElementNS(
        svgNS,"animateTransform");
      ani.setAttribute("attributeName","transform");
      ani.setAttribute("type",attr);
    }else{
      ani =document.createElementNS(svgNS,"animate");
      ani.setAttribute("attributeName",attr);
    }
    idStr = attr.replace("-","");
    ani.setAttribute("id",idStr+index);

    ani.setAttribute("from",from);
    ani.setAttribute("to",to);
    ani.setAttribute("repeatCount","1");

    ani.setAttribute("fill",fill);
    ani.setAttribute("additive",additive);

    ani.setAttribute("begin",begin);
    ani.setAttribute("dur",dur+"s");
    if(!node.anis){
      node.anis = [];
    }
    node.anis.push(ani);
    node.appendChild(ani);
    return ani;
  }


});
