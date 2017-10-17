/**
 * Created by mayoi on 2017/09/18.
 */
//完善车辆信息

define(['base', 'wx'], function (BaseClass,wx) {
    function CarInfo($wrapper) {
        BaseClass.call(this, $wrapper);

        var that=this;


        this.scrollControl();
        this.ctrlLoadingIcon();

        this.getModelInfo();


        var h=$(window).height();
        $(window).resize(function() {
            if($(window).height()<h){
                $('.save-btn').hide();
            }
            if($(window).height()>=h){
                $('.save-btn').show();
            }
        });


        //驾驶证弹窗
        $(document).on(this.eventName,'.icon-box',$.proxy(this,'showTipBox'));

        /*点击灰色部分关闭*/
        $(document).on(this.eventName,'.help-box',function(e){
            that.toHideModuleByClickOutside(e,$.proxy(that,'hideTipBox'));
        });


        /*关闭*/
        $(document).on(this.eventName,'.confirm',$.proxy(that,'hideTipBox'));

        //点击加载更多
        $(document).on(this.eventName,'.load-more',function() {
            //页面恢复滚动
            that.scrollControl(true);
            pt.showOrgInfo();
        });


        //检查数据是否输入
        $(document).on('input', '.license-plate', function(){
            //车牌号
            pt.checkInfo();
        });

        $(document).on(this.eventName,'.save-btn.active',$.proxy(that,'putCarInfo'));

    };


    CarInfo.prototype = new BaseClass();
    CarInfo.constructor = CarInfo;

    var pt = CarInfo.prototype;



    //填充头部信息
    pt.getModelInfo=function(){
        this.getLocalCarInfo();
        // this.initFirstDate();//时间
        // this.initSecondDate();
        this.hideCoverBox();// 隐藏菜单蒙板，
        this.getCityUrl();
        this.showEngine();
        $('.carinfo-wrapper').removeClass('hide');
        this.ctrlLoadingIcon(false);
    };


    //获取本地储存的数据
    pt.getLocalCarInfo= function() {
        var carimg=window.localStorage.car_img,//汽车图片
            carbrand=window.localStorage.car_brand,//车牌信息
            carmodel=window.localStorage.car_model,//车型信息
            e=window.localStorage.eSize,
            y=window.localStorage.cYear,
            t=window.localStorage.cType,//获取存储的变量的值;
            ct=window.localStorage.city;//获取储存的城市信息
        if(carimg== undefined) {
            carimg=='';
        }
        if (carbrand == undefined) {
            carbrand = '';
        }
        if (carmodel == undefined) {
            carmodel = '';
        }
        if (e == undefined) {
            e = '';
        }
        if (e == undefined) {
            e = '';
        }
        if(y == undefined ){
            y ='';
        }
        if(t==undefined) {
            t ='';
        }
        if(ct == undefined) {
            ct='';
        }
        $('.car-detail').text(e + '  ' + y + '  ' + t );
        $('.city').text(ct);

        var str ='<div class="car-box border">'+
            '<img class="car-img" src="'+ carimg +'" />'+
            '<div class="car-name">'+ carbrand +'&nbsp&nbsp' +carmodel +'</div>'+
            '</div>';
        $('.carinfo-wrapper').prepend(str);
    };


    /*
    *判断是否有车系信息，如果有则跳转
    *没有则展示"暂无选项"
    * */
    pt.showEngine=function() {
        var sid=$('.carinfo-wrapper').attr('data-scar-id'),
            str = '';
        if(sid =="") {
            str='<div class="info-item border none" >'+
                '<div class="title-box">车型：</div>'+
                '<div class="car-detail">暂无选项</div>'+
                '<span class="iconfont icon-right"></span>'+
                '</div>';
        }else {
            str='<a class="info-item border none" href="'+ this.doInfo()  +'">'+
                '<div class="title-box">车型：</div>'+
                '<div class="car-detail"></div>'+
                '<span class="iconfont icon-right"></span>'+
                '</a>';
        }
        //找到第一个title，然后追加str内容
        $('.carinfo-wrapper').find('.title').eq(0).after(str);
    };



    pt.showTipBox=function(){
        $('.help-box').addClass('show');
    };
    pt.hideTipBox=function(){
        $('.help-box').removeClass('show');
    };

    pt.showOrgInfo=function() {
        var box=$('.info-item'),
            title=$('.title'),
            btn=$('.load-box');
        box.removeClass('none');
        title.removeClass('none');
        btn.addClass('none');
    };

    pt.doInfo=function(){
        var box = $('.carinfo-wrapper'),
            sid = box.attr('data-scar-id'),
            id = box.attr('data-car-id'),
            url=window.urlObject.ctrl+'/enginesize?'+
                'car_id='+id+
                '&scar_id='+sid;
        return url;
    };

    //城市
    pt.getCityUrl = function () {
        var str ='',
            url,
            box = $('.carinfo-wrapper'),
            sid = box.attr('data-scar-id'),
            id = box.attr('data-car-id'),
            url = window.urlObject.ctrl+'/city?'+'car_id='+id+ '&scar_id='+sid;
        city=window.localStorage.city;
        if(city == undefined) {
            city = '';
        }
        str = '  <a class="info-item border none" href="'+ url +'">' +
            '        <div class="title-input">查询城市：</div>' +
            '        <div class="car-detail city">'+ city +'</div>' +
            '        <span class="iconfont icon-right"></span>' +
            '    </a>';
        //找到第二个title，然后追加str内容
        box.find('.title').eq(1).after(str);
    };


    //检查数据是否有输入
    pt.checkInfo = function (){
        var lisPlate=$('.license-plate').val(),
            reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
            $btn=$('.save-btn');
        if(lisPlate.length == 7) {
            if (reg.test(lisPlate)) {
                $btn.removeClass('nouse').addClass('active');
            } else {
                $btn.addClass('nouse').removeClass('active');
            }
        }else {
            $btn.addClass('nouse').removeClass('active');
        }
    };


    /*
    * http://xx.com/v2/member_cars
    * 保存用户的汽车信息
    * post
    * */
    pt.putCarInfo = function () {
        this.ctrlLoadingIcon();
        var that=this,
            jumpurl = window.urlObject.ctrl;
        $box = $('.carinfo-wrapper'),
            license_plate = $('.license-plate').val(),
            cb_id = $box.attr('data-car-id'),
            cs_id = $box.attr('data-scar-id'),
            cd_id = $box.attr('data-dis-id'),
            cy_id = $box.attr('data-year-id'),
            cmt_id = $box.attr('data-type-id'),
            road_time = $('#road-time').val(),
            trip_distance = $('.trip-distance').val(),
            city = $('.city').val(),
            frame_number = $('.frame-number').val(),
            engine_number = $('.engine-number').val(),
            registration_time = $('#registration-time').val();
        /*
        * license_plate	是	varchar	车牌号码
            cb_id	是	int	品牌ID
            cs_id	否	int	车系ID
            bd_id	否	int	排量ID
            by_id	否	int	年份ID
            bmt_id	否	int	车型ID
            road_time	否	varchar	上路时间(如2016-06)
            trip_distance	否	int	行驶里程
            city	否	varchar	城市
            frame_number	否	varchar	车架号
            engine_number	否	varchar	发动机号
            registration_time	否	varchar	注册时间(如2012-09-17)
        *
        * */
        params= {
            license_plate:license_plate,
            cb_id: cb_id,
            cs_id :cs_id,
            cd_id:cd_id,
            cy_id:cy_id,
            cmt_id:cmt_id,
            road_time:road_time,
            trip_distance:trip_distance,
            city:city,
            frame_number:frame_number ,
            engine_number:engine_number,
            registration_time:registration_time
        };
        var url='/v2/member_cars',
            options={
                type:'post',
                token:true,
                errorCallback:function(res){
                    that.showTips({txt:'添加失败,'+res.msg});
                }
            };
        this.getDataAsync(url,params,function(result){
            //提交信息
            params = result;
            window.setTimeout(function () {
                that.ctrlLoadingIcon(false);
                that.showTips({txt:'添加成功'});
                $('.save-btn').addClass('nouse').removeClass('active');
                window.location.href = jumpurl +'/mycar';
            },2500);
        },options);
    };

    //如果有车系信息，但是没有车型信息，页面跳转



    //时间选择
    pt.initFirstDate = function () {
        var calendardatetime = new lCalendar();
        calendardatetime.init({
            'trigger': '#road-time',
            'type': 'date'
        })
    };
    pt.initSecondDate = function () {
        var calendardatetime = new lCalendar();
        calendardatetime.init({
            'trigger': '#registration-time',
            'type': 'date'
        });
    };



    return CarInfo;
});