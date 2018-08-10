jQuery(function($){

  var $svg = $('svg'),
      $triangles = $('svg g polygon');

      $triangles.each(function(){
        var $this = $(this),
            x = Math.random()*300,
            y = Math.random()*300,
            svgNS="http://www.w3.org/2000/svg",
        newAni =document.createElementNS(svgNS,"animateTransform");
        newAni.setAttribute("attributeName","transform");
        newAni.setAttribute("type","translate");
        newAni.setAttribute("from","0,0");
        newAni.setAttribute("to",x+","+y);
        newAni.setAttribute("repeatCount","1");
        newAni.setAttribute("dur","1s");
        this.appendChild(newAni);
        // $newAni.attr("begin","indefinite");

        //  $this.append($newAni);
        // $newAni[0].beginElement();
        // newAni.beginElement();
      });

});
