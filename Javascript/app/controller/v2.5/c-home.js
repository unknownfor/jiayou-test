/**
 * 首页
 * Created by mayoi on 2017/09/27.
 */

//获得token，取得数据

define(['base','wx','wxconfig'],function (BaseClass,wx,WxConfig) {
    function Home($wrapper) {

        BaseClass.call(this,$wrapper);

        this.getHomeInfo();

    }

    Home.prototype=new BaseClass();
    Home.constructor=Home;

    var pt=Home.prototype;

    /*获取信息*/
    pt.getHomeInfo=function(){
        this.ctrlLoadingIcon();
        var url='../../data/home.json';
        $.getJSON(url,null,$.proxy(this,'getInfoSuccess'));
    };


    /*获取成功*/
    pt.getInfoSuccess=function(data){
        // this.ctrlLoadingIcon(false);
        // 隐藏等待
        // $('.homev2_5-wrapper').removeClass('hide');
        // this.hideCoverBox();
        // 隐藏菜单蒙板，
        this.showCarInfo(data);
    };
    
    
    pt.showCarInfo =function (data) {
        var str = '',
            url,
            len,
            item;
        url = window.urlObject.ctrl;
        len=data.member_car_list.length;
        if(data.member_car_list.length == 0) {
            str = '<a class="car-item margin" href="'+ url +'/mycar'+'">' +
                '<div class="info-box">' +
                '<span class="add-car">添加我的爱车</span>' +
                '</div>' +
                '<span class="iconfont icon-right"></span>' +
                '</a>';
        }else {
            for (var i=0;i<len;i++) {
                item = data.member_car_list[0];
                str = '<a class="car-item margin" href="'+ url +'/mycar'+'">' +
                    '<div class="icon-car">' +
                    '<img src="'+ item.logo_img +'" />' +
                    '</div>' +
                    '<div class="info-box">' +
                    '<div class="car-number">'+ item.license_plate +'</div>' +
                    '<div class="car-detail"><span>'+ item.branch_name +'&nbsp&nbsp'+item.series_name +'</span></div>' +
                    '</div>' +
                    '<span class="iconfont icon-right"></span>' +
                    '</a>';
            }
        }
        $('.item-box').before(str);
    };





    return Home;
});