/**
 * @author yang zhenn
 */
define(function(require,exports){
	var Tool = require('../base/tool'), 	//引入算法库
		Layout = require('../base/layout'),  //引入布局模块
		Ball = require('../base/ball'); //引入选号盘模块
		
	var collectionConfig = function(){
		return {
			lines: 5,
			key: 'xssc_x5tx',
			localStorage: new Store('xsscx5txball'),
			deviation: 0,
			/**
			 * 验证是否符合此玩法的选号规则
			 * @memberOf BallCollection
			 * @return string or true
			 */
			verify: function(){
				var b = this.fetchSelectNum(0),
					d = this.fetchSelectNum(1),
					e = this.fetchSelectNum(2),
					f = this.fetchSelectNum(3),
					g = this.fetchSelectNum(4);
				if(b < 1){
					return '万位至少选择1个号码';	
				}else if(d < 1){
					return '千位至少选择1个号码';
				}else if(e < 1){
					return '百位至少选择1个号码';
				}else if(f < 1){
					return '十位至少选择1个号码';
				}else if(g < 1){
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
						l1: selectArray[0],
						l2: selectArray[1],
						l3: selectArray[2],
						l4: selectArray[3],
						l5: selectArray[4]
					},
					bet: selectArray[0].length * selectArray[1].length * selectArray[2].length * selectArray[3].length * selectArray[4].length,
					betstr: self.getBetString(selectArray),
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
				var result = Tool.getCompoundPermutation(arr,',') , a = [];
				_.each(result,function(n){
					a.push('5:' + n);
				});
				return a.join('&');
			}
		};
	};
	
	var appConfig = function(isManualFirst,collection){
		return {
			el: '#xssc_x5tx',
			collection: collection,
			noRepeat: false,
			manualFirst: isManualFirst,
			random: function(){
				var self = this;
				self.collection.clear();
				var l1 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
					l2 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
					l3 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
					l4 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
					l5 = Tool.baseBallRandom(1,10,false,false,'floor').sort();
				_.each(l1,function(n){
					self.collection.syncData(true,[{line:0,val:n}]);
				});
				_.each(l2,function(n){
					self.collection.syncData(true,[{line:1,val:n}]);
				});
				_.each(l3,function(n){
					self.collection.syncData(true,[{line:2,val:n}]);
				});
				_.each(l4,function(n){
					self.collection.syncData(true,[{line:3,val:n}]);
				});
				_.each(l5,function(n){
					self.collection.syncData(true,[{line:4,val:n}]);
				});
			}
		};
	};

	return {
		initialize: function(isManualFirst){
			Layout.doAbacusScroll().doTypeListScroll(-350);
			C.xsscx5txballcollection = new Ball.Collection(collectionConfig());
			Tool.detectLocalData('xsscx5txball',C.xsscx5txballcollection);
			C.xsscx5txballapp = new Ball.App(appConfig(isManualFirst,C.xsscx5txballcollection));
		}
	};
});