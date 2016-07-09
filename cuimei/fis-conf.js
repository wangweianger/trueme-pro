/*
FIS3配置功能项说明
1.css，js,img 压缩
2.静态文件hush MD5加密
3.CssSprite图片合并   
4.自动刷新浏览器
5.include 文件定位
*/

//js压缩 fis-optimizer-uglify-js 插件进行压缩，已内置
fis.match('*.js', {
  optimizer: fis.plugin('uglify-js')
});

// 图片压缩 fis-optimizer-png-compressor 插件进行压缩，已内置
fis.match('*.png', {
  optimizer: fis.plugin('png-compressor')
});

//添加hush MD5加密
fis.match('*.{js,css,png,jpg}', {
  useHash: true
});

//css压缩 fis-optimizer-clean-css 插件进行压缩，已内置
fis.match('*.css', {
  optimizer: fis.plugin('clean-css'),
  useSprite: false //图片合并 给匹配到的文件分配属性 `useSprite`
});

// 启用 fis-spriter-csssprites 插件
// fis.match('::package', {
//   spriter: fis.plugin('csssprites'),
//   //静态资源前端加载器
//   postpackager: fis.plugin('loader', {
//     allInOne: true
//   })
// })

//开发版本时不需要对文件进行压缩    启用方式 fis3 release debug
fis.media('debug').match('*.{js,css,png,jpg}', {
  useHash: false,
  useSprite: true,
  optimizer: null
});





















