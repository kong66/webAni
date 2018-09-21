jQuery(function($){

  var svgNS=$('svg').attr('xmlns'),
      $svg = $('svg'),
      $root = $('.root'),
      frameTime = (1000/30).toFixed(2)*1,
      flowers = {},
      dots=[],
      shapes=[],
      $dot,
      timer=-1,
      templates={},
      aniNodeList = new NodeList(),
      aniNum=0,
      flowerNum = 20,
      trackPoint = 'trackPoint',
      colors=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#00bcd4","#03a9f4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722","#795548","#9e9e9e","#607d8b"];
var id = 10;
  init();

  function init(){
    loadTemplate();
    $svg.on('click',onClickSVG);
  }
  function onClickSVG(e){
    var svgPos;
    svgPos = getSVGPos(e);
    createFireworks(svgPos);
    startAni();
  }

  function startAni(){
    if(aniNodeList.count>0 && timer==-1){
      timer = window.setInterval(actAni,frameTime);
    }
  }
  function stopAni(){
    if(aniNodeList.count == 0 && timer!=-1){
      window.clearInterval(timer);
      timer = -1;
    }
  }
  function actAni(){
    var i,item,finish,prev;
    console.log("aniNodeList.count="+aniNodeList.count);
    console.log("shape"+$('.root .template').length);
    item = aniNodeList.head;
    while(true){
      if(item==null)
        break;
      finish = item.data.moveInfo.update(frameTime);
      setPos(item.data);
      prev = item;
      item = item.next;
      if(finish){
        aniNodeList.remove(prev);
        flowers[prev.data.shape].insertAfter(prev);
      }
    }
    if(aniNodeList.count==0){
      //console.log("ani end -------------");
      stopAni();
    }
  }
  function createFireworks(svgPos){
    var node,i;
    for(i=0;i<flowerNum;++i){
      node = getRandomFlower();
      setColor(node.data);
      setFlyParams(node.data,svgPos);
    }
  }
  function loadTemplate(){
    var i,$item,shape,$temps;
    $temps = $('.template');
    for(i=0;i<$temps.length;++i){
      $item = $($temps[i]);
      shape = $item.attr('shape');
      $item.shape = shape;
      if(!(shape in flowers)){
        flowers[shape] = new NodeList();
      }
      templates[shape] = $item;
      shapes.push(shape);
    }
  }

  function setPos($flower){
    var x,y,temp;
    x = $flower.moveInfo.x;
    y = $flower.moveInfo.y;
    $flower.attr("transform","translate("+x+","+y+")");
  }

  function setColor($flower){
    $flower.attr("fill",getRandomColor());
  }

  function setFlyParams($flower,svgPos){
    var x0 = svgPos.x,
        y0 = svgPos.y,
        vx0 = getRandom(-0.2,0.2),//0.1
        vy0 = getRandom(-0.2,0.2),//0.53332 6s
        g = 0.00015,
        delay = 0,
        dur = 6000;
    if($flower.moveInfo){
      $flower.moveInfo.reset(x0,y0,vx0,vy0,g,dur,delay);
    }else{
      $flower.moveInfo = new MoveInfo(x0,y0,vx0,vy0,g,dur,delay);
    }
  }
  function PropertyAniInfo(name,begin,end,dur,delay){
    this.propertyName = name;
    this.begin;
    this.cur;
    this.end;
    this.dur;
    this.delay;
    this.time;
    this.reset(begin,end,dur,delay);
    this.reset = function(){
      this.begin = begin;
      this.cur = begin;
      this.end = end;
      this.dur = dur;
      this.delay = delay;
      this.time = 0;
    }
    this.update = function(delta){
      var k,i
          finish =false;
      if(this.time < this.delay + this.dur){
        if(this.time > this.delay){
          if(Math.abs(this.time-this.dur)<frameTime){
            this.cur = this.end;
            for(i=0;i<this.cur.length;++i){
              this.cur[i] = this.end[i];
            }
          }else{
            k = (this.time-this.delay)/this.dur;
            for(i=0;i<this.cur.length;++i){
              this.cur[i] = this.begin[i] +
                (this.end[i]-this.begin[i])*k;
            }
          }
        }
        this.time += delta;
      }else {
        finish = true;
      }
      return finish;
    };

  }
  function MoveInfo(x0,y0,vx0,vy0,g,dur,delay){
    this.x0 = x0;
    this.y0 = y0;
    this.x = x0;
    this.y = y0;
    this.vx0 = vx0;
    this.vy0 = vy0;
    this.vy = vy0;
    this.time = 0;
    this.g = g;
    this.dur = dur;
    this.delay = delay;
    this.update = function(delta){
      var finish = false;
      if(this.time < this.delay + this.dur){
        if(this.time > this.delay){
          this.time += delta;
          this.x = this.x0 +
            this.vx0* (this.time-this.delay);
          this.vy =
            this.vy0 + this.g*(this.time-this.delay);
          this.y = this.y0 +
            (this.vy0+this.vy)/2*(this.time - this.delay);
          //console.log('x,y='+this.x+" "+this.y);
        }
        this.time += delta;
      }else{
        finish = true;
      }
      return finish;
    };
    this.reset =function (x0,y0,vx0,vy0,g,dur,delay){
      this.x0 = x0;
      this.y0 = y0;
      this.x = x0;
      this.y = y0;
      this.vx0 = vx0;
      this.vy0 = vy0;
      this.vy = vy0;
      this.time = 0;
      this.g = g;
      this.dur = dur;
      this.delay = delay;
    };
  }

  function getRandomFlower(shape){
    var index,temp,node;
    if(!shape){
      index = getRandomIndex(shapes.length-1);
      shape = shapes[index];
    }
    if(!flowers[shape].isEmpty()){
      node = flowers[shape].deQueue();
    }else{
      node = new Node(templates[shape].clone());
      node.data.shape = shape;
    }
    $root.append(node.data);
    aniNodeList.insertAfter(node);
    return node;
  }
  function getRandomColor(){
    var index = getRandomIndex(colors.length-1);
    return colors[index];
  }
  function getRandom(begin,end){
    return begin + Math.random()*(end-begin);
  }
  function getRandomIndex(max){
    return Math.round(Math.random()*max);
  }
  function getSVGPos(e){
    var matrix,svgPoint,svgXY;
    matrix = $svg[0].getScreenCTM().inverse(),
    svgPoint = $svg[0].createSVGPoint(),
    svgXY;
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    svgXY = svgPoint.matrixTransform(matrix);
    return svgXY;
  }
  function interpolate(begin,end,t,dur){
    var k = t/dur,
        res;
    if(Math.abs(t-dur)<frameTime){
      res = end;
    }else{
      res = begin + (end-begin)*k;
    }
    return res;
  }

  function NodeList(){
    this.count = 0;
    this.head = null;
    this.tail = null;
    this.deQueue = function(){
      var res =null;
      if(!this.isEmpty()){
        res = this.head;
        this.remove(this.head);
      }
      return res;
    }
    this.enQueue = function(node){
      if(node){
        this.insertAfter(node);
      }
    }
    this.insertAfter =function(node,refe){
      if(!node){
        conosle.log("error:node is null");
        return;
      }
      if(!refe){
        refe = this.tail;
      }
      if(refe==null){
        this.head = node;
        this.tail = node;
      }else{
        node.prev = refe;
        node.next = refe.next;
        if(refe.next==null){
          this.tail = node;
        }else{
          refe.next.peve = node;
        }
        refe.next = node;
      }
      ++this.count;
    };
    this.insertBefore = function(node,refe){
      if(!node){
        conosle.log("error:node is null");
        return;
      }
      if(!refe){
        refe = this.head;
      }
      if(refe==null){
        this.head = node;
        this.tail = node;
      }else{
        node.next = refe;
        node.prev = refe.prev;
        if(refe.prev==null){
          this.head = node;
        }else{
          refe.prev.next = node;
        }
        refe.prev = node;
      }
      ++this.count;
    };
    this.remove =function(node){
      if(!node){
        conosle.log("error:node is null");
        return;
      }
      if(this.isEmpty()){
        return;
      }else{
        if(node.prev==null){
          this.head = node.next;
        }else{
          node.prev.next = node.next;
        }
        if(node.next == null){
          this.tail = node.prev;
        }else{
          node.next.prev = node.prev;
        }
        node.next = null;
        node.prev = null;
        --this.count;
      }
    };
    this.isEmpty = function(){
      return this.count === 0;
    };
  }
  function Node(data){
    this.data = data;
    this.prev = null;
    this.next = null;
  }
});
