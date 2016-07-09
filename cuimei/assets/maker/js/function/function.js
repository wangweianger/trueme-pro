
/****************************************************定义函数*******************************************************************/
window.maker={


//收藏文案
collectionWenAn:function(json){
	$.AJAX({
		type:'post',
		url:config.basePath+'content/svMakerContent/collectContent',
		data:{
			contentId:json.contentId
		},
		success:function(data){
			Popup.miss({title:data.data.desc});
			if(json.success){
				json.success(data);
			}
		},
	});
},

//点赞
likeElectricityWenAn:function(json){
	$.AJAX({
		type:'post',
		url:config.basePath+'content/svMakerContent/likeContent',
		data:{
			contentId:json.contentId
		},
		success:function(data){
			if(json.success){
				json.success(data);
			}
		},
	});
},

//分享文案预设参数获取 
shareContentSetback:function(json){
	$.AJAX({
		type:'post',
		url:config.basePath+'content/svMakerContent/share',
		data:{
			contentId:json.contentId
		},
		success:function(data){
			if(json.success){
				json.success(data);
			}
		},
	});
},

//回调增加分享文案浏览次数
addReadCountCallback:function(json){
	$.AJAX({
		type:'post',
		url:config.basePath+'content/svMakerContent/addReadCount',
		data:{
			shareId:json.shareId
		},
		success:function(data){
			if(json.success){
				json.success(data);
			}
		},
	});
},




};



