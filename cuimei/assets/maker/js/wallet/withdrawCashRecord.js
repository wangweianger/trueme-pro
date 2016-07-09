/**/
Vue.filter('stateFilter', function (value) {
    var text="";
    switch (value){
        case 'UNCHECK':
            text='未审核';
            break;
        case 'WAITPAY':
            text='已审核未支付';
            break;
        case 'PAYOVER':
            text='已支付';
            break;
        case 'INVALID':
            text='已作废';
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
            data0: { data: [], startNum: 0, isEmpty: false },
            data1: { data: [], startNum: 0, isEmpty: false },
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
            if(This.index==0){
                var apiurl='maker/svWithdraw/withdrawTodayRecord';
            }else if(This.index==1){
                var apiurl='maker/svWithdraw/withdrawOtherTimeRecord';
            }
            
            //ajax  
            $.AJAX({
                type: 'post',
                url: config.basePath + apiurl,
                data: {
                    startNum:0,
                },
                success: function(data) {
                    This.datas = data.data.recordList;
                    if (!data.data.recordList.length) {
                        This.datasList['data' + orderStatus]['isEmpty'] = true;
                    };
                    This.datasList['data' + orderStatus]['data'] = data.data.recordList;
                    This.datasList['data' + orderStatus]['startNum'] = data.data.startNum;
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
                    if(This.index==0){
                        var apiurl='maker/svWithdraw/withdrawTodayRecord';
                    }else if(This.index==1){
                        var apiurl='maker/svWithdraw/withdrawOtherTimeRecord';
                    }
                    $.AJAX({
                        type: 'post',
                        url: config.basePath + apiurl,
                        data: {
                            startNum:This.datasList['data' + This.index]['startNum'],
                        },
                        success: function(data) {
                            //判断是否还需要滚动获取数据 向数组里push数据
                            if (data.data.recordList.length > 0) {
                                This.loadingStatus=1;
                                config.scrollbegin = true; //可以再次滚动
                                This.datasList['data' + This.index]['data'] = (This.datasList['data' + This.index]['data']).concat(data.data.recordList);
                                This.datas = This.datasList['data' + This.index]['data'];
                            }else{
                                This.loadingStatus=3;
                            }
                            This.datasList['data' + This.index]['startNum'] = data.data.startNum;
                        },
                    });
                },
            });
        }, //end
    }
});
