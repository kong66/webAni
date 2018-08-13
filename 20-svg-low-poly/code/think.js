jQuery(function($){

  var $svg = $('svg'),
      $triangles = $(' polygon');

      $triangles.each(function(index){
        var $this = $(this),
            x = 0,
            y = Math.random()*300 + 500,
            dur = Math.random()*2 + 3,
            begin= Math.random()*3+1,
            svgNS="http://www.w3.org/2000/svg";

        // var newAni =document.createElementNS(svgNS,"animateTransform");
        // newAni.setAttribute("type","scale");
        // newAni.setAttribute("attributeName","transform");
        // newAni.setAttribute("id","fillAni"+index);
        // newAni.setAttribute("from","0");
        // newAni.setAttribute("to","1");
        // newAni.setAttribute("repeatCount","1");
        // newAni.setAttribute("fill","freeze");
        // newAni.setAttribute("begin",begin+"s");
        // newAni.setAttribute("dur","2s");
        // this.appendChild(newAni);


        // newAni =document.createElementNS(svgNS,"animate");
        // newAni.setAttribute("attributeName","fill");
        // newAni.setAttribute("id","fillAni"+index);
        // newAni.setAttribute("to","gray");
        // newAni.setAttribute("repeatCount","1");
        // newAni.setAttribute("fill","freeze");
        // newAni.setAttribute("begin",begin+"s");
        // newAni.setAttribute("dur","2s");
        // this.appendChild(newAni);
        //
        // newAni =document.createElementNS(svgNS,"animateTransform");
        // newAni.setAttribute("attributeName","transform");
        // newAni.setAttribute("type","translate");
        // newAni.setAttribute("from","0,0");
        // newAni.setAttribute("to",x+","+y);
        // newAni.setAttribute("repeatCount","1");
        // newAni.setAttribute("fill","freeze");
        // newAni.setAttribute("begin","fillAni"+index+".end");
        // newAni.setAttribute("dur",dur+"s");
        // this.appendChild(newAni);

      });

});
