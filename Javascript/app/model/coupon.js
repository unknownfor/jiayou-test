/**
 * Created by Jimmy on 2017/07/29.
 */
//优惠券信息

define(['base'],function (BaseClass) {
    function Coupon(options) {
        var defaultOptions={
            status:1,
            pageSize:40,
            page:1,
            sCallback:null,
            eCallback:function(){
                console.log('优惠券信息加载失败')
            }
        }
        this.options = this.extentConfig(defaultOptions,options);
        this.getMyCouponInfo();  //我的未使用的优惠券

    };

    Coupon.prototype=new BaseClass();
    Coupon.constructor=Coupon;

    var pt=Coupon.prototype;

    /*获取我的优惠券*/
    pt.getMyCouponInfo=function(){
        var param={
                status:this.options.status,
                page:this.options.page,
                pageSize:this.options.pageSize
            },
            url='/v1/user_coupon',
            options={
                errorCallback:$.proxy(this,'getCouponInfoError')
            };
        this.getDataAsync(url,param,$.proxy(this,'getCouponInfoSuccess'),options);
    };

    /*获取成功*/
    pt.getCouponInfoSuccess=function(data){
        this.options.sCallback && this.options.sCallback(data);
    };

    /*获取失败*/
    pt.getCouponInfoError=function(result){
        this.options.eCallback && this.options.eCallback(result);
    };

    return Coupon;
});