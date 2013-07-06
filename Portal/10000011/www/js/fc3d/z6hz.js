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
			key: 'fc3d_z6hz',
			localStorage: new Store('fc3dz3hzball'),
			//选号球数字和索引偏移量
			deviation: -3,
			/**
			 * 验证是否符合此玩法的选号规则
			 * @memberOf BallCollection
			 * @return string or true
			 */
			verify: function(){
				var b = this.fetchSelectNum(0);
				if(b < 1){
					return '至少选择1个和值';	
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
				var self = this , r = [];
				var bets = this.getSelectArray(), tmp = {}, num, n, i;
	            var nums = Tool.getSummationPermutation(bets[0], 3);  
	            for (i = nums.length; -- i > -1;){
	                n = nums[i];
	                num = n.sort().join("");
	                if (tmp[num] || n[0] == n[1] || n[1] == n[2]){
	                    nums.splice(i, 1);
	                }else{
	                    tmp[num] = 1;
	                }
	            }
				_.each(nums,function(n){
					var obj  = {
						key: 'fc3d_z6',
						value: {
							l1: n
						},
						bet: 1,
						betstr: self.getBetString(n),
						canEdit: false
					};
					r.push(obj);
				});
				return r;
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
			el: '#fc3d_z6hz',
			collection: collection,
			random: function(){
				var self = this;
				self.collection.clear();
				var l1 = Tool.baseBallRandom(1,24,false,false,'floor',3).sort();
				_.each(l1,function(n){
					self.collection.syncData(true,[{line:0,val:n}]);
				});
			}
		};
	};

	return {
		initialize: function(){
			Layout.doAbacusScroll().doTypeListScroll(-140);
			C.fc3dz6hzballcollection = new Ball.Collection(collectionConfig());
			Tool.detectLocalData('fc3dz6hzball',C.fc3dz6hzballcollection);
			C.fc3dz6hzballapp = new Ball.App(appConfig(C.fc3dz6hzballcollection));
		}		
	};
});