/**
 * Created by mayoi on 2017/09/18.
 */
//选择车险
requirejs.config({
    // baseUrl: window.urlObject.js,
    paths: {
        // $:'libs/zepto.min',
        // touch:'libs/zepto.event.touch',
        // async:'libs/async',
        // fastclick:'libs/fastclick.min',
        // wx:'libs/jweixin-1.0.0',
        // wxconfig:'app/model/wxconfig',
        // super:'app/model/super',
        // base:'app/model/base',
        // myslider:'app/model/myslider',
        // ccarinfo:'app/controller/c-carinfo'
        $:'../../libs/zepto.min',
        touch:'../../libs/zepto.event.touch',
        async:'../../libs/async',
        fastclick:'../../libs/fastclick.min',
        wx:'../../libs/jweixin-1.0.0',
        wxconfig:'../model/wxconfig',
        super:'../model/super',
        base:'../model/base',
        myslider:'../model/myslider',
        cinsurance:'../controller/c-insurance'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['cinsurance'],function (cInsurance) {
    var $wrapper = $('.insurance-wrapper');
    new cInsurance($wrapper);
});