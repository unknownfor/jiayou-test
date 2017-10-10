/**
 * Created by mayoi on 2017/10/09.
 */
//代理服务
requirejs.config({
    baseUrl: window.urlObject.js,
    paths: {
        $:'../../../Javascript/libs/zepto.min',
        event:'../../../Javascript/libs/zepto.event',
        touch:'../../../Javascript/libs/zepto.touch',
        async:'../../../Javascript/libs/async',
        fastclick:'../../../Javascript/libs/fastclick.min',
        wx:'../../../Javascript/libs/jweixin-1.0.0',
        wxconfig:'../../../Javascript/app/model/wxconfig',
        super:'../../../Javascript/app/model/super',
        base:'../../../Javascript/app/model/base',
        cagentservice:'../../../Javascript/app/controller/v2.5/c-agentservice'
    },
    shim: {
        fastclick: {
            output: 'fastclick'
        }
    }
})

define(['cagentservice'],function (cAgentservice) {
    var $wrapper = $('.agentService-wrapper');
    new cAgentservice($wrapper);
});