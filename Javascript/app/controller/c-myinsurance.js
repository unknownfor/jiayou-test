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
        // var param={},
        //     url='/v2/member_car_insurances/{id}',
        //     options={
        //         errorCallback:$.proxy(this,'getInfoError')
        //     };
        // this.getDataAsync(url,param,$.proxy(this,'getInfoSuccess'),options);

        var url='../data/myinsurance.json';
        $.getJSON(url,null,$.proxy(this,'getInfoSuccess'));
    };

    /*获取失败*/
    pt.getInfoError=function(result){
        this.ctrlLoadingIcon(false);
        this.showTips({txt:'信息加载失败，'+result});
    };

    /*获取成功*/
    pt.getInfoSuccess=function(data){
        this.ctrlLoadingIcon(false);
        this.showMyInsuranceInfo(data);
    };

    pt.showMyInsuranceInfo=function(result){
        if(result.length==0){
            this.showTips({txt:'获取列表失败，'+result});
            return;
            if(result.is_insure= 0) {
                this.showTips({txt:'暂无车险'});
            }
        }else{
            var str=this.getMyInsuranceInfoStr(result);
            $('.head-box').html(str);
        }
    };

    pt.getMyInsuranceInfoStr=function(data){
        var len=data.length,
            str='';
        if(len != 0 || data != null){
            if (data.is_insure = 1){
                str='<img class="head-bg" src="'+ data.company_logo +'" />'+
                '<div class="head-detail">'+
                '<img class="head-img" src="'+ data.company_logo +'" />'+
                '<div class="head-name">'+ data.company_name +'</div>'+
                '<div class="head-info-box">'+
                '<span class="head-info left">'+ data.branch_name +'</span>'+
                '<span class="head-info">'+ data.license_plate +'</span>'+
                '</div>'+
                '</div>'+
                '<div class="delete">'+删除+'</div>';
            }

        }
        return str;
    };

    pt.showTipBox=function(){
        $('.delete-box').addClass('show');
    };
    pt.hideTipBox=function(){
        $('.delete-box').removeClass('show');
    };


    return myInsurance;
});