## 图片懒加载
使用新api：IntersectionObserver

## 控制并发请求的个数
```javascript
function sendRequest(urls, max, callback) {
  const len = urls.length;
  let idx = 0;
  let counter = 0;

  function _request() {
    // 有请求，有通道
    while (idx < len && max > 0) {
      max--; // 占用通道
      fetch(urls[idx++]).finally(() => {
        max++; // 释放通道
        counter++;
        if (counter === len) {
          return callback();
        } else {
          _request();
        }
      });
    }
  }
  _request();
}
```

## 微信小程序
```
properties: {
  latest:{
      type:Boolean,
      value:false,
      //当这个值改变时触发，注意，在其中setData改变该值可能引起循环调用
      observer:function(){
        // console.log('111111')
        // this.setData({
        //   latest:this.properties.latest
        // })
      }
}
```

`this.triggerEvent('getuserinfo', '传递参数', {})`触发自定义事件

```javascript
Behavior({
  properties: {
   
  },
  data: {
    
  },

  methods: {
  
  }
})
```
behavior定义继承

缓存数据
`wx.setStorageSync(string key, any data)`

wx:for wx:key
- 当for本身的是一组数字或者字符串，则key可以使用`*this`
- 当for本身为对象时，可以使用对象中不重复的属性复制，该属性的值需为数字或字符串

跳转页面使用
```
wx.navigateTo({
  url: '../../pages/detail/detail?bid='+this.properties.book.id,
})

//page
onload(option){
  console.log(option.bid)
}
```

wxs在wxml中引用，wxs和ES5语法类似

## Electron
```javscript
//main.js
const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let win

function createWindow () {
	// 创建浏览器窗口。
	win = new BrowserWindow({width: 1920, height: 1080})

	// 然后加载应用的 index.html。
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'dist/index.html'),
		protocol: 'file:',
		slashes: true
	}))

	// 打开开发者工具。
	win.webContents.openDevTools()

	// 当 window 被关闭，这个事件会被触发。
	win.on('closed', () => {
		// 取消引用 window 对象，如果你的应用支持多窗口的话，
		// 通常会把多个 window 对象存放在一个数组里面，
		// 与此同时，你应该删除相应的元素。
		win = null
	})
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
	// 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
	// 否则绝大部分应用及其菜单栏会保持激活。
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// 在macOS上，当单击dock图标并且没有其他窗口打开时，
	// 通常在应用程序中重新创建一个窗口。
	if (win === null) {
		createWindow()
	}
})
```
`<base href="./">`
在静态文件路径中加入. eg:`./assets/`

```javascript
//package.json
    "electron": "electron .",
    "electron-build": "ng build --prod && electron .",
    "electron:windows": "ng build --prod && electron-builder build --windows",
    "electron:windows2": "ng build --prod && electron-packager . --platform=win32"
//全局安装 -g `electron`、`electron-packager`或者`electron-builder`(不推荐使用，引用本地文件会出现`Not allowed to load local resource`错误)
//项目依赖 --save-dev
```

## Webpack指南
`https://webpack.docschina.org/guides/`

## Webpack分析打包内容
在`build`时加入`--stats-json`
安装`webpack-bundle-analyzer`
执行命令`"bundle-report": "webpack-bundle-analyzer dist/open-pages/stats.json"`

## 可以输出 Webpack 大小以及相对上次构建更改过的日志插件
`https://github.com/GoogleChromeLabs/size-plugin`
