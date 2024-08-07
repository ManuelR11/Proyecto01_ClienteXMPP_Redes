const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

const path = require('path');

module.exports = {
  entry: './src/index.js',

  mode: 'development',

  output: {
    path: path.join(__dirname, '/dist_react'),
    filename: '[name].bundle.js'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'imagenes/'
        }
      },
      {
        test: /\.(mp4|mp3)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'media/'
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a <style> tag
            loader: 'style-loader'
          },
          {
            // Interprets @import and url() like import/require() and will resolve them
            loader: 'css-loader'
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                syntax: 'postcss-scss',
                plugins: () => [
                  autoprefixer
                ]
              }
            }
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader'
          }
        ]
      }
    ],
  },
};
