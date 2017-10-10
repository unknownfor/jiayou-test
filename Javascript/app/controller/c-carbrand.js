/**
 * Created by mayoi on 2017/10/10.
 */
//车型


define(['base','wx'],function (BaseClass,wx) {
    function carBrand($wrapper) {

        BaseClass.call(this,$wrapper);

        var that=this;

        this.getCarBrandInfo();

        //加载城市事件
        //选择城市
        $('body').on('click', '.city-list p', function () {
            // var type = $('.container').data('type');
            $('#gr_zone_ids').html($(this).html()).attr('data-id', $(this).attr('data-id'));
            // $('.container').hide();
        });
        $('body').on('click', '.letter a', function () {
            var s = $(this).html();
            $(window).scrollTop($('#' + s + '1').offset().top);
        });

    };


    carBrand.prototype=new BaseClass();
    carBrand.constructor=carBrand;

    var pt=carBrand.prototype;

    pt.getCarBrandInfo = function () {
        this.ctrlLoadingIcon();
        // var param={},
        //     url='v2/car_series/{id}/motorcycle_type',
        //     options={
        //         errorCallback:$.proxy(this,'getInfoError')
        //     };
        // this.getDataAsync(url,param,$.proxy(this,'getInfoSuccess'),options);

        var url='../data/brand.json';
        $.getJSON(url,null,$.proxy(this,'getInfoSuccess'));
    };

    /*获取失败*/
    pt.getInfoError=function(result){
        this.ctrlLoadingIcon(false);
        this.showTips({txt:'信息加载失败，'+result});
    };


    /*获取成功*/
    pt.getInfoSuccess=function(data){
        this.ctrlLoadingIcon(false);
        this.showCarBrandInfo(data);
    };

    pt.showCarBrandInfo = function (result) {
        if(result.length==0){
            this.showTips({txt:'获取列表失败，'+result});
            return;
        }else{
            this.getCapitalInfo();
            var str=this.getCarBrandInfoAll(result);
            $('.container').prepend(str);
        }
    };


    pt.getCarBrandInfoAll=function (data) {
        var len=data.length,
            str='',
            item;
        for(var i=0;i<len;i++){
            item=data[i];
            str+=  '   <div class="city">' +
                '            <div class="city-letter">'+ item.bfirstletter +'</div>' +
                this.getSingleCarBrandInfoStr(data)+
                '            </div>'+
                '            </div>';
        }
        return str;
    };


    pt.getSingleCarBrandInfoStr=function(brand){
        var len=brand.length,
            str='',
            item;
        for(var i=0;i<len;i++){
            item=brand[i];
            str+=  '<div class="city-list">' +
                '                <p class="brand" data-id="'+ item.id +'">' +
                '                    <img class="icon-car" src="'+ item.logo_img +'">' +
                '                    <span>'+ item.name +'</span>' +
                '                </p>' +
                '            </div>'   ;
        }
        return str;
    };


    pt.getCapitalInfo = function () {
        var str ='';
        str = '      <div class="letter">' +
            '            <ul>' +
            '                <li><a href="javascript:;">A</a></li>' +
            '                <li><a href="javascript:;">B</a></li>' +
            '                <li><a href="javascript:;">C</a></li>' +
            '                <li><a href="javascript:;">D</a></li>' +
            '                <li><a href="javascript:;">E</a></li>' +
            '                <li><a href="javascript:;">F</a></li>' +
            '                <li><a href="javascript:;">G</a></li>' +
            '                <li><a href="javascript:;">H</a></li>' +
            '                <li><a href="javascript:;">J</a></li>' +
            '                <li><a href="javascript:;">K</a></li>' +
            '                <li><a href="javascript:;">L</a></li>' +
            '                <li><a href="javascript:;">M</a></li>' +
            '                <li><a href="javascript:;">N</a></li>' +
            '                <li><a href="javascript:;">P</a></li>' +
            '                <li><a href="javascript:;">Q</a></li>' +
            '                <li><a href="javascript:;">R</a></li>' +
            '                <li><a href="javascript:;">S</a></li>' +
            '                <li><a href="javascript:;">T</a></li>' +
            '                <li><a href="javascript:;">W</a></li>' +
            '                <li><a href="javascript:;">X</a></li>' +
            '                <li><a href="javascript:;">Y</a></li>' +
            '                <li><a href="javascript:;">Z</a></li>' +
            '            </ul>' +
            '        </div>';
        $('.container').append(str);
    };




    return carBrand;
});