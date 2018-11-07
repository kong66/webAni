
function View(){
  this.tubeMap={
					"0":['.up.center','.up.left','.up.right',
            '.down.left','.down.right','.down.center'],
					"1":['.up.right','.down.right'],
					"2":['.up.center','.up.right','.middle.center',
              '.down.left','.down.center'],
					"3":['.up.center','.up.right','.middle.center',
              '.down.right','.down.center'],
					"4":['.up.left','.up.right','.middle.center',
              '.down.right'],
					"5":['.up.center','.up.left','.middle.center',
              '.down.right','.down.center'],
					"6":['.up.center','.up.left','.middle.center',
              '.down.left','.down.right','.down.center'],
					"7":['.up.center','.up.right','.down.right'],
					"8":['.up.center','.up.left','.up.right',
              '.middle.center','.down.left','.down.right',
              '.down.center'],
					"9":['.up.center','.up.left','.up.right',
              '.middle.center','.down.right','.down.center']
				};
  this.$nums = $('.numbers .number');
  this.models=['date','time','alarm','alarm-hour',
              'alarm-minite','alarm-second'];

  this.blinkNumber=function(begin,end){
    var i,
    	$numbers = $('.numbers .number');
    for(i=0;i<$numbers.length;++i){
      $blink=$numbers.filter(':eq('+i+')');
			$blink.removeClass('blink');
			$blink[0].offsetWidth;
      if(i>=begin && i<end){
				$blink.addClass('blink');
			}
    }
  };

  this.turnOnLamp=function(b){
    if(b){
      $('.lamp').addClass('active');
    }else{
      $('.lamp').removeClass('active');
    }
  };

  this.blinkLamp=function(b){
    if(b){
      $('.lamp').addClass('blink');
    }else{
      $('.lamp').removeClass('blink');
    }
  };

  this.activeClock=function(b){
    if(b){
      $('.frame').addClass('active');
    }else{
      $('.frame').removeClass('active');
    }
  };

  this.blinkAlarm=function(b){
    if(b){
      $('.alarm').addClass('blink');
    }else{
      $('.alarm').removeClass('blink');
    }
  };

  this.activeAlarm=function(b){
    if(b){
      $('.alarm').addClass('active');
    }else{
      $('.alarm').removeClass('active');
    }
  };

	this.refreshNumbers=function(nums){
    var i,num;
    for(i=0;i<nums.length;++i){
      num = nums[i];
      if(num>=0 && num<=9){
        this.refreshNumStyle(num,this.$nums.eq(i));
      }
    }
	};

	this.refreshNumStyle=function(number,$num){
		var $branches = $num.find('.branch'),
				lightClass = this.tubeMap[number],
        str;
    if(!lightClass){
      throw new Error(number+" not exist");
    }
    str = lightClass.join(',');
    $branches.filter(str).addClass('light');
    $branches.not(str).removeClass('light');
	};

	this.showAMPM=function(h){
		if(h>=12){
			$('.am').removeClass('show');
			$('.pm').addClass('show');
		}else{
			$('.am').addClass('show');
			$('.pm').removeClass('show');
		}
	};

	this.showWeekDay=function(day){
		$('.weekday div.show').removeClass('show');
		$('.weekday div').eq(day).addClass('show');
	};

  this.onClickCmd=null;
  this.onClickAdd=null;
  this.onClickSub=null;
  this.onMouseEnter=null;
  this.onMouseLeave=null;

  this.register=function(){
    var view = this;
		$('.cmd.btn').on('click',function(){
      view.onClickCmd();
    });
		$('.add.btn').on('click',function(){
      view.onClickAdd();
    });
		$('.sub.btn').on('click',function(){
      view.onClickSub()
    });
		$('.frame').on('mouseenter',function(){
        view.onMouseEnter();
      });
		$('.frame').on('mouseleave',function(){
        view.onMouseLeave();
      });
	};
  this.register();
}

function StateManager(){
  var mgr=this;

  this.update = function(){
    this.curState.update(new Date());
  };
  function onMouseEnter(){
    mgr.curState.onMouseEnter();
  }
  function onMouseLeave(){
    mgr.curState.onMouseLeave();
  }
  function onClickCmd(){
    mgr.curState.onClickCmd();
  }
  function onClickAdd(){
    mgr.curState.onClickAdd();
  };
  function onClickSub(){
    mgr.curState.onClickSub();
  };
  this.changeState =function(name){
    if(mgr.states[name]){
      mgr.curState.exit();
      mgr.curState = mgr.states[name];
      mgr.curState.enter();
      console.log("curState="+mgr.curState.name);
    }else{
      throw new Error(name+" is not a state");
    }
  };
  this.init = function(){
    var states,i;
    states = [
      new StateDate(),
      new StateTime(),
      new StateAlarm(),
      new StateSetAlarm(),
      new StateSetAlarmHour(),
      new StateSetAlarmMinite(),
      new StateSetAlarmSeconds()];
    this.states={};
    for(i=0;i<states.length;++i){
      this.states[states[i].name]=states[i];
    }
    this.curState=states[1];
    this.view = new View(this);
    State.view = this.view;
    this.view.onClickCmd=onClickCmd;
    this.view.onClickAdd=onClickAdd;
    this.view.onClickSub=onClickSub;
    this.view.onMouseEnter=onMouseEnter;
    this.view.onMouseLeave=onMouseLeave;
    this.update();
    window.setInterval(function(){
      mgr.update();
    },1000);
    State.changeState = this.changeState;
  };
  this.init();
}

function State(name){
  this.name = name;
  this.getNum =function(t){
    return [Math.floor(t/10),t%10];
  };
  this.insertArray =function(src,index,insert){
    var i;
    for(i=insert.length-1;i>=0;--i){
      src.splice(index,0,insert[i]);
    }
    return src;
  };
  this.refreshPartNums=function(n){
    var nums=this.insertArray(
          [-1,-1,-1,-1],n*2,this.getNum(State.alarmTime[n]));
    State.view.refreshNumbers(nums);
    State.view.blinkNumber(n*2,n*2+2);
  };
  this.refreshTime=function(t){
    var h,m,s,nums=[];
    h = t.getHours();
    m = t.getMinutes();
    s = t.getSeconds();
    nums = nums.concat(
              this.getNum(h),
              this.getNum(m),
              this.getNum(s));
    State.view.refreshNumbers(nums);
  };
  this.refreshWeekDayAndAMPM=function(t){
    var hou,day;
    hou = t.getHours();
    day = t.getDay();
    State.view.showAMPM(hou);
    State.view.showWeekDay(day);
  };
  this.refreshDate = function(t){
    var year,mon,date,nums=[];
    year = t.getFullYear();
    mon = t.getMonth()+1;
    date = t.getDate();
    nums = nums.concat(
      this.getNum(year),
      this.getNum(mon),
      this.getNum(date));
    State.view.refreshNumbers(nums);
  };
  this.onMouseEnter=function(){
    State.mouseOnClock = true;
    State.view.activeClock(true);
  };
  this.onMouseLeave=function(){
    State.mouseOnClock = true;
    State.view.activeClock(false);
  };
  this.checkAlarm=function(t){
    return  State.isAlarmOn &&
            t.getHours()==State.alarmTime[0]&&
            t.getMinutes()==State.alarmTime[1]&&
            t.getSeconds()==State.alarmTime[2];
  };
  State.alarmTime=[0,0,0];
  State.isAlarmOn = false;
  State.mouseOnClock = false;
}

State.prototype.update=function(t){
  throw new Error("update function not complete");
};
State.prototype.exit=function(){
  throw new Error("exit function not complete");
};
State.prototype.enter=function(){
  throw new Error("enter function not complete");
};
State.prototype.onClickCmd=function(){
  throw new Error("onClickCmd function not complete");
};
State.prototype.onClickAdd=function(){
  throw new Error("onClickAdd function not complete");
};
State.prototype.onClickSub=function(){
  throw new Error("onClickSub function not complete");
};

//***************date
function StateDate(){
  this.counter = 0;
  State.call(this,"Date");
  this.update=function(t){
    if(this.checkAlarm(t)){
      State.changeState("Alarm");
    }else{
      if(++this.counter==3){
        State.changeState("Time");
      }else{
        this.refreshDate(t);
        this.refreshWeekDayAndAMPM(t);
      }
    }
  };
  this.enter=function(){
    this.counter = 0;
    var t = new Date();
    this.refreshDate(t);
    this.refreshWeekDayAndAMPM(t);
  };
  this.exit=function(){
  };
  this.onClickCmd =function(){
    State.changeState("SetAlarm");
  };
  this.onClickAdd =function(){
    State.changeState("Time");
  };
  this.onClickSub =function(){
    State.changeState("Time");
  };
}
function StateTime(){
  State.call(this,"Time");
  this.update=function(t){
    if(this.checkAlarm(t)){
      State.changeState("Alarm");
    }else{
      this.refreshTime(t);
      this.refreshWeekDayAndAMPM(t);
    }
  };
  this.enter=function(){
    var t = new Date();
    this.refreshTime(t);
    this.refreshWeekDayAndAMPM(t);
    State.view.activeAlarm(State.isAlarmOn);
    State.view.blinkAlarm(false);
    State.view.blinkNumber(0,0);
  };
  this.exit=function(){
  };
  this.onClickCmd =function(){
    State.changeState("SetAlarm");
  };
  this.onClickAdd =function(){
    State.changeState("Date");
  };
  this.onClickSub =function(){
    State.changeState("Date");
  };
}
function StateAlarm(){
  State.call(this,"Alarm");
  this.counter=0;
  this.update=function(t){
    if(++this.counter==60){
      State.changeState("Time");
    }else{
      this.refreshTime(t);
      this.refreshWeekDayAndAMPM(t);
    }
  };
  this.enter=function(){
    var t = new Date();
    this.counter=0;
    this.refreshTime(t);
    this.refreshWeekDayAndAMPM(t);
    State.view.activeAlarm(true);
    State.view.blinkAlarm(true);
    State.view.blinkNumber(0,0);
    State.view.turnOnLamp(true);
    State.view.blinkLamp(true);
    State.view.activeClock(true);
  };
  this.exit=function(){
    State.view.turnOnLamp(false);
    State.view.blinkLamp(false);
    State.isAlarmOn = false;
    State.view.activeAlarm(false);
    State.view.blinkAlarm(false);
    State.view.activeClock(State.mouseOnClock);
  };
  this.onClickCmd =function(){
    State.changeState('Time');
  };
  this.onClickAdd =function(){
    State.changeState('Time');
  };
  this.onClickSub =function(){
    State.changeState('Time');
  };
  this.onMouseEnter=function(){
    State.mouseOnClock = true;
  };
  this.onMouseLeave=function(){
    State.mouseOnClock = false;
  };
}
function StateSetAlarm(){
  State.call(this,"SetAlarm");
  this.update=function(t){
    if(this.checkAlarm(t)){
      State.changeState("Alarm");
    }
  };
  this.enter=function(){
    var nums;
    State.isAlarmOn = true;
    State.view.activeAlarm(true);
    State.view.blinkAlarm(true);
    State.view.blinkNumber(0,6);
    nums = this.getNum(State.alarmTime[0]).concat(
      this.getNum(State.alarmTime[1]),
      this.getNum(State.alarmTime[2])
    );
    State.view.refreshNumbers(nums);
  };
  this.exit=function(){
  };
  this.onClickCmd =function(){
    State.changeState("Hour");
  };
  this.onClickAdd =function(){
    State.changeState("Time");
  };
  this.onClickSub =function(){
    State.isAlarmOn = false;
    State.changeState("Time");
  };
}
function StateSetAlarmHour(){
  State.call(this,"Hour");
  this.update=function(t){
    if(this.checkAlarm(t)){
      State.changeState("Alarm");
    }
  };
  this.enter=function(){
    State.view.blinkNumber(0,2);
  };
  this.exit=function(){
  };
  this.onClickCmd =function(){
    State.changeState("Minite");
  };
  this.onClickAdd =function(){
    if(++State.alarmTime[0]==24){
      State.alarmTime[0] = 0;
    }
    this.refreshPartNums(0);
  };
  this.onClickSub =function(){
    if(--State.alarmTime[0]==-1){
      State.alarmTime[0] = 23;
    }
    this.refreshPartNums(0);
  };

}
function StateSetAlarmMinite(){
  State.call(this,"Minite");
  this.update=function(t){
    if(this.checkAlarm(t)){
      State.changeState("Alarm");
    }
  };
  this.enter=function(){
    State.view.blinkNumber(2,4);
  };
  this.exit=function(){
  };
  this.onClickCmd =function(){
    State.changeState("Second");
  };
  this.onClickAdd =function(){
    if(++State.alarmTime[1]==60){
      State.alarmTime[1] = 0;
    }
    this.refreshPartNums(1);
  };
  this.onClickSub =function(){
    if(--State.alarmTime[1]==-1){
      State.alarmTime[1] = 59;
    }
    this.refreshPartNums(1);
  };
}
function StateSetAlarmSeconds(){
  State.call(this,"Second");
  this.update=function(t){
    if(this.checkAlarm(t)){
      State.changeState("Alarm");
    }
  };
  this.enter=function(){
    State.view.blinkNumber(4,6);
  };
  this.exit=function(){
  };
  this.onClickCmd =function(){
    State.changeState("Time");
  };
  this.onClickAdd =function(){
    if(++State.alarmTime[2]==60){
      State.alarmTime[2] = 0;
    }
    this.refreshPartNums(2);
  };
  this.onClickSub =function(){
    if(--State.alarmTime[2]==-1){
      State.alarmTime[2] = 59;
    }
    this.refreshPartNums(2);
  };
}
