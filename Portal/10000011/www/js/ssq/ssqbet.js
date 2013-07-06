/**
 * @author yang zhenn
 */
define(function(require,exports){
	var Layout = require('../base/layout'),	//引入布局模块
		Bet = require('../base/bet'),
		Tool = require('../base/tool');  //引入算法库
	
	var collectionConfig = function(){
		return {
			localStorage: new Store('ssqbet'),
			tempBox: '#ssqBetViewTemp',
			maxBt: 50,
			/**
			 * 机选产生一注
			 * @name random
			 * @memberOf BetCollection
			 */
			random: function(){
				var reds = Tool.baseBallRandom(6,33,false,true,'ceil').sort(),
					blues = Tool.baseBallRandom(1,16,false,true,'ceil').sort();
				var result = {
					key: C.Config.key,
					bet: 1,
					value: {
						l1: reds,
						l2: blues
					},
					betstr: reds.join(' ') + ':' + blues.join(' ')
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
			key: 'ssq_common',
			title: '双色球',
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
				if(num.indexOf('$') >= 0){
					return;
				}
				var arr = num.split('&');
				
				_.each(arr,function(val){
					var _arr = val.split(':');
					self.collection.create({
						key: C.Config.key,
						bet: parseInt(_arr[2]),
						value: {
							l1: _arr[0].split(' '),
							l2: _arr[1].split(' ')
						},
						betstr: _arr[0] + ':' + _arr[1]
					});
					
				});
			}
		};
	};
	
	return {
		initialize: function(){
			C.betcollection = new Bet.Collection(collectionConfig());
			//以下是业务逻辑
			C.betapp = new Bet.App(appConfig(C.betcollection));
			Tool.detectLocalData('ssqbet',C.betcollection,location.hash,C.Config.tipDetect);
			C.betapp.continueBuy();
		}
	};
});
