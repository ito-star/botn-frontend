const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    hot: true,
    open: true,
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.serverApplicationRootUrl': JSON.stringify('http://localhost:5000/'),
      'process.env.GoogleOauthClientId': JSON.stringify(
        '484865881567-rd5535pac2i2gcvdtn9ab51vtpitbl6l.apps.googleusercontent.com'
      ),
    }),
  ],
}
