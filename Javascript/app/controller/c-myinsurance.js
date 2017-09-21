/**
 * Created by mayoi on 2017/09/19.
 */
//我的车险

define(['base','wx'],function (BaseClass,wx) {


    function myInsurance($wrapper) {

        BaseClass.call(this,$wrapper);

        // FastClick.attach(document.body);

        this.getMyInsuranceInfo();

        var that=this;

        $(document).on(this.eventName,'.delete',$.proxy(that,'showTipBox'));

        $(document).on(this.eventName,'#no',$.proxy(that,'hideTipBox'));

    };

    myInsurance.prototype=new BaseClass();
    myInsurance.constructor=myInsurance;

    var pt=myInsurance.prototype;


    pt.getMyInsuranceInfo=function() {

        var url='../data/myinsurance.json';
        $.getJSON(url,null,$.proxy(this,'getInfoSuccess'));
    };
    
    pt.getInfoError=function(result){
        this.ctrlLoadingIcon(false);
        this.showTips({txt:'信息加载失败，'+result});
    };


    pt.getInfoSuccess=function(data){
        this.ctrlLoadingIcon(false);
        this.showMyInsuranceInfo(data);
    };


    pt.showMyInsuranceInfo=function(result){
        if(result.length==0 || result.is_insure == 0){
            this.showTips({txt:'暂无车险'});
        }else{
            var str=this.getMyInsuranceInfoStr(result),
                strL=this.showInsuranceComInfo(result),
                box=$('.head-box');
                //后加载
                box.html(str).after(strL);
        }
    };

    pt.getMyInsuranceInfoStr=function(data){
        var len=data.length, str='', item;
        if(len != 0 || data != null){
            if (data.is_insure == 1){
                item= data.member_car_insurance;
                str='<img class="head-bg" src="'+ item.company_logo +'" />'+
                    '<div class="head-detail">'+
                    '<img class="head-img" src="'+ item.company_logo +'" />'+
                    '<div class="head-name">'+ item.company_name +'</div>'+
                    '<div class="head-info-box">'+
                    this.getBranchNameInfo(data)+ this.getLicensePlateInfo(data)+
                    '</div>'+
                    '</div>'+
                    '<div class="delete">'+'删除'+'</div>';
            }
        }
        return str;
    };


    pt.getLicensePlateInfo=function(licence) {
        var str='', item=licence.member_car_insurance.license_plate;
        if(item == ''){
            return str;
        }
            str= '<span class="head-info right">'+ item +'</span>';
            return str;
    };


    pt.getBranchNameInfo=function(branch) {
        var str='',
            str1='',
            str2='',
            itemB=branch.member_car_insurance.branch_name,
            itemS=branch.member_car_insurance.series_name;
        if(itemB == '' && itemS == '' ){
            return str;
        }
        if(itemB !='') {
            str1= itemB + '&nbsp&nbsp';
        }
        if(itemS !='') {
            str2= itemS + '&nbsp&nbsp';
        }
        str='<span class="head-info">'+ str1 + str2 +'</span>';
        return str;
    };







    //保存车险数据,提交数据‘保险公司名称’‘车牌号’‘车型号’ ‘联系电话’ ‘投保时间’
    //删除车险数据



    pt.showInsuranceComInfo=function(data) {
        var len=data.length, str='', item;
        if(len != 0 || data != null){
            if (data.is_insure == 1){
                item= data.member_car_insurance;
                str='<div class="item-box">'+
                    this.getPhoneInfo(data)+
                    '<div class="info-box">'+
                    '<div class="info-left">上次投保时间</div>'+
                    '<input class="info-input" type="number" placeholder="用于提醒投保"/>'+
                    '<span class="iconfont icon-right"></span>'+
                    '</div>'+
                    '</div>'+
                    '<div class="save-btn">'+
                    '<a href="__CTRL__/insurance"><span>保存</span></a>'+
                    '</div>';
            }
        }
        return str;
    };


    pt.getPhoneInfo=function(phone) {
        var str='',
            item=phone.member_car_insurance.contact_number;
        if(item !='') {
            str= '<div class="info-box border">'+
                '<div class="info-left">联系电话</div>'+
                '<a class="info-right" href="tel:'+ item +'">'+ item +'</a>'+
                '</div>';
        }
        return str;
    };



    pt.showTipBox=function(){
        $('.delete-box').addClass('show');
        $('.save-btn').css('pointer-events','none');
    };

    pt.hideTipBox=function(){
        $('.delete-box').removeClass('show');
        // 防止触发后面的保存按钮链接
        setTimeout(function(){
            $('.save-btn').css('pointer-events','auto');
        }, 400);
    };



    return myInsurance;

});