
define(function(require,exports){
	var Layout = require('../base/layout');  //引入布局模块
	var Tool = require('../base/tool');
	var NavApp = Backbone.View.extend({
		el: '#appMenu',
		events: {
			'touchstart li': 'taped',
			'touchend li': 'notap',
			'click a': 'pushWindow'
		},
		pushWindow: function(e){
			var obj = $(e.currentTarget);
			if(obj.parent().hasClass('stopSale')){
				return;
			}
			var self = this;
			if (self.timers) {
				clearTimeout(self.timers);
			}
			self.timers = setTimeout(function() {
				alipay.navigation.pushWindow(obj.attr('rel'));
			} , 300);
		},
		taped: function(e){
			var obj = $(e.currentTarget);
			obj.addClass('taped');
		},
		notap: function(e){
			var lis = this.$el.find('li');
			lis.removeClass('taped');
		},
		/**
		 * 初始化
		 * @memberOf NavApp
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		initialize: function(step){
			var self = this;
			this.fetchIssue();
			//注册frompop事件
			document.addEventListener("frompop", function(){
				//self.fetchIssue();
				self.continueBuy();
			}, false);
			//注册程序从后台激活事件，，重新获取彩期
			document.addEventListener('resume',function(){
				self.fetchIssue();
			},false);
			
		},
		continueBuy: function(){
			var numbers = localStorage.getItem('continueBuy');
			//navigator.notification.alert(numbers);
			if(numbers === null){
				return;
			}
			var	obj = JSON.parse(numbers),
				type = obj.lotteryType;
			switch(type){
				case 1:
					alipay.navigation.pushWindow('ssq/ssqbet.html');
					break;
				case 8:
					alipay.navigation.pushWindow('dlt/dltbet.html');
					break;
				case 15:
					alipay.navigation.pushWindow('syy/bet.html');
					break;
				case 14:
					alipay.navigation.pushWindow('xssc/bet.html');
					break;
				case 7:
					alipay.navigation.pushWindow('qlc/bet.html');
					break;
				case 2:
					alipay.navigation.pushWindow('fc3d/bet.html');
					break;
				case 22:
					alipay.navigation.pushWindow('swxw/bet.html');
					break;
				default:
					break;
			}
		},
		//获取彩期
		fetchIssue: function(){
			Tool.getScript(C.Config.getIssueDataUrl() + '?typeId=' + C.Config.doneLot.toString() + '&callback=C.navapp.issueHandle&t=' + new Date().getTime());
		},
		//在本地存储中管理彩期数据，下次获取覆盖即可
		issueHandle: function(obj){
			var lis = this.$el.find('li');
			if(obj.status){
				_.each(obj.results,function(n){
					if(!n.status){
						for(var i=0,len=lis.length;i<len;i++){
							if(lis.eq(i).attr('typeid') == n.lotteryType){
								if(n.resultCode == 'stop_sale' || n.resultCode == 'issue_stop_sale'){
									lis.eq(i).addClass('stopSale');
									lis.eq(i).find('.txt p').eq(1).html('抱歉，本彩种暂停销售');
								}
								break;
							}
						}
					}
					
					localStorage.setItem('issueData_' + n.lotteryType , JSON.stringify(n));
					//alert(JSON.stringify(n));
				});
			}
		}
	});
	
	return {
		initialize: function(){
			//Layout.singleScroll('appMenu',{});
			C.navapp = new NavApp();
		}
	};
});
