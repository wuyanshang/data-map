process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../config/webpack.config');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = parseInt(process.env.PORT, 10) || 3000;

const compiler = webpack(config);

const devServerOptions = {
  contentBase: config.devServer.contentBase,
  hot: true,
  host: HOST,
  port: PORT,
  open: true,
  historyApiFallback: true,
  compress: true,
  stats: 'minimal',
  clientLogLevel: 'warning',
  overlay: {
    warnings: false,
    errors: true
  },
  publicPath: config.output.publicPath,
  quiet: false,
  watchOptions: {
    ignored: /node_modules/
  }
};

const server = new WebpackDevServer(compiler, devServerOptions);

server.listen(PORT, HOST, err => {
  if (err) {
    return console.log(err);
  }
  console.log('\nStarting the development server...\n');
  console.log(`Server running at http://localhost:${PORT}\n`);
});
