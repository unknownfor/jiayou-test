/**
 * Created by mayoi on 2017/09/21.
 */
// 订单确认

define(['base', 'wx'], function (BaseClass, wx) {
    function carModel($wrapper) {
        BaseClass.call(this, $wrapper);

        this.getModelInfo();

        var that= this;
    }

    carModel.prototype=new BaseClass();
    carModel.constructor=carModel;

    var pt=carModel.prototype;


    //http://xx.com/v2/car_branch/{id}/series
    /*获取信息*/
    pt.getModelInfo=function(){
        this.ctrlLoadingIcon();
        // var param={},
        //     url='/v2/car_branch/{id}/series',
        //     options={
        //         errorCallback:$.proxy(this,'getInfoError')
        //     };
        // this.getDataAsync(url,param,$.proxy(this,'getInfoSuccess'),options);

        var url='../data/model.json';
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
        this.showModelInfo(data);
    };


    pt.showModelInfo=function(result){
        if(result.length==0){
            this.showTips({txt:'排量获取列表失败，'+result});
            return;
        }else{
            var str=this.getModelInfoStr(result);
            $('.container').html(str);
        }
    };


    pt.getModelInfoStr=function(data){
        var len=data.series_list.length,
            str='',
            url,
            item;
        for(var i=0;i<len;i++){
            item=data.series_list[i];
            url=window.urlObject.ctrl+'/carinfo/id/';
            name=item.series_name;
            if( name != '' || name != 'undefined') {
                str+= '<a class="container-box border" href="'+url+item.seid+'">'+
                    '<div class="item">'+name+'</div>'+
                    '<span class="iconfont icon-right"></span>'+
                    '</a>';
            }
        }
        return str;
    };

    /*车辆信息数据*/
    pt.showCarInfo=function(data){
        var str='',item;
        if(data != null || data.logo_img =='undefined') {
            item=data;
            str ='<div class="head-box">'+
                '<div class="head-img">'+
                '<img id="img" src="'+item.logo_img+'" />'+
                '</div>'+
                '<div class="head-txt">'+ item.branch_name +'</div>'+
                '</div>';
        }
        $('.container').before(str);
    };



    return carModel;
});