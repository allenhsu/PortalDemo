/**
 * @author yang zhenn
 */
define(function(require,exports){
	var Tool = require('../base/tool'), 	//引入算法库
		Layout = require('../base/layout'),  //引入布局模块
		Ball = require('../base/ball'); //引入选号盘模块
		
	var collectionConfig = function(){
		return {
			lines: 1,
			key: 'swxw_common',
			localStorage: new Store('swxwcommonball'),
			deviation: -1,
			/**
			 * 验证是否符合此玩法的选号规则
			 * @memberOf BallCollection
			 * @return string or true
			 */
			verify: function(){
				var redball = this.fetchSelectNum(0);
				if(redball < 5){
					return '至少要选择5个号码';	
				}
				return true;
			},
			/**
			 * 获取投注字符串数组
			 * @param void
			 * @memberOf BallCollection
			 * @return result,如：{
			 * 						key:'ssq_common', //玩法对应key值
			 * 						value:{
			 * 							l1: ['01','02','03','04','05','06'],
			 * 							l2: ['01','02']
			 * 						},
			 * 						bet: 2,	//注数,
			 * 					}
			 * @type object
			 */
			getBetArray: function(){
				var values = {},
					selectArray = this.getSelectArray();
				for(var i=0,len=selectArray.length;i<len;i++){
					values['l'+(i+1)] = selectArray[i];
				}
				this.bet = Tool.numC(selectArray[0].length,5);
				return {
					key: this.key,
					value: values,
					bet: this.bet,
					betstr: this.getBetString()
				};
			},
			/**
			 * 提交订单时用的投注字符串
			 * @memberOf BallCollection
			 * @name getBetString 
			 */
			getBetString: function(){
				var selectArr = this.getSelectArray(),
					result = '';
				result = selectArr[0].join(' ');
				return result;
			}
		};
	};
	
	var appConfig = function(collection){
		return {
			el: '#swxw_common',
			collection: collection,
			random: function(){
				var self = this;
				self.collection.clear();
				var l1 = Tool.baseBallRandom(5,14,false,true,'ceil').sort();
				_.each(l1,function(n){
					self.collection.syncData(true,[{line:0,val:n}]);
				});
			}
		};
	};

	return {
		initialize: function(){
			Layout.doAbacusScroll();
			C.swxwcommonballcollection = new Ball.Collection(collectionConfig());
			Tool.detectLocalData('swxwcommonball',C.swxwcommonballcollection,C.Config.betHashMap['swxw']);
			C.swxwcommonballapp = new Ball.App(appConfig(C.swxwcommonballcollection));
		}
	};
});