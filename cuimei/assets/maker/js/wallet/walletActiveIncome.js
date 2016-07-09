/*活动收入*/
$(document).ready(function(){
    var vm = new Vue({
        el: '#container',
        data: {
            totayPage:0,   //今日StartNum
            scrollbegintop:true, //top是否滚动
            todayDatas:[], //todayDatas
            loadingStatus:1, //加载更多数据默认
        },
        ready: function(){
            var This = this;

            //查看今日团队收入
            $.AJAX({
                type:'post',
                url: config.basePath+"maker/svMaker/getActivityIncomeList",
                data:{
                    page:1,    //是   int 第几页，从1开始
                    pageSize:5,    //否   int 每页个数，默认5个
                },
                success: function(data){
                    This.todayDatas=data.data.list;
                    This.totayPage=data.data.page;
                    //滚动拉去更多数据
                    This.scollGetMoreData();
                    setTimeout(function(){
                        $('#record1').removeClass('hide'); 
                    }, config.containerShowTime);
                },
            });
        },
        methods: {
            //滚动获得今日更多团队收入
            scollGetMoreData:function(){
              var This=this;
              //滚动时执行
              trueme.w.scrollGetData({  
                  lastObj:$('#bottomscolltop'),
                  callback:function(){
                    This.loadingStatus=2;
                    //执行ajax 获得申请提现页面所需数据
                    $.AJAX({
                        url: config.basePath+"maker/svMaker/getActivityIncomeList",
                        data:{
                            page:This.totayPage,    //是   int 第几页，从1开始
                            pageSize:5,            //否   int 每页个数，默认5个
                        },
                        success: function(data){
                            //向数组里push数据
                            if(data.data.list.length>0){
                                This.loadingStatus=1;
                                This.todayDatas = This.todayDatas.concat(data.data.list);
                                config.scrollbegin=true; //可以再次滚动
                            }else{
                               This.loadingStatus=3; 
                            }
                            This.totayPage=data.data.page;
                        },
                    }); 
                  },
              });
            }, //end 
        }
    });

});



