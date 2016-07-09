/*login.js*/

 $(function () {
    $("#password").on("focus",function () {
        $(this).next("span").addClass("focus");
    });
    $("#password").blur(function () {
        $(this).next("span").removeClass("focus");
    });
});
var vm = new Vue({
    el: '#container',
    data: {
       datas:'',  //订单详情数据
       oderId:getQueryString('orderId'),
    },
    ready: function () {
      var This=this;
      //获取订单详情
      $.AJAX({
        type:'post',
        url:config.basePath+'order/svqueryorder/orderdetail',
        data:{
          "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
          "orderId": This.oderId,
        },
        success:function(data){
          This.datas=data.data;
          This.$nextTick(function(){
            $('#container').show();
            if($('.toobar .btn').length ==0){
              $('.toobar').remove();
            }
          });
        },
      }); 
      
    },
    methods: {
      showSeller: function(){
        Popup.alert({
            type: 'msg',
            header:'弹出页面',
            haveHeader: false,
            style: 'width:80%',
            maskHide:true,
            closeBut:false,
            title:'<div class="pop-header g-border-b">萃美客服电话</div>\
              <div class="pop-tel"><span class="contact-tel"></span>0755-2691-0969</div>\
              <div class="pop-btn"></div>'
        });
      }, 
    //取消订单
      cancelOrder:function(orderNo){
        Popup.confirm({type:'msg', haveHeader : false, title:'确认取消订单吗？',yes:function(){
              trueme.w.cancelOrder({
                orderId:orderNo,  
                success:function(data){
                    location.href = 'myOrder.html';
                }
              });
          },
        });
      },

      //删除订单
      deteleOrder:function(orderNo){
        var This = this;
        Popup.confirm({type:'msg', haveHeader : false, title:'确认删除订单吗？',yes:function(){
              trueme.w.deteleOrder({
                orderId:orderNo,  
                success:function(data){
                    location.href = 'myOrder.html';
                }
              });
          },
        });
      },

      //确定收货
      confirmReceipt:function(orderId){
        Popup.confirm({type:'msg', haveHeader : false, title:'确定已收货？',yes:function(){
                $.AJAX({
                  type:'post',
                  url:config.basePath+'order/svorder/sureorder',
                  data:{ orderId:orderId },
                  success:function(data){
                    window.location.href="myOrder.html"; //跳转到全部订单
                  }
                });
            }
        });  
      },


    },
});



