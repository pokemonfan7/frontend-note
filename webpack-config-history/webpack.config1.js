// webpack是node写出来的，node的写法

let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
console.log(path.resolve('dist'))
module.exports = {
	devServer: { //开发服务器的配置
		port: 7000,
		progress: true,
		contentBase: './dist',
		compress: true
	},
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
			minify: {
				removeAttributeQuotes: true, //去除引号
				collapseWhitespace: true //压缩成一行代码
			},
			hash: true
		}),
		new MiniCssExtractPlugin({
			filename: 'main.css'
		})
	],
	module: {
		rules: [
			{
				test: /\.css$/, use: [
					// {
					// 	loader: 'style-loader'
					// },
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader'
				]
			}
		]
	}
}