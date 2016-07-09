$(document).ready(function () {
    var swiper = new Swiper('.invite', {
        paginationClickable: true,
        direction: 'vertical'
    });
    $(document).on('click', '.close', function(){
        $(".libao-box").addClass('hide');
    });
});
/*创客邀请*/
var vm = new Vue({
    el: '#container',
    data: {
        spuId: config.spuId,
        masterCode: getQueryString('masterCode'), //masterCode码
        spuIdprice: config.spuIdprice,
        getPullNewSkuList:[], //礼包列表
        isIosWebviewApp:isIosWebviewApp, //是否是app访问
    },
    ready: function () {
        var This = this;
        //判断是否有 masterCode 没有就请求masterCode
        if(!This.masterCode){
            $.AJAX({
                type:'post',
                url: config.basePath+"maker/svMaker/getMasterCodeByShareId",
                data:{
                   shareId:sessionStorage.getItem('fenYongShareId')?sessionStorage.getItem('fenYongShareId'):0,
                },
                success: function(data){
                    This.masterCode=data.data.masterCode;
                },
            });
        };

        //获得礼包数据
        $.AJAX({
            type: 'get',
            url: config.basePath + 'product/svProduct/getPullNewSkuList',
            success: function(data) {
                This.getPullNewSkuList = data.data.getPullNewSkuList; 
            },
        });
    },
    methods: {
        //购买礼包 t_maker_ref 增加一条记录
        buyAGift: function () {
            var This = this;
            $.AJAX({
                type: 'post',
                url: config.basePath + "maker/svMaker/lockRefMaster",
                data: {
                    masterCode: This.masterCode
                },
                success: function (data) {
                    $(".libao-box").removeClass("hide");
                    if(This.getPullNewSkuList.length > 1){
                        Vue.nextTick(function(){
                            var libao = new Swiper('.libao-con', {
                                pagination: '.swiper-pagination',
                                slidesPerView: 1,
                                paginationClickable: true,
                                spaceBetween: 30,
                                loop: true
                            });
                        });
                    }
                }
            });
        }
    }
});

    