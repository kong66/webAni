jQuery(function($){

  var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

    context.beginPath();
    context.arc(250, 250, 100, 0, Math.PI*2, false);
    context.fillStyle = "rgba(255,100,100,.8)";
    context.strokeStyle = "black";
    context.fill();
    context.stroke();

});
