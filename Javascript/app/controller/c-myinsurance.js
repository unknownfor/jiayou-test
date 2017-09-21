/**
 * Created by mayoi on 2017/09/19.
 */
//我的车险

define(['base','wx'],function (BaseClass,wx) {
    function myInsurance($wrapper) {

        BaseClass.call(this,$wrapper);

        this.getMyInsuranceInfo();

        var that=this;
    };

    myInsurance.prototype=new BaseClass();
    myInsurance.constructor=myInsurance;

    var pt=myInsurance.prototype;



    pt.getMyInsuranceInfo=function() {
        var url='../data/myinsurance.json';
        $.getJSON(url,null,$.proxy(this,'getInfoSuccess'));
    };



    pt.getInfoSuccess=function(data) {
        window.console = window.console || {};
        console.log || (console.log = opera.postError);
    };



    return myInsurance;

});