### console.log中的字符替换
`console.log("Object value: %o with string substitution", {string: "str", number: 10});`
将把`%o`替换为后面的对象  
类似的还有：  
- %o / %O - for objects;
- %d / %i - for integers;
- %s - for strings;
- %f - for floating-point numbers;

### console.group
```javascript
console.group();
console.log("Inside 1st group");
console.group();
console.log("Inside 2nd group");
console.groupEnd();
console.groupEnd();
console.log("Outer scope");
```

### console信息分组
```javascript
console.warn('黄色感叹号');
console.error('红色报错');
console.info('分组到info');
console.debug('分组到debug');
```

### console.count计数
```javascript
console.count(); // default: 1
console.count(); // default: 2
console.count(); // default: 3
console.countReset();
console.count(); // default: 1
```

### console.table
`console.table([[0,1,2,3,4], [5,6,7,8,9]]);`  
以列表的形式输出数组、类数组对象、对象,当列太多的时候，使用第二个参数，传入你想要展示的列对应的名字

### console.dir
输出DOM节点等

### console.time
查看代码执行时间，例如异步时间，可传入参数来记录多个间隔，例如:console.time('total')、console.timeEnd('total')

### 给你的 console.log 加上 css 样式
给你的打印文本加上 %c 然后 console.log 的第二个参数变成了... css 规则！  
你可以利用这一点让你的日志脱颖而出(例如 Facebook在你打开 console的时候所做的一样)  
`console.log('%ctext', 'color:green; background: yellow; font-size: 30px;')`

### $0
在Chrome的Elements面板中，$0关联到当前我们选中的html节点。

理所当然，$1 是我们上一次选择的节点，$2是在那之前选择的节点，等等。一直到 $4

你可以用以上的补充参考来尝试一些相关的操作(例子: $1.appendChild($0))

### $和$$
在你还没有在app中定义 $变量的情况下(例如 jQuery)，$在console中是冗长的函数document.querySelector的一个别名。

但是$$ 能节省更多的时间，因为它不仅仅执行document.QuerySelectorAll并且返回的是一个节点的数组，而不是一个Node list

从本质上说:Array.from(document.querySelectorAll('div')) === $$('div'),但是$$('div')要简短太多了！

### $!
在`Console Importer`的`Chrome`插件的帮助之下，你可以快速的在console中引入和把玩一些npm库。

直接运行例如 $i('lodash') 或者 $i('moment') 然后在几秒钟之后，你就可以获取到lodash / momentjs了。

### copy()
复制文本到剪切板，可以粘贴到本地文本中

### Store as global
右键点击`console`所列出的数据,将其保存为全局变量,变量名为`temp1`、`temp2`...

### Copy HTML (最快的方式)
HTML面板中可以使用`Ctrl`+`c`,或者点击DOM前面的省略号

### 通过`h`隐藏DOM元素

### HTML面板可拖拽DOM元素

### 移动DOM元素
如果你只是想移动你当前选中的元素，在DOM结构中往上一点或者往下一点，而不是拖动和放置，
你同样可以使用[ctrl] + [⬆] / [ctrl] + [⬇] ([⌘] + [⬆] /[⌘] + [⬇] on Mac).

### HTML面板是个编辑器

### 使用`Command`(命令)菜单
- 在`Chrome`的调试打开的情况下 按下 [ Ctrl]+[Shift]+[P] (or [⌘]+[Shift]+[P] on Mac)
- 或者使用DevTools 的 dropdown 按钮的这个选项
### theme | 切换主题
### time | 显示console时间戳

### The DevTools drawer
Chrome DevTools 有很多部分，被分为9个 tab(标签页/选项卡) ( Elements , Console , Sources , Network , 等等...) - 但那仅仅是它的一部分而已！有一组平行的选项卡，被隐藏在主窗口之下。这个组合被称为 Drawer
要访问它，当你在DevTools（任何选项卡）中时，按 [esc] ,再次按 [esc] 隐藏它

### Control the sensors（控制传感器）
位于 Drawer 的 Sensors(传感器) 面板可以让你模拟特定的位置。可以从预定义的位置中进行选择，添加自己的位置，或者只需手动键入纬度/经度。  
选定的值将被navigator.geolocation.watchPosition（或 .getCurrentPosition ）报告。  
如果你的应用使用加速计，传感器面板也可以模拟你设备在3D空间中的位置！

### Simulate network conditions(模拟网络状态)
就像伪造你的位置一样，你可以使用 Drawer 的 Network conditions 面板模拟特定的网络行为：模拟互联网为典型的3G网络甚至离线！这有助于了解页面资源的大小。或者测试应用的离线功能。  
Network conditions 面板还可以模拟特定的用户代理。

### Have the source by hand (把 source 拿到手)
类似于在打开不同面板的同时监视 Console 的方式类似，例如，当我主要专注于 Elements 面板时，有时我也想看到源代码。就像 drawer console 一样，你可以在 drawer 中显示 Source。

### For more readable logs (更易读的日志)
```javascript
console.log(name, job, age) //bob, teacher, 25
console.log({name, job, age}) // {name: 'bob', job: 'teacher', age: 25}
```

### replay XHR requests (重新发送 XHR 的请求)
network 右键XHR

### Switch between 2 recent DevTools placements 在两个最近使用的 DevTools 的展示位置之间切换
ctrl + shift + D (⌘ + shift + D Mac)

### Switch between DevTools panels 在 DevTools 的面板之间切换
点击越少越好！ 我们经常从“元素”面板转到“源”并返回。 这些快捷方式支持我们在活动面板之间切换：  
按下 ctrl + [ 和 ctrl + ] 分别从当前面板的分别向左和向右切换面板。
