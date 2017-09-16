/**
 * Created by Jimmy on 2017/07/28.
 */
//我的订单信息

define(['base','wx'],function (BaseClass,wx) {
    function OrderList($wrapper) {
        BaseClass.call(this,$wrapper);

        this.page=1;
        this.pageSize=20;
        this.loadDataStatus=0;  //0：不在加载中，1:加载中，2:所有数据已加载完

        this.getOrderListInfo();  //我的订单列表

        window.addEventListener('scroll', $.proxy(this,'loadMore'), false);

    };

    OrderList.prototype=new BaseClass();
    OrderList.constructor=OrderList;

    var pt=OrderList.prototype;

    /*获取我的订单列表*/
    pt.getOrderListInfo=function(){
        this.ctrlLoadingIcon();
        var that=this,
            param={
                page:this.page,
                pageSize:this.pageSize
            },
            url='/v1/user_order',
            options={
                errorCallback:function(){
                    that.ctrlLoadingIcon(false);
                    that.showTips({txt:'获取订单失败'});
                }
            };
        this.getDataAsync(url,param,$.proxy(this,'getOrderListSuccess'),options);

        //var url=window.urlObject.json+'/my.json';
        //$.getJSON(url,null,$.proxy(this,'getOrderListSuccess'));
    };

    /*获取成功*/
    pt.getOrderListSuccess=function(result){
        this.ctrlLoadingIcon(false);
        this.loadDataStatus=0;
        var str=this.getListStr(result),
            $main=$('#order-list-main');
        if(this.page==1) {
            if (str) {
                $main.html(str).show();
            } else {
                $('.nodata').show();
            }
        }else{
            if (str) {
                $main.append(str);
            }
            else {
                this.loadDataStatus=2;
                $('.all-data-loaded').show();
            }
        }
    };

    pt.getListStr=function(result){
        var len=result.length,
            str='',
            item,
            url=window.urlObject.ctrl+'/orderdetail/id/';
        for(var i=0;i<len;i++){
            item=result[i];
            str+='<li>'+
                    '<a href="'+url+item.id+'">'+
                        '<div class="header">'+
                            '<div>'+item.title+'</div>'+
                            '<span>'+this.getTimeFromTimestamp(item.addtime,'yyyy-MM-dd hh:mm')+'</span>'+
                        '</div>'+
                        '<div class="content">'+
                            '<div>¥ '+item.final_fee + '</div>'+
                                '<div>'+item.gun+'号油枪－' + item.oilno + '</div>'+
                            '</div>'+
                            '<div class="bottom">'+
                                '<div class="show-detail-box">'+
                                '<label>查看详情</label>'+
                                '<span class="iconfont icon-right"></span>'+
                            '</div>'+
                        '</div>'+
                    '</a>'+
                '</li>';
        }
        return str;

    };

    /*加载更多订单*/
    pt.loadMore=function(){
        var flag = $(window).scrollTop() + $(window).height() >= $(document).height()-100;

        if(flag && this.loadDataStatus==0){
            this.page++;
            this.loadDataStatus=1;
            this.loadMoreStation();
        }
    }

    /*加载更多的加油站*/
    pt.loadMoreStation=function(){

        this.ctrlLoadingIcon();
        var that=this,
            param={
                page:this.page,
                pageSize:this.pageSize
            },
            url='/v1/user_order',
            options={
                errorCallback:function(){
                    that.ctrlLoadingIcon(false);
                    that.showTips({txt:'获取订单失败'});
                }
            };
        this.getDataAsync(url,param,$.proxy(this,'getOrderListSuccess'),options);
        //var url=window.urlObject.json+'/my.json';
        //$.getJSON(url,null,$.proxy(this,'getOrderListSuccess'));
    };

    return OrderList;
});