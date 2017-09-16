define(['base','wx'],function (BaseClass,wx) {

    function WxConfig(data,options){
        this.init(data,options);
    }

    WxConfig.prototype={
        init:function(data,options){
            var that=this;
            /*
             * 注意：
             * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
             * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
             * 3. 常见问题及完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
             *
             * 开发中遇到问题详见文档“附录5-常见错误及解决办法”解决，如仍未能解决可通过以下渠道反馈：
             * 邮箱地址：weixin-open@qq.com
             * 邮件主题：【微信JS-SDK反馈】具体问题
             * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
             */
            wx.config({
                debug: false,
                appId: data.appId,
                timestamp: data.timestamp.toString(),
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: [
                    // 所有要调用的 API 都要加到这个列表中
                    'checkJsApi',
                    'chooseImage',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'onMenuShareTimeline',
                    'openLocation',
                    'getLocation',
                    'chooseWXPay'
                ]
            });

            wx.ready(function () {
                // 在这里调用 APIs

                wx.onMenuShareQQ({
                    title: '', // 分享标题
                    desc: '', // 分享描述
                    link: '', // 分享链接
                    imgUrl: '', // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    trigger: function () {
                        this.title = window.ShareInfo.title;
                        this.desc = window.ShareInfo.desc;
                        this.link = window.ShareInfo.link;
                        this.imgUrl = window.ShareInfo.imgUrl;
                    },
                    success: function () {
                        window.ShareInfo.shareCallback();
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

                wx.onMenuShareWeibo({
                    title: '', // 分享标题
                    desc: '', // 分享描述
                    link: '', // 分享链接
                    imgUrl: '', // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    trigger: function () {
                        this.title = window.ShareInfo.title;
                        this.desc = window.ShareInfo.desc;
                        this.link = window.ShareInfo.link;
                        this.imgUrl = window.ShareInfo.imgUrl;
                    },
                    success: function () {
                        window.ShareInfo.shareCallback();
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

                wx.onMenuShareQZone({
                    title: '', // 分享标题
                    desc: '', // 分享描述
                    link: '', // 分享链接
                    imgUrl: '', // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    trigger: function () {
                        this.title = window.ShareInfo.title;
                        this.desc = window.ShareInfo.desc;
                        this.link = window.ShareInfo.link;
                        this.imgUrl = window.ShareInfo.imgUrl;
                    },
                    success: function () {
                        window.ShareInfo.shareCallback();
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

                wx.onMenuShareTimeline({
                    title: '', // 分享标题
                    link: '', // 分享链接
                    imgUrl: '', // 分享图标
                    trigger: function () {
                        this.title = window.ShareInfo.title + window.ShareInfo.desc;
                        this.link = window.ShareInfo.link;
                        this.imgUrl = window.ShareInfo.imgUrl;
                    },
                    success: function () {
                        window.ShareInfo.shareCallback();
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

                if(options.shareInfo) {
                    var base=new BaseClass();
                    var newOptions = base.extentConfig(window.ShareInfo,options.shareInfo.wordInfo);
                    wx.onMenuShareAppMessage({
                        title: newOptions.title, // 分享标题
                        desc: newOptions.desc, // 分享描述
                        link: newOptions.link, // 分享链接
                        imgUrl: newOptions.imgUrl, // 分享图标
                        type: 'link', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        trigger: function () {
                            //var base=new BaseClass();
                            //var newOptions = base.extentConfig(window.ShareInfo,options.shareInfo.wordInfo);
                            ////alert(options.shareInfo.wordInfo.link);
                            //this.title = newOptions.title;
                            //this.desc = newOptions.desc;
                            //this.imgUrl = newOptions.imgUrl;
                            //this.link = newOptions.link;
                            alert('share start');
                        },
                        success: function () {
                            newOptions.shareCallback();
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                }

                wx.checkJsApi({
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage','getLocation'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                    success: function (res) {
                        // 以键值对的形式返回，可用的api值true，不可用为false
                        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                    }
                });

                if(options.locationInfo) {
                    wx.getLocation({
                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function (res) {
                            var speed = res.speed; // 速度，以米/每秒计
                            var accuracy = res.accuracy; // 位置精度

                            var location = {
                                lon: res.longitude,  // 经度，浮点数，范围为180 ~ -180。
                                lat: res.latitude   //纬度，浮点数，范围为90 ~ -90
                            };
                            options.locationInfo.locationSCallback && options.locationInfo.locationSCallback(location);
                        },
                        error: function () {
                            //console.log('location error');
                            //alert('location error');
                            options.locationInfo.locationECallback && options.locationInfo.locationECallback('位置信息获取失败');
                        }
                    });
                }

                if(options.wxPayInfo) {
                    wx.chooseWXPay({
                        timestamp: options.wxPayInfo.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: options.wxPayInfo.nonceStr, // 支付签名随机串，不长于 32 位
                        package: options.wxPayInfo.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                        signType: options.wxPayInfo.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: options.wxPayInfo.paySign, // 支付签名
                        success: function (res) {
                            options.wxPayInfo.sCallback &&options.wxPayInfo.sCallback(res);
                        },
                        cancel:function(){
                            options.wxPayInfo.cCallback &&options.wxPayInfo.cCallback();

                        },
                        error: function () {
                            options.wxPayInfo.cCallback &&options.wxPayInfo.cCallback();
                        }
                    });
                }

            });

            /*  weixin://contacts/profile/wxe567cacaccd3a88f*/

            wx.error(function (res) {
                console.log(res);
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });
        },
    }

    return WxConfig;

});