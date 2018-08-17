jQuery(function($){

  var $svg = $('svg'),
      $triangles = $('svg g polygon');

      $triangles.each(function(){
        var $this = $(this),
            x = Math.random()*1000-500,
            y = Math.random()*1000-500,
            svgNS="http://www.w3.org/2000/svg",
            points = this.getAttribute("points"),
        newAni =document.createElementNS(svgNS,"animateTransform");
        newAni.setAttribute("attributeName","transform");
        newAni.setAttribute("type","translate");
        newAni.setAttribute("from","0,0");
        newAni.setAttribute("to",x+","+y);
        newAni.setAttribute("repeatCount","1");
        newAni.setAttribute("dur","1s");
        newAni.setAttribute("fill","freeze");
        newAni.setAttribute("begin","triangles.click");
        this.appendChild(newAni);


        // newAni =document.createElementNS(svgNS,"animateTransform");
        // var xyArray =
        // this.getAttribute("points").split(/,|\s/);
        // var x2 = (xyArray[0]*1+xyArray[2]*1+xyArray[4]*1)/3;
        // var y2 = (xyArray[1]*1+xyArray[3]*1+xyArray[5]*1)/3;
        // console.log(xyArray);
        // newAni.setAttribute("attributeName","transform");
        // newAni.setAttribute("type","rotate");
        // newAni.setAttribute("from","0,"+x2+","+y2);
        // newAni.setAttribute("to","720,"+x+","+y);
        // newAni.setAttribute("repeatCount","1");
        // newAni.setAttribute("dur","1s");
        // newAni.setAttribute("fill","freeze");
        // newAni.setAttribute("begin","triangles.click");
        // this.appendChild(newAni);

        newAni =document.createElementNS(svgNS,"animate");
        newAni.setAttribute("attributeName","fill-opacity");
        newAni.setAttribute("from","1");
        newAni.setAttribute("to","0");
        newAni.setAttribute("repeatCount","1");
        newAni.setAttribute("dur","1s");
        newAni.setAttribute("fill","freeze");
        newAni.setAttribute("begin","triangles.click");
        this.appendChild(newAni);

      });

});
