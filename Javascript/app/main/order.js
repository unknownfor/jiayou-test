/**
 * Created by Jimmy on 2017/07/20.
 */
//
requirejs.config({
    baseUrl: window.urlObject.js,
    paths: {
        $:'libs/zepto.min',
        async:'libs/async',
        fastclick:'libs/fastclick.min',
        wx:'libs/jweixin-1.0.0',
        wxconfig:'app/model/wxconfig',
        super:'app/model/super',
        base:'app/model/base',
        coupon:'app/model/coupon',
        confirmbox:'app/model/confirmbox',
        corder:'app/controller/c-order'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['corder'],function (cOrder) {
    var $wrapper = $('.order-wrapper');
    new cOrder($wrapper);
});