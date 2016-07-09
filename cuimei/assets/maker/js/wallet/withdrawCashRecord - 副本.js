/*体现*/
//limitTo过滤器
Vue.filter('stateFilter', function (value) {
    var text="";
    switch (value){
        case 'UNCHECK':
            text='未审核';
            break;
        case 'WAITPAY':
            text='已审核未支付';
            break;
        case 'PAYOVER':
            text='已支付';
            break;
        case 'INVALID':
            text='已作废';
            break;            
    }
    return text;
});

//
$(document).ready(function(){
    var vm = new Vue({
        el: '#container',
        data: {
            totayStartNum:0,   //今日StartNum
            historyStartNum:0,  //历史StartNum
            scrollbegintop:true, //top是否滚动
            scrollbeginbottom:true, //bottom是否滚动
            todayDatas:[], //todayDatas
            historyDatas:[], //historyDatas
        },
        ready: function(){
            var This = this;

            //查看今日提现记录
            $.AJAX({
                type:'post',
                url: config.basePath+"maker/svWithdraw/withdrawTodayRecord",
                data:{
                    startNum:0,
                },
                success: function(data){
                   This.todayDatas=data.data.recordList;
                   This.totayStartNum=data.data.startNum
                    setTimeout(function(){
                        $('#record1').removeClass('hide'); 
                    }, config.containerShowTime);
                },
            });

            //滚动获得更多今日记录
            $("#record1").scroll(function() {
                if($('#recordtop').offset().top-$('#scrollTop').offset().top<50){
                    if(This.scrollbegintop){
                        win.showLoading();
                        //执行ajax 获得申请提现页面所需数据
                        $.AJAX({
                            url: config.basePath+"maker/svWithdraw/withdrawTodayRecord",
                            data:{
                                startNum:This.totayStartNum,
                            },
                            success: function(data){
                                //向数组里push数据
                                if(data.data.recordList.length>0){
                                  This.todayDatas.recordList = This.todayDatas.recordList.concat(data.data.recordList);
                                }
                                This.totayStartNum=data.data.startNum;
                                //判断是否还需要滚动获取数据
                                if(data.data.recordList.length>0){
                                    config.scrollbegin=true; //可以再次滚动
                                };
                            },
                        });
                        This.scrollbegintop=false;
                    }
                };
            });

    
            //查看历史提现记录
            $.AJAX({
                type:'post',
                url: config.basePath+"maker/svWithdraw/withdrawOtherTimeRecord",
                data:{
                    startNum:0,
                },
                success: function(data){
                   This.historyDatas=data.data.recordList;
                   This.historyStartNum=data.data.startNum;
                   setTimeout(function(){
                        $('#record2').removeClass('hide'); 
                    }, config.containerShowTime);
                },
            });
            //滚动获得更多历史记录
            $("#record2").scroll(function() {
                if($('#recordbottom').offset().top-$('#scrollbottom').offset().top<50){
                    if(This.scrollbeginbottom){
                        win.showLoading();
                        //执行ajax 获得申请提现页面所需数据
                        $.AJAX({
                            type:'post',
                            url: config.basePath+"maker/svWithdraw/withdrawOtherTimeRecord",
                            data:{
                                startNum:This.historyStartNum,
                            },
                            success: function(data){
                               //向数组里push数据
                                if(data.data.recordList.length>0){
                                  This.historyDatas.recordList = This.historyDatas.recordList.concat(data.data.recordList);
                                }
                                This.historyStartNum=data.data.startNum;
                                //判断是否还需要滚动获取数据
                                if(data.data.recordList.length>0){
                                    config.scrollbegin=true; //可以再次滚动
                                }
                            },
                        });
                        This.scrollbeginbottom=false;
                    }
                };
            });


        },
        methods: {
            
        }
    });

});



    