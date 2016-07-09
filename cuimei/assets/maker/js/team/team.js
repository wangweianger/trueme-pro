
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
            text='四级';
            break;                    
    }
    return text;
});

var vm = new Vue({
    el: '#container',
    data: {
        datas: {}, //我的团队数据
        teamList:[], //团队成员列表
    },
    ready: function(){
        var This = this;
        //获取团队数据详情
        $.AJAX({
            url: config.basePath+"maker/svMaker/getTeamHomeInfo",
            success: function(data){
               This.datas=data.data;
               setTimeout(function(){
                $('#teamDatas').removeClass('hide');
               },config.containerShowTime);
            },
        });

        //获取团队成员列表
        $.AJAX({
            url: config.basePath+"maker/svMaker/getTeamMember",
            data:{
                level:0,   //int 当值为1时，查询其下一级的用户列表；当值为0时，查询其所有下级的用户列表
                page:1,   //int 页数，从1开始，默认1
                pageSize:4,   //int 每页个数，默认10个
            },
            success: function(data){
               This.teamList=data.data;
               setTimeout(function(){
                $('.team-users').removeClass('hide');
               },config.containerShowTime);
            },
        });


    },
    methods: {
        
    }
});

    