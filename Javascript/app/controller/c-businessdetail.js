/**
 * Created by Jimmy on 2017/07/29.
 */
//可用优惠券信息

define(['base', 'wx', 'wxconfig', 'bscroll', 'swiper', 'template', 'confirmbox'], function (BaseClass, wx, Wxconfig, BScroll, Swiper, Template, Confirmbox) {
    function Activity($wrapper) {
        BaseClass.call(this, $wrapper);
        this.init();
    };

    Activity.prototype = new BaseClass();
    Activity.constructor = Activity;

    var pt = Activity.prototype;
    var scrollNavList = null;
    var shopId = pt.getQueryString('id');
    var oneCommitCollect = true; // 防止多次点击
    pt.defaultLocation = {
        lon: '114.344612',
        lat: '30.555275'
    };

    pt.init = function () {
        this.ctrlLoadingIcon();
        this.getShops();
        this.bindEvent();
    }

    /*结算*/
    pt.commitOrder = function () {
        var param = {
            sid: 11,
            gun_id: 343,
            gun_sn: 1,
            amount: 1,

        },
            url = '/v1/order_commit',
            options = {
                type: 'post',
                errorCallback: function (res) {
                    console.log(res);
                    alert(res);
                }
            };
        alert('order-before');
        this.getDataAsync(url, param, $.proxy(this, 'commitOrderSCallback'), options);
        //window.location.href=window.urlObject.ctrl+'/payresult/id/1';
    };

    /*下单成功*/
    pt.commitOrderSCallback = function (result) {
        alert('order-ok');
        var jsApiParameters = JSON.parse(result.jsApiParameters);
        alert('jsApiParameters:' + result.jsApiParameters);

        //获取微信登录信息
        var url = '/v1/wx_config',
            currentUrl = window.location.href.split('#')[0],
            param = {
                current_url: currentUrl
            },
            options = {
                token: true,
            };

        this.getDataAsync(url, param, function (data) {
            alert('data:' + JSON.stringify(data));
            alert('timestamp:' + jsApiParameters.timeStamp.toString());
            alert('拉起支付，支付前');
            var payOptions = {
                wxPayInfo: {
                    timeStamp: jsApiParameters.timeStamp.toString(), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: jsApiParameters.nonceStr, // 支付签名随机串，不长于 32 位
                    package: jsApiParameters.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: jsApiParameters.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: jsApiParameters.paySign, // 支付签名
                    sCallback: function (res) {
                        alert(res);
                        // 支付成功后的回调函数
                        window.location.href = window.urlObject.ctrl + '/payresult/id/1';
                    }
                }
            };
            var wxConfig = new Wxconfig(data, payOptions);
        }, options);
    };

    // 设置布局
    pt.setPageLayOut = function () {

        var docHeight = document.documentElement.offsetHeight,
            detailTopHeader = document.querySelector('.detail-top').offsetHeight,
            footerBtn = Number.parseInt($('.footer-btn').height());
        $('.business-content, .pageScroll').css('min-height', docHeight - detailTopHeader - footerBtn);
    }
    // 绑定滚动特效
    pt.bindScroll = function () {
        var itemList = $('.service-wrap .list-item'),
            listHeight = [0],
            currentIndex = 0,
            itemHeight = 0;

        itemList.each(function (idx, elem) {
            itemHeight += elem.clientHeight;
            listHeight.push(itemHeight);
        });

        var iscroll = new BScroll($('.service-wrap').get(0), {
            probeType: 2,
            interactiveScrollbars: true,
        });

        iscroll.on('scroll', function (pos) {
            const y = pos.y
            for (let i = 0; i < listHeight.length - 1; i++) {
                let height1 = listHeight[i]
                let height2 = listHeight[i + 1]
                if (-y >= height1 && -y < height2) {
                    currentIndex = i
                    pt.inCurrentItem(currentIndex);
                }
            }
        });

        $('.pageScroll').on('click', 'li', function () {
            var index = $(this).index();
            iscroll.scrollToElement(itemList[index], 1000);
            pt.inCurrentItem(index);
        });

    }
    // 顶部滑动
    pt.headerSwiper = function () {
        var mySwiper = new Swiper('.swiper-container', {
            loop: true,
            pagination: '.swiper-pagination',
        });
    }

    pt.inCurrentItem = function (index) {
        scrollNavList.removeClass('active');
        scrollNavList.eq(index).addClass('active');
    }

    pt.getShops = function () {
        this.getDataAsync('/v2/shops/' + shopId, {
            lon: this.defaultLocation.lon,
            lat: this.defaultLocation.lat,
        }, $.proxy(this, 'main'));
    }

    pt.getPhone = function () {
        this.getDataAsync('/v2/consulting_telephone/' + shopId, null, function (result) {
            $('#tel').attr('href', '#')
                .attr('data-href', result.consulting_telephone);
        });
    }

    pt.getCollect = function () {
        var collectBtn = $('.form-btn-primary');
        this.getDataAsync('/v2/collect', {
            lon: this.defaultLocation.lon,
            lat: this.defaultLocation.lat
        }, function (result) {
            var notCollect = true;
            if (result.length) {
                for (var i = 0, len = result.length; i < len; i++) {
                    // 已经收藏
                    if (result[i].id == shopId) {
                        notCollect = false;
                        break;
                    }
                }
            }
            if (!notCollect) {
                // TODO 缺少表示已经收藏的星星图片
                // $('img', collectBtn).attr('src', ''); 
            }

        });
    }

    // 收藏商家
    pt.commitCollect = function () {

        if (!oneCommitCollect) {
            return false;
        }
        oneCommitCollect = false;

        var that = this;
        var param = {
            shop_id: shopId,
        },
            options = {
                type: 'post',
                errorCallback: function (res) {
                    that.ctrlLoadingIcon(false);
                    that.showTips({ txt: res.msg });
                }
            },
            url = '/v2/collect';
        this.getDataAsync(url, param, function (result) {
            this.showTips({
                txt: '已收藏到我的收藏',
                time: 2000
            });
            oneCommitCollect = true;
        }, options);
    }

    // 打电话
    pt.showPhone = function () {
        var $confirmWrap;
        if (!this.confirmbox) {
            this.confirmbox = new Confirmbox();
            this.confirmbox.init();
            $confirmWrap = $('#confirm-box');
            $('.bottom-btns', $confirmWrap).append('<a href="tel:' + phone + '#mp.weixin.qq.com" class="tel-btn">拨打</a>');
            $('.ok-btn', $confirmWrap).remove();
        }
        var phone = $(this).data('href');
        this.confirmbox.showBox({
            content: phone
        });

    }
    pt.bindEvent = function () {
        // 收藏按钮
        var collectBtn = $('.form-btn-primary');

        collectBtn.on(this.eventName, $.proxy(this, 'commitCollect'));
        $('#tel').on(this.eventName, this.showPhone);
    }

    // 整理数据，对goods进行重组
    pt.arrangeData = function (data) {
        var newData = {},
            newList = [];
        for (var i = 0, len = data.length; i < len; i++) {

            if (!newData[data[i].cates]) {
                newData[data[i].cates] = [];
            } 
            newData[data[i].cates].push(data[i]);

        }
        for(var item in newData){
            if (!newData[item].length) {
                delete newData[item];
            }
        }
        return newData;
    }

    pt.main = function (result) {
        // TODO 可在页面传递参数过来替换标题
        document.title = result.shop.merchname;
        result.goods = this.arrangeData(result.goods);
        result.goodsCategory = result.goodsCategory.sort(function (item1, item2) {
            return item1.id > item2.id;
        });
        $('.businessdetail-wrapper').html(Template('contentTemplate', result));
        $('.place-wrapper').html(Template('shopInfoTemplate', result));

        if (result.banner.length == 0) {
            $('.swiper-container').hide();
        }

        scrollNavList = $('.scrollNav');
        this.setPageLayOut();
        this.bindScroll();
        this.headerSwiper();
        this.ctrlLoadingIcon(false);
        this.inCurrentItem(0);
        this.getPhone();
        this.bindEvent();
    }
    return Activity;
});