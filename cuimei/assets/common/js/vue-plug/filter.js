
//过滤器1
Vue.filter('charAt', function (value,num) {
  	return value.charAt(num);
});

//limitTo过滤器
Vue.filter('limitTo', function (value,num) {
	var text="";
	if(value){
		if(value.length<num){
			text=value;
		}else{
			text=value.substring(0,num)+'···';
		}
	}
  	return text;
});

//limitTo过滤器
Vue.filter('limitToCut', function (value,num) {
  	return value.substring(0,num);
});

//下拉loading过滤器
Vue.filter('loadingStatusFilter', function (value) { 
	var strText="";
	switch(value){
		case 1:
			strText='下滑加载更多···';
			break;
		case 2:
			strText='加载中···';
			break;
		case 3:
			strText='已经到底了';
			break;
	}
	return strText;	
});

//时间过滤器
Vue.filter('Data', function (format,his) {
	if(his){
		return new Date(format).date('y-m-d h:i:s');
	}else{
		return new Date(format).date('y-m-d');
	}
});

//图片七牛云过滤器
Vue.filter('qiniuImgFilter', function (src,type,w,h) {  //?imageView2/0/w/300/h/200
	if(!src){
		return __uri('/assets/common/images/gods-default-icon.png')
	}else{
		if(type){
			var src=src+'?imageView2';
		}else{
			var src=src+'?imageView2/2/w/750';
		}
		var type=type+''?type:2;
		if(w&&h){
			return src+'/'+type+'/w/'+w+'/h/'+h;
		}else if(w){
			return src+'/'+type+'/w/'+w;
		}else if(h){
			return src+'/'+type+'/h/'+h;
		}else{
			return src;
		}
	};
});

//手机号码中坚用*代替
Vue.filter('asterisk', function (obj,start,number) { //13476002863
	var strxh="";
	var start=start||3;
	var number=number||4;
	for(var i=0;i<number;i++){
		strxh+='*';
	};	
	if(obj){
		return obj.replace(obj.substr(start,number),strxh);
	}else{
		return "";
	}
});

//显示星号
Vue.filter('spulitNumper', function (obj,start,number) { //13476002863
	var strxh="";
	for(var i=0;i<number;i++){
		strxh+='*';
	};
	return obj.replace(obj.substr(start,number),strxh);
});

//订单状态
Vue.filter('orderStatusFilter', function (value) { 
	var strText="";
	switch(value){
		case 1:
			strText='待付款';
			break;
		case 2:
			strText='待发货';
			break;
		case 3:
			strText='已发货';
			break;
		case 4:
			strText='已完成';
			break;
		case 5:
			strText='退款中';
			break;	
		case 6:
			strText='已取消';
			break;
		case 7:
			strText='已关闭';
			break;
		case 8:
			strText='退货中';
			break;
		case 9:
			strText='已退款';
			break;
		case 10:
			strText='已发货';
			break;

	}
	return strText;	
});

//订单状态
Vue.filter('orderTypeFilter', function (value) { 
	var strText="";
	switch(value){
		case 1:
			strText='普通';
			break;
		case 2:
			strText='分销';
			break;
		case 3:
			strText='拉新';
			break;
		case 4:
			strText='其它';
			break;	
	}
	return strText;	
});

//显示隐藏过滤器 订单状态
Vue.filter('stateBoolen', function (value,state) { 
	var stateBoolen=false;
	var statearr=state.split(',');
	if(checkIn(statearr,value)){
		stateBoolen=true;
	}
	return stateBoolen;	
});

//订单库存过滤器
Vue.filter('getSkuStockInFilter', function (value,num) { 
	var text='(库存充足)';
	var num=num||10;
	if(value<num){
		text='(只剩'+value+'件)';
	}
	return text;	
});








