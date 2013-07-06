/**
 * @author yang zhenn
 */
define(function(require,exports){
	var Layout = require('../base/layout'),	//引入布局模块
		Bet = require('../base/bet'),
		Tool = require('../base/tool');  //引入算法库
		
	var x1zhx_random = function(){
		var line1 = Tool.baseBallRandom(1,10,false,false,'floor').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1
			},
			betstr: '1:-,-,-,-,' + line1.join(' '),
			manualFirst: true
		};
		this.create(result);
	};
	
	var x2zhx_random = function(){
		var line1 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
			line2 = Tool.baseBallRandom(1,10,false,false,'floor').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1,
				l2: line2
			},
			betstr: '1:-,-,-,' + line1[0] + ',' + line2[0],
			manualFirst: true
		};
		this.create(result);
	};
	
	var x2zx_random = function(){
		var line1 = Tool.baseBallRandom(2,10,false,false,'floor').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1
			},
			betstr: '4:-,-,-,' + line1[0] + ',' + line1[1],
			manualFirst: true
		};
		this.create(result);
	};
	
	var x3zhx_random = function(){
		var line1 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
			line2 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
			line3 = Tool.baseBallRandom(1,10,false,false,'floor').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1,
				l2: line2,
				l3: line3
			},
			betstr: '1:-,-,' + line1[0] + ',' + line2[0] + ',' + line3[0],
			manualFirst: true
		};
		this.create(result);
	};
	
	var x3z3_random = function(){
		var b = Tool.baseBallRandom(2,9,false,false,'ceil').sort();
		var r = Math.random() > 0.5 ? 0 : 1;
		b.splice(r,0,b[r]);				
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: b
			},
			betstr: '6:-,-,' + b[0] + ',' + b[1] + ',' + b[2],
			canEdit: false,
			manualFirst: true
		};
		this.create(result);
	};
	
	var x3z6_random = function(){
		var line1 = Tool.baseBallRandom(3,10,false,false,'floor').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1
			},
			betstr: '7:-,-,' + line1[0] + ',' + line1[1] + ',' + line1[2],
			manualFirst: true
		};
		this.create(result);
	};
	
	var x4zhx_random = function(){
		var line1 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
			line2 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
			line3 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
			line4 = Tool.baseBallRandom(1,10,false,false,'floor').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1,
				l2: line2,
				l3: line3,
				l4: line4
			},
			betstr: '1:-,' + line1[0] + ',' + line2[0] + ',' + line3[0] + ',' + line4[0],
			manualFirst: true
		};
		this.create(result);
	};
	
	var x5zhx_random = function(){
		var line1 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
			line2 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
			line3 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
			line4 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
			line5 = Tool.baseBallRandom(1,10,false,false,'floor').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1,
				l2: line2,
				l3: line3,
				l4: line4,
				l5: line5
			},
			betstr: '1:' + line1[0] + ',' + line2[0] + ',' + line3[0] + ',' + line4[0] + ',' + line5[0],
			manualFirst: true
		};
		this.create(result);
	};
	
	var x5tx_random = function(){
		var line1 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
			line2 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
			line3 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
			line4 = Tool.baseBallRandom(1,10,false,false,'floor').sort(),
			line5 = Tool.baseBallRandom(1,10,false,false,'floor').sort();
		var result = {
			key: C.Config.key,
			bet: 1,
			value: {
				l1: line1,
				l2: line2,
				l3: line3,
				l4: line4,
				l5: line5
			},
			betstr: '5:' + line1[0] + ',' + line2[0] + ',' + line3[0] + ',' + line4[0] + ',' + line5[0],
			manualFirst: true
		};
		this.create(result);
	};
	
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
			random: x3zhx_random,
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
			key: 'xssc_x3zhx',
			title: '新时时彩',
			rightbar: function(){
				if(C.Config.key == 'xssc_x4zhx'){
					var newtar = C.Config.key.split('_')[1] + '_new_edit.html';
				}else{
					var newtar = C.Config.key.split('_')[1] + '_edit.html';
				}
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
				if(key == 'xssc_x3zhx'){
					this.collection.random = x3zhx_random;
				}else if(key == 'xssc_x3z3'){
					this.collection.random = x3z3_random;
				}else if(key == 'xssc_x3z6'){
					this.collection.random = x3z6_random;
				}else if(key == 'xssc_x4zhx'){
					this.collection.random = x4zhx_random;
				}else if(key == 'xssc_x5zhx'){
					this.collection.random = x5zhx_random;
				}else if(key == 'xssc_x5tx'){
					this.collection.random = x5tx_random;
				}else if(key == 'xssc_x1zhx'){
					this.collection.random = x1zhx_random;
				}else if(key == 'xssc_x2zhx'){
					this.collection.random = x2zhx_random;
				}else if(key == 'xssc_x2zx'){
					this.collection.random = x2zx_random;
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
					if(val.indexOf(':') >= 0){
						var _arr = val.split(':'),
							type = _arr[0],
							nostr = _arr[1];
						var specNo = nostr.match(/-/gi) ? nostr.match(/-/gi).length : 0;
						//直选
						if(type == '1'){
							//五星直选
							if(specNo == 0){
								self.collection.create({
									key: 'xssc_x5zhx',
									bet: 1,
									value: {
										l1: [nostr[0]],
										l2: [nostr[2]],
										l3: [nostr[4]],
										l4: [nostr[6]],
										l5: [nostr[8]],
									},
									betstr: val
								});
							}else if(specNo == 1){
								//四星直选
								self.collection.create({
									key: 'xssc_x4zhx',
									bet: 1,
									value: {
										l1: [nostr[2]],
										l2: [nostr[4]],
										l3: [nostr[6]],
										l4: [nostr[8]]
									},
									betstr: val
								});
							}else if(specNo == 2){
								//三星直选
								self.collection.create({
									key: 'xssc_x3zhx',
									bet: 1,
									value: {
										l1: [nostr[4]],
										l2: [nostr[6]],
										l3: [nostr[8]]
									},
									betstr: val
								});
							}else if(specNo == 3){
								//二星直选
								self.collection.create({
									key: 'xssc_x2zhx',
									bet: 1,
									value: {
										l1: [nostr[6]],
										l2: [nostr[8]]
									},
									betstr: val
								});
							}else if(specNo == 4){
								//一星直选
								self.collection.create({
									key: 'xssc_x1zhx',
									bet: 1,
									value: {
										l1: [nostr[8]]
									},
									betstr: val
								});
							}
						}else if(type == '5'){
							//五星通选
							self.collection.create({
								key: 'xssc_x5tx',
								bet: 1,
								value: {
									l1: [nostr[0]],
									l2: [nostr[2]],
									l3: [nostr[4]],
									l4: [nostr[6]],
									l5: [nostr[8]],
								},
								betstr: val
							});
						}else if(type == '6'){
							//三星组三
							self.collection.create({
								key: 'xssc_x3z3',
								bet: 1,
								value: {
									l1: nostr.replace('-,-,','').split(',')
								},
								betstr: val,
								canEdit: false
							});
						}else if(type == '7'){
							//三星组六
							self.collection.create({
								key: 'xssc_x3z6',
								bet: 1,
								value: {
									l1: nostr.replace('-,-,','').split(',')
								},
								betstr: val
							});
						}else if(type == '4'){
							//二星组选
							self.collection.create({
								key: 'xssc_x2zx',
								bet: 1,
								value: {
									l1: nostr.replace('-,-,-,','').split(',')
								},
								betstr: val
							});
						}
					}
				});
			}
		};
	};

	return {
		initialize: function(){
			C.betcollection = new Bet.Collection(collectionConfig());
			C.betapp = new Bet.App(appConfig(C.betcollection));
			Tool.detectLocalData('xsscbet',C.betcollection,location.hash,C.Config.tipDetect);
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
