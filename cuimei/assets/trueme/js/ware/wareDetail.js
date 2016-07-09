/*wareDetail.js*/
$(function() {
    //获取商品的spuId
    var scrollTop = 0;
    var shopSpuId = getQueryString('spuId');
    var fenYongShareId=sessionStorage.getItem('fenYongShareId')?sessionStorage.getItem('fenYongShareId'):0;
    //折叠
    $(".color-hd").click(function() {
        $(this).toggleClass("active");
        if ($(this).hasClass("active")) {
            $(this).next(".color-bd").stop().slideDown();
        } else {
            $(this).next(".color-bd").stop().slideUp();
        }
        return false;
    });

    //弹入弹出
    $(".too-btn").click(function() {
        if ($(this).hasClass('offLine')) {
            return false;
        }
        scrollTop = $(window).scrollTop();
        $(".shopCart-box").addClass("on");
        $('body').css({
            'position': 'fixed',
            'top': -scrollTop + 'px'
        });
    });
    $("#close_box,.masked").click(function() {
        $('body').css({
            'position': ''
        });
        document.body.scrollTop = scrollTop;
        setTimeout(function() {
            $(".shopCart-box").removeClass("on");
        }, 0);
    });
    $(".shopCart-con").click(function() {
        return false;
    });

    //banner
    var vm = new Vue({
        el: '#container',
        mixins: [mixin],
        data: {
            offLine: false,
            banner: [], //banner图
            hotSaleList: [], //hut推荐
            spuDetail: [], //商品spu详情图
            spuDetailList: {}, //获取SPU详情信息
            spuTotalList: [], //
            specifin: [], //商品规格
            skuNum: 0, //购买的商品数量
            skuTitle: '', //购买商品的标题
            skuId: '', //商品的skuId
            type: 1, //1为手机加入购物车 ，2为立即购买
            shopingNum: 1, //购买商品数量
            getSkuStockInf: 0, //可购买的库存量
            goodsPrice: 0, //商品价格 
            hasCollected: false, //是否已收藏
            isIosWebviewApp:isIosWebviewApp, //是否是app
            skuType:0,
        },
        ready: function() {
            $('#container').removeClass('hide');
            if (sessionStorage.getItem('confirmOrderSpu')) {
                sessionStorage.removeItem('confirmOrderSpu');
            }
            $(window).on('scroll', function() {
                var scrollTop = document.body.scrollTop;
                var targetColor = 0.5 - scrollTop / (88 * rem / 100);
                var targetOpacity = (scrollTop / (88 * rem / 100) - 0.5) / 0.5;
                if (scrollTop <= 44 * rem / 100) {
                    $('.header-icon').css('backgroundImage', 'url(' + __uri('/assets/trueme/images/ware/ware_detail_spirite.png') + ')');
                    $('.trueme-home').addClass("trueme-home2");
                    $('.header').css({
                        background: 'linear-gradient(rgba(0,0,0,' + targetColor + '), rgba(0,0,0,0))'
                    });
                    $('.header').css({
                        background: '-webkit-linear-gradient(rgba(0,0,0,' + targetColor + '), rgba(0,0,0,0))'
                    });
                    $('.header').css({
                        background: '-moz-linear-gradient(rgba(0,0,0,' + targetColor + '), rgba(0,0,0,0))'
                    });
                    $('.header').css({
                        background: '-o-linear-gradient(rgba(0,0,0,' + targetColor + '), rgba(0,0,0,0))'
                    });
                } else if (scrollTop <= 88 * rem / 100) {
                    $('.header-icon').css('backgroundImage', 'url(' + __uri('/assets/trueme/images/ware/ware_detail_spirite_black.png') + ')');
                    $('.trueme-home').removeClass("trueme-home2");
                    $('.header').css({
                        background: 'linear-gradient(rgba(255,255,255,' + targetOpacity + '), rgba(255,255,255,' + targetOpacity + '))'
                    });
                    $('.header').css({
                        background: '-webkit-linear-gradient(rgba(255,255,255,' + targetOpacity + '), rgba(255,255,255,' + targetOpacity + '))'
                    });
                    $('.header').css({
                        background: '-moz-linear-gradient(rgba(0,0,0,' + targetOpacity + '), rgba(0,0,0,0))'
                    });
                    $('.header').css({
                        background: '-o-linear-gradient(rgba(0,0,0,' + targetOpacity + '), rgba(0,0,0,0))'
                    });
                }
            });

            var This = this;

            //加载banner图片
            $.AJAX({
                type: 'get',
                url: config.basePath + 'product/svSpuImg/getSpuMain',
                data: {
                    spuId: shopSpuId,
                },
                success: function(data) {
                    //渲染banner
                    vm.banner = data.data.spuMainImgList;
                    //滚动懒加载
                    //Publisher调用微信分享事件
                    if(vm.banner.length&&!jQuery.isEmptyObject(vm.spuDetailList)){
                        This.winXinShare(true)
                    }
                    This.$nextTick(function() {
                        var myImg = new Image();
                        myImg.src = vm.banner[0].imgMainUrl + '?imageView2/1/w/160/h/160';
                        setTimeout(function() {
                            var bannerSwiper = new Swiper('.banner', {
                                autoplay: 2000,
                                autoplayDisableOnInteraction: false,
                                visibilityFullFit: true,
                                loop: true,
                                pagination: '.swiper-pagination'
                            });
                        }, 0);
                    });
                },
            });

            //获取SPU详情信息
            $.AJAX({
                type: 'get',
                url: config.basePath + 'product/svProduct/getSpuDetailInfo',
                data: {
                    spuId: shopSpuId,
                },
                success: function(data) {
                    if (data.data.spuDetailInfo.spuStatus == 1) {
                        $('.onLine').removeClass('hide');
                    } else {
                        $('.offLine').removeClass('hide');
                    }
                    $('.good-main').removeClass('hide');
                    // vm.getSkuStockInf = data.data.spuDetailInfo.totalStockNum; //可购买的商品库存
                    vm.spuDetailList = data.data.spuDetailInfo; //商品详情数据
                    vm.goodsPrice = data.data.spuDetailInfo.salePrice //商品价格
                    //Publisher调用微信分享事件
                    vm.getHotSaleList();
                    if(vm.banner.length&&!jQuery.isEmptyObject(vm.spuDetailList)){
                        This.winXinShare(true)
                    }
                },
            });
            
            //获取用户是否收藏该商品
            $.AJAX({
                type: "POST",
                code: true,
                pageSet: true,
                url: config.basePath + 'user/sviscollectforgoods?spuId=' + shopSpuId,
                error: function(o) {
                    if (o.code == 1004) {
                        return false;
                    }
                    if (o.code == 5300) {
                        This.hasCollected = true;
                    }
                }
            });

            //加载商品详情图
            $.AJAX({
                type: 'get',
                url: config.basePath + 'product/svSpuImg/getSpuDetail',
                data: {
                    spuId: shopSpuId,
                },
                success: function(data) {
                    $('.detail').removeClass('hide');
                    $('.too-bar').removeClass('hide');
                    This.spuDetail = data.data.spuDetailImgList;
                    //滚动懒加载
                    setTimeout(function(){$("img.lazy").lazyload({threshold:config.threshold});}, 0); 
                }
            });

            //获取商品规格
            $.AJAX({
                type: 'get',
                url: config.basePath + 'product/svProduct/getSpuStandardList',
                data: {
                    spuId: shopSpuId,
                },
                success: function(data) {
                    vm.specifin = data.data.getSpuStandardList;
                    //获取首个规格库存
                    $.AJAX({
                        url: config.basePath + 'product/svProduct/getSkuStockInfo',
                        data: {
                            skuId: vm.specifin[0].skuId,
                        },
                        success: function(data) {
                            vm.getSkuStockInf = data.data.getSkuStockInfo.stockNum;
                            //获得产品规格和价格
                            $.AJAX({
                                url: config.basePath + 'product/svProduct/getSkuPriceInfo',
                                data: {
                                    skuId: vm.specifin[0].skuId,
                                },
                                success: function(data) {
                                    vm.goodsPrice = data.data.getSkuStockInfo.salePrice;
                                },
                            }); //end
                        },
                    });
                }
            });

        },
        methods: {
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

            //加入购物车
            joinShoppingCart: function() {
                vm.type = 1;
            },

            //设置为立即购买
            payOrderNow: function() {
                vm.type = 2;
            },

            //减少商品
            reduceShopNum: function() {
                if (vm.shopingNum > 1) {
                    vm.shopingNum--;
                    if (vm.shopingNum == 1) {
                        $('.num .left').addClass('disabled');
                    }
                    if (vm.shopingNum < vm.getSkuStockInf) {
                        $('.num .right').removeClass('disabled');
                    }
                } else {
                    $('.num .left').addClass('disabled');
                    Popup.miss({ title: '亲,商品数量最少为1件哦！' });
                }
            },

            //增加商品
            addShopNum: function() {
                if (vm.shopingNum == vm.getSkuStockInf) {
                    Popup.miss({ title: '亲,没有那么多库存哦！' });
                    return false;
                }
                vm.shopingNum++;
                if (vm.shopingNum > 1) {
                    $('.num .left').removeClass('disabled');
                }
                if (vm.shopingNum == vm.getSkuStockInf) {
                    $('.num .right').addClass('disabled');
                }
            },

            //开始购买或者加入购物车
            submitShopNow: function() {
                if (vm.spuDetailList.skuType == 3 && vm.shopingNum > 1) {
                    Popup.alert({ type: 'msg', title: '亲，创客商品每人只能购买一件哦!' });
                    return false;
                };

                if (vm.type == 1) {
                    //加入购物车
                    var data = {
                        skuId: vm.skuId || vm.specifin[0].skuId,
                        skuNum: vm.shopingNum,
                        skuTitle: vm.spuDetailList.title,
                    };
                    if (fenYongShareId) {
                        data.shareId = parseInt(fenYongShareId);
                    }
                    $.AJAX({
                        type: 'post',
                        url: config.basePath + 'product/svProduct/addShopCart',
                        data: data,
                        success: function(data) {
                            //取消弹出层
                            $('body').css({
                                'position': ''
                            });
                            $(".shopCart-box").removeClass("on");
                            document.body.scrollTop = scrollTop;
                            Popup.miss({ title: '加入购物车成功！' });
                        },
                    });
                } else if (vm.type == 2) {
                    //立即购买 结算订单
                    var price = vm.goodsPrice * vm.shopingNum;
                    //var price=vm.spuDetailList.salePrice*vm.shopingNum;
                    var json = {
                        totalPrice: price,
                        skuList: [{
                            spuId: shopSpuId,
                            skuId: vm.skuId || vm.specifin[0].skuId,
                            num: vm.shopingNum,
                            shareId: fenYongShareId
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

            //收藏商品
            collection: function(event) {
                trueme.w.collection({
                    spuId: shopSpuId,
                    success: function(data) {
                        if (data.data.flag == 2) {
                            $('.store-icon').addClass('stored');
                            $('.store-num i').text(parseInt($('.store-num i').text()) + 1);
                            Popup.miss({ title: '收藏成功！' });
                        } else {
                            $('.store-icon').removeClass('stored');
                            $('.store-num i').text(parseInt($('.store-num i').text()) - 1);
                            Popup.miss({ title: '取消收藏成功！' });
                        }
                    }
                });
            },

            //微信分享
            winXinShare:function(isnotshareNow){
                //--------------调用微信分享相关功能----------------------------
                everyPageWeiXinShare({
                    notshareNow:isnotshareNow,
                    title: vm.spuDetailList.title,
                    desc:vm.spuDetailList.slogan,
                    mainUrl: vm.banner[0].imgMainUrl + '?imageView2/1/w/160/h/160',
                });
            },

            //获取hot推荐 
            getHotSaleList:function(){
                //获取hot推荐    
                vm.conflicting({
                    skuType:vm.spuDetailList.skuType,
                    callback: function(data) {
                        $('.see-more').removeClass('hide');
                        vm.hotSaleList = data;
                    }
                });   
            },

        },
    });

    

});
