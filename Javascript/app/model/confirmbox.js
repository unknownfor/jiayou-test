/**
 * Created by Jimmy on 2017/07/29.
 */
//确认框

define(['base'],function (BaseClass) {
    function ConfirmBox(options) {
        var defaultOptions={
            okCallback:null,
            cancleCallback:function(){}
        }
        this.options = this.extentConfig(defaultOptions,options);
        $(document).on(this.eventName,'#confirm-box .cancel-btn',$.proxy(this,'cancel'));
        $(document).on(this.eventName,'#confirm-box .ok-btn',$.proxy(this,'ok'));
    };

    ConfirmBox.prototype=new BaseClass();
    ConfirmBox.constructor=ConfirmBox;

    var pt=ConfirmBox.prototype;

    /*获取我的优惠券*/
    pt.init=function(){
        var $box=$('#confirm-box');
        if($box.length==0){
            var str='<div class="modal-box conform-delete-box" id="confirm-box">'+
                        '<div class="modal-box-main">'+
                            '<div class="confirm-head">提示</div>'+
                            '<div class="confirm-content">确定删除该记录吗？</div>'+
                            '<div class="bottom-btns">'+
                                '<div class="cancel-btn">取消</div>'+
                                '<div class="ok-btn">确定</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
            $box=$(str);
            $('body').append($box);
        }
    };
    pt.showBox=function(params){
        var $box=$('#confirm-box');
        if(params) {
            if (params.title) {
                $box.find('.confirm-head').text(params.title);
            }
            if (params.content) {
                $box.find('.confirm-content').text(params.content);
            }
        }
        $box.addClass('show');
    }

    pt.hideBox=function(){
        var $box=$('#confirm-box');
        $box.removeClass('show');
    }

    pt.cancel=function(){
        this.hideBox();
        this.options.cancleCallback && this.options.cancleCallback();
    };

    pt.ok=function(){
        this.hideBox();
        this.options.okCallback && this.options.okCallback();
    };

    return ConfirmBox;
});