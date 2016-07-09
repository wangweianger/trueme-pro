/*-------------------------------------------后台配置------------------------------------------------*/ 
window.config={
	//登陆页面 
	loginUrl:"/trueme/user/login.html", 

	//登陆成功后需要跳转到的页面                                                       
	homeUrl: "/index.html",    

	//API接口						
	basePath:window.location.origin+'/',

	//container div显示的时间                                            
	containerShowTime:10,  

	//ajax 超时配置                                              
	ajaxtimeout:12000,  

	//发送短信的时间间隔
	msgTime:60,

    //商户公众号id
    appId:'wx3c8059fedebed664',

    //前端动画的时间
    alimTime:200,

    //滚动加载更多数据底部距离
    bottomTop:40,
    //初始时候可加载更多数据
    scrollbegin:true,

    //微信信任回调页面    
    redirect_uri:window.location.origin+'/trueme/wx-code/wx-code.html',     

    //登录或者绑定手机等成功后 跳转到上一页面或者首页
    prevUrl:getNextUrl(),     

    //创客商品的价格
    spuIdprice:398,   

    //默认情况下图片会出现在屏幕时加载,设置 threshold为100 令图片在距离屏幕100像素时提前加载.
    threshold:100,                             
                                                
};
