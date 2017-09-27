/**
 * Created by mayoi on 2017/07/29.
 */
//添加行驶证

define(['base','wx'],function (BaseClass,wx) {
    function carLicense($wrapper) {
        BaseClass.call(this,$wrapper);

        //记录旧信息
        // this.oldInfo={
        //     avatar_front:'',
        //     avatar_back:''
        // };


        //查询行驶证
        // this.getLicenseInfo();


        //驾驶证正面上传
        $(document).on('change','#front',$.proxy(this,'upLoadFrontImg'));
        //驾驶证反面上传
        $(document).on('change','#back',$.proxy(this,'upLoadBackImg'));

    };

    carLicense.prototype=new BaseClass();
    carLicense.constructor=carLicense;

    var pt=carLicense.prototype;

    /*获取我的行驶证*/
    //http://xx.com/v2/XX
    pt.getLicenseInfo=function(){
        this.ctrlLoadingIcon();
        var param={},
            url='/v2/vehicle_licence',
            options={
                errorCallback:$.proxy(this,'getInfoError')
            };
        this.getDataAsync(url,param,$.proxy(this,'getInfoSuccess'),options);
    };


    /*获取成功*/
    pt.getInfoSuccess=function(data){
        this.ctrlLoadingIcon(false);
        $('#avatar-front').attr('src',data.front_avatar);
        $('#avatar-back').attr('src',data.back_avatar);
        this.oldInfo.front_avatar=data.front_avatar; //记录旧的信息，不修改则不提交
        this.oldInfo.back_avatar=data.back_avatar;
    };


    /*获取失败*/
    pt.getInfoError=function(result){
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
            // if(type=='avatar_front') {
            //     that.oldInfo.avatar_front = val;
            // }else if(type=='avatar_back'){
            //     that.oldInfo.avatar_back = val;
            //     //记录旧的信息，不修改则不提交
            // }
            // else{
                callback && callback();
            // }
        },options);
    };

    //上传图片
    pt.upLoadFrontImg=function(){
        this.ctrlLoadingIcon();
        this.ctrlCoverStatus();
        var fd = new FormData(),
            that=this;
        fd.append("image", $("#avatar-front")[0].files[0]);
        $.ajax({
            //http://xx.com/v2/vehicle_license_front_uploads
            url: window.urlObject.apiUrl+ '/v2/vehicle_license_front_uploads',
            type: "POST",
            processData: false,
            contentType: false,
            data: fd,
            complete:function(xmlRequest, status){
                $('#avatar-front')[0].reset();
                if (status == 'success') {
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
        });
    };

    pt.upLoadBackImg=function(){
        this.ctrlLoadingIcon();
        this.ctrlCoverStatus();
        var fd = new FormData(),
            that=this;
        fd.append("image", $("#avatar-back")[0].files[0]);
        $.ajax({
            //http://xx.com/v2/vehicle_license_back_uploads
            url: window.urlObject.apiUrl+ '/v2/vehicle_license_back_uploads',
            type: "POST",
            processData: false,
            contentType: false,
            data: fd,
            complete:function(xmlRequest, status){
                $('#avatar-back')[0].reset();
                if (status == 'success') {
                    if(xmlRequest.responseText) {
                        var str='',
                            res = JSON.parse(xmlRequest.responseText);
                        pt.update('avatar',res.url,function(){
                            that.ctrlLoadingIcon(false);
                            that.ctrlCoverStatus(false);
                            var str='<img class="avatar-img" id="avatar-back" src="'+ res.url +'" />';
                            $('.box-back-info').addClass('hide');
                            return str;
                        });
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
                $('license-box').after(str);
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

    return carLicense;
});