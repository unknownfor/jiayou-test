/**
 * Created by Jimmy on 2017/07/29.
 */
//送货上门

define(['base'],function (BaseClass) {
    function HomeDelivery($wrapper) {
        BaseClass.call(this,$wrapper);

        /*提交送货信息*/
        $(document).on(this.eventName,'#save-btn',$.proxy(this,'saveDeliveryInfo'));

        $(document).on('input','.home-delivery-main .normal-input',$.proxy(this,'ctrlBtnStatus'))

    };

    HomeDelivery.prototype=new BaseClass();
    HomeDelivery.constructor=HomeDelivery;

    var pt=HomeDelivery.prototype;

    /*保存送货地址*/
    pt.saveDeliveryInfo=function(){
        this.ctrlLoadingIcon();
        var that=this,
            param={
                id:this.$wrapper.attr('data-id')
            },
            url='/v1/invitation',
            options={
                openId:true,
                errorCallback:function(){
                    that.ctrlLoadingIcon(false);
                    that.showTips({txt:'信息保存失败'});
                }
            };
        //this.getDataAsync(url,param,$.proxy(this,'saveDeliveryInfoSuccess'),options);
        var url=window.urlObject.json +'coupondetail.json';
        $.getJSON(url,{},$.proxy(this,'saveDeliveryInfoSuccess'),options);
    };
    /*获取成功*/
    pt.saveDeliveryInfoSuccess=function(){
        this.ctrlLoadingIcon(false);
        window.location.href=window.urlObject.ctrl+'/delivery_tips';
    };


    /*送货上门*/
    pt.ctrlBtnStatus=function(){
        var $inputs=$('.home-delivery-main .normal-input'),
            val1=$inputs.eq(0).val(),
            val2=$inputs.eq(1).val(),
            val3=$inputs.eq(2).val(),
            $btn=$('#save-btn'),
            reg = /^1(3|4|5|7|8)\d{9}$/;
        if(val1.length>=2 && reg.test(val2) && val3.length>8){
            $btn.removeClass('disabled');
        }else{
            $btn.addClass('disabled');
        }
    };

    return HomeDelivery;
});