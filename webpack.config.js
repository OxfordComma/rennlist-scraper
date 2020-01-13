module.exports = [{
  entry: './js/ScatterplotMain.js',
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
    filename: 'ScatterplotMain.js'
  },
  mode: 'development'
},
// {
//   entry: './js/UsernameInput.js',
//   module: {
//     rules: [
//       {
//         test: /\.(js)$/,
//         exclude: /node_modules/,
//         use: ['babel-loader', 'eslint-loader']
//       }
//     ]
//   },
//   resolve: {
//     extensions: ['*', '.js']
//   },
//   output: {
//     path: __dirname + '/public/js',
//     publicPath: '/',
//     filename: 'UsernameInput.js'
//   },
//   mode: 'development'
// },
// {
//   entry: './js/997.js',
//   module: {
//     rules: [
//       {
//         test: /\.(js)$/,
//         exclude: /node_modules/,
//         use: ['babel-loader', 'eslint-loader']
//       }
//     ]
//   },
//   resolve: {
//     extensions: ['*', '.js']
//   },
//   output: {
//     path: __dirname + '/public',
//     publicPath: '/',
//     filename: '997.js'
//   },
//   mode: 'development'
// }, 
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
  mode: 'development'
}
]