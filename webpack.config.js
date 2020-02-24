const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const {
  BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
console.log('DEVELOPMENT', isDev);

const optimize = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  };
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserPlugin()
    ];
  }
  return config;
};

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions()
  }];

  if (isDev) {
    loaders.push('eslint-loader');
  }
  return loaders;
};

const babelOptions = preset => {
  const options = {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-proposal-class-properties']
  };
  if (preset) {
    options.presets.push(preset);
  }
  return options;
};

const filename = ext => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);
const cssLoaders = cssExtra => {
  const loaders = [{
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      }
    },
    'css-loader',
    'postcss-loader'
  ];
  if (cssExtra) {
    loaders.push(cssExtra);
  }
  return loaders;
};

const webAnalyzer = () => {
  const basePlugins = [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'src/favicon.ico'),
      to: path.resolve(__dirname, 'dist')
    }]),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ]
  if (isProd) {
    basePlugins.push(new BundleAnalyzerPlugin())
  }
  return basePlugins
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './index.jsx'],
    hotspot: './hotSpot.ts'
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.json', '.png', '.css']
  },
  devServer: {
    port: 4220,
    hot: isDev
  },
  devtool: isDev ? 'source-map' : '',
  optimization: optimize(),
  plugins: webAnalyzer(),
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript')
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react')
        }
      },
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: ['file-loader']
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.csv$/,
        use: ['csv-loader']
      }
    ]
  }
};