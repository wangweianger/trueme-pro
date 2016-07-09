$(function() {
    var vm = new Vue({
        el: '#container',
        mixins: [mixin],
        data: {
            allMsg:{
                isAllSelected:true, //是否全选
                totalPrice:0,   //选择商品总价
                totalNum:0,     //选择的商品数量
                datas:[],       //选择商品的数据列表
                haveSkuType:{haveSpuId:false,num:0},  //是否有拉新商品，数量有多少
                isEntrance:false,  //是否同时有海外商品和国内商品
            },
            items:[], //购物车数据列表
            hotSaleList:[], //hut推荐数据列表
            showDelete:false, //编辑商品状态
        },
        ready: function(){
            //获得购物车数据列表
            var This=this;
            $.AJAX({
                url: config.basePath+"product/svProduct/getShopCartList",
                success: function(data){
                    //购物车数据列表
                    This.items=data.data.shopCartSkuList;
                    setTimeout(function(){
                        $('#container,.recommend').removeClass('hide');
                    },config.containerShowTime);
                    This.getTotalAndSelected();
                }
            });
        },
        methods: {
            //增加数量
            addNum:function(item){
                win.showLoading();
                item.skuNum++;
                vm.getTotalAndSelected();
                vm.saveCartsDatas(item);
            },
            //减少商品
            lessNum:function(item){
                if(item.skuNum>1){
                    win.showLoading();
                    item.skuNum--;
                    vm.getTotalAndSelected();
                    vm.saveCartsDatas(item);
                }else{
                    Popup.miss({ title: '亲,商品数量最少为1件哦！' });
                }
            },
            //增加，减少商品数量保存到数据库
            saveCartsDatas:function(item){
                $.AJAX({
                    type: "POST",
                    data: {
                        skuId: item.skuId,
                        skuNum: item.skuNum
                    },
                    url: config.basePath + 'product/svProduct/updateShopCartNum',
                    success: function(data){
                    }
                });
            },
            //商品全选
            allSelect:function(){
                if(vm.allMsg.isAllSelected){
                    vm.allMsg.isAllSelected=false;
                    for(var i=0;i<vm.items.length;i++){ vm.items[i].isSelected=0; };
                    vm.getTotalAndSelected();
                }else{
                    vm.allMsg.isAllSelected=true;
                    for(var i=0;i<vm.items.length;i++){ vm.items[i].isSelected=1; };
                    vm.getTotalAndSelected();
                }
            },
            //获得总件数,价格和是否全选
            getTotalAndSelected:function(){
                vm.allMsg={isAllSelected:true,totalPrice:0,totalNum:0,datas:[],haveSkuType:{haveSpuId:false,num:0},isEntrance:false,};
                var isEntrance;
                for(var i=0;i<vm.items.length;i++){
                    if(vm.items[i].isSelected){  //只有选中的商品才能参与计算
                        vm.allMsg.totalNum+=vm.items[i].skuNum;   //算出总选择数量
                        vm.allMsg.totalPrice+=vm.items[i].skuNum*vm.items[i].skuPrice; //算出选择的总价格
                        vm.allMsg.datas.push(vm.items[i]);
                        if(vm.items[i]['skuType']==3){  //判断是否有拉新商品，及其数量
                            vm.allMsg.haveSkuType['haveSpuId']=true;  
                            vm.allMsg.haveSkuType.num+=vm.items[i]['skuNum'];
                        };
                        if(typeof(isEntrance)=='number'){  //判断是否有海外商品和非海外商品共存
                            if(isEntrance!=vm.items[i].isEntrance){ vm.allMsg.isEntrance=true; };
                            isEntrance=vm.items[i].isEntrance;
                        }else{
                            isEntrance=vm.items[i].isEntrance;
                        };
                    }else{
                        vm.allMsg.isAllSelected=false;
                    };
                };
            },
            //商品单选
            singleSelect:function(item){
                item.isSelected=item.isSelected==1?item.isSelected=0:item.isSelected=1;
                vm.getTotalAndSelected();
            },
            //编辑商品
            toDelete:function(){
                vm.showDelete=true;
            },
            //完成编辑
            completeDelete:function(){
                vm.showDelete=false;
            },
            //删除商品
            deleteItem:function($index,item){
                Popup.confirm({title: "你确定要删除该商品吗？",yes: function(){
                    $.AJAX({
                        url: config.basePath+'product/svProduct/deleteShopCartSku?skuId=' + item.skuId,
                        success: function(){
                          vm.items.splice($index,1);
                          vm.getTotalAndSelected();
                        }
                    });
                }})
            },
            //去结算
            submit:function(){
                if(vm.allMsg.totalPrice == 0){ Popup.miss({'title': '你还没有选择商品哦'});return false; };
                var param={totalPrice:vm.allMsg.totalPrice,skuList:[]};
                for(var i=0;i<vm.allMsg.datas.length;i++){
                    param.skuList.push({
                        spuId:vm.allMsg.datas[i].spuId,
                        skuId:vm.allMsg.datas[i].skuId,
                        skuType:vm.allMsg.datas[i].skuType,
                        num:vm.allMsg.datas[i].skuNum,
                        shareId:vm.allMsg.datas[i].shareId,
                    });
                };
                //判断创客商品是否超过1件的提示
                if(vm.allMsg.haveSkuType.haveSpuId&&vm.allMsg.haveSkuType.num>1){
                    Popup.alert({type:'msg',title:'亲，创客商品每人只能购买一件哦!'}); return false;
                };
                if(vm.allMsg.isEntrance){
                    Popup.alert({'type':'msg','title':'亲，海外商品和非海外商品不能一起下单哦~'});return false;
                };
                $.AJAX({
                    url: config.basePath + 'product/svSettlement/settlement?param=' + JSON.stringify(param),
                    success: function(o){
                        console.log(o);
                        sessionStorage.setItem('data', JSON.stringify(o.data));
                        location.href = "../order/confirmOrder.html";
                    }
                });
            },
        }
    });
    vm.conflicting({callback:function(data){
       vm.hotSaleList=data;
    }});
});
