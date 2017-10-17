/**
 * Created by mayoi on 2017/09/18.
 */
//完善车辆信息
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
        // myslider:'app/model/myslider',
        // ccarinfo:'app/controller/c-carinfo'
        $:'../../libs/zepto.min',
        touch:'../../libs/zepto.event.touch',
        async:'../../libs/async',
        fastclick:'../../libs/fastclick.min',
        wx:'../../libs/jweixin-1.0.0',
        wxconfig:'../model/wxconfig',
        super:'../model/super',
        base:'../model/base',
        // lCalendar: '../../libs/lCalendar',
        ccarinfo:'../controller/c-carinfo'
    },
    shim: {
        fastclick: {
            output: 'fastclick'

        }
    }
})

define(['ccarinfo'],function (cCarInfo) {
    var $wrapper = $('.carinfo-wrapper');
    new cCarInfo($wrapper);
});