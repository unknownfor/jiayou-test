/**
 * Created by Jimmy on 2017/07/20.
 */
//
requirejs.config({
    baseUrl: window.urlObject.js,
    paths: {
        $:'libs/zepto.min',
        fastclick:'libs/fastclick.min',
        super:'app/model/super',
        base:'app/model/base',
        wx:'libs/jweixin-1.0.0',
        chomedelivery:'app/controller/c-homedelivery'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['chomedelivery'],function (cHomeDelivery) {
    var $wrapper = $('.home-delivery-wrapper');
    new cHomeDelivery($wrapper);
});