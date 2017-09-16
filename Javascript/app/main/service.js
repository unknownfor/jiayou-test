
requirejs.config({
    baseUrl: window.urlObject.js,
    paths: {
        $:'libs/zepto.min',
        touch:'libs/zepto.event.touch',
        async:'libs/async',
        fastclick:'libs/fastclick.min',
        super:'app/model/super',
        wx:'libs/jweixin-1.0.0',
        wxconfig:'app/model/wxconfig',
        base:'app/model/base',
        myslider:'app/model/myslider',
        closebox:'app/model/closebox',
        menu:'app/main/menu',
        cservice:'app/controller/c-service'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['menu','cservice'],function (menu,cService) {
    var $wrapper = $('.service-wrapper');
    new cService($wrapper);
    new menu();
});