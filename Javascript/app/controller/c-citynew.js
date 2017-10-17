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

    //
    // //http://xx.com/v2/car_branches
    // pt.getCarBrandInfo = function () {
    //     this.ctrlLoadingIcon();
    //     var param={},
    //         url='/v2/car_branches',
    //         options={
    //             errorCallback:$.proxy(this,'getInfoError')
    //         };
    //     this.getDataAsync(url,param,$.proxy(this,'getInfoSuccess'),options);
    // };
    //
    // /*获取失败*/
    // pt.getInfoError=function(result){
    //     this.ctrlLoadingIcon(false);
    //     this.showTips({txt:'信息加载失败，'+result});
    // };
    //
    //
    // /*获取成功*/
    // pt.getInfoSuccess=function(data){
    //     this.ctrlLoadingIcon(false);
    //     this.showCarBrandInfo(data);
    // };
    //
    // pt.showCarBrandInfo = function (result) {
    //     if(result.length==0){
    //         this.showTips({txt:'获取列表失败，'+result});
    //         return;
    //     }else{
    //         this.getCapitalInfo();
    //         var str=this.getCarBrandInfoAll(result);
    //         $('.container').prepend(str);
    //     }
    // };
    //
    //
    // pt.getCarBrandInfoAll=function (data) {
    //     var str='',
    //         item;
    //     for(var key in data){
    //         item=data[key];
    //         str+= '<div class="city">' +
    //             '<div class="city-letter" id="'+ key +1 +'">'+ key +'</div>' +
    //             this.getSingleCarBrandInfoStr(item)+
    //             '</div>'+
    //             '</div>';
    //     }
    //     return str;
    // };
    //
    //
    // pt.getSingleCarBrandInfoStr=function(brand){
    //     var str='',
    //         url,
    //         item;
    //     var len=brand.length;
    //     for(var i = 0;i<len;i++) {
    //         item=brand[i];
    //         url=window.urlObject.ctrl+'/carmodel/id/';
    //         str+=  '<div class="city-list">' +
    //             '<a href="'+ url + item.id+'"> '+
    //             '<p class="brand" data-id="'+ item.id +'">' +
    //             '<img class="icon-car" src="'+ item.logo_img +'">' +
    //             '<span>'+ item.name +'</span>' +
    //             '</p>' +
    //             '</a>'+
    //             '</div>';
    //     }
    //     return str;
    // };
    //
    //
    // pt.getCapitalInfo = function () {
    //     var str = '<div class="letter">' +
    //         '            <ul>' +
    //         '                <li><a href="javascript:;">A</a></li>' +
    //         '                <li><a href="javascript:;">B</a></li>' +
    //         '                <li><a href="javascript:;">C</a></li>' +
    //         '                <li><a href="javascript:;">D</a></li>' +
    //         '                <li><a href="javascript:;">E</a></li>' +
    //         '                <li><a href="javascript:;">F</a></li>' +
    //         '                <li><a href="javascript:;">G</a></li>' +
    //         '                <li><a href="javascript:;">H</a></li>' +
    //         '                <li><a href="javascript:;">J</a></li>' +
    //         '                <li><a href="javascript:;">K</a></li>' +
    //         '                <li><a href="javascript:;">L</a></li>' +
    //         '                <li><a href="javascript:;">M</a></li>' +
    //         '                <li><a href="javascript:;">N</a></li>' +
    //         '                <li><a href="javascript:;">P</a></li>' +
    //         '                <li><a href="javascript:;">Q</a></li>' +
    //         '                <li><a href="javascript:;">R</a></li>' +
    //         '                <li><a href="javascript:;">S</a></li>' +
    //         '                <li><a href="javascript:;">T</a></li>' +
    //         '                <li><a href="javascript:;">W</a></li>' +
    //         '                <li><a href="javascript:;">X</a></li>' +
    //         '                <li><a href="javascript:;">Y</a></li>' +
    //         '                <li><a href="javascript:;">Z</a></li>' +
    //         '            </ul>' +
    //         '        </div>';
    //     $('.container').append(str);
    // };




    return city;
});