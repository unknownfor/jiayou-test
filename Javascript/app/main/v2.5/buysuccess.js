/**
 * Created by mayoi on 2017/10/09.
 */
//支付成功
requirejs.config({
    baseUrl: window.urlObject.js,
    paths: {
        $:'../../../Javascript/libs/zepto.min',
        event:'../../../Javascript/libs/zepto.event',
        touch:'../../../Javascript/libs/zepto.touch',
        async:'../../../Javascript/libs/async',
        fastclick:'../../../Javascript/libs/fastclick.min',
        wx:'../../../Javascript/libs/jweixin-1.0.0',
        wxconfig:'../../../Javascript/app/model/wxconfig',
        super:'../../../Javascript/app/model/super',
        base:'../../../Javascript/app/model/base',
        cbuysuccess:'../../../Javascript/app/controller/v2.5/c-buysuccess'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['cbuysuccess'],function (cBuysuccess) {
    var $wrapper = $('.buySuccess-wrapper');
    new cBuysuccess($wrapper);
});