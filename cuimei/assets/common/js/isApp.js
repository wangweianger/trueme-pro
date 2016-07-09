
//----------------------web调用app相关方法------------------------------
//封装h5调用app方法
function tuneUpWebOrApp(json){
	//判断是app打开还是h5 web打开
	if(isIosWebviewApp&&!IsWeiXin&&!json.notshareNow){
	//app打开执行	
		//建立一个app对象
		var instance = getDeviceAPI(json.data);
		if(json.isLogin){
			//调起app登录
			instance.iosAppLogin();
		}else if(json.isWxpay){
			//调起app 微信支付
			instance.iosAppWxPay();
		}else if(json.isAppShare){
			//调起app 分享
			instance.iosAppShare();
		}
    }else{
    //web打开执行	
    	json.runWebH5();
    }
}

//封装h5调用app方法
function getDeviceAPI(data){
	function DeviceAPI(){
		this.api =getIosApi(data);
	};
	//ios app登录
	DeviceAPI.prototype.iosAppLogin = function() {
		this.api.iosAppLogin();
	}
	//ios app微信支付
	DeviceAPI.prototype.iosAppWxPay = function() {
		this.api.iosAppWxPay();
	}
	//app分享
	DeviceAPI.prototype.iosAppShare = function() {
		return this.api.iosAppShare();
	}
	return new DeviceAPI();
}

//iosapi
function getIosApi(data){
	function IosAPI(){
		if(typeof(IOSApp) == "undefined"){
			this.app = null;
		}else{
			this.app = IOSApp;
		}
	}
	//ios app登录
	IosAPI.prototype.iosAppLogin = function() {
		return this.app.iosAppLogin();
	}
	//ios app微信支付
	IosAPI.prototype.iosAppWxPay = function() {
		return this.app.iosAppWxPay(data);
	}
	//app分享
	IosAPI.prototype.iosAppShare = function() {
		return this.app.iosAppShare(data);
	}	
	var ios = new IosAPI();
	return ios;
};
