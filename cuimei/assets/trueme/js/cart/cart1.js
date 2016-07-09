$(function() {
    var myVue = new Vue({
        el: '#container',
        mixins: [mixin],
        data: {
            emptyLink: window.location.origin,
            idCardName: '',
            idCardNum: '',
            hotSaleList:[], //hut推荐
            canSummitIdCard: false,
            showDelete: false,
            empty: false,
            classA: 'unselect-icon',
            classB: 'select-icon',
            items: []
        },
        ready: function(){
            var that = this;
            $.AJAX({
                url: config.basePath+"product/svProduct/getShopCartList",
                success: function(o){
                    if(o.data.totalNum == 0){
                        that.empty = true;
                    }else{
                        for(key in o.data.shopCartSkuList){
                            o.data.shopCartSkuList[key].showPrice = Math.round(o.data.shopCartSkuList[key].skuPrice * 100 * o.data.shopCartSkuList[key].skuNum)/100;
                        }
                        that.items = o.data.shopCartSkuList;
                        $('.see-more').removeClass('hide');
                    }
                    $('#container').show();
                    that.$nextTick(function(){
                        if($('.product-list > li .unselect-icon').length !=0){
                            $('.unselect-icon').addClass('select-icon');
                            that.changeTotalPrice();
                        }
                    })
                }
            })
        },
        methods: {
            toDelete: function(e){
                var that = this;
                that.showDelete = true;
            },
            completeDelete: function(e){
                var that = this;
                that.showDelete = false;
            },
            deleteItem: function(e){
                var that = this;
                Popup.confirm({
                    title: "你确定要删除该商品吗？",
                    yes: function(){
                        var skuId = $(e.target).parents('li').data('sku-id');
                        var $target = $(e.target);
                        var url = config.basePath+'product/svProduct/deleteShopCartSku?skuId=' + skuId;
                        $.AJAX({
                            url: url,
                            success: function(){
                                if($('.product-list li').length ==1){
                                    location.reload();
                                }
                                $target.parents('li').remove();
                                if($('.product-list > li .unselect-icon').length !=0){
                                    if($('.product-list > li .unselect-icon').length == $('.product-list > li .select-icon').length){
                                        $('.toobar .unselect-icon').addClass('select-icon');
                                    }else{
                                        $('.toobar .unselect-icon').removeClass('select-icon');
                                    }
                                }else{
                                    $('.toobar .unselect-icon').removeClass('select-icon');
                                }
                                that.changeTotalPrice();
                            }
                        })
                    }
                })
            },
            singleSelect: function(e){
                var that = this;
                $(e.target).toggleClass('select-icon');
                if($('.product-list > li .unselect-icon').length == $('.product-list > li .select-icon').length){
                    $('.toobar .unselect-icon').addClass('select-icon');
                }else{
                    $('.toobar .unselect-icon').removeClass('select-icon');
                }
                that.changeTotalPrice();
            },
            itemSelect: function(e){
                var that = this;
                $(e.target).toggleClass('select-icon');
                that.changeTotalPrice();
            },
            allSelect: function(e){
                var that = this;
                if($(e.target).hasClass('select-icon')){
                    $('.unselect-icon').removeClass('select-icon');
                }else{
                    $('.unselect-icon').addClass('select-icon');
                }
                that.changeTotalPrice();
            },
            lessNum: function(e){
                var that = this;
                if(parseInt($(e.target).parent().find('.product-num').html()) == 1){
                    Popup.alert({type:'msg',title:'亲，商品数量不能为零哦~'});
                    return;
                }
                var skuId = $(e.target).parents('li').data('sku-id');
                win.showLoading();
                $.AJAX({
                    type: "POST",
                    data: {
                        skuId: skuId,
                        skuNum: parseInt($(e.target).parent().find('.product-num').html()) - 1
                    },
                    url: config.basePath + 'product/svProduct/updateShopCartNum',
                    success: function(o){
                        var $parent = $(e.target).parent();
                        $parent.find('input').val(parseInt($parent.find('input').val()) - 1);
                        $parent.find('.product-num').html($parent.find('input').val());
                        $parent.parents('.product-des').find('.now-num i').html($parent.find('input').val());
                        var $priceBox = $parent.parents('.price-and-num').find('.product-price');
                        $priceBox.find('i').text((Math.round($priceBox.data('sku-price') * 100 * $parent.find('input').val())/100).toFixed(2));
                        if(parseInt($parent.find('.product-num').html()) == 1){
                            $(e.target).addClass('disabled');
                        }
                        that.changeTotalPrice();
                    }
                });
            },
            addNum: function(e){
                var that = this;
                var $parent = $(e.target).parent();
                var skuId = $(e.target).parents('li').data('sku-id');
                win.showLoading();
                $.AJAX({
                    type: "POST",
                    data: {
                        skuId: skuId,
                        skuNum: parseInt($(e.target).parent().find('.product-num').html()) + 1
                    },
                    url: config.basePath + 'product/svProduct/updateShopCartNum',
                    success: function(o){
                        $parent.find('input').val(parseInt($parent.find('input').val()) + 1);
                        $parent.find('.product-num').html($parent.find('input').val());
                        $parent.parents('.product-des').find('.now-num i').html($parent.find('input').val());
                        var $priceBox = $parent.parents('.price-and-num').find('.product-price');
                        $priceBox.find('i').text((Math.round($priceBox.data('sku-price') * 100 * $parent.find('input').val())/100).toFixed(2));
                        if(parseInt($parent.find('.product-num').html()) > 1){
                            $parent.find('.less-btn').removeClass('disabled');
                        }
                        that.changeTotalPrice();
                    }
                });
            },
            changeTotalPrice: function(){
                var final_price = 0;
                var final_num = 0;
                for(var i=0; i<$('.product-list li .select-icon').length; i++){
                    final_price = Math.round(100*(final_price + parseFloat($('.product-list li .select-icon').eq(i).parents('li').find('.product-price i').text())))/100;
                    final_num += parseInt($('.product-list li .select-icon').eq(i).parents('li').find('input[name="numBox"]').val());
                }
                console.log(final_price)
                $('.final-total span i').text(final_price.toFixed(2));
                $('.pay-btn i').text(final_num);
            },
            submit: function(){
                var param = {};
                param.totalPrice = Math.round(100*parseFloat($('.final-total span i').text()))/100;
                if(param.totalPrice == 0){
                    Popup.miss({'title': '你还没有选择商品哦'});
                    return false;
                }
                var firstEntrance = $('.product-list li .select-icon').eq(0).parents('li').data('isentrance');
                for(var i=0; i<$('.product-list li .select-icon').length; i++){
                    if($('.product-list li .select-icon').eq(i).parents('li').data('isentrance') != firstEntrance){
                        Popup.alert({'type':'msg','title':'亲，海外商品和非海外商品不能一起下单哦~'});
                        return false;
                    }
                }
                param.skuList = [];
                for(var i=0; i<$('.product-list li .select-icon').length; i++){
                    var obj = {};
                    obj.spuId = $('.product-list li .select-icon').eq(i).parents('li').data('spu-id');
                    obj.skuId = $('.product-list li .select-icon').eq(i).parents('li').data('sku-id');
                    obj.skuType=$('.product-list li .select-icon').eq(i).parents('li').data('sku-type');
                    obj.num = parseInt($('.product-list li .select-icon').eq(i).parents('li').find('input[name="numBox"]').val());
                    obj.shareId = $('.product-list li .select-icon').eq(i).parents('li').data('share-id');
                    param.skuList.push(obj);
                }
                //判断创客商品是否超过1件的提示
                var json={
                    haveSpuId:false, //是否有创客商品
                    num:0, //有几件商品
                };
                for(var i=0,len=param.skuList.length;i<len;i++){
                    if(param.skuList[i]['skuType']==3){
                        json.haveSpuId=true;
                        json.num+=param.skuList[i]['num'];
                    };
                };
                if(json.haveSpuId&&json.num>1){
                    Popup.alert({type:'msg',title:'亲，创客商品每人只能购买一件哦!'}); return false;
                }
                console.log(JSON.stringify(param))
                $.AJAX({
                    // type: "POST",
                    url: config.basePath + 'product/svSettlement/settlement?param=' + JSON.stringify(param),
                    success: function(o){
                        console.log(o);
                        sessionStorage.setItem('data', JSON.stringify(o.data));
                        location.href = "../order/confirmOrder.html";
                    }
                });
            }
        }
    });
    myVue.conflicting({callback:function(data){
       myVue.hotSaleList=data;
    }});
});
