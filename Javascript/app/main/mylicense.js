/**
 * Created by mayoi on 2017/09/18.
 */
//驾驶证详情

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
        myslider:'../model/myslider',
        cmylicense:'../controller/c-mylicense'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['cmylicense'],function (cMyLicense) {
    var $wrapper = $('.mylicense-wrapper');
    new cMyLicense($wrapper);
});















