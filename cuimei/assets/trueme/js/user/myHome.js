/*login.js*/


var vm = new Vue({
    el: '#container',
    data: {
        isLogin: false,
        userInfo: {}
    },
    ready: function () {
        $('.jumpCheck').on('click', function(){
            location.href = $(this).data('link');
        });
        var that = this;
        $.AJAX({
            type: "POST",
            url: config.basePath + 'user/svIsLogined',
            code: true,
            pageSet: true,
            success: function(o){
                that.isLogin = true;
                $('.user-box').removeClass('logout');
                $.AJAX({
                    type: "POST",
                    url: config.basePath + 'user/svuser/getusercenterinfo',
                    success: function(o){
                        that.userInfo = o.data.userCenterInfo;
                        $('#container').show();
                    }
                });
            },
            error: function(){
                that.isLogin = false;
                $('#container').show();
            }
        })
    },
    methods: {
        login: function(){
            //需要判断是否是iosApp登录
            tuneUpWebOrApp({
                isLogin:true,
                runWebH5:function(){
                    trueme.w.getWeiXinCode();
                },
            });
        },
        
        showService: function(){
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
        }

    }
});

