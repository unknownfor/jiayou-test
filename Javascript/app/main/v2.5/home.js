/**
 * Created by mayoi on 2017/09/27.
 */
//
requirejs.config({
    baseUrl: window.urlObject.js,
    paths: {
        // $:'libs/zepto.min',
        // event:'libs/zepto.event',
        // touch:'libs/zepto.touch',
        // async:'libs/async',
        // fastclick:'libs/fastclick.min',
        // wx:'libs/jweixin-1.0.0',
        // wxconfig:'app/model/wxconfig',
        // super:'app/model/super',
        // base:'app/model/base',
        // menu:'app/main/menu',
        // chome:'app/controller/v2.5/c-home'
        $:'../../../Javascript/libs/zepto.min',
        event:'../../../Javascript/libs/zepto.event',
        touch:'../../../Javascript/libs/zepto.touch',
        async:'../../../Javascript/libs/async',
        fastclick:'../../../Javascript/libs/fastclick.min',
        wx:'../../../Javascript/libs/jweixin-1.0.0',
        wxconfig:'../../../Javascript/app/model/wxconfig',
        super:'../../../Javascript/app/model/super',
        base:'../../../Javascript/app/model/base',
        menu:'../../../Javascript/app/main/menu',
        chome:'../../../Javascript/app/controller/v2.5/c-home'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['menu','chome'],function (menu,cHome) {
    var $wrapper = $('.homev2_5-wrapper');
    new cHome($wrapper);
    new menu();
});