/**
 * Created by Jimmy on 2017/07/28.
 */
//我的邀请

define(['base','wx'],function (BaseClass,wx) {
    function Invitation($wrapper) {
        BaseClass.call(this,$wrapper);

        this.getOrderListInfo();  //我的订单列表

    };

    Invitation.prototype=new BaseClass();
    Invitation.constructor=Invitation;

    var pt=Invitation.prototype;

    /*获取我的订单列表*/
    pt.getOrderListInfo=function(){
        this.ctrlLoadingIcon();
        var that=this,
            param={
                page:1,
                pageSize:4000
            },
            url='/v1/invitation',
            options={
                errorCallback:function(res){
                    that.ctrlLoadingIcon(false);
                    that.showTips({txt:'获取邀请信息失败'});
                }
            };
        this.getDataAsync(url,param,$.proxy(this,'getInvitationSuccess'),options);
        //var url=window.urlObject.json +'invitation.json';
        //$.getJSON(url,{},$.proxy(this,'getInvitationSuccess'),options);
    };

    /*获取成功*/
    pt.getInvitationSuccess=function(result){
        this.ctrlLoadingIcon(false);
        var str=this.getListStr(result),
            $main=$('.invitation-main');
        if(str) {
            $('.num-txt').text(result.length);
            $('.invitation-detail-box').html(str);
            $main.show();
        }else{
            $main.hide();
            $('.nodata').show();
        }
    };

    pt.getListStr=function(result){
        var len=result.length,
            str='',
            item;
        for(var i=0;i<len;i++){
            item=result[i];
            str+='<div class="item-box">'+
                    '<div class="left-box">'+
                        '<img src="'+item.from_avatar+'">'+
                    '</div>'+
                    '<div class="middle-box">'+
                        '<div class="name">'+item.from_nickname+' 关注成功</div>'+
                        '<div class="time">'+this.getTimeFromTimestamp(item.addtime,'yyyy-MM-dd hh:mm:ss')+'</div>'+
                    '</div>'+
                    '<div class="right-box">+'+item.increment+'</div>'+
                '</div>';
        }
        return str;
    };

    return Invitation;
});