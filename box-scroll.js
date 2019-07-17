// 只负责滚动的逻辑,不负责业务
function setLodaDateSwrap() {
    this.CalendarBox = null;
    this.leftNum = null;
    this.rightNum = null;
    this.settings = {
        step:2, // 暂时没用
        fTime:3, // 暂时没用
        Calendar: 'ul',
        prev: '.last-month',
        next: '.next-month',
        prevClick:function(){},
        nextClick:function(){},
    }
}
setLodaDateSwrap.prototype.init = function (obj, opt) {
    $.extend(this.settings, opt);

    var This = this;
    this.CalendarBox = obj;
     this.leftNum = -$(this.settings.Calendar).width() / 2;
    // this.leftNum = -this.settings.step*$(this.settings.Calendar).find('.dayprice').width();

    this.rightNum = 0;
    var prevStr = this.CalendarBox + ' ' + this.settings.prev;
    var nextStr = this.CalendarBox + ' ' + this.settings.next;
    $(document).on('click', prevStr, function () {
        if($(This.settings.Calendar).is(":animated")){
            return;
        }
        var callbackFn = null;
        // 返回布尔值,用来判断前进后退按钮是否禁用
        var scroolBool = This.settings.prevClick(function(callback){
            callbackFn = callback;
        });
        if(!scroolBool){return;}
        This.swrap(This.leftNum, This.rightNum,function(){
            if(callbackFn){callbackFn()}
        });
        This.scroolPrevBool = scroolBool;
    });
    $(document).on('click', nextStr, function () {
        if($(This.settings.Calendar).is(":animated")){
            return;
        }
        var callbackFn = null;
        var scroolBool = This.settings.nextClick(function(callback){
            callbackFn = callback;
        });
        if(!scroolBool){return;}
        This.swrap(This.rightNum, This.leftNum,function(){
            if(callbackFn){callbackFn()}
        });
    });
}
setLodaDateSwrap.prototype.swrap = function (num1, num2,callback) {
    var This = this;
    if (!$(this.settings.Calendar).is(':animated')) {
        $(this.settings.Calendar).css({ left: num1 });
        $(this.settings.Calendar).stop().animate({ left: num2 }, 500, function () {
            $(This.settings.Calendar).css({ left: 0 });
            if(callback){callback()}
        });
    }
}







