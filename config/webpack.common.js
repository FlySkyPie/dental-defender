const path = require('path');

module.exports = {
  entry: path.join(__dirname, '../src/main.ts'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '../public/js'),
    publicPath:'./public'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
};