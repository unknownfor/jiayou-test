/**
 * Created by mayoi on 2017/09/19.
 */
//我的车险


define(['base','wx'],function (BaseClass,wx) {
    function myLicense($wrapper) {

        BaseClass.call(this,$wrapper);

        var that=this;

        $(document).on(this.eventName,'.delete',$.proxy(this,'showTipBox'));

        $(document).on(this.eventName,'#no',$.proxy(that,'hideTipBox'));


    };

    myLicense.prototype=new BaseClass();
    myLicense.constructor=myLicense;

    var pt=myLicense.prototype;


    pt.showTipBox=function(){
        $('.delete-box').addClass('show');
    };

    pt.hideTipBox=function(){
        $('.delete-box').removeClass('show');
    };

    return myLicense;
});