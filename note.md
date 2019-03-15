## 安装webpack
- 安装本地的webpack
- webpack webpack-cli -D
### 步骤
1. yarn init -y
2. yarn add webpack webpack-cli -D

## webpack可以进行0配置
- 直接运行`npx webpack`便可进行打包`（src/index.js）`,支持模块化

## 手动配置webpack
- 默认配置文件的名字`webpack.config.js`,若是想使用其他名字的配置文件打包,可使用`npx webpack --config my-config.js`

## webpack-dev-server
以localhost本地服务启动的方式访问文件

## loader
loader的顺序是从右往左

- style-loader:负责把css插入html中
- css-loader:负责解析@import这样的语法

### 自动加前缀
安装 postcss-loader autoprefixer
需要配置文件postcss.config.js
postcss-loader需在css-loader前执行

### 压缩css
在npmjs.com搜索mini-css-extract-plugin查看文档

##babel
es6语法转化为es5
安装 babel-loader @babel/core @babel/preset-env

类、装饰器等语法需要额外的插件进行转换，查询网址babeljs.io:
类: @babel/plugin-proposal-class-properties
装饰器: @babel/plugin-proposal-decorators

@babel/plugin-transform-runtime -D
@babel/runtime (不加-D)
@babel/polyfill (不加-D)

## eslint
eslint.org
yarn add eslint eslint-loader

## expose-loader
暴露全局的loader, 例如jquery, 访问window.$

## file-loader
处理图片

## url-loader
当我们的图片小于多少K的时候，用base64转换,否则用file-loader

## 多入口webpack.config.js
```javascript
let path = require('path')
module.exports  = {
	mode: 'development',
	entry: {
		home: './src/index.js',
		other: './src/other.js',
	},
	output: {
		// [name] home other
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html',
			filename: 'home.html',
			chunks: ['home']
		}),
		new HtmlWebpackPlugin({
			template: './index.html',
			filename: 'other.html',
			chunks: ['home', 'other']
		})
	]
}
```


## devtool
1. source-map: 增加映射文件，用于调试源代码
2. eval-source-map: 不会产生单独的文件
3. cheap-module-source-map: 不会产生列，但是是一个单独的映射文件
4. cheap-module-eval-source-map: 不会产生文件，集成在打包后的文件中 不会产生列

## watch
实时监控打包文件
```
watchOptions: { //监控选项
	poll: 1000, //每秒问我1000次
	aggregateTimeout: 500, //防抖
	ignored: /node_modules/ //不需要监控的文件
}
```

## 插件
- html-webpack-plugin 将打包的js文件引入html
- mini-css-extract-plugin 将css抽离成单独文件
- clean-webpack-plugin 删除dist之后再打包生成新的dist
- copy-webpack-plugin 将一些静态的资源文件放入打包后的文件中
- webpack: banner-plugin 在打包好的js文件中添加注释
- webpack: define-plugin 定义环境变量，例如定义一个变量来区分dev和pro

## 跨域
```
devServer: {
	proxy: {
		'/api': {
			target: 'localhost:3000',
			pathRewrite: {'/api': ''}
		}
	}
}
```

## resolve
解析第三方包
```
resolve: {
	modules: [path.resolve('node_modules')],
	alias: {
		bootstrap: 'bootstrap/dist/css/bootstrap.css'
	}
}
```

## webpack-merge
合并webpack.base.js、webpack.dev.js、webpack.pro.js

## webpack优化点
```
module.exports = {
	module: {
		noParse: /jquery/, //不去解析jquery中的依赖库
		rules: []
	}
}
```

webpack: ignore-plugin
忽略引入的js文件，例如忽略moment里的语言包

happypack
实现多线程打包

## 代码抽取公共部分
```
module.exports = {
	optimization: {
		splitChunks: { //分隔代码块
			cacheGroups: { //缓存组
				common: { //公共模块
					chunks: 'initial',
					minSize: 0,
					minChunks: 2
				},
				vendor: { //抽离第三方模块
					priority: 1, //权重1
					test: /node_modules/, //
					chunks: 'initial',
                    minSize: 0,
                    minChunks: 2
				]
			}
		}
	}
}
```

## 懒加载使用import()语法，本质上是jsonp

## 热更新
