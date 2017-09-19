/**
 * Created by mayoi on 2017/09/19.
 */
//选择汽车排气量


define(['base','wx'],function (BaseClass,wx) {
    function engineSize($wrapper) {

        BaseClass.call(this,$wrapper);

        var that=this;
    };

    engineSize.prototype=new BaseClass();
    engineSize.constructor=engineSize;

    var pt=engineSize.prototype;


    return engineSize;
});