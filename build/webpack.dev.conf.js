const webpack = require('webpack'),
  merge = require('webpack-merge'),
  baseWebpackConfig = require('./webpack.base.conf.js'),
  devWebpackConfig = merge(baseWebpackConfig,
    {
      mode: 'development',
      devtool: 'cheap-module-eval-source-map',
      devServer: {
        port: 8081,
        contentBase: baseWebpackConfig.externals.paths.dist,
        overlay: {
          warnings: true,
          errors: true,
        }
      },
      plugins: [
        new webpack.SourceMapDevToolPlugin({
          filename: '[file].map'
        }),
      ]
    });

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig);
});