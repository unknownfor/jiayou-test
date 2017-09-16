/**
 * Created by Jimmy on 2017/07/28.
 */
//加油枪信息

define(['base','wx'],function (BaseClass,wx) {
    function Gas($wrapper) {
        BaseClass.call(this,$wrapper);
        this.stationId=$wrapper.attr('data-id');
        this.showDiscountInfo();

        //油枪选择
        $(document).on('input','#gun-input',$.proxy(this,'gunInput'));

        //充值金额
        $(document).on('focus','#amount-input',$.proxy(this,'amountInputFocus'));

        //充值金额
        $(document).on('input','#amount-input',$.proxy(this,'amountInput'));

        //选择常用金额
        $(document).on(this.eventName,'.common-amount-box>div',$.proxy(this,'selectCommonAccount'));

        //结算
        $(document).on(this.eventName,'.order-btn',$.proxy(this,'doOrder'));

    };

    Gas.prototype=new BaseClass();
    Gas.constructor=Gas;

    var pt=Gas.prototype;

    pt.showDiscountInfo=function(){
        var discountInfoStr=this.getInfoFromStorage(this.storageKeyArr[1]),
            discountObj=JSON.parse(discountInfoStr);
        if(!discountObj.discountType || discountObj.discountType=='undefined'){
            return;
        }
        var discountObj=JSON.parse(discountInfoStr),
            discountInfo = this.getDiscountInfo(discountObj);
        $('.location-box').append(discountInfo.type);
        $('.discount-desc-box').html(discountInfo.desc).show();
    };

    /*油枪选择控制*/
    pt.gunInput=function(e){
        var $target=this.getTargetByEvent(e),
            val=$target.val();
        if(val!=''){
            this.calcGasInfo();
        }else{
            $('#gas-type').removeClass('show');
            this.ctrlAmountInputStatus(false);
            this.ctrlOrderBtnStatus(false);
        }
    };

    /*通过油枪和金额计算信息*/
    pt.calcGasInfo=function(){
        this.ctrlLoadingIcon();
        var param={
                sid:this.stationId,
                gun_sn:$('#gun-input').val(),
                amount:$('#amount-input').val()
            },
            url='/v1/select_gun',
            options={
                type:'post',
                errorCallback:$.proxy(this,'calcGasInfoError')
            };
        this.getDataAsync(url,param,$.proxy(this,'calcGasInfoSuccess'),options);
    };

    pt.calcGasInfoSuccess=function(result){
        this.ctrlLoadingIcon(false);
        var gasNo=result.no;
        $('#gas-type').text(gasNo).addClass('show');
        $('#gun-input').attr({'data-id':result.id,'data-sn':result.sn});
        var isNo0=gasNo=='0#';
        this.ctrlAmountInputStatus(true,isNo0);

        var vol=result.num;
        if(vol){
            $('#gas-vol').text(vol+'L').addClass('show');
            //结算按钮可用
            this.ctrlOrderBtnStatus(true);
        }else{
            $('#gas-vol').text('').removeClass('show');
            //结算按钮不可用
            this.ctrlOrderBtnStatus(false);
        }
    }

    pt.calcGasInfoError=function(){
        this.ctrlLoadingIcon(false);
        $('#gas-type').text('请正确输入油枪号').addClass('show');
        this.ctrlAmountInputStatus(false,false);

        //结算按钮不可用
        this.ctrlOrderBtnStatus(false);
    }

    /*控制金额输入框信息*/
    pt.ctrlAmountInputStatus=function(disabledFlag,isNo0){
        var $target = $('#amount-input');
        if(disabledFlag){
            $target.removeAttr('disabled');
        }else{
            $target.attr('disabled',true);
        }
        if(isNo0){
            $target.attr({'placeholder':'最大9999','max':9999});
            //油枪切换时，控制最大值
            if($target.val()>=999){
                $target.val(9999);
            }
        }else{
            $target.attr({'placeholder':'最大999','max':999});
            if($target.val()>=9999){
                $target.val(999);
            }
        }
    };

    /*选择常用的金额*/
    pt.selectCommonAccount=function(e){
        var $target=this.getTargetByEvent(e);
        $target.addClass('selected').siblings().removeClass('selected');
        var amount=$target.text().replace('元','')|0;
        $('#amount-input').val(amount);
        this.calcGasInfo();
    };

    /*清除常用金额选中情况*/
    pt.notUseCommonAccount=function(){
        $('.common-amount-box .selected').removeClass('selected');
    }

    pt.amountInputFocus=function(){
        $('.common-amount-box').addClass('show');
    };

    /*计算价格*/
    pt.amountInput=function(e){
        var $target=this.getTargetByEvent(e),
            val=$target.val(),
            max=$target.attr('max') | 0;

        if(!val || parseFloat(val)<=0){
            this.ctrlOrderBtnStatus(false);
            return;
        }
        if(val>max){
            this.showTips({txt:'最大金额为'+max+'元'});
            $target.val(max);
            //return;
        }
        this.notUseCommonAccount();
        this.calcGasInfo();
    }

    /*结算按钮是否可用*/
    pt.ctrlOrderBtnStatus=function(flag){
        var $target=$('.order-btn');
        if(flag) {
            $target.removeClass('disabled');
        }else{
            $target.addClass('disabled');
        }
    }

    /*结算*/
    pt.doOrder=function(){
        var type=$('#gas-type').text().replace('#',''),  //去除 ＃
            amount=$('#amount-input').val();
        //跳转订单页面
        var url=window.urlObject.ctrl+'/order?'+
            'gun_id='+$('#gun-input').attr('data-id')+
            '&gun_sn='+$('#gun-input').attr('data-sn')+
            '&type='+type+
            '&amount='+amount;
        window.location.href=url;
    };

    return Gas;
});