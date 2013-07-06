
/**
 * 声明seajs模块
 */
define(function(require, exports, module){
	var App = require('../base/match');
	
	return {
		initialize: function(){
			C.JCLQ = new App.app({
				id: 'C.JCLQ',
				lotteryType: 20,
				lotteryTypeName: 'JCLQ',
				betpage: 'jclqbet.html'
			});
		}
	}
});