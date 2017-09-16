/**
 * Created by Jimmy on 2017/07/28.
 */
//我的订单信息

define(['base','baseorderdetail'],function (BaseClass,BaseOrderDetail) {
    function OrderDetail($wrapper) {
        BaseClass.call(this,$wrapper);
        this.init();
    };

    OrderDetail.prototype=new BaseClass();
    OrderDetail.constructor=OrderDetail;

    var pt=OrderDetail.prototype;

    pt.init=function(){
        var options={
            sCallback:$.proxy(this,'getOrderDetailSuccess')
        };
        this.baseOrderDetail=new BaseOrderDetail(options);
        this.baseOrderDetail.getOrderDetailInfo(this.$wrapper.attr('data-id'));

    };
    /*获取成功*/
    pt.getOrderDetailSuccess=function(result){
        $('.order-detail-box').html(result.htmlStr);
    };

    return OrderDetail;
});