module.exports = {
  lintOnSave:false,
  devServer: {
    overlay:{
      warning:false,
      errors:false
    },
    proxy: {
      '/api': {
        target: 'https://www.imuster.top/test/api',
        //  target: 'https://www.imuster.top:10900/api',
        secure: true, // false为http访问，true为https访问
        changeOrigin: true, // 跨域访问设置，true代表跨域
        ws: true,   //  如果要代理 websockets，配置这个参数
        pathRewrite: { // 路径改写规则
          '^/api': '' // 以/proxy/为开头的改写为''
        }
      }
    }
  }
}