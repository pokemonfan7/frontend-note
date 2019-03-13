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

## 插件
- html-webpack-plugin 将打包的js文件引入html
- mini-css-extract-plugin 将css抽离成单独文件
- clean-webpack-plugin 删除dist之后再打包生成新的dist
- copy-webpack-plugin