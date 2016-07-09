/**/

Vue.filter('stateFilter', function(value) {
    var text = "";
    switch (value) {
        case 'FINISH':
            text = '订单完成';
            break;
        case 'UNPAY':
            text = '未支付';
            break;
        case 'PAID':
            text = '已支付';
            break;
        case 'CANCEL':
            text = '已取消';
            break;
    }
    return text;
});

Vue.filter('makerOrderStateFilter', function(value) {
    var text = "";
    switch (value) {
        case 'FINISH':
            text = '已入账';
            break;
        case 'UNPAY':
            text = '';
            break;
        case 'PAID':
            text = '未入账';
            break;
        case 'CANCEL':
            text = '取消订单';
            break;
    }
    return text;
});

Vue.filter('orderTypeFilter', function(value) {
    var text = "";
    switch (value) {
        case 1:
            text = '普通';
            break;
        case 2:
            text = '分销';
            break;
        case 3:
            text = '拉新';
            break;
    }
    return text;
});

//当前的订单状态tab
var wenanstatestab = getQueryString('states', true) + '' ? getQueryString('states', true) : 0;
//改变tab样式
$('.wartab').eq(wenanstatestab).addClass('active').siblings().removeClass('active');

var vm = new Vue({
    el: '#container',
    data: {
        index: wenanstatestab, //初始table索引 请求历史还是今日数据
        datas: [], //当前的列表数据
        datasList: {
            data0: { data: [], page: 0, isEmpty: false },
            data1: { data: [], page: 0, isEmpty: false },
        }, //数据列表
        loadingStatus:1, //加载更多数据默认
    },
    ready: function() {
        var This = this;
            //切换table
        $('.wartab').click(function() {
            $(this).addClass('active').siblings().removeClass('active');
            //缓存数据
            config.scrollbegin = true;
            location.hash = '#states=' + $(this).index();
            This.index = $(this).index();
            This.datas = This.datasList['data' + This.index]['data'];
            //数据为空时加载数据
            if (!This.datasList['data' + This.index]['data'].length && !This.datasList['data' + This.index]['isEmpty']) {
                win.showLoading();
                //加载数据
                This.queryDataList(This.index);
            }
        });
        This.queryDataList(This.index);
    },
    methods: {
        //查询我的订单列表
        queryDataList: function(orderStatus) {
            var This = this;
            //ajax  
            $.AJAX({
                type: 'post',
                url: config.basePath + "maker/svMaker/getMakerIncomeList",
                data: {
                    page: 1, //是   int 第几页，从1开始
                    pageSize: 5, //否   int 每页个数，默认5个
                    isToday: This.index == 0 ? 1 : 0, //int 默认1，当为1时表示今天，当为0时表示更早的
                },
                success: function(data) {
                    This.datas = data.data.orders;
                    if (!data.data.orders.length) {
                        This.datasList['data' + orderStatus]['isEmpty'] = true;
                    };
                    This.datasList['data' + orderStatus]['data'] = data.data.orders;
                    This.datasList['data' + orderStatus]['page'] = data.data.page;
                    //滚动拉去更多数据
                    This.scollGetMoreData();
                    setTimeout(function() {
                        $('#tabul').removeClass('hide');
                    }, config.containerShowTime);
                }
            });
        },

        //滚动获得更多数据
        scollGetMoreData: function() {
            var This = this;
            //滚动时执行
            trueme.w.scrollGetData({
                lastObj: $('#bottomscolltop'),
                callback: function() {
                    This.loadingStatus=2;
                    $.AJAX({
                        type: 'post',
                        url: config.basePath + 'maker/svMaker/getMakerIncomeList',
                        data: {
                            page: This.datasList['data' + This.index]['page'], //是   int 第几页，从1开始
                            pageSize: 5, //否   int 每页个数，默认5个
                            isToday: This.index == 0 ? 1 : 0, //int 默认1，当为1时表示今天，当为0时表示更早的
                        },
                        success: function(data) {
                            //判断是否还需要滚动获取数据 向数组里push数据
                            if (data.data.orders.length > 0) {
                                This.loadingStatus=1;
                                config.scrollbegin = true; //可以再次滚动
                                This.datasList['data' + This.index]['data'] = (This.datasList['data' + This.index]['data']).concat(data.data.orders);
                                This.datas = This.datasList['data' + This.index]['data'];
                            }else{
                                This.loadingStatus=3;
                            }
                            This.datasList['data' + This.index]['page'] = data.data.page;
                        },
                    });
                },
            });
        }, //end
    }
});
