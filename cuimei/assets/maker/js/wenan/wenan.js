//点击隐藏弹出层
$('#weixinShare').click(function () {
    if (!isIosWebviewApp) {
        $(this).removeClass('show').addClass('hide')
    }
    sessionStorage.setItem("maker-share", '');
});
//当前的订单状态tab
var wenanstatestab = getQueryString('wenanstates', true) + '' ? getQueryString('wenanstates', true) : 0;
//改变tab样式
$("#wenanTanNav li").eq(wenanstatestab).addClass("active").siblings().removeClass("active");
//hush改变时执行

window.onhashchange = function () {
    vm.isQueryingPro = false;
    vm.searchKeyWord = '';
    wenanstatestab = getQueryString('wenanstates', true);
};

//skuType 1 普通商品  2：分销商品 3：拉新商品

//vue begin
var vm = new Vue({
    el: '#container',
    data: {
        index: parseInt(wenanstatestab),   //初始table索引
        startNum: 0, //初始
        datas: {}, //当前的列表数据
        loadingStatus: 1, //加载更多数据默认
        shareUrl: '', //分享的url
        shareMainUrl: '',//微信分享的主图
        shareTitle: '', //微信分享的title
        shareDesc: '', //微信分享的描述
        shareId: '', //分享的shareId
        isQueryingPro: false,  //是否是搜素商品的状态
        searchKeyWord: getQueryString('brandNameEn'), //商品搜索框初始值
        brandId: getQueryString('brandId'), //搜索品牌的ID
        winHeight: $(window).height()  //屏幕高度
    },
    ready: function () {
        var This = this;
        //tab切换
        $("#wenanTanNav li").click(function () {
            $('div.loading-box').addClass('hide');
            $(this).addClass('active').siblings().removeClass('active');
            $('#container').addClass('hide');
            //缓存数据
            This.loadingStatus = 1;
            config.scrollbegin = true; //可以再次滚动
            This.index = $(this).index();
            location.hash = '#wenanstates=' + This.index;
            win.showLoading();
            //加载订单列表数据
            This.queryWenAnList(This.index);
        });
        //加载订单列表数据
        This.queryWenAnList(This.index);
        form.onsubmit = function(){
            This.isQueryingPro = true;
            $.AJAX({
                type: 'get',
                data: {
                    startNum: 0,
                },
                url: config.basePath + "product/svProduct/getRecommendList?name=" + This.searchKeyWord,
                success: function (data) {
                    This.datas = data.data;
                    This.startNum = data.data.startNum;
                    //滚动拉去更多数据
                    This.scollGetMoreData();
                    setTimeout(function () {
                        $('#container').removeClass('hide');
                    }, config.containerShowTime);
                    //滚动懒加载
                    setTimeout(function () {
                        $("img.lazy").show().lazyload({threshold: config.threshold});
                    }, 10);
                }
            });
            $('.search-input input').blur();
            return false;
        }
        $(window).on('resize', function(){
            if($(window).height() + 20 >= This.winHeight){
                $('.fixTop').css("position","fixed");
                $('footer').show();
            }else{
                $('.fixTop').css("position","absolute");
                $('footer').hide();
            }
        });
    },
    methods: {
        focusEvent: function(){
            $('.fixTop').css("position","absolute");
            document.body.scrollTop = 0;
        },
        blurEvent: function(){
            $('.fixTop').css("position","fixed");
        },
        //查询我的文案列表
        queryWenAnList: function (index) {
            var This = this;
            if (index == 0) {
                //请求热门文案
                var apiUrl = "content/svMakerContent/getHotMakerContentList";
            } else if (index == 1) {
                if(This.brandId){
                    //请求品牌搜素结果
                    var apiUrl = "product/svProduct/getRecommendList?brandId=" + This.brandId;
                }else{
                    //请求热销单品
                    var apiUrl = "product/svProduct/getRecommendList";
                }
            } else if (index == 2) {
                //请求收藏文案
                var apiUrl = "content/svMakerContent/getUserCollectList";
            } else if (index == 3) {
                //我分享的文案
                var apiUrl = "content/svMakerContent/getUserShareList";
            }
            //ajax
            $.AJAX({
                type: 'get',
                url: config.basePath + apiUrl,
                data: {
                    startNum: 0,
                },
                success: function (data) {
                    This.datas = data.data;
                    This.startNum = data.data.startNum;
                    //滚动拉去更多数据
                    This.scollGetMoreData();
                    setTimeout(function () {
                        $('#container').removeClass('hide');
                    }, config.containerShowTime);
                    //滚动懒加载
                    setTimeout(function () {
                        $("img.lazy").show().lazyload({threshold: config.threshold});
                    }, 10);
                }
            });
        },
        //点击搜索框叉号重置热门商品列表
        resetHotPro: function(){
            var This = this;
            This.brandId = "";
            This.searchKeyWord = "";
            This.isQueryingPro = false;
            This.queryWenAnList(1);
            config.scrollbegin = true; //可以再次滚动
        },
        //滚动获得更多数据
        scollGetMoreData: function () {
          var This = this;
          //滚动时执行
          trueme.w.scrollGetData({
              lastObj: $('#bottomscolltop'),
              //bottomTop:$('ul.fixed-bar').height(),
              callback: function () {
                  This.loadingStatus = 2;
                  if (This.index == 0) {
                      //请求热门文案
                      var apiUrl = "content/svMakerContent/getHotMakerContentList";
                  } else if (This.index == 1) {
                      if(This.isQueryingPro){
                          //请求搜素商品结果
                          var apiUrl = "product/svProduct/getRecommendList?name=" + This.searchKeyWord;
                      }else if(This.brandId){
                          //请求品牌搜素结果
                          var apiUrl = "product/svProduct/getRecommendList?brandId=" + getQueryString('brandId');
                      }else{
                          //请求热销单品
                          var apiUrl = "product/svProduct/getRecommendList";
                      }
                  } else if (This.index == 2) {
                      //请求收藏文案
                      var apiUrl = "content/svMakerContent/getUserCollectList";
                  } else if (This.index == 3) {
                      //我分享的文案
                      var apiUrl = "content/svMakerContent/getUserShareList";
                  }
                  $.AJAX({
                      type: 'get',
                      url: config.basePath + apiUrl,
                      data: {
                          "startNum": This.startNum,
                      },
                      success: function (data) {
                          //判断是否还需要滚动获取数据 向数组里push数据
                          if (data.data.contentList.length > 0) {
                              This.loadingStatus = 1;
                              config.scrollbegin = true; //可以再次滚动
                              This.datas.contentList = (This.datas.contentList).concat(data.data.contentList);
                          } else {
                              This.loadingStatus = 3;
                          }
                          This.startNum = data.data.startNum;
                          setTimeout(function () {
                              $('#container').removeClass('hide');
                          }, config.containerShowTime);
                          //滚动懒加载
                          setTimeout(function () {
                              $("img.lazy").lazyload({threshold: config.threshold});
                          }, 0);
                      },
                  });
              },
          });
        }, //end
        //收藏文案
        collectionwenan: function ($index, contentId) {
            maker.collectionWenAn({
                contentId: contentId,
                success: function (data) {
                    if (vm.index == 2) {
                        vm.queryWenAnList(2);
                        return false;
                    }
                    vm.datas.contentList[$index].collect = data.data.collect;
                },
            });
        },
        //视频文案收藏
        collectionwenanVideo: function ($event, itemList) {
            $.AJAX({
                type: 'post',
                url: config.basePath + 'content/svMakerContent/collectContent',
                data: {contentId: itemList.contentId},
                success: function (data) {
                    Popup.miss({title: data.data.desc});
                    itemList.isCollect = data.data.collect;
                    data.data.collect ? itemList.collectCount++ : itemList.collectCount--;
                    $($event.target).text(itemList.collectCount);
                },
            });
        },
        //点赞
        likeElectricity: function ($index, contentId) {
            maker.likeElectricityWenAn({
                contentId: contentId,
                success: function (data) {
                    Popup.miss({title: '点赞成功！'});
                    vm.datas.contentList[$index].likeCount += 1;
                },
            });
        },
        //获得分享的shareId
        getShareIdWenAnDetails: function (contentId, mainUrl, title,desc) {
            //根据contentId获得分享shareId
            maker.shareContentSetback({
                contentId: contentId,
                success: function (data) {
                    //调用页面查看次数接口
                    vm.shareId = data.data.shareId;
                    localStorage.setItem('weiXinShareIdCode', data.data.shareId);
                    if (!isIosWebviewApp) {
                        $('#weixinShare').removeClass('hide').addClass('show')
                    }
                    ;
                    vm.shareUrl = window.location.origin + '/maker/wenan/wenAnDetails.html?contentId=' + contentId +'&shareId='+data.data.shareId;
                    vm.shareMainUrl = mainUrl;
                    vm.shareTitle = title;
                    vm.shareDesc = desc;
                    //调起微信分享
                    vm.weixinShare();
                },
            });
        },
        //点击连接获得shareId
        geShareIdForA: function (contentId) {
            //根据contentId获得分享shareId
            maker.shareContentSetback({
                contentId: contentId,
                success: function (data) {
                    //调用页面查看次数接口
                    localStorage.setItem('weiXinShareIdCode', data.data.shareId);
                    window.location.href = '/maker/wenan/wenAnDetails.html?contentId=' + contentId;
                },
            });
        },
        //热门商品的分享
        shareHotGoods: function (spuId, mainUrl, title, slogan) {
            $.AJAX({
                type: 'get',
                url: config.basePath + "content/svMakerContent/share?spuId=" + spuId,
                success: function (data) {
                    if (!isIosWebviewApp) {
                        $('#weixinShare').removeClass('hide').addClass('show')
                    }
                    ;
                    vm.shareId = data.data.shareId;
                    localStorage.setItem('weiXinShareIdCode', data.data.shareId);
                    vm.shareUrl = window.location.origin + '/trueme/ware/wareDetail.html?spuId=' + spuId + "&shareId=" + data.data.shareId;
                    vm.shareMainUrl = mainUrl;
                    vm.shareTitle = title;
                    vm.shareDesc = slogan;
                    //调起微信分享
                    vm.weixinShare();
                },
            });
        },
        //热门商品加上shareId
        shareIdHotGoods: function (spuId) {
            $.AJAX({
                type: 'get',
                url: config.basePath + "content/svMakerContent/share?spuId=" + spuId,
                success: function (data) {
                    localStorage.setItem('weiXinShareIdCode', data.data.shareId);
                    window.location.href = "/trueme/ware/wareDetail.html?spuId=" + spuId;
                },
            });
        },
        //用户分享成功后回调分享成功
        shareSuccess: function () {
            $.AJAX({
                type: 'post',
                url: config.basePath + 'content/svMakerContent/pushShare',
                data: {
                    shareId: vm.shareId,
                },
                success: function (data) {
                    Popup.miss({title: '分享成功！'});
                    $('#weixinShare').removeClass('show').addClass('hide');
                },
            });
        },
        //------调用微信分享相关功能-----
        weixinShare: function () {
            WeiXinShare({
                title: vm.shareTitle,
                desc: vm.shareDesc,
                link: vm.shareUrl,
                mainUrl: vm.shareMainUrl,
                success: function () {
                    $('#weixinShare').addClass('hide').removeClass('show');
                    vm.shareSuccess();
                    everyPageWeiXinShare({'isnotshareNow':true});
                },
                cancel: function () {
                    $('#weixinShare').addClass('hide').removeClass('show');
                    everyPageWeiXinShare({'isnotshareNow':true});
                },
            });
        },
        //视频操作相关
        videoAboutCaoZuo: function ($event, mainUrl) {
            var winWidth = $(window).width();
            var video = $($event.target).parent().siblings('video')[0];
            $($event.target).parent().addClass('hide').removeClass('show');
            $($event.target).parent().siblings('div.video-con,div.blur').stop().slideUp('fast');
            video.play();
            //监听播放
            video.addEventListener("playing", function (ev) {
                $($event.target).parent().siblings('div.video-con,div.blur').stop().slideUp('fast');
                $($event.target).parent().addClass('hide').removeClass('show');
                $(video).addClass('show').removeClass('hide');
                $(video).css({"backgroundImage": "", "backgroundColor": "#000"});
                var headerHeight = $('#header-nav').height();
                var footerHeight = $('div.fixed-bar').height();
                var videoHeight = $(video).height();
                var winHeight = $(window).height();
                //浏览器滚动时监听
                $(window).on('scroll', function () {
                    var winScrollTop = $(window).scrollTop();
                    var videoScrollTop = $(video).offset().top;
                    if ((videoScrollTop + videoHeight - headerHeight) < winScrollTop || videoScrollTop > (winScrollTop + winHeight - footerHeight)) {
                        video.pause();
                    };
                });
            });
            //监听暂停
            video.addEventListener("pause", function (ev) {
                $($event.target).parent().siblings('div.video-con,div.blur').stop().slideDown('fast');
                $($event.target).parent().addClass('show').removeClass('hide');
                $(video).addClass('hide').removeClass('show');
                $(video).css({"backgroundImage": "url(" + mainUrl + ")"})
            });
            //拖动中执行
            video.addEventListener("seeking", function (ev) {
                $($event.target).parent().siblings('div.video-con,div.blur').stop().hide();
                $($event.target).parent().addClass('hide').removeClass('show');
                $(video).addClass('show').removeClass('hide');
                $(video).css({"backgroundImage": "", "backgroundColor": "#000"});
            });
        },
    },
});
