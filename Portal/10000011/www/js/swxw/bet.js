/**
 * @author yang zhenn
 */
define(function(require,exports){
	var Layout = require('../base/layout'),	//引入布局模块
		Bet = require('../base/bet'),
		Tool = require('../base/tool');  //引入算法库
	
	var collectionConfig = function(){
		return {
			localStorage: new Store('swxwbet'),
			tempBox: '#qlcBetViewTemp',
			maxbt: 99,
			/**
			 * 机选产生一注
			 * @name random
			 * @memberOf BetCollection
			 */
			random: function(){
				var reds = Tool.baseBallRandom(5,15,false,true,'ceil').sort();
				var result = {
					key: C.Config.key,
					bet: 1,
					value: {
						l1: reds
					},
					betstr: reds.join(' ')
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
			key: 'swxw_common',
			title: '15选5',
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
				if(num.indexOf(':') > 0){
					return;
				}
				var arr = num.split('&');
				_.each(arr,function(val){
					var _arr = val.split(' ');
					var bets = Tool.numC(_arr.length,5);
					self.collection.create({
						key: C.Config.key,
						bet: bets,
						value: {
							l1: _arr,
						},
						betstr: val
					});
					
				});
			}
		};
	};

	return {
		initialize: function(step){
			C.betcollection = new Bet.Collection(collectionConfig());
			//以下是业务逻辑
			C.betapp = new Bet.App(appConfig(C.betcollection));
			Tool.detectLocalData('swxwbet',C.betcollection,location.hash,C.Config.tipDetect);
			C.betapp.continueBuy();
		}
	};
});
