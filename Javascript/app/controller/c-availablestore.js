/**
 * Created by Jimmy on 2017/07/29.
 */
//单个优惠券详细信息

define(['base','wx','wxconfig'],function (BaseClass,wx,WxConfig) {
    function AvailableStore($wrapper) {
        BaseClass.call(this,$wrapper);

        this.init();  //优惠券详情
    };

    AvailableStore.prototype=new BaseClass();
    AvailableStore.constructor=AvailableStore;

    var pt=AvailableStore.prototype;

    /*优惠券详情*/
    pt.init=function(){
        this.ctrlLoadingIcon();
        this.getLocationInfo($.proxy(this,'getCouponInfo'));
    };

    pt.getCouponInfo=function(res){
        var that=this,
            param={
                lon:res.lon,
                lat:res.lat,
                id:this.$wrapper.attr('data-id')
            },
            url='/v1/coupon_detail',
            options={
                errorCallback:function(){
                    that.ctrlLoadingIcon(false);
                    that.showTips({txt:'获取列表信息失败'});
                }
            };
        this.getDataAsync(url,param,$.proxy(this,'getCouponInfoSuccess'),options);
    };

    /*获取当前未知*/
    pt.getLocationInfo=function(callback){
        var that=this,
            locationOptions={
                locationInfo: {
                    locationSCallback: function (locationInfo) {
                        callback && callback(locationInfo);
                    },
                    locationECallback: function (txt) {
                        that.showTips({txt: txt});
                    }
                }
            };

        var url='/v1/wx_config',
            currentUrl=window.location.href.split('#')[0],
            param={
                current_url:currentUrl
            };

        this.getDataAsync(url,param,function(data) {
            var wxConfig = new WxConfig(data, locationOptions);
        });

    };

    /*获取成功*/
    pt.getCouponInfoSuccess=function(res){
        this.ctrlLoadingIcon(false);
        var arr=res.stations,
            len=arr.length,
            str='',
            item;
        for(var i=0;i<len;i++){
            item=arr[i];
            str+='<li class="station-item">'+
                '<div class="left-box">'+
                '<div class="name-box">'+
                '<div class="station-name">'+item.title+'</div>'+
                '</div>'+
                '<div class="station-address">'+item.address+'</div>'+
                '</div>'+
                '<div class="right-box">'+
                '<a href="'+item.navigation+'">'+
                '<div class="distance">'+item.distance+'</div>'+
                '<div class="navigation">'+
                '<span class="iconfont icon-navigation"></span>'+
                '<span class="">导航</span>'+
                '</div>'+
                '</a>'+
                '</div>'+
                '</li>';
        }
        $('#available-store').html(str);
        $('.num-txt').text(len);
        $('.location-name').show();
    };

    return AvailableStore;
});