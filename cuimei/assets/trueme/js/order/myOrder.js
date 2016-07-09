/*** Created by HZH on 2016/5/19.*/
//查询的订单状态  1.待付款 2.待发货3.已发货【配送中】4.已完成【已收货】5.退款中6.已取消7.已关闭8.退货中9. 已退款
var stateOrder = 0;
//当前的订单状态tab
var orderstatestab = getQueryString('orderstates', true) ? getQueryString('orderstates', true) : 0;

//改变tab样式
$(".order-nav li").eq(orderstatestab).addClass("on").siblings().removeClass("on");

//vue begin
var vm = new Vue({
    el: '#container',
    data: {
        index: orderstatestab, //初始table索引
        datas: {}, //当前的列表数据
        empty: false,
        datasList: {
            data0: { data: {}, startNum: 0, isNull: false },
            data1: { data: {}, startNum: 0, isNull: false },
            data2: { data: {}, startNum: 0, isNull: false },
            data3: { data: {}, startNum: 0, isNull: false },
        }, //数据列表
        loadingStatus:1, //加载更多数据默认
    },
    ready: function() {
        var This = this;
        //tab切换
        $(".order-nav li").click(function() {
            $('div.loading-box').addClass('hide');
            if ($(this).hasClass('on')) {
                return false;
            }
            if ($(this).index() == 0) {
                location.hash = '#orderstates=' + $(this).index();
                location.reload();
                return false;
            }
            $(this).addClass("on").siblings().removeClass("on");
            var $aid = $(this).children("a").attr("data");
            if ($(this).hasClass("on")) {
                $($aid).addClass("active").siblings().removeClass("active");
            }

            //缓存数据
            This.loadingStatus=1;
            config.scrollbegin = true;
            location.hash = '#orderstates=' + $(this).index();

            This.index = $(this).index();
            //切换table数据
            if (This.datasList['data' + This.index]['isNull']) {
                This.empty = true;
                This.datas = {};
            } else {
                This.empty = false;
                This.datas = This.datasList['data' + This.index]['data'];
            }
            //数据为空时加载数据
            if (jQuery.isEmptyObject(This.datasList['data' + This.index]['data']) && !This.datasList['data' + This.index]['isNull']) {
                win.showLoading();
                //加载数据
                This.queryMyOrderList(This.index);
            }
            //判断json是否为空 jQuery.isEmptyObject({})
        });

        //获取数据列表
        This.queryMyOrderList(This.index);
    },
    methods: {
        //查询我的订单列表
        queryMyOrderList: function(orderStatus) {
            var This = this;
            //请求我的订单数据列表
            $.AJAX({
                type: 'post',
                url: config.basePath + 'order/svqueryorder/orderlist',
                data: {
                    "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
                    "orderStatus": orderStatus,
                    "startNum": 0,
                },
                success: function(data) {
                    if (data.data.orderList.length == 0) {
                        This.empty = true;
                        This.datasList['data' + This.index]['isNull'] = true;
                        $('#container').show();
                        return false;
                    } else {
                        This.empty = false;
                        This.datas = data.data;
                        This.datasList['data' + This.index]['data'] = data.data;
                        This.datasList['data' + This.index]['startNum'] = data.data.startNum || 1;
                        This.$nextTick(function() {
                            $('#container').show();
                        });
                        //滚动拉去更多数据
                        This.scollGetMoreData();
                    }
                }
            });
        },

        //弹出客服信息
        showSeller: function() {
            Popup.alert({
                type: 'msg',
                haveHeader: false,
                style: 'width:80%',
                maskHide: true,
                closeBut: false,
                title: '<div class="pop-header g-border-b">萃美客服电话</div>\
              <div class="pop-tel"><span class="contact-tel"></span>0755-2691-0969</div>\
              <div class="pop-btn"></div>'
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
                        url: config.basePath + 'order/svqueryorder/orderlist',
                        data: {
                            "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
                            "orderStatus": This.index,
                            "startNum": This.datasList['data' + This.index]['startNum'],
                        },
                        success: function(data) {
                            //判断是否还需要滚动获取数据 向数组里push数据
                            if (data.data.orderList.length > 0) {
                                console.log(data.data.orderList.length)
                                This.loadingStatus=1;
                                config.scrollbegin = true; //可以再次滚动
                                This.datasList['data' + This.index]['data'].orderList = (This.datasList['data' + This.index]['data'].orderList).concat(data.data.orderList);
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

        //取消订单
        cancelOrder: function(orderNo) {
            Popup.confirm({
                type: 'msg',
                haveHeader: false,
                title: '确认取消订单吗？',
                yes: function() {
                    trueme.w.cancelOrder({
                        orderId: orderNo,
                        success: function(data) {
                            vm.datasList['data' + vm.index]['data'].orderList = deleteArrItem(vm.datasList['data' + vm.index]['data'].orderList, orderNo);
                            if (vm.datasList['data' + vm.index]['data'].orderList.length == 0) {
                                vm.empty = true;
                            };
                            if (vm.index == 0) {
                                //获取数据列表
                                vm.queryMyOrderList(vm.index);
                            }

                        }
                    });
                },
            });
        },

        //删除订单
        deteleOrder: function(orderNo) {
            var This = this;
            Popup.confirm({
                type: 'msg',
                haveHeader: false,
                title: '确认删除订单吗？',
                yes: function() {
                    trueme.w.deteleOrder({
                        orderId: orderNo,
                        success: function(data) {
                            //获取数据列表
                            vm.datasList['data' + vm.index]['data'].orderList = deleteArrItem(vm.datasList['data' + vm.index]['data'].orderList, orderNo);
                            if (vm.datasList['data' + vm.index]['data'].orderList.length == 0) {
                                This.empty = true;
                            }
                            // vm.queryMyOrderList(vm.index); 
                        }
                    });
                },
            });
        },

        //订单详情
        orderDetails: function(orderId) {
            window.location.href = "orderDetails.html?orderId=" + orderId;
        },

        //确定收货
        confirmReceipt: function(orderId) {
            Popup.confirm({
                type: 'msg',
                haveHeader: false,
                title: '确定已收货？',
                yes: function() {
                    $.AJAX({
                        type: 'post',
                        url: config.basePath + 'order/svorder/sureorder',
                        data: { orderId: orderId },
                        success: function(data) {
                            window.location.href = "myOrder.html"; //跳转到全部订单
                        }
                    });
                }
            });
        },



    }
});
