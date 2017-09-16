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
        super: 'app/model/super',
        bscroll: 'libs/bscroll.min',
        swiper: 'libs/swiper.min',
        template: 'libs/template',
        base:'app/model/base',
        confirmbox:'app/model/confirmbox',
        cbusinessdetail:'app/controller/c-businessdetail'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['cbusinessdetail'],function (cBusinessdetail) {
    var $wrapper = $('.businessdetail-wrapper');
    new cBusinessdetail($wrapper);
});