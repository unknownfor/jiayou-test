/**
 * Created by mayoi on 2017/10/10.
 */
//车型
define(['base','wx'],function (BaseClass,wx) {
    function city($wrapper) {

        BaseClass.call(this,$wrapper);

        var that=this;

        // this.getCarBrandInfo();

        //加载城市事件
        //选择城市
        $('.city-wrapper').on(this.eventName, '.city-list p', function () {
            $('#gr_zone_ids').html($(this).html()).attr('data-id', $(this).attr('data-id'));
        });

        $('.city-wrapper').on(this.eventName, '.letter a', function () {
            var s = $(this).html();
            $(window).scrollTop($('#' + s + '1').offset().top);
        });

    };


    city.prototype=new BaseClass();
    city.constructor=city;

    var pt=city.prototype;





    return city;
});