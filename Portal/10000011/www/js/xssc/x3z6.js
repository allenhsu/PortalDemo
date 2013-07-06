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
			key: 'xssc_x3z6',
			localStorage: new Store('xsscx3z6ball'),
			deviation: 0,
			/**
			 * 验证是否符合此玩法的选号规则
			 * @memberOf BallCollection
			 * @return string or true
			 */
			verify: function(){
				var b = this.fetchSelectNum(0);
				if(b < 3){
					return '请选择3个或以上的号码进行投注';	
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
					bet: Tool.numC(selectArray[0].length,3),
					betstr: self.getBetString(selectArray[0]),
					manualFirst: true
				};
				return r;
			},
			/**
			 * 获得投注字符串，用于提交订单
			 * @memberOf 
			 * @name getBetString
			 * @return 
			 */
			getBetString: function(arr){
				var result = Tool.C(arr,3) , a = [];
				_.each(result,function(n){
					a.push('7:-,-,' + n.join(','));
				});
				return a.join('&');
			}
		};
	};
	
	var appConfig = function(isManualFirst,collection){
		return {
			el: '#xssc_x3z6',
			collection: collection,
			noRepeat: false,
			manualFirst: isManualFirst,
			random: function(){
				var self = this;
				self.collection.clear();
				var l1 = Tool.baseBallRandom(3,10,false,false,'floor').sort();
				_.each(l1,function(n){
					self.collection.syncData(true,[{line:0,val:n}]);
				});
			}
		};
	};
	
	return {
		initialize: function(isManualFirst){
			Layout.doAbacusScroll().doTypeListScroll(-280);
			C.xsscx3z6ballcollection = new Ball.Collection(collectionConfig());
			Tool.detectLocalData('xsscx3z6ball',C.xsscx3z6ballcollection);
			C.xsscx3z6ballapp = new Ball.App(appConfig(isManualFirst,C.xsscx3z6ballcollection));
		}
		
	};
});