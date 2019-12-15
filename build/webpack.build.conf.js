const merge = require('webpack-merge'),
baseWebpackConfig = require('./webpack.base.conf.js'),
buildWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  plugins: []
});

module.exports = new Promise((resolve, reject) => {
  resolve(buildWebpackConfig);
});