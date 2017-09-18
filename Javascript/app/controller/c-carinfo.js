/**
 * Created by mayoi on 2017/09/18.
 */
//完善车辆信息


define(['base', 'wx'], function (BaseClass,wx) {
    function CarInfo($wrapper) {
        BaseClass.call(this, $wrapper);



        /*点击灰色部分关闭*/
        $(document).on(this.eventName,'.container',function(e){
            that.toHideModuleByClickOutside(e,$.proxy(that,'hideTipBox'));
        });


        /*关闭*/
        $(document).on(this.eventName,'.confirm',$.proxy(that,'hideTipBox'));

    };


    CarInfo.prototype = new BaseClass();
    CarInfo.constructor = CarInfo;

    var pt = CarInfo.prototype;




    pt.hideTipBox=function(){
        $('#help-box').removeClass('show');
    };



    return CarInfo;
});