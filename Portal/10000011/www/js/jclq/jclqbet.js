
/**
 * 声明seajs模块
 */
define(function(require, exports, module){
	var App = require('../base/sportbet');
	
	return {
		initialize: function(){
			C.JCLQ = new App.app({
				id: 'C.JCLQ',
				lotteryType: 20,
				lotteryTypeName: 'JCLQ',
				betPlayType: 2,
				fullNum: 2,
				betSort: true    //
			});
		}
	}
});
