/**
 * Created by mayoi on 2017/09/18.
 */
//驾驶证查询


define(['base', 'wx'], function (BaseClass,wx) {
    function checkLicense($wrapper) {
        BaseClass.call(this, $wrapper);

        var that=this;
        //禁止页面滚动
        that.scrollControl(false);

        $(document).on(this.eventName,'#jiashi',$.proxy(this,'showJiaTipBox'));
        $(document).on(this.eventName,'#dangan',$.proxy(this,'showDangTipBox'));

        /*点击灰色部分关闭*/
        $(document).on(this.eventName,'.help-box',function(e){
            that.toHideModuleByClickOutside(e,$.proxy(that,'hideTipBox'));
        });


        /*关闭*/
        $(document).on(this.eventName,'.confirm',$.proxy(that,'hideTipBox'));

        //点击加载更多
        $(document).on(this.eventName,'.load-more',function() {
            //页面恢复滚动
            that.scrollControl(true);
            pt.showOrgInfo();
        });
    };


    checkLicense.prototype = new BaseClass();
    checkLicense.constructor = checkLicense;

    var pt = checkLicense.prototype;


    pt.showJiaTipBox=function(){
        $('.jiashi-box').addClass('show');
    };
    pt.showDangTipBox=function(){
        $('.dangan-box').addClass('show');
    };


    pt.hideTipBox=function(){
        $('.help-box').removeClass('show');
    };

    pt.showOrgInfo=function() {
        var box=$('.info-item'),
            title=$('.title'),
            btn=$('.load-box');
        box.removeClass('none');
        title.removeClass('none');
        btn.addClass('none');
    };


    return checkLicense;
});