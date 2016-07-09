if(typeof(T) == "undefined" || !T){
	window.T = {};
}

;!function(a){"use strict";var b="";b=b?b:document.scripts[document.scripts.length-1].src.match(/[\s\S]*\//)[0];var c=document,d="querySelectorAll",e="getElementsByClassName",f=function(a){return c[d](a)};var g={type:0,shade:!0,shadeClose:!0,fixed:!0,anim:!0};var ready={extend:function(a){var b=JSON.parse(JSON.stringify(g));for(var c in a)b[c]=a[c];return b},timer:{},end:{}};var h=0,i=["layermbox"],j=function(a){var b=this;b.config=ready.extend(a),b.view()};j.prototype.view=function(){var a=this,b=a.config,d=c.createElement("div");a.id=d.id=i[0]+h,d.setAttribute("class",i[0]+" "+i[0]+(b.type||0) +" "+b.className||""),d.setAttribute("index",h);var g=function(){var a="object"==typeof b.title;return b.title?'<h3 style="'+(a?b.title[1]:"text-align:center;")+'">'+(a?b.title[0]:b.title)+'</h3>':""}(),j=function(){var a,c=(b.btn||[]).length;return 0!==c&&b.btn?(a='<span type="1">'+b.btn[0]+"</span>",2===c&&(a+='<span type="0">'+b.btn[1]+"</span>"),'<div class="layermbtn">'+a+"</div>"):""}();if(b.fixed||(b.top=b.hasOwnProperty("top")?b.top:100,b.style=b.style||"",b.style+=" top:"+(c.body.scrollTop+b.top)/50+"rem"),2===b.type&&(b.content='<i></i><i class="laymloadtwo"></i><i></i><div>'+(b.content||"")+"</div>"),d.innerHTML=(b.shade?'<div class="laymshade"></div>':"")+'<div class="layermmain" '+(b.fixed?"":'style="position:static;"')+'><div class="section"><div class="layermchild '+(b.type||b.shade?"":"layermborder ")+(b.anim?"layermanim":"")+'" '+(b.style?'style="'+b.style+'"':"")+">"+g+'<div class="layermcont">'+b.content+"</div>"+j+"</div></div></div>",!b.type||2===b.type){var l=c[e](i[0]+b.type),m=l.length;m>=1&&k.close(l[0].getAttribute("index"))}document.body.appendChild(d);var n=a.elem=f("#"+a.id)[0];setTimeout(function(){try{n.className=n.className+" layermshow"}catch(a){return}b.success&&b.success(n)},1),a.index=h++,a.action(b,n)},j.prototype.action=function(a,b){var c=this;if(a.time&&(ready.timer[c.index]=setTimeout(function(){k.close(c.index)},a.time)),a.btn)for(var d=b[e]("layermbtn")[0].children,f=d.length,g=0;f>g;g++)$(d[g]).on('click',function(){var b=this.getAttribute("type");0==b?(a.no&&a.no(),k.close(c.index)):a.yes?a.yes(c.index):k.close(c.index)});if(!a.btn){var s=b[e]('laymshade')[0];s.onclick=function(){k.close(c.index,a.end)};s.ontouchmove=function(){k.close(c.index,a.end)}};a.end&&(ready.end[c.index]=a.end)};function open(a){k.closeAll();var b=new j(a||{});return b.index} var k={v:"1.2",index:h,wait:function(option){option=option||{};option.type=2;open(option);},popup:function(option){option=option||{};option.type=1;open(option);},msg:function(option){option=option||{};open(option);},toast:function(option){option=option||{};option.className=option.className?option.className+" toast-box":"toast-box";option.time = option.time?option.time:2000;open(option);},close:function(a){var b=f("#"+i[0]+a)[0];b&&(b.innerHTML="",c.body.removeChild(b),clearTimeout(ready.timer[a]),delete ready.timer[a],"function"==typeof ready.end[a]&&ready.end[a](),delete ready.end[a])},closeAll:function(){for(var a=c[e](i[0]),b=0,d=a.length;d>b;b++)k.close(a[b].getAttribute("index"))}};"function"==typeof define?define(function(){return k}):a.layer=k}(T);

T.is = {};
// T.is.inApp = (function(){
//     return navigator.userAgent.indexOf('cuimei') >= 0 ? true : false;
// })();
T.is.inWechat = (function(){
    return navigator.userAgent.indexOf('MicroMessenger') >= 0 ? true : false;
})();
T.is.supportWebp = (function(){
    var key = '__webp_available__',
        val = localStorage.getItem(key),
        img = new Image();
    if(val){
        return !!parseInt(val);
    }
 
    img.onload = function(){
        localStorage.setItem(key,1);
        T.is.supportWebp = true;
    }
 
    img.onerror = function(){
        localStorage.setItem(key,0);
        T.is.supportWebp = false;
    }
 
    img.src = 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAsAAAABBxAREYiI/gcAAABWUDggGAAAADABAJ0BKgEAAQABABwlpAADcAD+/gbQAA==';
 
    return false;
})();

T.url = {};
T.url.getParam = function(name, url){
	var reg=new RegExp("(^|&|\\?|#)"+name+"=([^&]*?)(&|#|$)"),
        url=url||location.href,
        tempHash=url.match(/#.*/)?url.match(/#.*/)[0]:"";
 
    url=url.replace(/#.*/,"");
    if(reg.test(tempHash)){
        return decodeURIComponent(tempHash.match(reg)[2]);
    }else if(reg.test(url)){
        return decodeURIComponent(url.match(reg)[2])
    }
    return"";
}
T.url.setParam = function(name,value,url,isHashMode){
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

T.opt = {};
T.opt.lazyload = function(){
	// 七牛地址未知
    // function useWebp(src) {
    //     if (T.is.supportWebp && src.match(/^http:\/\/(cuimei\.qiniucdn|cuimeitest\.qiniudn)\.com/)) {
    //         var pattern = src.match(/(&|\?)(imageView|imageMogr)[12]\/[^&#]+?(?=(&|#|$))/);
    //         if (!!pattern) {             
    //             src = src.replace(pattern[0], pattern[0] + '/format/webp');
    //         }              
    //         else {         
    //             src += src.indexOf('?') < 0 ? '?imageMogr2/format/webp': '&imageMogr2/format/webp';
    //         }              
    //     }                  
    //     return src;        
    // }
    function lazyload() {      
        this.config = {"attrName": "relSrc","nodeName": "img","threshold": 100};
        this.lazyloader = function() {   
            var a = $('img['+this.config.attrName+']'),
                len = a.length,
                node = null;   
            if (len == 0) {    
                $(window).off('scroll',$.proxy(this.lazyloader,this));
                $(window).off('resize',$.proxy(this.lazyloader,this));
                $(document.body).off('touchmove',$.proxy(this.lazyloader,this));
                return;
            }         
            var height = this.config.threshold + $(document.body).scrollTop() + document.documentElement.clientHeight;
            for (var i = 0; i < len; ++i) {   
                node = $(a[i]);
                var nodeTop = M.dom.getPosition(node).top;
                if (height >= nodeTop) { 
                    var src = useWebp(node.attr(this.config.attrName));
                    node.attr("src", src);    
                    node.removeAttr(this.config.attrName);
                }     
            }         
        };            
        this.bindEvent = function() {    
            $(window).on('scroll',$.proxy(this.lazyloader,this));
            $(window).on('resize',$.proxy(this.lazyloader,this));
            $(document.body).on('touchmove',$.proxy(this.lazyloader,this));
        }             
    }                 
                      
    var loader = new lazyload();
    loader.lazyloader();
    loader.bindEvent();
};

T.wechat = {};
T.wechat.setting = function(){

};







