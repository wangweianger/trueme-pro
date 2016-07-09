
/*创客index.js*/

var vm = new Vue({
    el: '#container',
    data: {
        datas: {}, //我的钱包数据
    },
    ready: function(){
        var This = this;
        $.AJAX({
            type:'post',
            url: config.basePath+"maker/svMaker/getWalletInfo",
            success: function(data){
               This.datas=data.data;
               setTimeout(function(){
                    $('#container').removeClass('hide'); 
                }, config.containerShowTime);
            },
        });
    },
    methods: {
        
    }
});

    