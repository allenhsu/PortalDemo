/**
 * @author yang zhenn
 */
define(function(require,exports){
	var Layout = require('../base/layout'),	//引入布局模块
		Bet = require('../base/bet'),
		Tool = require('../base/tool');  //引入算法库
	
	var collectionConfig = function(){
		return {
			localStorage: new Store('qlcbet'),
			tempBox: '#qlcBetViewTemp',
			maxbt: 99,
			/**
			 * 机选产生一注
			 * @name random
			 * @memberOf BetCollection
			 */
			random: function(){
				var reds = Tool.baseBallRandom(7,30,false,true,'ceil').sort();
				var result = {
					key: C.Config.key,
					bet: 1,
					value: {
						l1: reds
					},
					betstr: reds.join(' ') + ':1'
				};
				this.create(result);
			},
			/**
			 * 获取投注投注字符串
			 * @name getNumberString
			 * @memberOf BetCollection
			 * @return 
			 */
			getNumberString: function(){
				var arr = [];
				this.each(function(model){
					//如果是创建collection实例时，传进来的model，忽略之
					if(model.get('tempBox')) return;
					arr.push(model.get('betstr'));
				});
				return arr.join('&');
			}
		};
	};
	
	var appConfig = function(collection){
		return {
			el: '#betScroll',
			collection: collection,
			key: 'qlc_common',
			title: '七乐彩',
			rightbar: function(){
				alipay.navigation.pushWindow('common.html');
			},
			/**
			 * 增加继续购买的选号
			 * @param num{string} 选号字符串，如01 03 04 05 06 07:01 02:2:4&01 03 04 05 06 07:01 02:2:4
			 */
			addContinues: function(num){
				var self = this;
				self.collection.clear();
				//胆拖号码,直接返回
				var arr = num.split('&');
				var isdt = false;
				_.each(arr,function(n){
					var _a = n.split(':');
					if(_a.length > 2){
						isdt = true;
					}	
				});
				if(isdt){
					return;
				}
				_.each(arr,function(val){
					var _arr = val.split(':');
					var bets = Tool.numC(_arr[0].split(' ').length,7);
					var t = bets > 1 ? '2' : '1';
					self.collection.create({
						key: C.Config.key,
						bet: bets,
						value: {
							l1: _arr[0].split(' '),
						},
						betstr: val
					});
				});
			}
		};
	};
	
	return {
		initialize: function(){
			C.betcollection = new Bet.Collection(collectionConfig());
			C.betapp = new Bet.App(appConfig(C.betcollection));
			Tool.detectLocalData('qlcbet',C.betcollection,location.hash,C.Config.tipDetect);
			C.betapp.continueBuy();
		}
	};
});