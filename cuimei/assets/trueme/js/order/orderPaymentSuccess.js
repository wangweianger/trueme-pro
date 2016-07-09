/*login.js*/
win.hideLoading();
window.onload=function(){
    if(!isIosWebviewApp){
        setTimeout(function(){
        Popup.loading({"title":"加载中..."}); 
        },0) 
    }  
};
var vm = new Vue({
    el: '#orderSuccess',
    mixins: [mixin],
    data: {
        done: false,
        hotSaleList:[], //hut推荐
        totalFee: ''
    },
    ready: function () {
        var that=this;
        //请求后台接口获取下单时间
        getResult(); //进入界面掉一次
        var time = 0;
        var doingAjax = false;
        var timer = setInterval(function(){
            time += 1;
            if(time >= 5){
                clearInterval(timer);
                window.location.href="myOrder.html"; //5次超时跳转到我的订单
                return false;
            }
            if(!doingAjax){
                getResult();
            }
        },2000);
        function getResult(){
            doingAjax = true;
            var url='';
            //app查询接口
            if(isIosWebviewApp){
                url='order/svorderapppay/querypayresult';
            }else{
                url='order/svpay/queryorderpay'; //微信查询接口
            }
            $.AJAX({
                type:'POST', 
                url:config.basePath+url,
                code : true,
                data:{
                    "payOrderNo": getQueryString('payOrderNo'),
                },
                success:function(o){
                    if(o.data.totalFee){
                        clearInterval(timer);
                        that.done = true;
                        that.totalFee = o.data.totalFee/100;
                        Popup.closeLoading(); 
                        //如果是创客商品直接跳转到创客首页
                        if(o.data.haveMakerGoods){
                            setTimeout(function(){
                                window.location.href="/maker/index/index.html";
                            },1000);
                        }; 
                    }
                },
                error: function(o){
                    if(time >= 4){
                        Popup.closeLoading();
                        Popup.alert({type:'msg',title:'请求超时，请刷新重试!'});
                    }
                },
                complete: function(){
                    doingAjax = false;
                }
            });
        };
    },
    methods: {
        //完成后跳转
        toNewUrl:function(){
            sessionStorage.setItem('haveMakerGoods','');
            window.location.href="myOrder.html";
        }
    }
});
vm.conflicting({callback:function(data){
    vm.hotSaleList=data;
}});






