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
			key: 'xssc_x1zhx',
			localStorage: new Store('xsscx1zhxball'),
			deviation: 0,
			/**
			 * 验证是否符合此玩法的选号规则
			 * @memberOf BallCollection
			 * @return string or true
			 */
			verify: function(){
				var b = this.fetchSelectNum(0);
				if(b < 1){
					return '个位至少选择1个号码';	
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
				var self = this,
					r = [],
					selectArray = this.getSelectArray();
				return {
					key: self.key,
					value: {
						l1: selectArray[0]
					},
					bet: selectArray[0].length,
					betstr: self.getBetString(selectArray[0]),
					manualFirst: true
				};
			},
			/**
			 * 获得投注字符串，用于提交订单
			 * @memberOf 
			 * @name getBetString
			 * @return 
			 */
			getBetString: function(arr){
				var result = [] , str = '';
				_.each(arr,function(n){
					result.push('1:-,-,-,-,' + n);
				});
				str = result.join('&');
				return str;
			}
		};
	};
	
	var appConfig = function(isManualFirst,collection){
		return {
			el: '#xssc_x1zhx',
			collection: collection,
			noRepeat: false,
			manualFirst: isManualFirst,
			random: function(){
				var self = this;
				self.collection.clear();
				var l1 = Tool.baseBallRandom(1,10,false,false,'floor').sort();
				_.each(l1,function(n){
					self.collection.syncData(true,[{line:0,val:n}]);
				});
			}
		};
	};

	return {
		initialize: function(isManualFirst){
			Layout.doAbacusScroll().doTypeListScroll(0);
			C.xsscx1zhxballcollection = new Ball.Collection(collectionConfig());
			Tool.detectLocalData('xsscx1zhxball',C.xsscx1zhxballcollection);
			C.xsscx1zhxballapp = new Ball.App(appConfig(isManualFirst,C.xsscx1zhxballcollection));
		}
		
	};
});