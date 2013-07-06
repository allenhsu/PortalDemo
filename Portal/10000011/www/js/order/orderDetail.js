
/**
 * 订单详情流程启动
 */
define(function(require, exports) {
	var Tool = require('../base/tool'),
	 	Layout = require('../base/layout'),
		Config = require('./orderconfig');

	/**
	 * 订单详情单元数据模型
	 * @class DetailModel
	 * @name DetailModel
 	 */
	var DetailModel = Backbone.Model.extend({
		initialize: function() {
			this.bind('change', this.render, this);
 		},
		/**
		 * change
 		 */
 		render: function() {
			C.OrderDetail.render();
 		}
	});
	
	/**
	 * 订单详情视图
	 * @class DetailView
	 * @name DetailView
	 */
	var DetailView = Backbone.View.extend({
		el: "#order-detail",
		model: new DetailModel(),
		events: {
			'tap button': 'toggleCollapse',
			'tap .pursue-item': 'toggleItem'
		},
		_template: {
			'n0': $('#order-detail-template-n-dg').html(),
			'n1': $('#order-detail-template-n-hm').html(),
			'n2': $('#order-detail-template-n-hm').html(),
			'n3': $('#order-detail-template-n-zh').html(),
			's0': $('#order-detail-template-s-dg').html(),
			's1': $('#order-detail-template-s-hm').html(),
			's2': $('#order-detail-template-s-hm').html(),
		},
		initialize: function() {
			//Hook
			this.loading = $('#order-detail .loading');
			this.content = $('#order-detail-con');
			this.getData();	
		},
		render: function() {
			//根据model类型选择模板
			try {
				var _model = this.model.toJSON();
				this.content.html(_.template(this._template[C.Template.getDetailTag(_model)], _model));

				// 标红
				C.Template.addLuckyEffect($('.effect'), _model);

			} catch (e) {
				alert(e.message)
			}			
			return this;
		},
		/**
		 * 拉取数据
		 * @name getData
		 * @param {string} detail  订单ID（验证） 
		 */
		getData: function() {
			//清空
			this.showLoading(true);
			
			try {
				var model = JSON.parse(localStorage.getItem('__tbcp__order')),
					lotteryType, orderType, url;
							
				lotteryType = this.lotteryType = model.lotteryType;
				orderType = this.orderType = model.orderType;
				url = C.Config.getDomain() + C.Config.getDetailInterface(orderType) + '?callback=C.OrderDetail.handleData&token=' + alipay.session.token + '&outerId=' + model.idHelper + '&typeId=' + lotteryType + '&issueId=' + model.issueIdHelper + '&dbType=' + model.dbType;
				
				//设置过期时间
				this._timer = setTimeout(function() {
					self.exception('网络异常, 请稍候再试!');
					self.getDataException = true;
				}, 20000);
				
				Tool.getScript(url);
			} catch (e) {
				this.showLoading(false);
				this.exception('网络异常, 请稍候再试!');
			}
 			
		},
		/**
		 * 处理数据
		 * @name setData
		 * @param {node/string} frag 
		 */
		handleData: function(data) {
			clearTimeout(this._timer);  //清除定时器
			if (this.getDataException) { //若异常已发生，则不在对数据进行处理
				return;
			}
			this.showLoading(false);
			if (data.status) {	
				data.lotteryType = this.lotteryType;
				data.orderType = this.orderType;
				this.model.set(data);
			} else {
				//登录失效
				if (data.resultCode === 'ERR_LOGIN') {
					alipay.login();
					location.reload();
				} else if (data.resultCode === 'ERR_PLAY_DATA') {
					this.exception('暂不支持该玩法');
				} else {
					this.exception('网络异常, 请稍候再试!');
				}
			}
		},
		/**
		 * 显示/隐藏 loading
		 * @name showLoading
		 * @param {boolean} tag  false(default):隐藏/true:显示
		 */
		showLoading: function(tag) {
			if (tag) {
				this.loading.removeClass('hidden');
				return;
			}
			this.loading.addClass('hidden');
		},
		/**
		 * 异常处理
		 * @name exception
		 * @param {string} str  异常内容
		 */
		exception: function(str) {
			var div = this.content.find('.exp');
			if (!div.length) {
				div = $('<div class="exp"></div>');
				this.content.append(div);
			}
			div.html(str);
		},
		toggleCollapse: function(e) {
			var triggerNode = $(e.target),
				infoNode = triggerNode.closest('dd').next();
			if (triggerNode.hasClass('fold')) {
				triggerNode.attr('class', 'unfold');
				infoNode.removeClass('no-visible');
			} else {
				triggerNode.attr('class', 'fold');
				infoNode.addClass('no-visible');
			}
		},
		toggleItem: function(e) {
			var triggerNode = $(e.currentTarget),
				tagNode = triggerNode.find('.issue'),
				infoNode = triggerNode.next();
			if (tagNode.hasClass('unfold')) {
				tagNode.attr('class', 'issue fold');
				infoNode.addClass('no-visible');
			} else {
				$('.pursue-item').each(function(index, item) {
					var _tagNode = $(item).find('.issue');
					if (_tagNode.hasClass('unfold')) {
						_tagNode.attr('class', 'issue fold');
						$(item).next().addClass('no-visible');
					}
				});	
				
				tagNode.attr('class', 'issue unfold');
				infoNode.removeClass('no-visible');

				if (triggerNode.attr('data-item') === 'false') {
					var model = this.model.toJSON(),
						url = C.Config.getDomain() + C.Config.getDetailInterface(model.orderType) + '?callback=C.OrderDetail.handlePursue&token=' + alipay.session.token + '&outerId=' + model.idHelper + '&typeId=' + model.lotteryType + '&issueId=' + triggerNode.attr('data-issue') + '&dbType=' + model.dbType;
					
					this.activePursueItem = {
						node: infoNode,
						trigger: triggerNode
					};
					Tool.getScript(url);
				}
			}	
		},
		handlePursue: function(data) {
			var item = this.activePursueItem;
			this.activePursueItem = null;

			item.node.find('.loading').remove();
			item.trigger.attr('data-item', 'true');

			var arr = [],  sHtml = '',
				textNode = item.node.find('.info');
			_.each(data.orderNumber, function(order) {
				_.each(order.formatedLotteryNumbers, function(num) {
					arr.push(num + ' ' + order.multi + '倍');
				});							
			});

			sHtml = '投注号码: <div class="effect">' + arr.join('</br>') + '</div>' + textNode.html();
			textNode.html(sHtml).removeClass('hidden');
			
			//标红
			C.Template.addLuckyEffect(textNode.find('.effect'), this.model.toJSON());
		}
	});

	return {
		initialize: function() {
			C.OrderDetail = new DetailView();
			
			window['rightBar'] = function() {
				var model = C.OrderDetail.model.toJSON(),
					lotteryType = model.lotteryType,
					arr = [], obj = {};
				if (!C.Config.lotteryTypeMap[lotteryType].isShowSport) {
					_.each(model.orderNumber, function(order) {
						if (order.ConLNV && order.ConLNV.length > 0) {
							arr.push(order.ConLNV.join('&'));
						}
					});
				}
				
				obj.lotteryType = lotteryType;
				obj.numberStrings = arr.join('&');
				
				localStorage.setItem('continueBuy', JSON.stringify(obj));	
				alipay.navigation.popToRoot();			
			};
		}
	}
});
