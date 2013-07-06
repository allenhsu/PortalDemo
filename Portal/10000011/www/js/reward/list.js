
define(function(require,exports){
	var Layout = require('../base/layout');  //引入布局模块
	var Tool = require('../base/tool');
	var RewardModel = Backbone.Model.extend({});
	
	var RewardCollection = Backbone.Collection.extend({
		model: RewardModel,
		localStorage: new Store('reward'),
		initialize: function(){
			this.bind('reset',this.addAll,this);
		},
		addAll: function(){
			var frag = document.createDocumentFragment();
			this.each(function(m){
				var view = new RewardView({
					model: m
				});
				view.pushFrag(frag);
			});
			C.rewardapp.oneTimePush(frag);
		}		
	});
	
	var RewardView = Backbone.View.extend({
		tagName: 'li',
		events: {
			'touchstart': 'taped',
			'touchend': 'notap',
			'tap': 'showDetail'
		},
		//前往查看该彩种详细开奖信息
		showDetail: function(e){
			var obj = $(e.currentTarget).find('a'), 
				lotType = obj.attr('rel');
			localStorage.setItem('rewardDetailType',C.Config.lotTypeNumberId[lotType]);
			_.delay(function(){
				if (obj.attr('rev')) {
					localStorage.setItem('rewardDetailType', lotType);
					alipay.navigation.pushWindow('../reward/detail2.html');
				} else {
					alipay.navigation.pushWindow('../reward/detail.html');
				}
			},200);
		},
		taped: function(e){
			var obj = $(e.currentTarget);
			obj.addClass('taped');			
		},
		notap: function(e){
			var obj = $(e.currentTarget);
			obj.parent().find('li').removeClass('taped');
		},
		pushFrag: function(frag){
			var domstr = _.template($('#rewardDataTemp').html(),this.model.toJSON());
			this.$el.html(domstr);
			var c = this.$el.find('a').attr('rel');
			this.$el.addClass(c);
			$(frag).append(this.$el);
		}
	});
	
	var RewardApp = Backbone.View.extend({
		el: '#reward',
		/**
		 * 初始化
		 * @memberOf NavApp
		 * @param step{string} 应用步骤数，用于计算页面推送的方向
		 */
		initialize: function(){
			this.fetchReward();
		},
		/**
		 * 抓取开奖公告
		 * @name fetchReward
		 * @memberOf RewardApp 
		 */
		fetchReward: function(){
			var url = C.Config.getRewardDataUrl() + '?typeId=' + C.Config.getRewardTypes() + '&callback=C.rewardapp.handle&t=' + new Date().getTime();
			Tool.getScript(url , {
				offhandler: function () {
					$('.loading').addClass('hidden');				
				}
			});
		},
		/**
		 * 分发数据 
		 * @memberOf RewardApp
		 * @name oneTimePush
		 * @param data{object} 抓取回来的数据
		 * @return void
		 */
		handle: function(data){
			if(!data.status){
				alert('获取数据失败，请稍后再试');
			}else{
				var c = new RewardCollection();
				c.reset(data.results.concat(C.Config.rewardArray));
			}
		},
		/**
		 * 一次性把生成的文档片段插入dom
		 * @memberOf RewardApp
		 * @name oneTimePush 
		 * @param frag{dom} 文档碎片
		 */
		oneTimePush: function(frag){
			var self = this;
			$('#rewardMain ul').append(frag);
			_.delay(function(){
				$('#rewardMain').removeClass('hidden');
				C.rewardMainscroll.refresh();
			},100);
		}
	});
	
	
	return {
		initialize: function(){
			//创建该页的iscroll对象
			Layout.buildScroll('rewardMain');
			C.rewardapp = new RewardApp();
		}
	};
});
