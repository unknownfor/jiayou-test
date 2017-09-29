/**
 * Created by mayoi on 2017/09/29.
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
        cprivilege:'../../../Javascript/app/controller/v2.5/c-privilege'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['cprivilege'],function (cPrivilege) {
    var $wrapper = $('.privilege-wrapper');
    new cPrivilege($wrapper);
});