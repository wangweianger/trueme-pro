
//当前的订单状态tab
var wenanstatestab=getQueryString('wenanstates',true)+''?getQueryString('wenanstates',true):1;

//改变tab样式
$("#wenanTanNav li").eq(wenanstatestab).addClass("active").siblings().removeClass("active");

//vue begin
var vm = new Vue({
    el: '#container',
    data: {
      datas:'', //返回专题列表数据
      startNum:'', 
    },
    ready: function () {
        var This=this;
        //请求收藏文案  
        $.AJAX({
          type:'post', 
          url:config.basePath+"content/svMakerContent/getUserCollectList",
          data:{
              startNum:0,
          },
          success:function(data){
              This.datas=data.data;
              This.startNum=data.data.startNum;
              //滚动拉去更多数据
              This.scollGetMoreData();
              setTimeout(function(){
                $('#container').removeClass('hide');
              },config.containerShowTime);
          }
       });
    },
    methods: {
     //滚动获得更多数据
     scollGetMoreData:function(){
      var This=this;
      //滚动时执行
      trueme.w.scrollGetData({  
          lastObj:$('#bottomscolltop'),
          bottomTop:700,
          callback:function(){
            $.AJAX({
                type:'post',
                url:config.basePath+"content/svMakerContent/getUserCollectList",
                data:{
                  "startNum":This.startNum,
                },
                success:function(data){
                  //判断是否还需要滚动获取数据 向数组里push数据
                    if(data.data.contentList.length>0){
                      This.datas.contentList = This.datas.contentList.concat(data.data.contentList);
                      config.scrollbegin=true; //可以再次滚动
                    }
                    This.startNum=data.data.startNum;
                },
           });  
          },
      });
     }, //end
     
    },
});
