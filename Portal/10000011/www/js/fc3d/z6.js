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
			key: 'fc3d_z6',
			localStorage: new Store('fc3dz6ball'),
			deviation: 0,
			/**
			 * 验证是否符合此玩法的选号规则
			 * @memberOf BallCollection
			 * @return string or true
			 */
			verify: function(){
				var b = this.fetchSelectNum(0);
				if(b < 3){
					return '至少选择3个球';	
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
				var result = [],
					self = this,
					selArray = this.getSelectArray(),
					tarBet = Tool.C(selArray[0],3);
				_.each(tarBet,function(n){
					var obj = {
						key: self.key,
						value: {
							l1: n
						},
						bet: 1,
						betstr: self.getBetString(n),
						canEdit: false
					};
					result.push(obj);
				});
				return result;		
			},
			/**
			 * 获得投注字符串，用于提交订单
			 * @memberOf 
			 * @name getBetString
			 * @return 
			 */
			getBetString: function(n){
				/**
				 * 0 -> 直选
				 * 1 -> 组三
				 * 2 -> 组六
				 */
				return n.join('') + ':2';
			}
		};
	};
	
	var appConfig = function(collection){
		return {
			el: '#fc3d_z6',
			collection: collection,
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
		initialize: function(){
			Layout.doAbacusScroll().doTypeListScroll(-70);
			C.fc3dz6ballcollection = new Ball.Collection(collectionConfig());
			Tool.detectLocalData('fc3dz6ball',C.fc3dz6ballcollection);
			C.fc3dz6ballapp = new Ball.App(appConfig(C.fc3dz6ballcollection));
		}
	};
});