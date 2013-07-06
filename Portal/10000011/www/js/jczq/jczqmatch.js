
/**
 * 声明seajs模块
 */
define(function(require, exports, module){
	var App = require('../base/match');
	
	return {
		initialize: function(){
			C.JCZQ = new App.app({
				id: 'C.JCZQ',
				lotteryType: 21,
				lotteryTypeName: 'JCZQ',
				betpage: 'jczqbet.html',
				filterpage: 'jczqfilter.html'
			});
		}
	}
});