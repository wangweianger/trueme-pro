
__inline('config.js')   //引入 config.js 前端配置项

/*------------------------ start jquery 相关  ------------------------*/
if(window.$){
/*
	$.AJAX 参数说明
	{
		type:'',  类型默认get (可填)
		url:'',   api地址     (必填)
		data:{ name:'wangwei',sex:'男' }, data json参数  (可填)
		code:true,     对错误进行特殊处理   (可填)
		nohideloading:true,  不隐藏遮罩层   (可填)
		ajaxtimeout:5000,    接口超时时间 不传默认微config.ajaxtimeout   (可填)
		success:function(data){},  成功后执行的事情  默认直接弹出错误信息 若需特殊处理 请传参code  (必填)
		error:(data){},  错误后执行的相关事情 配合code：true参数使用  (可填)
		complete  请求完成后回调函数 (请求成功或失败之后均调用)  (可填)
	}
*/
	$.AJAX=function(json){
		var noError=true;
		$.ajax({
			type: json.type||"get",
			url: json.url,
			data: json.data||"",
			datatype:"json",
			success:function(data){
				if(!json.nohideloading){ win.hideLoading();};
				clearTimeout(timeout);
				if(typeof(data)=='string'){
					error(JSON.parse(data),json);
				}else{
					error(data,json);
				}
			},
			complete:function(XMLHttpRequest){
				if(!json.nohideloading){ win.hideLoading();};
				clearTimeout(timeout);
				if(json.complete){json.complete(XMLHttpRequest);}
			},
			error:function(XMLHttpRequest){
				win.hideLoading();
				clearTimeout(timeout);
				if(noError){
					_error(XMLHttpRequest,json);
				};	
			}
		});
		var timeout=setTimeout(function(){
			win.hideLoading();
			// 请求超时
			noError=false;
			Popup.alert({type:'msg',title:'您的网络太慢了哦,请刷新重试!'});
		}, json.timeout||config.ajaxtimeout);
	}
	//error 根据code码的函数
	function error(data,json){
		//判断code 并处理
		var dataCode=parseInt(data.code);
		if(!json.pageSet && dataCode==1004){
			//判断app或者web
			if(window.location.href.indexOf(config.loginUrl) == -1){ 
				sessionStorage.setItem("weixin-url", window.location.href); //记录没有登陆前的访问页面
				win.location.href=config.loginUrl;
			}else{
				Popup.alert({type:'msg',title:'用户未登陆,请登录!'});
			}
		}else{
			switch(dataCode){
				case 1000:
					json.success(data);
					break;
				case 1007: //登录成功后返回
					window.location.href="/index.html";
					break;
				case 3004:
					Popup.alert({type:'msg',title:data.desc,yes:function(){
						window.location.href="/maker/index/index.html";
					}});
					break;
				case 4013: //已经是创客
					Popup.alert({type:'msg',title:'您已是创客家族的一员，快去赚钱吧~',yes:function(){
						window.location.href="/maker/index/index.html";
					}});
					break;
				case 5000:
					Popup.alert({type:'msg',title:'您还没有绑定手机号码，立即绑定！',yes:function(){
						//没有绑定手机 跳转到绑定手机页面
		                 window.location.href='/trueme/bindPhone/phoneBinding.html';
					}});
					break;
				case 6001: //没有注册创客
					Popup.alert({type:'msg',title:'您还不是创客,立即去成为创客!',yes:function(){
						window.location.href="/maker/invite/inviteH5.html"; 
					}});
					break;
				case 6006: //创客没有选择推荐人，请先选择推荐人
					window.location.href="/maker/invite/inviteVerifyOrder.html"; 
					break;
				default:
					if(json.code){
						json.error(data);
					}else{
						//直接弹出错误信息
						Popup.alert({type:'msg',title:data.desc});
					};			
			}
		};
		
		// if(dataCode==1000){
		// 	json.success(data);
		// }else if(!json.pageSet && dataCode==1004){
		// 	//判断app或者web
		// 	if(window.location.href.indexOf(config.loginUrl) == -1){ 
		// 		sessionStorage.setItem("weixin-url", window.location.href); //记录没有登陆前的访问页面
		// 		win.location.href=config.loginUrl;
		// 	}else{
		// 		Popup.alert({type:'msg',title:'用户未登陆,请登录!'});
		// 	}
		// }else if(dataCode==6001){ //没有注册创客
		// 	Popup.alert({type:'msg',title:'您还不是创客,立即去成为创客!',yes:function(){
		// 		window.location.href="/maker/invite/inviteH5.html"; 
		// 	}});
		// }else if(dataCode==1007){ //登录成功后返回
		// 	window.location.href="/index.html";
		// }else if(dataCode==4013){ //已经是创客
		// 	Popup.alert({type:'msg',title:'您已是创客家族的一员，快去赚钱吧~',yes:function(){
		// 		window.location.href="/maker/index/index.html";
		// 	}});
		// }else if(dataCode==5000){
		// 	Popup.alert({type:'msg',title:'您还没有绑定手机号码，立即绑定！',yes:function(){
		// 		//没有绑定手机 跳转到绑定手机页面
  		//      window.location.href='/trueme/bindPhone/phoneBinding.html';
		// 	}});
		// }else if(dataCode==6006){ //创客没有选择推荐人，请先选择推荐人
		// 	window.location.href="/maker/invite/inviteVerifyOrder.html"; 
		// }else if(dataCode==3004){
		// 	Popup.alert({type:'msg',title:data.desc,yes:function(){
		// 		window.location.href="/maker/index/index.html";
		// 	}});
		// }else{
		// 	if(json.code){
		// 		json.error(data);
		// 	}else{
		// 		//直接弹出错误信息
		// 		Popup.alert({type:'msg',title:data.desc});
		// 	}
		// }
	}
	// _error函数
	function _error(XMLHttpRequest,json){
		win.hideLoading();
		if(json.code){
			json.error(JSON.parse(XMLHttpRequest.responseText));
		}else{
			switch(XMLHttpRequest.status){
				case 401:
					if(window.location.href.indexOf(config.loginUrl) == -1){ 
						sessionStorage.setItem("weixin-url", window.location.href); //记录没有登陆前的访问页面
						win.location.href=config.loginUrl;
					}else{
						Popup.alert({type:'msg',title:"你需要登录哦"});
					};
					break;
				case 400:
					Popup.alert({type:'msg',title:"您的请求不合法呢"});
					break;	
				case 404:
					Popup.alert({type:'msg',title:"访问的地址可能不存在哦"});
					break;		
				case 500:case 502:
					Popup.alert({type:'msg',title:"萃美已接收此问题,正在紧急处理中哦"});
					break;		
				default:
					Popup.alert({type:'msg',title:"未知错误。程序员欧巴正在赶来修改哦"});	
			}
		}
	}
}	
/*------------------------ end jquery 相关  ------------------------*/

/*------------------------ start 布局写入  ------------------------*/
window==window.top && document.write('<div id="loading"></div>');
/*------------------------ end 布局写入  ------------------------*/

/*------------------------ start 原生扩展  ------------------------*/
var win=window.top;
var UA=navigator.userAgent;
var isPC=UA.indexOf('Windows NT')>-1;
var isAndroid=UA.indexOf('Android')>-1;
var isIos=UA.indexOf('Mac OS X')>-1;
var isIphone=UA.indexOf('iPhone;')>-1;
var isIpad=UA.indexOf('iPad;')>-1;
var isIE7=UA.indexOf('MSIE 7.0;')>-1;
var isIE8=UA.indexOf('MSIE 8.0;')>-1;
var isIE9=UA.indexOf('MSIE 9.0;')>-1;
var isIE10=UA.indexOf('MSIE 10.0;')>-1;
var isIE11=UA.indexOf('Trident')>-1;
var isFirefox=UA.indexOf('Firefox')>-1;
var IsWeiXin=UA.indexOf('MicroMessenger')>-1;
var isIosWebviewApp=UA.indexOf('IosWebviewApp')>-1;
var iFadeInterval=260;
var iSlideInterval=200;
var isLoading=false;
var baseURL='';

/*-----------------------检测登陆与跳转--------------------------*/ 
/*去除不需要记录的页面 记录当前页面 用于登陆之后跳转回来*/
;(function(){
	var notRecordUrl=[
		"login.html", //登录页面
		"phoneBinding.html", //手机号绑定
		"phoneBindingOver.html", //手机号绑定成功
		"wx-code.html", //获取微信code页面
		"inviteVerifyOrder.html", //选择推荐导师页面
	];
	if(!isInArray(notRecordUrl,window.location.href)){
		sessionStorage.setItem("weixin-url",window.location.href);
	}
})();

//首页底部导航增加active样式
$(function(){
	var linkArr = ['index.html','javascript:voind(0)','cart_new.html','myHome.html'];
    for(var i=0; i<linkArr.length; i++){
        if(location.href.indexOf(linkArr[i]) > -1){
            $('.fixed-bar li').removeClass('active');
            $('.fixed-bar li').eq(i).addClass('active');
            $('.fixed-bar li').eq(i).on('click', function(){
                return false;
            })
        }
    };
	
	//是否显示加载更多的数据按钮
	if($('div.loading-box').length){
		if($(window).scrollTop()>10){
			$('div.loading-box').removeClass('hide');
		};
		$(window).on('scroll', function(event) {
			if($(window).scrollTop()>10){
				$('div.loading-box').removeClass('hide');
			};
		});
	};

	//判断是否是app webview 环境
	if(isIosWebviewApp&&!IsWeiXin){
		var timer=setInterval(function(){
			$('#appaButShare').addClass('show').removeClass('hide');
			if($('#appaButShare').css("display")=='block'){
				clearInterval(timer);
			}
		}, 50);
		setTimeout(function(){ clearInterval(timer); }, 5000);
	};
	//sessionStorage 注入shareId
	if(getQueryString('shareId')){
	    sessionStorage.setItem('fenYongShareId', getQueryString('shareId'));
	};

});

// 获取当前时间毫秒
function time(){
	return new Date().getTime();
}
/*js trim函数*/
String.prototype.trim=function(){
　 return this.replace(/(^\s*)|(\s*$)/g, "");
}

function showLoading(){
	isLoading=true;
	$('#loading').stop().fadeIn(iFadeInterval);
};
function hideLoading(){
	isLoading=false;
	$('#loading').stop().fadeOut(iFadeInterval);
};

// 数字前面补零
function fillLen(n, len){
	n=''+n;
	len=len || 2;
	while(n.length<len){
		n='0'+n;
	}
	return n;
}
/*new Date().date('y-m-d h:i:s'); => 2015-11-02 17:11:55*/
Date.prototype.date=function(format){
	var 
	year=this.getFullYear(),
	month=fillLen(this.getMonth()+1),
	day=fillLen(this.getDate()),
	hour=fillLen(this.getHours()),
	minute=fillLen(this.getMinutes()),
	second=fillLen(this.getSeconds()),
	json={
		'y': year,
		'm': month,
		'd': day,
		'h': hour,
		'i': minute,
		's': second
	};
	return !format?year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second:format.replace(/y|m|d|h|i|s/g, function(str){
		return json[str];
	});
}

/*根据参数生成常用的正则表达式
*string    type 生成的正则表达式类型
*array     numArr 生成正则的条件数组 例如:[6,16] 也可省略
*/
function regCombination(type,numArr){
	var reg="";
	switch(type){
		case "*":     //"*":"不能为空！"   
			if(numArr){
				reg=new RegExp("^[\\w\\W]{"+numArr[0]+","+numArr[1]+"}$"); 
			}else {
				reg=new RegExp("^[\\w\\W]+$"); 
			}  
			break;
		case "n":    //"number":"请填写数字！
			if(numArr){
				reg=new RegExp("^\\d{"+numArr[0]+","+numArr[1]+"}$");
			}else{
				reg=new RegExp("^\\d+$");
			}
			break;
		case "s":  //"s":"不能输入特殊字符！"   
			if(numArr){
				reg=new RegExp("^[\\u4E00-\\u9FA5\\uf900-\\ufa2d\\w\\.\\s]{"+numArr[0]+","+numArr[1]+"}$");
			}else{
				reg=new RegExp("^[\\u4E00-\\u9FA5\\uf900-\\ufa2d\\w\\.\\s]+$");
			}
			break; 
		case "c":  //"z":"中文验证" 
			reg=new RegExp("^[\\u4E00-\\u9FA5\\uf900-\\ufa2d]{"+numArr[0]+","+numArr[1]+"}$");
			break;	
		case "p":    //"p":"邮政编码！
			reg=new RegExp("^[0-9]{6}$");
			break;	
		case "m":    //"m":"写手机号码！"
			reg=new RegExp("^13[0-9]{9}$|14[0-9]{9}$|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$");
			break;	
		case "e":   //"e":"邮箱地址格式
			reg=new RegExp("^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$");
			break;
		case "id":   //"id":验证身份证
			reg=new RegExp("^\\d{17}[\\dXx]$");
			break;
		case "money": //钱
			reg=new RegExp("^[\\d\\.]+$");	
			break;	
		case "url":   //"url":"网址"
			reg=new RegExp("^(\\w+:\\/\\/)?\\w+(\\.\\w+)+.*$");
			break;	
	}
	return reg;
}

/*获取复选框值 返回值类型 array*/
function getCheckboxVal(name){
  var group=document.getElementsByName(name); 
  var chkValue =[];
  for(var i=0,len=group.length;i<len;i++){
  	if(group[i].checked){
  		chkValue.push(group[i].value); 
  	}
  }
  return chkValue;
}

/*获取url hash*/
function getQueryString(name,hash) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    if(hash){
    	if(!window.location.hash){
    		return '';
    	};
    	var r = decodeURIComponent(window.location.hash).substr(1).match(reg);
    }else{
    	var r = decodeURIComponent(window.location.search).substr(1).match(reg);
    }
    if (r != null) {
        return r[2];
    }
    return null;
}
// 设置url参数
function setQueryString(name,value,url,isHashMode){
    if(typeof name == 'undefined' || typeof value == 'undefined' || typeof url == 'undefined'){
        return url;
    }
    var reg = new RegExp("(^|&|\\?|#)"+name+"=([^&]*?)(&|#|$)"),
        tempHash=url.match(/#.*/)?url.match(/#.*/)[0]:"";
    
    url=url.replace(/#.*/,"");
    if(isHashMode===true){
        if(reg.test(tempHash)){
            tempHash=tempHash.replace(reg,function(m,r1,r2,r3){return r1+name+"="+encodeURIComponent(value)+r3});
        }else{
            var separator=tempHash.indexOf("#")===-1?"#":"&";
            tempHash=tempHash+separator+name+"="+encodeURIComponent(value)}
            tempHash=tempHash.replace(reg,function(m,r1,r2,r3){return r1+name+"="+encodeURIComponent(value)+r3})
    }else if(reg.test(url)){
        url=url.replace(reg,function(m,r1,r2,r3){return r1+name+"="+encodeURIComponent(value)+r3});
    }else{
        var separator=url.indexOf("?")===-1?"?":"&";
        url=url+separator+name+"="+encodeURIComponent(value)
    }
    return url+tempHash
};

/*给元素添加属性*/
function addAttr(obj,json){
	for(var attr in json){
		obj.setAttribute(attr, json[attr]);
	}
}

/*json 转换成get url传参方式*/
function jsonToGetUrl(json){
	var str="";
	for(var i in json){
		str+=i+'='+json[i]+'&';
	}
	return str.slice(0,-1);
}

/*拼json的key值*/
function jsonKeyStr(json){
	var str="";
	for(var i in window.buttonPer){
		str+=i+',';
	}
	return str.slice(0,-1);
}

/*生成随机字符串*/
function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

/*检查输入的是否是数字*/
function IsNum(e) {
    var k = window.event ? e.keyCode : e.which;
    if (((k >= 48) && (k <= 57)) || k == 8 || k == 0) {
    } else {
        if (window.event) {
            window.event.returnValue = false;
        }
        else {
            e.preventDefault(); //for firefox 
        }
    }
} 

 //秒数换算成时间函数
function formatSeconds(value) {
    var second = parseInt(value);// 秒
    var minute = 0;// 分
    var hour = 0;// 小时
    if(second > 60) {
            minute = parseInt(second/60);
            second = parseInt(second%60);
        if(minute > 60) {
            hour = parseInt(minute/60);
            minute = parseInt(minute%60);
        }
    }
    var result = getZero(minute)+':'+getZero(parseInt(second));
    if(minute > 0) {
        result =getZero(parseInt(minute))+":"+getZero(parseInt(second));
    }
    if(hour > 0) {
        result =getZero(parseInt(hour))+':'+getZero(parseInt(minute))+":"+getZero(parseInt(second));
    }
    return result;
}

/*判断时间前面是否加0*/
function getZero(num){
    if(num<10){
            return '0'+num;
    }else{
            return num;
    }
}

/*手机号码等字符中间用 * 号替换
obj 即需要替换的对象
start 开始位置
number 需要替换几位字符
*/
function asterisk(obj,start,number){
	var strxh="";
	for(var i=0;i<number;i++){
		strxh+='*';
	}	
	return obj.replace(obj.substr(start,number),strxh);
}


/*浏览器返回上一步*/
function goBack(url){
	if(url){
		window.location.href=url;
	}else{
		window.history.back(-1)
	}
}

/*检测是不是数组里面的值*/
function checkIn(arr,value){
	var result=false
	for(var i=0,len=arr.length;i<len;i++){
		if(arr[i]==value){
			result=true;
		}
	}
	return result;
}

/*检测某值在数组中是否存在*/
function isInArray(arr,value){
	var result=false;
	for(var i=0,len=arr.length;i<len;i++){
		if(value.indexOf(arr[i]) != -1){
			result=true;
		};
	};
	return result;
}

/*删除json 中含有的某个key值*/
function deleteJson(json,key){
	var newJson={};
	for(var i in json){
		if(i!=key){
			newJson[i]=json[i];
		}
	}
	return newJson;
}

/*根据某个val值删除当前数组的值*/
function deleteArrItem(arr,val){
	var newArr=[];
	for(var i=0,len=arr.length;i<len;i++){
		for(var j in arr[i]){
			if(arr[i][j]==val){
				arr.splice(i,1);
				newArr=arr;
				return newArr;
			}
		}
	}
}

/*检测json 中是否有某个key值*/
function haveKeyInJson(json,key){
	var haveKey=false;
	for(var i in json){
		if(i==key){
			haveKey=true;
		}
	}
	return haveKey;
}

/*根据某个key值得到数据集合*/
function getKeyArrFromData(datas,key){
	var newArr=[];
	for(var i=0,len=datas.length;i<len;i++){
		newArr.push(datas[i][key]);
	}
	return newArr;
}

/*保留两个数组相同的值*/
function commonArrData(arr1,arr2){
	var newArr=[];
	for(var i=0,len=arr1.length;i<len;i++){
		for(var j=0,lenj=arr2.length;j<lenj;j++){
			if(arr2[j]==arr1[i]){
				newArr.push(arr2[j]);
			}
		}
	}
	return newArr;
}

/*extent json函数*/
function extend(json1,json2){
	var newJson=json1;
	for(i in json1){
		for( j in json2){
			newJson[j]=json2[j];
		}
	}
	return newJson;
}

//获得登录后可跳转的url
function getNextUrl(){
	//清除 weixin-next-url 
	if(sessionStorage.getItem('weixin-next-url')==window.location.href){
		sessionStorage.setItem('weixin-next-url','');
	};
	if(sessionStorage.getItem('weixin-next-url')){
		return sessionStorage.getItem('weixin-next-url');
	}else{
		return sessionStorage.getItem("weixin-url")||'/index.html';
	}
}

//https替换为http
function httpsReplaceHttp(url){
	if(url.indexOf('https')>-1){
		return url.replace(/^https/,'http');
	}else{
		return url;
	}
}

/*------------------------ end 原生扩展  ------------------------*/

/*---------------------------web调用app相关方法------------------------------*/
__inline('isApp.js')          //引入 isApp.js 判断是否是原声app js

/*------------------------------------微信jsdk相关------------------------------*/
__inline('wxJssdkShare.js')   //引入 wxJssdkShart.js 微信分享

/*-----------------------判断是否是创客 如果是就注入shareId for session------------------------*/
function everyPageWeiXinShare(json){
	//调起微信分享
    var setting={
		debug:false,
		notshareNow:typeof(json.isnotshareNow)=='boolean'?json.isnotshareNow:true,
		title :'萃美，最美最努力的我们！',
		desc :'我们想做的就是一点点帮你把未来显现！', 
		link :'',       
		mainUrl:window.location.origin + __uri('/assets/common/images/logo.png'),   
		success:function(){},    
		cancel:function(){},    
	};
	var datas=extend(setting,json);

	//判断是否有存shareId
	if(localStorage.getItem('weiXinShareIdCode')){
		//获得分享的url
		var shareUrl=shareIdreplace();
		//开始分享
        WeiXinShare({
            notshareNow:datas.notshareNow,
            title:datas.title,
            desc: datas.desc,
            link: datas.link?datas.link:shareUrl,
            mainUrl:datas.mainUrl,
         	success:function(){
         		if(localStorage.getItem('weiXinShareIdCode')){
         			$.AJAX({
		                type: 'post',
		                url: config.basePath + 'content/svMakerContent/pushShare',
		                data: {
		                    shareId:localStorage.getItem('weiXinShareIdCode'),
		                },
		                success: function (data) {
		                    Popup.miss({title: '分享成功！'});
		                },
		            });
         		};
			}, 
         	cancel:datas.cancel, 
        });
	}else{
	//localStorage 里没有shareId时请求 获得shareId	
		//已经是创客 获取shareId
     	$.AJAX({
		    type:'post',
		    pageSet:true,
    		code:true,
    		nohideloading:true,
		    url:config.basePath+'content/svMakerContent/share',
		    data:{},
		    success:function(data){
		        localStorage.setItem('weiXinShareIdCode',data.data.shareId);
		        //请求微信分享
		        var href=window.location.href;
		        var shareUrl="";
		        if(data.data.shareId){
		        	if(href.indexOf('#')>-1){
			    		shareUrl=href.substring(0,location.href.indexOf('#'))+'?shareId='+data.data.shareId+href.substring(location.href.indexOf('#'));
			    	}else{
						shareUrl=href+'?shareId='+data.data.shareId;
			    	}
		        }else{
		        	shareUrl=href;
		        }
		        WeiXinShare({
		            notshareNow:datas.notshareNow,
		            title:datas.title,
		            desc: datas.desc,
		            link: datas.link?datas.link:shareUrl,
		            mainUrl:datas.mainUrl,
		         	success:function(){
		         		if(localStorage.getItem('weiXinShareIdCode')){
							$.AJAX({
				                type: 'post',
				                url: config.basePath + 'content/svMakerContent/pushShare',
				                data: {
				                    shareId:localStorage.getItem('weiXinShareIdCode'),
				                },
				                success: function (data) {
				                    Popup.miss({title: '分享成功！'});
				                },
				            });
						};
					},
		         	cancel:datas.cancel,
		        });
		    },
		    error:function(data){
		    	WeiXinShare({
		    		notshareNow:datas.notshareNow,
		            title:datas.title,
		            desc: datas.desc,
		            link: datas.link?datas.link:window.location.href,
		            mainUrl:datas.mainUrl,
		            success:datas.success,
		            cancel:datas.cancel,
		        });	
		    },
		});
	};
};

//替换多余的shareId
function shareIdreplace(){
	var shareUrl="";
	var href=window.location.href;
    if(href.indexOf('?')>-1){
    	if(href.indexOf('shareId')>-1){
    		shareUrl=href.replace(/shareId=\d+/,'shareId='+localStorage.getItem('weiXinShareIdCode'));
    	}else{
    		shareUrl=href+'&shareId='+localStorage.getItem('weiXinShareIdCode')
    	}
    }else{
    	if(href.indexOf('#')>-1){
    		shareUrl=href.substring(0,location.href.indexOf('#'))+'?shareId='+localStorage.getItem('weiXinShareIdCode')+href.substring(location.href.indexOf('#'));
    	}else{
			shareUrl=href+'?shareId='+localStorage.getItem('weiXinShareIdCode');
    	}
    }
    return shareUrl;
}

//公共页面调用微信分享功能
;(function(){
	//不需要初始化调用分享页面合集
	var notRecordUrl=[
		"wenAnDetails.html", //文案详情页
		"wareDetail.html", //商详页
		"invite.html", //创客分享页
		"wx-code.html", 
		"login.html",
	];
	if(!isInArray(notRecordUrl,window.location.href)){
		everyPageWeiXinShare({'isnotshareNow':true});
	}
})();
