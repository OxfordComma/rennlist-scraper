// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// var nodeExternals = require('webpack-node-externals');

module.exports = [{
	watch: true,
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
},{
	watch: true,
	entry: './js/react/DisplayPorsche.js',
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
		filename: 'DisplayPorsche.js'
	},
	mode: 'development'
},{
	watch: true,
	entry: './js/react/Dashboard.js',
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
		filename: 'Dashboard.js'
	},
	mode: 'development'
}
]