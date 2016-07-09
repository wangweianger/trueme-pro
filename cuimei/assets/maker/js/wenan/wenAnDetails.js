/*wenAndetails.js*/
$(function () {

  $(".share").click(function () {
      $(this).hide();
  });
  //是否需要提示弹出分享层
  $('#isShare').click(function(){
    if(!isIosWebviewApp){$('#weixinShare').removeClass('hide').addClass('show')};
  });
  //点击隐藏弹出层
  $('#weixinShare').click(function(){
    $(this).removeClass('show').addClass('hide');
  });

  var scrolltop=0;
  //弹出层折叠
  $(".color-hd").click(function() {
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
        $(this).next(".color-bd").stop().slideDown();
    } else {
        $(this).next(".color-bd").stop().slideUp();
    }
  });

  $("#close_box,.masked").click(function() {
      $(".shopCart-box").removeClass("on");
      $('body').css({'position':'static'});
      $(window).scrollTop(scrolltop)
  });

  //vue  
  var vm = new Vue({
      el: '#container',
      data: {
          contentId: getQueryString('contentId'), //文字的contentId
          shareId: sessionStorage.getItem('fenYongShareId')?sessionStorage.getItem('fenYongShareId'):0, //分享页的ID
          datas: {},  //页面数据
          isDianZhan:true, 
          shopingNum: 1, //购买商品数量
          getSkuStockInf: 0, //可购买的库存量
          goodsPrice: 0, //商品价格
          specifin: [], //商品规格 
          spuDetailList: '', //获取SPU详情信息 
          skuNum: 0, //购买的商品数量
          skuTitle: '', //购买商品的标题
          skuId: '', //商品的skuId
          totalPrice:0, //商品总价
          spuId:'', //商品的spuId
          skuType:'', //商品类型
          type: 1, //1为手机加入购物车 ，2为立即购买
          isIosWebviewApp:isIosWebviewApp, //是否是app打开的
      },
      ready: function () {
        var This = this;

        //调用页面查看次数接口
        maker.addReadCountCallback({
            shareId: localStorage.getItem('weiXinShareIdCode'),
        });

       //请求文案详情内容信息
       $.AJAX({
            type:'post', 
            url:config.basePath+'content/svMakerContent/getContentDetail',
            data:{
                contentId:This.contentId,
                contentUrl:encodeURIComponent(window.location.href.split('#')[0]),
            },
            success:function(data){
              This.datas=data.data;
              $('.wenantitle').text(data.data.title.substring(0,10));
              //显示content主题内容
              setTimeout(function(){
                $('#container').removeClass('hide');
                //执行swiper
                var swiper = new Swiper('.swiper-container', {
                  pagination: '.swiper-pagination',
                  slidesPerView: 'auto',
                  paginationClickable: true,
                  spaceBetween: 0,
                  freeMode: true
                });
              },config.containerShowTime);

              //调用微信分享相关功能
              This.winXinShare(true);

            },
       });
      },
      methods: {
        //视频操作相关
        videoAboutCaoZuo:function($event,mainUrl){
            var winWidth=$(window).width();
            var video=$($event.target).parent().siblings('video')[0];
            $($event.target).parent().addClass('hide').removeClass('show');
            video.play();
            //监听播放
            video.addEventListener("playing", function (ev) {
                $($event.target).parent().addClass('hide').removeClass('show');
                $(video).addClass('show').removeClass('hide');
                $(video).css({"backgroundImage":"","backgroundColor":"#000"});
                var headerHeight=$('#header-nav').height();
                var videoHeight=$(video).height();
                var winHeight=$(window).height();
                //浏览器滚动时监听
                $(window).on('scroll',function(){
                    var winScrollTop=$(window).scrollTop();
                    var videoScrollTop=$(video).offset().top;
                    if((videoScrollTop+videoHeight-headerHeight)<winScrollTop||videoScrollTop>(winScrollTop+winHeight)){
                        video.pause();
                    };
                });
            });
            //监听暂停
            video.addEventListener("pause", function (ev) {
                $($event.target).parent().addClass('show').removeClass('hide');
                $(video).addClass('hide').removeClass('show');
                $(video).css({"backgroundImage":"url("+mainUrl+")","backgroundColor":"transparent"}) 
            });
            //拖动中执行
            video.addEventListener("seeking", function (ev) { 
                $($event.target).parent().addClass('hide').removeClass('show');
                $(video).addClass('show').removeClass('hide');
                $(video).css({"backgroundImage":"","backgroundColor":"#000"});
                var headerHeight=$('#header-nav').height();
            });
        },
        //微信分享
        winXinShare:function(isnotshareNow){
            //调用微信分享相关功能
            everyPageWeiXinShare({
              debug:false,
              notshareNow:isnotshareNow,
              title :vm.datas.title,
              desc :vm.datas.desc,       
              mainUrl:vm.datas.mainUrl + '?imageView2/1/w/130/h/130', 
              success:function(){
                  $('#weixinShare').removeClass('show').addClass('hide');
                  if(localStorage.getItem('weiXinShareIdCode')){vm.shareSuccess()};
              },     
              cancel:function(){
                $('#weixinShare').removeClass('show').addClass('hide');
              },
            });
        },

        //加入购物车
        joinShoppingCart: function(spuId,skuType) {
            vm.type = 1;
            $(".shopCart-box").addClass("on");
            scrolltop=$(window).scrollTop();
            $('body').css({'position':'fixed',left:0,top:-scrolltop+'px'});
            vm.spuId=spuId;
            vm.skuType=skuType;
            vm.getSpuAndGuige(spuId);
        },

        //设置为立即购买
        payOrderNow: function(spuId,skuType) {
            vm.type = 2;
            $(".shopCart-box").addClass("on");
            scrolltop=$(window).scrollTop();
            $('body').css({'position':'fixed',left:0,top:-scrolltop+'px'});
            vm.spuId=spuId;
            vm.skuType=skuType;
            vm.getSpuAndGuige(spuId);
        },

        //获得spu详情和商品规格
        getSpuAndGuige:function(spuId){
          //获取SPU详情信息
            $.AJAX({
                type: 'get',
                url: config.basePath + 'product/svProduct/getSpuDetailInfo',
                data: {
                    spuId: spuId,
                },
                success: function(data) {
                    vm.getSkuStockInf = data.data.spuDetailInfo.totalStockNum; //可购买的商品库存
                    vm.spuDetailList = data.data.spuDetailInfo; //商品详情数据
                    vm.goodsPrice =vm.totalPrice = data.data.spuDetailInfo.salePrice //商品价格
                },
            });

            //获取商品规格
            $.AJAX({
                type: 'get',
                url: config.basePath + 'product/svProduct/getSpuStandardList',
                data: {
                    spuId: spuId,
                },
                success: function(data) {
                    vm.specifin = data.data.getSpuStandardList;
                }
            });
        },

        //切换tab获得产品库存
        activeLi: function($event, skuId) {
            $($event.target).addClass("checked").siblings().removeClass("checked");
            vm.skuId = skuId;
            //获取规格数量
            $.AJAX({
                url: config.basePath + 'product/svProduct/getSkuStockInfo',
                data: {
                    skuId: skuId,
                },
                success: function(data) {
                    vm.getSkuStockInf = data.data.getSkuStockInfo.stockNum;
                    //获得产品规格和价格
                    $.AJAX({
                        url: config.basePath + 'product/svProduct/getSkuPriceInfo',
                        data: {
                            skuId: skuId,
                        },
                        success: function(data) {
                            vm.goodsPrice = data.data.getSkuStockInfo.salePrice;
                        },
                    }); //end
                },
            });
        },

        //减少商品
        reduceShopNum: function() {
            if (vm.shopingNum > 1) {
                vm.shopingNum--;
                if(vm.shopingNum == 1){
                    $('.num .left').addClass('disabled');
                }
                if(vm.shopingNum < vm.getSkuStockInf){
                    $('.num .right').removeClass('disabled');
                }
            } else {
                $('.num .left').addClass('disabled');
                Popup.miss({ title: '亲,商品数量最少为1件额！' });
            }
        },

        //增加商品
        addShopNum: function() {
            if(vm.shopingNum == vm.getSkuStockInf){
                Popup.miss({ title: '亲,没有那么多库存额！' });
                return false;
            }
            vm.shopingNum++;
            if (vm.shopingNum > 1){
                $('.num .left').removeClass('disabled');
            }
            if(vm.shopingNum == vm.getSkuStockInf){
                $('.num .right').addClass('disabled');
            }
        },

        //开始购买或者加入购物车
        submitShopNow: function() {
            if(vm.skuType==3&&vm.shopingNum>1){
                Popup.alert({type:'msg',title:'亲，创客商品每人只能购买一件额!'}); return false;
            };
            if (vm.type == 1) {
                //加入购物车
                $.AJAX({
                    type: 'post',
                    url: config.basePath + 'product/svProduct/addShopCart',
                    data: {
                        skuId: vm.skuId || vm.specifin[0].skuId,
                        skuNum: vm.shopingNum,
                        skuTitle: vm.spuDetailList.title,
                        shareId: vm.shareId,
                    },
                    success: function (data) {
                        //取消弹出层
                        $(".shopCart-box").removeClass("on");
                        $('body').css({'position':'static'});
                        $(window).scrollTop(scrolltop)
                        Popup.miss({title: '加入购物车成功！'});
                    },
                });
            } else if (vm.type == 2) {
                //立即购买 结算订单
                var price = vm.goodsPrice * vm.shopingNum;
                //var price=vm.spuDetailList.salePrice*vm.shopingNum;
                var json = {
                    totalPrice: price,
                    skuList: [{
                        skuId: vm.skuId || vm.specifin[0].skuId,
                        num: vm.shopingNum,
                        shareId: vm.shareId 
                    }],
                };
                $.AJAX({
                    url: config.basePath + 'product/svSettlement/settlement?param=' + JSON.stringify(json),
                    success: function(o) {
                        sessionStorage.setItem('confirmOrderSpu', getQueryString('spuId'));
                        sessionStorage.setItem('data', JSON.stringify(o.data));
                        var href = "http://" + window.location.host + "/trueme/order/confirmOrder.html";
                        location.href = href;
                        sessionStorage.setItem('weixin-next-url', href);
                    }
                });
            } //end

        },

        //点赞
        likeElectricityWenAn: function ($event) {
          if(vm.isDianZhan){
            maker.likeElectricityWenAn({
                contentId: vm.contentId,
                success: function (data) {
                    Popup.miss({title:'点赞成功！'});
                    vm.isDianZhan=false;
                    $($event.target).parent('li').addClass('active');
                },
            });
          };
        },

        //收藏
        collectionWenAn: function ($event) {
            maker.collectionWenAn({
                contentId: vm.contentId,
                success: function (data) {
                    if(data.data.collect==0){
                      $($event.target).parent('li').removeClass('active');
                    }else{
                      $($event.target).parent('li').addClass('active');  
                    }   
                },
            });
        },

        //用户分享成功后回调分享成功
        shareSuccess:function(){
           $.AJAX({
                type: 'post',
                url: config.basePath + 'content/svMakerContent/pushShare',
                data: {
                    shareId:localStorage.getItem('weiXinShareIdCode'),
                },
                success: function (data) {
                    Popup.miss({title: '分享成功！'});
                    $('#weixinShare').removeClass('show').addClass('hide');
                },
            });
        },


      }
  });
  
  

});








