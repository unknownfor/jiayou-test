/**
 * Created by Jimmy on 2017/07/29.
 */
//可用优惠券信息

define(['base', 'wx', 'myslider', 'wxconfig'], function (BaseClass, wx, MySlider, wxconfig) {
    function Service($wrapper) {
        BaseClass.call(this, $wrapper);
        this.cate = null;
        this.pageSize = 20;
        this.page = 1;
        // 默认经纬度
        this.defaultLocation = {
            'lon': '114.344612',
            'lat': '30.555275'
        };
        this.getSelectClass();
        this.noCodeToLoadData();
        // 加载更多
        $(document).on(this.eventName, '.load-more', $.proxy(this, 'getServicelist'));
        // 选择类型
        $(document).on("change", '#service-type', $.proxy(this, 'getTypedata'));
    };
    Service.prototype = new BaseClass();
    Service.constructor = Service
    var pt = Service.prototype;
    // 请求分类
    pt.getSelectClass = function () {
        this.ctrlLoadingIcon();
        var url = '/v2/shop_categories',
            param = {}
        this.getDataAsync(url, param, $.proxy(this, 'loadSelect'));
    }

    // 请求分类列表
    pt.getTypedata = function (e) {
        var id = this.getTargetByEvent(e)[0].value;
        if(id==0){
            this.cate = null;
        }else{
            this.cate = this.getTargetByEvent(e)[0].value;
        }
        this.getServicelist();
    }

    // 请求全部门店列表
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
            param.cate = this.cate
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

    // 请求分类成功
    pt.loadSelect = function (data) {
        this.ctrlLoadingIcon(false);
        var str = '<option value="0">全部门店</option>', len = data.length;
        for (var i = 0; i < len; i++) {
            var item = data[i];
            $('.service-class').eq(i).find("a").attr('href', 'type?id=' + data[i].id+'&catename='+encodeURI(item.catename));
            str += '<option value="' + item.id + '">' + item.catename + '</option>';
        }
        $('#service-type').html(str)
    }
    // 取存储的位置
    pt.noCodeToLoadData = function () {
        var locationInfoStr = this.getInfoFromStorage(this.storageKeyArr[3]);
        if (locationInfoStr) {
            this.locationInfo = JSON.parse(locationInfoStr);
        } else {
            this.locationInfo = this.defaultLocation;
        }
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

    return Service;
});