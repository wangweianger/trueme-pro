
/*创客邀请*/
var vm = new Vue({
    el: '#inviteReferrer',
    data: {
        index:0,
        sugList: [], //当前客户推荐masterId列表
        datas:[],
        masterCode:'',
    },
    ready: function(){
        var This = this;

        //获得为当前客户推荐masterId列表
        $.AJAX({
            type:'post',
            url: config.basePath+"maker/svMaker/suggestList",
            success: function(data){
               This.sugList=data.data.sugList;
               This.datas=This.sugList.slice(0, 3);
               This.masterCode=This.datas[0].masterCode;
                setTimeout(function(){
                    $('#inviteReferrer').removeClass('hide'); 
                }, config.containerShowTime);
            }
        });
    },
    methods: {
        //点击换一批
        anotherMasters:function(){
            vm.index++;
            if(vm.index>=3){
              vm.index=0;  
            };
            vm.datas=vm.sugList.slice(vm.index*3, vm.index*3+3);
            vm.masterCode=vm.datas[0].masterCode;
        },

        //选择推荐人选项
        checkMaster:function($event,masterCode){
            if($event.target.nodeName=='LI'){
                $($event.target).addClass('active').siblings().removeClass('active');
            }else{
               $($event.target).parents('li').addClass('active').siblings().removeClass('active'); 
            }
            vm.masterCode=masterCode;
        },

        //确定提交推荐人
        lockMaster:function(){
            $.AJAX({
                type:'post',
                url: config.basePath+"maker/svMaker/lockMaster",
                data:{
                    masterCode:vm.masterCode,
                },
                success: function(data){
                   window.location.href="/maker/index/index.html";
                },
            });
        },

    }
});

    