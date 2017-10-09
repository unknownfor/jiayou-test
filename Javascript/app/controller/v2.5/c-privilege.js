/**
 * 会员特权
 * Created by mayoi on 2017/09/27.
 */

//获得token，取得数据

define(['base','wx'],function (BaseClass,wx) {
    function Privilege($wrapper) {

        BaseClass.call(this,$wrapper);

        this.getPrivilegeInfo();
    }

    Privilege.prototype=new BaseClass();
    Privilege.constructor=Privilege;

    var pt=Privilege.prototype;

    /*获取信息*/
    pt.getPrivilegeInfo=function(){
        this.ctrlLoadingIcon();
        var url='../../data/privilege.json';
        $.getJSON(url,null,$.proxy(this,'getInfoSuccess'));
    };


    /*获取成功*/
    pt.getInfoSuccess=function(data){
        this.ctrlLoadingIcon(false);
        // 隐藏等待
        $('.privilege-wrapper').removeClass('hide');
        this.hideCoverBox();
        // 隐藏菜单蒙板，
        this.showPrivilegeInfo(data);
    };


    pt.showPrivilegeInfo =function (data) {
        //如果不是会员
        var    str = ' <div class="info-item">' +
                '    <div class="info-head"></div>' +
                '    <img class="info-bg" src="../../Content/images/privilege/banner.png">' +
                '    <div class="info-container">' +
                '        <div class="info-title">' +
                '            <span class="line"></span>' +
                '            <span class="txt">特权会员省钱计算器</span>' +
                '            <span class="line"></span>' +
                '        </div>' +
                '        <ul class="item-box">' +
                '            <li>' +
                '                <img src="../../Content/images/privilege/1.png" />' +
                '            </li>' +
                '            <li>' +
                '                <img src="../../Content/images/privilege/2.png" />' +
                '            </li>' +
                '            <li>' +
                '                <img src="../../Content/images/privilege/3.png" />' +
                '            </li>' +
                '            <li>' +
                '                <img src="../../Content/images/privilege/4.png" />' +
                '            </li>' +
                '            <li>' +
                '                <img src="../../Content/images/privilege/5.png" />' +
                '            </li>' +
                '            <li>' +
                '                <img src="../../Content/images/privilege/6.png" />' +
                '            </li>' +
                '            <li>' +
                '                <img src="../../Content/images/privilege/7.png" />' +
                '            </li>' +
                '            <li>' +
                '                <img src="../../Content/images/privilege/8.png" />' +
                '            </li>' +
                '        </ul>' +
                this.judgeMemberRight(data) +
                '</div>' +
                '</div>';
        $('.privilege-wrapper').html(str);
    };


    //判断是否为会员
    pt.judgeMemberRight = function(status) {
        var str = '',
            url;
        url = window.urlObject.ctrl;
        if(status.status == false ) {
            str =      '<div class="join-btn">'+
                '<a href="'+ url +'/buyPrivilege">'+
                '<div>成为会员</div>'+
                '</a>'+
                '</div>' ;
        }else {
            if(status.status == true){
                str =      '<div class="join-btn" >'+
                    '<a href="javascript:void(0)">'+
                    '<div style="background-color: #a5a5a5">您已是会员</div>'+
                    '</a>'+
                    '</div>' ;
            }
        }
        return str;
    };





    return Privilege;
});