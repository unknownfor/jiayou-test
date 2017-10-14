define(['base'],function (BaseClass) {
        function city($wrapper) {

            BaseClass.call(this,$wrapper);

            //加载城市事件
            $('body').on('click', '#zone_ids,#gr_zone_ids', function () {
                var zid = $(this).attr('id');
                $('.container').show();

            });
            //选择城市 start
            $('body').on('click', '.city-list p', function () {
                var type = $('.container').data('type');
                $('#zone_ids').html($(this).html()).attr('data-id', $(this).attr('data-id'));
                $('#gr_zone_ids').html($(this).html()).attr('data-id', $(this).attr('data-id'));
                $('.container').hide();
            });
            $('body').on('click', '.letter a', function () {
                var s = $(this).html();
                $(window).scrollTop($('#' + s + '1').offset().top);
            });

        };

        city.prototype=new BaseClass();
        city.constructor=city;

        var pt=city.prototype;





        return city;
    });