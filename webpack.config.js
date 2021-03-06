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
	mode: 'production', //模式： development || production
	entry: './src/index.js', //入口
	devtool: 'source-map', //单独生成一个source-map文件，出错了会标识出当前错误的列和行
	output: {
		filename: 'bundle.[hash:8].js', //打包后的文件名
		path: path.resolve(__dirname, 'dist'), //路径必须是一个绝对路径
		// publicPath: 'pokemonfan7.com'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
			hash: true
		}),
		new MiniCssExtractPlugin({
			filename: 'css/main.css'
		})
	],
	module: {
		rules: [
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