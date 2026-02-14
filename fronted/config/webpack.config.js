const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths');

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
  entry: paths.appIndexJs,
  output: {
    path: paths.appBuild,
    filename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].js'
      : isEnvDevelopment && 'static/js/bundle.js',
    publicPath: '/',
  },
  devtool: isEnvProduction ? 'source-map' : isEnvDevelopment && 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              ['import', { libraryName: 'antd', style: 'css' }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.appSrc
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    isEnvProduction && new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
    }),
  ].filter(Boolean),
  devServer: {
    contentBase: paths.appPublic,
    hot: true,
    port: 3000,
    open: true,
    historyApiFallback: true,
    compress: true,
    stats: 'minimal',
    clientLogLevel: 'warning',
    overlay: {
      warnings: false,
      errors: true
    }
  },
  performance: {
    hints: false
  }
};
