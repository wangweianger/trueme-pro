/*login.js*/
$(function() {
    $("#password").on("focus", function() {
        $(this).next("span").addClass("focus");
    });
    $("#password").blur(function() {
        $(this).next("span").removeClass("focus");
    });
});

var vm = new Vue({
    el: '#container',
    data: {
        payOrderNo: '', //预支付订单号
        needPay: '', //需要支付的金额
        createTime: '', //生成订单的倒计时时间
        openId: '', //用户的openId
        isSubmitPay: false, //是否可支付状态
        payNo: getQueryString('payOrderNo'), //支付订单号
    },
    ready: function() {
        var This = this;
        if (getQueryString('orderId')) {
            var url = config.basePath + 'order/svorder/querypaybyid';
            var data = {
                "orderId": getQueryString('orderId')
            }
            doAjax();
        } else {
            var url = config.basePath + 'order/svorder/querypay';
            var data = {
                "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
                "payNo": This.payNo
            }
            doAjax();
        }

        function doAjax() {
            $.AJAX({
                type: 'post',
                code: true,
                url: url,
                data: data,
                success: function(data) {
                    This.payOrderNo = data.data.payOrderNo; //预支付订单号
                    This.openId = data.data.openId; //openId
                    This.needPay = data.data.needPay;
                    //生成订单时间
                    var timespe = (data.data.expireTime - data.data.createTime) / 1000; //时间差
                    if (timespe <= 0) { This.createTime = '00:00'; };
                    //var timespe=(10000)/1000; //时间差
                    var timer = setInterval(function() {
                        This.createTime = formatSeconds(timespe);
                        timespe--;
                        if (timespe <= 0) {
                            clearInterval(timer);
                            This.createTime = '00:00';
                            This.isSubmitPay = true;
                            //调起关闭订单
                            This.closeOrder();
                        }
                    }, 1000);
                    setTimeout(function() {
                        $('#container').removeClass('hide');
                    }, config.containerShowTime)
                },
                error: function(data) {
                    if (data.code == 4010) {
                        Popup.alert({
                            type: 'msg',
                            title: data.desc,
                            yes: function() {
                                location.href = 'myOrder.html';
                            }
                        });
                    } else {
                        Popup.alert({ type: 'msg', title: data.desc });
                    }
                }
            });
        }
        //根据订单号 获取支付信息
    },
    methods: {
        //H5掉起立即支付
        payOrderNow: function() {
            //判断app或者web
            tuneUpWebOrApp({
                isWxpay: true,
                data:{
                    payOrderNo:vm.payOrderNo,
                    needPay:vm.needPay
                },
                runWebH5: function() {
                    //调起微信H5支付
                    vm.onBridgeReadyH5();
                },
            });
        },

        //h5 调起微信支付
        onBridgeReadyH5: function() {
            var This = this;
            This.isSubmitPay = true;
            //支付签名
            $.AJAX({
                type: 'post',
                url: config.basePath + "order/svorder/ordersign",
                data: {
                    "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
                    "payWay": 2,
                    "payOrderNo": This.payOrderNo,
                    "needPay": This.needPay,
                    "openId": This.openId,
                },
                success: function(data) {
                    //h5调起微信支付
                    function onBridgeReady() {
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest', {
                                "appId": data.data.appId,
                                "timeStamp": data.data.timeStamp,
                                "nonceStr": data.data.nonceStr,
                                "package": data.data.prepayId,
                                "signType": "MD5",
                                "paySign": data.data.sign
                            },
                            function(res) {
                                //使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                                if (res.err_msg == "get_brand_wcpay_request:ok") {
                                    //支付成功后执行
                                    window.location.href = "orderPaymentSuccess.html?payOrderNo=" + This.payOrderNo;
                                } else {
                                    //支付失败后执行
                                    Popup.alert({ type: 'msg', title: '支付失败!' });
                                    setTimeout(function() {
                                        window.location.href = "myOrder.html";
                                    }, 2000)
                                }
                            }
                        );
                    }
                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                    } else {
                        onBridgeReady();
                    } //支付end
                },
                complete: function(data) {
                    setTimeout(function() {
                        This.isSubmitPay = false;
                    }, 200);
                }
            });
        },

        //取消订单
        cancelOrder: function() {
            Popup.confirm({
                type: 'msg',
                title: '确认取消订单吗？',
                yes: function() {
                    $.AJAX({
                        type: 'post',
                        url: config.basePath + 'order/svorder/cancleorderpayno',
                        data: {
                            "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
                            "payNo": vm.payNo,
                        },
                        success: function(data) {
                            //跳转到订单列表
                            window.location.href = "myOrder.html";
                        },
                    })
                }
            })
        },

        //关闭订单
        closeOrder: function() {
            $.AJAX({
                type: 'post',
                url: config.basePath + 'order/svorder/closeorder',
                data: {
                    "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
                    "payNo": vm.payNo,
                },
                success: function(data) {
                    //跳转到订单列表
                    Popup.alert({
                        type: 'msg',
                        title: '支付超时，订单已关闭！',
                        yes: function() {
                            window.location.href = "myOrder.html";
                        }
                    })
                }
            })
        },
    }
});
