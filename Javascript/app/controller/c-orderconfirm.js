/**
 * Created by Ssf on 2017/09/16.
 */
// 订单确认

define(['base', 'wx'], function (BaseClass, wx) {
    function OrderConfirm($wrapper) {
        BaseClass.call(this, $wrapper);
    }

    OrderConfirm.prototype=new BaseClass();
    OrderConfirm.constructor=OrderConfirm;

    var pt=OrderConfirm.prototype;
});