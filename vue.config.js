const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  parallel: false,
  outputDir: './dist',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    port: 9527,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: '<url>',
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_API}`]: `/${process.env.VUE_APP_BASE_API}`,
        },
      },
    },
  },
  chainWebpack(config) {
    // set svg-sprite-loader涉及svg转icon
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();
  },
};
