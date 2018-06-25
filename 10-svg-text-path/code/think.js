jQuery(function($){
  var path=$("defs path"),
      textPath =$("textPath");
  var val = -300;
  var max = 300;
  var th,th2;
  var val2 = 100,
      min = 0;

  // th2 = window.setInterval(function(){
  //     if(val2> min){
  //       val2-=.5;
  //       var str = val2+"%";
  //       textPath.attr("startOffset",str);
  //       console.log("str="+str);
  //     }else {
  //       window.clearInterval(th2);
  //     }
  //
  // },1000/30);

 // th = window.setInterval(function(){
 //   if(val<=max){
 //      val += 1;
 //      var str = "translate("+val+",0)"
 //      path.attr("transform",str);
 //      //console.log("str="+str);
 //   }else {
 //     window.clearInterval(th);
 //   }
 //  },1000/30
 //  );
});
