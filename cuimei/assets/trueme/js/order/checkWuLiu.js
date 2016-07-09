/*** Created by HZH on 2016/5/19.*/
var stateOrder=0;  
//用户userId

//物流过滤器
Vue.filter('wuLiuFilter', function (value,index) {
  var className="";
  if(value==3&&index==0){
    className="yes";
  }else if(value==2&&index==0){
    className="no";
  }
  return className;
});

//物流状态
Vue.filter('wuLiuStatus', function (value,index) {
  var text="";
  switch(value){
    case 1:
      text="未发货";
      break;
    case 2:
      text="配送中";
      break;
    case 3:
      text="已签收";
      break;    
  }
  return text;
});

//vue begin
var vm = new Vue({
    el: '#container',
    data: {
       orderWuLiu:{},  //物流信息
       orderStatus:getQueryString('orderStatus'),
    },
    ready: function () {
      var This=this;
      //获取物流信息
      $.AJAX({
        type:'post',
        url:config.basePath+'order/svqueryorder/ordertrans',
        data:{
          "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
          "time": time(),
          "orderId": getQueryString('orderId')||'22132',
        },
        success:function(data){
          console.log(JSON.stringify(data.data))
          This.orderWuLiu=data.data;
        },
      });
      
    },
    methods: {}
});
