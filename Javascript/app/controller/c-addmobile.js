/**
 * Created by Jimmy on 2017/07/29.
 */
//绑定手机

define(['base','closebox'],function (BaseClass,CloseBox) {
    function AddMobile($wrapper) {
        BaseClass.call(this,$wrapper);

        this.countdown = 60;
        this.timer=null;
        this.mobile=this.$wrapper.attr('data-mobile');

        //手机号判断
        $(document).on('input','#mobile',$.proxy(this,'mobileInput'));

        //验证码判断
        $(document).on('input','#code',$.proxy(this,'codeInput'));

        //获取手机验证码
        $(document).on(this.eventName,'#get-code',$.proxy(this,'getCode'));

        //提交保存
        $(document).on(this.eventName,'#save',$.proxy(this,'update'));
    };

    AddMobile.prototype=new BaseClass();
    AddMobile.constructor=AddMobile;

    var pt=AddMobile.prototype;

    /*手机判断*/
    pt.mobileInput=function(){
        var mobile=$('#mobile').val(),
            reg = /^1(3|4|5|7|8)\d{9}$/,
            $btn=$('#get-code');
        if(mobile!='') {
            if (reg.test(mobile) && $btn.text()=='获取验证码') {
                $btn.removeClass('disabled');
            }else{
                $btn.addClass('disabled');
            }
        }
    };

    /*获取验证码*/
    pt.getCode=function(){
        var val=$('#mobile').val();
        if(val==this.mobile){
            this.showTips({txt:'新手机号不能和旧手机号相同'});
            return;
        }
        var that=this,
            param={
                mobile:$('#mobile').val()
            },
            options={
                type:'post',
                errorCallback:$.proxy(this,'getCodeError')
            };

        this.timer = window.setInterval(function () {
            that.setGetCodeBtn();
        }, 1000);

        //请求验证码
        if(this.countdown==60) {
            this.getDataAsync('/v1/sms',param,$.proxy(this,'getCodeSuccess'),options);
            //this.getCodeSuccess();
        }
    };

    /*设置获取验证码倒计时信息*/
    pt.setGetCodeBtn=function(){
        var $btn=$('#get-code');
        if (this.countdown == 0) {
            $btn.removeClass("disabled");
            $btn.text("获取验证码");
            this.countdown = 60;
            clearInterval(this.timer);
            return;
        } else {
            $btn.addClass("disabled");
            $btn.text(" " + this.countdown + " s");
            this.countdown--;
        }
    };

    pt.getCodeSuccess=function(res){
        this.showTips({txt:'验证码发送成功'});

    };

    pt.getCodeError=function(res){
        this.showTips({txt:res.msg});
        this.countdown = 0;
        this.setGetCodeBtn();
    };

    /*验证码输入框*/
    pt.codeInput=function(){
       var code=$('#code').val(),
           reg = /^\d{6}$/,
           mobile=$('#mobile').val(),
           reg1 = /^1(3|4|5|7|8)\d{9}$/,
           $btn=$('#save');
        if(code!='') {
            if (reg.test(code) &&  reg1.test(mobile)){
                $btn.removeClass('disabled');
            }else{
                $btn.addClass('disabled');
            }
        }
    };

    /*获取我的信息*/
    pt.update=function(){
        this.ctrlLoadingIcon();
        var that=this,
            param={
                mobile:$('#mobile').val(),
                code:$('#code').val()
            },
            options={
                type:'post',
                token:true,
                credentials:true,
                errorCallback:function(res){
                    that.ctrlLoadingIcon(false);
                    that.showTips({txt:res.msg});
                }
            };
        this.getDataAsync('/v1/phone',param,$.proxy(this,'updateSCallback'),options);
        //this.updateSCallback();
    };


    pt.updateSCallback=function(res){
        this.ctrlLoadingIcon(false);
        if(!this.closeBox) {
            var options={
                callback:function(){
                    window.location.href=window.urlObject.ctrl+'/my';
                }
            }
            this.closeBox = new CloseBox(options);
            this.closeBox.init();
        }
        this.closeBox.showBox({content:'绑定成功'});
    };

    return AddMobile;
});