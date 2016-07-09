/*login.js*/
win.hideLoading();

var vm = new Vue({
    el: '#container',
    data: {
        winHeight: $(window).height(),
        phoneNo:'',  //手机号码
        codeNo:'', //短信验证码
        getMsgText:'发送验证码',
        disabled:false, //初始可点击状态
        isIosWebviewApp:isIosWebviewApp, //app环境下
    },
    ready: function () {
        var that = this;
        $('input').on('focus', function(){
            $('.bttom').hide();
        });
        $(window).on('resize', function(){
            if($(window).height() + 20 >= that.winHeight){
                $('.bttom').show();
            }else{
                $('.bttom').hide();
            }
        });
    },
    methods: {
        showHeight: function(){
            alert(1);
            alert($(window).height());
        },
        //获得手机验证码
        getValiCode:function(){
            This=this;
            if(!regCombination('m').test(This.phoneNo)){
                Popup.alert({type:'msg',title:'请输入正确的手机号！'});return false;
            }
            This.disabled=true; //发送短信时按钮不可点击
            //获取短信码
            $.AJAX({
                type:'post',
                url:config.basePath+'user/svSendPhoneCode',
                code:true,
                data:{
                    phone:This.phoneNo,
                },
                success:function(data){
                    //短信定时器开始 
                    trueme.w.getMsgTime(This,function(){
                        This.disabled=false; //完成后按钮可点击 
                    });
                    Popup.miss({title:'短信验证码发送成功!'});
                    //This.codeNo=data.code;
                    This.disabled=false; //完成后按钮可点击 
                },
                error:function(data){
                    This.getMsgText="发送验证码";
                    Popup.alert({type:'msg',title:data.desc});
                    This.disabled=false;
                },
            });
        },
        //绑定手机
        sublitPhoneBinding:function(){
            This=this;
            if(!regCombination('m').test(This.phoneNo)){
                Popup.alert({type:'msg',title:'请输入正确的手机号！'});return false;
            }
            if(!regCombination('*').test(This.codeNo)){
                Popup.alert({type:'msg',title:'请输入短信验证码！'});return false;
            }
            //绑定手机
            $.AJAX({
                type:'post',
                code: true,
                url:config.basePath+'user/svBindPhone',
                data:{
                    uid:'1',
                    phone:This.phoneNo,
                    code:This.codeNo,
                },
                success:function(data){
                    window.location.href=config.prevUrl;
                },
                error: function(){
                    $('input[name="userTestCode"]').val('');
                    Popup.alert({'type':'msg', 'title':'验证失败！请重试'});
                }
            });
        },
        //返回首页
        goback:function(){
            window.location.href=config.prevUrl;
        },
    }
});






