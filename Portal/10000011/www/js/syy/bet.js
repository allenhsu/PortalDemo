/**
 * @author yang zhenn
 */
define(function(require,exports){
	var Layout = require('../base/layout'),	//引入布局模块
		Bet = require('../base/bet'),
		Tool = require('../base/tool');  //引入算法库
	
	var rx2_random = function(){
		var reds = Tool.baseBallRandom(2,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':102',
			manualFirst: true
		};
		this.create(result);
	};
	
	var rx3_random = function(){
		var reds = Tool.baseBallRandom(3,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':103',
			manualFirst: true
		};
		this.create(result);
	};
	
	var rx4_random = function(){
		var reds = Tool.baseBallRandom(4,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':104',
			manualFirst: true
		};
		this.create(result);
	};
	
	var rx5_random = function(){
		var reds = Tool.baseBallRandom(5,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':105',
			manualFirst: true
		};
		this.create(result);
	}; 
	
	var rx6_random = function(){
		var reds = Tool.baseBallRandom(6,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':106',
			manualFirst: true
		};
		this.create(result);
	};
	
	var rx7_random = function(){
		var reds = Tool.baseBallRandom(7,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':107',
			manualFirst: true
		};
		this.create(result);
	};
	
	var rx8_random = function(){
		var reds = Tool.baseBallRandom(8,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':117',
			manualFirst: true
		};
		this.create(result);
	};
	
	var q1_random = function(){
		var reds = Tool.baseBallRandom(1,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: reds
			},
			betstr: reds.join(' ') + ':101',
			manualFirst: true
		};
		this.create(result);
	};
	
	var q2zhx_random = function(){
		var line1 = Tool.baseBallRandom(1,11,false,true,'ceil').sort(),
			line2 = [];
		while(true){
			line2 = Tool.baseBallRandom(1,11,false,true,'ceil').sort();
			if(_.indexOf(line1,line2[0]) < 0){
				break;
			}
		}
		
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1,
				l2: line2
			},
			betstr: line1.join(' ') + '|' + line2.join(' ') + ':142',
			manualFirst: true
		};
		this.create(result);
	};
	
	var q2zx_random = function(){
		var line1 = Tool.baseBallRandom(2,11,false,true,'ceil').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1
			},
			betstr: line1.join(' ') + ':108',
			manualFirst: true
		};
		this.create(result);
	};
	
	var q3zhx_random = function(){
		var line1 = Tool.baseBallRandom(1,11,false,true,'ceil'),
			line2 = [],
			line3 = [];
		while(true){
			line2 = Tool.baseBallRandom(1,11,false,true,'ceil');
			if(_.indexOf(line1,line2[0]) < 0){
				break;
			}
		}
		while(true){
			line3 = Tool.baseBallRandom(1,11,false,true,'ceil');
			if(_.indexOf(line1,line3[0]) < 0 && _.indexOf(line2,line3[0]) < 0){
				break;
			}
		}
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1,
				l2: line2,
				l3: line3
			},
			betstr: line1.join(' ') + '|' + line2.join(' ') + '|' + line3.join(' ') + ':162',
			manualFirst: true
		};
		this.create(result);
	};
	
	var q3zx_random = function(){
		var line1 = Tool.baseBallRandom(3,11,false,true,'ceil');
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1
			},
			betstr: line1.join(' ') + ':109',
			manualFirst: true
		};
		this.create(result);
	};
	
	var collectionConfig = function(){
		return {
			localStorage: new Store('syybet'),
			tempBox: '#syyBetViewTemp',
			maxbt: 99,
			/**
			 * 机选产生一注
			 * @name random
			 * @memberOf BetCollection
			 */
			random: rx5_random,
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
			key: 'syy_rx5',
			title: '十一运夺金',
			rightbar: function(){
				var newtar = C.Config.key.split('_')[1] + '_edit.html';
				alipay.navigation.pushWindow(newtar);
			},
			//确定彩种类型
			madeType: function(){
				var str = localStorage.getItem('betArray');
				var betArrays = JSON.parse(str);
				var self = this;
				//拆单
				if(str[0] == '['){
					var key = betArrays[0].key.replace('hz','');
				}else{
					var key = betArrays.key.replace('hz','');
				}
				this.key = key;
				this.setKey();
				if(key == 'syy_rx2'){
					this.collection.random = rx2_random;	
				}else if(key == 'syy_rx3'){
					this.collection.random = rx3_random;
				}else if(key == 'syy_rx4'){
					this.collection.random = rx4_random;
				}else if(key == 'syy_rx5'){
					this.collection.random = rx5_random;
				}else if(key == 'syy_rx6'){
					this.collection.random = rx6_random;
				}else if(key == 'syy_rx7'){
					this.collection.random = rx7_random;
				}else if(key == 'syy_rx8'){
					this.collection.random = rx8_random;
				}else if(key == 'syy_q1'){
					this.collection.random = q1_random;
				}else if(key == 'syy_q2zhx'){
					this.collection.random = q2zhx_random;
				}else if(key == 'syy_q2zx'){
					this.collection.random = q2zx_random;
				}else if(key == 'syy_q3zhx'){
					this.collection.random = q3zhx_random;
				}else if(key == 'syy_q3zx'){
					this.collection.random = q3zx_random;
				}
			},
			/**
			 * 增加继续购买的选号
			 * @param num{string} 选号字符串
			 */
			addContinues: function(num){
				var self = this;
				self.collection.clear();
				var arr = num.split('&');
				_.each(arr,function(n){
					var _arr = n.split(':');
					var str = _arr[0];
					switch(_arr[1]){
						//任选二
						case '102':
							self.collection.create({
								key: 'syy_rx2',
								bet: Tool.numC(str.split(' ').length,2),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选三
						case '103':
							self.collection.create({
								key: 'syy_rx3',
								bet: Tool.numC(str.split(' ').length,3),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选四
						case '104':
							self.collection.create({
								key: 'syy_rx4',
								bet: Tool.numC(str.split(' ').length,4),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选五
						case '105':
							self.collection.create({
								key: 'syy_rx5',
								bet: Tool.numC(str.split(' ').length,5),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选六
						case '106':
							self.collection.create({
								key: 'syy_rx6',
								bet: Tool.numC(str.split(' ').length,6),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选七
						case '107':
							self.collection.create({
								key: 'syy_rx7',
								bet: Tool.numC(str.split(' ').length,7),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//任选八
						case '117':
							self.collection.create({
								key: 'syy_rx8',
								bet: Tool.numC(str.split(' ').length,8),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//前一
						case '101':
							self.collection.create({
								key: 'syy_q1',
								bet: str.split(' ').length,
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//前二直选
						case '142':
							self.collection.create({
								key: 'syy_q2zhx',
								bet: str.split('|')[0].split(' ').length * str.split('|')[1].split(' ').length,
								value: {
									l1: str.split('|')[0].split(' '),
									l2: str.split('|')[1].split(' ')
								},
								betstr: n
							});
							break;
						//前二组选
						case '108':
							self.collection.create({
								key: 'syy_q2zx',
								bet: Tool.numC(str.split(' ').length,2),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						//前三直选
						case '162':
							self.collection.create({
								key: 'syy_q3zhx',
								bet: str.split('|')[0].split(' ').length * str.split('|')[1].split(' ').length * str.split('|')[2].split(' ').length,
								value: {
									l1: str.split('|')[0].split(' '),
									l2: str.split('|')[1].split(' '),
									l3: str.split('|')[2].split(' ')
								},
								betstr: n
							});
							break;
						//前三组选
						case '109':
							self.collection.create({
								key: 'syy_q3zx',
								bet: Tool.numC(str.split(' ').length,3),
								value: {
									l1: str.split(' ')
								},
								betstr: n
							});
							break;
						default:
							break;
					}
				});
			
				
			}
		};
	};

	return {
		initialize: function(step){
			C.betcollection = new Bet.Collection(collectionConfig());
			C.betapp = new Bet.App(appConfig(C.betcollection));
			Tool.detectLocalData('syybet',C.betcollection,location.hash,C.Config.tipDetect);
			C.betapp.continueBuy();
			
			C.betapp.madeType();
			this.insertNewSelect();
		},
		insertNewSelect: function(){
			var str = localStorage.getItem('betArray');
			var betArrays = JSON.parse(str);
			var self = this;
			//拆单
			if(str[0] == '['){
				_.each(betArrays,function(n){
					C.betcollection.create(n);
				});
			}else{
				//复式
				C.betcollection.create(betArrays);
			}
			localStorage.removeItem('betArray');
		}
	};
});
