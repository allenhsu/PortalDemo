
/**
 * 澹版槑seajs妯″潡
 */
define(function(require, exports, module){
	var App = require('../base/sportbet');
	
	return {
		initialize: function(){
			C.ZQDC = new App.app({
				id: 'C.ZQDC',
				lotteryType: 16,
				lotteryTypeName: 'ZQDC',
				minMatch: 1,
				hasRepeat: false,  //是否去重
				percent: 0.65  //奖金分成
			});
		}
	}
});