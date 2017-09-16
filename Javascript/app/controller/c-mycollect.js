
define(['base','wx','slide2del'],function (BaseClass,wx,slide2del) {
    function myCollect($wrapper) {
        BaseClass.call(this,$wrapper);
        $(".service-list").slide2del({
            sItemClass: ".service-list",
            sDelBtnClass: ".distance",
            delHandler: function (target) {
                target.remove();
            },
            itemClickHandler: function (target) {
                console.log("你点击了选项：" + target.text());
            }
        });
    };

    myCollect.prototype=new BaseClass();
    myCollect.constructor=myCollect;

    var pt=myCollect.prototype;

    return myCollect;
});