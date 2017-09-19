/**
 * Created by mayoi on 2017/09/19.
 */


define(['base','wx'],function (BaseClass,wx) {
    function myLicense($wrapper) {

        BaseClass.call(this,$wrapper);

        var that=this;
    };

    myLicense.prototype=new BaseClass();
    myLicense.constructor=Friend;

    var pt=myLicense.prototype;


    return myLicense;
});