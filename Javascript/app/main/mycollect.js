/**
 * Created by Jimmy on 2017/07/20.
 */
//
requirejs.config({
    baseUrl: window.urlObject.js,
    paths: {
        $:'libs/zepto.min',
        touch:'libs/zepto.touch',
        form:'libs/zepto.form',
        fastclick:'libs/fastclick.min',
        wx:'libs/jweixin-1.0.0',
        wxconfig:'app/model/wxconfig',
        super:'app/model/super',
        base:'app/model/base',
        myslider:'app/model/myslider',
        slide2del:'libs/slide2del',
        cmycollect:'app/controller/c-mycollect'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['cmycollect'],function (cmyCollect) {
    var $wrapper = $('.myinfo-wrapper');
    new cmyCollect($wrapper);
});