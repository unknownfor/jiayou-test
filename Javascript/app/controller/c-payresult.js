/**
 * Created by Jimmy on 2017/07/28.
 */
//订单信息

define(['base','baseorderdetail','wxconfig'],function (BaseClass,BaseOrderDetail,WxConfig) {
    function PayResult($wrapper) {
        BaseClass.call(this,$wrapper);
        var that=this;

        $(document).on(this.eventName,'.trapezoid-box,.total-save-tips,#ambassador-modal-box',$.proxy(this,'showAmbassadorBox'));

        //领取随机红包
        $(document).on(this.eventName,'#take-btn',$.proxy(this,'takeRedPack'));

        $(document).on(this.eventName,'.share-btn',$.proxy(this,'showShareTipsBox'));

        $(document).on(this.eventName,'#share-tips-modal-box',$.proxy(this,'hideShareTipsBox'));

        /*点击灰色部分关闭*/
        $(document).on(this.eventName,'#take-redpack-success-box',function(e){
            that.toHideModuleByClickOutside(e,$.proxy(that,'hideRedPackSuccessBox'));
        });

        /*关闭*/
        $(document).on(this.eventName,'#take-redpack-success-box .close-head span',$.proxy(that,'hideRedPackSuccessBox'));

        this.init();
    };

    PayResult.prototype=new BaseClass();
    PayResult.constructor=PayResult;

    var pt=PayResult.prototype;

    pt.init=function(){

         // 订单详情
        var options={
            sCallback:$.proxy(this,'getOrderDetailSuccess')
        };
        this.baseOrderDetail=new BaseOrderDetail(options);
        this.baseOrderDetail.getOrderDetailInfo(this.$wrapper.attr('data-id'));

        //推广页面上的累计信息
        this.getPromotionInfo();

        this.initWxConfigInfo();

        //控制领取红包的按钮是否可用，安卓使用
        var isToken=this.getInfoFromStorage(this.storageKeyArr[6]);
        if(isToken){
            $('#take-btn').addClass('disabled');
        }
    };
    /*获取成功*/
    pt.getOrderDetailSuccess=function(result){
        $('.order-detail-box').html(result.htmlStr);
        $('.code').html(result.code);
    };

    //推广页面上的累计信息
    pt.getPromotionInfo=function(){
        var that=this,
            param={},
            url='/v1/promotion',
            options={
                errorCallback:function(){
                    //that.showTips({txt:'领取红包失败'});
                }
            };
        this.getDataAsync(url,param,$.proxy(this,'getPromotionInfoSuccess'),options)
    };

    pt.getPromotionInfoSuccess=function(res){
        $('#total-save-amount').text(res.discount_count);
        $('#today-save-amount').text(res.discount_fee);
        $('#today-amount').text(res.total_fee);
    };

    //领取随机红包
    pt.takeRedPack=function(){
        var that=this,
            param={
                order_id:this.$wrapper.attr('data-id')
            },
            url='/v1/random_coupon',
            options={
                type:'post',
                errorCallback:function(res){
                    that.showTips({txt:res.msg});
                }
            };
        this.getDataAsync(url,param,$.proxy(this,'takeRedPackSuccess'),options)
        //var url=window.urlObject.json +'coupondetail.json';
        //$.getJSON(url,{},$.proxy(this,'takeRedPackSuccess'),options);
    };

    //领取红包成功
    pt.takeRedPackSuccess=function(res){
        $('#take-redpack-success-box').addClass('show');
        var couponTypeInfo=this.getCouponTypeStr(res),
            couponAmount=couponTypeInfo.numInfo,
            couponName=couponTypeInfo.descInfo;
        if(couponAmount.indexOf('¥')>=0){
            couponAmount=couponAmount.replace('¥','')+'元';
        }
        $('#token-coupon-info').text(couponAmount+couponName);
        $('#take-btn').addClass('disabled');

        //将当前已经领取了红包
        this.writeInfoToStorage({key:this.storageKeyArr[6],val:true});
    };

    pt.showAmbassadorBox=function(){
        var $target=$('.ambassador-box'),
            $box=$('#ambassador-modal-box'),
            $tranBox=$('.trapezoid-box');
        if(!$target.hasClass('show')) {
            $target.addClass('show');
            window.setTimeout(function () {
                $box.show();
                $tranBox.addClass('down');
            }, 200);
        }
        else{
            $target.removeClass('show');
            window.setTimeout(function () {
                $box.hide();
                $tranBox.removeClass('down');
            }, 200);
        }
    }

    pt.showShareTipsBox=function(){
        $('#share-tips-modal-box').show();
    };
    pt.hideShareTipsBox=function(){
        $('#share-tips-modal-box').hide();
    };

    pt.hideRedPackSuccessBox=function(){
        $('#take-redpack-success-box').removeClass('show');
    };

    /*设置微信配置信息*/
    pt.initWxConfigInfo=function(callback){
        var that=this,
            shareOptions={
                shareInfo: {
                    shareCallback: function () {

                    },
                    wordInfo:{
                        link:window.urlObject.ctrl+'/share_friend'
                    }
                }
            };

        var url='/v1/wx_config',
            currentUrl=window.location.href.split('#')[0],
            param={
                current_url:currentUrl
            };

        this.getDataAsync(url,param,function(data) {
            var wxConfig = new WxConfig(data, shareOptions);
        });

    };

    return PayResult;
});