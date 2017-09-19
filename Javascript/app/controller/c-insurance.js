/**
 * Created by mayoi on 2017/09/19.
 */


define(['base','wx'],function (BaseClass,wx) {
    function insurance($wrapper) {

        BaseClass.call(this,$wrapper);

        var that=this;
    };

    insurance.prototype=new BaseClass();
    insurance.constructor=Friend;

    var pt=insurance.prototype;


    return insurance;
});