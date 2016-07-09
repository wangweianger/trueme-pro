

/*------------------------------------微信jsdk相关------------------------------*/
/*微信分享
debug       是否是调试默还是
title       微信分享标题  (必填) 
desc        微信分享描述  (可填) 
link        微信分享URL  (必填)
mainUrl     微信分享图标 (可填)
success     分享成功后执行   (可填)
cancel       取消分享后执行   (可填)
shareNow    app内是否立即分享 
*/
function WeiXinShare(data) {
	//调起微信分享
    var setting={
		debug:false,
		title :'',
		desc :'',       
		link :'', 
		notshareNow:'',      
		mainUrl:window.location.origin + __uri('/assets/common/images/logo.png'),   
		success:function(){},     
		cancel:function(){},    
	};
	var datas=extend(setting,data);
	//判断app或者web
	tuneUpWebOrApp({
        isAppShare: true,
        notshareNow:datas.notshareNow,
        data:{
        	title:datas.title,
            desc:datas.desc,
            link:datas.link,
            mainUrl:datas.mainUrl,
        },
        runWebH5: function() {
			//请求微信分享需要的相关参数
			$.AJAX({
		        type:'post',
		        nohideloading:true,
		        url:config.basePath+'maker/svMaker/makerShare',
		        data:{
		            contentUrl:encodeURIComponent(window.location.href.split('#')[0]),                
		        },
		        success:function(data){
		          //调用微信相关操作
		          datas=extend(datas,data.data);
		          WeiXinInFo(datas); 
		        },
		    });
        },
    });
	
};

//掉起微信分享
function WeiXinInFo(data){
	var shareMainUrl=httpsReplaceHttp(data.mainUrl);
	var testImg = new Image();
  	testImg.src = shareMainUrl;
  	testImg.onload = function(){
	    wx.config({
	        debug: data.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	        appId: data.appId, // 必填，公众号的唯一标识
	        timestamp: data.timestamp, // 必填，生成签名的时间戳
	        nonceStr: data.nonceStr, // 必填，生成签名的随机串
	        signature: data.signature,// 必填，签名，见附录1
	        jsApiList: [
	            'onMenuShareTimeline',
	            'onMenuShareAppMessage',
	            'onMenuShareQQ',
	            'onMenuShareWeibo',
	            'onMenuShareQZone',
	        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	    });
	    //wx.ready
	    wx.ready(function () {
	       // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
	       //分享给朋友
	       wx.onMenuShareAppMessage({
	           title: data.title, // 分享标题
	           desc: data.desc, // 分享描述
	           link: data.link,
	           imgUrl: shareMainUrl, // 分享图标
	           success: function () { 
	              // 用户确认分享后执行的回调函数
	              data.success()
	           },
	           cancel: function () { 
	               // 用户取消分享后执行的回调函数
	               data.cancel()
	           }
	      });

	      //分享给朋友圈
	      wx.onMenuShareTimeline({
	          title: data.title, // 分享标题
	          link: data.link, // 分享链接
	          imgUrl: shareMainUrl, // 分享图标
	          success: function () {
	              // 用户确认分享后执行的回调函数
	              data.success()
	          },
	          cancel: function () {
	              // 用户取消分享后执行的回调函数
	              data.cancel()
	          }
	      });

	      //分享到QQ
	      wx.onMenuShareQQ({
	        title:  data.title, // 分享标题
	        desc: data.desc, // 分享描述
	        link: data.link, // 分享链接
	        imgUrl: shareMainUrl, // 分享图标
	        success: function () { 
	           // 用户确认分享后执行的回调函数
	           data.success()
	        },
	        cancel: function () { 
	           // 用户取消分享后执行的回调函数
	           data.cancel()
	        }
	      });

	      //分享到腾讯微博
	      wx.onMenuShareWeibo({
	        title: data.title, // 分享标题
	        desc: data.desc, // 分享描述
	        link: data.link, // 分享链接
	        imgUrl: shareMainUrl, // 分享图标
	        success: function () { 
	           // 用户确认分享后执行的回调函数
	           data.success()
	        },
	        cancel: function () { 
	            // 用户取消分享后执行的回调函数
	            data.cancel()
	        }
	      });
	      
	      //分享到QQ空间
	      wx.onMenuShareQZone({
	        title: data.title, // 分享标题
	        desc: data.desc, // 分享描述
	        link: data.link, // 分享链接
	        imgUrl: shareMainUrl, // 分享图标
	        success: function () { 
	           // 用户确认分享后执行的回调函数
	           data.success()
	        },
	        cancel: function () { 
	            // 用户取消分享后执行的回调函数
	            data.cancel()
	        }
	      });
	    });
	};
};

