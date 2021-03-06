/**
 * Created by Jimmy on 2017/07/20.
 */
//
requirejs.config({
    baseUrl: window.urlObject.js,
    paths: {
        $:'libs/zepto.min',
        touch:'libs/zepto.event.touch',
        async:'libs/async',
        fastclick:'libs/fastclick.min',
        wx:'libs/jweixin-1.0.0',
        wxconfig:'app/model/wxconfig',
        super:'app/model/super',
        base:'app/model/base',
        myslider:'app/model/myslider',
        menu:'app/main/menu',
        cmy:'app/controller/c-my'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['menu','cmy'],function (menu,cMy) {
    var $wrapper = $('.my-wrapper');
    new cMy($wrapper);
    new menu();
});