/**
 * Created by mayoi on 2017/09/18.
 */
//完善车辆信息


define(['base', 'wx'], function (BaseClass,wx) {
    function CarInfo($wrapper) {
        BaseClass.call(this, $wrapper);

        var that=this;
        //禁止页面滚动
        that.scrollControl(false);

        $(document).on(this.eventName,'.icon-help',$.proxy(this,'showTipBox'));

        /*点击灰色部分关闭*/
        $(document).on(this.eventName,'.help-box',function(e){
            that.toHideModuleByClickOutside(e,$.proxy(that,'hideTipBox'));
        });


        /*关闭*/
        $(document).on(this.eventName,'.confirm',$.proxy(that,'hideTipBox'));

        //点击展示全部
        $(document).on(this.eventName,'.load-more',function() {
            //页面恢复滚动
            that.scrollControl(true);
            pt.showOrgInfo();
        });

        //跳转排量选择页面
        $(document).on(this.eventName,'.order-btn',$.proxy(this,'chooseEngineSize'));

    };


    CarInfo.prototype = new BaseClass();
    CarInfo.constructor = CarInfo;

    var pt = CarInfo.prototype;

    pt.showTipBox=function(){
        $('.help-box').addClass('show');
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


    //调用日期选择接口



    return CarInfo;
});