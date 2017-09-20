/**
 * Created by mayoi on 2017/09/19.
 */
//选择汽车型号


define(['base','wx'],function (BaseClass,wx) {
    function carType($wrapper) {

        BaseClass.call(this,$wrapper);

        this.getTypeInfo();

        var that=this;
    };

    carType.prototype=new BaseClass();
    carType.constructor=carType;

    var pt=carType.prototype;


    //http://xx.com/v2/car_series/{id}/motorcycle_type
    /*获取信息*/
    pt.getTypeInfo=function(){
        this.ctrlLoadingIcon();
        // var param={},
        //     url='v2/car_series/{id}/motorcycle_type',
        //     options={
        //         errorCallback:$.proxy(this,'getInfoError')
        //     };
        // this.getDataAsync(url,param,$.proxy(this,'getInfoSuccess'),options);

        var url='../data/type.json';
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
        this.showTypeInfo(data);
    };


    pt.showTypeInfo=function(result){
        if(result.length==0){
            this.showTips({txt:'排量获取列表失败，'+result});
            return;
        }else{
            var str=this.getTypeInfoStr(result);
            $('.container').html(str);
        }
    };

    pt.getTypeInfoStr=function(data){
        var len=data.motorcycle_type_list.length,
            str='',
            item;
        for(var i=0;i<len;i++){
            item=data.motorcycle_type_list[i];
            str+=       '<a class="container-box border" href="__CTRL__/carinfo">'+
                '<div class="item">'+item.motorcycle_type+'</div>'+
            '<span class="iconfont icon-right"></span>'+
                '</a>';
        }
        return str;
    };



    return carType;
});