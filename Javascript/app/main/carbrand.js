/**
 * Created by mayoi on 2017/10/10.
 */
//车型
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
        city:'../model/LArea.min',
        cityD:'../model/LAreaData1',
        ccarbrand:'../controller/c-carbrand'
    },
    shim: {
        fastclick: {
            output: 'fastclick'

        }
    }
})

define(['ccarbrand'],function (cCarbrand) {
    var $wrapper = $('.carbrand-wrapper');
    new cCarbrand($wrapper);
});