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
			key: 'fc3d_z3',
			localStorage: new Store('fc3dz3ball'),
			deviation: 0,
			/**
			 * 验证是否符合此玩法的选号规则
			 * @memberOf BallCollection
			 * @return string or true
			 */
			verify: function(){
				var b = this.fetchSelectNum(0);
				if(b < 2){
					return '至少选择2个球';	
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
				
				var nums = this.getSelectArray()[0], result = [], k = this.key, size = nums.length, i = 0, j;
				for (; i < size; ++ i){
					for (j = 0; j < size; ++ j){
						if(j != i){
							result[result.length] = {
								key: k,
								value: {
									l1: [nums[i],nums[i],nums[j]]
								},
								bet: 1,
								betstr: this.getBetString(''+nums[i]+nums[i]+nums[j]),
								canEdit: false
							};
						}
					}
				}	
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
				return n + ':1';
			}
		};
	};
	
	
	
	var appConfig = function(collection){
		return {
			el: '#fc3d_z3',
			collection: collection,
			random: function(){
				var self = this;
				self.collection.clear();
				var l1 = Tool.baseBallRandom(2,10,false,false,'floor').sort();
				_.each(l1,function(n){
					self.collection.syncData(true,[{line:0,val:n}]);
				});
			}
		};
	};
	

	return {
		initialize: function(step){
			//延迟500ms，保证在页面切换动画完成之后，执行业务逻辑
				Layout.doAbacusScroll().doTypeListScroll(0);
				C.fc3dz3ballcollection = new Ball.Collection(collectionConfig());
				Tool.detectLocalData('fc3dz3ball',C.fc3dz3ballcollection);
				C.fc3dz3ballapp = new Ball.App(appConfig(C.fc3dz3ballcollection));
		}
		
	};
});