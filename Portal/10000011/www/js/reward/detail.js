
define(function(require,exports){
	var Layout = require('../base/layout');  //引入布局模块
	var Tool = require('../base/tool');
	var Pull = require('../widget/pull-to-act/js/pull-to-act');
	
	var Model = Backbone.Model.extend({});
	
	var ListCollection = Backbone.Collection.extend({
		model: Model,
		localStorage: new Store('rewardList'),
		initialize: function(){
			this.bind('add',this.addOne,this);
		},
		addOne: function(model){
			var view = new RewardView({
				model: model
			});
			view.render();
		}		
	});
	
	var RewardView = Backbone.View.extend({
		tagName: 'li',
		render: function(){
			var domstr = _.template($('#rewardDataListTemp').html(),this.model.toJSON());
			this.$el.html(domstr);
			$('#rewardListMain ul').append(this.$el);
			C.rewarddetail.s.getScrollObj().refresh();	
		}
	});
	
	var RewardDetail = Backbone.View.extend({
		el: '#rewardList',
		//默认拉取第一页
		page: 1,
		//默认一页10条数据
		pageSize: 10,
		//已经拉取的次数
		_exsit: 1,
		/**
		 * 初始化
		 * @memberOf NavApp
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		initialize: function(){
			this.type = localStorage.getItem('rewardDetailType');
			this.setTitle();
			this.fetchList();
			this.buildPullRefresh();
		},
		/**
		 * 创建该页的iscroll对象
		 * @memberOf ListApp
		 * @name buildPullRefresh
		 * @return void
		 */
		buildPullRefresh: function(){
			var self = this;
			this.s =  new Pull.initialize('#rewardListMain',{
				upGuideCon: '上拉获取更多',
				reverseCon: '松开即可获取',
				bindPullUp: true,
				loading: '正在加载...',
				upAct: function(){
					self.fetchList();
				}
			});
		},
		/**
		 * 设置标题
		 * @memberOf ListApp
		 * @name setTitle
		 * @return ListApp
		 */
		setTitle: function(type){
			alipay.navigation.setTitle(C.Config.lotteryTypeNumberHash[this.type]);
		},
		/**
		 * 设置开奖公告列表右侧按钮状态(显示以否、超链接)
		 */
		setRLRightBar: function(type){
			
		},
		/**
		 * 抓取开奖公告数据
		 * @name fetchReward
		 * @memberOf ListApp 
		 */
		fetchList: function(){
			var url = C.Config.getRewardDataListUrl() + '?typeId=' + this.type + '&callback=C.rewarddetail.handle&t=' + new Date().getTime() + '&page=' + this.page + '&pageSize=' + this.pageSize;
			var self = this;
			Tool.getScript(url,{
				offhandler: function () {
					self.$('.getMore').removeClass('hidden');
					self.$('.load').addClass('hidden');
					self.s.getScrollObj().refresh();			
				}
			});
		},
		/**
		 * 分发数据 
		 * @memberOf ListApp
		 * @name oneTimePush
		 * @param data{object} 抓取回来的数据
		 * @return void
		 */
		handle: function(data){
			this.page ++;
			var self = this;
			if(!data.status){
				alert('获取数据失败，请稍后再试',function(){},'提示');
			}else{
				var c = new ListCollection();
				_.each(data.issueList,function(n){
					n.lotteryType = self.type
				});
				_.each(data.issueList,function(m){
					c.create(m);
				});
				_.delay(function(){
					self.$('.getMore').removeClass('hidden');
					self.$('.load').addClass('hidden');
					self.s.getScrollObj().refresh();
				},100);
				$('#rewardListMain').removeClass('hidden');
			}
		}
	});
	
	return {
		initialize: function(){
			C.rewarddetail = new RewardDetail();
		}
	};
});
