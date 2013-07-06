/**
 * @author yang zhenn
 */
define(function(require,exports){
	var Tool = require('./tool'),
		Layout = require('./layout'),
		Timer = require('../widget/timer/timer');
	var confirm = require('../widget/confirm/confirm');
	var BetModel = Backbone.Model.extend({});
	var BetCollection = Backbone.Collection.extend({
		model: BetModel,
		initialize: function(cfg){
			cfg = $.extend({
				maxBt: 50,
				localStorage: new Store('ssqbet'),
				tempBox: '#ssqBetViewTemp',
				/**
				 * 机选产生一注
				 */
				random: function(){},
				/**
				 * 获取投注投注字符串
				 */
				getNumberString: function(){}
			},cfg);
			Tool.buildCfg.call(this,cfg);
			
			this.bind('add',this.addOne,this);
			this.bind('reset',this.addAll,this);
		},
		/**
		 * 增加数据模型的回调
		 * @memberOf BetCollection
		 * @param data{model} 数据模型
		 * @return void
		 */
		addOne: function(data){
			var betview = new BetView({
				model: data,
				tempBox: this.tempBox
			});
			betview.render();
		},
		/**
		 * 增加全部数据模型
		 * @memberOf BetCollection
		 */
		addAll: function(){
			var self = this, 
				frag = document.createDocumentFragment();
			for(var i = this.models.length;i--;){
				var betview = new BetView({
					model: this.models[i],
					tempBox: self.tempBox
				});
				betview.createFragment(frag);
			}
			C.betapp.oneTimePush(frag);
		},
		
		/**
		 * 清空集合中所有的数据模型
		 * @memberOf BetCollection
		 * @name clear
		 */
		clear: function(){
			for(var i=this.models.length;i--;){
				this.models[i].destroy();
			}
		},
		getPrevdelNo: function(){
			var no = 0;
			this.each(function(model){
				if(model.get('prevdel')){
					no++;
				}
			});
			return no;
		}
	});
	
	/**
	 * 投注蓝视图类
	 * @class BetView
	 * @name BetView
	 */
	var BetView = Backbone.View.extend({
		tagName: 'li',
		events: {
			'click .del': '_delete',
			'swipeLeft': 'showDelete',
			'swipeRight': 'showDelete',
			'longTap': '_showDelete',
			'tap': 'editSingle'
		},
		initialize: function(cfg){
			var self = this;
			cfg = $.extend({
				tempBox: 'ssqBetViewTemp'
			},cfg);
			Tool.buildCfg.call(this,cfg);
			
			//监听数据销毁
			this.model.bind('destroy',this.remove,this);
			this.model.bind('change:betstr',this.render,this);
		},
		/**
		 * 获得js模板中数据
		 * @memberOf BetView
		 * @param data{json} 数据模型中的attributes
		 * @return void
		 */
		template: function(data){
			var temp = $(this.tempBox).html();
			return _.template(temp,data);
		},
		/**
		 * 数据渲染
		 * @memberOf BetView
		 */
		render: function(){
			var data = this.model.toJSON(),
				domStr = this.template(data);
			//新增加的投注，有动画效果。fetch时，不用添加anim
			this.$el.html(domStr);
			if(C.Config.platform === 'ios'){
				this.$el.addClass('anim');
			}
			var selectList  = $('#selectList');
			//插入dom
			if(selectList.find('li').length > 1){
				selectList.find('li').eq(1).before(this.$el);
			}else{
				selectList.append(this.$el);
			}
			C.betapp.upFee().guideShow();
			C.pullSelectscroll.refresh();
		},
		/**
		 * 创建文档碎片（collection reset时调用），以备一次性插入dom
		 * @param frag{documentFragment} 创建的文档碎片
		 * @memberOf BetView
		 * @name createFragment
		 */
		createFragment: function(frag){
			var data = this.model.toJSON(),
				domStr = this.template(data);
			this.$el.html(domStr);
			$(frag).append(this.$el);
		},
		_showDelete: function(e){
			var self = this;
			if(C.Config.platform == 'android'){
				self.longtaps = true;
				var self = this;
				window.cbox = new confirm.initialize({
					content: '删除单注?',
					onConfirm: function(){
						self._delete();
					},
					onCancel: function(){
						self.longtaps = false;
					}
				});
			}
		},
		/**
		 * 显示删除按钮
		 * @memberOf BetView
		 * @return void
		 */
		showDelete: function(){
			if(C.Config.platform == 'ios'){
				if(this.model.get('prevdel')){
					this.model.set({
						prevdel: false
					},{silent:true});
				}else{
					this.model.set({
						prevdel: true
					},{silent:true});
				}
				this.$el.toggleClass('select');
			}
			
		},
		/**
		 * 删除单条数据
		 * @memberOf BetView
		 * @name _delete
		 */
		_delete: function(e){
			if(e){
				e.stopPropagation();
				e.preventDefault();
			}
			this.model.destroy();
		},
		/**
		 * 移除单条数据视图
		 * @memberOf BetView
		 * @name remove
		 */
		remove: function(){
			var self = this;
			if(C.Config.platform === 'ios'){
				this.$el.addClass('delete');
			}
			_.delay(function(){
				self.$el.remove();
				C.pullSelectscroll.refresh();
				C.betapp.guideShow().upFee();
			},300);
		},
		/**
		 * 编辑单注(主要是change hash，并操作C.Config.editModel)
		 * @memberOf BetView
		 */
		editSingle: function(e){
			//如果已经出发长按事件，则跳出代码片段
			if(this.longtaps) return;
			var obj = $(e.currentTarget);
			if(obj.hasClass('select')) return;
			if(this.model.get('canEdit') === false){
				alert('此选号无法继续编辑',function(){},'提示','确定');
				return;
			}
			this.model.set({
				editing: true
			});
			this.model.save();
			localStorage.setItem('editValue',JSON.stringify(_.clone(this.model.get('value'))));
			
			var manualFirst = this.model.get('manualFirst');
			//默认手选在先
			if(manualFirst){
				var key = this.model.get('key');
				alipay.navigation.pushWindow(key.split('_')[1] + '_edit.html');
			}else{
				alipay.navigation.pushWindow(this.model.get('key').split('_')[1] + '.html');
			}
			
		}
	});
	
	/**
	 * 投注应用视图
	 * @class BetApp
	 * @name BetApp
	 */
	var BetApp = Backbone.View.extend({
		el: '#betScroll',
		betno: 0,
		events: {
			'input #zh': 'upFee',
			'input #bt': 'upFee',
			'click #submit': 'submit',
			'click #delall': 'deleteAll',
			'click .extraInfo b': 'showTreaty',
			'click .siuCheck': 'toggleCheck',
			'touchstart #delall,#submit': 'touched',
			'touchend #delall,#submit': 'nontouch'
		},
		touched: function(e){
			var obj = $(e.currentTarget);
			obj.addClass('taped');
		},
		nontouch: function(e){
			var obj = $(e.currentTarget);
			obj.removeClass('taped');
		},
		toggleCheck: function(e){
			var obj =$(e.currentTarget);
			obj.toggleClass('checked');
			if(obj.attr('id') == 'dlt_append_vote'){
				this.upFee();
			}
		},
		showTreaty: function(){
			alipay.navigation.pushWindow('../treaty/index.html');
		},
		deleteAll: function(e){
			e.preventDefault();
			var self = this;
			if(self.betno == 0){
				alert('亲，你还没有添加任何投注信息',function(){},'提示','确定');
				return;
			};
			window.cbox = new confirm.initialize({
				content: '删除全部?',
				onConfirm: function(){
					self.collection.clear();
				}
			});
		},
		
		initialize: function(cfg){
			var self = this;
			//初始窗口高度
			self.initHeight = window.innerHeight;
			cfg = $.extend({
				collection: {},
				key: 'ssq_common',
				title: '',
				addContinue: function(){},
				rightbar: function(){},
				madeType: function(){}
			},cfg);
			
			window.rightbar = cfg.rightbar;
			//注册frompop事件
			document.addEventListener("frompop", function(){
				self.popCallback.call(self);
			}, false);
			//应用从后台中恢复
			document.addEventListener('resume',function(){
				self.fetchIssue();
			},false);
			this.guideShow();
			Tool.buildCfg.call(this,cfg);
			this.setKey();
			//创建scrollview，并使用pulldown to random
			this.buildPullRandom();
			self.fetchIssue();
			
			//domhook
			this.fee = $('#fee');
			this.bt = $('#bt');
			this.zh = $('#zh');
			this.agree = $('#agree');
		},
		//更新已经编辑的选号，而非增加新的
		editNow: function(index){
			var str = localStorage.getItem('betArray');
			var betArray = JSON.parse(str);
			//拆单
			if(str[0] == '['){
				this.collection.models[index].set(betArray[0]);
				this.collection.models[index].set({
					editing: false
				});				
				for(var i =1,len=betArray.length;i<len;i++){
					this.collection.create(betArray[i]);
				}
			}else{
				//复式
				this.collection.models[index].set(betArray);
				this.collection.models[index].set({
					editing: false
				});
			}
			this.collection.models[index].save();
			localStorage.removeItem('betArray');
		},
		//插入新的投注选号
		insertNewSelect: function(){
			var str = localStorage.getItem('betArray');
			var betArrays = JSON.parse(str);
			var self = this;
			//拆单
			if(str[0] == '['){
				_.each(betArrays,function(n){
					self.collection.create(n);
				});
			}else{
				//复式
				self.collection.create(betArrays);
			}
			localStorage.removeItem('betArray');
		},
		//pop到本页后，进行的操作
		popCallback: function(){
			var isEdit = this.isEdit();
			//如果是直接返回
			if(localStorage.getItem('betArray') === null){
				//如果当前所有选号中有带已编辑标示的投注
				if(isEdit !== false){
					this.collection.models[isEdit].set({
						editing: false
					});
					this.collection.models[isEdit].save();
				}
			}else{
				this.madeType();
				//否则是点击完成回来的
				if(isEdit !== false){
					this.editNow(isEdit);
				}else{
					this.insertNewSelect();
				}
			}
			this.removeWait();
		},
		//检测是否是编辑操作
		isEdit: function(){
			var hasEdit = false;
			for(var i= 0,len=this.collection.models.length;i<len;i++){
				if(this.collection.models[i].get('editing') === true){
					hasEdit = i;
					break;
				}
			}
			return hasEdit
		},
		//继续购买huidiao
		continueBuy: function(){
			var str = localStorage.getItem('continueBuy');
			if(str === null){
				return;
			}
			localStorage.removeItem('continueBuy');
			var num = JSON.parse(str).numberStrings;
			if(num && num.length > 6 && num.match(/\d+/gi).length > 0){
				this.addContinues(decodeURIComponent(num));	
			}			
		},
		/**
		 * 获取彩期数据
		 * @name fetchIssue
		 * @memberOf BetApp
		 */
		fetchIssue: function(){
			var key = C.Config.key,
				keypre = key.split('_')[0];
			//如果是高频，即时获取彩期
			if(keypre == 'xssc' || keypre == 'syy'){
				var lotType = C.Config.lotTypeNumberId[C.Config.key.split('_')[0]];
				var url = C.Config.getIssueDataUrl() + '?typeId=' + lotType + '&callback=C.betapp.handleIssue&t=' + new Date().getTime();
				Tool.getScript(url);
			}else{
				//大盘彩
				var lotType = C.Config.lotTypeNumberId[C.Config.key.split('_')[0]];
					issueStr = localStorage.getItem('issueData_' + lotType),
					issueObj = JSON.parse(issueStr);
				$('#submit').removeClass('disabled');
				try {
					if(!issueObj.status){
						$('#submit').addClass('issueOver');
					}
				} catch (e) {
				
				}
				this.issueObj = issueObj;
			}
		},
		/**
		 * 管理彩期数据
		 * @name handleIssue
		 * @memberOf BetApp
		 */
		handleIssue: function(data){
			var self = this;
			if(data.status === true){
				$('#submit').removeClass('disabled');
				//如有有彩期
				if(data.results[0].status){
					self.hasIssueAct(data);
				}else{
					//无彩期
					self.noIssueAct(data);
				}
			}
		},
		//存在彩期的处理
		hasIssueAct: function(data){
			var self = this , curTime = 0;
			if(data.server_time.toString().indexOf('_') >= 0){
				curTime = new Date().getTime();
			}else{
				curTime = Number(data.server_time);
			}
			var str = data.results[0]['lastBuyTime'] ,
				arr = str.split(' '),
				year = Number(arr[0].split('-')[0]),
				month = Number(arr[0].split('-')[1]) - 1,
				day = Number(arr[0].split('-')[2]),
				hour = Number(arr[1].split(':')[0]),
				minute = Number(arr[1].split(':')[1]),
				second = Number(arr[1].split(':')[2]);
			var lastBuyTime = new Date(year,month,day,hour,minute,second).getTime();
			
			var remainTime = ((lastBuyTime - curTime)/1000).toString().replace(/\.\d*/gi,'');
			$('#issueTime').html(data.results[0].issue + '期');
			$('#nextIssue').addClass('hidden');
			$('#remainTime').removeClass('hidden');
			$('#submit').removeClass('issueOver');
			if(self.T){
				self.T.destroy();
			}
			//彩期刚开始一段时间内取得最后购买时间不正确，
			//通常计算出的剩余时间大于11分钟
			if(lastBuyTime - curTime > 11 * 60 * 1000){
				self.T = new Timer.initialize($('#issueInfo .time'),{
					remainTime: 360,
					callback: function(){
						_.delay(function(){
							self.fetchIssue();
							$('#submit').addClass('issueOver');
						},3000);
					}
				});
			}else{
				self.T = new Timer.initialize($('#issueInfo .time'),{
					remainTime: remainTime,
					callback: function(){
						_.delay(function(){
							self.fetchIssue();
							$('#submit').addClass('issueOver');
						},3000);
					}
				});
			}
			//此属性在投注使用，比如验证彩期是否过期、提交追号彩期列表
			this.issueObj = _.clone(data);
		},
		//无彩期的处理
		noIssueAct: function(data){
			var self = this;
			$('#submit').addClass('issueOver');
			if(data.results[0].resultCode == 'stop_sale' || data.results[0].resultCode == 'issue_stop_sale'){
				$('#issueInfo').html('<em class="tip">抱歉，本彩种暂停销售</em>');
				return;	
			}else if(data.results[0].resultCode == 'no_issue'){
				$('#issueInfo').html('<em class="tip">没有最近的彩期</em>');
			}else if(data.results[0].resultCode == 'get_issue_fail' || data.results[0].resultCode == 'ERR_GET_DATA'){
				$('#issueInfo').html('<em class="tip">未能获取彩期</em>');
			}else if(data.results[0].resultCode == 'issue_overdue'){
				$('#issueTime').html('等待开奖');
				$('#remainTime').addClass('hidden');
				$('#nextIssue').removeClass('hidden');
				if(self.T1){
					self.T1.destroy();
				}
				self.T1 = new Timer.initialize($('#nextIssue .time'),{
					remainTime: 60,
					callback: function(){
						_.delay(function(){
							self.fetchIssue();
						},3000);
					}
				});
			}
		},
		/**
		 * 拉取机选一注
		 * @memberOf BetApp
		 */
		pull: function(){
			var self = this;
			var istop = C.pullSelectscroll.y >= 0 ? true : false;
			_.delay(function(){
				istop && self.collection.random();
			},100);
		},
		/**
		 * 一次性把文档碎片插入dom
		 * @param frag{docmentFragment} 创建的文档碎片，此时已插入信息列表
		 * @name oneTimePush
		 * @memberOf BetApp
		 */
		oneTimePush: function(frag){
			var selectList  = $('#selectList');
			selectList.append(frag);
			C.betapp.guideShow().upFee();
			C.pullSelectscroll.refresh();
		},
		/**
		 * 构建pulldown to refresh
		 * @name buildPullRandom
		 * @memberOf BetApp
		 */
		buildPullRandom: function(){
			var self = this;
			this.g = $('#pullSelect .tip s');
			this.s = $('#pullSelect .tip span');
			Layout.setBetRegion().singleScroll('pullSelect',{
				//useTransition: true,
				topOffset: 60,
				//监测scroll时
				onScrollMove: function(){
					var that = this;
					self.timer && clearTimeout(self.timer);
					self.timer = setTimeout(function(){
						if(that.y >= 0){
							self.g.addClass('rotate');
							self.s.html('松开即可机选...');
						}else{
							self.g.removeClass('rotate');
							self.s.html('下拉可以机选...');
						}
					},20);
				},
				//监测手指离开触摸屏
				onTouchEnd: function(){
					self.pull();	
				},
				//监测scroll结束
				onScrollEnd: function(){
					self.g.removeClass('rotate');
					self.s.html('下拉可以机选...');
				},
				hideScrollbar: true
			});
		},
		/**
		 * 设置key值，用于玩法标识
		 * @memberOf BetApp
		 * return BetApp
		 */
		setKey: function(){
			C.Config.key = this.key;
			return this;
		},
		
		/**
		 * 根据选号列表的数据量，决定显示或隐藏导选图
		 * @memberOf BetApp
		 * @return BetApp
		 */
		guideShow: function(status){
			var select = $('#selectList'),
				guide = $('#guide');
			var hasLi = select.find('li').length > 1 ? true : false;
			var winH = window.innerHeight,
				bottH = $('.actarea').height();
			if(hasLi){
				guide.addClass('hidden');
				$('#selectList').css('minHeight',$('#pullSelect').height());
			}else{
				guide.removeClass('hidden');
				$('#selectList').css('minHeight',0);
			}
			return this;
		},
		/**
		 * 更新所需金额
		 * @name upFee
		 * @memberOf BetApp
		 * @return BetApp
		 */
		upFee: function(e){
			var betno = 0 , reg = /\D/gi;
			var bt = Number(this.bt.val());
			if(e){
				var _obj = $(e.currentTarget);
				_obj.val(_obj.val().replace(reg,''));
				if(_obj.attr('id') === 'zh'){
					if(_obj.val().length > 2){
						_obj.val(_obj.val().substring(0,2));
					}
				}
			}
			//倍投值不能超过此彩种设置的最大倍投数
			if(bt > this.collection.maxBt){
				this.bt.val(this.collection.maxBt);
			}
			
			for(var i=0,len=this.collection.models.length;i<len;i++){
				//如果是实例化colllection时，传进来的model ,忽略之
				if(this.collection.models[i].get('tempBox')){
					continue;
				}
				betno += this.collection.models[i].get('bet');
			}
			this.betno = betno;
			var extrabet = $('#dlt_append_vote').hasClass('checked') ? 1.5 : 1;
			var fee = Number(this.bt.val()) * Number(this.zh.val()) * betno * 2 * extrabet;
			this.fee.html(fee);
			return this;
		},
		/**
		 * 等待提交界面
		 * @memberOf BetApp 
		 */
		waitSubmit: function(){
			Layout.buildMaskLayer();
			$('body').append('<div class="wait"><p>正在提交订单，请稍候</p></div>');
		},
		/**
		 * 移除等待提交界面
		 * @memberOf BetApp
		 * @name removeWait
		 */
		removeWait: function(){
			Layout.removeMaskLayer();
			$('.wait').remove();
		},
		/**
		 * 提交投注
		 * @memberOf BetApp
		 * @name submit
		 */
		submit: function(e){
			e.preventDefault();
			var checked = this.validate();
			if(checked !== true){
				alert(checked,function(){},'提示','确定');
				return;
			}
			localStorage.setItem('betfrom',location.href);
			this.waitSubmit();
			var search = this.getFormFields();
			if(search){
				Tool.getScript(C.Config.getBetUrl() + search,{
					offhandler: this.removeWait
				});
			}
		},
		/**
		 * 订单回执
		 * @name orderCallback
		 * @memberOf BetApp
		 */
		orderCallback: function(obj){
			var self = this;
			this.removeWait();
			//如果返回错误代码
			if(obj.status === false){
				//如果未登录
				if(obj.resultCode === 'ERR_LOGIN'){
					var search = this.getFormFields();
					alert('登录已过期,请重新登录',function(){
						C.Config._login();
					},'提示','确定');
				}else{
					if(obj.resultCode === 'NEW_LOTTERY_USER'){
						new confirm.initialize({
							content: '购彩需要完善身份信息,现在就去?',
							onConfirm: function(){
								alipay.navigation.pushWindow('../newuser/n.html');
							},
							onCancel: function(){
							}
						});
					}else{
						localStorage.setItem('exceptionCode',obj.resultCode);
						alipay.navigation.pushWindow('../exception/exc.html');
					}
				}
			}else{
				C.Config.pay(obj);
				//投注页面上其他处理
				C.betcollection.clear();
				this.removeWait();
			}
		},
		/**
		 * 精简成功提交彩票订单返回页面URL（主要清理url中的订单相关参数）
		 * @memberOf BetApp
		 * @name cutPageUrl 
		 */
		cutPageUrl: function(){
			C.Config.cutPageUrl();
		},
		/**
		 * js触发click事件
		 * @memberOf BetApp
		 * @name simulateClick 
		 * @param el{dom}  裸的dom元素
		 */
		simulateClick: function(el){
			//检测是否webkit内核
			var isWebkit = /webkit/.test(navigator.userAgent.toLowerCase());
			if(isWebkit){
				try{  
		            var evt = document.createEvent('Event');  
		            evt.initEvent('click',true,true);  
		            el.dispatchEvent(evt);  
		        }catch(e){
		        	alert(e,function(){},'提示');
		        };
			}else{
				el.click();
			}
		},
		/**
		 * 检测合法性
		 * @memberOf BetApp
		 * @name validate
		 * @return 
		 */
		validate: function(){
			var bet = this.betno;
			if($('#submit').hasClass('issueOver')){
				return '等待开奖中，请稍后再投注!';
			}else if($('#submit').hasClass('disabled')){
				return '正在获取彩期，稍后再试!';
			}else if(bet == 0){
				return '请至少选择1注！';
			}else if(this.bt.val() == 0){
				return '倍投不能为空！';
			}else if(this.zh.val() == 0){
				return '请至少选择1期(即当前期)！';
			}else if(!this.agree.hasClass('checked')){
				return '你没有同意网上购彩协议！';
			}else if(Number(this.fee.html()) > 2000){
				return '单次投注不能超过2000元';
			}
			
			return true;
		},
		/**
		 * 整合提交订单的各字段值(忽略代购、合买、追号)
		 * @name getFormFields
		 * @memberOf BetApp
		 */
		getFormFields: function(){
			/**
			 * agree 是否同意购彩协议 , note: 1 ->同意	0 -> 不同意
			 * lotteryTypeId 彩种ID
			 * issueId 彩期ID ， note: xxxx -> 服务器端获取
			 * orderType 订单类型， note: 0 -> 代购	 1 -> 发起合买	2 -> 参与合买	3 -> 追号
			 * buyFrom 订单来源 note: 1 -> 无线
			 * ttid	固定字段	note: html5
			 * multiple 倍投
			 * totalNum 注数
			 * totalFee 金额
			 * numberStrings 选号格式 note：01 02 03 04 05 06:01&01 02 03 04 05 06:01
			 * callback jsonp回调，开发自定义
			 * sid 登陆后回调参数，用于验证用户登陆状态
			 */
			var numberStrings = encodeURIComponent(C.betcollection.getNumberString()),  //此处encode，解决投注号码字符串的'&'符
				agree = 1,
				lotteryTypeId = C.Config.lotTypeNumberId[C.Config.key.split('_')[0]],
				issueId = (typeof this.issueObj.issueId == 'undefined') ?  this.issueObj.results[0].issueId : this.issueObj.issueId,
				orderType = 0,
				buyFrom = 1,
				ttid = C.Config.ttid(),
				multiple = this.bt.val(),
				totalNum = this.betno,
				totalFee = this.fee.html(),
				//stopPursueType = $('#stopPursueType').hasClass('checked') ? 1 : 0,
				dlt_append_vote = $('#dlt_append_vote').hasClass('checked') ? 1 : 0;
			//支付宝客服端用户验证字段
			if(typeof alipay !== 'undefined'){
			    var token = alipay.session.token;
			}else{
			    var token = '';
			}
			//代购
			if(this.zh.val() == 1){
				return '?agree=' + agree + '&lotteryTypeId=' + lotteryTypeId + '&issueId=' + issueId + '&orderType=' + orderType + '&buyFrom=' + buyFrom + '&ttid=' + ttid  + '&multiple=' + multiple + '&totalNum=' + totalNum + '&totalFee=' + totalFee + '&numberStrings=' + numberStrings + '&callback=C.betapp.orderCallback&token=' + token + '&dlt_append_vote=' + dlt_append_vote;
			}else{  
				//追号
				/**
				 * 增加追号字段
				 */
				var zNo = Number(this.zh.val()) , singleIssueMoney = totalNum * multiple * 2;
				var maxZh = this.issueObj.pursueNumberIssues.length;
				if(zNo > maxZh){
					this.removeWait();
					alert('当前最多可追' + maxZh + '期',function(){},'提示','确定');
					return false;
				}
				var pursueIssueArr = [] , pursueMultiArr = [] , pursueMoneyArr = [] ,curIssueId = Number(this.issueObj.issueId);
				for(var i = 0;i < zNo; i++){
					pursueIssueArr.push(this.issueObj.pursueNumberIssues[i].issueId);
					pursueMultiArr.push(multiple);
					pursueMoneyArr.push(singleIssueMoney);
				}
				var pursueIssueList = pursueIssueArr.join(';'), 
					pursueMultiList = pursueMultiArr.join(';'), 
					pursueMoneyList = pursueMoneyArr.join(';'),
					pursueIssueCount = zNo,
					stopPursue = $('#afterLuckyStop').hasClass('checked') == true ? 1 : 0,
					orderType = 3;
				return '?agree=' + agree + '&lotteryTypeId=' + lotteryTypeId + '&pursueIssueList=' + pursueIssueList + '&pursueMultiList=' + pursueMultiList + '&pursueMoneyList=' + pursueMoneyList + '&pursueIssueCount=' + pursueIssueCount + '&stopPursue=' + stopPursue + '&issueId=' + issueId + '&orderType=' + orderType + '&buyFrom=' + buyFrom + '&ttid=' + ttid  + '&multiple=' + multiple + '&totalNum=' + totalNum + '&totalFee=' + totalFee + '&numberStrings=' + numberStrings + '&callback=C.betapp.orderCallback&token=' + token + '&dlt_append_vote=' + dlt_append_vote;
			}
		}
		
	});

	return {
		Model: BetModel,
		Collection: BetCollection,
		App: BetApp
	};
});
