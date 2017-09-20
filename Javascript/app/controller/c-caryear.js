/**
 * Created by mayoi on 2017/09/19.
 */
//选择汽车年份


define(['base','wx'],function (BaseClass,wx) {
    function carYear($wrapper) {

        BaseClass.call(this,$wrapper);

        this.getYearInfo();

        var that=this;
    };

    carYear.prototype=new BaseClass();
    carYear.constructor=carYear;

    var pt=carYear.prototype;


    //http://xx.com/v2/car_series/{id}/year
    /*获取信息*/
    pt.getYearInfo=function(){
        this.ctrlLoadingIcon();
        // var param={},
        //     url='v2/car_series/{id}/year',
        //     options={
        //         errorCallback:$.proxy(this,'getInfoError')
        //     };
        // this.getDataAsync(url,param,$.proxy(this,'getInfoSuccess'),options);

        var url='../data/year.json';
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
        this.showCarInfo(data);
        this.showYearInfo(data);
    };


    pt.showYearInfo=function(result){
        if(result.length==0){
            this.showTips({txt:'排量获取列表失败，'+result});
            return;
        }else{
            var str=this.getYearInfoStr(result);
            $('.container').html(str);
        }
    };

    pt.getYearInfoStr=function(data){
        var len=data.year_list.length,
            str='',
            item;
        for(var i=0;i<len;i++){
            item=data.year_list[i];
            str+= '<a class="container-box border" href="__CTRL__/caryear">'+
                '<div class="item">'+item.year+'</div>'+
                '<span class="iconfont icon-right"></span>'+
                '</a>';
        }
        return str;
    };

    /*车辆信息数据*/
    pt.showCarInfo=function(data){
        var str='',item;
        if(data != null) {
            item=data;
            str ='<div class="head-img">'+
                '<img id="img" src="'+item.logo_img+'" />'+
                '</div>'+
                '<div class="head-txt">'+item.branch_name+'&nbsp&nbsp'+item.series_name+'</div>';
        }
        $('.head-box').html(str);
    };



    return carYear;
});