/**
 * Created by mayoi on 2017/09/19.
 */
//选择汽车年份


define(['base','wx'],function (BaseClass,wx) {
    function carYear($wrapper) {

        BaseClass.call(this,$wrapper);

        var that=this;
    };

    carYear.prototype=new BaseClass();
    carYear.constructor=carYear;

    var pt=carYear.prototype;


    return carYear;
});