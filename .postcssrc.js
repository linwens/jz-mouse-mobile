// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: {
    'autoprefixer': {
      // browsers: ['Android >= 4.0', 'iOS >= 8']
      overrideBrowserslist: [ // 覆盖browserslistrc的配置
        "Android >= 4.0",
        "iOS >= 8",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8"
      ]
    },
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
};
