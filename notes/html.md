## html加载顺序
- js会阻塞后续dom和资源的加载  
原因：GUI渲染线程与JS引擎线程是互斥的，当JS引擎执行时GUI线程会被挂起，GUI更新会被保存在一个队列中等到JS引擎空闲时立即被执行。
- css的下载不会阻塞后面js的下载，但是js下载完成后，被阻塞执行

## 浏览器会使用prefetch对引用的资源提前下载
1. 没有`defer`或`async`，浏览器会立即加载并执行指定的脚本
2. 有`async`，加载和渲染后续文档元素的过程将和`script.js`的加载与执行并行进行(下载异步，执行同步，加载完就执行)。
3. 有`defer`，加载后续文档元素的过程将和`script.js`的加载并行进行（异步），但是`script.js`的执行要在所有元素解析完成之后，`DOMContentLoaded`事件触发之前完成。

## viewport
### viewport详解
- layoutviewport: 大于实际屏幕，元素的宽度继承于 `layoutviewport`，用于保证网站的外观特性与桌面浏览器一样。
`layoutviewport`到底多宽，每个浏览器不同。iPhone 的 safari 为 980px，通过 document.documentElement.clientWidth 获取。
- visualviewport: 当前显示在屏幕上的页面，即浏览器可视区域的宽度。
- idealviewport: 为浏览器定义的可完美适配移动端的理想 viewport，固定不变，可以认为是设备视口宽度。比如 iphone 7 为 375px, iphone 7p 为 414px。

### viewport设置
`<meta name='viewport' content='width=device-width,initial-scale=1,user-scale=no' />`
通过对 meta 标签三个 viewport 的设置，最终使页面完美展示。下面详细的阐释其具体含义:
- width 设置的是 layoutviewport 的宽度
- initial-scale 设置页面的初始缩放值，并且这个初始缩放值是相对于 idealviewport 缩放的，最终得到的结果不仅会决定 visualviewport，还会影响到 layoutviewport
- user-scalable 是否允许用户进行缩放的设置

对上面的说明通过公式推导进行进一步的解释：
```javascript
// 设定两个变量：
viewport_1 = width;
viewport_2 = idealviewport / initial-scale;

// 则：
layoutviewport = max{viewport_1, viewport_2};
visualviewport = viewport_2;
```
只要 layoutviewport === visualviewport，页面下面不会出现滚动条，默认只是把页面放大或缩小。

### 设备像素比dpr与1px物理像素
#### 物理像素(physical pixel)
设备的像素，手机屏幕上显示的最小单元，该最小单元具有颜色及亮度的属性可供设置，

#### 密度独立像素(density-indenpendent pixel)
像素的抽象，供应用程序使用，然后基础系统转换到物理像素，css中设置的像素指的就是该像素。

#### 设备像素比(device pixel ratio)
设备像素比(dpr) = 物理像素/设备独立像素
`iphone 6、7、8`的`dpr`为2，css设置1px，手机中显示为2px（2个物理像素），这就是 1px 在 retina 屏上变粗的原因。

#### 1px的物理像素解决方案
从第一部分的讨论可知 viewport 的 initial-scale 具有缩放页面的效果。
对于 dpr=2 的屏幕，1px压缩一半便可与1px的设备像素比匹配，这就可以通过将缩放比 initial-scale 设置为 0.5=1/2 而实现。
以此类推 dpr=3的屏幕可以将 initial-scale设置为 0.33=1/3 来实现。

### 设备像素比dpr与rem的适配方案
#### rem设置
`rem`是相对于根元素`html`的`font-size`来做计算。通常在页面初始化时加载时通过对`document.documentElement.style.fontSize`设置来实现。

#### rem适配规则
通过对`initial-scale = 1/dpr`的设置，已将对屏幕的描述从物理像素转化到了密度独立像素上了，这将是后续推导的基础，且设计稿为 750px。
屏幕等分10份，rem设定方式:
`document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';`

下面我们将`750px`下，`1rem`代表的像素值用`baseFont`表示，则在`baseFont = 75`的情况下，是分成`10`等份的。因此可以将上面的公式通用话一些：
`document.documentElement.style.fontSize = document.documentElement.clientWidth / ( 750 / 75 ) + 'px';`

整体代码:
```javascript
(function (baseFontSize) {
    const _baseFontSize = baseFontSize || 75;
    const ua = navigator.userAgent;
    const matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
    const isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
    const dpr = window.devicePixelRatio || 1;
    if (!isIos && !(matches && matches[1] > 534)) {
        // 如果非iOS, 非Android4.3以上, dpr设为1;
        dpr = 1;
    }
    const scale = 1 / dpr;
    const metaEl = document.querySelector('meta[name="viewport"]');
    if (!metaEl) {
        metaEl = document.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        window.document.head.appendChild(metaEl);
    }
    metaEl.setAttribute('content', 'width=device-width,user-scalable=no,initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale);

    document.documentElement.style.fontSize = document.documentElement.clientWidth / (750 / _baseFontSize) + 'px';
})();
```
同时为了书写方便可以直接通过 px 布局，然后在打包时利用 pxtorem 库转化为基于 rem 的布局。


