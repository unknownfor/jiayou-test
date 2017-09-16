/**
 * Created by Jimmy on 2017/07/29.
 */
//确认框

define(['base'],function (BaseClass) {
    function CloseBox(options) {
        var defaultOptions={
            callback:null,
        }
        this.options = this.extentConfig(defaultOptions,options);
        $(document).on(this.eventName,'#confirm-close-box .single-btn',$.proxy(this,'ok'));
    };

    CloseBox.prototype=new BaseClass();
    CloseBox.constructor=CloseBox;

    var pt=CloseBox.prototype;

    /*获取我的优惠券*/
    pt.init=function(){
        var $box=$('#confirm-close-box');
        if($box.length==0){
            var str='<div class="modal-box conform-delete-box" id="confirm-close-box">'+
                        '<div class="modal-box-main">'+
                            '<div class="confirm-head">提示</div>'+
                            '<div class="confirm-content"></div>'+
                            '<div class="bottom-btns single-btn">确定</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
            $box=$(str);
            $('body').append($box);
        }
    };
    pt.showBox=function(params){
        var $box=$('#confirm-close-box');
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
        var $box=$('#confirm-close-box');
        $box.removeClass('show');
    }

    pt.ok=function(){
        this.hideBox();
        this.options.callback && this.options.callback();
    };

    return CloseBox;
});