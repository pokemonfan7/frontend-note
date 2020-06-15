## 前端点击按钮下载图片
a标签的href赋值为图片地址，只能起到预览的效果不能下载到本地，所以要用到canvas.drawImage的方法将地址转化成base64格式，然后赋值给a标签后再点击  
```javascript
// 参数src为图片地址，name为下载时图片的名称
  downloadIamge (src, name) {
    var image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      var context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, image.width, image.height);
      var url = canvas.toDataURL("image/png");

      // 生成一个a元素
      var a = document.createElement("a");
      // 创建一个单击事件
      var event = new MouseEvent("click");

      // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
      a.download = name || "下载图片名称";
      // 将生成的URL设置为a.href属性
      a.href = url;

      // 触发a的单击事件
      a.dispatchEvent(event);
    };

    image.src = src;
  }
```
但是chorme浏览器下载图片时，有的图片，由于base64格式的图片太大，赋值给a标签点击时，会出现网络错误的情况，因此要将图片压缩后返回的base64赋值给a标签  
```javascript
// base64转成blob对象
  function dataURLtoBlob (dataurl) {
      const arr = dataurl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
    // blob对象转成base64
  function blobToDataURL (blob, fn) {
      const a = new FileReader();
      a.readAsDataURL(blob); // 读取文件保存在result中
      a.onload = function (e) {
        const getRes = e.target.result; // 读取的结果在result中
        fn(getRes);
      };
    }

  // 压缩图片
  function compress (fileParam, fn) {
    // 判断浏览器是否支持blob,不支持就做兼容处理
    if (!HTMLCanvasElement.prototype.toBlob) {
      console.log("不支持toBlob");
      Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
        value: function (callback, type, quality) {
          const dataURL = this.toDataURL(type, quality).split(",")[1];
          setTimeout(function () {
            const binStr = atob(dataURL);
            const len = binStr.length;
            const arr = new Uint8Array(len);

            for (let i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i);
            }

            callback(new Blob([arr], { type: type || "image/png" }));
          });
        }
      });
    }
    let file = fileParam;

    // 如果传入的fileParam参数是base64格式的图片, 则先转化成为file对象
    if (
      Object.prototype.toString.call(file) !== "[object Blob]" &&
      Object.prototype.toString.call(file) !== "[object File]" &&
      file.startsWith("data:image")
    ) {
      file = dataURLtoBlob(file);
    }

    const img = new Image();
    // 创建读取文件对象
    const render = new FileReader();

    // 准备画图
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (file.type.indexOf("image") !== -1) {
      // 读取file文件,得到的结果为base64位
      render.readAsDataURL(file);
    }

    render.onload = function (result) {
      // 把读取到的base64图片设置给img的src属性
      const src = render.result;
      img.src = src;
    };

    img.onload = function () {
      // 加载完毕后获取图片的原始尺寸
      /*eslint-disable */
      const origin_width = this.width;
      const origin_height = this.height;
      // 设置最大允许宽高,根据需求自己设置,值越大,图片大小越大
      const max_width = 400;
      const max_height = 400;

      // 最终宽高
      let imgWidth = origin_width;
      let imgHeight = origin_height;
      if (origin_width > max_width || origin_height > max_height) {
        if (origin_width / origin_height > max_width / max_height) {
          // 更宽，按照宽度限定尺寸
          imgWidth = max_width;
          imgHeight = Math.round(max_width * (origin_height / origin_width));
        } else {
          imgHeight = max_height;
          imgWidth = Math.round(max_height * (origin_width / origin_height));
        }
      }
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      context.drawImage(this, 0, 0, imgWidth, imgHeight);
      // // 绘画到画布上
      // context.drawImage(img, 0, 0, imgWidth, imgHeight);
      // 此处得到的是blob对象,blob对象是在ie10及以上才兼容,在ios8_1_1上和iphoneSE上有兼容问题
      canvas.toBlob(function(result) {
        blobToDataURL(result, fn);
      }, "image/png");
    };
  }
```
在compress的会fn回调中可以拿到压缩后的base64格式的图片，然后传入downloadIamge的src  
```javascript
compress(file, res => {
    downloadIamge(res, '图片名称')
})
```

## VUE变化检测
observer类：将一个正常的`object`转换成可观测的`object`，转化成响应式

在`defineReactive`中当传入的属性值还是一个`object`时使用`new observer（val）`来递归子属性，这样就可以把`obj`中的所有属性（包括子属性）都转换成`getter/seter`的形式来侦测变化。 也就是说，只要我们将一个`object`传到`observer`中，那么这个`object`就会变成可观测的、响应式的`object`。

Dep类：依赖管理器，在getter中收集依赖，在setter中通知依赖更新  

Watcher类：谁用到了数据，谁就是依赖，我们就为谁创建一个Watcher实例。在之后数据变化时，我们不直接去通知依赖更新，而是通知依赖对应的Watch实例，由Watcher实例去通知真正的视图（通过调用Watcher实例的update方法实现）。  

Watcher先把自己设置到全局唯一的指定位置（window.target），然后读取数据。因为读取了数据，所以会触发这个数据的getter。接着，在getter中就会从全局唯一的那个位置读取当前正在读取数据的Watcher，并把这个watcher收集到Dep中去。收集好之后，当数据发生变化时，会向Dep中的每个Watcher发送通知。通过这样的方式，Watcher可以主动去订阅任意一个数据的变化。  

整个流程：  
1. Data通过observer转换成了getter/setter的形式来追踪变化。
2. 当外界通过Watcher读取数据时，会触发getter从而将Watcher添加到依赖管理器Dep中。
3. 当数据发生了变化时，会触发setter，从而向Dep中的依赖（即Watcher）发送通知。
4. Watcher接收到通知后，会向外界发送通知，变化通知到外界后可能会触发视图更新，也有可能触发用户的某个回调函数等。

数组：  
改写push,pop,shift,unshift,splice,sort,reverse等数组方法

无法检测到的操作：
对象：  
添加一对新的key/value或删除一对已有的key/value  

数组：  
通过数组下标修改数组中的数据  
通过修改数组长度清空数组  

## 图片懒加载
使用新api：IntersectionObserver
```javascript
// angular
import { isPlatformBrowser } from '@angular/common'
import { Directive, ElementRef, Inject, Input, NgZone, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core'

@Directive({
    selector: '[lazyloadImage]'
})
export class LazyloadImageDirective implements OnInit, OnDestroy {
    @Input() intersectionObserverConfig: IntersectionObserverInit

    intersectionObserver: IntersectionObserver
    htmlElement: HTMLElement

    constructor(
      private elementRef: ElementRef,
      private renderer: Renderer2,
      private ngZone: NgZone,
      @Inject(PLATFORM_ID) private platformId
    ) {
        this.htmlElement = this.elementRef.nativeElement
    }

    ngOnInit() {
        if (!this.isBrowser()) {
            return
        }
        this.ngZone.runOutsideAngular(() => this.init())
    }

    init() {
        this.registerIntersectionObserver()

        this.observeDOMChanges(this.htmlElement, () => {
            const imagesFoundInDOM = this.getAllImagesToLazyLoad(this.htmlElement)
            imagesFoundInDOM.forEach((image: HTMLElement) => this.intersectionObserver.observe(image))
        })
    }

    registerIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver(
          images => images.forEach(image => this.onIntersectionChange(image)),
          this.intersectionObserverConfig instanceof Object ? this.intersectionObserverConfig : undefined
        )
    }

    onIntersectionChange(image) {
        if (!image.isIntersecting) {
            return
        }

        this.onImageAppearsInViewport(image.target)
    }

    observeDOMChanges(htmlElement: HTMLElement, onChange: Function) {
        // Create a Mutation Observer instance
        const observer = new MutationObserver(() => {
            onChange()
        })

        // Observer Configuration
        const observerConfig = {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true
        }

        // Observe Directive DOM Node
        observer.observe(htmlElement, observerConfig)
    }

    getAllImagesToLazyLoad(pageNode: HTMLElement) {
        return Array.from(pageNode.querySelectorAll('img[data-src], [data-srcset], [data-background-src]'))
    }

    ngOnDestroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect()
        }
    }

    isBrowser(): boolean {
        return isPlatformBrowser(this.platformId)
    }

    onImageAppearsInViewport(image) {
        if (image.dataset.src) {
            this.renderer.setAttribute(image, 'src', image.dataset.src)
            this.renderer.removeAttribute(image, 'data-src')
        }

        if (image.dataset.srcset) {
            this.renderer.setAttribute(image, 'srcset', image.dataset.srcset)
            this.renderer.removeAttribute(image, 'data-srcset')
        }

        if (image.dataset.backgroundSrc) {
            this.renderer.setStyle(image, 'background-image', `url(${image.dataset.backgroundSrc})`)
            this.renderer.removeAttribute(image, 'data-background-src')
        }

        // Stop observing the current target
        if (this.intersectionObserver) {
            this.intersectionObserver.unobserve(image)
        }
    }

}

```

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
