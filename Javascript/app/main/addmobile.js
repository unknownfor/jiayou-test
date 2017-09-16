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
        super:'app/model/super',
        base:'app/model/base',
        wx:'libs/jweixin-1.0.0',
        closebox:'app/model/closebox',
        caddmobile:'app/controller/c-addmobile'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['caddmobile'],function (cAddMobile) {
    var $wrapper = $('.add-mobile-wrapper');
    new cAddMobile($wrapper);
});