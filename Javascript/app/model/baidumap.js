/**
 * Created by jimmy on 2015/12/22.
 */

/*
* 百度地图定位类
*/
define(['super'],function (Super) {

    function BaiduMap(callback) {
        this.init(callback);
    }

    //方法继承
    BaiduMap.prototype = new Super();
    BaiduMap.prototype.constructor = BaiduMap;

    var pt = BaiduMap.prototype;

    pt.init=function(callback) {
        var geolocation = new BMap.Geolocation(),
            that=this;
        geolocation.getCurrentPosition(function (r) {
            var locationInfo = that.convert(r.point.lng, r.point.lat);
            that.locationInfo = locationInfo;
            that.writeInfoToStorage({key: 'location', val: locationInfo}); //记录地理位置信息
            callback && callback(locationInfo);
        });
    };

    /*百度地图转换成腾讯地图*/
    pt.convert=function(bd_lon,bd_lat){
        var point={};
        var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        var x = new Number(bd_lon - 0.0065);
        var y = new Number(bd_lat - 0.006);
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        var Mars_lon = z * Math.cos(theta);
        var Mars_lat = z * Math.sin(theta);
        point.lon=Mars_lon;
        point.lat=Mars_lat;
        return point;
    };

    return BaiduMap;
});


