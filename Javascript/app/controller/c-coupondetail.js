/**
 * Created by Jimmy on 2017/07/29.
 */
//单个优惠券详细信息

define(['base','wx','wxconfig'],function (BaseClass,wx,WxConfig) {
    function CouponDetail($wrapper) {
        BaseClass.call(this,$wrapper);

        this.init();  //优惠券详情
        var that=this;

        /*点击灰色部分关闭*/
        $(document).on(this.eventName,'#QRCode-modal-box',function(e){
            that.toHideModuleByClickOutside(e,$.proxy(that,'hideQRCodeBox'));
        });

        $(document).on(this.eventName,'.use－btn',$.proxy(that,'showShareTips'));

        $(document).on(this.eventName,'#share-tips-modal-box',$.proxy(this,'hideShareTipsBox'));

        /*显示二维码*/
        $(document).on(this.eventName,'.use－btn-QRCode',$.proxy(that,'showQRCode'));

        /*送货上门*/
        $(document).on(this.eventName,'.delivery－btn',$.proxy(that,'sendGift'));

    };

    CouponDetail.prototype=new BaseClass();
    CouponDetail.constructor=CouponDetail;

    var pt=CouponDetail.prototype;

    /*优惠券详情*/
    pt.init=function(){
        this.ctrlLoadingIcon();
        this.getLocationInfo($.proxy(this,'getCouponInfo'));
        this.initWxConfigInfo();
    };

    pt.getCouponInfo=function(res){
        var that=this,
            param={
                lon:res.lon,
                lat:res.lat,
                id:this.$wrapper.attr('data-id')
            },
            url='/v1/coupon_detail',
            options={
                errorCallback:function(){
                    that.ctrlLoadingIcon(false);
                    that.showTips({txt:'获取优惠券信息失败'});
                }
            };
        this.getDataAsync(url,param,$.proxy(this,'getCouponInfoSuccess'),options);
        //var url=window.urlObject.json +'coupondetail.json';
        //$.getJSON(url,{},$.proxy(this,'getCouponInfoSuccess'),options);
    };

    /*获取当前未知*/
    pt.getLocationInfo=function(callback){
        var that=this,
            locationOptions={
            locationInfo: {
                locationSCallback: function (locationInfo) {
                    callback && callback(locationInfo);
                },
                locationECallback: function (txt) {
                    that.showTips({txt: txt});
                }
            }
        };

        var url='/v1/wx_config',
            currentUrl=window.location.href.split('#')[0],
            param={
                current_url:currentUrl
            };

        this.getDataAsync(url,param,function(data) {
            var wxConfig = new WxConfig(data, locationOptions);
        });

    };

    /*获取成功*/
    pt.getCouponInfoSuccess=function(result){
        this.ctrlLoadingIcon(false);
        var str = '',
            timeFormatStr='yyyy-MM-dd',
            couponTypeInfo,
            className=this.couponArr[result.type-1].className;
            couponTypeInfo=this.getCouponTypeInfo(result);
            str += '<div class="coupon-item" href="'+window.urlObject.ctrl+'/coupondetail/id/'+result.couponid+'">'+
                        '<div class="coupon-left"></div>' +
                        '<div class="coupon-middle">' +
                            '<div class="coupon-content">'+
                                '<div class="coupon-head available-head">' +
                                    '<div class="left-info">'+couponTypeInfo.discount+'</div>' +
                                    '<div class="right-info">'+
                                        '<div>'+couponTypeInfo.unit+'</div>'+
                                        '<div>'+couponTypeInfo.typeStr+'</div>'+
                                    '</div>' +
                                '</div>' +
                                '<div class="coupon-bottom">' +
                                    '<div><span>满' + result.condition + '元可用</span></div>' +
                                    '<div><span>'+this.getTimeFromTimestamp(result.endtime,timeFormatStr) + '到期</span></div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="coupon-type-img '+className+'"></div>'+
                        '</div>' +
                        '<div class="coupon-right"></div>' +
                    '</div>';
        $('#coupon-detail-main').html(str);
        $('#rule-detail').html(result.description);
        $('.btns-box').html(this.getBtnsByCouponType(result.type));
        $('#QRCode-modal-box img').attr('src', result.qrcode_url);
        var stations=result.stations;
        if(stations.length>0) {
            $('#min-distance').text(stations[0].distance);
        }else{
            $('.available-store-box').hide();
        }
        this.$wrapper.addClass('show');
    };

    /*
     * 获得优惠券信息
     * type 1、 2满减券, 3为折扣券 ,4 超级折扣券
     */
    pt.getCouponTypeInfo=function(data){
        var discount='',
            typeStr='',
            unit='';
        switch (data.type){
            case 1:
            case 2:
                discount = data.discount;
                typeStr ='加油券';
                unit='元';
                break;
            case 3:
            case 4:
                discount = data.discount_rate;
                typeStr ='加油券';
                unit='折';
                break;
            case 5:
            case 6:
                discount = data.discount;
                typeStr ='洗车券';
                unit='元';
                break;
            default:
                break;
        }
        return {
            discount:discount,
            unit:unit,
            typeStr:typeStr
        };
    };

    /*获取失败*/
    pt.getCouponInfoError=function(result){
        console.log(result);
    };

    /*
    *根据优惠券类型，获得按钮
    * type 1为代金券, 2为增值代金券, 3为折扣券 ,4 超级折扣券 ，5随机红包
    * */
    pt.getBtnsByCouponType=function(type){
        var btns='';
        switch (type){
            case 1:
            case 2:
            case 5:
                btns='<div class="btn radius-btn use－btn">立即分享，增值红包</div>';
                break;
            case 3:
                btns='<div class="btn radius-btn use－btn">立即使用</div>';
                break;
            case 4:
                btns='<div class="btn radius-btn use－btn-QRCode">立即使用</div>';
                break;
            case 6:
                btns='<div class="btn radius-btn use－btn">到店领取</div><div class="btn radius-btn delivery－btn">送货上门</div>';
                break;
            default:
                break;
        }
        return btns;
    };

    /*显示二维码*/
    pt.showQRCode=function(){
        $('#QRCode-modal-box').addClass('show');
    };

    pt.hideQRCodeBox=function(){
        $('#QRCode-modal-box').removeClass('show');
    };

    pt.showShareTips=function(){
        $('#share-tips-modal-box').show();
    };

    pt.hideShareTipsBox=function(){
        $('#share-tips-modal-box').hide();
    };

    /*送货上门*/
    pt.sendGift=function(){
        window.location.href=window.urlObject.ctrl+'/home_delivery/id/1';
    };

    /*设置微信配置信息*/
    pt.initWxConfigInfo=function(){
        var that=this,
            shareOptions={
                shareInfo: {
                    shareCallback: function () {

                    },
                    wordInfo:{
                        link:window.urlObject.host+'index.php/src/index/share'
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

    return CouponDetail;
});