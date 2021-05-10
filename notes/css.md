## table的样式
table-layout CSS属性定义了用于布局表格单元格，行和列的算法。  
auto  
大多数浏览器采用自动表格布局算法对表格布局。表格及单元格的宽度取决于其包含的内容。  
fixed  
表格和列的宽度通过表格的宽度来设置，某一列的宽度仅由该列首行的单元格决定。在当前列中，该单元格所在行之后的行并不会影响整个列宽。  
使用 “fixed” 布局方式时，整个表格可以在其首行被下载后就被解析和渲染。这样对于 “automatic” 自动布局方式来说可以加速渲染，但是其后的单元格内容并不会自适应当前列宽。任何一个包含溢出内容的单元格可以使用 overflow  属性控制是否允许内容溢出。

border-collapse CSS 属性是用来决定表格的边框是分开的还是合并的。在分隔模式下，相邻的单元格都拥有独立的边框。在合并模式下，相邻单元格共享边框。  
1. collapse，合并（collapsed ）模式下，表格中相邻单元格共享边框。在这种模式下，CSS属性border-style 的值 inset 表现为槽，值 outset 表现为脊。  
2. separate，分隔（separated）模式是 HTML 表格的传统模式。相邻单元格都拥有不同的边框。边框之间的距离是通过CSS属性`border-spacing`来确定的。  

border-spacing  
border-spacing 属性指定相邻单元格边框之间的距离（只适用于 边框分离模式 ）。相当于 HTML 中的 cellspacing 属性，但是第二个可选的值可以用来设置不同于水平间距的垂直间距。  

## flex的简写
flex属性的简写应将所有的值写上，否则根据默认的值会有问题

## caret-color
改变输入时的插入符号的颜色

## 等比例缩放盒子
当padding的值为百分比的时候，百分比的基数取决于父元素的宽度  
1. 将元素的 height 设成 0，使得元素的高度等于 padding-bottom；
2. 合理设置 padding-bottom 的值。比如每个元素的 width 是 25%，现在想让元素的高度始终保持为其宽度的两倍，则 padding-bottom 的值应该设置为 50%。

## BFC(块级格式化上下文)
就是一个相对独立的布局环境，它内部元素的布局不受外面布局的影响。它可以通过以下任何一种方式来创建： 
- `float`的值不为`none`
- `position`的值不为`static`或者`relative`
- `display`的值为`table-cell`、`table-caption`、`inline-block`、`flex`、 `inline-flex`
- `overflow`的值不为 visible

约束规则：  
1. 内部的Box会在垂直方向上一个接一个的放置
2. 同一个BFC的两个相邻Box的margin会发生重叠，与方向无关。
3. BFC中子元素不会超出他的包含块，而position为absolute的元素可以超出他的包含块边界
4. BFC的区域不会与float的元素区域重叠
5. 计算BFC的高度时，浮动子元素也参与计算
6. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素，反之亦然

## css选择器实践
`ul li + li{border-top:1px solid #000;}`
第一个li不加border-top，其余都加上

## position
- static: 默认值，忽略 top, bottom, left, right 或者 z-index 声明
- absolute: 会使inline元素变成block元素

## transform
- 设置原点: transform-origin：left top
- 景深: perspective：500px 定义在父级元素
- 效果: transform-style：flat | preserve-3d

## outline
轮廓是绘制于元素周围的一条线，位于边框边缘的外围，可起到突出元素的作用。  
轮廓线不会占据空间，也不一定是矩形。

## resize
属性规定是否可由用户调整元素的尺寸。  
如果希望此属性生效，需要设置元素的 overflow 属性，值可以是 auto、hidden 或 scroll。
- none 用户无法调整元素的尺寸
- both 用户可调整元素的高度和宽度
- horizontal 用户可调整元素的宽度
- vertical 用户可调整元素的高度

## background-size
- x y 百分比的值  如果x给了值，y轴默认auto
- contain缩放图片，使其恰好适合背景区；保持宽高比。
- cover  拉大图片，使其完全填满背景区；保持宽高比。
- auto  默认 跟没写一样
缩写 size 要写在 background-position 之后 加 /

## background-attachment
属性控制滚动元素内的背景图片是否随元素滚动而移动。（默认为scroll，固定背景为fixed），可加入background的简写

## background-clip & background-origin
对于这两个新属性，其对应的keyword是相同的：border-box, padding-box, content-box。  
它们的最根本的区别就是：background-clip 是对背景图片的裁剪，background-origin是对背景图片设置起始点。
- 对于background-clip, 其关键字是指将背景图片以border的尺寸、以padding的尺寸，以content的尺寸进行切割，其得到的结果是不完整的背景，也就是其中的一部分(原理与截图差不多)。而且有一点要注意，background-clip的切割是对这个容器背景的切割(包括图片与背景颜色)。
- 对于background-origin，其关键字是指将背景图片放置到border范围内，padding范围内、content范围内，其得到的结果是完整的背景(原理与图片的缩放相似)。与background-clip不同的是，它只是单纯设置背景图片的边界，并不会对背景颜色造成影响。

## flex弹性布局
- flex：1均分宽度

- flex-grow扩展比率

   剩余空间是正值的时，伸缩项目相对于伸缩容器里其他伸缩项目能分配到空间比例,若没写该属性，则为0，0代表不参与扩展

- flex-shrink缩小比例
此时剩余空间是不足时都将等比例缩小，0 表示不参加收缩比例，若没写该属性，则为1

- flex-basis
在分配空间之前，也已经分得到空间
缩写：flex: none 或者 [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]（||后面的属性可不写）

- order
利用order来控制div块的顺序，默认为0，大于0在前，小于0在后

- flex-direction
排列方式，决定主轴位置（水平方向）：
   - row | row-reverse | column | column-reverse
   - 从左起 | 水平从右起 | 垂直从上起 | 垂直从下起

- flex-wrap
   - nowrap | wrap | wrap-reverse
   - 单行 | 换行(宽度不够自动换行) | 换行并反转

- justify-content（水平对齐方式）
   - flex-start | flex-end | center | space-between | space-around;
   - 左对齐 | 右对齐 | 居中对齐 | 两端对齐(之间的间隔相等) | 每个项目两侧的间隔相等

- align-items（垂直对齐方式）
   - flex-start | flex-end | center | baseline | stretch
   - 起点对齐 | 终点对齐 | 中点对齐 | 基线对齐 | 默认值(未设置高度或设为auto，将占满整个容器的高度)

- align-content （多行对齐方式）
需要多行才行
多根轴线的对齐方式
   - flex-start | flex-end | center | space-between | space-around | stretch
   - 左对齐 | 右对齐 | 居中对齐 | 两端对齐(之间的间隔相等) | 每个项目两侧的间隔相等 | 轴线占满整个交叉轴

- align-self
允许单个项目有与其他项目不一样的对齐方式
   - auto | flex-start | flex-end | center | baseline | stretch，这6个值，除了auto，其他都与align-items属性完全一致，可覆盖align-items属性
   
   默认值auto，表示继承父级元素的align-items，如果没有父级，则则等同于stretch

   当这两个属性遇到了flex-direction: column / column-reverse  整个顺序就都变了。

## white-space、word-break、word-wrap
属性设置如何处理元素内的空白
- normal	默认，空白会被浏览器忽略。
- pre	空白会被浏览器保留。其行为方式类似`HTML`中的`<pre>`标签。
- nowrap	文本不会换行，文本会在在同一行上继续，直到遇到`<br>`标签为止。
- pre-wrap	保留空白符序列，但是正常地进行换行。
- pre-line	合并空白符序列，但是保留换行符。
- inherit	规定应该从父元素继承`white-space`属性的值。

word-break，控制单词如何被拆分换行。它有三个值：normal | break-all | keep-all  

word-wrap（overflow-wrap）控制长度超过一行的单词是否被拆分换行，是word-break的补充，它有两个值：normal | break-word

## 39.animation
- animation-name  名称
- animation-duration  执行时间
- animation-timing-function  运动类型(ease-in等)
- animation-delay  延迟
- animation-iteration-count  循环次数  可选  number | infinite
- animation-direction  是否反向运动  alternate
- animation-fill-mode
  设置或检索动画时间之外的状态（想让动画保持突然终止时的状态）
   - none | forwards | backwards | both
   - 不设置 | 结束时 | 开始时 | 结束或开始的状态
- animation-play-state  想让动画保持突然终止时的动画状态 running | paused
```css
@keyframes name{
  0% { background: #c00 }
  50% { background: orange }
  100% { background: yellowgreen }
}
```
## 伪类、伪元素
一个冒号（ : ）表示伪类，两个冒号（ :: ）表示 CSS3新增的伪元素。

伪类（详见MDN`https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes`）  
:first-child :last-child :nth-child  
:link :visited :hover :active  
input:focus :target
```
//如果用户点击一个指向页面中其他元素的链接，则那个元素就是目标（target），可以用 :target 伪类选中它。
<a href="#more_info">More Information</a>
#more_info:target {background:#eee;}
```

伪元素（详见MDN`https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-elements`）  
::first-letter ::first-line  
::before ::after  
::selection
```css
//首字符下沉
p::first-letter {
font-family:Lato, helvetica, sans-serif;
font-style: normal;
font-weight:700;
font-size:4.5em;
float:left;
line-height:0.5;
}
```

## 字体
- font-style：italic 、 oblique 、 normal
- font-weight：100 、 200 …… 900 ，或者 lighter 、 normal 、 bold 和 bolder
- font-variant：small-caps将所有小写英文字母变成小型大写字母

## 文本属性
文本属性只应用于长长的、细细的、内部的文本盒子，而不是包含元素的盒子。
- text-indent文本缩进
- letter-spacing字符间距
- word-spacing单词间距
- text-decoration文本装饰（underline 、 overline 、 line-through 、 blink 、 none ）
- text-align
- line-height
- text-transform文本转换（none 、 uppercase 、 lowercase 、 capitalize用于转换元素中文本的大小写，它可以设定英文单词首字母大
写、全部字母大写和全部字母小写。）
- vertical-align以基线为参照上下移动文本，但这个属性只影响行内元素。如果你想在垂直方向上对齐块级元素，必须把其 display 属性设定为 inline 。 vertical-align属性最常用于公式或化学分子式中的上标和下标，或者用于文本中脚注的角标，比如把星号变成上角标。浏览器默认`<sup>`上标，`<sub>`为下标

