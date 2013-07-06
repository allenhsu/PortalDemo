
/**
 * 澹版槑seajs妯″潡
 */
define(function(require, exports, module){
	var App = require('../base/match');
	
	return {
		initialize: function(){
			C.Config = $.extend(C.Config, {
				matchDataUrl_pro: 'http://caipiao.m.taobao.com/lottery/html5/getMatchsInfoDcAjax.do', //生产环境
				matchDataUrl_pre: 'http://caipiao.wapa.taobao.com/lottery/html5/getMatchsInfoDcAjax.do', //生产环境
				matchDataUrl_dev: 'http://caipiao.waptest.taobao.com/lottery/html5/getMatchsInfoDcAjax.do'//开发环境
			});
	
			C.ZQDC = new App.app({
				id: 'C.ZQDC',
				lotteryType: 16,
				lotteryTypeName: 'DC_SPF',
				betpage: 'zqdcbet.html',
				filterpage: 'zqdcfilter.html',
				minMatch: 1
			});
		}
	}
});