/**
 * Created by Jimmy on 2017/07/29.
 */
//所有优惠券信息

define(['base','coupon'],function (BaseClass,Coupon) {
    function MyCoupon($wrapper) {
        BaseClass.call(this,$wrapper);

        this.getMyCouponInfo();  //我的未使用的优惠券
        var that=this;

        /*点击灰色部分关闭*/
        $(document).on(this.eventName,'#coupon－tip-box',function(e){
            that.toHideModuleByClickOutside(e,$.proxy(that,'hideTipBox'));
        });

        /*关闭*/
        $(document).on(this.eventName,'.close-head span',$.proxy(that,'hideTipBox'));

        $(document).on(this.eventName,'.coupon-item',$.proxy(that,'showCouponDetail'));

        $(document).on(this.eventName,'.got-it-btn',$.proxy(that,'gotIt'));

        $(document).on(this.eventName,'.share-to-increase',$.proxy(that,'showShareTipsBox'));

        $(document).on(this.eventName,'#share-tips-modal-box',$.proxy(this,'hideShareTipsBox'));

    };

    MyCoupon.prototype=new BaseClass();
    MyCoupon.constructor=MyCoupon;

    var pt=MyCoupon.prototype;

    /*获取我的优惠券*/
    pt.getMyCouponInfo=function(){
        this.ctrlLoadingIcon();
        var options={
                sCallback:$.proxy(this,'getCouponInfoSuccess'),
                eCallback:$.proxy(this,'getCouponInfoError')
            };
        var coupon=new Coupon(options);
    };
    /*获取成功*/
    pt.getCouponInfoSuccess=function(data){
        var len = data.length,
            str = '',
            item,
            className,
            count=0,
            timeFormatStr='yyyy-MM-dd',
            couponTypeInfo,
            increaseAmountCouponStr='';
        for (var i = 0; i < len; i++) {
            item = data[i];
            if(item.status!=1){
                continue;
            }
            count ++;
            className=this.couponArr[item.type-1].className;
            couponTypeInfo=this.getCouponTypeInfo(item);
            increaseAmountCouponStr='';
            if(item.type==1 || item.type==2 ||item.type==5){
                increaseAmountCouponStr='<span class="share-to-increase">您的券可增值，点击分享</span>';
            }

            str += '<div class="coupon-item" data-type="'+item.type+'" data-url="'+window.urlObject.ctrl+'/coupondetail/id/'+item.id+'">'+
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
                                    '<div><span>满' + item.condition + '元可用</span></div>' +
                                    '<div><span>'+this.getTimeFromTimestamp(item.endtime,timeFormatStr) + '到期</span></div>' +
                                '</div>' +
                            '</div>' +
                            increaseAmountCouponStr+
                            '<div class="coupon-type-img '+className+'"></div>'+
                        '</div>' +
                        '<div class="coupon-right"></div>' +
                    '</div>';
        }
        this.ctrlLoadingIcon(false);
        $('.num-txt').text(count);
        $('#coupon-location').addClass('show');
        $('#my-coupon-main').html(str);
    };

    /*
     * 获得优惠券信息
     * type 1为代金券, 2为增值代金券, 3为折扣券 ,4 超级折扣券 ，5随机红包
     * 1，2，5 都可以增值
     */
    pt.getCouponTypeInfo=function(data){
        var discount='',
            typeStr='',
            unit='';
        //data.discount='0.02';
        switch (data.type){
            case 1:
            case 5:
            case 2:
                discount = parseFloat(data.discount);
                //discount = parseInt(data.discount);
                if(data.increment_discount>0) {
                    discount += '+<span class="small-font">' + data.increment_discount + '</span>';
                }
                typeStr ='加油券';
                unit='元';
                break;
                //discount = parseFloat(data.discount);
                ////discount = parseInt(data.discount);
                //typeStr ='加油券';
                //unit='元';
                //break;
            case 3:
            case 4:
                discount = data.discount_rate;
                typeStr ='加油券';
                unit='折';
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

    /*选择优惠券*/
    pt.selectCoupon=function(e){

    };

    pt.showTipBox=function(){
        $('#coupon－tip-box').addClass('show');
    };

    pt.hideTipBox=function(){
        $('#coupon－tip-box').removeClass('show');
    };

    /*查看详情*/
    pt.showCouponDetail=function(e){
        var $target=this.getTargetByEvent(e),
            $item=$target.closest('.coupon-item'),
            type=$item.attr('data-type'),
            url=$item.attr('data-url');
        var isKnowed=this.getInfoFromStorage(this.storageKeyArr[5]);
        if((type==1 || type==2)&&!isKnowed){
            $('#coupon－tip-box').show();
            return;
        }
        window.location.href=url;
    };

    pt.gotIt=function(){
        this.writeInfoToStorage({key:this.storageKeyArr[5],val:true});
        $('#coupon－tip-box').hide();
    }

    //分享提示
    pt.showShareTipsBox=function(){
        $('#share-tips-modal-box').show();
    };
    pt.hideShareTipsBox=function(){
        $('#share-tips-modal-box').hide();
    };



    return MyCoupon;
});