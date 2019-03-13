// webpack是node写出来的，node的写法

let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
console.log(path.resolve('dist'))
module.exports = {
	mode: 'development', //模式： development || production
	entry: './src/index.js', //入口
	output: {
		filename: 'bundle.[hash:8].js', //打包后的文件名
		path: path.resolve(__dirname, 'dist'), //路径必须是一个绝对路径
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
			hash: true
		}),
		new MiniCssExtractPlugin({
			filename: 'main.css'
		})
	],
	module: {
		rules: [
			// {
			// 	test: /\.js$/,
			// 	use: {
			// 		loader: 'eslint-loader',
			// 		options: {
			// 			enforce: 'pre' //前置
			// 		}
			// 	},
			// },
			// {
			// 	test: /\.(png|jpg|gif)$/,
			// 	use: {
			// 		loader: 'file-loader'
			// 	}
			// },
			{
				test: /\.(png|jpg|gif)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 200*1024
					}
				}
			},
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: { //用babel把es6转换为es5
						presets: [
							'@babel/preset-env'
						]
					}
				},
				include: path.resolve(__dirname, 'src'),
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader'
				]
			}
		]
	}
}