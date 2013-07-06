
define(function(require,exports){
	var Layout = require('./layout');
	var Tool = require('./tool');
	var confirm = require('../widget/confirm/confirm');
	
	exports.redirect = function(){
		var tar = '?';
		var obj = Tool.searchJSON(location.search);
		if(!obj.numberStrings) return;
		for(var i in obj){
			if(i == 'sid'){
				tar += 'sid=' + obj.sid
			}
		}
		C.Config.changeUrl(location.href.replace(location.search,tar));
	};
	
	exports.initialize = function(){
		var self = this, errcode = localStorage.getItem('exceptionCode');
		//alert(errcode,function(){},'提示');
		window.leftbar = function(){
			alipay.navigation.popWindow();
		};
		$('#errShow').html(C.Config.exception[errcode]);
	};

	
});
