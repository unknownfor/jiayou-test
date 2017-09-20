/**
 * Created by mayoi on 2017/09/19.
 */
//我的车险

define(['base','wx'],function (BaseClass,wx) {
    function myInsurance($wrapper) {

        BaseClass.call(this,$wrapper);

        this.getMyInsuranceInfo();

        var that=this;

        $(document).on(this.eventName,'.delete',$.proxy(this,'showTipBox'));

        $(document).on(this.eventName,'#no',$.proxy(that,'hideTipBox'));


    };

    myInsurance.prototype=new BaseClass();
    myInsurance.constructor=myInsurance;

    var pt=myInsurance.prototype;


    //http://xx.com/v2/member_car_insurances/{id}
    /*获取信息*/
    pt.getMyInsuranceInfo=function(){
        this.ctrlLoadingIcon();

        var url='../data/myinsurance.json';
        $.getJSON(url,null,$.proxy(this,'test'));
    };


    /*获取成功*/
    pt.test=function(data){
        alert('test');
    };


    pt.showTipBox=function(){
        $('.delete-box').addClass('show');
    };
    pt.hideTipBox=function(){
        $('.delete-box').removeClass('show');
    };


    return myInsurance;
});