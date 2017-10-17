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
        $:'../../Javascript/libs/zepto.min',
        touch:'../../Javascript/libs/zepto.event.touch',
        async:'../../Javascript/libs/async',
        fastclick:'../../Javascript/libs/fastclick.min',
        wx:'../../Javascript/libs/jweixin-1.0.0',
        wxconfig:'../../Javascript/app/model/wxconfig',
        super:'../../Javascript/app/model/super',
        base:'../../Javascript/app/model/base',
        ccitynew:'../../Javascript/app/controller/c-citynew'
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