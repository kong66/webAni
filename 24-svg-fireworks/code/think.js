jQuery(function($){

  var $svg = $('svg'),
      $root = $('.root'),
      frameTime = (1000/30).toFixed(1)*1,
      timer=-1,
      flowers = {},
      shapes=[],
      templates={},
      aniNodeList = new NodeList(),
      flowerNum = 30,
      trialNum = 10,
      g = 0.00005,
      degToRand = Math.PI/180,
      colors=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#00bcd4","#03a9f4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722","#795548","#9e9e9e","#607d8b"];

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
    var i,j,item,prev,finish,finish2;
    item = aniNodeList.head;
    while(true){
      if(item==null)
        break;
      finish = true;
      if(item.data.moveInfo){
        finish = item.data.moveInfo.update(frameTime);
        setTransPos(item.data,
          item.data.moveInfo.x,
          item.data.moveInfo.y);
      }
      if(item.data.propertyAnis){
        for(var i in item.data.propertyAnis){
          finish2 = item.data.propertyAnis[i].update(frameTime);
          finish = finish && finish2;
          setProperty(item.data,
            i,item.data.propertyAnis[i].cur[0]);
        }
      }
      prev = item;
      item = item.next;
      if(finish){
        aniNodeList.remove(prev);
        flowers[prev.data.shape].enQueue(prev);
        setTransPos(prev.data,-500,-500);
      }
    }
    if(aniNodeList.count==0){
      stopAni();
    }
    console.log("aniNodeList.count="+aniNodeList.count);
    console.log("shape total="+$('.root .template').length);
  }
  function createFireworks(svgPos){
    var node,i,j,color,opacity,shape,
        v,deg,vx0,vy0,delay,dur,dur2,hollow;
    for(i=0;i<flowerNum;++i){
      shape = getRandomShape();
      v = 0.1 + 0.05*Math.random();
      deg = 360 * Math.random();
      vx0 = v * Math.cos(deg*degToRand);
      vy0 = v * Math.sin(deg*degToRand);
      dur = 5000 + 1000*Math.random();
      color = getRandomColor();
      hollow = Math.random()>0.5;
      for(j=0;j<trialNum;++j){
        node = getShapeNode(shape);
        delay = frameTime*j;
        opacity = 1-j/trialNum,
        dur2 = 2000 + 1000*Math.random();
        if(hollow){
          setProperty(node.data,'fill','transparent');
          setProperty(node.data,'stroke',color);
          setPropertyAniInfo(node.data,'stroke-opacity',[opacity],[0],dur2,1500);
        }else{
          setProperty(node.data,'stroke','transparent');
          setProperty(node.data,'fill',color);
          setPropertyAniInfo(node.data,'fill-opacity',[opacity],[0],dur2,1500);
        }
        setMoveAniInfo(node.data,
          svgPos.x,svgPos.y,vx0,vy0,g,dur,delay);
      }
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
  function setTransPos($ele,x,y){
    $ele.attr("transform","translate("+x+","+y+")");
  }
  function setProperty($ele,propertyName,value){
    $ele.attr(propertyName,value);
    $ele[propertyName] = value;
  }

  function setMoveAniInfo($flower,
    x0,y0,vx0,vy0,g,dur,delay){
    if($flower.moveInfo){
      $flower.moveInfo.reset(x0,y0,vx0,vy0,g,dur,delay);
    }else{
      $flower.moveInfo = new
        MoveInfo(x0,y0,vx0,vy0,g,dur,delay);
    }
  }

  function setPropertyAniInfo($node,name,
    begin,end,dur,delay){
    if(!$node || !name)
      return;
    if(!$node.propertyAnis){
      $node.propertyAnis = {};
    }
    if(name in $node.propertyAnis){
      $node.propertyAnis[name].reset(begin,end,dur,delay);
    }else{
      $node.propertyAnis[name] = new
        PropertyAniInfo(name,begin,end,dur,delay);
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
    this.reset = function(begin,end,dur,delay){
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
        if(this.time >= this.delay){
          if(Math.abs(this.time-this.dur - this.delay)<frameTime){
            for(i=0;i<this.cur.length;++i){
              this.cur[i] = this.end[i];
            }
          }else{
            k = (this.time-this.delay)/this.dur;
            for(i=0;i<this.cur.length;++i){
              this.cur[i] = this.begin[i] +
                (this.end[i]-this.begin[i])*k;
              this.cur[i] = this.cur[i].toFixed(2)*1;
            }
          }
        }
        this.time += delta;
      }else {
        finish = true;
      }
      return finish;
    };
    this.reset(begin,end,dur,delay);
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
          this.x = this.x.toFixed(1);
          this.y = this.y.toFixed(1);
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
    this.clone = function(){
      return new MoveInfo(this.x0,this.y0,
        this.vx0,this.vy0,this.g,this.dur,this.delay);
    };
  }
  function getRandomShape(){
    var index;
    index = getRandomIndex(shapes.length-1);
    return shapes[index];
  }
  function getShapeNode(shape){
    if(!flowers[shape].isEmpty()){
      node = flowers[shape].deQueue();
    }else{
      node = new Node(templates[shape].clone());
      node.data.shape = shape;
      $root.append(node.data);
    }
    aniNodeList.enQueue(node);
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
