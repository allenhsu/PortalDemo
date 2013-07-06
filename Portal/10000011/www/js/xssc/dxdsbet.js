/**
 * @author yang zhenn
 */
define(function(require,exports){
	var Layout = require('../base/layout'),	//引入布局模块
		Bet = require('../base/bet'),
		Tool = require('../base/tool');  //引入算法库
	
	var collectionConfig = function(){
		return {
			localStorage: new Store('xsscbet'),
			tempBox: '#xsscBetViewTemp',
			maxbt: 49,
			/**
			 * 机选产生一注
			 * @name random
			 * @memberOf BetCollection
			 */
			random: function(){
				var line1 = Tool.baseBallRandom(1,4,false,false,'ceil').sort(),
					line2 = Tool.baseBallRandom(1,4,false,false,'ceil').sort();
				var result = {
					key: C.Config.key,
					bet: 1,
					value: {
						l1: line1,
						l2: line2
					},
					betstr: '' + line1[0] + line2[0]
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
	
	
	var appConfig = function(step,collection){
		return $.extend({
			step: step
		},{
			el: '#betBasket',
			collection: collection,
			key: 'xssc_dxds',
			title: '新时时彩',
			/**
			 * 增加继续购买的选号
			 * @param num{string} 选号字符串，如01 03 04 05 06 07:01 02:2:4&01 03 04 05 06 07:01 02:2:4
			 */
			addContinues: function(num){
				var self = this;
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
		});
	};
	

	return {
		initialize: function(step){
			var self = this;
			Layout.initialize().renderView('#betBasketTemp',step);
			//延迟500ms，保证在页面切换动画完成之后，执行业务逻辑
			var delayTime = 0,
				pf = C.Config.platform;
			if(pf === 'ios'){
				delayTime = 500;
			}
			_.delay(function(){
				C.betcollection = new Bet.Collection(collectionConfig());
				//以下是业务逻辑
				C.betapp = new Bet.App(appConfig(step,C.betcollection));
				Tool.detectLocalData('xsscbet',C.betcollection,location.hash,C.Config.tipDetect);
				C.betapp.continueBuy();
				
				var hasEdit = false;
				for(var i=C.betcollection.models.length;i--;){
					if(C.betcollection.models[i].get('editing') === true){
						hasEdit = true;
						var _index = i;
						break;
					}
				}
				if(hasEdit){
					self.editNow(i);
				}else{
					self.insertNewSelect();
				}
				
				C.betapp.loadSubmit();
			},delayTime);
		},
		editNow: function(index){
			//判断是否在当前hash刷新,或者直接进入当前hash
			if(typeof C.xsscdxdsballcollection === 'undefined' || C.xsscdxdsballcollection.verify() != true){
				return;
			}
			var betArray = C.xsscdxdsballcollection.getBetArray();
			C.betcollection.models[index].set(betArray);
			C.betcollection.models[index].set({
				editing: false
			});
			C.betcollection.models[index].save();
			//清除选号盘集合中的数据
			
			//清除选号盘集合中的数据
			typeof C.xsscx1zhxballcollection !== 'undefined' && C.xsscx1zhxballcollection.clear();
			typeof C.xsscdxdsballcollection !== 'undefined' && C.xsscdxdsballcollection.clear();
			typeof C.xsscx2zhxballcollection !== 'undefined' && C.xsscx2zhxballcollection.clear();
			typeof C.xsscx2zxballcollection !== 'undefined' && C.xsscx2zxballcollection.clear();
			typeof C.xsscx3zhxballcollection !== 'undefined' && C.xsscx3zhxballcollection.clear();
			typeof C.xsscx3z3ballcollection !== 'undefined' && C.xsscx3z3ballcollection.clear();
			typeof C.xsscx3z6ballcollection !== 'undefined' && C.xsscx3z6ballcollection.clear();
			typeof C.xsscx4zhxballcollection !== 'undefined' && C.xsscx4zhxballcollection.clear();
			typeof C.xsscx5zhxballcollection !== 'undefined' && C.xsscx5zhxballcollection.clear();
			typeof C.xsscx5txballcollection !== 'undefined' && C.xsscx5txballcollection.clear();
		},
		/**
		 * 插入新的选号到投注列表
		 * @memberOf ssqbet
		 */
		insertNewSelect: function(){
			//判断是否在当前hash刷新,或者直接进入当前hash
			if(typeof C.xsscdxdsballcollection !== 'undefined' && C.xsscdxdsballcollection.verify() === true){
				//获取选号盘产生的选号对象，不区分普通、胆拖
				var betArray = C.xsscdxdsballcollection.getBetArray();
				C.betcollection.create(betArray);
				//清除选号盘集合中的数据
				C.xsscdxdsballcollection.clear();
			}
		}
		
	};
});