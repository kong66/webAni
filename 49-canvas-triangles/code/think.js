window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(/* function */ callback, /* DOMElement */ element) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

window.requestTimeout = function(fn, delay) {
  if (
    !window.requestAnimationFrame &&
    !window.webkitRequestAnimationFrame &&
    !(
      window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame
    ) && // Firefox 5 ships without cancel support
    !window.oRequestAnimationFrame &&
    !window.msRequestAnimationFrame
  )
    return window.setTimeout(fn, delay);

  var start = new Date().getTime(),
    handle = new Object();

  function loop() {
    var current = new Date().getTime(),
      delta = current - start;

    delta >= delay ? fn.call() : (handle.value = requestAnimFrame(loop));
  }

  handle.value = requestAnimFrame(loop);
  return handle;
};

window.requestInterval = function(fn, delay) {
  var requestAnimFrame = (function() {
      return (
        window.requestAnimationFrame ||
        function(callback, element) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })(),
    start = new Date().getTime(),
    handle = {};
  function loop() {
    handle.value = requestAnimFrame(loop);
    var current = new Date().getTime(),
      delta = current - start;
    if (delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }
  }
  handle.value = requestAnimFrame(loop);
  return handle;
};


var canvas,ctx,h,w,size,
    randomRatio = 0.9,
    dodgeRatio = 0.3,
    maxBrightness = 80,
    mouseFastX = 0,mouseFastY = 0,
    mouseX = 0,mouseY = 0,
    triangles = [],
    dynamicGrid = [],
    randomValues = [],
    grid = [],
    columns,rows;



  function init() {
    canvas = document.createElement("canvas");
    document.getElementById("bg").appendChild(canvas);
    ctx = canvas.getContext("2d");
    window.onresize = resizeFunc;
    canvas.onmousemove = onmouseMove;
    resize();
    createGrid();
    createTriangles(grid);
    setRandomTriangleValue();
    drawTriangles();
    requestInterval(update, 30);
  }
  function resizeFunc() {
    resize();
    createGrid();
    createTriangles(grid);
    setRandomTriangleValue();
    drawTriangles();
  }

  init();
  function resize() {
    h = canvas.height = window.innerHeight;
    w = canvas.width = window.innerWidth;
    size = w >= h ? w / 16 : h / 16;
    dodgeThreshold= size*3;
    columns = Math.round(1.2 * w / size);
    rows = Math.round(1.2 * h / size);
  }

  function createGrid() {
    var row;
    grid = [];
      for (j = -1- rows / 2; j < rows / 2 + 1; j++) {
        row = [];
        for (i = -1- columns / 2; i < columns / 2 + 1; i++) {
          x = i * size  + Math.random() * size* randomRatio;
          y = j * size + Math.random() * size* randomRatio;
          row.push([x, y]);
      }
      grid.push(row);
    }
  }

  function createTriangles(grid) {
    var row,point1,point2,point3,point4;
    triangles = [];
    for (row = 0; row < grid.length - 1; row ++) {
      for (j = 0; j < grid[row].length - 1; j ++) {

        point1 = grid[row][j];
        point2 = grid[row + 1][j];
        point3 = grid[row+1][j + 1];
        point4 = grid[row][j+1];

        triangles.push([point1,point2,point4]);
        triangles.push([point2,point3,point4]);

      }
    }
  }

  function makeMouseGrid() {
    var d,dx,dy,
        dodgeLength,
        offsetX,
        offsetY;
    dynamicGrid = cloneArray(grid);
    for (i = 0; i < dynamicGrid.length - 1; i++) {
      for (j = 0; j < dynamicGrid[i].length - 1; j++) {
        dx = dynamicGrid[i][j][0] - mouseX;
        dy = dynamicGrid[i][j][1] - mouseY;
        dy == 0 ? (dy = 0.001) : dy;
        dx == 0 ? (dx = 0.001) : dx;
        d = Math.sqrt(dx * dx + dy * dy);

        if (d < dodgeThreshold) {
          dodgeLength = (dodgeThreshold -  d) * dodgeRatio;
          offsetX = dodgeLength * dx/d;
          offsetY = dodgeLength * dy/d;
          dynamicGrid[i][j][0] += offsetX;
          dynamicGrid[i][j][1] += offsetY;
        }
      }
    }
  }



  function cloneArray(arr) {
    var len = arr.length;
    var newArr = new Array(len);
    for (var i = 0; i < len; i++) {
      if (Array.isArray(arr[i])) {
        newArr[i] = cloneArray(arr[i]);
      } else {
        newArr[i] = arr[i];
      }
    }
    return newArr;
  }

  function setRandomTriangleValue() {
    randomValues = [];
    for (i = 0; i < triangles.length; i++) {
      randomValues[i] = Math.random();
    }
  }

  function caculate_brightness(points) {
    var brightness,i,avarage=0;
    for (i = 0; i < points.length; i++) {
      avarage += Math.abs(points[i][0]) + Math.abs(points[i][1]) ;
    }
    avarage /=3;
    brightness = (w+h - avarage)/(w+h)*maxBrightness ;
    return brightness;
  }


  function drawTriangle(p, rand) {
    var hue,sumDistance,color,brightness;
    ctx.save();
    ctx.beginPath();
    ctx.translate(w/2,h/2);
    ctx.moveTo(p[0][0], p[0][1]);
    ctx.lineTo(p[1][0], p[1][1]);
    ctx.lineTo(p[2][0], p[2][1]);
    ctx.closePath();

    hue = rand * 10 + 220;
    brightness = caculate_brightness(p);
    color = "hsl(" + hue + ",50%, " + brightness + "%)";

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }

  function drawTriangles() {
    var i;
    for (i=0;i < triangles.length;++i) {
      drawTriangle(triangles[i], randomValues[i]);
    }
  }

  function update() {
    makeMouseGrid(grid);
    createTriangles(dynamicGrid);
    var dMouseX = mouseFastX - mouseX;
    var dMouseY = mouseFastY - mouseY;
    mouseX += dMouseX/10;
    mouseY += dMouseY/10;
    drawTriangles();
  }

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  function onmouseMove(evt) {
    var mousePos = getMousePos(canvas, evt);
    mouseFastX = mousePos.x - w / 2;
    mouseFastY = mousePos.y - h / 2;
  }
