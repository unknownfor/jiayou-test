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
        confirmbox:'app/model/confirmbox',
        caddress:'app/controller/c-address'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['caddress'],function (cAddress) {
    var $wrapper = $('.address-wrapper');
    new cAddress($wrapper);
});