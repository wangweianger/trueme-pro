
//显示分享图标
$('#shareChuangKe').click(function(){
  if(!isIosWebviewApp){$('#weixinShare').addClass('show').removeClass('hide')};
  if(isIosWebviewApp){vm.winXinShare(false)};
});
//点击遮罩隐藏
$('#weixinShare').click(function(){
  if(!isIosWebviewApp){$(this).addClass('hide').removeClass('show')};
});

/*创客邀请*/
var vm = new Vue({
    el: '#container',
    data: {
        nickName: '',
        masterCode: '', //masterCode码
        datas:{}, //微信相关
        shareUrl:'',
        isIosWebviewApp:isIosWebviewApp,
    },
    ready: function(){
        var This = this;

        //获得masterCode码
        $.AJAX({
            type:'get',
            url: config.basePath+"maker/svMaker/getMasterCode",
            success: function(data){
               This.masterCode=data.data.masterCode;
               This.shareUrl=window.location.origin+'/maker/invite/inviteH5.html?masterCode='+data.data.masterCode;
               setTimeout(function(){
                    $('#container').removeClass('hide');
                    //生成二维码
                    $('#output').qrcode({
                        text:   This.shareUrl,
                        render       : "canvas",//设置渲染方式  
                        width        : 200,     //设置宽度  
                        height       : 200,     //设置高度    
                        background   : "#fff",//背景颜色  
                        foreground   : "#000" //前景颜色  
                    });

                    setTimeout(function(){
                         dropDownLoadImg($('canvas')[0], 'share_lili_xc_campus');
                    },100);
               },100)
                
                /*将canvas 转换为base64 的图片*/
                function dropDownLoadImg(canvasElem, filename, imageType) {
                    var imageData, defalutImageType;
                    defalutImageType = 'png';//定义默认图片类型
                    imageData = canvasElem.toDataURL(imageType || defalutImageType);//将canvas元素转化为image data
                    $('#canvas-img').attr('src',imageData);
                };
                $.AJAX({
                    type: "POST",
                    url: config.basePath + 'user/svuser/personalinfo',
                    success: function(o){
                        This.nickName = o.data.personalinfo.nickName;
                        This.winXinShare(true);
                    }
                });
            },
        });

        
    },
    methods: {
        //微信分享
        winXinShare:function(notshareNow){
          //------调用微信分享相关功能-----
          WeiXinShare({
            notshareNow:notshareNow,
            title :vm.nickName + '邀请您成为萃美创客',
            desc :'点击注册、马上开始您的萃美创业之旅！申请成为创客、即送精美大礼包及现金红包！',       
            link : vm.shareUrl,       
            mainUrl: window.location.origin + __uri('/assets/common/images/logo.png'),   
            success:function(){
                $('#weixinShare').addClass('hide').removeClass('show');
            },     
            cancel:function(){
                $('#weixinShare').addClass('hide').removeClass('show');
            },
          });
        },
    }
});

    