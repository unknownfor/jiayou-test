/**
 * Created by mayoi on 2017/09/18.
 */
//完善车辆信息


define(['base', 'wx'], function (BaseClass,wx) {


    function CarInfo($wrapper) {
        BaseClass.call(this, $wrapper);


        var that=this;
        //禁止页面滚动
        that.scrollControl(false);

        $(document).on(this.eventName,'.icon-help',$.proxy(this,'showTipBox'));

        /*点击灰色部分关闭*/
        $(document).on(this.eventName,'.help-box',function(e){
            that.toHideModuleByClickOutside(e,$.proxy(that,'hideTipBox'));
        });


        /*关闭*/
        $(document).on(this.eventName,'.confirm',$.proxy(that,'hideTipBox'));

        //点击展示全部
        $(document).on(this.eventName,'.load-more',function() {
            //页面恢复滚动
            that.scrollControl(true);
            pt.showOrgInfo();
        });

        //检查数据是否输入
        $(document).on('input', '.license-plate', function(){
            //页面禁止滚动
            that.scrollControl(true);
            //校准车牌号
            pt.checkInfo();
        });

        $(document).on(this.eventName,'.save-btn.active',$.proxy(that,'putCarInfo'));

    };


    CarInfo.prototype = new BaseClass();
    CarInfo.constructor = CarInfo;

    var pt = CarInfo.prototype;

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


    //调用日期选择接口
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
        var that=this,
            $box = $('.carinfo-wrapper'),
            license_plate = $('.license-plate').val(),
            car_id = $box.attr('data-car-id'),
            cs_id = $box.attr('data-scar-id'),
            bd_id = $box.attr('data-dis-id'),
            by_id = $box.attr('data-year-id'),
            road_time = $('.date-select').val(),
            trip_distance = $('.trip-distance').val(),
            city = $('.city').val(),
            frame_number = $('.frame-number').val(),
            engine_number = $('.engine-number').val(),
            registration_time = $('.registration-time').val();
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
                car_id: car_id,
                cs_id :cs_id,
                bd_id:bd_id,
                by_id:by_id,
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
                    that.showTips({txt:'添加失败'});
                }
            };
        this.getDataAsync(url,params,function(result){
            params.id = result;
            //提交信息

            that.showTips({txt:'添加成功'});

        },options);
    };


    return CarInfo;
});