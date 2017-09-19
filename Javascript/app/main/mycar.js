/**
 * Created by mayoi on 2017/09/18.
 */
//爱车管理
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
        cmycar:'../controller/c-mycar'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['cmycar'],function (cMyCar) {
    var $wrapper = $('.mycar-wrapper');
    new cMyCar($wrapper);
});