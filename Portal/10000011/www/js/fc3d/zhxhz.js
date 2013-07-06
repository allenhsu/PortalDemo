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
			key: 'fc3d_zhxhz',
			localStorage: new Store('fc3dzhxhzball'),
			deviation: 0,
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
				var self = this,
					r = [],
					selectArray = this.getSelectArray();
				var resultArr = Tool.getSummationPermutation(selectArray[0],3);
				_.each(resultArr,function(n){
					var obj = {
						key: 'fc3d_zhx',
						//用于渲染投注蓝模板
						value: {
							l1: [n[0]],
							l2: [n[1]],
							l3: [n[2]]
						},
						bet: 1,
						betstr: self.getBetString(n)
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
				return n.join('') + ':0';
			}
		};
	};
	
	var appConfig = function(collection){
		return {
			el: '#fc3d_zhxhz',
			collection: collection,
			random: function(){
				var self = this;
				self.collection.clear();
				var l1 = Tool.baseBallRandom(1,27,false,false,'floor').sort();
				_.each(l1,function(n){
					self.collection.syncData(true,[{line:0,val:n}]);
				});
			}
		};
	};

	return {
		initialize: function(step){
			Layout.doAbacusScroll().doTypeListScroll(0);
			C.fc3dzhxhzballcollection = new Ball.Collection(collectionConfig());
			Tool.detectLocalData('fc3dzhxhzball',C.fc3dzhxhzballcollection);
			C.fc3dzhxhzballapp = new Ball.App(appConfig(C.fc3dzhxhzballcollection));
		}
	};
});