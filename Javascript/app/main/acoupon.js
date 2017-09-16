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
        super:'app/model/super',
        base:'app/model/base',
        coupon:'app/model/coupon',
        cacoupon:'app/controller/c-acoupon'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['cacoupon'],function (cACoupon) {
    var $wrapper = $('.available-coupon-wrapper');
    new cACoupon($wrapper);
});