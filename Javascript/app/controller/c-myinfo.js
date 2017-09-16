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

        this.getMyInfo();  //我的信息

        //this.selectGender();


        //性别选择
        $(document).on('change','#gender-select',$.proxy(this,'selectGender'));

        //昵称
        $(document).on('blur','#nickname',$.proxy(this,'changeNickname'));

        //头像上传
        $(document).on('change','#uploadImgFile',$.proxy(this,'uploadImg'));

    };

    MyInfo.prototype=new BaseClass();
    MyInfo.constructor=MyInfo;

    var pt=MyInfo.prototype;

    /*获取我的信息*/
    pt.getMyInfo=function(){
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
        $('#avatar').attr('src',data.avatar);
        $('#nickname').val(data.nickname);

        var url=window.urlObject.ctrl+'/addmobile';
        if(data.mobile){
            $('#mobile').text(data.mobile).show();
            url=window.urlObject.ctrl+'/unbindmobile/mobile/'+data.mobile;
        }
        $('#mobile').closest('a').attr('href',url);

        $('#gender').text(data.sex);

        var index=data.sex=='男'?0:1;
        $('#gender-select option').eq(index).prop('selected',true);

        this.oldInfo.nickname=data.nickname; //记录旧的信息，不修改则不提交
        this.oldInfo.sex=data.sex;
    };

    /*获取失败*/
    pt.getMyInfoError=function(result){
        this.ctrlLoadingIcon(false);
        this.showTips({txt:'个人信息加载失败'});
    };


    /*性别更新*/
    pt.selectGender=function(){
        var $target=$('#gender-select option:selected'),
            txt=$target.text(),
            val=$target.val();
        $('#gender').text(txt);
        if(val &&  val!=this.oldInfo.sex) {
            pt.update.call(this,'sex', val);
        }
    };

    /*更新昵称*/
    pt.changeNickname=function(){
        var val=$('#nickname').val();
        if(val.length>0 && val!=this.oldInfo.nickname) {
            pt.update.call(this,'nickname', val);
        }
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
            if(type=='sex') {
                that.oldInfo.sex = val;
            }else if(type=='nickname'){
                that.oldInfo.nickname = val; //记录旧的信息，不修改则不提交
            }
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
        fd.append("image", $("#uploadImgFile")[0].files[0]);

        $.ajax({
            url: window.urlObject.apiUrl+ '/v1/oss',
            type: "POST",
            processData: false,
            contentType: false,
            data: fd,
            complete:function(xmlRequest, status){
                $('#upImgForm')[0].reset();
                if (status == 'success') {
                    if(xmlRequest.responseText) {
                        var res = JSON.parse(xmlRequest.responseText);
                        pt.update('avatar',res.url,function(){
                            that.ctrlLoadingIcon(false);
                            that.ctrlCoverStatus(false);
                            $('#avatar').attr('src', res.url);
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
            $('#myinfo-cover-box').show();
        }else{
            $('#myinfo-cover-box').hide();
        }

    }

    return MyInfo;
});