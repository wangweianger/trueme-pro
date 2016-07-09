$(function () {
    $("#grade").click(function () {
        $(".grade-box").show();
    });
    $(".grade-box .grade-bg").click(function () {
        $(".grade-box").hide();
    })
    //界面百分比
    $('#index-main').css({height:$(window).height()-$('ul.fixed-bar').height()-1+'px'});
});

/*创客index.js*/
Vue.filter('makerDeji', function (value,num) {
    var text="";
    switch(value){
        case 1:
            text='一星创客';
            break;
        case 2:
            text='二星创客';
            break;
        case 3:
            text='三星创客';
            break;
        case 4:
            text='四星创客';
            break; 
        case 5:
            text='大咖';
            break;                 
    }
    return text;
});

var vm = new Vue({
    el: '#container',
    data: {
        datas: {}, //首页数据
    },
    ready: function(){
        var This = this;
        $.AJAX({
            type:'post',
            url: config.basePath+"maker/svMaker/getMakerHomeInfo",
            success: function(data){
               This.datas=data.data;
               //是否第一次到创客首页，用于首页第一次欢迎弹框
               if(data.data.isFirstLogin){
                    Popup.alert({type:'msg',
                        title:'<div class="maker"><h2>欢迎您加入萃美创客</h2><p><span>您的直属导师是：</span><small class="text-main">'+data.data.masterName+'</small></p></div>'
                    });
               };
               setTimeout(function(){
                    $('#container').removeClass('hide');
               },config.containerShowTime);
            },
        });
    },
    methods: {
        //判断用户是否绑定手机
        isBindingPhone:function(){
            //获取用户信息 判断是否绑定手机
            trueme.w.getUserInfor({
                success:function(data){
                    if(!parseInt(data.data.isBindPhone)){
                        //没有绑定手机 跳转到绑定手机页面
                        window.location.href=window.location.origin+'/trueme/bindPhone/phoneBinding.html';
                    }
                }
            });//end
        }, 
    }
});

    