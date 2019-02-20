jQuery(function($){

  var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

  context.font = '80px bold Arial';
  context.fillStyle = 'red';
  context.strokeStyle = 'yellow';

  context.fillText("Hello Canvas",8,110);
  context.strokeText("Hello Canvas",8,110);

});
