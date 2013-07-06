define(function(require,exports,module){
	var Tool = require('./tool');
	
	return {
        /**
         * 缓存
         */
        countCache: {},
        moneyCache: {},
        /**
         * 过关方式映射
         */
        passTypeMap:
        {
            '1': [1],
            '2*1': [2],
            '2*3': [2, 1],
            '3*1': [3],
            '3*3': [2],
            '3*4': [3, 2],
            '3*7': [3, 2, 1],
            '4*1': [4],
            '4*4': [3],
            '4*5': [4, 3],
            '4*6': [2],
            '4*11': [4, 3, 2],
            '4*15': [4, 3, 2, 1],
            '5*1': [5],
            '5*5': [4],
            '5*6': [5, 4],
            '5*10': [2],
            '5*16': [5, 4, 3],
            '5*20': [3, 2],
            '5*26': [5, 4, 3, 2],
            '5*31': [5, 4, 3, 2, 1],
            '6*1': [6],
            '6*6': [5],
            '6*7': [6, 5],
            '6*15': [2],
            '6*20': [3],
            '6*22': [6, 5, 4],
            '6*42': [6, 5, 4, 3],
            '6*50': [4, 3, 2],
            '6*57': [6, 5, 4, 3, 2],
            '6*63': [6, 5, 4, 3, 2, 1],
            '7*1': [7],
            '7*7': [6],
            '7*8': [7, 6],
            '7*21': [5],
            '7*35': [4],
            '7*120': [7, 6, 5, 4, 3, 2],
            '7*127': [7, 6, 5, 4, 3, 2, 1],
            '8*1': [8],
            '8*8': [7],
            '8*9': [8, 7],
            '8*28': [6],
            '8*56': [5],
            '8*70': [4],
            '8*247': [8, 7, 6, 5, 4, 3, 2],
            '8*255': [8, 7, 6, 5, 4, 3, 2, 1],
            '9*1': [9],
            '10*1': [10],
            '11*1': [11],
            '12*1': [12],
            '13*1': [13],
            '14*1': [14],
            '15*1': [15]
        },

        /**
         * 基本注数注数
         * @param arr {array} 例如[2,1,3]表示选中场次中，选中1个号码的有2场，选中2个号码的有1场，选中3个号码的有3场。
         * @param m {number} m串1
         */
        _calCount: function(arr, m)
        {
            var num = 0;
            if (arr.length === 0 || m === 0)
            {
                return 0;
            }
            // 缓存中间结果
            var key = arr.toString() + '|' + m, cache = this.countCache[key];
            if (typeof cache === 'number')
            {
                return cache;
            }
            // 单关
            if (m === 1)
            {
                for ( var i = arr.length; -- i > -1;)
                {
                    num += arr[i] * (i + 1); // 所有选择个数相加
                }
                return this.countCache[key] = num;
            }
            // 总场次等于总串关数
            var sum = Tool.Sum(arr);
            if (sum === m)
            {
                num = 1;
                for ( var i = arr.length; -- i > -1;)
                {
                    num *= Math.pow(i + 1, arr[i]); // 所有选择个数相乘
                }
                return this.countCache[key] = num;
            }
            for ( var i = arr.length; -- i > -1;)
            {
                if (arr[i] > 0)
                {
                    var _arr = arr.concat();
                    -- _arr[i];
                    num = (i + 1) * arguments.callee.apply(this, [_arr, m - 1]) + arguments.callee.apply(this, [_arr, m]);
                    return this.countCache[key] = num;
                }
            }
            return this.countCache[key] = num;
        },
        /**
         * 计算注数
         * @param tag {boolean} true:去重（按m串1出票）/ false:不去重（按m串n出票）
         * @param dArr {array} 胆码数组，例如[2,1,3]表示设胆的场次中，选中1个号码的有2场，选中2个号码的有1场，选中3个号码的有3场。
         * @param tArr {array} 拖码数组，规则同上
         * @param passType {array/string} 过关方式
         * @param dCount {number} 胆码场次（可以计算，作为参数可以减少计算）
         * @param passType {array/string} 总场次
         */
        calCount: function(tag, dArr, tArr, passType, dCount, count)
        {
            var num = 0, m;
            if (_.isArray(passType))
            {
                for ( var i = passType.length; -- i > -1;)
                {
                    num += arguments.callee.apply(this, [tag, dArr, tArr, passType[i], dCount, count]);
                }
                return num;
            }
            // 缓存中间结果
            var key = dArr.toString() + '|' + tArr.toString() + '|' + passType, cache = this.countCache[key];
            if (typeof cache !== 'undefined')
            {
                return cache;
            }
            // 不去重算法拆单，拆单后均为无胆计算
            m = isNaN(parseInt(passType)) ? 1 : parseInt(passType);
            if ((!tag) && (count > m))
            {
                var _tArr = this.separateArray(tArr, m - dCount);
                for ( var i = _tArr.length; -- i > -1;)
                {
                    num += arguments.callee.apply(this, [true, [], this.addArray(_tArr[i], dArr), passType, 0, m]);
                }
                return this.countCache[key] = num;
            }
            // 根据passTypeMap拆成m串1计算
            var ptArr = this.passTypeMap[passType], dNum = 0;
            for ( var i = ptArr.length; -- i > -1;)
            {
                // 如果过关数小于或等于胆数，则在胆码内部计算
                if (dCount >= ptArr[i])
                {
                    num += this._calCount(dArr, ptArr[i]);
                }
                else if (dCount < ptArr[i] && dCount > 0)
                {
                    dNum = this._calCount(dArr, dCount);
                    num += dNum * this._calCount(tArr, ptArr[i] - dCount);
                }
                else
                {
                    num += this._calCount(tArr, ptArr[i]);
                }
            }
            return this.countCache[key] = num;
        },
        /**
         * 拆单算法
         * @param arr {array} 拆单数组 [2,1,1]
         * @param num {number} 拆单后场次数 2
         * @return b {array} [2,0,0]、[1,1,0]、[1,0,1]、[0,1,1]
         */
        separateArray: function(arr, num)
        {
            var a = Tool.C(this.transArrayToMatch(arr), num), // a = [[3,2],[3,1],[3,1],[2,1],[2,1],[1,1]]
            b = [];
            for ( var i = a.length; -- i > -1;)
            {
                b.push(this.transArrayToNum(a[i])); // b = [2,0,0]、[1,1,0]、[1,1,0]、[1,0,1]、[1,0,1]、[0,1,1]
            }
            return b;
        },
        /**
         * 将数组转化为对阵数目显示
         * @param arr {array} [2,1,1]
         * @return a {array} [3,2,1,1]
         */
        transArrayToMatch: function(arr)
        {
            var a = [];
            for ( var i = arr.length; -- i > -1;)
            {
                for ( var j = arr[i]; -- j > -1;)
                {
                    a.push(i + 1);
                }
            }
            return a;
        },
        /**
         * 将数组转化为统计数目显示
         * @param arr {array} [3,2,1,1]
         * @return a {array} [2,1,1]
         */
        transArrayToNum: function(arr)
        {
            var a = [0, 0, 0].concat(); // 考虑用配置项！！
            for ( var i = arr.length; -- i > -1;)
            {
                a[arr[i] - 1] ++;
            }
            return a;
        },
        /**
         * 数组按位相加
         * @param a1 {array} [2,1,1]
         * @param a2 {array} [0,2]
         * @return a {array} [2,3,1]
         */
        addArray: function(a1, a2)
        {
            var len = Math.max(a1.length, a2.length), a = [];
            for ( var i = len; -- i > -1;)
            {
                a[i] = this.numFormat(a1[i]) + this.numFormat(a2[i]);
            }
            return a;
        },
        numFormat: function(num)
        {
            return isNaN(num) ? 0 : num;
        },        
        /**
         * 计算极值（最大/最小中奖金额）
         * @param tag {boolean} true:去重（按m串1出票）/ false:不去重（按m串n出票）
         * @param spArray {array} [SP值]（每场1个最大/最小SP值）
         * @param passType {array/string} ['2串1']
         * @param dCount {number} 胆码场次
         * @param extre {string} 'min' / 'max'
         * @param percent {number} 返奖率
         * @param alldCount {number} 全包的胆码场次
         * @param allCount {number} 全包场次
         * @return num {string} 2位小数的数字
         * 
         */
        calExtreme: function(tag, spArray, passType, dCount, extreme, percent, alldCount, allCount, hitNum)
        {
            var num = 0, m, M, len, ptArr, dArr, tArr, arr, i;
            if (_.isArray(passType))
            {
            	var hitNum;
            	//计算命中数
            	if (extreme === 'max') {
            		hitNum = spArray.length;
            	} else {
            		var _ptArr = this.passTypeMap[passType.sort()[0]];
            		hitNum = _ptArr[_ptArr.length - 1];
            	}
                for (i = passType.length; -- i > -1;)
                {
                    num += Number(this.calExtreme(tag, spArray, passType[i], dCount, extreme, percent, alldCount, allCount, hitNum));
                }
                return num.toFixed(2);
            }
            // 缓存中间结果
            var key = spArray.toString() + '|' + passType + '|' + dCount + '|' + alldCount + '|' + allCount + '|' + hitNum, cache = this.moneyCache[key];
            if (typeof cache !== 'undefined')
            {
                return cache;
            }
            ptArr = this.passTypeMap[passType];
            M = parseInt(passType);
            len = spArray.length;
            // 最大值, 所有比赛全部正确，全包无影响
            if (extreme === 'max')
            {
                // 不去重按m串n先拆单
                if ((!tag) && (len > M))
                {
                    dArr = spArray.slice(0, dCount);
                    tArr = spArray.slice(dCount);
                    arr = Tool.dtC(tArr, dArr, M);
                    for ( var i = arr.length; -- i > -1;)
                    {
                      	num += Number(this._calculateBonus(arr[i], passType, M));
                    }
                    return this.moneyCache[key] = Tool.mul(num, percent * 2).toFixed(2);
                }
                // 按m串1计算
                return this.moneyCache[key] = Tool.mul(this._calculateBonus(spArray, passType, len), percent * 2).toFixed(2);
            }
            // 最小值，在过关方式允许下，中最少的比赛的奖金
            m = Math.max(hitNum, allCount);  //最小命中数
            
            // 不去重按命中胆数计算，需要比较得出最小值
            if (!tag)
            {
            	 //无胆
                if (dCount == 0) 
                {
                   return this.moneyCache[key] = Tool.mul(this._calculateBonus(spArray, passType, m), percent * 2).toFixed(2);
				}
				
				//有胆
            	//拆为m串n,分三段拆单,dCount,dCount + m - dHitCount
                var minDHit = Math.max(m - M + dCount, alldCount),
                	maxDHit = Math.min(m, dCount), 
                	numArr = [], a1 = spArray.slice(0, dCount), a2, a3;
                if (minDHit > maxDHit)
                {
                	return;
                }
                 // 命中的胆数从0到maxDHit
                for ( var i = minDHit; i <= maxDHit; i ++)
                {
                    var n = 0, hitTNum = m - i;                  
                    a2 = spArray.slice(dCount, dCount + hitTNum);
					a3 = Tool.C(spArray.slice(dCount + hitTNum), M - hitTNum - dCount);
					arr = Tool.combineArray([a2], a3);
					arr = Tool.combineArray([a1], arr);
					for ( var j = arr.length; -- j > -1;)
           			{
						//将[hitDanNum,danCount]段数组置于数组的末尾，计算时当这些胆码为未中奖
						var _arr = arr[j];
						if(i < dCount){
							dArr = _arr.splice(i, (dCount - i));
							_arr = _arr.concat(dArr);
						}
						n += Number(this._calculateBonus(_arr, passType, m));
					}	 
                    numArr.push(n);
                }
                // 排序取最小值
                numArr = numArr.sort(function(a, b)
                {
                    return a - b;
                });
           		return this.moneyCache[key] = Tool.mul(numArr[0], percent * 2).toFixed(2);
            }
            // 去重算法按最小过关计算即可
            arr = spArray.slice(0, m);
            return this.moneyCache[key] = Tool.mul(Tool.Product(arr), percent * 2).toFixed(2);
        },
    	_calculateBonus: function(spArray, passType, hitNum){
    		 // 缓存中间结果
            var key = spArray.toString() + '|' + passType + '|' + hitNum, cache = this.moneyCache[key];
            if (typeof cache !== 'undefined')
            {
                return cache;
            }
           
           	var num = 0,
           		len = spArray.length,
				ptArr = this.passTypeMap[passType],
				M = passType.charAt(0) == '单' ? 1 : Number(passType.charAt(0)),
				N = passType.slice(2) == '' ? 1 : Number(passType.slice(2)),
				m = ptArr[ptArr.length - 1];   //最小过关
			if (hitNum < m) 
			{   //命中数小于最小过关
				return 0;
			}
			
			//如果所选比赛场次和m串n的m值相同，直接计算
			if (len == M)
			{
				//m串1,直接将sp值相乘
				if (N == 1)
				{
					return this.moneyCache[key] = Tool.Product(spArray).toFixed(2);
				}else{
					//m串n先拆成m串1，递归计算
					for ( var i = ptArr.length; -- i > -1;)
                    {
                    	var pt = ptArr[i];
                    	if (pt <= hitNum)
                    	{
                    		pt = (pt == 1) ? '单关' : pt + '串1';
                        	num += Number(arguments.callee.apply(this, [spArray, pt, hitNum]));
                        }	
                    }
					return this.moneyCache[key] = num.toFixed(2);
				}
			}
			//如果所选比赛场次>m串n的m值，先拆单（拆成m串n）再计算
			else
			{
				//拆单算法：按命中数拆单
				var arr = [],         //拆单后的数组
					min = Math.max(m, M - (len - hitNum)),	
					max = Math.min(M, hitNum);
				for ( var i = min; i <= max; i ++)
                {
                	var a1 = Tool.C(spArray.slice(0, hitNum), i),
						a2 = Tool.C(spArray.slice(hitNum), M - i);
					arr = Tool.combineArray(a1, a2);
					for ( var j = arr.length; -- j > -1;) 
					{
						num += Number(arguments.callee.apply(this, [arr[j], passType, i]));
					}
                }
			}		
			return this.moneyCache[key] = num.toFixed(2);
		},
		/* 
		 * spArray: {
		 * 		min: '',
		 * 		max: '',
		 * 		isDt: '',
		 * 		isFull: ''
		 * }
		 * tag  true/false  正向/反向
		 */
  		sortSPArray: function(spArray, tag) 
  		{
  			var arr = spArray.concat(), _arr = [];
  			if (tag)
	  		{
	  			arr.sort(function(a, b) 
	  			{
	  				if (a.isDt == b.isDt) 
	  				{
	  					if (a.isFull == b.isFull) 
	  					{
	  						return a.min - b.min;
	  					}
	  					if (a.isFull) return -1;
	  					if (b.isFull) return 1;
	  				}
	  				if (a.isDt) return -1;
	  				if (b.isDt) return 1;
				});
				_.each(arr, function(o, i) 
				{
					_arr[i] = Number(o.min);
				});
			} else 
			{
				arr.sort(function(a, b) 
	  			{
	  				if (a.isDt == b.isDt) 
	  				{
	  					if (a.isFull == b.isFull) 
	  					{
	  						return b.max - a.max;
	  					}
	  					if (a.isFull) return -1;
	  					if (b.isFull) return 1;
	  				}
	  				if (a.isDt) return -1;
	  				if (b.isDt) return 1;
				});
				_.each(arr, function(o, i) 
				{
					_arr[i] = Number(o.max);
				});
			}
			
			return _arr; 
  		}
    };
});
