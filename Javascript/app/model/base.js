/**
 * Created by jimmy on 2015/12/22.
 */

/*
* 基础父类，将共用的方法，属性提取出来，
* 子类 通过 原型 继承即可 使用 相应的方法和属性
*/
define(['super'], function (Super) {

    function BaseClass($wrapper) {
        //Super.call(this);//属性继承  不需要则不用调
        var that = this;
        this.$wrapper = $wrapper;

        this.isTest = true;
        this.eventName = 'click';
        if (this.isTest) {
            this.eventName = 'touchend';
        }

        this.tryTimes = 0;  //如果加载超时，可以再重新尝试一次

        this.baseApiUrl = window.urlObject.apiUrl;

        //本地存储时，key名字
        this.storageKeyArr = [
            'userInfo',
            'station',
            'selectedCouponForOrder',
            'location',
            'wechatCode',
            'couponUseTips',
            'isTakenRedPack'
        ];

        //异步请求的默认参数
        this.asyncDefaultOptions = {
            type: 'get',
            timeout: 1000 * 15,
            //timeout: 100,
            token: true,
            credentials: false,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            errorCallback: function (data) {
                alert(data);
            }
        };
        this.initCouponArr();
        this.setShareInfo();
        //$(document).on('click','.modal-box',function(e){
        //    that.toHideModuleByClickOutside(e,function(){
        //        $('.modal-box').removeClass('show');
        //    });
        //});
    }

    //方法继承
    BaseClass.prototype = new Super();
    BaseClass.prototype.constructor = BaseClass;

    var pt = BaseClass.prototype;

    /*优惠券基本信息*/
    pt.initCouponArr = function () {
        this.couponArr = [
            { type: 1, typeName: '满减券', className: 'gas' },
            { type: 2, typeName: '折扣券', className: 'gas' },
            { type: 3, typeName: '超级折扣券', className: 'gas' },
            { type: 4, typeName: '代办券', className: 'replace' },
            { type: 5, typeName: '礼品券', className: 'gift' },
            { type: 6, typeName: '保养券', className: 'gas' },
            { type: 7, typeName: '洗车券', className: 'clean' },
        ];
    };

    /*
     *通用异步请求方法
     *para:
     * url- {string} 请求地址 必须
     * dataStr,请求参数 必须,区分两种情况，
     * 1.post  - {json string}   严格标准的json字符串 '{"name":"mayday","pwd":"123456"}'
     * 2.get - {json object}  json {"name":"mayday","pwd":"123456"}
     * successCallback - {function} 请求成功回调方法 必须
     * options -{object} 可选参数
     */
    pt.getDataAsync = function (url, param, successCallback, options) {
        var that = this;
        if (!options) {
            options = {};
        }
        for (var item in this.asyncDefaultOptions) {
            var val = options[item];
            if (val === undefined) {
                options[item] = this.asyncDefaultOptions[item];
            }
        }

        //将token加入到请求的头信息中
        //if (options.openId) {
        //    param.open_id=that.getOpenid();
        //}

        if (options.type == 'put') {
            options.contentType = 'x-www-form-urlencoded';
        }

        var loginXhr = $.ajax({
            url: this.baseApiUrl + url,
            type: options.type,
            data: param,
            timeout: options.timeout,
            contentType: options.contentType,
            beforeSend: function (xhr) {
                if (options.token) {
                    //xhr.withCredentials = true; //设置头消息
                    var token = that.getToken();
                    xhr.setRequestHeader('token', token);  //设置头消息
                }
            },
            complete: function (xmlRequest, status) {
                if (status == 'success') {
                    that.tryTimes = 0;
                    var info = ''
                    if (xmlRequest.responseText) {
                        info = JSON.parse(xmlRequest.responseText);
                    }
                    successCallback(info);
                }
                //超时
                else if (status == 'timeout') {
                    if (that.tryTimes === 0) {
                        that.tryTimes = 1;
                        that.getDataAsync(url, param, successCallback, options);  //重试一次
                    }
                    else {
                        that.tryTimes = 1;
                        loginXhr.abort();
                        options.errorCallback && options.errorCallback({ msg: '请求超时，请稍后重试' });
                    }
                }
                else if (status == 'error') {
                    var result = null;
                    if (xmlRequest.responseText) {
                        try {
                            result = JSON.parse(xmlRequest.responseText);
                        } catch (e) {
                            alert('错误信息解析出错。请求地址：' + url);
                        } finally {
                            //result={code:1007};
                            //alert(result.error_code);
                        }
                    } else {
                        alert('服务器没有反应');
                        result = { error_code: 1007 };
                    }
                    var str = that.errorCodeInfo(result.error_code);
                    if (result.error_code == 80001) {
                        if (window.confirm('令牌信息已经过期，请重新登录')) {
                            window.location.href = window.urlObject.redirectUrl.replace('/home', '');  //跳转授权页面
                        } else {
                            options.errorCallback(str);
                        }
                    } else {
                        options.errorCallback(result);
                    }
                }
                else {
                    options.errorCallback('操作失败');
                }
            }
        });
    };

    /*通用的错误码信息*/
    pt.errorCodeInfo = function (code) {
        var str = '';
        switch (code) {
            case 1001:
                {
                    str = '查询结果为空';
                    break;
                }
            case 1003:
                {
                    str = '令牌信息已经过期，请重新登录';
                    break;
                }
            case 1007:
                {
                    str = '服务器内部错误';
                    break;
                }
            case 413:
                {
                    str = '413';
                    break;
                }
            case 60001:
                {
                    str = '请登录';
                    break;
                }
            case 80001:
                {
                    str = 'token失效';
                    break;
                }
            default:
                {
                    str = '网络异常';
                    break;
                }
        }
        return str;
    };


    /*
     *字符串截取
     * para
     * str - {string} 目标字符串
     * len - {int} 最大长度
     */
    pt.substrLongStr = function (str, len) {
        if (str.length > len) {
            str = str.substr(0, parseInt(len - 1)) + '…';
        }
        return str;
    };

    /*得到token*/
    pt.getToken = function () {
        var info = this.getInfoFromStorage(this.storageKeyArr[0]);
        if (info) {
            return JSON.parse(info).token;
        }
        return null;
    };


    /*显示操作信息*/
    pt.showTips = function (option) {
        if (!option.time) {
            option.time = 3000;
        }
        var $globalTips = $('#global-tips');
        if ($globalTips.length == 0) {
            $globalTips = $('<div id="global-tips"><label></label></div>');
            $('body').append($globalTips);
        }
        $globalTips.find('label').text(option.txt);
        $globalTips.show();
        window.setTimeout(function () {
            $globalTips.hide();
            option.callback && option.callback();
        }, option.time)
    };

    /*
    * 控制按钮的可用性
    * e - {js obj} 当前操作句柄
    * $btn - {jquery obj} 想要控制的按钮对象
    * validityFn - {fn} 返回数据合法性的判断表达方法
    * */
    pt.ctrlSearchBtnStatus = function (e, $btn, validityFn) {
        var event = window.event || e,
            target = event.srcElement || event.target,
            $this = $(target);
        var txt = $this.val().trim(),
            className = 'disabled',
            validity = validityFn && validityFn(txt);
        if (validity.flag) {
            $btn.removeClass(className);
        } else {
            $btn.addClass(className);
        }
    };

    /*点击模态的基本区域，关闭模态窗口*/
    pt.toHideModuleByClickOutside = function (e, closeFn) {
        var $target = this.getTargetByEvent(e);
        if ($target.closest('.modal-box-main').length == 0) {
            closeFn && closeFn();
        }
    };


    /*
    * 获得优惠券信息
    * 1为代金券, 2为增值代金券, 3为折扣券 ,4 超级折扣券 ，5随机红包
    */
    pt.getCouponTypeStr = function (data) {
        var numInfo = '',
            descInfo = '';
        switch (data.type) {
            case 1:
            case 2:
                numInfo = '¥' + data.discount;
                descInfo = '满减券';
                break;
            case 3:
            case 4:
                numInfo = data.discount_rate + '折';
                descInfo = '折扣券';
                break;
            default:
                break;
        }
        return {
            numInfo: numInfo,
            descInfo: descInfo
        };
    }

    /*控制加载等待提示*/
    pt.ctrlLoadingIcon = function (flag) {
        var $modal = $('.loding-modal');
        if (flag !== false) {
            $modal.show();
        } else {
            $modal.hide();
        }
    };

    pt.getDiscountInfo = function (data) {
        var type = '', desc = '';
        if (data.discountType == 1) {
            type = '<span class="discount-type green">降</span>';
            desc = '<div class="discount-str">' + data.discountDesc + '</div>';
            desc
        }
        if (data.discountType == 3) {
            type = '<span class="discount-type red">惠</span>';
            desc = '<div class="discount-str">' + data.discountDesc + '</div>';
        }
        return {
            type: type,
            desc: desc
        }
    };

    pt.switchClass = function ($obj, newClass, oldClass) {
        $obj.addClass(newClass).removeClass(oldClass);
    }

    /*
    *  设置分享信息
    */
    pt.setShareInfo = function () {
        window.ShareInfo = {
            title: '加油赞 年中钜惠 加油低至75折',
            desc: '小伙伴们帮我关注，助我拿九折加油红包！',
            link: window.urlObject.host + 'index.php/src/index',
            imgUrl: 'http://jiayouzan.oss-cn-hangzhou.aliyuncs.com/headimg_1.jpg',
            type: 'link',
            dataUrl: '',
            shareCallback: function () {
                alert('分享成功');
            }
        }
    };

    /**
     * 获取url参数
     */
    pt.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (r[2]); return null;
    }



    /*隐藏遮盖蒙板*/
    pt.hideCoverBox=function(){
        $('#cover-box').hide();
    }

    return BaseClass;
});


