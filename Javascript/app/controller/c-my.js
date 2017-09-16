/**
 * Created by Jimmy on 2017/07/29.
 */
//可用优惠券信息

define(['base','wx'],function (BaseClass,wx) {
    function My($wrapper) {
        BaseClass.call(this,$wrapper);

        this.getMyInfo();  //我的信息

    };

    My.prototype=new BaseClass();
    My.constructor=My;

    var pt=My.prototype;

    /*获取我的信息*/
    pt.getMyInfo=function(){
        this.ctrlLoadingIcon();
        var param={},
            url='/v1/user_center',
            options={
                errorCallback:$.proxy(this,'getMyInfoError')
            };
        this.getDataAsync(url,param,$.proxy(this,'getMyInfoSuccess'),options);

        //var url=window.urlObject.json+'/my.json';
        //$.getJSON(url,null,$.proxy(this,'getMyInfoSuccess'));
    };

    /*获取成功*/
    pt.getMyInfoSuccess=function(data){
        this.ctrlLoadingIcon(false);
        $('.avatar,.filter-img').attr('src',data.avatar);
        $('.nick-name').text(data.nickname);

        //手机
        var $mobileTips=$('#mobile-tips');
        var url=window.urlObject.ctrl+'/addmobile';
        if(data.mobile){
            $('.mobile').text(data.mobile).show();
            url=window.urlObject.ctrl+'/unbindmobile/mobile/'+data.mobile;
            $('#mobile-tips').text('更改绑定手机号');
        }else{
            $mobileTips.text('绑定手机号')
        }
        $mobileTips.closest('a').attr('href',url);

        var $val = $('.total-consumption-info-box .val'),
            totalVol=this.dealWithNum(data.rise)+' L',
            finalFee='¥ '+this.dealWithNum(data.final_fee),
            discountFee='¥ ' +this.dealWithNum(data.discount_fee);
        $val.eq(0).text(totalVol);
        $val.eq(1).text(finalFee);
        $val.eq(2).text(discountFee);
    };

    pt.dealWithNum=function(val){
        var totalVol = 0;
        if(val){
            totalVol=parseFloat(val);
        }else{
            totalVol=0;
        }
        return totalVol;
    };

    /*获取失败*/
    pt.getMyInfoError=function(result){
        this.ctrlLoadingIcon(false);
        this.showTips({txt:'个人信息加载失败，'+result});
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




    /*获取我的爱车信息*/
    pt.getMyCarInfoStr=function(data){
        var str='',item,discountInfo;
        if(item !== null || item !== undefined || item !== '') {
            str = '<div class="icon-car">' +
                        '<img src="" />' +
                    '</div>'+
                    '<div class="info-box">'+
                        '<div class="car-number">鄂A30070</div>'+
                    '</div>'+
                    '<span class="iconfont icon-right"></span>';
        }
        return str;
    };







    return My;
});