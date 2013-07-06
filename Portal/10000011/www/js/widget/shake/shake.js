
define(function(require,exports){
	/**
	 * shake类
	 */
	var Shake = function(){
		this.SHAKE_THRESHOLD = 2000;
		this.last_x = 0;
		this.last_y = 0;
		this.last_z = 0;
		this.lastUpdate = 0;
		this.eventSplitter = /\s+/;
		this.init.apply(this,arguments);
	};
	
	Shake.prototype = {
		init: function(cfg){
			var self = this;
			if(window.DeviceMotionEvent) {
				window.addEventListener('devicemotion',function(){
					self.deviceMotionHandler.apply(self,arguments);
				},false);
			}	
		},
		//绑定自定义事件
		on: function(events, callback, context) {
			var calls, event, list;
			if (!callback) return this;
			events = events.split(this.eventSplitter);
			calls = this._callbacks || (this._callbacks = {});
			while (event = events.shift()) {
				list = calls[event] || (calls[event] = []);
				list.push(callback, context);
			}
			return this;
		},
		//解除自定义事件
		off: function(events, callback, context) {
			var event, calls, list, i;
			if (!(calls = this._callbacks)) return this;
			if (!(events || callback || context)) {
				delete this._callbacks;
				return this;
			}
			events = events ? events.split(this.eventSplitter) : _.keys(calls);
			while (event = events.shift()) {
				if (!(list = calls[event]) || !(callback || context)) {
					delete calls[event];
					continue;
				}
				for (i = list.length - 2; i >= 0; i -= 2) {
					if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
						list.splice(i, 2);
					}
				}
			}
			return this;
		},
		//触发自定义事件
		fire: function(events) {
			var event, calls, list, i, length, args, all, rest;
			if (!(calls = this._callbacks)) return this;
			rest = [];
			events = events.split(this.eventSplitter);
			for (i = 1, length = arguments.length; i < length; i++) {
				rest[i - 1] = arguments[i];
			}
			while (event = events.shift()) {
				if (all = calls.all) all = all.slice();
				if (list = calls[event]) list = list.slice();
				if (list) {
					for (i = 0, length = list.length; i < length; i += 2) {
						list[i].apply(list[i + 1] || this, rest);
					}
				}
				if (all) {
					args = [event].concat(rest);
					for (i = 0, length = all.length; i < length; i += 2) {
						all[i].apply(all[i + 1] || this, args);
					}
				}
			}
			return this;
		},
		deviceMotionHandler: function(e){
			var self = this , x, y, z,
				acceleration = e.accelerationIncludingGravity,
				curTime = new Date().getTime();
			if((curTime - self.lastUpdate) > 100) {
				var diffTime = (curTime - self.lastUpdate);
				self.lastUpdate = curTime;
				x = acceleration.x;
				y = acceleration.y;
				z = acceleration.z;
				var speed = Math.abs(x + y + z - self.last_x - self.last_y - self.last_z) / diffTime * 10000;
				if(speed > self.SHAKE_THRESHOLD){
					//防止一次不间断摇晃，执行多次回调
					self.sharkTimer && clearTimeout(self.sharkTimer);
					self.sharkTimer = setTimeout(function(){
						//fire摇一摇的自定义事件
						self.fire('yaoyiyao');
					},500);
				}
				self.last_x = x;
				self.last_y = y;
				self.last_z = z;
			} 
		}
	};
	
	exports.init = Shake;
	
});
