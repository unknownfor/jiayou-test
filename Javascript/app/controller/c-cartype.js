/**
 * Created by mayoi on 2017/09/19.
 */
//选择汽车型号


define(['base','wx'],function (BaseClass,wx) {
    function carType($wrapper) {

        BaseClass.call(this,$wrapper);

        var that=this;
    };

    carType.prototype=new BaseClass();
    carType.constructor=carType;

    var pt=carType.prototype;


    return carType;
});