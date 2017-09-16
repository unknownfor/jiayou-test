/**
 * Created by Jimmy on 2017/07/28.
 */
//我的订单信息

define(['base'],function (BaseClass) {
    function BaseOrderDetail(options) {
        var defaultOptions={
            sCallback:null,
            eCallback:function(){console.log('订单详细信息加载失败')}
        }
        this.options = this.extentConfig(defaultOptions,options);
    };

    BaseOrderDetail.prototype=new BaseClass();
    BaseOrderDetail.constructor=BaseOrderDetail;

    var pt=BaseOrderDetail.prototype;

    /*获取订单详情*/
    pt.getOrderDetailInfo=function(id){
        this.ctrlLoadingIcon();
        var that=this,
            param={
                order_id:id
            },
            url='/v1/order_detail',
            options={
                errorCallback:function(res){
                    that.ctrlLoadingIcon(false);
                    that.showTips({txt:'获取订单详情失败'});
                    this.options.sCallback &&this.options.sCallback();
                }
            };
        this.getDataAsync(url,param,$.proxy(this,'getOrderDetailSuccess'),options);
    };

    /*获取成功*/
    pt.getOrderDetailSuccess=function(result){
        this.ctrlLoadingIcon(false);
        var str=this.getHtmlStr(result);
        this.options.sCallback && this.options.sCallback({htmlStr:str,code:result.code});
    };

    pt.getHtmlStr=function(result){
        var taxStr='',
            saveStr='',
            invoiceStr='';
        if(result.tax_sn){
            taxStr='<div class="key-val-item no-border">'+
                    '<span class="key">统一社会信用码:</span>'+
                    '<span class="val">'+result.tax_sn+'</span>'+
                    '</div>';
            if(result.invoice){
                invoiceStr='<div class="key-val-item">'+
                    '<span class="key">发票抬头:</span>'+
                    '<span class="val">'+result.invoice+'</span>'+
                    '</div>';
            }
        }
        if(result.discount_fee>0){
            saveStr='（节省'+result.discount_fee+'元）';
        }
        var str='<div class="key-val-item">'+
                    '<span class="key">验证码:</span>'+
                    '<span class="val">'+result.code+'</span>'+
                '</div>'+
                '<div class="key-val-item">'+
                    '<span class="key">加油站名称:</span>'+
                    '<span class="val">'+result.title+'</span>'+
                '</div>'+
                '<div class="key-val-item">'+
                    '<span class="key">商品名称:</span>'+
                    '<span class="val">'+result.gun+'号枪－'+result.oilno+'，挂牌价: '+result.gpprice+'元</span>'+
                '</div>'+
                '<div class="key-val-item">'+
                    '<span class="key">实付金额:</span>'+
                    '<span class="val">'+result.final_fee+'元'+saveStr+'</span>'+
                '</div>'+
                invoiceStr+
                taxStr+
                '<div class="key-val-item pay-type-item">'+
                    '<span class="key">支付方式:</span>'+
                    '<span class="val">'+this.getPayType(result.pay_type)+'</span>'+
                '</div>'+
                '<div class="key-val-item">'+
                    '<span class="key">订单编号:</span>'+
                    '<span class="val">'+result.ordersn+'</span>'+
                '</div>'+
                '<div class="key-val-item">'+
                    '<span class="key">订单时间:</span>'+
                    '<span class="val">'+this.getTimeFromTimestamp(result.addtime,'yyyy-MM-dd hh:mm:ss')+'</span>'+
                '</div>';
        return str;

    };

    pt.getPayType=function(type){
        var str='';
        switch(type){
            case 'wechat':
                str='微信支付';
                break;
            case 'alipay':
                str='支付宝支付';
                break;
            case 'cash':
                str='现金支付';
                break;
            default :
                str='其他支付';
                break;

        }
        return str;
    }

    return BaseOrderDetail;
});