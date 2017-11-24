/**
 * Created by jimmy on 2016/10/29.
 * 基础类
 */

define(['$','wx','fastclick'],function(){
    FastClick.attach(document.body);
    var Super=function(){
        this._prototypeExtent();
    };

    Super.prototype= {

        extentConfig: function (config, myConfig) {
            //浅copy
            var newobj = config.constructor === Array ? [] : {};
            for (var i in config) {
                newobj[i] = config[i];
            }

            var val;
            for (var key in myConfig) {
                val = myConfig[key];
                if (val != null) {
                    newobj[key] = val;
                }
            }
            return newobj;
        },


        /*
         *拓展方法。
         *Date 得到格式化的日期形式 基本是什么格式都支持
         *date.format('yyyy-MM-dd')，date.format('yyyy/MM/dd'),date.format('yyyy.MM.dd')
         *date.format('dd.MM.yy'), date.format('yyyy.dd.MM'), date.format('yyyy-MM-dd HH:mm')   等等都可以
         *使用方法 如下：
         *                       var date = new Date();
         *                       var todayFormat = date.format('yyyy-MM-dd'); //结果为2015-2-3
         *Parameters:
         *format - {string} 目标格式 类似('yyyy-MM-dd')
         *Returns - {string} 格式化后的日期 2015-2-3
         *
         */
        _prototypeExtent: function () {
            Date.prototype.format = function (format) {
                var o = {
                    "M+": this.getMonth() + 1, //month
                    "d+": this.getDate(), //day
                    "h+": this.getHours(), //hour
                    "m+": this.getMinutes(), //minute
                    "s+": this.getSeconds(), //second
                    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
                    "S": this.getMilliseconds() //millisecond
                }
                if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
                    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o) if (new RegExp("(" + k + ")").test(format))
                    format = format.replace(RegExp.$1,
                        RegExp.$1.length == 1 ? o[k] :
                            ("00" + o[k]).substr(("" + o[k]).length));
                return format;
            };

            //拓展string的方法，去除两端空格
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/g, '');
            };

            //长度截取
            String.prototype.substrLongStr = function (len) {
                if (!len) {
                    len = 20;
                }
                var str = this;
                if (this.length > len) {
                    str = str.substr(0, parseInt(len - 1));
                }
                return str;
            };



        },

        /*
         *从时间戳 得到 时间
         * para
         * dateInfo - {num} 时间戳
         * dateFormat - {string} 时间格式 默认为'yyyy.MM.dd'
         */
        getTimeFromTimestamp: function (timestamp, dateFormat) {
            if (!dateFormat) {
                dateFormat = 'yyyy.MM.dd';
            }
            return new Date(timestamp * 1000).format(dateFormat);
        },

        /*是否在可用时间区间*/
        isAtTimeDuration:function(sTime,eTime){
            var today=new Date().format('yyyy/MM/dd'), //ios 必须要／形式的
                timestamp=new Date(today).getTime()/1000;
            var flag1=true,
                flag2=true;
            if(sTime){
                flag1=timestamp >=sTime;
            }
            if(eTime){
                flag2=timestamp<=eTime;
            }
            return flag1 && flag2;
        },

        /*
         *得到随机的整数
         *para
         * max - {num} 最大值
         * min - {num} 最小值 默认为0
         */
        getRandomNum:function (max, min) {
            if (!min) {
                min = 0;
            }
            var rand = max - min,
                num = (Math.random() * rand) + min;
            return Math.round(num);
        },


        //禁止冒泡
        stopBubble: function (e) {
            // 如果提供了事件对象，则这是一个非IE浏览器
            if (e && e.stopPropagation) {
                // 因此它支持W3C的stopPropagation()方法
                e.stopPropagation();
            } else {
                // 否则，我们需要使用IE的方式来取消事件冒泡
                window.event.cancelBubble = true;
            }
        },

        //阻止事件默认行为
        stopDefault: function (e) {
            // 阻止默认浏览器动作(W3C)
            if (e && e.preventDefault) {
                e.preventDefault();
            } else {
                // IE中阻止函数器默认动作的方式
                window.event.returnValue = false;
            }

            return false;

        },

        /*通过句柄，获得当前事件对象*/
        getTargetByEvent: function (e) {
            var event = e || window.event,
                target = event.srcElement || event.target;
            return $(target);
        },

        /*取得浏览器的类型*/
        browerType: function () {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) {
                return "Opera"
            }
            ; //判断是否Opera浏览器
            if (userAgent.indexOf("Firefox") > -1) {
                return "FF";
            } //判断是否Firefox浏览器
            if (userAgent.indexOf("Chrome") > -1) {
                return "Chrome";
            }
            if (userAgent.indexOf("Safari") > -1) {
                return "Safari";
            } //判断是否Safari浏览器
            if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                return "IE";
            }
            ; //判断是否IE浏览器
        },

        /*
         *判断webview的来源
         */
        operationType:function() {
            var u = navigator.userAgent, app = navigator.appVersion;
            return { //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        },

        /*
         * 禁止(恢复)滚动
         * para：
         * flag - {bool} 允许（true）或者禁止（false）滚动
         * $target - {jquery obj} 滚动对象
         */
        scrollControl:function(flag,$target){
            if(!flag) {
                $target = $target || $('body');
                this.scrollTop = $target.scrollTop();
                $('html,body').addClass('noscroll');
                window.scrollTo(0, this.scrollTop);
            }else{
                $('html,body').removeClass('noscroll');
                window.scrollTo(0, this.scrollTop);
            }
        },


        /*
         * 向本地localStorage中写入信息
         * para:
         * dictionary - {object} 键值对信息 {key：'userInfo',val:'123132'}
         *
         * */
        writeInfoToStorage:function (dictionary) {
            var storage = window.localStorage;
            this.clearStorage(dictionary.key);
            if(typeof dictionary.val =='object'){
                dictionary.val=JSON.stringify(dictionary.val);
            }
            storage.setItem(dictionary.key, dictionary.val);
        },

        /*
         * 读取本地localStorage中的信息
         * para:
         * keyName - {string} 键值 名称
         *
         * */
        getInfoFromStorage:function (key) {
            var storage = window.localStorage,
                info = storage.getItem(key); //myToken
            if (info) {
                return info;
            } else {
                return false;
            }
        },

        /*
        *清除某个缓存
        */
        clearStorage:function(key){
            localStorage.removeItem(key);
        },

        CLASS_NAME: 'Super'
    };


    return Super;

});