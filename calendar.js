// 只负责处理日期,不负责处理业务
/*返回某时间段的所有日期数据，并格式化，并根据是否今天还是明天还是后天加了classname*/
// var dateJson = [
//     {
//         date: '2017-10-11',
//         price: '100'
//     },
//     {
//         date: '2017-8-13',
//         price: '100',
//         rest: '休'
//     },
//     {
//         date: '2017-8-15',
//         price: '100',
//         discount: '折'
//     }]
var dateJson = []

function Calendar() {
    this.settings = {
        startDate: '2019-05-10', // 开始时间
        endDate: '2019-10-15',// 结束时间
        dateJson: dateJson, // 日期上的标识数据，class名字要和这个标识字段一摸一样，例如json里面的“折”是discount,那么css名字也叫.discount
        defaultSelectDate: ['2019-07-02', '2019-07-09'] // 选中的日期
    }
}

Calendar.prototype.init = function (opt) {
    $.extend(this.settings, opt);
    return (this.getAllDate(this.settings.startDate, this.settings.endDate));
}

Calendar.prototype.pushTag = function (yearMonthDay) {
    var tags = {};
    for (var i = 0; i < this.settings.dateJson.length; i++) {
        if (moment(yearMonthDay).format('x') === moment(this.settings.dateJson[i].date).format('x')) {
            for (var key in this.settings.dateJson[i]) {
                tags[key] = this.settings.dateJson[i][key];
            }
            break;
        }
    }
    return tags;
}
Calendar.prototype.setClass = function (start, end, i) { //根据日期给div设置样式
    var className = '',daytype='';
    if (i >= moment(start).format('x') && i <= moment(end)) { // 是否在开始和结束之间
        className = 's_day';daytype='s_day';
        if (moment(i).format('YYYY/MM/DD') === moment().format('YYYY/MM/DD')) { // 今天
            className += ' s_today';
        }
        $.each(this.settings.defaultSelectDate, function (index, item) { // defaultSelectDate
            if (moment(i).format('YYYY/MM/DD') === moment(item).format('YYYY/MM/DD')) {
                className += ' s_curday';
            }
        })
    } else {
        className = 's_pass';daytype='s_pass';
        if (moment(i).format('YYYY/MM/DD') === moment().format('YYYY/MM/DD')) {
            className += ' s_today';
        }
    }
    return {className:className,daytype:daytype};
}

Calendar.prototype.getAllDate = function (start, end) { // 获取两个日期间的所有日期数据
    var sd = Number(moment(start).startOf('month').format('x')); // 本月第一天
    var ed = Number(moment(end).endOf('month').format('x')); // 本月最后一天

    var dataObject = {};

    dataObject[sd] = {title: moment(start).format('YYYY年MM月'), date: []} // 初始第一个月
    // console.log( moment(sd).weekday())
    for (var w = 0; w < moment(sd).weekday(); w++) { // 对本月一号之前的周几补全。
        dataObject[sd].date.push({year: '', month: '', day: '', week: w});// 如果当前月份没有存储当前天数用的数组,就创建一个空数组，如果有，就向里面添加一个空对象; (空对象是用来占位置的，用来填充月份前面的空白)
    }
    for (var i = sd; i <= ed;) {
        var firstDay = Number(moment(i).startOf('month').format('x')); // 当月第一天;--作为每个月的唯一标示

        if (moment(i).format('x') === moment(moment(i).startOf('month').format('YYYY-MM-DD')).format('x') && i !== sd) { // 如果是当月的第一天,添加下个月的数据
            //   console.log(i, sd)
            var op = {
                title: moment(i).add(1, 'days').format('YYYY年MM月'), // 下个月的第一天
                date: []
            }
            for (var w = 0; w < moment(i).weekday(); w++) { // 对本月一号之前的周几补全。
                op.date.push({year: '', month: '', day: '', week: w});// 如果当前月份没有存储当前天数用的数组,就创建一个空数组，如果有，就向里面添加一个空对象; (空对象是用来占位置的，用来填充月份前面的空白)
            }
            dataObject[i] = op;
        }

        //根据日期给div设置样式
        var className = this.setClass(start, end, i).className;
        var daytype = this.setClass(start, end, i).daytype;
        var tag = this.pushTag(moment(i).format('YYYY/MM/DD')); // 折扣，休息等信息
        var option = {
            year: moment(i).format('YYYY'),
            month: moment(i).format('MM'),
            day: moment(i).format('DD'),
            week: moment(i).weekday(),
            classname: className,
            daytype: daytype,
            tags: tag,
            date: moment(i).format('YYYY/MM/DD')
        }
        dataObject[firstDay].date.push(option);
        i = Number(moment(i).add(1, 'days').format('x')); // 下次赋值
    }
    return dataObject;
}

Calendar.prototype.setWeek = function(num) {
    var week = '';
    switch (num) {
        case 1:
            week = '一';
            break;
        case 2:
            week = '二';
            break;
        case 3:
            week = '三';
            break;
        case 4:
            week = '四';
            break;
        case 5:
            week = '五';
            break;
        case 6:
            week = '六';
            break;
        default:
            week = '日';
    }
    return week;
}
