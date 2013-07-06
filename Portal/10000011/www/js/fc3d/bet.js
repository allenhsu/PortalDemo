/**
 * @author yang zhenn
 */
define(function(require,exports){
	var Layout = require('../base/layout'),	//引入布局模块
		Bet = require('../base/bet'),
		Tool = require('../base/tool');  //引入算法库
	
	var zhx_random = function(){
		var b = Tool.baseBallRandom(1,9,true,false,'ceil').sort(),
			s = Tool.baseBallRandom(1,9,true,false,'ceil').sort(),
			g = Tool.baseBallRandom(1,9,true,false,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: b,
				l2: s,
				l3: g
			},
			betstr: b.toString() + s.toString() + g.toString() + ':0'
		};
		this.create(result);
	};
	
	var z3_random = function(){
		var b = Tool.baseBallRandom(2,9,false,false,'ceil').sort();
		var r = Math.random() > 0.5 ? 0 : 1;
		b.splice(r,0,b[r]);
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: b
			},
			betstr: b.join('') + ':0',
			canEdit: false
		};
		this.create(result);
	};
	
	var z6_random = function(){
		var b = Tool.baseBallRandom(3,9,false,false,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: b
			},
			betstr: b.join('') + ':0',
			canEdit: false
		};
		this.create(result);
	};
	
	var collectionConfig = function(){
		return {
			localStorage: new Store('fc3dbet'),
			tempBox: '#fc3dBetViewTemp',
			maxbt: 99,
			/**
			 * 机选产生一注
			 * @name random
			 * @memberOf BetCollection
			 */
			random: zhx_random,
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
			key: 'fc3d_zhx',
			title: '福彩3D',
			rightbar: function(){
				var newtar = C.Config.key.split('_')[1] + '.html';
				alipay.navigation.pushWindow(newtar);
			},
			madeType: function(){
				var str = localStorage.getItem('betArray');
				var betArrays = JSON.parse(str);
				var self = this;
				//拆单
				if(str[0] == '['){
					var key = betArrays[0].key.replace('hz','');
					this.key = key;
					this.setKey();
					if(key == 'fc3d_zhx'){
						this.collection.random = zhx_random;
					}else if(key == 'fc3d_z3'){
						this.collection.random = z3_random;
					}else if(key == 'fc3d_z6'){
						this.collection.random = z6_random;
					}
				}
			},
			/**
			 * 增加继续购买的选号
			 * @param num{string} 选号字符串，如01 03 04 05 06 07:01 02:2:4&01 03 04 05 06 07:01 02:2:4
			 */
			addContinues: function(num){
				var self = this;
				self.collection.clear();
				var arr = num.split('&');
				_.each(arr,function(val){
					var _arr = val.split(':');
					var t = _arr[1];
					if(t === '0'){
						var n = _arr[0].split('');
						//直选
						self.collection.create({
							key: 'fc3d_zhx',
							bet: 1,
							value: {
								l1: n[0].split(''),
								l2: n[1].split(''),
								l3: n[2].split('')
							},
							betstr: val
						});
					}else if(t === '1'){
						//组三
						self.collection.create({
							key: 'fc3d_z3',
							bet: 1,
							value: {
								l1: _arr[0].split('')
							},
							betstr: val
						});
					}else if(t === '2'){
						//组六
						self.collection.create({
							key: 'fc3d_z6',
							bet: 1,
							value: {
								l1: _arr[0].split('')
							},
							betstr: val
						});
					}
					
				});
			}
		};
	};

	return {
		initialize: function(){
			C.betcollection = new Bet.Collection(collectionConfig());
			C.betapp = new Bet.App(appConfig(C.betcollection));
			Tool.detectLocalData('fc3dbet',C.betcollection,C.Config.betHashMap['fc3d'],C.Config.tipDetect);
			C.betapp.continueBuy();
		}
	};
});