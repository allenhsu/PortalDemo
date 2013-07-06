

/**
 * 声明seajs模块
 */
define(function(require, exports, module){
	var Tool = require('../base/tool'),
		Layout = require('../base/layout'),
		Calendar = require('../widget/calendar/calendar'),
		Reward = require('./detail2');
	
	var IssueListModel = Backbone.Model.extend({});

	/**
	 * 对阵列表视图
	 * @class IssueListView
	 * @name IssueListView
	 */
	var IssueListView = Backbone.View.extend({
		el: '#issueList',
		events: {
			'click dd': 'setSelect' 
		},
		_template: $('#IssueTemp').html(),	
		initialize: function() {
			this.model = new IssueListModel();
		},
		//渲染数据
		render: function() {
			var obj = this.model.toJSON();
			//渲染数据
			$(this.el).html(_.template(this._template, obj));
			return this;
		},
		//点击设置选中
		setSelect: function(e) {
			e.stopPropagation();
			//不可点击，直接返回
			var tar = $(e.currentTarget);
			if (tar.hasClass('disable')) {
				return;
			}
			this.$el.find('dd').removeClass('on');
			tar.addClass('on');
			C.ZQDC.triggerChange(tar);
		}	
	});
		
	return {
		initialize: function(){
			C.Config = $.extend(C.Config, {
				rewardDataListUrl_pro: 'http://caipiao.m.taobao.com/lottery/html5/getAwardMatchsDcAjax.do', //生产环境
				rewardDataListUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getAwardMatchsDcAjax.do', //生产环境
				rewardDataListUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getAwardMatchsDcAjax.do', //开发环境
		
				rewardIssueListUrl_pro: 'http://caipiao.m.taobao.com/lottery/html5/getIssueLastLuckNumsList.do', //生产环境
				rewardIssueListUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getIssueLastLuckNumsList.do', //生产环境
				rewardIssueListUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getIssueLastLuckNumsList.do', //开发环境
				getRewardIssueListUrl: function(){
					return this['rewardIssueListUrl_' + data_env];
				}
			});
	
			C.ZQDC = new Reward.app({
				lotteryType: 16,
				lotteryTypeName: 'DC_SPF',
				lotteryTypeLocalName: '足球单场',
				playType: 200,
				tpl: $('#ZQItemTemp').html(),
				getData: function() {
					var self = this,
						url = C.Config.getRewardIssueListUrl() + '?typeId=' + self.lotteryType + '&page=1&pageSize=10&callback=C.ZQDC.handleIssue';
					
					$(document).on('click',function(e){
						self.issueListView.$el.hide();
						Layout.removeTransBox();
					});
					
					//get issueList
					Tool.getScript(url);
				},
				handleIssue: function(data) {
					if (data.status === true && data.issueList.length > 0) {
						var issueList = C.ZQDC.issueList = data.issueList,
							curIssue = issueList[0];
						this.getRewardData(curIssue.issue, curIssue.issue_id);	
					} else {
						$('#loading').html('未能获取彩期').removeClass('hidden');
					}
				},
				getRewardData: function(issue, issueId) {
					/*if (typeof alipay !== 'undefined') {
						alipay.navigation.setRightItemTitle('第' + issue + '期');
					}*/
					var url = C.Config.getRewardDataListUrl() + '?callback=C.ZQDC.initReward&lotteryTypeId=' + this.lotteryTypeName + '&issueId=' + issueId + '&playType=' + this.playType + '&t=' + new Date().getTime();
					Tool.getScript(url);
				},
				showHistory: function() {
					Layout.buildMaskLayer();
					if (!this.issueListView) {
						this.issueListView = new IssueListView();
						this.issueListView.model.set('issueList', this.issueList);
						this.issueListView.render()
					} 
					this.issueListView.$el.show();
				},
				triggerChange: function(node) {
					this.issueListView.$el.hide();
					Layout.transBox('正在努力请求数据');
					this.getRewardData(node.attr('data-issue'), node.attr('data-id'));
				}
			});
		}
	}
});