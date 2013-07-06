
/**
 * 声明seajs模块
 */
define(function(require, exports, module){
	var App = require('../base/filter');
	
	return {
		initialize: function(){
			C.JCZQ = new App.app();
		}
	}
});