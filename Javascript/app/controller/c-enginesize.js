/**
 * Created by mayoi on 2017/09/19.
 */
//选择汽车排气量


define(['base','wx'],function (BaseClass,wx) {
    function engineSize($wrapper) {

        BaseClass.call(this,$wrapper);

        this.getEngineInfo();

        var that=this;
    };

    engineSize.prototype=new BaseClass();
    engineSize.constructor=engineSize;

    var pt=engineSize.prototype;


    //http://xx.com/v2/car_series/{id}/displacement
    /*获取信息*/
    pt.getEngineInfo=function(){
        this.ctrlLoadingIcon();
        // var param={},
        //     url='/v2/car_series/19/displacement',
        //     options={
        //         errorCallback:$.proxy(this,'getInfoError')
        //     };
        // this.getDataAsync(url,param,$.proxy(this,'getInfoSuccess'),options);

        var url='../data/engine.json';
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
        this.showEngineInfo(data);
    };


    /*车排量信息*/
    pt.showEngineInfo=function(result){
        if(result.length==0){
            this.showTips({txt:'排量获取列表失败，'+result});
            return;
        }else{
            var str=this.getEngineInfoStr(result);
            $('.container').html(str);
        }
    };

    pt.getEngineInfoStr=function(data){
        var len=data.displacement_list.length,
            str='',
            url,
            item;
        for(var i=0;i<len;i++){
            item=data.displacement_list[i];
            url=window.urlObject.ctrl+'/caryear/id/';
            str+= '<a class="container-box border" href="'+url+item.dpid+'">'+
                '<div class="item">'+item.displacement_size+'</div>'+
                '<span class="iconfont icon-right"></span>'+
                '</a>';
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
                '<div class="head-txt">'+item.branch_name+'&nbsp&nbsp'+item.series_name+'</div>'+
                '</div>';
        }
        $('.container').before(str);
    };



    return engineSize;
});