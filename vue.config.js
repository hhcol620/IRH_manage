module.exports = {
  lintOnSave:false,
  devServer: {
    overlay:{
      warning:false,
      errors:false
  },
    proxy: {
      '/api': {
        // target: 'https://easydoc.xyz/mock/pKab1hUJ/',
        // target: 'http://yapi.demo.qunar.com/mock/79824/',
        // target: 'http://106.13.141.241/mock/7/',
        target: 'http://106.13.141.241/mock/7/',
        secure: false, // false为http访问，true为https访问
        changeOrigin: true, // 跨域访问设置，true代表跨域
        ws: true,   //  如果要代理 websockets，配置这个参数
        pathRewrite: { // 路径改写规则
          '^/api': '' // 以/proxy/为开头的改写为''
        }
      }
    }
  }
}