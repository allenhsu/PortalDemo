
/**
 * 声明seajs模块
 */
define(function(require, exports, module){
	var Tool = require('../base/tool'),
		Layout = require('../base/layout'),
		Calendar = require('../widget/calendar/calendar'),
		Reward = require('./detail2');
		
	return {
		initialize: function(){
			C.JCZQ = new Reward.app({
				lotteryType: 21,
				lotteryTypeName: 'JCZQ',
				lotteryTypeLocalName: '竞彩足球',
				tpl: $('#ZQItemTemp').html(),
				getData: function() {
					var self = this,
						date = new Date(),
						curDate = date.getFullYear() + '' + C.Template.bitHandle(date.getMonth() + 1, 2) + '' + C.Template.bitHandle(date.getDate(), 2);
					self.dateTime = curDate;
					
					//Calendar
					self.calendar = Calendar.create('#myCalendar',{
						trigger: '#calendar',
						onSelect: function(o){
							$('#myCalendar').addClass('hidden');
							self._tag = false;
							var t = o.year + '' + C.Template.bitHandle(o.month, 2) + '' + C.Template.bitHandle(o.date, 2);
							//如两次选择时间相同，跳出
							if(self.dateTime == t) return;
						
							Layout.transBox('正在努力请求数据');
							self.dateTime = t;
							var url = C.Config.getRewardDataListUrl() + '?callback=C.JCZQ.initReward&lotteryTypeId=' + self.lotteryTypeName + '&dateTime=' + t + '&t=' + new Date().getTime();
							Tool.getScript(url);
						},
						disabledStart: date.getFullYear() + '' + C.Template.bitHandle(date.getMonth() + 1, 2) + '' + C.Template.bitHandle(date.getDate() + 1, 2)
					});				
					
					$(document).on('click',function(e){
						$('#myCalendar').addClass('hidden');
						Layout.removeTransBox();
						self._tag = false;
					});
					
					//get Data
					var url = C.Config.getRewardDataListUrl() + '?callback=C.JCZQ.initReward&lotteryTypeId=' + self.lotteryTypeName + '&dateTime=' + self.dateTime + '&t=' + new Date().getTime();
					Tool.getScript(url);
				},
				showHistory: function() {
					if (this._tag) {
						return;
					}
					this._tag = true;
					Layout.buildMaskLayer();
					C.Config.simulateClick($('#calendar')[0]);
				}
			});
		}
	}
});


