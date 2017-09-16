
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
        ctype:'app/controller/c-type'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['menu','ctype'],function (menu,cType) {
    var $wrapper = $('.type-wrapper');
    new cType($wrapper);
    new menu();
});