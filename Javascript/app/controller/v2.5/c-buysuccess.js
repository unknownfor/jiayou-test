/**
 * 会员特权
 * Created by mayoi on 2017/10/09.
 */

//获得token，取得数据

define(['base','wx'],function (BaseClass,wx) {
    function Buysuccess($wrapper) {

        BaseClass.call(this,$wrapper);

        this.getBuySuccessInfo();
    }

    Buysuccess.prototype=new BaseClass();
    Buysuccess.constructor=Buysuccess;

    var pt=Buysuccess.prototype;

    /*获取信息*/
    pt.getBuySuccessInfo=function(){
        this.ctrlLoadingIcon();
        var url='../../data/buy.json';
        $.getJSON(url,null,$.proxy(this,'getInfoSuccess'));
    };


    /*获取成功*/
    pt.getInfoSuccess=function(data){
        this.ctrlLoadingIcon(false);
        // 隐藏等待
        $('.buySuccess-wrapper').removeClass('hide');
        this.hideCoverBox();
        // 隐藏菜单蒙板
        this.showBuySuccessInfo(data);
    };


    pt.showBuySuccessInfo = function (data) {
        var str='',
            item;
        item = data;
        str = '   <div class="item-box border">' +
            '        <div class="item-title">商品名称：</div>' +
            '        <div class="item-info">'+ item.name +'</div>' +
            '    </div>' +
            '        <div class="item-box color border">' +
            '            <div class="item-title">特权会员</div>' +
            '            <div class="item-info">¥'+ item.price +'</div>' +
            '        </div>' +
            '    <div class="item-box margin ">' +
            '        <div class="item-title">实付金额：</div>' +
            '        <div class="item-info">'+ item.realPrice +'（节省'+ item.save +'元）</div>' +
            '    </div>' +
            '    <div class="item-box border">' +
            '        <div class="item-title">支付方式：</div>' +
            '        <div class="item-info">微信支付</div>' +
            '    </div>' +
            '    <div class="item-box border">' +
            '        <div class="item-title">订单编号：</div>' +
            '        <div class="item-info">201702145489654</div>' +
            '    </div>' +
            '    <div class="item-box">' +
            '        <div class="item-title">订单时间：</div>' +
            '        <div class="item-info">2017-04-20 21：14：14</div>' +
            '    </div>';
    };



    return Buysuccess;
});