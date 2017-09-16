/**
 * Created by ssf on 2017/09/16.
 */

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
        ccoupondetail:'app/controller/c-orderconfirm'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['corderconfirm'],function (cOrderconfirm) {
    var $wrapper = $('.order-wrapper');
    new cOrderconfirm($wrapper);
});