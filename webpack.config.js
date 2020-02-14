module.exports = [{
  entry: './js/ScatterplotPorsches.js',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: __dirname + '/public/js',
    publicPath: '/',
    filename: 'ScatterplotPorsches.js'
  },
  mode: 'development'
},
{
  entry: './js/StackedAreaLastFm.js',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: __dirname + '/public/js',
    publicPath: '/',
    filename: 'StackedAreaLastFm.js'
  },
  mode: 'development',
  // target: 'node'
}
]