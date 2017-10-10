/**
 * Created by Jimmy on 2017/07/28.
 */
//加油枪信息

define(['base','coupon','confirmbox','wx','wxconfig'],function (BaseClass,Coupon,Confirmbox,wx,Wxconfig) {
    function Order($wrapper) {
        BaseClass.call(this,$wrapper);

        this.amount=parseFloat($('.gas-type-amount .val').attr('data-amount'));

        this.checkIconObj= {
            icon1: ['icon-checknormal', 'icon-checkedon'],
            icon2: ['icon-check3', 'icon-check4']
        }

        this.getMyCouponInfo();  //我的未使用的优惠券

        this.getMyInvoiceInfo(); //我的发票列表
        //this.getMyInvoiceInfo1(); //我的发票列表

        this.clearStorage(this.storageKeyArr[6]); //删除支付成功后领取红包的标志

        //优惠券选择
        $(document).on(this.eventName,'.discount-default-box .val',$.proxy(this,'chooseCoupon'));

        //发票选择
        $(document).on(this.eventName,'.invoice-default-box .val',$.proxy(this,'showInvoiceBox'));

        //结算
        $(document).on(this.eventName,'.order-btn',$.proxy(this,'commitOrder'));

        //关闭发票选择
        $(document).on(this.eventName,'#close-invoice-box',$.proxy(this,'hideInvoiceBox'));

        //选择发票
        $(document).on(this.eventName,'#invoice-box li .left-box, #invoice-box li .middle-box',$.proxy(this,'selectInvoice'));

        //设置默认
        $(document).on(this.eventName,'#invoice-box li .invoice-default-btn',$.proxy(this,'setDefaultInvoice'));

        //添加新的发票
        $(document).on(this.eventName,'#new-invoice-btn,#new-invoice-btn span, #new-invoice-btn label',$.proxy(this,'showNewInvoiceBox'));

        //新发票类型，
        $(document).on(this.eventName,'#new-invoice-ul .invoice-type-btns .btn',$.proxy(this,'chooseNewInvoiceType'));

        //个人发票
        $(document).on('input','#personal-name-input',$.proxy(this,'personalInput'));

        $(document).on('input','#edit-personal-name-input',$.proxy(this,'editPersonalInput'));

        //公司发票
        $(document).on('input','#company-name-input,#company-taxno-input',$.proxy(this,'companyInput'));

        $(document).on('input','#edit-company-name-input,#edit-company-taxno-input',$.proxy(this,'editCompanyInput'));

        //关闭添加新发票框
        $(document).on(this.eventName,'#close-new-invoice-box,#cancel-new-invoice',$.proxy(this,'hideNewInvoiceBox'));

        //保存新发票
        $(document).on(this.eventName,'#save-new-invoice',$.proxy(this,'saveNewInvoice'));

        //删除发票
        $(document).on(this.eventName,'.invoice-delete-btn',$.proxy(this,'deleteInvoice'));

        //编辑发票
        $(document).on(this.eventName,'.invoice-edit-btn',$.proxy(this,'editInvoice'));

        //关闭编辑发票弹窗
        $(document).on(this.eventName,'#close-edit-invoice-box,#cancel-edit-invoice',$.proxy(this,'hideEditInvoiceBox'));

        //保存 编辑的发票
        $(document).on(this.eventName,'#save-edit-invoice',$.proxy(this,'saveEditInvoice'));

    };

    Order.prototype=new BaseClass();
    Order.constructor=Order;

    var pt=Order.prototype;

    /*获取我的优惠券*/
    pt.getMyCouponInfo=function(){
        var options={
            sCallback:$.proxy(this,'getCouponInfoSuccess'),
            eCallback:$.proxy(this,'getCouponInfoError')
        };
        new Coupon(options);
    };

    /*获取成功*/
    pt.getCouponInfoSuccess=function(result){

        //判断当前最优 优惠券
        var len=result.length;
        if(len==0){
            this.setFinalAmountInfo('暂无可用红包','去支付￥'+this.amount);
            return;
        }

        //是否使用手动选择的优惠券
        var selectedCouponId = this.$wrapper.attr('data-coupon-id');
        if(selectedCouponId!='0'){
            //需要取出选择好的 优惠券id，金额
            this.selectedCouponId=selectedCouponId;
            this.humanChooseBestCoupon(selectedCouponId,result);
        }
        else{
            //自动选择最优
            this.autoChooseBestCoupon(result);
        }

    };

    /*默认选择优惠最高优惠券*/
    pt.autoChooseBestCoupon=function(result){
        var len = result.length,
            item,
            discountAmount = 0,
            that=this;
        //得到优惠力度最大的优惠券
        //type 1为代金券, 2为增值代金券, 3为折扣券 ,4 超级折扣券
        if(this.$wrapper.attr('data-type')!='0#') {  //柴油不能使用优惠券
            for (var i = 0; i < len; i++) {
                item = result[i];
                var timeFlag = this.isAtTimeDuration(item.startime, item.endtime);
                if (!timeFlag) {
                    continue;
                }
                var tempAmount = this.calcDiscountAmount(item);
                if (tempAmount > discountAmount) {
                    discountAmount = tempAmount;
                    that.selectedCouponId = item.id;
                }
            }
        }
        if(discountAmount>0) {
            var payAmountTxt ='去支付￥'+ (this.amount - discountAmount)+'（已节省￥'+discountAmount.toFixed(2)+'）';
            this.setFinalAmountInfo('－￥'+discountAmount.toFixed(2),payAmountTxt);
        }else{
            this.setFinalAmountInfo('暂无可用红包','去支付￥'+this.amount);
        }

    };



    /*手动选择优惠券*/
    pt.humanChooseBestCoupon=function(id,result){
        var len = result.length,
            item,
            discountAmount = 0;

        //得到优惠力度最大的优惠券
        //type 1为代金券, 2为增值代金券, 3为折扣券 ,4 超级折扣券
        for(var i=0;i<len;i++){
            item=result[i];
            if(item.id==id) {
                var tempAmount = this.calcDiscountAmount(item);
                discountAmount = tempAmount;
                break;
            }
        }
        var payAmountTxt ='去支付￥'+ (this.amount - discountAmount)+'（已节省￥'+discountAmount.toFixed(2)+'）';
        this.setFinalAmountInfo('－￥'+discountAmount.toFixed(2),payAmountTxt);
    };



    pt.setFinalAmountInfo=function(str1,str2){
        $('#discount-amount').text(str1);
        $('.order-btn').text(str2).show();
    };

    /*计算优惠金额*/
    pt.calcDiscountAmount=function(item){
        var discountAmount=0;
        switch (item.type){
            case 1:
            case 2:
            case 5:
                if(this.amount >= item.condition) {
                    discountAmount = item.discount;
                }
                break;
            case 3:
            case 4:
                if(this.amount >= item.condition) {
                    discountAmount = (this.amount * item.discount_rate / 100);
                }
                break;
            default :
                break;
        }
        return parseFloat(discountAmount);
    };

    /*获取失败*/
    pt.getCouponInfoError=function(result){
        console.log(result);
    };

    /*获取发票列表*/
    pt.getMyInvoiceInfo=function(){
        var param={
                page:1,
                pageSize:20
            },
            url='/v1/invoice_list',
            options={
                errorCallback:$.proxy(this,'getInvoiceInfoError')
            };
        this.getDataAsync(url,param,$.proxy(this,'getInvoiceInfoSuccess'),options);
    };
    /*获取发票列表*/
    pt.getMyInvoiceInfo1=function(){
        var url = window.urlObject.json + 'invoicelist.json';
        $.getJSON(url, null, $.proxy(this, 'getInvoiceInfoSuccess'));
        return;
    };

    /*获取成功*/
    pt.getInvoiceInfoSuccess=function(result){
        var str=this.getInvoiceStr(result);
        $('#invoice-ul').prepend(str);

        //设置默认的发票信息
        this.setInvoiceInfo();
    };

    /*填充当前选择好的发票信息*/
    pt.setInvoiceInfo=function(){
        var title='如需发票，请填写抬头并到收银台索取';
        if(this.currentSelectInvoiceInfo){
            if(this.currentSelectInvoiceInfo.title!='不开发票'){
                title=this.currentSelectInvoiceInfo.title;
            }
        }
        $('.invoice-default-box .selected-invoice-title').text(title);
    };

    /*
    *拼接 发票地址 字符串
    */
    pt.getInvoiceStr=function(result){
        var len=result.length,
            item,
            str='';
        for(var i=0;i<len;i++){
            item=result[i];
            var iconIndex=0;
            if(item.is_default) {
                iconIndex=1;

                //当前选择好的发票信息
                this.currentSelectInvoiceInfo={
                    id:item.id,
                    type:item.type,
                    title:item.title,
                    taxNo:item.tax_sn
                };
            }
            str+='<li data-id="'+item.id+'" data-type="'+item.type+'">'+
                    '<div class="left-box">'+
                        '<span class="iconfont '+this.checkIconObj.icon1[iconIndex]+'"></span>'+
                    '</div>'+
                    '<div class="middle-box">'+
                        this.getInvoiceTitleByType(item)+
                    '</div>'+
                    '<div class="right-box">'+
                        '<div class="invoice-default-btn">'+
                            '<span class="iconfont '+this.checkIconObj.icon2[iconIndex]+'"></span>'+
                            '<span class="txt">默认使用</span>'+
                        '</div>'+
                        '<div class="invoice-item-btns">'+
                            '<span class="invoice-edit-btn">编辑</span>'+
                            '<span class="invoice-delete-btn">删除</span>'+
                        '</div>'+
                    '</div>'+
                '</li>';
        }
        return str;
    };

    /*根据发票类型获取发票抬头*/
    pt.getInvoiceTitleByType=function(item){
        var str='<div class="invoice-title" data-title="'+item.title+'">'+item.title+'</div>';
        if(item.type==2){
            str +='<div class="invoice-taxno">'+item.tax_sn+'</div>';
        }
        return str;
    };

    /*获取失败*/
    pt.getInvoiceInfoError=function(result){
        console.log(result);
    };

    /*跳转到优惠券列表*/
    pt.chooseCoupon=function(){
        var id = $('#discount-amount').attr('data-coupon-id');
        if(this.selectedCouponId) {
            var url = window.urlObject.ctrl + '/available_coupon?' +
                'gun_id=' + this.$wrapper.attr('data-gun-id') +
                '&gun_sn=' + this.$wrapper.attr('data-gun-sn') +
                '&type=' + this.$wrapper.attr('data-type').replace('#', '') +
                '&amount=' + this.amount+
                '&coupon_id='+this.selectedCouponId
            window.location.href = url;
        }
    };

    pt.showInvoiceBox=function(){
        $('#invoice-box').addClass('show');
    };

    /*关闭发票选择*/
    pt.hideInvoiceBox=function(){
        $('#invoice-box').removeClass('show');
    };

    /*选择发票*/
    pt.selectInvoice=function(e){
        var $target=this.getTargetByEvent(e).closest('li').find('.left-box'),
            $icon=$target.find('.iconfont'),
            $li=$target.closest('li'),
            $otherLi=$li.siblings(),
            $otherIcon=$otherLi.find('.left-box .iconfont');
        $icon.removeClass(this.checkIconObj.icon1[0]).addClass(this.checkIconObj.icon1[1]);
        $otherIcon.removeClass(this.checkIconObj.icon1[1]).addClass(this.checkIconObj.icon1[0]);

        //当前选择好的发票信息
        this.currentSelectInvoiceInfo={
            id:$li.attr('data-id'),
            type:$li.attr('data-type'),
            title:$li.find('.invoice-title').attr('data-title'),
            taxNo:$li.find('.invoice-taxno').text()
        };
        this.setInvoiceInfo();
        this.hideInvoiceBox();
    };


    /*设置为默认发票*/
    pt.setDefaultInvoice=function(e){
        var $target=this.getTargetByEvent(e).closest('.invoice-default-btn'),
            $icon=$target.find('.iconfont'),
            $li=$target.closest('li'),
            $otherLi=$li.siblings(),
            $otherIcon=$otherLi.find('.invoice-default-btn .iconfont');
        $otherIcon.removeClass(this.checkIconObj.icon2[1]).addClass(this.checkIconObj.icon2[0]);
        if($icon.hasClass(this.checkIconObj.icon2[0])) {
            $icon.removeClass(this.checkIconObj.icon2[0]).addClass(this.checkIconObj.icon2[1]);
            this.execSetDefaultInvoice($li.attr('data-id'));
        }
    };

    pt.execSetDefaultInvoice=function(id){
        var url = '/v1/invoice_default',
            that = this,
            params = {
                id: id
            },
            options = {
                type: 'put',
                openId: true,
                errorCallback: function (res) {
                    that.showTips({txt: '设置失败'});
                }
            };

        this.getDataAsync(url, params, function (result) {
            if (result.code = 201) {

            }
        }, options)
    };

    /*添加新发票*/
    pt.showNewInvoiceBox=function(){
        var len=$('#invoice-ul li').length;
        if(len==6){
            this.showTips({txt:'只能添加5条发票信息！'});
            return;
        }
        $('#new-invoice-box').show().siblings().hide();
    };


    pt.hideNewInvoiceBox=function(){
        $('#my-invoice-box').show().siblings().hide();
    };

    /*新发票类型*/
    pt.chooseNewInvoiceType=function(e){
        var $target=this.getTargetByEvent(e),
            index=$target.index(),
            type=2;
        $target.removeClass('default-btn').siblings().addClass('default-btn');

        var $personal=$('.personal-invoice'),
            $company=$('.company-invoice');
        if(index==0){
            $company.addClass('hide');
            $personal.removeClass('hide');
            type=1;
            this.personalInput();
        }else{
            $personal.addClass('hide');
            $company.removeClass('hide');
            this.companyInput();
        }

        $target.parent().attr('data-new-type',type);   //把发票类型纪录下来
    };

    /*个人发票*/
    pt.personalInput=function(){
        var $target=$('#personal-name-input'),
            val=$target.val(),
            $btn=$('#save-new-invoice');
        this.controlPersonalBtn(val,$btn);
    };

    /* 单位发票*/
    pt.companyInput=function(){
        var name=$('#company-name-input').val(),
            textNo=$('#company-taxno-input').val(),
            $btn=$('#save-new-invoice');
        this.controlCompanyBtn(name,textNo,$btn);
    };

    /*保存新的*/
    pt.saveNewInvoice=function(){
        var that=this,
            type=$('.invoice-type-btns').attr('data-new-type'),
            params= {
                type: $('.invoice-type-btns').attr('data-new-type')
            };
        if(type==2){
            params.title =$('#company-name-input').val();
            params.tax_sn=$('#company-taxno-input').val();
            var flag = this.uniqueTaxNo(params.tax_sn);
            if(!flag){
                this.showTips({txt:'税号与其它发票重复！'});
                return;
            }
        }else{
            params.title =$('#personal-name-input').val();
        }
        var url='/v1/invoice_add',
            options={
                type:'post',
                token:true,
                errorCallback:function(res){
                    that.showTips({txt:'添加失败'});
                }
            };

        this.getDataAsync(url,params,function(result){
            params.id = result;
            var str = that.getInvoiceStr([params]);
            $('#invoice-ul').prepend(str);

            $('#company-name-input,#company-taxno-input,#personal-name-input').val('');
            that.hideNewInvoiceBox();
        },options);
    };

    /*判断发票号是否重复*/
    pt.uniqueTaxNo=function(val){
        var $li=$('#invoice-ul li'),
            flag=true;
        $li.each(function(){
            if($(this).attr('data-type')==2){
                if($(this).find('.invoice-taxno').text()==val){
                    flag=false;
                    return false;
                }
            }
        });
        return flag;
    };

    /*删除发票提示*/
    pt.deleteInvoice=function(e){
        var that=this,
            $li=this.getTargetByEvent(e).closest('li'),
            selectedIconLen=$li.find('.icon-checkedon').length;
        if(selectedIconLen>0){
            this.showTips({txt:'不能删除当前勾选的发票'});
            return;
        }
        if(!this.confirmBox) {

            var options={
                okCallback:$.proxy(that,'execDeleteInvoice')
            }
            this.confirmBox = new Confirmbox(options);
            this.confirmBox.init();
        }
        this.confirmBox.showBox();
        $li.addClass('deleting').siblings().removeClass('deleting');  //给当前准备删除的元素加上标志
    };

    /*删除发票*/
    pt.execDeleteInvoice=function(){
        var that = this,
            $li = $('#invoice-ul .deleting'),
            id = $li.attr('data-id'),
            url ='/v1/invoice_del',
            params={
                id:id
            },
            options={
                type:'post',
                errorCallback:function(res){
                    that.showTips({txt:'删除失败'});
                }
            };

        this.getDataAsync(url,params,function(){
            $li.remove();
        },options);
    };

    /*编辑发票*/
    pt.editInvoice=function(e){
        var $target=this.getTargetByEvent(e),
            $li=$target.closest('li'),
            type=$li.attr('data-type'),
            id=$li.attr('data-id'),
            $personal=$('#edit-invoice-box .personal-invoice'),
            $company=$('#edit-invoice-box .company-invoice'),
            title=$li.find('.invoice-title').attr('data-title'),
            $typeBtns=$('#edit-invoice-ul .invoice-type-btns .btn');
        if(type==1){
            $company.addClass('hide');
            $personal.removeClass('hide');
            $('#edit-personal-name-input').val(title);

            //发票类型提示
            this.switchClass($typeBtns.eq(0),'red-btn','default-btn');
            this.switchClass($typeBtns.eq(1),'default-btn','red-btn');
        }else{
            $personal.addClass('hide');
            $company.removeClass('hide');
            $('#edit-company-name-input').val(title);
            var taxno=$li.find('.invoice-taxno').text();
            $('#edit-company-taxno-input').val(taxno);

            //发票类型提示
            this.switchClass($typeBtns.eq(1),'red-btn','default-btn');
            this.switchClass($typeBtns.eq(0),'default-btn','red-btn');
        }
        $('#edit-invoice-box').show().attr({'data-id':id,'data-type':type})
            .siblings().hide();
    };

    pt.hideEditInvoiceBox=function(){
        this.hideNewInvoiceBox();
    };

    /*
    * 保存当前编辑的发票
    */
    pt.saveEditInvoice=function(){
        var $ul=$('#edit-invoice-box'),
            type=$ul.attr('data-type'),
            id=$ul.attr('data-id');

        var that=this,
            url='/v1/invoice_edit',
            params={
                id:id,
                type:type
            },
            options={
                errorCallback:function(){
                    that.showTips({txt:'更新发票失败'});
                }
            };
        if(type==1){
            params.title=$('#edit-personal-name-input').val();
        }else{
            params.title=$('#edit-company-name-input').val();
            params.tax_sn=$('#edit-company-taxno-input').val();
            var flag = this.uniqueTaxNo(params.tax_sn);
            if(!flag){
                this.showTips({txt:'税号与其它发票重复！'});
                return;
            }
        }

        //TODO 测试
        //this.getDataAsync(url,params,function(){
        //    $('#edit-invoice-box').show().siblings().hide();
        //    //更新相应的发票信息
        //    that.updateInvoiceItem(params);
        //},options);

        that.updateInvoiceItem(params);
    }

    /*更新相应的发票纪录*/
    pt.updateInvoiceItem=function(data){
        var $li;
        $('#invoice-ul li').each(function(){
            if($(this).attr('data-id')==data.id){
                $li=$(this);
                return false;
            }
        });
        $li.find('.invoice-title').text(data.title).attr('data-title',data.title);
        $li.find('.invoice-taxno').text(data.tax_sn);
        this.hideEditInvoiceBox();
    };

    /*编辑个人发票名字*/
    pt.editPersonalInput=function(e){
        var $target=this.getTargetByEvent(e),
            val=$target.val(),
            $btn=$('#save-edit-invoice');
        this.controlPersonalBtn(val,$btn);
    };

    /*编辑公司发票名字*/
    pt.editCompanyInput=function(e){
        var name=$('#edit-company-name-input').val(),
            textNo=$('#edit-company-taxno-input').val(),
            $btn=$('#save-edit-invoice');
        this.controlCompanyBtn(name,textNo,$btn);
    };


    /*编辑或者添加发票是，控制按钮的看可用性*/
    pt.controlPersonalBtn=function(val,$btn){
        if(val.length<2 || val.length>4){
            $btn.addClass('disabled');
        }else{
            $btn.removeClass('disabled');
        }
    };
    /*编辑或者添加发票是，控制按钮的看可用性*/
    pt.controlCompanyBtn=function(val1,val2,$btn){
        var reg=/^[0-9a-zA-Z]{18}$/;
        if(val1.length==0 || val1.length>30 || !reg.test(val2)){
            $btn.addClass('disabled');
        }else{
            $btn.removeClass('disabled');
        }
    };


    /*结算*/
    pt.commitOrder=function(e){
        var $btn=this.getTargetByEvent(e),that=this;
        $btn.addClass('disabled');
        var stationInfo=this.getInfoFromStorage(this.storageKeyArr[1])
        if(stationInfo){
            stationInfo=JSON.parse(stationInfo);
        }
        var param = {
                sid:stationInfo.id,
                gun_id:this.$wrapper.attr('data-gun-id'),
                gun_sn:this.$wrapper.attr('data-gun-sn'),
                amount:this.amount
            },
            url='/v1/order_commit',
            options={
                type:'post',
                token:true,
                errorCallback:function(res){
                    that.showTips({txt:res.msg});
                    $btn.removeClass('disabled');
                }
            };

        if(this.selectedCouponId){
            param.lucy_money_record_id=this.selectedCouponId;
        }
        if(this.currentSelectInvoiceInfo && this.currentSelectInvoiceInfo.id!='0'){
            param.invoice_id=this.currentSelectInvoiceInfo.id;
        }
        this.getDataAsync(url,param,$.proxy(this,'commitOrderSCallback'),options);
    };

    /*下单成功*/
    pt.commitOrderSCallback=function(result){
        var jsApiParameters=JSON.parse(result.jsApiParameters);
        //获取微信登录信息
        var url='/v1/wx_config',
            currentUrl=window.location.href.split('#')[0],
            param={
                current_url:currentUrl
            };

        this.getDataAsync(url,param,function(data){
             var payOptions={
                 wxPayInfo: {
                     timeStamp: jsApiParameters.timeStamp.toString(), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                     nonceStr: jsApiParameters.nonceStr, // 支付签名随机串，不长于 32 位
                     package: jsApiParameters.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                     signType: jsApiParameters.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                     paySign: jsApiParameters.paySign, // 支付签名
                     sCallback: function (res) {
                         // 支付成功后的回调函数
                         window.location.href = window.urlObject.ctrl + '/payresult/id/' + result.order_id;
                     },
                     cCallback: function () {
                         $('.order-btn').removeClass('disabled');
                     }
                 }
             };
            var wxConfig=new Wxconfig(data,payOptions);
        });
    };

    //展示特权会员信息
    pt.showPrivilegeInfo = function (data) {
        var str='',
            str1;
        //如果不是会员
        if(data.status==0) {
            str = '<div class="tip">加油赞特权会员，满<span>100减2</span>，一年可省999</div>';
        }else {
            //如果是会员
            str ='<div class="tip">加油赞特权会员省'+ data.saveMoney+'元</div>';
        }
        str1= ' <a class="show-tip" href="javascript:void(0)">' +
            '        <div class="icon-box">' +
            '            <img src="../../Content/images/home/crown.png" />' +
            '        </div>' +
            str +
            '        <span class="iconfont icon-right"></span>' +
            '    </a>';
        $('.invoice-default-box').after(str1);
    };


    return Order;
});