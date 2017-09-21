/**
 * Created by mayoi on 2017/09/21.
 */
//选择汽车系列

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
        ccarmodel:'../controller/c-carmodel'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['ccarmodel'],function (cCarModel) {
    var $wrapper = $('.carmodel-wrapper');
    new cCarModel($wrapper);
});















