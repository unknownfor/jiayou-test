
/**
 * Created by mayoi on 2017/09/28.
 */
//活动
requirejs.config({
    baseUrl: window.urlObject.js,
    paths: {
        $:'../../../Javascript/libs/zepto.min',
        event:'../../../Javascript/libs/zepto.event',
        touch:'../../../Javascript/libs/zepto.touch',
        async:'../../../Javascript/libs/async',
        fastclick:'../../../Javascript/libs/fastclick.min',
        wx:'../../../Javascript/libs/jweixin-1.0.0',
        wxconfig:'../../../Javascript/app/model/wxconfig',
        super:'../../../Javascript/app/model/super',
        base:'../../../Javascript/app/model/base',
        cactivity:'../../../Javascript/app/controller/v2.5/c-activity'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['cactivity'],function (cActivity) {
    var $wrapper = $('.activity2_5-wrapper');
    new cActivity($wrapper);
});