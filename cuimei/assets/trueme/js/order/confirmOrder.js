
var vm = new Vue({
    el: '#container',
    data: {
        selectedAddrId: getQueryString('id'), //查询当前所用的收货地址
        canSummitIdCard: false,
        addrEmpty: false,
        addrShow: false,
        defaultAddress: {}, //用户的地址
        isEntrance: 0, //是否是海外商品
        uuid: '',
        totalSkuPrice: 0,
        totalNum: 0,
        items: [],
        idCardName:'', //用户名字
        idCardNum:'', //身份证号
        showIdCard:'', //是否需要显示身份证号
        haveshowIdCard:'', //是否有填过身份证信息
        isSaveIdNumber:false, //是否保存身份证号码
    },
    ready: function(){
        var that = this;
        $('#container').show();
        sessionStorage.setItem('saveAndUseAddress','1');
        if(that.selectedAddrId){
            url = config.basePath + 'user/svuseraddress/getUserAddressById?id=' + that.selectedAddrId;
        }else{
            url = config.basePath + 'user/svuseraddress/getUserAddress';
        }

        //获得当前所需付款的商品列表
        var data = JSON.parse(sessionStorage.getItem('data'));
        that.totalSkuPrice = data.totalSkuPrice;
        that.isEntrance = data.isEntrance;
        that.uuid = data.uuid;
        that.items = data.spuMap;
        var totalNum = 0;
        for(key in data.spuMap){
            for(var i=0; i<data.spuMap[key].spuList.length; i++){
                totalNum += data.spuMap[key].spuList[i].num;
            }
        }
        that.totalNum = totalNum;

        //查询收货地址
        $.AJAX({
            url: url,
            success: function(o){
                if(o.data.userAddress == null){
                    that.addrEmpty = true;
                }else{
                    that.addrShow = true;
                    that.idCardName=o.data.userAddress.linkman;
                    that.defaultAddress = o.data.userAddress;
                    //如果是海外商品时 判断是否有身份证号
                    if(that.isEntrance){
                        that.showIdCard=true;
                        if(that.defaultAddress.cardId){
                            that.isSaveIdNumber=true;
                            that.haveshowIdCard=true;
                            that.idCardNum=that.defaultAddress.cardId;
                        }else{
                            that.haveshowIdCard=false;
                        }
                    }else{
                        that.showIdCard=false;
                    }
                }
            }
        });
    
    },
    methods: {
        //返回上一页
        cancelConfirm: function(){
            if(sessionStorage.getItem('confirmOrderSpu')){
                location.href = config.basePath + 'trueme/ware/wareDetail.html?spuId=' + sessionStorage.getItem('confirmOrderSpu');
            }else{
                location.href = config.basePath + 'trueme/cart/cart_new.html';
            }
        },

        toggleShow: function(){
            $('.order-title').find('.detail-btn').toggleClass('hide-detail');
            $('.order-info-box').toggle();
        },

        //检测id number填写是否正确
        checkIdCard:function(){
            if(vm.idCardName && regCombination("id").test(vm.idCardNum)){
                vm.canSummitIdCard = true;
            }else{
                vm.canSummitIdCard = false;
            }
        },

        //检查所填写的身份证是否合法
        haveIDcard:function(){
            if(!regCombination('id').test(vm.idCardNum)){
                Popup.alert({title:'身份证号填写有误！'});return false;
            };
            $.AJAX({
                type:'post',
                url:config.basePath + 'user/svuseraddress/updateAddrCardId',
                data:{
                    id:vm.defaultAddress.id,
                    cardId:vm.idCardNum,
                },
                success:function(data){
                    Popup.miss({title:'操作成功！'});
                    vm.isSaveIdNumber=true;
                    $('div.showIdCard').css({display:'block'});
                    $('div.updateIdCard').css({display:'none'});
                },
            });
        },

        //切换填写身份证
        checkUpdateIdcard:function(){
            $('div.showIdCard').css({display:'none'});
            $('div.updateIdCard').css({display:'block'});
            vm.isSaveIdNumber=false;
        },

        //立即支付
        toPay: function(){
            var that = this;
            if(that.addrEmpty == true){
                Popup.alert({'type':'msg','title':'收货地址不能为空'});return false;
            };
            if(that.isEntrance){
                if(!regCombination('id').test(vm.idCardNum)){
                    Popup.alert({title:'身份证号填写有误哦！'});return false;
                }; 
                if(!vm.isSaveIdNumber){
                    Popup.alert({title:'请保存身份证号码哦！'});return false;
                }; 
                that.payAjax();
            }else{
                that.payAjax();
            }
        },
        //去支付
        payAjax: function(){
            var that = this;
            var orderType=2; //(1 :IOS 手机订单 2:微信订单 3:ANDROID 手机订单)
            if(isIosWebviewApp&&isIos||isIosWebviewApp&&isIpad){
                orderType=1;
            }else if(isIosWebviewApp&&isAndroid){
                orderType=3;
            };
            win.showLoading();                    
            var param = {};
            param.addressId = that.defaultAddress.id;
            param.address = $('.addr-text').text();
            param.receiver = $('.addr-user-name').text();
            param.phone = $('.addr-user-tel').text();
            param.idCard = that.idCardNum;
            param.orderType = orderType;
            param.receiptInfo = '';
            param.needPay = parseFloat($('.too-price i').text());
            param.totalFree = 0;
            param.transFee = 0;
            param.goodsList = that.uuid.split(',');
            console.log(JSON.stringify(param));
            $.AJAX({
                type: "POST",
                url: config.basePath + 'order/svorder/addorder?param=' + JSON.stringify(param),
                success: function(o){
                    var payOrderNo = o.data.payOrderNo;
                    location.href = "../order/orderPayment.html?payOrderNo=" + payOrderNo;
                },
                error: function(o){
                    Popup.alert({type:'msg',title:o.desc});
                }
            });
        }
    }
});