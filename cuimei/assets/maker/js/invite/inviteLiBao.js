win.hideLoading();
/*创客邀请*/
var vm = new Vue({
    el: '#container',
    data: {
        datas: {}, 
        shareId:sessionStorage.getItem('fenYongShareId') ? sessionStorage.getItem('fenYongShareId') : '0',
    },
    ready: function(){
        var This = this;

        //获取SPU详情信息
        $.AJAX({
            type: 'get',
            url: config.basePath + 'product/svProduct/getPullNewSkuList',
            success: function(data) {
                console.log(data)
                This.datas = data.data; 
            },
        });

    },
    methods: {
        //立即购买
        submitShopNow:function(skuId,submitShopNow){
            //立即购买 结算订单
            var json = {
                totalPrice: submitShopNow,
                skuList: [{
                    spuId: vm.spuId,
                    skuId: skuId,
                    num: 1,
                    shareId: vm.shareId,
                }],
            };
            $.AJAX({
                url: config.basePath + 'product/svSettlement/settlement?param=' + JSON.stringify(json),
                success: function(o) {
                    sessionStorage.setItem('confirmOrderSpu', vm.spuId);
                    sessionStorage.setItem('data', JSON.stringify(o.data));
                    var href = window.location.origin + "/trueme/order/confirmOrder.html";
                    window.location.href = href;
                    sessionStorage.setItem('weixin-next-url', href);
                }
            });
        },//end

    }
});

    