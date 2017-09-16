/**
 * Created by Jimmy on 2017/07/29.
 */
//可用优惠券信息

define(['base','wx','coupon'],function (BaseClass,wx,Coupon) {
    function ACoupon($wrapper) {
        BaseClass.call(this,$wrapper);

        this.getMyCouponInfo();  //我的未使用的优惠券
        var that=this;
        this.amount=this.$wrapper.attr('data-amount');

        //优惠券选择
        $(document).on(this.eventName,'#available-coupon-main .coupon-item',$.proxy(this,'selectCoupon'));
        
        //显示优惠券提示
        $(document).on(this.eventName,'.use-tips',$.proxy(this,'showTipBox'));

        /*点击灰色部分关闭*/
        $(document).on(this.eventName,'#coupon－tip-box',function(e){
            that.toHideModuleByClickOutside(e,$.proxy(that,'hideTipBox'));
        });

        /*关闭*/
        $(document).on(this.eventName,'.close-head span',$.proxy(that,'hideTipBox'));

    };

    ACoupon.prototype=new BaseClass();
    ACoupon.constructor=ACoupon;

    var pt=ACoupon.prototype;

    /*获取我的优惠券*/
    pt.getMyCouponInfo=function(){
        var options={
                sCallback:$.proxy(this,'getCouponInfoSuccess'),
                eCallback:$.proxy(this,'getCouponInfoError')
            };
        var coupon=new Coupon(options);
    };
    /*获取成功*/
    pt.getCouponInfoSuccess=function(data){
        var selectedCouponId=this.$wrapper.attr('data-coupon-id'),
            len = data.length,
            str = '',
            item,
            className,
            count=0,
            timeFormatStr='yyyy-MM-dd',
            couponTypeInfo,
            selectedClassName='';
        for (var i = 0; i < len; i++) {
            item = data[i];
            var timeFlag =this.isAtTimeDuration(item.startime,item.endtime);
            if(item.status!=1 ||
                item.is_activation!=1 ||
                parseFloat(this.amount)<parseFloat(item.condition) ||
                !timeFlag){
                    continue;
            }
            count ++;
            selectedClassName='';
            if(item.id==selectedCouponId){
                selectedClassName='selected';
            }
            className=this.couponArr[item.type-1].className;
            couponTypeInfo=this.getCouponTypeInfo(item);
            str += '<div data-id="'+item.id+'" class="coupon-item '+selectedClassName+'">' +
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
                            '<div class="coupon-type-img '+className+'"></div>'+
                        '</div>' +
                        '<div class="coupon-right"></div>' +
                        '<div class="select-box"><div></div></div>'+
                '</div>';
        }
        $('.num-txt').text(count);
        $('#available-coupon-main').html(str);
    };

    /*
     * 获得优惠券信息
     * type 1为代金券, 2为增值代金券, 3为折扣券 ,4 超级折扣券 ，5随机红包
     */
    pt.getCouponTypeInfo=function(data){
        var discount='',
            typeStr='',
            unit='';
        switch (data.type){
            case 1:
            case 2:
            case 5:
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
        var that=this;
        var $item=this.getTargetByEvent(e).closest('.coupon-item'),
            $otherLi=$item.siblings();
        if($item.hasClass('selected')) {
            $item.removeClass('selected');
        }else{
            $item.addClass('selected');
        }
        $otherLi.removeClass('selected');

        window.setTimeout(function(){
            var type=that.$wrapper.attr('data-type').replace('#',''),  //去除 ＃
                gunId=that.$wrapper.attr('data-gun-id'),
                gunSn=that.$wrapper.attr('data-gun-sn');
            //跳转订单页面
            var url=window.urlObject.ctrl+'/order?'+
                'gun_id='+gunId+
                '&gun_sn='+gunSn+
                '&type='+type+
                '&amount='+that.amount+
                '&coupon_id='+$item.attr('data-id');
            window.location.href=url;

        },200);
    };

    pt.showTipBox=function(){
        $('#coupon－tip-box').addClass('show');
    };

    pt.hideTipBox=function(){
        $('#coupon－tip-box').removeClass('show');
    };

    return ACoupon;
});