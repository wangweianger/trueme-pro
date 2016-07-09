
/*创客team.js*/
//REF是拉人；SYS时系统推荐
Vue.filter('refType', function (value,refType) {
    var text="";
    if(refType=="SYS"){
      text="系统推荐";
    }else if(refType=="REF"){
        if(value==1){
          text="直推"
        }else{
          text="间推"
        }
    }
    return text
});

/*创客index.js*/
Vue.filter('makerDeji', function (value,num) {
    var text="";
    switch(value){
        case 1:
            text='一星';
            break;
        case 2:
            text='二星';
            break;
        case 3:
            text='三星';
            break;
        case 4:
            text='四星';
            break; 
        case 5:
            text='大咖';
            break;                 
    }
    return text;
});

//层级
Vue.filter('levelFilter', function (value) {
    var text="";
    switch(value){
        case 1:
            text='一级';
            break;
        case 2:
            text='二级';
            break; 
        case 3:
            text='三级';
            break;
        case 4:
            text='五级';
            break;                    
    }
    return text;
});

var vm = new Vue({
    el: '#container',
    data: {
        page:1, //分页起始页
        datas:[], //团队成员列表
        loadingStatus:1, //加载更多数据默认
    },
    ready: function(){
        var This = this;
        //获取团队成员列表
        $.AJAX({
            url: config.basePath+"maker/svMaker/getTeamMember",
            data:{
                level:0,   //int 当值为1时，查询其下一级的用户列表；当值为0时，查询其所有下级的用户列表
                page:1,   //int 页数，从1开始，默认1
                pageSize:15,   //int 每页个数，默认10个
            },
            success: function(data){
               This.datas=data.data;
               This.page=data.data.page;
               //拉去获得更多数据
               This.scollGetMoreData();
               setTimeout(function(){
                $('.team-users').removeClass('hide');
               },config.containerShowTime);
            },
        });
    },
    methods: {
        //滚动获得更多数据
       scollGetMoreData:function(){
        var This=this;
        trueme.w.scrollGetData({
            lastObj:$('#bottomscolltop'),
            callback:function(){ 
              This.loadingStatus=2;  
              $.AJAX({
                  url:config.basePath+"maker/svMaker/getTeamMember",
                  data:{
                    level:0,   //int 当值为1时，查询其下一级的用户列表；当值为0时，查询其所有下级的用户列表
                    page:This.page,   //int 页数，从1开始，默认1
                    pageSize:15,   //int 每页个数，默认10个
                  },
                  success:function(data){
                    //向数组里push数据
                    if(data.data.teamMember.length>0){
                        This.loadingStatus=1;
                        config.scrollbegin=true; //可以再次滚动
                        This.datas.teamMember = This.datas.teamMember.concat(data.data.teamMember);
                    }else{
                       This.loadingStatus=3; 
                    }
                    This.page=data.data.page;
                  }
             });  
            }
        });
       }, //end 
    }
});

    