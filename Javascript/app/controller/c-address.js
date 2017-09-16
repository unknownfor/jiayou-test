/**
 * Created by Jimmy on 2017/07/29.
 */
//绑定手机

define(['base','confirmbox'],function (BaseClass,Confirmbox) {
    function Address($wrapper) {
        BaseClass.call(this,$wrapper);

        this.getAddress();

        this.getDataAsync('/v1/random_coupon',{},function(res){
            res;
        },{openId:true,type:'post'});

        // 添加新的地址
        $(document).on(this.eventName,'#new-address-btn',$.proxy(this,'addNewAddressInput'));

        // 新的地址
        $(document).on('focus','#new-address-li input',$.proxy(this,'newAddressInputFocus'));
        $(document).on('blur','#new-address-li input',$.proxy(this,'newAddressInputBlur'));

        // 删除地址
        $(document).on(this.eventName,'.delete-box',$.proxy(this,'showDeleteBox'));

        //提交保存
        $(document).on('blur','#address-ul li.normal input',$.proxy(this,'update'));
    };

    Address.prototype=new BaseClass();
    Address.constructor=Address;

    var pt=Address.prototype;

    // 真正添加新的地址
    pt.execAddNewAddress=function(){
        var that=this,
            param={
                mobile:$('#mobile').val()
            },
            options={
                openId:true,
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

    /*获取地址信息*/
    pt.getAddress=function(){
        var that=this,
            param={

            },
            options={
                openId:true,
                type:'post',
                errorCallback:function(){
                    that.showTips({txt:'地址信息加载失败'});
                }
            };

        var url = window.urlObject.json + 'address.json';
        $.getJSON(url, null, $.proxy(this, 'getAddressSuccess'));
        //this.getDataAsync('/v1/sms',param,$.proxy(this,'getAddressSuccess'),options);
    };

    pt.getAddressSuccess=function(result){
        var len=result.length,
            str='',
            item;
        for(var i=0;i<len;i++) {
            item = result[i];
            str+='<li data-id="'+item.id+'" class="normal">'+
                    '<input type="text" class="normal-input" placeholder="点击编辑" value="'+item.address+'"/>'+
                    '<div class="delete-box">'+
                        '<span class="iconfont icon-delete8e"></span>'+
                    '</div>'+
                '</li>';
        }
        $('#new-address-li').before(str);
    };


    /*添加地址输入框*/
    pt.addNewAddressInput=function(){
        var $li=$('#new-address-li');
        if(!$li.hasClass("hide")){
            $li.addClass('alert');
            //this.showTips({txt:'请输入地址信息'});
        }else{
            $li.addClass('show').removeClass("hide");
        }
    };

    pt.newAddressInputFocus=function(){
        $('#new-address-li').removeClass('alert');
    };

    pt.newAddressInputBlur=function(){
        var $target=$('#new-address-li input'),
            val=$target.val(),
            len=val.length;
        if(len>0){
            if(val.length<8) {
                this.showTips({txt: '请填写详细地址信息'});
            }else{
                this.execUpdate(val);
            }
        }
    };

    /*
    *显示删除提示框
    */
    pt.showDeleteBox=function(e){
        var that=this,
            $li=this.getTargetByEvent(e).closest('li');
        if(!this.confirmBox) {
            var options={
                okCallback:$.proxy(that,'execDelete')
            }
            this.confirmBox = new Confirmbox(options);
            this.confirmBox.init();
        }
        this.confirmBox.showBox();
        $li.addClass('deleting').siblings().removeClass('deleting');  //给当前准备删除的元素加上标志
    };

    pt.execDelete=function(){
        var $li=$('#address-ul li.deleting');
        if($li[0].id=='new-address-li'){
            $li.removeClass('show deleting').addClass('hide');
        }else {
            $li.remove();
        }
    };

    /*更新*/
    pt.update=function(e){
        var $target=this.getTargetByEvent(e),
            val=$target.val();
        if(val.length<8){
            this.showTips({txt:'请填写详细地址信息'})
        }else{
            this.execUpdate(val);
        }
    };

    /*获取我的信息*/
    pt.execUpdate=function(val,id){
        //this.ctrlLoadingIcon();
        var that=this,
            param={
                val:val
            },
            options={
                type:'post',
                openId:true,
                errorCallback:function(res){
                    //that.ctrlLoadingIcon(false);
                    that.showTips({txt:'数据更新失败'});
                }
            };
        if(id){
            param.id=id;
        }
        //this.getDataAsync('/v1/phone',param,$.proxy(this,'updateSCallback'),options);
        this.updateSCallback();
    };


    pt.updateSCallback=function(res){

    };

    return Address;
});