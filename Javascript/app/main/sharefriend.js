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
        wx:'libs/jweixin-1.0.0',
        wxconfig:'app/model/wxconfig',
        super:'app/model/super',
        base:'app/model/base',
        csharefriend:'app/controller/c-friend'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['csharefriend'],function (cShareUser) {
    var $wrapper = $('.share-friends-wrapper');
    new cShareUser($wrapper);
});