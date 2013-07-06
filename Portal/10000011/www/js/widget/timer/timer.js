/**
 * @author 栋寒(zhenn)
 * @Email  donghan@taobao.com
 */
define(function(require,exports,module){
	var Timer = function(){
		this.initialize.apply(this,arguments);
	};
	/**
	 * 倒计时原型
	 */
	Timer.prototype = {
		/**
		 * 构造函数
		 * @param node{node} 需要渲染的node节点
		 * @return void
		 */
		initialize: function(node,cfg){
			this.node = node;
			this.remainTime = cfg.remainTime;
			this.callback = cfg.callback;	
			this.splitTime();
			this.startTimer();
		},
		//拆分剩余时间到天时秒分
		splitTime: function(){
			var that = this;
			var rtime = that.remainTime;
			that.days = Math.floor(rtime/86400 );
			var rder1 = rtime % 86400000;
			that.hours = Math.floor(rder1/3600);
			var rder2 = rder1 % 3600000;
			that.minutes = Math.floor(rder2/60);
			that.seconds = rder2 % 60;
		},
		/**
		 * 开启定时器
		 */
		startTimer: function(){
			var that = this;
			that.timerProgram = setInterval(function(){
				that.timer.call(that);	
			},1000);
		},
		/**
		 * 定时器逻辑
		 */
		timer: function(){
			var that = this,
				node = that.node;
			if(that.seconds>0){
				that.seconds--;
			}else{
				that.seconds = 59;
				if(that.minutes>0){
					that.minutes--;
				}else{
					that.minutes = 59;
					if(that.hours>0){
						that.hours--;
					}else{
						that.hours = 23;
						if(that.days > 0 ){
							that.days--;	
						}
					}
				}
			}
			//时刻监听
			if(that.days == 0 && that.hours==0 && that.minutes==0 && that.seconds==0){
				//执行回调
				that.end();
			}
			//that.node.eq(0).html(that.days);
			//that.node.eq(1).html(that.hours);
			that.node.eq(0).html(that.padding(that.minutes));
			that.node.eq(1).html(that.padding(that.seconds));
		},
		padding: function(num){
			return num < 10 ? '0' + num : num;
		},
		/**
		 * 倒计时停止时的回调
		 */
		end: function(){
			var that = this;
			clearInterval(that.timerProgram);
			that.node.eq(0).html(0);
			that.node.eq(1).html(0);
			that.callback.call(that);
			//that.node.eq(2).html(0);
			//that.node.eq(3).html(0);
		},
		destroy: function(){
			var that = this;
			clearInterval(that.timerProgram);
		}

	};
	
	return {
		initialize: Timer
	};
});
