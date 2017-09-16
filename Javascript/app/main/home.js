/**
 * Created by Jimmy on 2017/07/20.
 */
//
requirejs.config({
    baseUrl: window.urlObject.js,
    paths: {
        $:'libs/zepto.min',
        event:'libs/zepto.event',
        touch:'libs/zepto.touch',
        async:'libs/async',
        fastclick:'libs/fastclick.min',
        wx:'libs/jweixin-1.0.0',
        wxconfig:'app/model/wxconfig',
        super:'app/model/super',
        base:'app/model/base',
        myslider:'app/model/myslider',
        closebox:'app/model/closebox',
        menu:'app/main/menu',
        chome:'app/controller/c-home'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['menu','chome'],function (menu,cHome) {
    var $wrapper = $('.home-wrapper');
    new cHome($wrapper);
    new menu();
});