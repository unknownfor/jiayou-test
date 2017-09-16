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
        baseorderdetail:'app/model/baseorderdetail',
        corderdetail:'app/controller/c-orderdetail'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['corderdetail'],function (cOrderDetail) {
    var $wrapper = $('.order-detail-wrapper');
    new cOrderDetail($wrapper);
});