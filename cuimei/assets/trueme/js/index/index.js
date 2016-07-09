//点击隐藏弹出层
$('#weixinShare').click(function(){
  $(this).removeClass('show').addClass('hide');
  sessionStorage.setItem("maker-share", '');
});
var mySwiper;

/*index.js*/
var vm = new Vue({
    el: '#container',
    data: {
        loadingStatus:1,//加载更多数据时的状态
        topTypeId:getQueryString('showList'),  //当前的topTypeId
        dataList:{}, //所有容器的数据的集合
        datas:{}, //当前容器的数据
        isShowNav:getQueryString('isShowNav')?false:true,
        timer:null,
        timerout:null,
    },
    ready: function(){
        var This = this;
        //页面加载请求数据
        This.getItemHomeDataList();
    },
    methods: {
        //页面加载时请求数据
        getItemHomeDataList:function(isLode){
            var This = this;
            //ajax
            $.AJAX({
                url: config.basePath+"content/svItemHome/getItemHomeList",
                data:{
                    topTypeId:This.topTypeId?This.topTypeId:1,
                },
                success:function(data){
                    This.datas=data.data;
                    //数据集合赋值
                    if(jQuery.isEmptyObject(This.dataList)){
                       for(var i=0; i< This.datas.itemHomeTypeList.length; i++){
                            This.dataList[This.datas.itemHomeTypeList[i].topTypeId] = {
                                datas:{}, //item数据
                                scrollbegin: true, //是否可滚动
                                startNum:1, //热门商品的开始条数
                                loadingStatus:1, //加载更多数据时的状态
                            };
                        };
                        This.topTypeId=This.datas.itemHomeTypeList[0].topTypeId;
                        This.dataList[This.topTypeId].datas=data.data;
                        This.dataList[This.topTypeId].startNum=data.data.startNum; 
                    }else{
                        This.dataList[This.topTypeId].datas=data.data;
                        This.dataList[This.topTypeId].startNum=data.data.startNum; 
                    };
                    setTimeout(function(){
                        $('#container').removeClass('visibility');
                        This.getLayImgsAndMore();
                        //This.getVideosDuration();
                    },config.containerShowTime);

                },
            });
        },

        //图片banner和加载更多数据等
        getLayImgsAndMore:function(){
            var This = this;
            //执行banner Swaper
            if($('.banner-slide').length){       
            setTimeout(function(){
                mySwiper = new Swiper('.banner-slide', {
                    autoplay: 3000,//可选选项，自动滑动
                    autoplayDisableOnInteraction : false,
                    loop: true,
                    pagination: '.swiper-pagination',
                })
            }, 0);
            }
            //各类专场推荐 Swaper
            if($('.activity_pro_wrap').length){     
            setTimeout(function(){
                new Swiper('.activity_pro_wrap', {
                    slidesPerView: 'auto',
                    freeMode: true,
                })
            }, 0);
            }
            //图片懒加载
            setTimeout(function(){$("img.lazy").lazyload({threshold:config.threshold});}, 0);
            //加载更多数据
            This.scrollGetMoreDatas();
        },

        //页面滚动时加载更多数据
        scrollGetMoreDatas:function(){
            var This=this;
            $(window).on('scroll',function(){
                if (($('#bottomscolltop').offset().top-$(window).height())-$(window).scrollTop()<config.bottomTop) {    
                    if (This.dataList[This.topTypeId].scrollbegin) {
                        This.dataList[This.topTypeId].scrollbegin = false;
                        This.loadingStatus=This.dataList[This.topTypeId].loadingStatus=2;
                        $.AJAX({
                            url: config.basePath+"content/svItemHome/getItemHomeList",
                            data:{
                                topTypeId:This.topTypeId,
                                startNum:This.dataList[This.topTypeId]['startNum'],
                            },
                            success:function(data){
                                //判断是否还需要滚动获取数据 向数组里push数据
                                if (data.data.modeList.length > 0) {
                                    This.loadingStatus=This.dataList[This.topTypeId].loadingStatus =1;
                                    This.dataList[This.topTypeId].scrollbegin = true; //可以再次滚动
                                    This.dataList[This.topTypeId].datas.modeList = (This.dataList[This.topTypeId].datas.modeList).concat(data.data.modeList);
                                    This.datas = This.dataList[This.topTypeId]['datas'];
                                }else{
                                    This.loadingStatus=This.dataList[This.topTypeId].loadingStatus =3;
                                }
                                This.dataList[This.topTypeId]['startNum'] = data.data.startNum;
                                //图片懒加载
                                setTimeout(function(){ $("img.lazy").lazyload({threshold:config.threshold}) }, 0);
                                setTimeout(function(){
                                    This.getLayImgsAndMore();
                                    //This.getVideosDuration();
                                },config.containerShowTime);
                            },
                        });
                    }
                };
            });
        },

        //点击table切换数据
        getNavData:function(topTypeId){
            if(topTypeId===vm.topTypeId){return false};
            clearInterval(vm.timer);
            clearTimeout(vm.timerout);
            vm.topTypeId=topTypeId;
            if(jQuery.isEmptyObject(vm.dataList[topTypeId]['datas'])){
                win.showLoading();
                vm.getItemHomeDataList();
            }else{
                vm.datas=vm.dataList[topTypeId]['datas'];
                setTimeout(function(){
                    vm.getLayImgsAndMore();
                }, 0)
            }
            vm.loadingStatus=vm.dataList[topTypeId].loadingStatus;
            setTimeout(function(){
                if($('.banner-slide').length){
                    window.mySwiper.destroy(true,true); //移除所有slide监听事件
                };
            }, 0)
        },

        //单品收藏
        praise: function(e,$index,item){
            var This = this;
            $.AJAX({
                type:'post',
                url:config.basePath+'user/svUserProductCollect?spuId=' + item.spuId,
                success:function(data){
                    if(data.data.flag ==2){
                        $(e.srcElement).find('span.praise_icon').addClass('praised');
                        $(e.srcElement).find('span.praise_num').text(item.collectNum+1);
                        Popup.miss({title:'收藏成功！'});
                    }else{
                        $(e.srcElement).find('span.praise_icon').removeClass('praised');
                        $(e.srcElement).find('span.praise_num').text(item.collectNum);
                        Popup.miss({title:'取消收藏成功！'});
                    }
                },
            });
        }, 

        //文案点赞
        likeElectricity:function($event,vidioContent){
            $.AJAX({
                type:'post',
                url:config.basePath+'content/svMakerContent/likeContent',
                data:{contentId:vidioContent.contentId},
                success:function(data){
                    Popup.miss({title:'点赞成功！'});
                    vidioContent.likeCount++;
                    $($event.target).text(vidioContent.likeCount);
                }    
            });
        },

        //文案收藏
        collectionwenan:function($event,type,itemList){
            var content= type=='img'?itemList.imgContent:itemList.vidioContent;
            $.AJAX({
                type:'post',
                url:config.basePath+'content/svMakerContent/collectContent',
                data:{contentId:content.contentId},
                success:function(data){
                    Popup.miss({title:data.data.desc});
                    itemList.isCollect=data.data.collect;
                    data.data.collect?itemList.collectCount++:itemList.collectCount--;
                    $($event.target).text(itemList.collectCount);
                },
            });
        },

        //文案分享------调用微信分享相关功能-----
        wenAnweixinShare:function(type,itemList){
            var content= type=='img'?itemList.imgContent:itemList.vidioContent;
            //获得shareId 
            $.AJAX({
                type:'post',
                url:config.basePath+'content/svMakerContent/share',
                data:{
                    contentId:content.contentId
                },
                success:function(data){
                    //调起微信分享
                    if(!isIosWebviewApp){$('#weixinShare').addClass('show').removeClass('hide')};
                    localStorage.setItem('weiXinShareIdCode',data.data.shareId);
                    WeiXinShare({
                      title : content.title,
                      desc : content.desc,       
                      link : window.location.origin+"/maker/wenan/wenAnDetails.html?contentId="+content.contentId+'&shareId='+data.data.shareId,       
                      mainUrl: content.mainUrl,   
                      success:function(){
                          $('#weixinShare').addClass('hide').removeClass('show');
                          vm.shareSuccess(data.data.shareId);
                          everyPageWeiXinShare({'isnotshareNow':true});
                      },     
                      cancel:function(){
                          $('#weixinShare').addClass('hide').removeClass('show');
                          everyPageWeiXinShare({'isnotshareNow':true}); 
                      },
                    });
                },
            });
        }, 

        //内容跳转到文案详情
        goToWenAnUrl:function(type,itemList){
            var content= type=='img'?itemList.imgContent:itemList.vidioContent;
            //获得shareId
            $.AJAX({
                type:'post',
                url:config.basePath+'content/svMakerContent/share',
                data:{
                    contentId:content.contentId
                },
                success:function(data){
                    //调起微信分享
                    localStorage.setItem('weiXinShareIdCode',data.data.shareId);
                    window.location.href="/maker/wenan/wenAnDetails.html?contentId="+content.contentId;      
                },
            });
        },

        //用户分享成功后回调分享成功
        shareSuccess:function(shareId){
           $.AJAX({
                type: 'post',
                url: config.basePath + 'content/svMakerContent/pushShare',
                data: {
                    shareId:shareId,
                },
                success: function (data) {
                    Popup.miss({title: '分享成功！'});
                    $('#weixinShare').removeClass('show').addClass('hide');
                },
            });
        },

        //视频操作相关
        videoAboutCaoZuo:function($event,mainUrl){
            var winWidth=$(window).width();
            var video=$($event.target).parent().siblings('video')[0];
            $($event.target).parent().addClass('hide').removeClass('show');
            $($event.target).parent().siblings('div.video-con,div.blur').stop().slideUp('fast');
            video.play();
            //监听播放
            video.addEventListener("playing", function (ev) {
                $($event.target).parent().siblings('div.video-con,div.blur').stop().slideUp('fast');
                $($event.target).parent().addClass('hide').removeClass('show');
                $(video).addClass('show').removeClass('hide');
                $(video).css({"backgroundImage":"","backgroundColor":"#000"});
                var headerHeight=$('#header-nav').height();
                var footerHeight=$('div.fixed-bar').height();
                var videoHeight=$(video).height();
                var winHeight=$(window).height();
                //浏览器滚动时监听
                $(window).on('scroll',function(){
                    var winScrollTop=$(window).scrollTop();
                    var videoScrollTop=$(video).offset().top;
                    if((videoScrollTop+videoHeight-headerHeight)<winScrollTop||videoScrollTop>(winScrollTop+winHeight-footerHeight)){
                        video.pause();
                    };
                });
            });
            //监听暂停
            video.addEventListener("pause", function (ev) {
                $($event.target).parent().siblings('div.video-con,div.blur').stop().slideDown('fast');
                $($event.target).parent().addClass('show').removeClass('hide');
                $(video).addClass('hide').removeClass('show');
                $(video).css({"backgroundImage":"url("+mainUrl+")"}) 
            });
            //拖动中执行
            video.addEventListener("seeking", function (ev) { 
                $($event.target).parent().siblings('div.video-con,div.blur').stop().hide();
                $($event.target).parent().addClass('hide').removeClass('show');
                $(video).addClass('show').removeClass('hide');
                $(video).css({"backgroundImage":"","backgroundColor":"#000"});
            });
        },
        //获得视频总长度
        getVideosDuration:function(){
            var videos=$('video');
            var videoes=[];
            for(var i=0,len=videos.length;i<len;i++){
                if(videos[i].src){
                    videoes.push(videos[i]);
                }
            };
            var i=0;
            //获取时间
            vm.timer=setInterval(function(){
                if(i==videoes.length){
                    clearInterval(vm.timer);
                    return false;
                };
                if(videoes[i].duration){

                    var duration=formatSeconds(videoes[i].duration);
                    $(videoes[i]).siblings('div.video-mainimg').find('.video-duration').text(duration);
                    vm.dataList[vm.topTypeId]['datas']['modeList'][$(videoes[i]).attr('data-index')]['duration']= duration;
                    i++;
                };
            },200);
            vm.timerout=setTimeout(function(){
                clearInterval(vm.timer)
            },20000);
        },

    }
});

//menu切换过滤器
Vue.filter('addActive', function (value) { 
    var strText="";
    if(vm.topTypeId==value){
        strText='active';
    };
    return strText;
});



