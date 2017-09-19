/**
 * Created by mayoi on 2017/09/19.
 */
//爱车管理


define(['base','wx'],function (BaseClass,wx) {
    function myCar($wrapper) {

        BaseClass.call(this,$wrapper);

        var that=this;
    };

    myCar.prototype=new BaseClass();
    myCar.constructor=myCar;

    var pt=myCar.prototype;


    return myCar;
});