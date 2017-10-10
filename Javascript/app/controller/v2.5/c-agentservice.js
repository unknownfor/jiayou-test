/**
 * Created by mayoi on 2017/10/10.
 */
//代理服务
define(['base','wx'],function (BaseClass,wx) {
    function agentService($wrapper) {

        BaseClass.call(this,$wrapper);

        //检查数据是否输入
        $(document).on('input', '.phone', function(){
            //页面禁止滚动
            that.scrollControl(true);
            //校准车牌号
            pt.checkInfo();
        });

        //驾驶证正面上传
        $(document).on('change','#front',$.proxy(this,'upLoadFrontImg'));
        //驾驶证反面上传
        $(document).on('change','#back',$.proxy(this,'upLoadBackImg'));


        $(document).on(this.eventName,'.save-btn.active',$.proxy(that,'putAgentServiceInfo'));

    };


    agentService.prototype=new BaseClass();
    agentService.constructor=agentService;

    var pt=agentService.prototype;


    //检查数据是否有输入
    pt.checkInfo = function (){
        var name=$('.name').val(),
            phone=$('.phone').val(),
            reg = /^1(3|4|5|7|8)\d{9}$/,
            $btn=$('.save');
        if(name != '') {
            if (reg.test(phone)) {
                $btn.removeClass('nouse').addClass('active');
            } else {
                $btn.addClass('nouse').removeClass('active');
            }
        }else {
            $btn.addClass('nouse').removeClass('active');
        }
    };


    //上传图片
    pt.upLoadFrontImg=function(){
        this.ctrlLoadingIcon();
        this.ctrlCoverStatus();
        var fd = new FormData(),
            that=this;
        fd.append("image", $("#front")[0].files[0]);
        $.ajax({
            //http://xx.com/v2/vehicle_license_front_uploads
            url: window.urlObject.apiUrl+ '/v2/vehicle_license_front_uploads',
            type: "POST",
            processData: false,
            contentType: false,
            data: fd,
            complete:function(xmlRequest, status){
                $('#front')[0].reset();
                if (code == 201) {
                    if(xmlRequest.responseText) {
                        var str='',
                            res = JSON.parse(xmlRequest.responseText);
                        pt.update('avatar',res.url,function(){
                            that.ctrlLoadingIcon(false);
                            that.ctrlCoverStatus(false);
                            var str='<img class="avatar-img" id="avatar-front" src="'+ res.url +'" />';
                            $('.box-front-info').addClass('hide');
                            return str;
                        });
                    }
                }
                //超时
                else if (status == 'timeout') {
                    that.ctrlLoadingIcon(false);
                    that.showTips({txt:'请求超时，请稍后重试'})
                }
                else{
                    that.ctrlLoadingIcon(false);
                    that.showTips({txt:'操作失败'});
                }
                $('license-box').after(str);
            }
        })
    };

    pt.upLoadBackImg=function(){
        this.ctrlLoadingIcon();
        this.ctrlCoverStatus();
        var fd = new FormData(),
            that=this;
        fd.append("image", $("#back")[0].files[0]);
        $.ajax({
            //http://xx.com/v2/vehicle_license_back_uploads
            url: window.urlObject.apiUrl+ '/v2/vehicle_license_back_uploads',
            type: "POST",
            processData: false,
            contentType: false,
            data: fd,
            complete:function(xmlRequest, status) {
                $('#back')[0].reset();
                if (status == 'success') {
                    if (xmlRequest.responseText) {
                        var str = '',
                            res = JSON.parse(xmlRequest.responseText);
                        pt.update('avatar', res.url, function () {
                            that.ctrlLoadingIcon(false);
                            that.ctrlCoverStatus(false);
                            var str = '<img class="avatar-img" id="avatar-back" src="' + res.url + '" />';
                            $('.box-back-info').addClass('hide');
                            return str;
                        });
                    }
                    //超时
                    else if (status == 'timeout') {
                        that.ctrlLoadingIcon(false);
                        that.showTips({txt: '请求超时，请稍后重试'})
                    }
                    else {
                        that.ctrlLoadingIcon(false);
                        that.showTips({txt: '操作失败'});
                    }
                }
                $('license-box').after(str);
            }
        })
    };


    //上传图片时间较长，防止再次提交
    pt.ctrlCoverStatus=function(flag){
        if(flag!==false) {
            $('#agentService-cover-box').show();
        }else{
            $('#agentService-cover-box').hide();
        }
    };


    //提交数据
    pt.putAgentServiceInfo = function () {

    };


    return agentService;

});
