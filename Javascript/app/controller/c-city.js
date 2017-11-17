define(['base'],function (BaseClass) {
        function city($wrapper) {

            BaseClass.call(this,$wrapper);

            //加载城市事件
            $('body').on('click', '#zone_ids,#gr_zone_ids', function () {
                this.xx();
            });


        };

        city.prototype=new BaseClass();
        city.constructor=city;

        var pt=city.prototype;


        pt.xx = function () {

        };


        return city;
    });