/**
 * Created by Jimmy on 2017/07/29.
 */
//我的信息

define(['base','wx'],function (BaseClass,wx) {
    function MyInfo($wrapper) {
        BaseClass.call(this,$wrapper);

        //记录旧信息
        this.oldInfo={
            nickname:'',
            sex:''
        };

        this.getLicenseInfo();  //我的信息


        //驾驶证上传
        $(document).on('change','.loadImgBtn',$.proxy(this,'uploadImg'));

    };

    CarLicense.prototype=new BaseClass();
    CarLicense.constructor=CarLicense;

    var pt=CarLicense.prototype;

    /*获取我的信息*/
    pt.getLicenseInfo=function(){
        this.ctrlLoadingIcon();
        var param={},
            url='/v1/user_center',
            options={
                errorCallback:$.proxy(this,'getMyInfoError')
            };
        this.getDataAsync(url,param,$.proxy(this,'getMyInfoSuccess'),options);
    };

    /*获取成功*/
    pt.getMyInfoSuccess=function(data){
        this.ctrlLoadingIcon(false);
        $('.license-img').attr('src',data.avatar);


        //记录旧的信息，不修改则不提交
        this.oldInfo.sex=data.sex;
    };

    /*获取失败*/
    pt.getMyInfoError=function(result){
        this.ctrlLoadingIcon(false);
        this.showTips({txt:'个人信息加载失败'});
    };


    /*更新数据*/
    pt.update=function(type,val,callback){
        var that=this,
            url='/v1/user',
            params={
                type:type
            },
            options={
                type:'put',
                token:true,
                errorCallback:function(res){
                    that.showTips({txt:res.msg});
                }
            };
        params[type]=val;
        this.getDataAsync(url,params,function(res){
            // if(type=='sex') {
            //     that.oldInfo.sex = val;
            // }else if(type=='nickname'){
            //     that.oldInfo.nickname = val;
            //     //记录旧的信息，不修改则不提交
            // }
            else{
                callback && callback();
            }
        },options);
    };

    //上传图片
    pt.uploadImg=function(){
        this.ctrlLoadingIcon();
        this.ctrlCoverStatus();
        var fd = new FormData(),
            that=this;
        fd.append("image", $(".loadImgBtn")[0].files[0]);

        $.ajax({
            url: window.urlObject.apiUrl+ '/v1/oss',
            type: "POST",
            processData: false,
            contentType: false,
            data: fd,
            complete:function(xmlRequest, status){
                $('.license-img')[0].reset();
                if (status == 'success') {
                    if(xmlRequest.responseText) {
                        var res = JSON.parse(xmlRequest.responseText);
                        pt.update('avatar',res.url,function(){
                            that.ctrlLoadingIcon(false);
                            that.ctrlCoverStatus(false);
                            $('.license-img').attr('src', res.url);
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
            }
        });
    };

    //上传图片时间较长，防止再次提交
    pt.ctrlCoverStatus=function(flag){
        if(flag!==false) {
            $('#carlicense-cover-box').show();
        }else{
            $('#carlicense-cover-box').hide();
        }
    };

    return CarLicense;
});