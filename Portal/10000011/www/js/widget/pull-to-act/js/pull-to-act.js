
define(function(require,exports){
	//请求依赖的基础库
	var S = require('../../../lib/iscroll');
	
	var PullAct = function(){
		this.init.apply(this,arguments);
	};
	PullAct.prototype = {
		init: function(id,cfg){
			this.initParam(id,cfg).insertGuide().buildScroll();
		},
		// 构建实例化参数，设置默认值
		initParam: function(id,cfg){
			cfg = $.extend({
				bindPullDown: false,   //是否监听pulldown
				bindPullUp: false,		//是否监听pullup
				downGuideCon: '下拉可以更新', //下拉引导层文案
				upGuideCon: '上拉可以更新',	//上拉引导层文案
				reverseCon: '松开即可更新',	//引导层反转后文案，上拉、下拉同时适用
				loading: '加载中...',		//加载中的提示文案
				downAct: function(){},
				upAct: function(){}
			},cfg);
			this.id = id;
			this.cfg = cfg;
			return this;
		},
		// 按照监听pull的方向，插入引导层
		insertGuide: function(){
			var scrollMain = this.scrollMain = $(this.id + ' .p-list') ;
			if(this.cfg.bindPullDown === true){
				var downGuide = this.downGuide = $('<div class="p-down"><s></s><span>' + this.cfg.downGuideCon + '</span></div>');
				scrollMain.before(downGuide);
				this.downGuideTip = downGuide.find('span');
				this.downGuideHeight = downGuide.height();
			}
			if(this.cfg.bindPullUp === true){
				var	upGuide = this.upGuide = $('<div class="p-up"><s></s><span>' + this.cfg.upGuideCon + '</span></div>');
				scrollMain.after(upGuide);
				this.upGuideTip = upGuide.find('span');
				this.upGuideHeight = upGuide.height();
			}
			
			return this;
		},
		destroy: function(){
			this.scroll.destroy();
		},
		// 获取原始的iscroll对象
		getScrollObj: function(){
			return this.scroll;
		},
		// 创建iscroll对象
		// 绑定一些事件句柄，实现pull-to-act内部逻辑控制
		buildScroll: function(){
			var self = this;
			self.scroll = new S.iScroll(self.id.replace('#',''),{
				topOffset: self.downGuideHeight,
				hScroll: false,
				checkDOMChanges: false,
				onRefresh: function(){
					setTimeout(function(){
						if(typeof self.downGuide !== 'undefined' && self.downGuide.hasClass('p-loading')) {
							self.downGuide.removeClass('p-loading');
							self.downGuideTip.html(self.cfg.downGuideCon);
						}else if(typeof self.upGuide !== 'undefined' && self.upGuide.hasClass('p-loading')) {
							self.upGuide.removeClass('p-loading');
							self.upGuideTip.html(self.cfg.upGuideCon);
						}
						
					},300);
				},
				//scroll时
				onScrollMove: function(){
					var that = this;
					self.timer && clearTimeout(self.timer);
					//增加20ms延时，减少dom渲染的压力
					self.timer = setTimeout(function(){
						if(self.cfg.bindPullDown === true){
							if(that.y > 5 && !self.downGuide.hasClass('p-rotate')){
								self.downGuideTip.html(self.cfg.reverseCon);
								self.downGuide.addClass('p-rotate');
								that.minScrollY = 0;
							}else if(that.y < 5 && self.downGuide.hasClass('p-rotate')){
								self.downGuideTip.html(self.cfg.guideCon);
								self.downGuide.removeClass('p-rotate');
								that.minScrollY = -self.downGuideHeight;
							}
						}
						if(self.cfg.bindPullUp === true){
							if(that.y < (that.maxScrollY - 5) && !self.upGuide.hasClass('p-rotate')){
								self.upGuide.addClass('p-rotate');
								self.upGuideTip.html(self.cfg.reverseCon);
							}else if (that.y > (that.maxScrollY + 5) && self.upGuide.hasClass('p-rotate')) {
								self.upGuide.removeClass('p-rotate');
								self.upGuideTip.html(self.cfg.upGuideCon);
							}
						}
					},20);
				},
				//监测scroll结束
				onScrollEnd: function(){
					var that = this;
					if(self.cfg.bindPullDown === true && self.downGuide.hasClass('p-rotate')){
						self.downGuide.removeClass('p-rotate').addClass('p-loading');
						self.downGuideTip.html(self.cfg.loading);
						self.cfg.downAct.call(self);
					}
					if(self.cfg.bindPullUp === true && self.upGuide.hasClass('p-rotate')){
						self.upGuide.removeClass('p-rotate').addClass('p-loading');
						self.upGuideTip.html(self.cfg.loading);
						self.cfg.upAct.call(self);
					}
				}
			});
			
		}
	};
	//暴露内置接口给外部使用
	exports.initialize = PullAct;
	
});

