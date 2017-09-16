/**
 * 首页
 * 基本逻辑：
 * 1.进入页面，使用后台绑定过来的微信 code
 * Created by Jimmy on 2017/07/18.
 */


define(['base','wx','myslider','wxconfig','closebox'],function (BaseClass,wx,MySlider,WxConfig,CloseBox) {
    function Home($wrapper) {

        BaseClass.call(this,$wrapper);


        this.page=1;
        this.pageSize=20;

        this.defaultLocation={
            lon: '114.344612',
            lat: '30.555275'
        };

        var that=this,
            code=$wrapper.attr('data-code');

        /*
        * code 只能使用一次，防止使用第二次
        * 有code的情况分两种：
        *   1.第一次进入到页面，
        *   2.经过 n 次返回上一级到达第一次的状态
        *
        */
        var codeFlag=this.getInfoFromStorage(this.storageKeyArr[4])!=code;
        if(code && codeFlag) {
            this.writeInfoToStorage({key:this.storageKeyArr[4],val:code});  //纪录code，并不是为了使用，是为了识别
            this.login(code);
        }else{
            this.noCodeToLoadData();
        }

        //领取奖励
        $(document).on(this.eventName,'.take-btn',$.proxy(this,'takeCoupon'));

        /*加载更多加油站*/
        $(document).on(this.eventName,'.station-btn-tips',$.proxy(this,'loadMoreStation'));

        /*点击其中一个加油站*/
        //$(document).on(this.eventName,'.station-item .left-box',$.proxy(this,'chooseStation'));
        $(document).on(this.eventName,'.station-item .left-box',$.proxy(this,'chooseStation'));


        /*点击灰色部分关闭*/
        $(document).on(this.eventName,'#confirm-close-box',function(e){
            that.toHideModuleByClickOutside(e,$.proxy(that,'hideNotInNearConfirmBox'));
        });

        /*点击灰色部分关闭*/
        $(document).on(this.eventName,'#confirm－box',function(e){
            that.toHideModuleByClickOutside(e,$.proxy(that,'hideStationConfirmBox'));
        });

        /*关闭*/
        $(document).on(this.eventName,'.close-head span',$.proxy(that,'hideStationConfirmBox'));

        /*确定该加油站*/
        $(document).on(this.eventName,'.confirm-btn',$.proxy(that,'confirmStation'));
    };

    Home.prototype=new BaseClass();
    Home.constructor=Home;

    var pt=Home.prototype;


    /*是否为新用户*/
    pt.login=function(code){
        this.ctrlLoadingIcon();
        var url='/v1/login',
            that=this,
            param={
                client:'wechat_official',
                code:code
            },
            options={
                token:false,
                type:'post',
                errorCallback:function(res){
                    that.ctrlLoadingIcon(false);
                    that.showTips({txt:res.msg});
                }
            }
        this.getDataAsync(url,param,$.proxy(this,'getWxConfig'),options);
    };

    pt.getWxConfig=function(data){

        //用户判断，如果是新用户则显示新手礼包
        this.isNewpackage=data.is_newpackage;

        //将openid等用户信息存储到本地
        this.writeInfoToStorage({key:this.storageKeyArr[0],val:JSON.stringify(data)});

        //获取微信登录信息
        var that=this,
            url='/v1/wx_config',
            currentUrl=window.location.href.split('#')[0],
            param={
                current_url:currentUrl
            },
            options={
                errorCallback:function(res){
                    that.ctrlLoadingIcon(false);
                    that.showTips({txt:res.msg});
                }
            }
        this.getDataAsync(url,param,$.proxy(this,'getWxConfigSuccessCallback'),options);


    };

    pt.getWxConfigSuccessCallback=function(data){
        var that=this,
            options={
                locationInfo: {
                    locationSCallback: function (locationInfo) {

                        //alert(locationInfo.lon +' ' + locationInfo.lat);
                        that.locationInfo = locationInfo;

                        that.writeInfoToStorage({key: that.storageKeyArr[3], val: locationInfo}); //纪录地理位置信息

                        //用户判断，如果是新用户则显示新手礼包
                        that.isNewUser();
                    },
                    locationECallback: function (txt) {
                        that.showTips({txt: txt});
                    }
                },
                shareInfo:true
            };

        var wxConfig=new WxConfig(data,options);
    };

    pt.isNewUser=function(){
        if(this.isNewpackage==1){
            this.showCoupon();
        }else{
            this.loadData();
        }
    };

    /*
    ＊页面在此回来时，直接使用保存好的 location
    */
    pt.noCodeToLoadData=function(){
        var locationInfoStr= this.getInfoFromStorage(this.storageKeyArr[3]);
        if(locationInfoStr){
            this.locationInfo=JSON.parse(locationInfoStr);
        }else{
            this.locationInfo=this.defaultLocation;
        }
        this.loadData();
    };

    /*
    * 根据客户端当前经纬度获取加油赞列表
    *
    */
    pt.loadData=function(){
        var param={
                lon:this.locationInfo.lon,
                lat:this.locationInfo.lat,
                type:1,
            },
            that=this,
            url='/v1/home_page',
            options={
                errorCallback:function(res){
                    that.showTips({txt:res.msg});
                }
            };
        this.getDataAsync(url,param,$.proxy(this,'loadDataSuccess'),options);
    };

    /*
    * 数据加载成功
    */
    pt.loadDataSuccess=function(data){
        this.ctrlLoadingIcon(false);//隐藏等待
        $('.home-wrapper').show();
        this.hideCoverBox();// 隐藏菜单蒙板，
        this.showNearByStationInfo(data.station);
        this.showBannerInfo(data.banner);
    };

    /*最近加油站信息*/
    pt.showNearByStationInfo=function(result){
        if(result.length==0){
            $('.no-station').show();
            return;
        }else{
            var str=this.getStationBasicInfoStr(result);
            $('.station-main').html(str).show();
        }
    };

    pt.getStationBasicInfoStr=function(arr){
        var len=arr.length,str='',item,discountInfo;
        for(var i=0;i<len;i++){
            item=arr[i];
            if(i==0){
                item.discountType=1;
                item.discountDesc='¥2.91／升，现降0.2元';
            }
            if(i==3){
                item.discountType=3;
                item.discountDesc='年中钜惠，9折优惠';
            }
            discountInfo=this.getDiscountInfo(item);
            str+='<li class="station-item" '+
                    'data-discount-type="'+item.discountType+'" '+
                    'data-discount-desc="'+item.discountDesc+'" '+
                    'data-name="'+item.title+'" '+
                    'data-id="'+item.id+'" '+
                    'data-lon="'+item.location_y+'" '+
                    'data-lat="'+item.location_x+'" >'+
                    '<div class="left-box">'+
                        '<div class="name-box">'+
                            '<div class="station-name">'+item.title+'</div>'+
                            discountInfo.type+
                        '</div>'+
                        '<div class="station-address">'+item.address+'</div>'+
                        discountInfo.desc+
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
        return str;
    };

    /*banner数据*/
    pt.showBannerInfo=function(banner){
        var arr=this.getItemStr(banner);
        new MySlider($('#banner-main'),arr,{
            changeCallback:function(type,index){
                "use strict";

            }
        });
    };

    pt.getItemStr=function(data){
        var len=data.length,arr=[];
        for(var i=0;i<len;i++){
            var item=data[i];
            arr.push('<a href="'+item.link+'"><img class="lazy-img phone-img" src="'+item.thumb_url+'"></a>');
        }
        return arr;
    };


    /*新用户 优惠券*/
    pt.showCoupon=function(){
        //var url=window.urlObject.json+'/coupon.json',
        this.newGiftIdsArr=[];
        var url='/v1/new_gift',
            param={},
            options={
                errorCallback:function(txt){
                    this.showTips({txt:txt});
                }
            };
        this.getDataAsync(url,param,$.proxy(this,'loadNewGiftSuccessCallback'),options);


    };

    pt.loadNewGiftSuccessCallback=function(data){
        var len = data.length,
            str = '',
            item,
            couponTitle,
            className;
        for (var i = 0; i < len; i++) {
            item = data[i];
            this.newGiftIdsArr.push(item.id);
            couponTitle = this.getCouponTypeStr(item);
            className=this.couponArr[item.type-1].className;
            str += '<div class="coupon-item">' +
                '<div class="coupon-left"></div>' +
                '<div class="coupon-middle">' +
                '<div class="coupon-content">'+
                '<div class="coupon-head">' +
                '<span class="big">' + couponTitle.numInfo + '</span>' +
                '<span>' + couponTitle.descInfo + '</span>' +
                '</div>' +
                '<div class="coupon-bottom">' +
                '<div><span>使用条件：</span><span>满' + item.condition + '减</span></div>' +
                '<div><span>可用时间：</span><span>' + this.getTimeFromTimestamp(item.starttime) + '-' + this.getTimeFromTimestamp(item.endtime) + '</span></div>' +
                '</div>' +
                '</div>' +
                '<div class="coupon-type-img '+className+'"></div>'+
                '</div>' +
                '<div class="coupon-right"></div>' +
                '</div>';
        }
        $('#coupon-main').html(str);
        this.ctrlLoadingIcon(false);//隐藏等待
        this.hideCoverBox();  //隐藏覆盖框
        $('#coupon').addClass('show');
        $('.home-wrapper').show();
    };

    /*领取新手券*/
    pt.takeCoupon=function(){
        var that=this;
        var tipsOption={
            txt:'新人礼包已放入你的红包！',
            callback:function(){
                window.setTimeout(function(){
                    $('#coupon').hide();
                    that.ctrlLoadingIcon();
                    that.loadData();
                },1000);
            }
        };
        this.showTips(tipsOption);

        //调用领取接口
        var url='/v1/user_coupon',
            param={
                ids:this.newGiftIdsArr.join(',')
            },
            options={
                type:'post',
                token:true,
                errorCallback:function(res){
                    this.showTips({txt:res.msg});
                }
            };
        this.getDataAsync(url,param,$.proxy(this,'takeNewGiftSuccessCallback'),options);

    };

    pt.takeNewGiftSuccessCallback=function(data){
        console.log('load success');
    };

    /*加载更多的加油站*/
    pt.loadMoreStation=function(){
        var that=this,
            url='/v1/station_list',
            param={
                lon:this.locationInfo.lon,
                lat:this.locationInfo.lat,
                page:this.page,
                pageSize:this.pageSize,
                type:1
            },
            option={
                errorCallback:function(txt){
                    //console.log(txt);
                    that.showTips({txt:'数据加载失败'});
                }
            }
        this.ctrlLoadingIcon();
        this.getDataAsync(url,param,$.proxy(this,'loadMoreDataSuccess'),option);
    };

    /*加载成功*/
    pt.loadMoreDataSuccess=function(data){
        this.ctrlLoadingIcon(false);
        if(data.length==0){
            $('.has-loaded-all').show().siblings().hide();
            return;
        }
        var str = this.getStationBasicInfoStr(data);
        var $stationMain=$('.station-main');
        if(this.page==1) {
            $stationMain.html(str);
        }else{
            $stationMain.append(str);
        }
        this.page++;
    };


    /*选择其中一个加油站*/
    pt.chooseStation=function(e){
       var $targetLi=this.getTargetByEvent(e).closest('li'),
           name=$targetLi.attr('data-name'),
           id=$targetLi.attr('data-id'),
           discountType=$targetLi.attr('data-discount-type'),
           discountDesc=$targetLi.attr('data-discount-desc'),
           distance=$targetLi.find('.distance').text().replace('km','');
        //this.ctrlHomeWrapperScrollStatus(false);  //可以禁止背景滚动，但是背景会跳到顶部

        if(parseFloat(distance)*1000<=80000000) {

            $('#current-station-name').text(name);

            var infoObj = {
                'data-id': id,
                'data-name': name,
                'data-discount-type': discountType,
                'data-discount-desc': discountDesc
            };
            $('.confirm-btn').attr(infoObj);
            $('#confirm－box').addClass('show');
        }else{
            this.distanceNoInNear();
        }
    };

    /*距离超出800m*/
    pt.distanceNoInNear=function(){
        this.ctrlLoadingIcon(false);
        if(!this.closeBox) {
            var options={
                callback:function(){

                }
            }
            this.closeBox = new CloseBox(options);
            this.closeBox.init();
        }
        this.closeBox.showBox({content:'当前油站超过 800M 范围，请到加油站内支付'});
    };

    pt.hideStationConfirmBox=function(){
        $('#confirm－box').removeClass('show');
        //this.ctrlHomeWrapperScrollStatus();
    };

    pt.hideNotInNearConfirmBox=function(){
        $('#confirm-close-box').removeClass('show');
        //this.ctrlHomeWrapperScrollStatus();
    };

    pt.ctrlHomeWrapperScrollStatus=function(flag){
        if(flag==false){
            this.scrollControl(flag,null);
        }else{
            this.scrollControl(true,null);
        }
    }

    /*确定加油站，页面跳转*/
    pt.confirmStation=function(e){
        var $target=this.getTargetByEvent(e),
            id=$target.attr('data-id'),
            name=$target.attr('data-name'),
            infoObj={
                id:id,
                name:name,
                discountType:$target.attr('data-discount-type'),
                discountDesc:$target.attr('data-discount-desc')
            };

        //将选择好的加油站存储到本地
        this.writeInfoToStorage({key:this.storageKeyArr[1],val:JSON.stringify(infoObj)});

        //跳转加油页面
        var url=window.urlObject.ctrl+'/gas/id/'+id+'/name/'+name;
        window.location.href=url;
    };

    /*隐藏遮盖蒙板*/
    pt.hideCoverBox=function(){
        $('#cover-box').hide();
    };

    return Home;
});