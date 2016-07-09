
/*体现*/
$(document).ready(function(){
    var vm = new Vue({
        el: '#container',
        data: {
            withCashNeedDadas: {}, //获得申请提现页面所需数据
            money:'', //体现金额
            isDisabled:true, //是否不可点击
        },
        ready: function(){
            var This = this;
            $('#focus').keyup(function(){
                if(regCombination('*').test(This.money)){
                    This.isDisabled=false;
                }else{
                    This.isDisabled=true;
                };
                if(This.money>20000){
                    This.money=20000;
                };
            });
            //获得申请提现页面所需数据
            This.getdatas();
        },
        methods: {
            //获得申请提现页面所需数据
            getdatas:function(){
                $.AJAX({
                    url: config.basePath+"maker/svWithdraw/getMakerHomeInfo",
                    success: function(data){
                        vm.withCashNeedDadas=data.data;
                        setTimeout(function(){
                            $('#container').removeClass('hide'); 
                        }, config.containerShowTime);
                        $("#focus").focus();
                    },
                });
            },
            //立即体现
            submitWithDrawCash:function(){
                if(!regCombination('money').test(vm.money)&&!regCombination('*').test(vm.money)){
                    Popup.alert({type:'msg',title:'请输入正确的提现金额!'});return false;
                };
                if(vm.money<100){
                    Popup.alert({type:'msg',title:'提现最低金额为100元!'});return false;
                };
                if(vm.money>vm.withCashNeedDadas.usableMoney){
                    Popup.alert({type:'msg',title:'可提现余额不足!'});return false;
                };
                $.AJAX({
                    type:'post',
                    url: config.basePath+"maker/svWithdraw/beWithdraw",
                    code:true,
                    data:{
                        withdrawMoney:vm.money,
                    },
                    success: function(data){
                       //清空体现金额
                       Popup.alert({type:'msg',title:'申请提现成功!',yes:function(){
                        window.location.href="wallet.html";
                       }});
                    },
                    error:function(data){
                        if(data.code=6005){
                             Popup.alert({type:'msg',title:data.desc,yes:function(){
                                window.location.href="wallet.html";
                            }});
                        }else{
                            Popup.alert({type:'msg',title:data.desc});return false;
                        };
                    }
                });
            },
        }
    });

});



    