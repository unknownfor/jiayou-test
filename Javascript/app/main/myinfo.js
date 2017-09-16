/**
 * Created by Jimmy on 2017/07/20.
 */
//
requirejs.config({
    baseUrl: window.urlObject.js,
    paths: {
        $:'libs/zepto.min',
        form:'libs/zepto.form',
        async:'libs/async',
        fastclick:'libs/fastclick.min',
        wx:'libs/jweixin-1.0.0',
        wxconfig:'app/model/wxconfig',
        super:'app/model/super',
        base:'app/model/base',
        myslider:'app/model/myslider',
        cmyinfo:'app/controller/c-myinfo'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['cmyinfo'],function (cMyInfo) {
    var $wrapper = $('.myinfo-wrapper');
    new cMyInfo($wrapper);
});