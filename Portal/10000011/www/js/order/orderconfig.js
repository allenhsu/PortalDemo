/**
 * 订单列表
 */
define(function(require, exports) {
	C.Config = $.extend(C.Config, {
		/**
		 * 订单列表分类	 
		 * 1   全部订单
		 * 2   中奖订单     
		 * 3   代购订单    
		 * 4   追号订单  
		 * 5   参与合买订单  
		 * 6   发起合买订单 
		 * 7   赠送订单
		 */
		orderListTypeMap: {
			'1': '&olt=a',
			'2': '&isWin=true',
			'3': '&olt=s',
			'4': '&olt=pu',
			'5': '&olt=j',
			'6': '&olt=c',
			'7': '&olt=p'			
		},
		/**
		 * 数据接口域名
		 */
		domain_pro: 'http://caipiao.m.taobao.com/lottery',       //生产环境
		domain_pre: 'http://caipiao.wapa.taobao.com/lottery',      //预发环境
		domain_dev: 'http://caipiao.waptest.taobao.com/lottery',   //开发环境
		//domain_dev: 'http://caipiao.waptest.taobao.com/lottery',   //开发环境
		getDomain: function() {
			return this['domain_' + data_env];
		},

		/**
		 * 数据接口地址
		 */
		list_interface: '/html5/getMylotteryListAjax.do',
		order_pay_interface: '/html5/getOrderPayNumAjax.do',
		detail_dg_interface: '/html5/getOrderDetailAjax.do',
		detail_zh_interface: '/html5/getPursueDetailAjax.do',
		detail_hm_interface: '/html5/getUnitedDetailInfoAjax.do',
		detail_zs_interface: '/html5/getPresentDetailAjax.do',
		getDetailInterface: function(orderType) {
			var _interface = null;
			switch (orderType) {
				case 0:
					_interface = this.detail_dg_interface;
					break;
				case 1:
					_interface = this.detail_hm_interface;
					break;
				case 2:
					_interface = this.detail_hm_interface;
					break;
				case 3:
					_interface = this.detail_zh_interface;
					break;
				case 5:
					_interface = this.detail_zs_interface;
					break;
				default:
					_interface = this.detail_dg_interface;
					break;
			}; 
			return _interface;
		},
		/**
		 * lotteryTypeId映射
		 */
		lotteryTypeMap: {
			'1': {
				name: '双色球',
				cls: 'ssq',
				isS: false,
				isShowSport: false
			},
			'2': {
				name: '福彩3D',
				cls: 'fc3d',
				isS: false,
				isShowSport: false
			},
			'6': {
				name: '排列三',
				cls: 'pl3',
				isS: false,
				isShowSport: false
			},
			'7': {
				name: '七乐彩',
				cls: 'qlc',
				isS: false,
				isShowSport: false
			},
			'8': {
				name: '大乐透',
				cls: 'dlt',
				isS: false,
				isShowSport: false
			},
			'11': {
				name: '胜负彩14场',
				cls: 'sf14',
				isS: true,
				isShowSport: false
			},
			'12': {
				name: '任选九场',
				cls: 'rx9',
				isS: false,
				isShowSport: false
			},
			'13': {
				name: '七星彩',
				cls: 'qxc',
				isS: false,
				isShowSport: false
			},
			'14': {
				name: '新时时彩',
				cls: 'ssc',
				isS: false,
				isShowSport: false
			},
			'15': {
				name: '十一运夺金',
				cls: 'syy',
				isS: true,
				isShowSport: false
			},
			'16': {
				name: '足球单场',
				cls: 'dc',
				isS: false,
				isShowSport: true
			},
			'17': {
				name: '老时时彩',
				cls: 'ssc',
				isS: false,
				isShowSport: false
			},
			'18': {
				name: '排列五',
				cls: 'pl5',
				isS: false,
				isShowSport: false
			},
			'19': {
				name: '快乐8',
				cls: 'kl8',
				isS: false,
				isShowSport: false
			},
			'20': {
				name: '竞彩篮球',
				cls: 'jclq',
				isS: false,
				isShowSport: true
			},
			'21': {
				name: '竞彩足球',
				cls: 'jczq',
				isS: false,
				isShowSport: true
			},
			'22': {
				name: '15选5',
				cls: 'x5',
				isS: false,
				isShowSport: false
			},
			'23': {
				name: '新3D',
				cls: 'fc3d',
				isS: false,
				isShowSport: false
			},
			'24': {
				name: '奥运彩票',
				cls: 'dc',
				isS: false,
				isShowSport: true
			},
			'25': {
				name: '11选5',
				cls: 'syxw',
				isS: false,
				isShowSport: false
			},
			'26': {
				name: '快三',
				cls: 'syxw',
				isS: false,
				isShowSport: false
			}
		},
		/**
		 * orderType映射
		 */
		orderTypeMap: {
			'0': '代购',
			'1': '发起合买',
			'2': '参与合买',
			'3': '追号',
			'4': '定制跟单'
			//'5': '赠送'
		},
		/**
		 * orderType映射
		 */
		olympicMap: {
			'足球': '球',
			'篮球': '分',
			'排球': '局',
			'网球': '盘',
			'羽毛球': '局',
			'乒乓球': '局',
			'沙滩排球': '局',
			'射箭': '环',
			'拳击': '点'
		}
	});
	
	C.Template = $.extend(C.Template, {
		/**
		 * 日期格式化
		 * @name formatDate 
		 * @param t{object}  时间对象 
		    t = {
				year: 112,
				month: 5,
				date: 12,
				hours: 10,
				minutes: 10,
				seconds: 10
			}
		 */
		formatDate: function(t) {
			return (1900 + t.year) + '-' + this.bitHandle(t.month + 1) + '-' + this.bitHandle(t.date) + ' ' + this.bitHandle(t.hours) + ':' + this.bitHandle(t.minutes) + ':' + this.bitHandle(t.seconds);
		},
		formatLuckNumber: function(num) {
			if (typeof num === 'undefined' || num === null) {	
				return '等待开奖';
			} else {
				if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(num)) {
					return num;
				} else if(/[\:\|\-]/.test(num)) {
					var a = num.split(/[\:\|\-]/g),
						b = [];
					if (a[0]) {
						_.each(a[0].split(/[\s\,]/g), function(n) {
							b.push('<em>' + n + '</em>');
						});
					}
					if (a[1]) {
						_.each(a[1].split(/[\s\,]/g), function(n) {
							b.push('<em class="b">' + n + '</em>');
						});
					}
				} else {
					var a = [], 
						b = [];
					if (/\s/.test(num)) {
						a = num.split(/\s/g);
					} else if (/\,/.test(num)) {
						a = num.split(',');
					} else {
						a = num.split('');
					}
					_.each(a, function(n) {
						b.push('<em>' + n + '</em>');
					});
				}
				return b.join('');
			} 
		},
		/**
		 * 获取详情标识
		 * @name getDetailTag 
		 * @param {object} model   数据
		 * @return {string}    详情标识
		 */
		getDetailTag: function(model) {
			var lotteryType = model.lotteryType,
				orderType = model.orderType,
				tag = 'n';
			if (C.Config.lotteryTypeMap[lotteryType].isShowSport) {
				tag = 's';
			}
			return tag + orderType;
		},	
		/**
		 * 标红
		 * @name addLuckyEffect 
		 * @param {nodeList} nodeList  标红节点
		 * @param {object}   model     数据对象
		 * @return {string}    详情标识
		 */
		addLuckyEffect: function(nodeList, model) {
			var lotteryType = model.lotteryType,
				orderType = model.orderType,
				luckNumber = null;
				
			//竞技彩
			if (C.Config.lotteryTypeMap[lotteryType].isShowSport) {
				nodeList.each(function(index, node) {
					luckNumber = $(node).next().text().replace(/\([\d\.]*\)/, '');
					$(node).html($(node).html().replace(luckNumber, '<em>' + luckNumber + '</em>'));
				});
				return;
			}

			//数字彩
			if (orderType == 0) {                                            //代购
				luckNumber = model.orderNumber[0].luckyNumber; 
			} else if (orderType == 1 || orderType == 2) {
				luckNumber = model.luckNum;                                   //合买
			}
			
			nodeList.each(function(index, node) {
				var $node = $(node);
				if (orderType == 3) {                                        //追号
					luckNumber = $node.parent().find('.luckNumber').html();
				}
				
				//无开奖, 直接返回
				if (!luckNumber) {                            
					return;
				}

				var betArray = $node.html().split('<br>'),             //多个号码分割
					newBetArray = [];
				
				_.each(betArray, function(betNumber) {
					betNumber = $.trim(betNumber);
					if (betNumber === '') {
						return;
					}
					
					/* 双色球/大乐透/七乐彩/15选5/3D/新3D/排列3/排列5/七星彩/时时彩/快乐8/十一运/胜负14场
					 * 分类处理:
					 * 双色球/大乐透：分前后区（大乐透生肖乐特殊考虑）
					 * 七乐彩/15选5/十一运/快乐8：两位数，不计顺序，直接正则匹配（十一运前一、前二、前三特殊考虑）
					 * 3D/新3D/排列3/排列5/：一位数字，有顺序，全部为单式，数字中间无间隔，只有顺序正确才算对（组三组六特殊情况：3D/排列3）
					 * 七星彩/胜负14场：有复式单，但每位都是一个数字，号码中奖用','分隔
					 * 时时彩；普通、复式、大小单双、和值、二星组选、组三组六
					 */
					
					//抓取文字描述
					var desc = betNumber.match(/[\s]{1}(1D|2D|[\u4E00-\u9FA5\uF900-\uFA2D]+).*/g),
						desc = (desc === null) ? '' : desc[0],
						betNumber = betNumber.replace(desc, '');

					switch (lotteryType) {
						//双色球/大乐透
						case 1:
						case 8:
							var _bet = betNumber.split(/[\:\|\-]/),
								_luck = luckNumber.split(/[\:\|\-]/);
							if (_bet.length === 1) {                                    //生肖乐, 之判断后区
								_.each(_bet[0].split(/[\s\,]/g), function(n) {       
									if (_luck[1].indexOf(n) >= 0) { 
										_bet[0] = _bet[0].replace(n, '<em>' + n + '</em>');
									}
								});	
							} else {
								_.each(_bet, function(n, i) {
									var a = n.replace(/[\{\}\(\)]/g, ' ').split(/[\s\,]/g);
									_.each(a, function(b) {         //前区
										if (_luck[i].indexOf(b) >= 0) { 
											_bet[i] = _bet[i].replace(b, '<em>' + b + '</em>');
										}
									});
								});
							}
							newBetArray.push(_bet.join(':') + desc);
							break;
						//七乐彩
						case '7':
							// 七乐彩开8个号码
							var _luck = luckNumber.split('|');
							_.each(betNumber.match(/(\d){2}/g), function(n) {
								if (_luck[0].indexOf(n) >= 0) { 
									betNumber = betNumber.replace(n, '<em>' + n + '</em>');
								} else if (_luck[1].indexOf(n) >= 0) { 
									betNumber = betNumber.replace(n, '<em class="extra">' + n + '</em>');
								}
							});
							newBetArray.push(betNumber + desc);
							break;
						//15选5/十一运/快乐8
						case 15:
						case 19:
						case 22:
						case 25:
							//十一运夺金前一前二前三（文字描述在前，所以在betNumber中）
							if (betNumber.indexOf('前') >= 0) { 
								var _luck = luckNumber.match(/(\d){2}/g);
								if (betNumber.indexOf('前一') >= 0) {           //前一
									_luck = _luck.slice(0, 1);
									if (betNumber.indexOf(_luck[0]) >= 0) {
										betNumber = betNumber.replace(_luck[0], '<em>' + _luck[0] + '</em>');
									}
								} else {                                       //前二/前三
									_luck = (betNumber.indexOf('前二') >= 0) ? _luck.slice(0, 2) : _luck.slice(0, 3);
									var a = betNumber.split('|');
									if (a.length > 1) {                        //直选，按位匹配
										_.each(_luck, function(n, i) {
											if (a[i].indexOf(n) >= 0) { 
												betNumber = betNumber.replace(n, '<em>' + n + '</em>');
											}
										});
									} else {                                   //组选
										_.each(_luck, function(n, i) {
											if (betNumber.indexOf(n) >= 0) { 
												betNumber = betNumber.replace(n, '<em>' + n + '</em>');
											}
										});
									}
								}
							} else {
								_.each(betNumber.match(/(\d){2}/g), function(n) {
									if (luckNumber.indexOf(n) >= 0) { 
										betNumber = betNumber.replace(n, '<em>' + n + '</em>');
									}
								});
							}
							newBetArray.push(betNumber + desc);
							break;
						//3D/排列3/排列5/新3D
						case 2:
						case 6:
						case 18:
						case 23:
							//var _bet = betNumber.match(/(\d){1}/g),
							var _bet = betNumber.split(''),
								_luck = luckNumber.match(/(\d){1}/g),
								_newBet = [],
								igNore = false,
								_a = [];

							if ((desc.indexOf('组三') >= 0) || (desc.indexOf('组六') >= 0)) {       //组三组六，组三只标红一次
								igNore = true;             
							}

							//按位匹配
							_.each(_bet, function(n, i) {
								if ((igNore && (luckNumber.indexOf(n) >= 0) && (_a.indexOf(n) < 0)) || n === _luck[i]) {
									_newBet.push('<em>' + n + '</em>');
									igNore && _a.push(n);
								} else {
									_newBet.push(n);
								}
							});
							newBetArray.push(_newBet.join('') + desc);
							break;
						//七星彩/胜负14场//时时彩
						case 11:
						case 12:
						case 13:
						case 14:
						case 17:
							var _bet = betNumber.split(','),
								_luck = luckNumber.split(','),
								_newBet = [],
								igNore = false,
								_a = [];
							if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(betNumber)) {           //时时彩大小单双
								_bet = _bet.slice(0, 2);
								_luck = _luck.slice(5);
								
								//按位比较
								_.each(_bet, function(n, i) {
									var _n = n.substring(0,1),
										__n = n.substring(1);
									if (_luck[i].indexOf(_n) >= 0) {
										_bet[i] = '<em>' + _n + '</em>' + __n;
									}
								});

								newBetArray.push(_bet.join(','));
							} else {
								var _luckNumber = '',
									_sum = 0,
									isSum = false;
								if ((desc.indexOf('组三') >= 0) || (desc.indexOf('组六') >= 0)) {              //时时彩组三组六
									igNore = true;
									_luckNumber = luckNumber.substring(4, 9);                                 
								} else if (desc.indexOf('组选') >= 0) {                                        //时时彩二星组选
									igNore = true;
									_luckNumber = luckNumber.substring(6, 9);
								} else if (desc.indexOf('和值') >= 0) {              //老时时彩和值
									isSum = true;
									_.each(_luck, function(n) {
										n = Number(n);
										if (!isNaN(n)) {
											_sum += n;
										}
									});
								}

								_.each(_bet, function(n, i) {
									if (isSum) {
										if (n == _sum) {
											_newBet.push('<em>' + n + '</em>');
										} else {
											_newBet.push(n);
										}
									} else if (igNore && (_luckNumber.indexOf(n) >= 0) && (_a.indexOf(n) < 0)) {
										_newBet.push('<em>' + n + '</em>');
										_a.push(n);
									} else if (n.indexOf(_luck[i]) >= 0) {
										_newBet.push(n.replace(_luck[i], '<em>' + _luck[i] + '</em>'));
									} else {
										_newBet.push(n);
									}
								});
								newBetArray.push(_newBet.join(',') + desc);
							}
							break;
						default:
							newBetArray.push(betNumber + desc);
							break;					
					}
				});
		
				$node.html(newBetArray.join('<br>'));
			});
		}		
	});
}); 
