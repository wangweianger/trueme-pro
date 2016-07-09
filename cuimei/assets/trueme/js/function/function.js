/****************************************************定义函数*******************************************************************/
/*方法汇总
  getWeiXinCode -- 获取微信code
  cerateFileFormData -- FormData 上传文件函数
  signlili -- 接口签名
  signwx -- 微信接口签名
  centerData --  平台费用说明函数
  getUserInformation -- 获取用户基本信息
  autoLogin -- 用户自动登录
  getQiNiuUpToken -- 获取七牛云凭证
  uploaderFileForQiNiu -- 七牛上传文件
  downUrlByKeyForQiNiu -- 获取七牛图片路径
  getArrkeysForDatas -- 根据某个数组值获得数组数据
  getApplyorderInform -- 获取学员报名订单信息
  interIosForIframe -- 新建iframe,并赋src
  getMsgTime      --短信定时器
  getUserInfor    --获取用户信息
  collection        --收藏商品
  deteleOrder    --删除订单
  cancelOrder    --取消订单
  scrollGetData  --页面滚动加载更多数据
*/

window.trueme = {
    w: {
        //获取微信code
        getWeiXinCode: function() {
            /*微信支付前端流程*/
            if (IsWeiXin) {
                var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3c8059fedebed664&redirect_uri=' + encodeURIComponent(config.redirect_uri) + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
                sessionStorage.setItem("state-url", url);
                window.location.href = url;
            } else {
                Popup.alert({ type: 'msg', style: 'width:80%', title: '请在微信浏览器内打开!' });
            }
        },

        /*微信签名算法*/
        signwx: function(json, string) {
            var wxkey = string || "f32ad5e73435181bed9e5cbbd3a0e9e8";
            /*对json的key值排序 */
            var arr = [];
            var sortJson = {};
            var newJson = json;
            for (var key in json) {
                if (json[key]) {
                    arr.push(key);
                }
            }
            arr.sort(function(a, b) {
                return a.localeCompare(b);
            });
            for (var i = 0, len = arr.length; i < len; i++) {
                sortJson[arr[i]] = json[arr[i]]
            }
            /*拼接json为key=val形式*/
            var str = "";
            for (var key in sortJson) {
                str += key + "=" + sortJson[key] + '&';
            }
            str += 'key=' + wxkey;
            /*md5*/
            var md5Str = hex_md5(str);
            var signstr = md5Str.toUpperCase();
            /*获得有sign参数的json*/
            newJson['paySign'] = signstr;
            return newJson;
        },

        /*根据某个数组值获得数组数据*/
        getArrkeysForDatas: function(json) {
            var newArr = [];
            for (var i = 0, len = json.datas.length; i < len; i++) {
                for (var j = 0, lenj = json.keyarr.length; j < lenj; j++) {
                    if (json.datas[i][json.key] == json.keyarr[j]) {
                        newArr.push(json.datas[i]);
                    };
                }
            }
            return newArr;
        },

        //新建iframe 并赋src
        interIosForIframe: function(src) {
            if ($('#clickOnIos').length) {
                $('#clickOnIos').attr('src', src)
            } else {
                $('body').append('<iframe id="clickOnIos" src=' + src + ' class="hide"></iframe>');
            }
        },

        /* 短信定时器
          nowTime vue.js 初始数据  当前时间
          getMsgText vue.js 初始数据  当前的提示文字
        */
        getMsgTime: function(obj, fn) {
            var This = obj;
            This.nowTime = config.msgTime;
            var timer = setInterval(function() {
                This.nowTime--;
                This.getMsgText = This.nowTime + ' S后重发';
                //时间走完时执行
                if (This.nowTime <= 0) {
                    clearInterval(timer);
                    This.getMsgText = "重新获取";
                    fn();
                }
            }, 1000);
        }, //end

        /* 页面滚动加载数据
        lastObj   : 最底部的列表元素
        bottomTop ：距离底部的高度
        nowNum    :  当前加载数据的条数
        totalNum:总数据的条数
        callback  ：回调函数
        //调用案例
        trueme.w.scrollGetData({
            lastObj:$('#lastdiv'),
            callback:function(){    
                console.log("00")
                config.scrollbegin=true; 
            }
        });
        */
        scrollGetData: function(json) {
            $(window).on('scroll',function(){
                // console.log((json.lastObj.offset().top-$(window).height())-$(window).scrollTop()+'----'+(json.bottomTop || config.bottomTop))
                if ((json.lastObj.offset().top-$(window).height())-$(window).scrollTop()<(json.bottomTop || config.bottomTop)) {    
                    if (config.scrollbegin) {
                        json.callback();
                        config.scrollbegin = false;
                    }
                }
            });
        },

        //取消订单
        cancelOrder: function(json) {
            $.AJAX({
                type: 'post',
                url: config.basePath + 'order/svorder/cancleorder',
                data: {
                    "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
                    "orderId": json.orderId, //'P160519201459101012',//getQueryString('payOrderNo')
                },
                success: function(data) {
                    Popup.miss({ title: "取消订单成功！" });
                    json.success(data);
                },
            });
        },

        //删除订单
        deteleOrder: function(json) {
            $.AJAX({
                type: 'post',
                url: config.basePath + 'order/svorder/delorder',
                data: {
                    "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
                    "orderId": json.orderId,
                },
                success: function(data) {
                    json.success(data);
                    Popup.miss({ title: '删除订单成功!' });
                },
            });
        },

        //获取用户信息
        getUserInfor: function(json) {
            $.AJAX({
                type: 'post',
                url: config.basePath + 'user/svIsBindPhone',
                data: {},
                success: function(data) {
                    json.success(data);
                },
            });
        },

        /*收藏商品
        userId 用户名id
        spuId 商品spuId
        success 成功后执行的函数
        */
        collection: function(json) {
            $.AJAX({
                type: 'post',
                url: config.basePath + 'user/svUserProductCollect',
                data: {
                    userId: json.userId,
                    spuId: json.spuId,
                },
                success: function(data) {
                    // Popup.miss({title:'收藏成功！'}); 
                    if (json.success) {
                        json.success(data);
                    };
                },
            });
        },
    },



};
