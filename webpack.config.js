// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// var nodeExternals = require('webpack-node-externals');

module.exports = [{
	// watch: true,
	entry: './js/react/ScatterplotPorsches.js',
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
					// options: {
					// 	presets: ['@babel/preset-env']
					// }
				}
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
}
// ,{
//   entry: './js/react/StackedAreaLastFm.js',
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
//     filename: 'StackedAreaLastFm.js'
//   },
//   mode: 'development',
//   target: 'node'
// }
// ,{
//   entry: './js/react/ArtistTree.js',
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
//     filename: 'ArtistTree.js'
//   },
//   mode: 'development',
	// target: 'node'
// }
// ,{
//   entry: './js/react/ScatterplotCovid.js',
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
//     filename: 'ScatterplotCovid.js'
//   },
//   mode: 'development',
//   // target: 'node'
// }
,{
  entry: './js/react/Gibbstack.js',
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
    filename: 'Gibbstack.js'
  },
  mode: 'development',
  // target: 'node'
}
]