
/**
 * 订单列表
 */
define(function(require, exports) {
	var Tool = require('../base/tool'),
	 	Layout = require('../base/layout'),
		Config = require('./orderconfig');
				
	/**
	 * 订单列表单元数据模型
	 * @class ItemModel
	 * @name ItemModel
 	 */
	var ItemModel = Backbone.Model.extend({});
	
	/**
	 * 订单列表数据集合
	 * @class ItemCollection
	 * @name ItemCollection
 	 */
 	var ItemCollection = Backbone.Collection.extend({
 		model: ItemModel,
 		/**
		 * initialize
 		 */
 		initialize: function() {
			this.frag = document.createDocumentFragment();
			this.bind('add', this.addItem, this);
 		},
		/**
		 * add
 		 */
 		addItem: function(model, models, option) {
			if (model.get('lotteryType') == 26) {
				return;
			}

			var itemView = new ItemView({model: model});
			/*$(this.frag).append(itemView.render().$el);
			
			if (option.index === (this.length - 1)) {
				C.OrderList.append(this.frag);
			}*/

			C.OrderList.append(itemView.render().$el);
 		}
	});

	/**
	 * 订单列表视图
	 * @class ItemView
	 * @name ItemView
	 */
	var ItemView = Backbone.View.extend({
		tagName: 'li',
		className: 'order-item',
		events: {
			'click': 'showOrderDetail',
			'touchstart a': 'taped',
			'touchend a': 'untaped',
			'touchstart': 'taped',
			'touchend': 'untaped'
		},
		_template: $('#order-item-template').html(),
		render: function() {
			try {
				
				$(this.el).html(_.template(this._template, this.model.toJSON()));
			} catch (e) {
				alert(e.message)
			} 
			return this;
		},
		/*
		 * 二态
		 */
		taped: function(e){
			var obj = $(e.currentTarget);
			obj.addClass('taped');
		},
		untaped: function(e){
			var obj = $(e.currentTarget);
			obj.removeClass('taped');
		},
		/**
		 * 显示订单详情
		 * @name showOrderDetail
		 */
		showOrderDetail: function(e) {
			var model = this.model.toJSON();
			//付款
			if (e.target.tagName === 'A') {
				e.preventDefault();
				if ($(e.target).hasClass('pay')) {
					var url = C.Config.getDomain() + C.Config.order_pay_interface + '?callback=C.OrderList.handleAliPay&token=' + alipay.session.token + '&pIdHelper=' + model.pIdHelper + '&typeId=' + model.lotteryType + '&orderType=' + model.orderType + '&issueId=' + model.issueIdHelper + '&dbType=' + model.dbType;
					Tool.getScript(url);
				}
				return;
			}

			localStorage.setItem('__tbcp__order', JSON.stringify(model));
				
			alipay.navigation.pushWindow('orderDetail.html');			
		}
	});

	/**
	 * 选号盘应用视图
	 * @class BallApp
	 * @name BallApp
	 */
	var ListApp = Backbone.View.extend({
		el: '#order-list',
		/**
		 * 每页订单数
		 */
		unit: 10,
		collection: new ItemCollection(),
		events: {
			'click .nav-item': 'showOrderList',
			'click .more': 'getMoreData'
		},
		initialize: function() {
			if (C.Config.platform === 'ios') { //ios: iscroll
				Tool.addStyleSheet(
					'html,body{height:100%;overflow:hidden;}' +
					'#scrollview-list-con{height:' + (window.innerHeight - 45) + 'px}'
				);
			}
			
			//Hook
			this.navs = $('#order-nav li');
			this.loading = $('#order-list .loading');
			this.content = $('#order-list-con');
			this.more = $('#order-list .more');
			this.page = 1;
			this.getData('1');
		},
		/**
		 * 拉取数据
		 * @name getData 
		 * @param {string} type  列表类型 
		 * @param {boolean} tag  false(default): 覆盖/true: 添加 
		 */
		getData: function(type, tag) {
			if (!tag) {
				this._add = false;            //覆盖标识
				this.collection.reset(); 
				this.content.empty();
			} else {
				this._add = true;             //覆盖标识
			}
			this.showLoading(true);
			this.showMore(false);

			this.type = type;
			var url = C.Config.getDomain() + C.Config.list_interface + '?callback=C.OrderList.handleData&token=' + alipay.session.token + '&pageNumber=' + this.page + C.Config.orderListTypeMap[type];
			Tool.getScript(url);
			
		},
		/**
		 * 处理数据
		 * @name setData
		 * @param {node/string} frag 
		 */
		handleData: function(data) {              
			this.showLoading(false);
			if (data.status) {	
				var page, pageSize;
				//订单为空
				if (typeof data.results === 'undefined' || data.results.totalItem == 0) {  
					this.exception('亲，您还没有' + ((this.type == '2') ? '中奖' : '购彩')  + ', 赶紧去投注吧!');
					return;
				}

				this.showMore(data.results.orders.length == this.unit);
				this.collection.add(data.results.orders);
			} else {
				//登录失效
				if (data.resultCode === 'ERR_LOGIN') {
					alipay.login();
					location.reload();
				}else if(data.resultCode === 'ERR_TAOBAO_USER'){
					this.exception('您尚未绑定淘宝账号，请先登录淘宝网完成注册绑定');
				}else{
					this.exception('网络异常, 请稍候再试!');
				}
			}
		},
		/**
		 * 插入HTML文档片段
		 * @name append
		 * @param {node/string} frag  文档片段
		 * @param {array} models  数据模型
		 */
		append: function(frag) {
			this.content.append(frag);
			
			//iscroll
			if (C.Config.platform === 'ios') {
				if (!this.scroll) {
					this.scroll = Layout.singleScroll('scrollview-list-con', {
						useTransition: true
					});
				} else {
					this.scroll.refresh();
				}
			}
		},
		/**
		 * 显示/隐藏 loading
		 * @name showLoading
		 * @param {boolean} tag  false(default):隐藏/true:显示
		 * @param {boolean} isLow  false(default):100px/true:20px
		 */
		showLoading: function(tag, isLow) {
			if (tag) {
				isLow && this.loading.css('padding', '20px 0');
				this.loading.removeClass('hidden');
				return;
			}
			this.loading.css('padding', '100px 0').addClass('hidden');
		},
		/**
		 * 显示/隐藏 更多订单
		 * @name showMore
		 * @param {boolean} tag  false(default):隐藏/true:显示
		 */
		showMore: function(tag) {
			if (tag) {
				this.more.removeClass('hidden');
				return;
			}
			this.more.addClass('hidden');
		},
		/**
		 * 异常处理
		 * @name exception
		 * @param {string} str  异常内容
		 */
		exception: function(str) {
			var li = this.content.find('li.exp');
			if (!li.length) {
				li = $('<li class="exp"></li>');
				this.content.append(li);
			}
			li.html(str);
		},
		/**
		 * 显示订单列表
		 * @name showOrderList
		 */
		showOrderList: function(e) {
			var tar = $(e.currentTarget) , 
				type = tar.attr('rel');
			if (type !== this.type) {
				this.navs.removeClass('selected');
				tar.addClass('selected');
				//重置分页
				this.page = 1;
				this.getData(type);
			}
		},
		/**
		 * 获取更多订单
		 * @name getMoreData
		 */
		getMoreData: function() {
			this.page ++;
			this.showLoading(true, true);
			this.getData(this.type, true);		
		},
		handleAliPay: function(data) {
			if (data.status == false) {
				if (data.resultCode == 'NEW_LOTTERY_USER') {
					//新用户
					alipay.navigation.pushWindow('../newuser/n.html');
				} else if (data.resultCode === 'ERR_LOGIN') {
					alipay.login();
					location.reload();
				} else {
					//exception
					localStorage.setItem('exceptionCode', data.resultCode);
					alipay.navigation.pushWindow('../exception/exc.html');
				}
				return;
			}
			
			alipay.tradePay(data.alipayTradeNo.replace(/,/gi,';'), alipay.session.token, '', '', '', this.payCallback,this.payCallback);
		},
		payCallback: function(status, memo) {
			//支付回调，清除数据
			if (status == 'yes') {
				location.reload();
			}
		}

	});

	return {
		initialize: function() {
			C.OrderList = new ListApp();
		}
	}
}); 
