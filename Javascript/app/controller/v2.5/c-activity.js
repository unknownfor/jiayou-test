/**
 * Created by mayoi on 2017/09/28.
 */
//活动

define(['base','wx'],function (BaseClass,wx) {
    function activity($wrapper) {

        BaseClass.call(this,$wrapper);

        this.getActivityInfo();

    };


    activity.prototype=new BaseClass();
    activity.constructor=activity;

    var pt=activity.prototype;


    /*获取信息*/
    pt.getActivityInfo=function(){
        var url='../../data/activity.json';
        $.getJSON(url,null,$.proxy(this,'getInfoSuccess'));
    };

    /*获取失败*/
    pt.getInfoError=function(result){
        this.ctrlLoadingIcon(false);
        this.showTips({txt:'加载失败，'+result});
    };


    /*获取成功*/
    pt.getInfoSuccess=function(data){
        this.ctrlLoadingIcon(false);
        this.showActivityInfo(data);
    };

    pt.showActivityInfo = function (data) {
        var str = '',
            item,
            len,
            url;
        url=window.urlObject.url;
        len=data.length;
        if(len==0){
            return str;
            this.showTips({txt:'暂无活动'});
        } else {
            for(var i=0;i<len;i++){
                item=data[i];
                str += '<div class="activity-box">' +
                    '<div class="time-box">' +
                    '<span class="date">'+ item.timeStart +'</span>' +
                    '<span>'+item.timeEnd +'</span>' +
                    '</div>' +
                    '<a class="item-box" href=" '+ url +'   '+item.id+'">' +
                    '<div class="info-banner">' +
                    '<img src="'+ item.img_logo+'" />' +
                    '</div>' +
                    '<div class="info-title">'+ item.title +'</div>' +
                                        this.secondTitleInfo(data)+
                    '<div class="tip-more">' +
                    '<span class="tip-txt">查看详情</span>' +
                    '<span class="iconfont icon-right"></span>' +
                    '</div>' +
                    '        </a>' +
                    '    </div>';
            }
        }
        $('.activity2_5-wrapper').html(str);
    };

    pt.secondTitleInfo = function (title) {
        var str = '',
            str1 = '',
            str2='',
            len = title.length,
            item,
            info;
        for(var i=0;i<len;i++) {
            item =title[i];
            if (len == 0) {
                return str;
            } else {
                for (var i=0;i<len; i++) {
                    info =item.title_list[i];
                    if (info.secondTitle !== '' || info.secondTitle !== 'undefined') {
                        str1 = '<span class="li-txt colored">' + info.secondTitle + '</span>';
                    }
                    if (info.mainTitle !== '' || info.mainTitle !== 'undefined') {
                        str1 = '<span class="li-txt">' + info.mainTitle + '</span>';
                    }
                    str2 += '<li>' + str1 +'</li>';
                }
        }
            str = '<ul class="info-count">' + str2 + '</ul>';
            return str;
        }
    };




    return activity;

});
