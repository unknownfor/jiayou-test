/**
 * Created by mayoi on 2017/09/19.
 */
//爱车管理


define(['base','wx'],function (BaseClass,wx) {
    function myCar($wrapper) {

        BaseClass.call(this,$wrapper);

        var that=this;

        this.getMyCarInfo();
    };

    myCar.prototype=new BaseClass();
    myCar.constructor=myCar;

    var pt=myCar.prototype;


    //http://xx.com/v2/member_cars
    pt.getMyCarInfo=function(){
        this.ctrlLoadingIcon();
        var param={},
            url='/v2/member_cars',
            options={
                errorCallback:$.proxy(this,'getInfoError')
            };
        this.getDataAsync(url,param,$.proxy(this,'getInfoSuccess'),options);
    };



    /*获取失败*/
    pt.getInfoError=function(result){
        this.ctrlLoadingIcon(false);
        this.showTips({txt:'加载失败，'+result});
    };


    /*获取成功*/
    pt.getInfoSuccess=function(data){
        this.ctrlLoadingIcon(false);
        $('.mycar-wrapper').removeClass('hide');
        this.hideCoverBox();// 隐藏菜单蒙板，
        this.getInsuranceInfo(data);
        this.getLicenseInfo(data);
    };



    pt.getCarInfo = function (data) {
        var str = '',
            str1 = '',
            url,
            item;
        url = window.urlObject.ctrl;
        if(data.member_car_list.length = 0 ) {
            str = '<div class="car-box">'+
                '<div class="title"><span>我的爱车</span></div>'+
                '<div class="car-add">'+
                '<a class="car-add-box" href="'+ url +'/carinfo">'+
                '<img src="__IMG__/mycar/add.png" />'+
                '</a>'+
                '</div>'+
                '<div class="car-txt">在这里发现我的爱车</div>'+
                '</div>';
        }else {
            for(var i=0;i<len;i++) {
                item = data.member_car_list[i];
                str1 = '<div class="add-box border">' +
                    '<div class="car-left">' +
                    '<img src=" '+ item.logo_img+ '" />' +
                    '</div>' +
                    '<div class="car-middle">' +
                    '<div class="car-name">' + item.branch_name +'&nbsp&nbsp' + 'item.series_name' + '</div>' +
                    '<div class="car-number">' + item.license_plate + '</div>' +
                    '</div>' +
                    // 不是默认车辆
                    '<div class="car-right">' +
                    '<span>设为默认</span>' +
                    '</div>' +
                    // 默认车辆
                    '<div class="car-right active">' +
                    '<span>默认车辆</span>' +
                    '</div>' ;

            }
            str =  '<div class="car-box">' +
                '<div class="add-title">' +
                '<div class="title">我的爱车</div>' +
                '<a class="add-info-btn" id="car-btn" href="' + url + '/addcar">' +
                '<img src="__IMG__/mycar/add.png" />' +
                '</a>' +
                '</div>' +
                '<div class="add-car-box">' +
                str1+
                '</div>' +
                '</div>' +
                '</div>';

        }
        $('mycar-wrapper').prepend(str);
    };

    //判断是否为默认车辆
    pt.judgeDefaultCar = function () {


    };

    pt.getLicenseInfo = function(data) {
        var str='',url;
        url = window.urlObject.ctrl;
        if(data.carinfo == null || data.carinfo == 'undefined') {
            str= '  <a class="info-item margin border" href="'+ url +'/checklicense">' +
                '    <div class="title-box">我的驾驶证</div>' +
                '    <span class="add-box"></span>' +
                '    </a>';
        }else {
            str = '<a class="info-add margin" href="'+ url +'/checklicense">' +
                '<div class="title-box">我的驾驶证</div>' +
                '<div class="add-license-box">' +
                '<div class="name">'+data.name +'</div>' +
                '<div class="txt"><span>下次年审：</span><span>'+ data.date +'</span></div>' +
                '<div class="txt"><span>累计扣分：</span><span>'+ data.fenshu +'</span></div>' +
                '</div>' +
                '</a>' ;
        }
        $('.car-box').after(str);
    };


    //判断有无汽车信息。如果没有则不能添加车险信息
    pt.judgeInsuranceInfo = function(carInfo) {
        if(data.car_id==null || data.car_id=='undefined') {
            $('#car-insurance').css('pointer-events','none');
        }else {
            $('#car-insurance').css('pointer-events','');
        }
    };

    //判断有无车险信息，如果有则展示全部
    pt.getInsuranceInfo =function (data) {
        var str='',url;
        url = window.urlObject.ctrl;
        if(data.carInsurance == null || data.carInsurance == '') {
            str = '<a class="info-item" href="'+ url +'/insurance" id="car-insurance">' +
                '<div class="title-box">我的车险</div>' +
                '<span class="add-box"></span>' +
                '</a>';
        }else {
            str ='    <div class="info-add margin padding">' +
                '        <div class="add-title">' +
                '            <div class="title">我的车险</div>' +
                '            <a class="add-info-btn" id="insurance-btn" href="'+ url +'/insurance">' +
                '                <img src="__IMG__/mycar/add.png" />' +
                '            </a>' +
                '        </div>' +
                '        <div class="add-insurance-box">' +
                '            <div class="insurance-box">' +
                '                <div class="head-box">' +
                '                    <img class="head-img" src="'+ data.insurance_copmpany_img +'" />' +
                '                    <div class="head-name">'+ data.insurance_name +'</div>' +
                '                </div>' +
                '                <div class="bottom-info-txt">' + '到期时间：'+
                '<span>'+ data.insurance_last_time +'</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        $('.mycar-wrapper').html(str);
    };


    return myCar;
});