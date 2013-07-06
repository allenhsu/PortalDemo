
define(function(require,exports){
	
	var Layout = require('./layout'),
		Tool = require('./tool');
	C.NewUser = {
		betfrom: '',
		handleBet: function(obj){
			//更新成功
			if(obj.status){
				alipay.navigation.popWindow();
			}else{
				alert(obj.resultMessage,function(){},'提示');
			}
		}
	};

	//验证手机号码
	exports.checkPhoneNumber = function(val) {	
		if (val == "") {
			return "请输入手机号码";
		}
		return /^[1][0-9][0-9]{9}$/.test(val) || "手机号码格式错误";
	};

	//验证身份证号	
	exports.checkIdCard = function(val) {
		if (val === "") {
			return "请输入身份证号";
		}

		var len = val.length;
		if (!(len === 15 || len === 18)) {
			return "身份证号位数错误";
		}

		var area = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江", 31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",
				36:"江西",37:"山东",41:"河南",42:"湖北", 43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏", 61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
		if (area[val.substr(0,2)] == undefined) {
			return "身份证号格式错误";
		}
		
		if (len === 15)	{
			var year = parseInt(val.slice(6,8)) + 1900,
				isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0,
				reg = isLeap ?
						/^[1-9][0-9]{5}([0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9])))[0-9]{3}$/ : 
						/^[1-9][0-9]{5}([0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8])))[0-9]{3}$/;
			return reg.test(val) || "身份证号格式错误"; 
		}

		if (len === 18)	{
			var year = parseInt(val.slice(6, 10)),
				isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0,
				reg = isLeap ?
						/^[1-9][0-9]{5}((19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9])))[0-9]{3}[0-9Xx]$/ : 
						/^[1-9][0-9]{5}((19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8])))[0-9]{3}[0-9Xx]$/;
			if (!reg.test(val)) {
				return "身份证号格式错误";
			} else {
				var a = val.split(""),
					S = (parseInt(a[0]) + parseInt(a[10])) * 7
									+ (parseInt(a[1]) + parseInt(a[11])) * 9
									+ (parseInt(a[2]) + parseInt(a[12])) * 10
									+ (parseInt(a[3]) + parseInt(a[13])) * 5
									+ (parseInt(a[4]) + parseInt(a[14])) * 8
									+ (parseInt(a[5]) + parseInt(a[15])) * 4
									+ (parseInt(a[6]) + parseInt(a[16])) * 2
									+ parseInt(a[7]) * 1
									+ parseInt(a[8]) * 6
									+ parseInt(a[9]) * 3,
					T = S % 11,
					M = "F",
					JYM = "10X98765432",
					M = JYM.substr(T,1);
				return (M === a[17].toUpperCase()) || "身份证号格式错误";
			}
		}
		return true;
	};	

	//验证表单的统一入口
	exports.verifyForm = function(){
		var userName = this.userName = $('#userName').val(),
			cardId = this.cardId = $('#cardId').val(),
			phoneNumber = this.phoneNumber = $('#phoneNumber').val();
		var cr = this.checkIdCard(cardId),
			pr = this.checkPhoneNumber(phoneNumber),
			reg = /[^\x00-\x80]/g;
		var _a = userName.match(reg), fullch = false;
		if(_a){
			if(_a.length == userName.length){
				fullch = true;
			}	
		}
		if(userName.length < 1){
			return '请输入真实姓名';
		}else if(!fullch){
			return '请填写中文姓名';
		}else if(cr !== true){
			return cr;
		}else if(pr !== true){
			return pr;
		}
		return true;
	};
	
	//提交表单到服务器
	exports.submit = function(){
		var sobj = Tool.searchJSON(location.search);
		
		if(typeof alipay !== 'undefined'){
			var token = alipay.session.token;
			Tool.getScript(C.Config.postUserInfo() + '?token=' + token + '&fullname=' + encodeURIComponent(encodeURIComponent(this.userName)) + '&idCard=' + this.cardId + '&mobile=' + this.phoneNumber + '&callback=C.NewUser.handleBet');
		}
		
	};

	exports.initialize = function(){
		var self = this;
		window.leftbar = function(){
			alipay.navigation.popWindow();
		};
		$('#submitInfo').click(function(e){
			e.preventDefault();
			var vr = self.verifyForm();
			if(vr === true){
				//提交表单到服务器，之后自动跳转到投注页，取决于字段betfrom值
				self.submit();
			}else{
				alert(vr,function(){},'提示');
				return;
			}
		});	
	};

});
