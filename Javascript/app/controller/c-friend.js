/**
 * 分享页
 * 基本逻辑：
 * 1.进入页面，使用后台绑定过来的微信 code, 查询是否为老盆友
 * Created by Jimmy on 2017/07/18.
 */


define(['base','wx','wxconfig'],function (BaseClass,wx,WxConfig) {
    function Friend($wrapper) {

        BaseClass.call(this,$wrapper);

        var that=this,
            code=$wrapper.attr('data-code');

        /*
        * code 只能使用一次，防止使用第二次
        * 有code的情况分两种：
        *   1.第一次进入到页面，
        *   2.经过 n 次返回上一级到达第一次的状态
        *
        */
        this.login(code);
    };

    Friend.prototype=new BaseClass();
    Friend.constructor=Friend;

    var pt=Friend.prototype;


    /*是否为新用户*/
    pt.login=function(code){
        this.ctrlLoadingIcon();
        var url='/v1/login',
            that=this,
            param={
                client:'wechat_official',
                code:code
            },
            options={
                token:false,
                type:'post',
                errorCallback:function(res){
                    that.ctrlLoadingIcon(false);
                    that.showTips({txt:res.msg});
                }
            }
        this.getDataAsync(url,param,$.proxy(this,'getWxConfig'),options);
    };

    pt.getWxConfig=function(data){

        //用户判断，如果是新用户则显示新手礼包
        this.isNewpackage=data.is_newpackage;


        //获取微信登录信息
        var that=this,
            url='/v1/wx_config',
            currentUrl=window.location.href.split('#')[0],
            param={
                current_url:currentUrl
            },
            options={
                errorCallback:function(res){
                    that.ctrlLoadingIcon(false);
                    that.showTips({txt:res.msg});
                }
            }
        this.getDataAsync(url,param,$.proxy(this,'getWxConfigSuccessCallback'),options);


    };

    pt.getWxConfigSuccessCallback=function(data){
        var options={
                shareInfo:true
            };

        var wxConfig=new WxConfig(data,options);
        this.isNewUser();
    };

    pt.isNewUser=function(){
        $('.share-friends-wrapper').addClass('show');
        if(this.isNewpackage==1){
            $('.new-user').show();
        }else{
            $('.old-user').show();
        }
    };
    return Friend;
});