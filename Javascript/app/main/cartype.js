/**
 * Created by mayoi on 2017/09/18.
 */
//选择汽车型号

requirejs.config({
    // baseUrl: window.urlObject.js,
    paths: {
        // $:'libs/zepto.min',
        // touch:'libs/zepto.event.touch',
        // async:'libs/async',
        // fastclick:'libs/fastclick.min',
        // wx:'libs/jweixin-1.0.0',
        // wxconfig:'app/model/wxconfig',
        // super:'app/model/super',
        // base:'app/model/base',
        // ccarinfo:'app/controller/c-carinfo'
        $:'../../libs/zepto.min',
        touch:'../../libs/zepto.event.touch',
        async:'../../libs/async',
        fastclick:'../../libs/fastclick.min',
        wx:'../../libs/jweixin-1.0.0',
        wxconfig:'../model/wxconfig',
        super:'../model/super',
        base:'../model/base',
        ccartype:'../controller/c-cartype'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['ccartype'],function (cCarType) {
    var $wrapper = $('.cartype-wrapper');
    new cCarType($wrapper);
});















