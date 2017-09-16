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
        corderlist:'app/controller/c-orderlist'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['corderlist'],function (cOrderList) {
    var $wrapper = $('.order-list-wrapper');
    new cOrderList($wrapper);
});