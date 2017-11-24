/**
 * 特权会员
 * Created by mayoi on 2017/09/27.
 *
 * 11月20号更新 v2.7版本
 *
 */

define(['base','async','template','baidumap'],function (BaseClass,Async,Template,BaiduMap) {
    function Privilege($wrapper) {

        BaseClass.call(this,$wrapper);

        this.init();
    }

    Privilege.prototype=new BaseClass();
    Privilege.constructor=Privilege;

    var pt=Privilege.prototype;


    pt.init=function(){

        this.getImgUrlArr();

        var location=this.getInfoFromStorage(this.storageKeyArr[3]),
            that=this;
        if(!location){
            //获取定位
            var baiduMap=new BaiduMap(function(locationInfo){
                that.getData(locationInfo);
            });
        }else{
            location=JSON.parse(location);
            that.getData(location);
        }
    };

    pt.getData=function(location){
        var that=this;
        Async.parallel({
            city: function (callback) {
                that.getCityCutInfo(location,function (result){
                    if(!result) {
                        return;
                    }
                    callback(null,result);
                });
            },
            my: function(callback) {
                that.getPrivilegeInfo(function (result){
                    callback(null,result);
                });
            }
        },function (err,results) {
            that.showTemplateHtml(results);
        });
    };

    /*地区优惠信息*/
    pt.getCityCutInfo=function(location,callback){
        this.ctrlLoadingIcon();
        var param={
                lon:location.lon,
                lat:location.lat
            },
            url='/v2/vip_level_privilege',
            options={
                errorCallback:function(res){
                    if(res.msg=='110000'){
                        callback({rate:0});
                    }
                }
            };
        this.getDataAsync(url,param,function(res){
            callback(res);
        },options);
    };

    /*得到图片的地址*/
    pt.getImgUrlArr=function(){
        var url=window.urlObject.ctrl;
        this.originalImgArr=[
            {
                // imgUrl:'http://jiayouzan.oss-cn-hangzhou.aliyuncs.com/22bb5b35f82a68a472b1d10007f087ec.png',
                linkUrl:url+ '/gaslist',
                linkUrlVip:url+ '/myhome'
            },
            {
                linkUrl:'http://mp.weixin.qq.com/s/jvX4Tkzakg_ZhC-cDFS47w',
                linkUrlVip:url+ '/myhome'
            },
            {
                linkUrl:url +'mycouponlist',
                linkUrlVip:url + '/mycoupon'
            },
            {
                linkUrl:url +'/servicelist',
                linkUrlVip:url +'/servicelist2'
            },
            {
                linkUrl:'http://mp.weixin.qq.com/s/qd7sIRBKSXZdHGgwDPZroQ',
                linkUrlVip:url +'/service'
            },
            {
                linkUrl:'http://mp.weixin.qq.com/s/qd7sIRBKSXZdHGgwDPZroQ',
                linkUrlVip:'http://mp.weixin.qq.com/s/qd7sIRBKSXZdHGgwDPZroQ'
            },
            {
                linkUrl:'http://mp.weixin.qq.com/s/c1mSwF8nMcOdcsh8wgDIxQ',
                linkUrlVip:url + '/agentservice'
            },
            {
                linkUrl:'http://mp.weixin.qq.com/s/9kTK8qxkFHOWIFC_GScYfw',
                linkUrlVip:'http://mp.weixin.qq.com/s/9kTK8qxkFHOWIFC_GScYfw'
            }
        ];

        this.areaImgObj= {
            '98':'http://jiayouzan.oss-cn-hangzhou.aliyuncs.com/22bb5b35f82a68a472b1d10007f087ec.png',//武汉9.8折加油
            '99':'http://jiayouzan.oss-cn-hangzhou.aliyuncs.com/713f9ccff462ae80c1e66ab2ccf0563c.jpeg'//南昌9.9折加油
        };

    };

    pt.showTemplateHtml=function(res){
        var rate=res.city.rate;
        if(rate==99 || rate==98){
            var temp={
                imgUrl:this.areaImgObj[rate],
                linkUrl:this.originalImgArr[0].linkUrl,
                linkUrlVip:this.originalImgArr[0].linkUrlVip
            };
            this.originalImgArr.splice(0,1,temp);
        }

        var isvip=res.my.vip_level_id>=1?true:false;

        var imgHtml=Template('privilegeTemp',{privilegeArr:this.originalImgArr,isvip:isvip});

        this.ctrlLoadingIcon(false);
        $('#privilege-detail-info').html(imgHtml);
    };


    /*获取信息
    *http://xx.com/v2/user_vip_orders
    *GET
    * */
    pt.getPrivilegeInfo=function(callback){
        var that=this;
        this.ctrlLoadingIcon();
        var param={},
            url='/v2/user_vip_level',
            options={
                errorCallback:function(res){
                    that.ctrlLoadingIcon(false);
                    callback(res);
                    this.showTips({txt:'加载失败，'+result});
                }
            };
        this.getDataAsync(url,param,function(res){
            callback(res);
        },options);
    };


    /*获取失败*/
    pt.getInfoError=function(result){
        this.ctrlLoadingIcon(false);
        this.showTips({txt:'加载失败，'+result});
    };

    return Privilege;
});