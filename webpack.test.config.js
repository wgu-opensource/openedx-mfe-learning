const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Compiles scss files into one css file for embedding in tests

module.exports = {
  context: __dirname,
  target: 'web',
  entry: './src/index.scss',
  output: {
    path: `${__dirname}/dist`,
    filename: 'styles.js',
  },
  module: {
    rules: [
      {
        test: /(.scss|.css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              sourceMap: true,
              modules: {
                compileType: 'icss',
              },
            },
          },
          'resolve-url-loader',
          {
            loader: 'sass-loader', // compiles Sass to CSS
            options: {
              sourceMap: true,
              sassOptions: {
                includePaths: [
                  path.join(process.cwd(), 'node_modules'),
                  path.join(process.cwd(), 'src'),
                ],
                // silences compiler warnings regarding deprecation warnings
                quietDeps: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: 'styles.css' })],

};
