/**
 * @fileoverview  彩票基础工具算法
 * @author 栋寒（zhenn）	
 * @version 1.0
 * @content 修改排列组合公式，需要计算排列组合内容参数为数组，只计算排列组合数的话参数为数字
 * @dependencise: underscorejs & zepto
 * @for: mobile webapp
 */

/**
 * 声明彩票基础工具算法模块
 */
define(function(require,exports,module){
	if(typeof navigator.notification !== 'undefined'){
		alert = navigator.notification.alert;
	}
	
	return {
		/**
		 * 组合算法
		 * @name C
		 * @memberof C.Tools
		 * @param {array} arr 基础数组		 
		 * @param {number} num 要取出的数的个数
		 * @return {array} r 符合要求的组合数组
		 * @type function
		 * @public
		 */
		C : function(arr, num){
			var r=[];
			(function f(t,a,n){
				if (n==0) return r.push(t);
				for (var i=0,l=a.length; i<=l-n; i++){
					f(t.concat(a[i]), a.slice(i+1), n-1);
				}
			})([],arr,num);
			return r;
		},
		/**
		 * 排列算法
		 * @name P
		 * @memberof C.Tools
		 * @param {array} arr 基础数组		 
		 * @param {number} num 要取出的数的个数
		 * @return {array} r 符合要求的排列数组
		 * @type function
		 * @public
		 */
		P : function(arr, num){
			var r= [];
			(function f(t,a,n){
				if (n==0) return r.push(t);
				for (var i=0,l=a.length; i<l; i++){
					f(t.concat(a[i]), a.slice(0,i).concat(a.slice(i+1)), n-1);
				}
			})([],arr,num);
			return r;
		},
		/**
		 * 阶乘算法
		 * @name F
		 * @memberof C.Tools	 
		 * @param {number} num 计算阶乘的数
		 * @return {number} r 计算结果
		 * @type function
		 * @public
		 */
		F : function(num){
			var r=1;
			(function f(n){
				if (n<0) return r;
				for (var i=n; i>0; i--){
					r*=i;
				}
			})(num);
			return r;
		},
		/**
		 * 求和算法
		 * @name Sum
		 * @memberof C.Tools	 
		 * @param {array} array 求和数组
		 * @return {number} s 计算结果
		 * @type function
		 * @public
		 */
		Sum : function(array){
			var s=0;
			(function f(a){
				for (var i=0,l=a.length; i<l; i++){
					s+=Number(a[i]);
				}
			})(array);
			return s;
		},
		/**
		 * 求积算法
		 * @name Product
		 * @memberof C.Tools	 
		 * @param {array} array 求积数组
		 * @return {number} s 计算结果
		 * @type function
		 * @public
		 */
		Product : function(array){
			var that = this,
				s = 1;
			(function f(a){
				for (var i=0,l=a.length; i<l; i++){
					s=that.mul(s, Number(a[i]));
				}
			})(array);
			return s;
		},
		/**
		 * 组合数算法
		 * @name numC
		 * @memberof C.Tools
		 * @param {number} len 基础数组长度		 
		 * @param {number} num 要取出的数的个数
		 * @return {array} r  组合数
		 * @type function
		 * @public
		 */
		numC : function(len, num){
			var that = this;
			var r=1;
			(function f(a,n){
				r = that.numP(a,n)/that.F(n);
			})(len,num);
			return r;
		},
		/**
		 * 排列数算法
		 * @name numP
		 * @memberof C.Tools
		 * @param {number} len 基础数组长度		 
		 * @param {number} num 要取出的数的个数
		 * @return {array} r  排列数
		 * @type function
		 * @public
		 */
		numP : function(len, num){
			var that = this;
			var r=1;
			(function f(a,n){
				if (a<0 || n<0) return r;
				for (var i=a; i>a-n; i--){
					r*=i;
				}
			})(len,num);
			return r;
		},
		/**
		 * 胆拖的组合算法
		 * @name dtC
		 * @memberof C.Tools
		 * @param {array} arrT 拖码数组	
		 * @param {array} arrT 胆码数组		 
		 * @param {number} num 要取出的数的个数
		 * @return {array} arr  胆拖组合数组
		 * @type function
		 * @public
		 */
		dtC : function(arrT,arrD,num){
			var r = this.C(arrT, num - arrD.length);
			var arr = [];
			for(var i = 0;i<r.length;i++){
				var temp = arrD.concat(r[i]);
				arr.push(temp);	
			}	
			return arr;
		},
		/**
		 * 胆拖的组合算法（参数为数组长度）
		 * @name numDtC
		 * @memberof C.Tools
		 * @param {number} numT 拖码数组长度	
		 * @param {number} numD 胆码数组长度	 
		 * @param {number} num 要取出的数的个数
		 * @return {array} arr  胆拖组合数组
		 * @type function
		 * @public
		 */
		numDtC: function(numT, numD, num){
			var that = this;
			if(num < numD){
				return 0;
			}
			return this.numC(numT, num - numD);
		},
		/**
		 * 取出当前url当中的参数
		 * @name parseURL
		 * @memberof C.Tools
		 * @param {string} name  参数key	
		 * @return {string} 参数value
		 * @type function
		 * @public
		 */
		parseURL : function(name){  
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");  
			var r = window.location.search.substr(1).match(reg);  
			if(r!=null){
				return unescape(r[2]);
			} 
			return null;  
		},
		/**
		 * 位数处理
		 * @name bitHandle
		 * @memberof Tool
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
		 * 判断数组是否重复
		 * @name isRepeat
		 * @memberof C.Tools	 
		 * @param {array} arr 数组
		 * @return {boolean} 是否重复
		 * @type function
		 * @public
		 */
		isRepeat: function(arr){
			 var hash = {};
			 for(var i in arr) {
				if(hash[arr[i]]){
					  return true;
				}
				hash[arr[i]] = true;
			 }
			 return false;
		},
		/**
		 * 随机号码球生成
		 * @name baseBallRandom
		 * @memberof C.Tools	 
		 * @param {number} num  生成号码个数
		 * @param {number} max  号码总数
		 * @param {boolean} isRepeat  是否可重复
		 * @param {boolean} bitTag  是否需要补0
		 * @param {string} rounding  取整方向   floor/ceil
		 * @return {array} a  生成的号码球数组
		 * @type function
		 * @public
		 */
		baseBallRandom: function(num, max, isRepeat, bitTag, rounding , base){
			var a = [];
			for(var i = 0; i < num; i++){
				if(rounding == 'floor'){
					var r = Math.floor(Math.random() * max);
				}else{
					var r = Math.ceil(Math.random() * max);
				}
				if(typeof base === 'number'){
					if(r < base){
						i--;
						continue;
					}
				}
				
				//补0
				if(bitTag){
					r = (r < 10) ? '0' + r : r;
				}
				//去重
				if(!isRepeat && _.indexOf(a, r) >= 0){
					i--;
					continue;
				}
				a.push(r);
			}
			return a;
		},
		/**
		 * 浮点数乘法运算（消除bug）
		 * @name mul
		 * @memberOf tool
		 */
		mul: function(num1,num2){
			var reg = /\./i;
			if(!reg.test(num1) && !reg.test(num2)){
				return num1 * num2;
			}
			var len = 0, str1 = num1.toString(), str2 = num2.toString();
			if(str1.indexOf('.')>=0){
				len += str1.split('.')[1].length;
			}
			if(str2.indexOf('.')>=0){
				len += str2.split('.')[1].length;
			}
			return Number(str1.replace('.','')) * Number(str2.replace('.','')) / Math.pow(10,len);

	　　	} ,
		/**
         * 两个一维数组求组合
         * @name combine
         * @memberof C.Tools
         * @param {array} a 原始数组 如 [1,2]
         * @param {array} b 原始数组 如 [3,4]
         * @param {char} sep 分隔符 默认无
         * @return {array} result 组合结果 ["1,3","1,4","2,3","2,4"]
         * @type function
         * @public
         */
        combine: function(a, b, sep)
        {
            var result = [], i = 0, aSize = a.length, bSize = b.length, j;
            if (typeof sep == 'undefined')
            {
                sep = "";
            }
            for (; i < aSize; ++ i)
            {
                for (j = 0; j < bSize; ++ j)
                {
                    result[result.length] = a[i] + sep + b[j];
                }
            }
            return result;
        },
		/**
         * 两个二维数组求组合
         * @name combine
         * @memberof C.Tools
         * @param {array} a 原始数组 如 [[1,2]]
         * @param {array} b 原始数组 如 [[3,4],[4,5]]
         * @param {char} sep 分隔符 默认无
         * @return {array} result 组合结果 [[1,2,3,4],[1,2,4,5]]
         * @type function
         * @public
         */
        combineArray: function(a, b)
        {
            var result = [], aSize = a.length, bSize = b.length, i = 0;
            for (; i < aSize; ++ i)
            {
                for (j = 0; j < bSize; ++ j)
                {
                    result[result.length] = a[i].concat(b[j]);
                }
            }
            return result;
        },
		/**
         * 基于数组的组合算法
         * @name getCompoundPermutation
         * @memberof Tool
         * @param {array} nakedata 原始数组，如 [[2,3], [3]]
         * @param {char} sep 分隔符，默认无
         * @return {array} result 组合结果，如 ["23", "33"]
         * @type function
         * @public
         */
        getCompoundPermutation: function(nakedata, sep)
        {
            var result = nakedata[0].concat(), size = nakedata.length, i = 1, nake;
            for (; i < size; ++ i)
            {
                nake = nakedata[i];
                if (nake.length)
                {
                    result = this.combine(result, nake, sep);
                }
            }
            return result;
        },
        /**
         * 根据和值求排列
         * @name getSummationPermutation
         * @memberof Tool
         * @param {array} sums 和值数组 [0,2]
         * @param {number} count 结果中的数字个数，如 2
         * @param {number} max_num 结果中的最大数字，默认 9
         * @return {array} result 排列结果 [[0, 0], [0, 2], [1, 1], [2, 0]]
         * @type function
         * @public
         */
        getSummationPermutation: function(sums, count, max_num)
        {
            var result = [], size = sums.length, sum, subSum, subResult, i, j;
            if (max_num == undefined)
            {
                max_num = 9;  //
            }
            if (size == 1)  //ֵ
            {
                sum = sums[0];  //ֵ
                if (count == 2)  //
                {
                    max_num = Math.min(sum, max_num);
                    for (i = 0; i <= max_num; ++ i)
                    {
                        j = sum - i;
                        if (j <= max_num)
                        {
                            result[result.length] = [i, j];
                        }
                    }
                }
                else if (count > 2)  
                {
                    -- count;
                    for (i = 0; i <= max_num; ++ i)
                    {
                        subSum = sum - i;
                        subResult = this.getSummationPermutation([subSum], count, max_num);  
                        for (j = 0, size = subResult.length; j < size; ++ j)
                        {
                            subResult[j].splice(0, 0, i);
                        }
                        result = result.concat(subResult);
                    }
                }
            }
            else if (size > 1) 
            {
                for (i = 0; i < size; ++ i)
                {
                    result = result.concat(this.getSummationPermutation([sums[i]], count, max_num));
                }
            }
            return result;
        },
		/**
		 * 是否有对应key值的本地数据
		 * @memberOf tool
		 * @name hasLocalData
		 * @param key{string} localStorage的key值
		 * @return boolean
		 */
		hasLocalData: function(key){
			//null -> localStorage.removeItem时
			//'{}' -> collection.models.destroy时
			if(localStorage.getItem(key) == null || localStorage.getItem(key) == '{}'){
				return false;
			}
			return true;
		},
		/**
		 * 探测本地数据
		 * @memberOf tool
		 * @name detectLocalData
		 * @param key{string} localStorage的key值
		 * @param c{collection} 集合
		 * @param hashArr{array}  hash值组合 ，如：['#!fc3d/zhx/bet/2','#!fc3d/z3/bet/2','#!fc3d/z6/bet/2']
		 * @param tipDetect{boolean} 是否提示探测本地数据，true 先弹出对话框，确定后进行探测 false 直接探测
		 * @return void
		 */
		detectLocalData: function(key,c,hashArr,tipDetect){
			var search = this.searchJSON(location.search);
			//如果是初始化页面，需要检测localStorage中是否存在对应的key值
			//如果存在，则弹出确认层，让用户选择是否恢复数据
			if(!C[hashArr]){
				if(search.callback){
					c.fetch();
				}else if(this.hasLocalData(key)){
					//先提示，确认后探测
					if(tipDetect){
						var conf = confirm('恢复之前操作的数据?');
						if(conf){
							c.fetch();  //同步本地数据
						}else{
							localStorage.removeItem(key);  //删除本地数据
							for(var i=c.models.length;i--;){
								if(c.models[i].get('tempBox') || c.models[i].get('verify')) continue;
								c.models[i].destory();
							}
							location.reload();
						}
					}else{
						//直接探测
						c.fetch();
					}
					
					
				}
				C[hashArr] = true;
			}else{
				//否则是子应用页面直接切换（具体体现是页面hash change），直接读取localStorage，并渲染页面dom结构
				c.fetch();
			}
		},
		/**
		 * 抓取数据（可执行的javascript代码片段）
		 * @param url{string} 数据接口url
		 * @memberOf C.Tool
		 */
		getScript: function(url,cfg){
			if(!(C.Config.platform == 'android' && device.version == '2.2')){
				try {
					var netState = navigator.network.connection.type;
					//offline
					if(netState == 'none' || netState == 'unknown'){
						cfg = {
							offhandler: (typeof cfg == 'undefined' || typeof cfg.offhandler == 'undefined') ? function(){} : cfg.offhandler
						};
						alert('无法连接网络，请检查设置',cfg.offhandler,'提示','确定');
						return;
					}
				} catch (e) {
				
				}
			}
			var script = document.createElement('script');
			script.src = url;
			script.type="text/javascript";
			document.getElementsByTagName('head')[0].appendChild(script);
			_.delay(function(){
				$(script).remove();
			},15000);
		},
		/**
		 * 处理location.search，返回object
		 * @memberOf C.Tool
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
		},
		/**
		 * 创建配置项
		 * @memberOf C.Tool
		 * @name buildCfg
		 */
		buildCfg: function(cfg){
			for(var i in cfg){
				this[i] = cfg[i];
			}
		},
		sub: function(string, n) {
			var r = /[^\x00-\xff]/g;    
			if (string.replace(r, "mm").length <= n) {
				return string;  
			}     
			var m = Math.floor(n/2);    
			for (var i = m; i < string.length; i++) {
				if (string.substr(0, i).replace(r, "mm").length == n) {    
					return string.substr(0, i);
				} else if (string.substr(0, i).replace(r, "mm").length > n)  {
					return string.substr(0, i-1);
				}
			}
			return string;   
		},
		toggleClass: function(node, className) {
			if (node.hasClass(className)) {
				node.removeClass(className);
				return;
			}
			node.addClass(className);
		},
		/**
         * 添加样式，only for webkit
         * @memberOf Layout
         */
		addStyleSheet: function(cssText) {
            var elem;

            elem = $('<style>')[0];
            $('head')[0].appendChild(elem);

			elem.appendChild(document.createTextNode(cssText));
        },
		/**
		 * 保存cookie
		 * @param name{String} cookie名
		 * @param value{String} cookie值
		 * @param hour{Number} cookie有效时间，单位是小时
		 * @return void
		 */
		setCookie: function(name,value,hour){
			var exp = new Date();
			exp.setTime(exp.getTime() + hour*60*60*1000);
			document.cookie = name + "="+ escape(value) + ";expires=" + exp.toGMTString();
		},
		/**
		 * 读取cookie
		 * @param name(String) cookie key
		 * @return cookie value
		 * @memberOf Tool
		 */
		getCookie: function(name){
			var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
			if(arr != null){ 
				return unescape(arr[2]); 
			}
			return null;
		}
				
		
	};

});

