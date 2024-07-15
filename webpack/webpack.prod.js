const webpack = require('webpack')

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.serverApplicationRootUrl': JSON.stringify('https://api.backofthenap.com/'),
      'process.env.GoogleOauthClientId': JSON.stringify(
        '484865881567-rd5535pac2i2gcvdtn9ab51vtpitbl6l.apps.googleusercontent.com'
      ),
    }),
  ],
}
