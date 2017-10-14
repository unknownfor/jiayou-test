/**
 * Created by mayoi on 2017/10/14.
 */
requirejs.config({
    baseUrl: window.urlObject.js,
    paths: {
        // $:'libs/zepto.min',
        // form:'libs/zepto.form',
        // async:'libs/async',
        // fastclick:'libs/fastclick.min',
        // wx:'libs/jweixin-1.0.0',
        // wxconfig:'app/model/wxconfig',
        // super:'app/model/super',
        // base:'app/model/base',
        // ccity:'app/controller/c-city'
        $:'../../libs/zepto.min',
        touch:'../../libs/zepto.event.touch',
        async:'../../libs/async',
        fastclick:'../../libs/fastclick.min',
        wx:'../../libs/jweixin-1.0.0',
        wxconfig:'../model/wxconfig',
        super:'../model/super',
        base:'../../model/base',
        ccitynew:'../controller/c-citynew'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['ccitynew'],function (cCityNew) {
    var $wrapper = $('.citynew-wrapper');
    new cCityNew($wrapper);
});