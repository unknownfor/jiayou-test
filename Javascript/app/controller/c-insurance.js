/**
 * Created by mayoi on 2017/09/19.
 */


define(['base','wx'],function (BaseClass,wx) {
    function insurance($wrapper) {

        BaseClass.call(this,$wrapper);

        this.getInsuranceInfo();


        var that=this;
    };

    insurance.prototype=new BaseClass();
    insurance.constructor=insurance;

    var pt=insurance.prototype;

    //http://xx.com/v2/car_insurance_companies
    /*获取信息*/
    pt.getInsuranceInfo=function(){
        this.ctrlLoadingIcon();
        // var param={},
        //     url='/v2/car_insurance_companies',
        //     options={
        //         errorCallback:$.proxy(this,'getInfoError')
        //     };
        // this.getDataAsync(url,param,$.proxy(this,'getInfoSuccess'),options);

        var url='../data/insurance.json';
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
        this.showInsuranceInfo(data);
    };


    pt.showInsuranceInfo=function(result){
        if(result.length==0){
            this.showTips({txt:'获取列表失败，'+result});
            return;
        }else{
            var str=this.getInsuranceInfoStr(result);
            $('.info-box').html(str);
        }
    };

    pt.getInsuranceInfoStr=function(data){
        var len=data.length,
            str='',
            item;
        for(var i=0;i<len;i++){
            item=data[i];
            str+=   '<a class="info-item border" href="__CTRL__/myinsurance">' +
                '<div class="info-left">'+
                '<img src="'+ item.company_logo+' " />'+
                '</div>'+
                '<div class="info-middle">'+item.company_name+'</div>'+
                '<span class="iconfont icon-right"></span>'+
                '</a>';
        }
        return str;
    };


    return insurance;
});