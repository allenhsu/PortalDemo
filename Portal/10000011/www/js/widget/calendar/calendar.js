
/**
 * 声明组件模块
 */
define(function(require,exports){
	
	/**
	 * 日历组件类
	 * @class Calendar
	 * @name Calendar
	 */
	var Calendar = function(){
		this.initialize.apply(this,arguments);
	};
	
	/**
	 * 日历组件原型对象
	 */
	Calendar.prototype = {
		/**
		 * 构造函数
		 * @param selector{string} 日历包裹器的选择器
		 * @param cfg{object} 配置项  e.g: {
		 * 		trigger: selector,	//触发器的选择器
		 *		onSelect: fn,		//选择时间后的回调函数
		 *		disabledStart: '20120514'  //日历上不可用的时间点（保证月份和天为两位数）
		 * }
		 */
		initialize: function(selector,cfg){
			var self = this;
			//this.click = 'ontouchstart' in window ? 'tap' : 'click';
			this.click = 'click';  //由于会有模拟点击，无法模仿tap事件
			this.pannel = $(selector);
			this.initCfg(cfg);
			//如果含有触发器
			if($(this.trigger).length > 0){
				$(this.trigger).on(this.click,function(e){
					e.stopPropagation();
					if($.trim(self.pannel.html()) == ''){
						self.firstShow();
					}else{
						self.pannel.toggleClass('hidden');
					}
				});
			}else{
				this.firstShow();
			}
			
		},
		/**
		 * 首次渲染日历操作
		 * @memberOf calendar
		 * @name firstShow
		 */
		firstShow: function(){
			var self = this;
			var curDate = self.getCurDate(),
				domStr = self.getDomStr();
			self.buildDom(domStr,curDate.year,curDate.month);
			self.renderDate(curDate.year,curDate.month);
		},
		/**
		 * 初始化配置项
		 * @memberOf Calendar
		 * @name initCfg
		 * @param cfg{object} 配置项
		 */
		initCfg: function(cfg){
			this.trigger = cfg.trigger || '',
			this.onSelect = cfg.onSelect || function(o){alert(o.year+'-'+o.month+'-'+o.date)};
			this.disabledStart = cfg.disabledStart || false;
		},
		/**
		 * 绑定事件监听
		 * @memberOf Calendar
		 * @name bindEvent
		 */
		bindEvent: function(){
			var self = this;
			this.pannel.find('.widgetPrev').on(this.click,function(e){
				self.prev.call(self,e);
			});
			this.pannel.find('.widgetNext').on(this.click,function(e){
				self.next.call(self,e);
			});
			this.pannel.on(this.click,function(e){
				var obj = $(e.target);
				e.stopPropagation();
				if(obj.parent().hasClass('widgetDate') && obj.html() != '' && !obj.hasClass('disabled')){
					self.onSelect({
						year: Number(self.Year.html()),
						month: Number(self.Month.html()),
						date: obj.html() == '今天' ? Number(obj.attr('rel')) : Number(obj.html())
					});
					self.dateWrapper.find('em').removeClass('select');
					obj.addClass('select');
					if($(self.trigger).length > 0){
						self.pannel.addClass('hidden');
					}
				}else{
					//e.stopPropagation();
				}
			});
		},
		/**
		 * 切换上个月
		 * @memberOf Calendar
		 * @name prev
		 */
		prev: function(e){
			e.preventDefault();
			var y = Number(this.Year.html()),
				m = Number(this.Month.html());
			if(m == 1){
				this.Year.html(y-1);
				this.Month.html(12);
				this.renderDate(y-1,12);
			}else{
				this.Month.html(m-1);	
				this.renderDate(y,m-1);
			}
		},
		/**
		 * 切换下个月
		 * @memberOf Calendar
		 * @name next
		 */
		next: function(e){
			e.preventDefault();
			var y = Number(this.Year.html()),
				m = Number(this.Month.html());
			if(m == 12){
				this.Year.html(y+1);
				this.Month.html(1);
				this.renderDate(y+1,1);
			}else{
				this.Month.html(m+1);	
				this.renderDate(y,m+1);
			}
		},
		/**
		 * 获得当前的日期
		 * @memberOf Calendar
		 * @name getCurDate
		 * @return date{object} e.g: {year:2012,month:5,dates:14} -> 2012-5-14
		 */
		getCurDate: function(){
			var _date = new Date();
			var year = _date.getFullYear(),
				month = _date.getMonth() + 1,
				dates = _date.getDate();
			return {
				year: year,
				month: month,
				dates: dates
			};
		},
		/**
		 * 获得构建dom的字符串
		 * @memberOf Calendar
		 * @name getDomStr
		 * @return domStr{string}
		 */
		getDomStr: function(){
			var domStr = '\
				<header class="widgetHd">\
					<em class="widgetPrev"><<</em>\
					<em class="widgetNext">>></em>\
					<span class="widgetDateShow"><em class="y"></em>年<em class="m"></em>月</span>\
				</header>\
				<section class="widgetBd">\
					<div class="widgetDay">\
						<span>日</span>\
						<span>一</span>\
						<span>二</span>\
						<span>三</span>\
						<span>四</span>\
						<span>五</span>\
						<span>六</span>\
					</div>\
					<div class="widgetDate"></div>\
				</section>';
			return domStr;
		},
		/**
		 * 构建日历的基本dom架构
		 * @memberOf Calendar
		 * @name buildDom
		 * @param domStr{string} 
		 */
		buildDom: function(domStr,curYear,curMonth){
			var self = this;
			self.pannel.addClass('widgetCalendar').append(domStr);
			var frag = document.createDocumentFragment();
			for(var i=0;i<42;i++){
				var em = document.createElement('em');
				frag.appendChild(em);
			}
			this.Year = this.pannel.find('.widgetHd .y');
			this.Month = this.pannel.find('.widgetHd .m');
			this.setTitle(curYear,curMonth);
			this.dateWrapper = this.pannel.find('.widgetDate');
			this.dateWrapper.append(frag);
			self.dateBoxs = this.dateWrapper.find('em');	
			self.bindEvent();
		},
		/**
		 * 设置日历标题中的年月
		 * 
		 */
		setTitle: function(year,month){
			this.Year.html(year);
			this.Month.html(month);
		},
		/**
		 * 判断是否闰年
		 * @param iYear{number} 年份
		 * @name isLeapYear
		 * @memberOf Calendar
		 * @return boolean
		 */
		isLeapYear: function(iYear){
			if(iYear%4==0&&iYear%100!=0){
				return true;
			}else{
				if(iYear%400==0){
					return true;
				}else{
					return false;
				}
			}
		},
		/**
		 * 根据传入的年月参数渲染当月的日期
		 * @memberOf Calendar
		 * @name renderDate
		 * @param domStr{string} 
		 */
		renderDate: function(year,month){
			//先拿到当前日期对象
			var curDate = this.getCurDate();
			this.dateBoxs.each(function(){
				this.innerHTML = '';
				$(this).removeClass('select');
			});
			var nDate = new Date(),
				daynum = 0;
			if(month==1||month==3||month==5||month==7||month==8||month==10||month==12){
				daynum = 31;
			}else if(month==4||month==6||month==9||month==11){
				daynum = 30;
			}else if(month==2&&this.isLeapYear(year)){
				daynum = 29;
			}else{
				daynum = 28;
			}
			nDate.setFullYear(year);
			nDate.setMonth(month-1);
			nDate.setDate(1);
			for(var i=0;i<daynum;i++){
				var box = this.dateBoxs.eq(i+nDate.getDay());
				if(year == curDate.year && month == curDate.month && (i+1) == curDate.dates){
					box.addClass('cur').html('今天').attr('rel',i+1);
				}else{
					box.removeClass('cur').html(i+1);
				}
				var fullDate = Number(year + this.padData(month) + this.padData(i+1));
				if(fullDate >= Number(this.disabledStart)){
					box.addClass('disabled');
				}else{
					box.removeClass('disabled');
				}
			}
		},
		/**
		 * 填充位数到2位
		 * @param n{number} 数字
		 * @memberOf Calendar
		 * @name padData
		 * @return string
		 */ 
		padData: function(n){
			if(n.toString().length < 2){
				n = '0' + n.toString();
				return n;
			}
			return n.toString();
		}

	};
	
	//外部调用接口
	exports.create = function(selector,cfg){
		new Calendar(selector,cfg);
	};
});