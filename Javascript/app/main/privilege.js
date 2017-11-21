/**
 * Created by mayoi on 2017/09/29.
 */
requirejs.config({
    baseUrl: window.urlObject.js,
    paths: {
        $:'../../../Javascript/libs/zepto.min',
        fastclick:'../../../Javascript/libs/fastclick.min',
        wx:'../../../Javascript/libs/jweixin-1.0.0',
        super:'../../../Javascript/app/model/super',
        base:'../../../Javascript/app/model/base',
        async:'../../../Javascript/libs/async',
        baidumap:'../../../Javascript/app/model/baidumap',
        template: '../../../Javascript/libs/template',
        cprivilege:'../../../Javascript/app/controller/c-privilege'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
});

define(['cprivilege'],function (cPrivilege) {
    var $wrapper = $('.privilege-wrapper');
    new cPrivilege($wrapper);
});