/**
 * Created by Jimmy on 2017/07/29.
 */
//可用优惠券信息

define(['base', 'wx', 'myslider', 'wxconfig'], function (BaseClass, wx, MySlider, wxconfig) {
    function Type($wrapper) {
        BaseClass.call(this, $wrapper);
        this.cate = null;
        this.pageSize = 20;
        this.page = 1;
        // 默认经纬度
        this.defaultLocation = {
            'lon': '114.344612',
            'lat': '30.555275'
        };
        this.noCodeToLoadData();
        // 加载更多
        $(document).on(this.eventName, '.load-more', $.proxy(this, 'getServicelist'));
    };
    Type.prototype = new BaseClass();
    Type.constructor = Type;

    var pt = Type.prototype;
    pt.getServicelist = function () {
        this.ctrlLoadingIcon();
        var url = '/v2/shops',
            param = {
                lon: this.locationInfo.lon,
                lat: this.locationInfo.lat,
                page: this.page,
                pagesize: this.pageSize,
            };
        if (this.cate != null) {
            param.cate = this.cate;
        }
        this.getDataAsync(url, param, $.proxy(this, 'loadData'));
    };

    // 请求列表成功
    pt.loadData = function (data) {
        this.ctrlLoadingIcon(false);
        var str = this.getListStr(data);
        if (this.page == 1) {
            if (data.length == 0) {
                $('.no-station').show();
                $("#service-content").hide();
                return;
            } else {
                $("#service-content").html(str).show()
                $('.no-station').hide();
            }
        } else {
            $("#service-content").append(str).show();
            $('.no-station').hide();
        }
        if (data.length < 20) {
            $('.loadstatus-info').html("已全部加载").removeClass('load-more');
            return;
        }
        this.page++;
    }

    // 取存储的位置
    pt.noCodeToLoadData = function () {
        var locationInfoStr = this.getInfoFromStorage(this.storageKeyArr[3]);
        if (locationInfoStr) {
            this.locationInfo = JSON.parse(locationInfoStr);
        } else {
            this.locationInfo = this.defaultLocation;
        }
        this.changeTop();
        this.getServicelist();
    };

    pt.getListStr = function (data) {
        var len = data.length, str = '', item;
        for (var i = 0; i < len; i++) {
            item = data[i];
            str += '<li class="service-list">' +
                '<a href="businessdetail?id=' + item.id + '">' +
                '<div class="photo"><img src="" alt=""></div>' +
                '<div class="info">' +
                '<div class="name">' + item.merchname + '</div>' +
                '<div class="place">' + item.address + '</div>' +
                '</div>' +
                '<span class="distance">' + item.distance + '</span>' +
                '</a>' +
                '</li>'
        }
        return str;
    };
    // 取url的参数
    pt.getUrlParameter = function (url) {
        if (typeof(url) == "undefined") {
            url = window.location.href;
        }
        var lindex = url.indexOf("?");
        var paramStr = url.substring(lindex + 1);
        var real = paramStr.split("&");
        var temp = {};
        for (var i = 0; i < real.length; i++) {
            var keyValue = real[i].split("=");
            var resultVal = "";
            for (var index = 1; index < keyValue.length; index++) {
                if (index == 1) {
                    resultVal = resultVal + keyValue[index];
                } else {
                    resultVal = resultVal + "=" + keyValue[index];
                }
            }
            temp[keyValue[0]] = resultVal;
        }
        return temp;
    }

    // 修改头部
    pt.changeTop = function () {
        var temp = this.getUrlParameter();
        var typename = decodeURI(temp.catename);
        var classname = 'icon'+temp.id;
        this.cate = temp.id;
        var str = '<option value="'+temp.id+'">'+typename+'</option>'
        $('.type-icon').addClass(classname);
        $('.type-name').html(typename);
        $('#service-type').html(str);
    }
    return Type;
});