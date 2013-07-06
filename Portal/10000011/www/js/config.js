/**
 * @author donghan
 */
/**
 * app初始配置项
 */
var C = {};
var data_env = 'pro';


document.addEventListener('login',function(){
	location.reload()
},false);

C.Config = {
	//彩种key值，此key值更新
	key: '',
	//获取系统平台，主要区分ios和android
	platform: (function(){
		var useragent = navigator.userAgent.toLowerCase();
		if(useragent.indexOf('iphone') >= 0 || useragent.indexOf('ipad') >= 0 || useragent.indexOf('ipod') >= 0){
			return 'ios';
		}else if(useragent.indexOf('android') >= 0){
			return 'android';
		}else{
			return 'other';
		}
	})(),
	//true->初次加载应用或刷新	false->子页面之间切换
	appLoadStatus: true,
	//投注篮待编辑的单注
	editModel: {},
	//记录是否是继续选号（继续选号状态，选号盘多出取消选号功能）
	isContinue: false,
	//用于标示彩票订单来源，默认是html5
	ttid: function(){
		var str = '',
			plat = this.platform;
		if(plat === 'ios'){
			str = 'zfb001#ios';
		}else if(plat === 'android'){
			str = 'zfb001#android';
		}
		return encodeURIComponent(str);
	},
	//彩种对应hash对象(用于初始化合买表单项)
	lotteryTypeHash: {
		'ssq': '双色球',
		'dlt': '大乐透',
		'xssc': '时时彩',
		'fc3d': '福彩3D',
		'pl3': '排列三',
		'pl5': '排列五',
		'swxw': '15选5',
		'qxc': '七星彩',
		'qlc': '七乐彩',
		'jczq': '竞彩足球',
		'zqdc': '足球单场',
		'jclq': '竞彩篮球',
		'syy': '十一运夺金'
	},
	lotteryTypeNumberHash: {
		'1': '双色球',
		'8': '大乐透',
		'14': '时时彩',
		'2': '福彩3D',
		'6': '排列三',
		'18': '排列五',
		'22': '15选5',
		'13': '七星彩',
		'7': '七乐彩',
		'21': '竞彩足球',
		'16': '足球单场',
		'20': '竞彩篮球',
		'15': '十一运夺金'
	},
	//lotteryTypeId查询map
	lotTypeNumberId: {
		ssq: 1,
		fc3d: 2,
		swxw: 22,
		qlc: 7,
		dlt: 8,
		qxc: 13,
		pl3: 6,
		pl5: 18,
		xssc: 14,
		syy: 15,
		kl8: 19,
		jczq: 21,
		jclq: 20,
		zqdc: 16
	},
	//已经完成彩种
	doneLot: [1,8,7,22,2,15,14,16],
	//配置开奖公告包含的彩种
	rewardTypeList: 'ssq,dlt,xssc,fc3d,pl3,pl5,swxw,qxc,qlc,syy,zqdc',
	/**
	 * 获得开奖公告包含彩种对应的typeId列表
	 * @return string ,如：'1,8,14,2,6,18,22,13,7'
	 */
	getRewardTypes: function(){
		var self = this;
		var arr = this.rewardTypeList.split(','),
			_arr = [];
		_.each(arr,function(n){
			_arr.push(self.lotTypeNumberId[n]);
		});
		return _arr.join(',');
	},
	//竞彩开奖结果，接口不会返回，需要人工添加
	rewardArray: [{"lotteryType": "21"},{"lotteryType": "20"}],
	/**
	 * 选号盘对应的投注页hash，用于配置其“返回”“完成”
	 */
	abacusBetMap: {
		ssq_common: '#!ssq/bet/2',
		dlt_common: '#!dlt/bet/2',
		qlc_common: '#!qlc/bet/2',
		
		fc3d_zhx: '#!fc3d/zhx/bet/2',
		fc3d_zhxhz: '#!fc3d/zhx/bet/2',
		fc3d_z3: '#!fc3d/z3/bet/2',
		fc3d_z3hz: '#!fc3d/z3/bet/2',
		fc3d_z6: '#!fc3d/z6/bet/2',
		fc3d_z6hz: '#!fc3d/z6/bet/2',
		
		syy_rx2: '#!syy/rx2/bet/2',
		syy_rx3: '#!syy/rx3/bet/2',
		syy_rx4: '#!syy/rx4/bet/2',
		syy_rx5: '#!syy/rx5/bet/2',
		syy_rx6: '#!syy/rx6/bet/2',
		syy_rx7: '#!syy/rx7/bet/2',
		syy_rx8: '#!syy/rx8/bet/2',
		syy_q1: '#!syy/q1/bet/2',
		syy_q2zhx: '#!syy/q2zhx/bet/2',
		syy_q2zx: '#!syy/q2zx/bet/2',
		syy_q3zhx: '#!syy/q3zhx/bet/2',
		syy_q3zx: '#!syy/q3zx/bet/2',
		
		xssc_x1zhx: '#!xssc/x1zhx/bet/2',
		xssc_dxds: '#!xssc/dxds/bet/2',
		xssc_x2zhx: '#!xssc/x2zhx/bet/2',
		xssc_x2zx: '#!xssc/x2zx/bet/2',
		xssc_x3zhx: '#!xssc/x3zhx/bet/2',
		xssc_x3z3: '#!xssc/x3z3/bet/2',
		xssc_x3z6: '#!xssc/x3z6/bet/2',
		xssc_x4zhx: '#!xssc/x4zhx/bet/2',
		xssc_x5zhx: '#!xssc/x5zhx/bet/2',
		xssc_x5tx: '#!xssc/x5tx/bet/2',

		swxw_common: '#!swxw/bet/2'
	},
	/**
	 * 彩种名称map查询
	 */
	lotNameMap: {
		ssq: '双色球',
		dlt: '大乐透',
		qlc: '七乐彩',
		fc3d: '福彩3D',
		swxw: '15选5',
		syy: '十一运夺金',
		xssc: '时时彩'
	},
	/**
	 * key值对应的选号盘hash，用于配置投注页“手选”
	 */
	keyAbacusMap: {
		ssq_common: '#!ssq/common/3',
		dlt_common: '#!dlt/common/3',
		qlc_common: '#!qlc/common/3',
		fc3d_zhx: '#!fc3d/zhx/3',
		fc3d_zhxhz: '#!fc3d/zhxhz/3',
		fc3d_z3: '#!fc3d/z3/3',
		fc3d_z3hz: '#!fc3d/z3hz/3',
		fc3d_z6: '#!fc3d/z6/3',
		fc3d_z6hz: '#!fc3d/z6hz/3',
		swxw_common: '#!swxw/common/3',

		syy_rx2: '#!syy/rx2/3',
		syy_rx3: '#!syy/rx3/3',
		syy_rx4: '#!syy/rx4/3',
		syy_rx5: '#!syy/rx5/3',
		syy_rx6: '#!syy/rx6/3',
		syy_rx7: '#!syy/rx7/3',
		syy_rx8: '#!syy/rx8/3',
		syy_q1: '#!syy/q1/3',
		syy_q2zhx: '#!syy/q2zhx/3',
		syy_q2zx: '#!syy/q2zx/3',
		syy_q3zhx: '#!syy/q3zhx/3',
		syy_q3zx: '#!syy/q3zx/3',
		
		xssc_x1zhx: '#!xssc/x1zhx/3',
		xssc_dxds: '#!xssc/dxds/3',
		xssc_x2zhx: '#!xssc/x2zhx/3',
		xssc_x2zx: '#!xssc/x2zx/3',
		xssc_x3zhx: '#!xssc/x3zhx/3',
		xssc_x3z3: '#!xssc/x3z3/3',
		xssc_x3z6: '#!xssc/x3z6/3',
		xssc_x4zhx: '#!xssc/x4zhx/3',
		xssc_x5zhx: '#!xssc/x5zhx/3',
		xssc_x5tx: '#!xssc/x5tx/3'
	},
	betHashMap: {
		ssq: ['#!ssq/bet/2'],
		dlt: ['#!dlt/bet/2'],
		qlc: ['#!qlc/bet/2'],
		swxw: ['#!swxw/bet/2'],
		fc3d: ['#!fc3d/zhx/bet/2','#!fc3d/z3/bet/2','#!fc3d/z6/bet/2'],
		syy: ['#!syy/rx2/bet/2','#!syy/rx3/bet/2','#!syy/rx4/bet/2','#!syy/rx5/bet/2','#!syy/rx6/bet/2','#!syy/rx7/bet/2','#!syy/rx8/bet/2','#!syy/q1/bet/2','#!syy/q2zhx/bet/2','#!syy/q2zx/bet/2','#!syy/q3zhx/bet/2','#!syy/q3zx/bet/2'],
		xssc: ['#!xssc/x1zhx/bet/2','#!xssc/dxds/bet/2','#!xssc/x2zhx/bet/2','#!xssc/x2zx/bet/2','#!xssc/x3zhx/bet/2','#!xssc/x3z3/bet/2','#!xssc/x3z6/bet/2','#!xssc/x4zhx/bet/2','#!xssc/x5zhx/bet/2','#!xssc/x5tx/bet/2']
	},
	/**
	 * 验证用户登陆接口（返回用户名） 
	 */
	checkLoginUrl_pro: 'http://caipiao.m.taobao.com/lottery/html5/getUserInfoAjax.do',  //生产环境
	checkLoginUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getUserInfoAjax.do',  
	checkLoginUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getUserInfoAjax.do',  //开发环境
	getCheckLoginUrl: function(){
		return this['checkLoginUrl_' + data_env];
	},
	/**
	 * 彩期接口
	 */
	issueDataUrl_pro: 'http://caipiao.m.taobao.com/lottery/html5/getIssueListAjaxV2.do',  //生产环境
	issueDataUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getIssueListAjaxV2.do',  //生产环境
	issueDataUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getIssueListAjaxV2.do',	//开发环境
	getIssueDataUrl: function(){
		return this['issueDataUrl_' + data_env];
	},
	/**
	 * 竞技彩对阵接口
	 */
	matchDataUrl_pro: 'http://caipiao.m.taobao.com/lottery/html5/getMatchsInfoAjax.do', //生产环境
	matchDataUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getMatchsInfoAjax.do', //生产环境
	matchDataUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getMatchsInfoAjax.do', //开发环境
	getMatchDataUrl: function(){
		return this['matchDataUrl_' + data_env];
	},
	/**
	 * 开奖公告聚合页数据接口 (多彩种)
	 */
	rewardDataUrl_pro: 'http://caipiao.m.taobao.com/lottery/html5/getIssueLastLuckNums.do', //生产环境
	rewardDataUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getIssueLastLuckNums.do', //生产环境
	rewardDataUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getIssueLastLuckNums.do', //开发环境
	getRewardDataUrl: function(){
		return this['rewardDataUrl_' + data_env];
	},
	/**
	 * 开奖公告列表页数据接口 ---单彩种
	 */
	rewardDataListUrl_pro: 'http://caipiao.m.taobao.com/lottery/html5/getIssueLastLuckNumsList.do', //生产环境
	rewardDataListUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getIssueLastLuckNumsList.do', //生产环境
	rewardDataListUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getIssueLastLuckNumsList.do', //开发环境
	getRewardDataListUrl: function(){
		return this['rewardDataListUrl_' + data_env];
	},
	/**
	 * 提交投注接口(不区分代购、合买)
	 */
	betUrl_pro: 'http://caipiao.m.taobao.com/lottery/html5/getSubmitOrderAjaxV2.do', //生产环境
	betUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getSubmitOrderAjaxV2.do', //生产环境p
	betUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getSubmitOrderAjaxV2.do', //开发环境
	getBetUrl: function(){
		return this['betUrl_' + data_env];
	},
	/**
	 * 用户登陆URL
	 */
	loginUrl_pro: 'http://login.m.taobao.com/login.htm' , //生产环境
	loginUrl_pre: 'http://login.m.taobao.com/login.htm' , //生产环境
	loginUrl_dev: 'http://login.waptest.taobao.com/login.htm' , //开发环境
	getLoginUrl: function(){
		return this['loginUrl_' + data_env];
	},
	/**
	 * 用户登出URL
	 */
	logoutUrl_pro: 'http://login.m.taobao.com/logout.htm' , //生产环境
	logoutUrl_pre: 'http://login.m.taobao.com/logout.htm' , //生产环境
	logoutUrl_dev: 'http://login.waptest.taobao.com/logout.htm' , //开发环境
	getLogoutUrl: function(){
		return this['logoutUrl_' + data_env];
	},
	/**
	 * 注册URL 
	 */
	registerUrl_pro: 'http://u.m.taobao.com/reg/newUser.htm', //生产环境
	registerUrl_pre: 'http://u.m.taobao.com/reg/newUser.htm', //生产环境
	registerUrl_dev: 'http://u.waptest.taobao.com/reg/new_user.htm', //开发环境
	getRegisterUrl: function(){
		return this['registerUrl_' + data_env];
	},
	/**
	 * 我的订单URL 
	 */
	myOrderUrl_pro: 'http://caipiao.m.taobao.com/go/act/caipiao/html5-order.php?host=pro&mode=html5',  //生产环境
	myOrderUrl_dev: 'http://caipiao.mtest.taobao.com/apps/lottery/wap/demo/order.php?host=dev&mode=html5',  //开发环境
	getMyOrderUrl: function(){
		return this['myOrderUrl_' + data_env];
	},
	/**
	 * 支付页单笔交易URL
	 */
	paySingleUrl_pro: 'http://mali.alipay.com/w/trade_pay.do',  //生产环境  
	paySingleUrl_dev: 'http://mali.alipay.net/w/trade_pay.do', //开发环境
	getPaySingleUrl: function(){
		return this['paySingleUrl_' + data_env];
	},
	/**
	 * 支付页多笔交易URL
	 */
	payMultiUrl_pro: 'http://mali.alipay.com/batch_payment.do',
	payMultiUrl_dev: 'http://mali.alipay.net/batch_payment.do',
	getPayMultiUrl: function(){
		return this['payMultiUrl_' + data_env];
	},
	/**
	 * 提交用户新增信息，姓名、手机号、身份证
	 */
	userInfo_pro: 'http://caipiao.m.taobao.com/lottery/html5/getAndUpdateUserAjax.do',
	userInfo_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getAndUpdateUserAjax.do',
	userInfo_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getAndUpdateUserAjax.do',
	postUserInfo: function(){
		return this['userInfo_' + data_env];
	},
	/**
	 * 跳到我的订单
	 */
	gotoOrder: function(obj,sid,e){
		obj.attr('href',this.getMyOrderUrl() + '&sid=' + sid + '&from=' + encodeURIComponent(location.href));
	},
	/**
	 * 订单处理异常码 （跳转异常显示页）
	 */
	exception: {
		'ERR_LOGIN': '用户未登陆',
		'ERR_SYSTEM': '系统错误',
		'NEW_LOTTERY_USER': '您还不是彩票用户',
		'ERR_TAOBAO_USER': '你还没有设置淘宝账户,不能购买彩票',
		'ERR_ALPAY_USER': '您没有开通支付宝帐户',
		'ERR_AGREE': '请阅读并同意代购协议再进行投注',
		'ERR_NUMBER': '投注号码不能为空',
		'ERR_UNITED_COUNT': '合买请输入正确的份数',
		'ERR_TOTALFEE': '投注总金额不能5000',
		'NOT_SALE_TIME': '竞彩官方停售时间，不能代购',
		'SYSTEM_CONFIG_ERROR': '缺少对应的彩期信息',
		'ID_CARD_NUMBER_INVALID': '用户身信息验证失败',
		'lOTTERY_STOP': '停售',
		'ISSUE_OVERDUE': '代购截至时间，不能购买',
		'ISSUE_STOP': '已经停售，不能购买',
		'ORDER_INFO_VERFICATION_FAILED': '校验失败',
		'MAX_MONEY': '单次投注超过了订单最大金额限制',
		'MAX_TICKETS_PER_ORDER_EXCEED' : '单个支付订单对应的票数超过限制',
		'LIMIT_NUM_ERROR' : '订单因限号不通过',
		'MAX_MONEY_PER_ORDER_EXCEED': '单个彩票订单超过金额限制',
		'ISSUE_LOTTERY_ORDER_LIMIT': '该期订单数超过限制',
		'CREATE_ORDER_FAILED': '创建淘宝订单和彩票订单失败',
		'PURSUE_ISSUE_OVERDUE': '第一个追号期已经过期'
	},
	/**
	 * 是否先提示探测本地数据
	 */
	tipDetect: false,
	/**
	 * 支付接口，web和app方式不同
	 */
	pay: function(obj){
		var self = this;
		if(typeof alipay !== 'undefined'){
			alipay.tradePay(obj.tradeNo,alipay.session.token,'','','',function(o){
				//self.changeUrl('index-alipay-native-app.html');
			},function(){});
		}
	},
	/**
	 * 精简成功提交彩票订单返回页面URL（主要清理url中的订单相关参数）
	 */
	cutPageUrl: function(){
		var search = location.search,
			hash = location.hash;
		var sid = Tool.searchJSON(search).sid;
		C.Config.changeUrl(location.href.replace(search,'').replace(hash,'') + '?sid=' + sid + hash);
	},
	/**
	 * 模拟点击
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
	        	alert(e);
	        };
		}else{
			el.click();
		}
	},
	checkLogin: function(){},
	_login: function(search){
		alipay.login();
	}
	
};

window['C'].Template = {
	/**
	 * 位数处理
	 * @name bitHandle
	 * @memberof C.Template
	 * @param {String} num  原数
	 * @param {String} bit  扩充后的位数
	 * @return {string} num  扩充后的数
	 * @type function
	 * @public
	 */
	bitHandle: function(num, bit){
		var len = num.toString().length;
		if(len < bit){
			var str = '';
			for(var i = 0; i < bit - len; i++){
				str += '0';
			}
			return str + num;
		}
		return num;
	},
	/**
	 * 获取人类识别的时间
	 * @name getCommonTime
	 * @memberOf C.Template
	 * @param time{number} new Date().getTime()的返回结果
	 * @return common{string} ，如2012-12-12 19:23
	 */
	getCommonTime: function(time){
		var _date = new Date(time);
		var year = _date.getFullYear(),
			month = this.bitHandle(_date.getMonth()+1,2),
			day = this.bitHandle(_date.getDate(),2),
			hour = this.bitHandle(_date.getHours(),2),
			mins = this.bitHandle(_date.getMinutes(),2);
		var common = year + '-' + month + '-' + day + ' ' + hour + ':' + mins;
		return common
	},
	/**
	 * 处理location.search，返回object
	 * @memberOf C.Template
	 * @name searchJSON
	 * @return object
	 */
	searchJSON: function(search){
		var str = search.replace('?',''),
			arr = str.split('&'),
			obj = {};
		_.each(arr,function(n){
			var a = n.split('=');
			obj[a[0]] = a[1];
		});
		return obj;
	}	
};

