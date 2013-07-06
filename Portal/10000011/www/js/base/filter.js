
/**
 * 声明seajs模块
 * 竞技彩赛事筛选
 */
define(function(require,exports,module){
	var Tool = require('../base/tool');
	
	var FilterModel = Backbone.Model.extend({});

	/**
	 * 赛事筛选视图
	 * @class AppView
	 * @name AppView
	 */
	var AppView = Backbone.View.extend({
		el: '#filter-content',
		events: {
			'click li': 'setCheck'
		},
		_template: $('#FilterTemp').html(),
		//初始化
		initialize: function(cfg) {
			var self = this;
			//配置
			cfg = $.extend({}, cfg);
			Tool.buildCfg.call(self, cfg);
			
			//左操作符：返回
			window['leftBar'] = function() {
				//直接返回
				alipay.navigation.popWindow();	
			};
			
			//右操作符：确定
			window['rightBar'] = function() {
				//修改本地存储
				var _old = localStorage.getItem('__tbcp__filter'),
					_new = JSON.stringify(self.model.toJSON());
				if (_old !== _new) {
					localStorage.setItem('__tbcp__filter__change', 'true');
					localStorage.setItem('__tbcp__filter', _new);
				}
				alipay.navigation.popWindow();
			};
			
			//test
			$('#leftBar').click(function(){
				window.leftBar();
			});
			$('#rightBar').click(function(){
				window.rightBar();
			});
			
			//model initialize
			this.model = new FilterModel(JSON.parse(localStorage.getItem('__tbcp__filter')));	
			this.model.bind('change:length', this.change, this);		
			this.render();
		},
		//UI生成
		render: function() {
			this.$el.html(juicer(this._template, this.model.toJSON()));
			return this;
		},
		change: function() {
			this.$el.find('#num').html(this.model.get('length'));
		},
		//设置选中
		setCheck: function(e) {
			var tar = $(e.currentTarget);
				
			//不可点击，直接返回
			if (tar.hasClass('disable')) {
				return;
			}

			Tool.toggleClass(tar, 'on');
			
			//change model
			var model = this.model,
				data = model.get('data'),
				lenth = model.get('length'),
				key = tar.html(),
				value = data[key],
				select;
			
			select = value.select = !value.select;
			
			if (select) {
				model.set('length', lenth + value.num);
			} else {
				model.set('length', lenth - value.num);
			}
		}
	});
	
	return {
		app: AppView
	}
});
