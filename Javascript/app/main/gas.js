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
        cgas:'app/controller/c-gas'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['cgas'],function (cGas) {
    var $wrapper = $('.gas-wrapper');
    new cGas($wrapper);
});