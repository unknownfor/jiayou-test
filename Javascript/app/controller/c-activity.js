/**
 * Created by Jimmy on 2017/07/29.
 */
//可用优惠券信息

define(['base','wx','wxconfig'],function (BaseClass,wx,Wxconfig) {
    function Activity($wrapper) {
        BaseClass.call(this,$wrapper);

        //this.getMyCouponInfo();  //我的未使用的优惠券

        //优惠券选择
        //$(document).on('input','#gun-input',$.proxy(this,'gunInput'));
        //
        ////充值金额
        //$(document).on('input','#amount-input',$.proxy(this,'amountInput'));
        //
        ////选择常用金额
        //$(document).on('click','.common-amount-box>div',$.proxy(this,'selectCommonAccount'));
        //
        ////结算
        //$(document).on('click','.order-btn',$.proxy(this,'doActivity'));
        //this.commitOrder();

    };

    Activity.prototype=new BaseClass();
    Activity.constructor=Activity;

    var pt=Activity.prototype;

    /*结算*/
    pt.commitOrder=function(){
        var param = {
                sid:11,
                gun_id:343,
                gun_sn:1,
                amount:1,

            },
            url='/v1/order_commit',
            options={
                type:'post',
                errorCallback:function(res){
                    console.log(res);
                    alert(res);
                }
            };
        alert('order-before');
        this.getDataAsync(url,param,$.proxy(this,'commitOrderSCallback'),options);
        //window.location.href=window.urlObject.ctrl+'/payresult/id/1';
    };

    /*下单成功*/
    pt.commitOrderSCallback=function(result){
        alert('order-ok');
        var jsApiParameters=JSON.parse(result.jsApiParameters);
        alert('jsApiParameters:'+result.jsApiParameters);

        //获取微信登录信息
        var url='/v1/wx_config',
            currentUrl=window.location.href.split('#')[0],
            param={
                current_url:currentUrl
            },
            options={
                token:true,
            };

        this.getDataAsync(url,param,function(data){
            alert('data:'+JSON.stringify(data));
            alert('timestamp:'+jsApiParameters.timeStamp.toString());
            alert('拉起支付，支付前');
            var payOptions={
                wxPayInfo:{
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
            var wxConfig=new Wxconfig(data,payOptions);
        },options);
    };

    return Activity;
});