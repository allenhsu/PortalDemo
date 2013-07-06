
define(function(require, exports) {
    var iscroll = require('../lib/iscroll-lite'); //引入iscroll4库

    return {
    	doc: $('#doc'),
    	wrapper: $('#wrapper'),
        initialize: function() {
            return this;
        },
        setBetRegion: function(){
        	var winH = window.innerHeight,
        		botH = $('.actarea').height();
			$('#pullSelect').height(winH - botH + 'px');
			return this;
        },
        /**
         * 批量创建滚动对象
         * @memberOf Layout
         */
        buildScroll: function() {
            _.each(arguments, function(n) {
                C[n+'scroll'] && C[n+'scroll'].destroy();
                C[n + 'scroll'] = new iscroll.iScroll(n, {
                	hideScrollbar: true
                });
            });
            return this;
        },
        /**
         * 单独创建滚动对象，可传配置项
         * @name singleScroll
         * @memberOf Layout
         */
        singleScroll: function(id,cfg){
        	C[id+'scroll'] && C[id+'scroll'].destroy();
        	C[id+'scroll'] = new iscroll.iScroll(id,cfg);
        	return C[id+'scroll'];
        },
        /**
         * 构建AbacusScroll
         * @name buildAbacusScroll
         * @memberOf Layout
         * @return Layout
         */
        doAbacusScroll: function(){
			this.singleScroll('Abacus',{
				hideScrollbar: true
			});
			return this;
        },
        /**
         * 构建typeListScroll
         * @param initx{number} 初始化滚动位置
         * @name doTypeListScroll
         * @memberOf Layout
         * @return Layout
         */
        doTypeListScroll: function(initx){
        	$('#typeList ul').width(70 * $('#typeList ul li').length);
			this.singleScroll('typeList',{
				//隐藏水平方向滚动条
				hScrollbar: false,
				onScrollEnd: function(){
					if(this.x == this.maxScrollX){
						$('.more').eq(0).addClass('hidden');
					}else{
						$('.more').eq(0).removeClass('hidden');
					}
				},
				hideScrollbar: true,
				x: initx
				
			});
			return this;
        },
       	/**
       	 * 获取动画的运动方向
       	 * @memberOf Layout
       	 * @return dir{string}  note:'back' or 'forward'
       	 */
       	getAnimDir: function(curStep){
       		var dir = '';
 			if(curStep >= C.Config.step){
 				dir = 'forward';
 			}else{
 				dir = 'back';
 			}
 			return dir;
       	},
		
        /**
         * 构建遮罩层
         * @memberOf Laout
         */
        /*buildMaskLayer: function() {
            var layer = document.createElement('div');
            layer.className = 'mask';
            //layer.style.height = window.innerHeight + 'px';
            this.layer = $(layer);
            $('body').append(layer);
        },*/
        /**
         * 构建遮罩层
         * @memberOf Laout
         */
        /*removeMaskLayer: function() {
			if(!this.layer) return;
            this.layer.remove();
        },*/
		/**
         * 构建遮罩层
         * @memberOf Laout
         */
        buildMaskLayer: function() {
			if ($('#mask').length) {
				return;
			}
            var winH = window.innerHeight,
				layer = document.createElement('div');
            layer.className = 'mask';
            layer.id = 'mask';
            layer.style.height = winH + 'px';
            this.layer = $(layer);
            $('body').css({'height': winH + 'px', 'overflow-y': 'hidden'}).append(layer);
        },
        /**
         * 构建遮罩层
         * @memberOf Laout
         */
        removeMaskLayer: function() {
			if (!this.layer) {
				return;
			}
			$('body').css({'height': 'auto', 'overflow-y': 'visiable'});
            this.layer.remove();
        },
		/**
		 * 过渡界面
		 * @memberOf Laout 
		 */
		transBox: function(str){
			this.buildMaskLayer();
			$('body').append('<div id="wait"><p>' + str + '</p></div>');
		},
		/**
		 * 移除过渡界面
		 * @memberOf Laout
		 */
		removeTransBox: function(){
			this.removeMaskLayer();
			$('#wait').remove();
		}

    };
});
