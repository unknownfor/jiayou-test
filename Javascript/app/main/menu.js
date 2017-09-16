define(['$'], function () {
    var Menu = function () {
        this.menusArr = this.getMenuArr();
        this.controlMenuStatus();
    }
    Menu.prototype = {

        //控制菜单的可用性和样式
        controlMenuStatus: function () {
            var name = window.location.href.replace(/.*(home|src)\/index\//i, '').replace(/\/.*/, ''),
                index = this.getIndex(name);
            var $item = $(".tab-item").eq(index),
                $old = $item.siblings();
            $item.addClass('selected');
            $old.removeClass("selected");
        },

        getIndex: function (name) {
            var index = 0;
            for (var i = 0; i < this.menusArr.length; i++) {
                if (name == this.menusArr[i].name) {
                    index = this.menusArr[i].index;
                    break;
                }
            }
            return index;
        },

        /*设置菜单对应的下标*/
        getMenuArr: function () {
            return [
                {index: 0, name: 'home'},
                {index: 1, name: 'service'},
                {index: 2, name: 'activity'},
                {index: 3, name: 'my'}
            ];
        }
    };


    return Menu;

});