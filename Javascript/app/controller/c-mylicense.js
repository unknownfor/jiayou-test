/**
 * Created by mayoi on 2017/09/19.
 */
define(['base','wx'],function (BaseClass,wx) {
    function myLicense($wrapper) {

        BaseClass.call(this,$wrapper);

        this.getLicenseInfo();

        var that=this;
    };

    myLicense.prototype=new BaseClass();
    myLicense.constructor=myLicense;

    var pt=myLicense.prototype;

    //http://xx.com/v2/vehicle_licence
    /*获取信息*/
    pt.getLicenseInfo=function(){
        this.ctrlLoadingIcon();
        // var param={},
        //     url='/v2/vehicle_licence',
        //     options={
        //         errorCallback:$.proxy(this,'getInfoError')
        //     };
        // this.getDataAsync(url,param,$.proxy(this,'getInfoSuccess'),options);

        var url='../data/license.json';
        $.getJSON(url,null,$.proxy(this,'getInfoSuccess'));
    };



    /*获取成功*/
    pt.getInfoSuccess=function(data){
        this.ctrlLoadingIcon(false);
        this.showLicenseInfo(data);
    };


    pt.showLicenseInfo=function(result){
        if(result.length==0){
            this.showTips({txt:'获取失败，'+result});
            return;
        }else{
            var str=this.getLicenseInfoStr(result);
            $('.mylicense-wrapper').html(str);
        }
    };

    pt.getLicenseInfoStr=function(data){
        var str='',url;
            if( data != '' || data != 'undefined') {
                str = '<div class="info-box">'+
                    '<div class="info-item border">'+
                    '<div class="info-left">姓&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp名：</div>'+
                    '<div class="info-right">'+ data.owner +'</div>'+
                    '</div>'+

                    '<div class="info-item border">'+
                    '<div class="info-left">驾驶证号：</div>'+
                    '<div class="info-right">'+ data.license_plate_number+'</div>'+
                    '</div>'+

                    '<div class="info-item border">'+
                    '<div class="info-left">档案编号：</div>'+
                    '<div class="info-right">'+ data.vehicle_identification_number +'</div>'+
                    '</div>'+

                    '<div class="info-item border">'+
                    '<div class="info-left">准驾车型：</div>'+
                    '<div class="info-right">'+ data.motor_vehicles_types +'</div>'+
                    '</div>'+

                    '<div class="info-item border">'+
                    '<div class="info-left">领证日期：</div>'+
                    '<div class="info-right">'+ data.opening_date + '</div>'+
                    '</div>'+

                    '<div class="info-item border">'+
                    '<div class="info-left">有效期至：</div>'+
                    '<div class="info-right">'+ data.registration_date + '</div>'+
                    '</div>'+

                    '<div class="info-item border">'+
                    '<div class="info-left">证件状态：</div>'+
                    '<div class="info-right">正常</div>'+
                    '</div>'+

                    '<div class="info-item border">'+
                    '<div class="info-left">累计扣分：</div>'+
                    '<div class="info-right">'+ data.brand_model +'</div>'+
                    '</div>'+

                    '<div class="save-btn">'+
                    '<a href="__CTRL__/checklicense" ><span>重新查询</span></a>'+
                '</div>'+

                '</div>';
            }
        return str;
    };




    return myLicense;
});