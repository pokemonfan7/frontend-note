## TrackBy
ngFor中可以控制视图重新渲染

## Dependency Injection(依赖注入)
angular是一个控制反转（IOC，Inversion of Control）的容器，使用依赖注入（DI，Dependency Injection）来实现控制反转。
在NgModule中的providers中添加注入的类（服务），当在组件的constructor中注入类（服务时），providers会自动实例化对象并添加进组件里。

依赖注入的好处是解耦合性、可重用性和可测试性。
- 解耦合是让组件和需要实例化的对象解耦；
- 可重用性是组件可重用；
- 可测试性是当需要的服务未写时，可先用一个mock的服务来测试，当需要的服务写好后，直接改变注入即可。

[{provide: ProductService, useclass: ProductService}]
provide属性是token（一个标志），useclass属性是实例化的类，在constructor中声明的ProductService是token

声明了@Injectable（）装饰器的服务才能在其constructor中注入其他服务

@Self()、@SkipSelf()、@Optional() 等装饰器的作用：
- @Self() - 表示只在本级注入器查找依赖对象
- @SkipSelf() - 表示不从本级注入器获取依赖对象
- @Optional - 表示该依赖对象是可选的，如果找不到返回 null

为什么在构造函数中，非`Type`类型的参数只能用`@Inject(Something)`的方式注入？  
因为`Type`类型的对象，会被`TypeScript`编译器编译。即我们通过`class`关键字声明的服务，最终都会编译成`ES5`的函数对象。

在构造函数中，Type 类型的参数能用`@Inject(Type)`的方式注入么？  
`Type`类型的参数也能使用`@Inject(Type)`的方式注入，具体如下：  
`constructor(@Inject(Http) private http) { }`  
同样也可以使用以下方式：  
`constructor(@Inject(Http) private http: Http) { }`  
第一种方式虽然可以正常编译，但 IDE 会有如下的提示信息：  
`[ts] Parameter 'http' implicitly has an 'any' type.`  
第二种方式，虽然`Angular`内部会合并`design:paramtypes`与`parameters`内的`metadata`信息，但是有点冗余了。  
总而言之，如果是`Type`类型的参数，推荐使用下面的方式：  
`constructor(private http: Http) { }`

## NgModule
declarations 和 providers 属性最令人困惑的是，它们没有相同的作用域和可见性 (scope / visibility)：
declarations / components 是本地作用域 (private visibility)
providers / services 是全局作用域 (public visibility)
这意味着你声明的组件只能在当前模块中使用。如果你想要在外面使用声明的组件，你必须导出它们：
```javascript
@NgModule({
  declarations: [SomeComponent, SomeDirective, SomePipe],
  exports: [SomeComponent, SomeDirective, SomePipe]
})
```
反之，模块中的声明的服务，我们可以在所有模块中使用。

components 和 services 拥有不同的作用域，了解这个区别很重要。如果我们的应用程序不仅仅包含一个模块，事情可能会变得很糟糕。  
Angular 框架内部也拆分成多个不同的模块，如 core、common、http 等等。为什么需要导入这些模块?  
因为组件和服务，拥有不同的作用域：  
- 如果我们需要在模块中使用导入模块中声明的组件，那我们需要在每个使用的模块中导入对应的模块  
- 如果我们只是使用模块中定义的服务，那我们只需要在主模块中导入对应的模块

如果你不了解这些区别，你可能由于忘记导入某个模块，而出现组件不可用的错误。或者你为了使用某个模块中定义的服务，而多次导入同一个模块。  

Modules to import each time you need them  
CommonModule (包含 Angular 中定义的内建指令，如 ngIf、ngFor 等)，除了在主模块之外，不需要导入，因为我们已经在主模块中导入了 BrowserModule (此模块已导入了 CommonModule)。其它模块都必须手动导入该模块。  
FormsModule / ReactiveFormsModule  
BrowserAnimationsModule  
FlexLayoutModule  
MaterialModule 和 UI Modules (如 PrimeNg)  
Other Modules (定义 components、directives 或 pipes)  

Modules to import only once  
HttpModule  
Other Modules (仅提供服务)  

如何同时管理具有组件和服务的模块？这是一个比较复杂的问题。你可能已经接触过 RouterModule，该模块不仅提供了 <router-outlet> 、routerLink 指令，
而且还提供了`ActivedRouter`服务 (用于获取`URL`参数)、`Router`服务(用于页面导航)  
幸运的是，这个问题是由模块本身来解决。Angular CLI 会为我们自动生成路由文件，但你可能已经注意到，应用程序主模块的路由和子模块路由之间存在细微差别。
对于 AppModule，我们这样使用：  
RouterModule.forRoot(routes)  
对于子模块，我们这样使用：  
RouterModule.forChild(routes)  
为什么呢？因为在 AppModule 中，forRoot() 方法会导入路由模块中的指令和服务。但对于子模块来说，forChild() 方法仅会导入路由模块中定义的指令，而不会再次导入模块中定义的服务。

CoreModule 定义在根模块中，因为服务是全局作用域，所以只实例化一次（例如：store，全局只能有一个）

ShareModule 定义全局公用的组件、指令、管道，用时就直接导入ShareModule

如你所见，HeroComponent 组件在 HeroesModule 以及 AnotherModule 中进行声明。在多个模块中使用同一个组件是允许的。  
但当这种情况发生时，我们应该考虑模块之间的关系是什么。如果一个模块作为另一个模块的子模块，那么针对上面的场景解决方案将是：  
- 在子模块的 @NgModule.declaration 中声明 HeroComponent 组件  
- 通过子模块的 @NgModule.exports 数组中导出该组件  
- 在父模块的 @NgModule.imports 数组中导入子模块  

而对于其它情况，我们可以创建一个新的模块，如 SharedModule 模块。具体步骤如下：  
- 在`SharedModule`中声明和导出`HeroComponent`
- 在需要使用`HeroComponent`的模块中导入`SharedModule`

## http
HTTP
                       权限                 路径
        ┌──────┴────────┐┌─┴─┐
  abc://username:password@example.com:123/path/data?key=value&key2=value2#fragid1
└┬┘   └───┬──┘ └─┬─┘ └┬┘        └────┬────┘└─┬─┘
  协议        用户信息      主机名    端口                查询参数          片段

HTTP 协议主要特点  
- 简单快速：当客户端向服务器端发送请求时，只是简单的填写请求路径和请求方法即可，然后就可以通过浏览器或其他方式将该请求发送就行了  
- 灵活：HTTP 协议允许客户端和服务器端传输任意类型任意格式的数据对象  
- 无连接：无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接，采用这种方式可以节省传输时间。(当今多数服务器支持Keep-Alive功能，使用服务器支持长连接，解决无连接的问题)  
- 无状态：无状态是指协议对于事务处理没有记忆能力，服务器不知道客户端是什么状态。即客户端发送HTTP请求后，服务器根据请求，会给我们发送数据，发送完后，不会记录信息。(使用 cookie 机制可以保持 session，解决无状态的问题)  

HTTP 请求报文由请求行、请求头、空行 和 请求体(请求数据) 4 个部分组成

请求行
请求行由请求方法、URL 和 HTTP 协议版本组成，它们之间用空格分开。  
GET / HTTP/1.1

请求头
请求头由 key-value 对组成，每行一对，key (键) 和 value (值)用英文冒号 : 分隔。请求头通知服务器有关于客户端请求的信息，典型的请求头有：  
- User-Agent：用户代理信息 - Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 ...  
- Accept：客户端可识别的内容类型列表 - text/html,application/xhtml+xml,application/xml  
- Accept-Language：客户端可接受的自然语言 - zh-CN,zh;q=0.8,en;q=0.6,id;q=0.4  
- Accept-Encoding：客户端可接受的编码压缩格式 - gzip, deflate, sdch, br  
- Host：请求的主机名，允许多个域名同处一个IP地址，即虚拟主机 - `www.baidu.com`  
- connection：连接方式  
- close：告诉WEB服务器或代理服务器，在完成本次请求的响应后，断开连接  
- keep-alive：告诉WEB服务器或代理服务器。在完成本次请求的响应后，保持连接，以等待后续请求  
- Cookie：存储于客户端扩展字段，向同一域名的服务端发送属于该域的cookie - PSTM=1490844191; BIDUPSID=2145FF54639208435F60E1E165379255;  
- 空行  
最后一个请求头之后是一个空行，发送回车符和换行符，通知服务器以下不再有请求头。  

请求体
请求数据不在 GET 方法中使用，而是在 POST 方法中使用。与请求数据相关的最常使用的请求头是 Content-Type和 Content-Length。

HTTP响应报文由状态行、响应头、空行和响应体4 个部分组成

状态行
状态行格式： HTTP-Version Status-Code Reason-Phrase CRLF
- HTTP-Version - HTTP 协议版本
- Status-Code - 状态码
- Reason-Phrase - 状态码描述
- CRLF - 回车/换行符

响应头
响应头由 key-value 对组成，每行一对，key (键) 和 value (值)用英文冒号 : 分隔。  
响应头域允许服务器传递不能放在状态行的附加信息，这些域主要描述服务器的信息和Request-URI进一步的信息，典型的响应头有：  
- Server：包含处理请求的原始服务器的软件信息
- Date：服务器日期
- Content-Type：返回的资源类型 (MIME)
- Connection：连接方式
- close：连接已经关闭
- keep-alive：连接已保持，在等待本次连接的后续请求
- Cache-Control：缓存控制
- Expires：设置过期时间
- Set-Cookie：设置 Cookie 信息
- 空行
最后一个响应头之后是一个空行，发送回车符和换行符，通知浏览器以下不再有响应头。

## HttpClient
当调用 Http 对象的 get()、post()、put() 等方法时，会返回一个 Observable<Response> 对象，仅当我们订阅该 Observable 对象时，才会正式发起 HTTP 请求。  
Angular 内部使用 Request 和 Response 对象来封装请求信息和响应信息。Request 类和 Response 类都是继承于 Body 类，Body 类中提供了四个方法用于数据转换：  
- json(): any - 转换为 JSON 对象
- text(): string -
- arrayBuffer(): ArrayBuffer - 转换为 ArrayBuffer 对象
- blob(): Blob - 转化为 Blob 对象
订阅 Observable<Response> 对象后，返回一个函数对象。调用该函数对象，我们可以移除 load、error 事件监听及取消 HTTP 请求。

url 支持自动传参的，如：
```javascript
/test/:lotId/:deviceNo
http.get(ApiAddress.URL, {params: {lotId: '1', deviceNo: 'xxx'}})
```

现在 JSON 是默认的数据格式，我们不需要再进行显式的解析。即我们不需要再使用以下代码：  
http.get(url).map(res => res.json()).subscribe(...)  
现在我们可以这样写：  
http.get(url).subscribe(...)  

http调用接口会自动取消订阅，不需要取消订阅

## 生命周期钩子
指令与组件共有的钩子
- ngOnChanges
- ngOnInit
- ngDoCheck
- ngOnDestroy
组件特有的钩子
- ngAfterContentInit
- ngAfterContentChecked
- ngAfterViewInit
- ngAfterViewChecked

生命周期钩子的作用及调用顺序：
- constructor - 组件的构造函数会在所有的生命周期钩子之前被调用，它主要用于依赖注入或执行简单的数据初始化操作。
- ngOnChanges - 当数据绑定输入属性的值发生变化时调用
- ngOnInit - 在第一次 ngOnChanges 后调用
- ngDoCheck - 自定义的方法，用于检测和处理值的改变
- ngAfterContentInit - 在组件内容初始化之后调用
- ngAfterContentChecked - 组件每次检查内容时调用
- ngAfterViewInit - 组件相应的视图初始化之后调用
- ngAfterViewChecked - 组件每次检查视图时调用
- ngOnDestroy - 指令销毁前调用

constructor VS ngOnInit
`constructor()`是类中的特殊方法，主要用来做初始化操作，在进行类实例化操作时，会被自动调用。  
在`Angular`中，构造函数一般用于依赖注入或执行一些简单的初始化操作。  
`ngOnInit()`用于在获取输入属性后初始化组件，该钩子方法会在第一次`ngOnChanges`之后被调用。  
在项目开发中我们要尽量保持构造函数简单明了，让它只执行简单的数据初始化操作，因此我们会把其他的初始化操作放在`ngOnInit`钩子中去执行。  
如在组件获取输入属性之后，需执行组件初始化操作等。  
类中的静态属性(static)是属于`AppComponent`构造函数的，而成员属性是属于`AppComponent`实例。

## ViewEncapsulation
ViewEncapsulation 允许设置三个可选的值：  
ViewEncapsulation.Emulated - 无`Shadow DOM`，但是通过`Angular`提供的样式包装机制来封装组件，使得组件的样式不受外部影响。这是`Angular`的默认设置。  
ViewEncapsulation.Native - 使用原生的 Shadow DOM 特性  
ViewEncapsulation.None - 无 Shadow DOM，并且也无样式包装  

## @Input()
@Input('bindingPropertyName')  
Input 装饰器支持一个可选的参数，用来指定组件绑定属性的名称。如果没有指定，则默认使用 @Input 装饰器，装饰的属性名。

setter 和 getter 是用来约束属性的设置和获取，它们提供了一些属性读写的封装，可以让代码更便捷，更具可扩展性。  
通过 setter 和 getter 方式，我们对类中的私有属性进行了封装，能避免外界操作影响到该私有属性。此外通过 setter 我们还可以封装一些业务逻辑，  
具体示例如下：
```javascript
_count: number = 0; // 默认私有属性以下划线开头，不是必须也可以使用$count
biggerThanTen: boolean = false;

@Input()
set count (num: number) {
    this.biggerThanTen = num > 10;
    this._count = num;
}

get count(): number {
    return this._count;
}
```
当数据绑定输入属性的值发生变化的时候，Angular 将会主动调用 ngOnChanges 方法。  
在组件内手动改变输入属性的值，ngOnChanges 钩子是不会触发的。  
它会获得一个 SimpleChanges 对象，包含绑定属性的新值和旧值，它主要用于监测组件输入属性的变化。具体示例如下：  
```javascript
ngOnChanges(changes: SimpleChanges) {
    console.dir(changes['count']);
}
```
不能同时使用 @Input 装饰器 或在 @Directive、@Component inputs 字段中定义同一个输入属性，具体示例如下：
```javascript
@Component({
    selector: 'exe-counter',
    inputs:['count:value']
})
export class CounterComponent {
    @Input('value') count: number = 0;
}
```

@Input vs inputs
- 相同点：
   它们都是用来定义输入属性
- 异同点：
   - inputs 定义在指令的 metadata 信息中，开发者对指令的输入属性一目了然。此外对于未选用 TypeScript 作为开发语言的开发者，也只能在 metadata 中定义指令的输入属性。
   - @Input 属于属性装饰器，通过它我们可以一起定义属性的访问描述符 (public、private、protected)：@Input() public attr: string;

项目开发中尽量通过 @Input 装饰器定义无状态的组件，即组件仅依赖于输入属性，这样会大大提高组件可复用性

## EventEmitter
EventEmitter 用来触发自定义事件，具体使用示例如下：
```javascript
let numberEmitter: EventEmitter<number> = new EventEmitter<number>();
numberEmitter.subscribe((value: number) => console.log(value));
numberEmitter.emit(10);
```

在`Angular`中的`EventEmitter`应用场景是：子指令创建一个`EventEmitter`实例，并将其作为输出属性导出。  
子指令调用已创建的`EventEmitter`实例中的`emit(payload)`方法来触发一个事件，  
父指令通过事件绑定`(eventName)`的方式监听该事件，并通过`$event`对象来获取`payload`对象。  
```javascript
son.component:
@Output() change: EventEmitter<number> = new EventEmitter<number>();

    increment() {
        this.count++;
        this.change.emit(this.count);
    }
parent.component:
(change)="countChange($event)"
countChange(event: number) {
    this.changeMsg = `子组件change事件已触发，当前值是: ${event}`;
  }
```

## @Output()
`Output`装饰器支持一个可选的参数，用来指定组件绑定属性的名称。如果没有指定，则默认使用`@Output`装饰器，装饰的属性名。

@Output vs outputs
- 相同点：
它们都是用来定义输出属性
- 异同点：
   - outputs 定义在指令的 metadata 信息中，开发者对指令的输入属性一目了然。此外对于未选用 TypeScript 作为开发语言的开发者，也只能在 metadata 中定义指令的输入属性。
   - @Output 属于属性装饰器，通过它我们可以一起定义属性的访问描述符 (public、private、protected)：@Output('countChange') change: EventEmitter<number> = new EventEmitter<number>();

## ng-content
```HTML
son.component:
<div style="border: 1px solid #666;margin: 4px;">
     <div style="border: 1px solid red;margin: 5px;">
         <ng-content select="header"></ng-content>
     </div>
     <div style="border: 1px solid green;margin: 5px;">
         <ng-content select=".card_body"></ng-content>
     </div>
     <div style="border: 1px solid blue;margin: 5px;">
         <ng-content select="footer"></ng-content>
     </div>
</div>
parent.component:
<son>
    <header>Card Header</header>
        <div class="card_body">Card Body</div>
    <footer>Card Footer</footer>
</son>
```

## ContentChild、ViewChild
`ContentChild`与`ViewChild`的异同点
- 相同点
都是属性装饰器
都有对应的复数形式装饰器：ContentChildren、ViewChildren
都支持 Type<any>|Function|string 类型的选择器
- 不同点
ContentChild 用来从通过 Content Projection 方式 (ng-content) 设置的视图中获取匹配的元素
ViewChild 用来从模板视图中获取匹配的元素
在父组件的 ngAfterContentInit 生命周期钩子中才能成功获取通过 ContentChild 查询的元素
在父组件的 ngAfterViewInit 生命周期钩子中才能成功获取通过 ViewChild 查询的元素

## 宿主元素
宿主元素的概念同时适用于指令和组件。对于指令来说，这个概念是相当简单的。应用指令的元素，就是宿主元素。
```javascript
 @HostListener('click', ['$event.target'])
    onClick(btn: HTMLElement) {
        console.log('button', btn, 'number of clicks:', this.numberOfClicks++);
    }
```
此外，我们也可以监听宿主元素外，其它对象产生的事件，如 window 或 document 对象。
```javascript
constructor(private el: ElementRef, private renderer: Renderer) { }

@HostListener('document:click', ['$event'])
onClick(btn: Event) {
    if (this.el.nativeElement.contains(event.target)) {
        this.highlight('yellow');
    } else {
        this.highlight(null);
    }
}

highlight(color: string) {
    this.renderer.setElementStyle(this.el.nativeElement, 'backgroundColor', color);
}
```
HostBinding 是属性装饰器，用来动态设置宿主元素的属性值。
```javascript
@HostBinding('attr.role') role = 'button';
@HostBinding('class.pressed') isPressed: boolean;

@HostListener('mousedown') hasPressed() {
    this.isPressed = true;
}
@HostListener('mouseup') hasReleased() {
    this.isPressed = false;
}
```

## ElementRef
ElementRef的应用
我们先来介绍一下整体需求，我们想在页面成功渲染后，获取页面中的`div`元素，并改变该`div`元素的背景颜色。接下来我们来一步步，实现这个需求。

首先我们要先获取`div`元素，在文中 "`ElementRef`的作用" 部分，我们已经提到可以利用`Angular`提供的强大的依赖注入特性，获取封装后的 native 元素。
在浏览器中`native`元素就是`DOM`元素，我们只要先获取`my-app`元素，然后利用`querySelector API`就能获取页面中`div`元素。
```javascript
import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <h1>Welcome to Angular World</h1>
    <div #greet>Hello {{ name }}</div>
  `,
})
export class AppComponent {
  name: string = 'Semlinker';

  @ViewChild('greet')
  greetDiv: ElementRef;

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) { }

  ngAfterViewInit() {
    // this.greetDiv.nativeElement.style.backgroundColor  = 'red';
    this.renderer2.setStyle(this.greetDiv.nativeElement, 'backgroundColor', 'red');
  }
}
```

## renderer2
renderer2常用方法
```javascript
export abstract class Renderer2 {
  abstract createElement(name: string, namespace?: string|null): any;
  abstract createComment(value: string): any;
  abstract createText(value: string): any;
  abstract setAttribute(el: any, name: string, value: string,
    namespace?: string|null): void;
  abstract removeAttribute(el: any, name: string, namespace?: string|null): void;
  abstract addClass(el: any, name: string): void;
  abstract removeClass(el: any, name: string): void;
  abstract setStyle(el: any, style: string, value: any,
    flags?: RendererStyleFlags2): void;
  abstract removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void;
  abstract setProperty(el: any, name: string, value: any): void;
  abstract setValue(node: any, value: string): void;
  abstract listen(
      target: 'window'|'document'|'body'|any, eventName: string,
      callback: (event: any) => boolean | void): () => void;
}
```

## TemplateRef、ViewContainerRef
TemplateRef：用于表示内嵌的 template 模板元素，通过 TemplateRef 实例，我们可以方便创建内嵌视图(Embedded Views)，且可以轻松地访问到通过 ElementRef 封装后的 nativeElement。
需要注意的是组件视图中的 template 模板元素，经过渲染后会被替换成 comment 元素。

ViewContainerRef：用于表示一个视图容器，可添加一个或多个视图。通过 ViewContainerRef 实例，我们可以基于 TemplateRef 实例创建内嵌视图，并能指定内嵌视图的插入位置，
也可以方便对视图容器中已有的视图进行管理。简而言之，ViewContainerRef 的主要作用是创建和管理内嵌视图或组件视图。  
**如果你以某个元素或组件作为视图容器ViewContainerRef，对其新增的组件、模版，将成为这个视图容器的兄弟节点(新增使用createEmbeddedView())**

1. `Angular`支持的 View(视图) 类型有哪几种？  
Embedded Views - Template 模板元素  
Host Views - Component 组件  

- 如何创建`Embedded View`？  
```
ngAfterViewInit() {
    let view = this.tpl.createEmbeddedView(null);
}
```
- 如何创建`Host View`？  
```
constructor(private injector: Injector,
    private r: ComponentFactoryResolver) {
    let factory = this.r.resolveComponentFactory(AppComponent);
    let componentRef = factory.create(injector);
    let view = componentRef.hostView;
}
```
2. `Angular Component`组件中定义的`<template>`模板元素为什么渲染后会被移除？  
因为 <template> 模板元素，已经被 Angular 2 解析并封装成 TemplateRef 实例，通过 TemplateRef 实例，我们可以方便地创建内嵌视图(Embedded View)，我们不需要像开篇中的例子那样，手动操作 <template> 模板元素。

3. `ViewRef`与`EmbeddedViewRef`之间有什么关系？  
ViewRef 用于表示 Angular View(视图)，视图是可视化的 UI 界面。  
EmbeddedViewRef 继承于 ViewRef，用于表示 <template> 模板元素中定义的 UI 元素。  

## 类的概念
虽然 JavaScript 中有类的概念，但是可能大多数 JavaScript 程序员并不是非常熟悉类，这里对类相关的概念做一个简单的介绍。  
类 (Class)：一种面向对象计算机编程语言的构造，是创建对象的蓝图，描述了所创建的对象共同的属性和方法。  
对象 (Object)：类的实例，通过 new 创建  
面向对象 (OOP) 的三大特性：封装、继承、多态  
封装 (Encapsulation)：将对数据的操作细节隐藏起来，只暴露对外的接口。外界调用端不需要知道细节，就能通过对外提供的接口来访问该对象，同时也保证了外界无法任意更改对象内部的数据  
继承 (Inheritance)：子类继承父类，子类除了拥有父类的所有特性外，还可以扩展自有的功能特性  
多态 (Polymorphism)：由继承而产生了相关的不同的类，对同一个方法可以有不同的响应。比如 Cat 和 Dog 都继承自 Animal，但是分别实现了自己的 eat() 方法。  
此时针对某一个实例，我们无需了解它是 Cat 还是 Dog，就可以直接调用 eat() 方法，程序会自动判断出来应该如何执行 eat()  
存取器（getter & setter）：用于属性的读取和赋值  
修饰符（Modifiers）：修饰符是一些关键字，用于限定成员或类型的性质。比如 public 表示公有属性或方法  
抽象类（Abstract Class）：抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现  
接口（Interfaces）：不同类之间公有的属性或方法，可以抽象成一个接口。接口可以被类实现（implements）。一个类只能继承自另一个类，但是可以实现多个接口。

## 组件继承
组件继承涉及以下的内容：
- Metadata：如 @Input()、@Output()、@ContentChild/Children、@ViewChild/Children 等。在派生类中定义的元数据将覆盖继承链中的任何先前的元数据，否则将使用基类元数据。
- Constructor：如果派生类未声明构造函数，它将使用基类的构造函数。这意味着在基类构造函数注入的所有服务，子组件都能访问到。
- Lifecycle hooks：如果基类中包含生命周期钩子，如 ngOnInit、ngOnChanges 等。尽管在派生类没有定义相应的生命周期钩子，基类的生命周期钩子会被自动调用。

需要注意的是，模板是不能被继承的 ，因此共享的 DOM 结构或行为需要单独处理。子组件是不能继承父组件装饰器中元数据。

## 变化检测
`Change Detection`(变化检测) 是`Angular`中最重要的一个特性。当组件中的数据发生变化的时候，`Angular`能检测到数据变化并自动刷新视图反映出相应的变化。
现在我们来总结一下，引起模型变化的三类事件源：
- Events：click, mouseover, keyup ...
- Timers：setInterval、setTimeout
- XHRs：Ajax(GET、POST ...)

这些事件源有一个共同的特性，即它们都是异步操作。那我们可以这样认为，所有的异步操作都有可能会引起模型的变化。

其实在`Angular`应用程序启动之前，`Zone`采用猴子补丁 (Monkey-patched) 的方式，将`JavaScript`中的异步任务都进行了包装，
这使得这些异步任务都能运行在`Zone`的执行上下文中，每个异步任务在`Zone`中都是一个任务，除了提供了一些供开发者使用的钩子外，默认情况下`Zone`重写了以下方法：
- setInterval、clearInterval、setTimeout、clearTimeout
- alert、prompt、confirm
- requestAnimationFrame、cancelAnimationFrame
- addEventListener、removeEventListener

`Immutable`即不可变，表示当数据模型发生变化的时候，我们不会修改原有的数据模型，而是创建一个新的数据模型。
当我们使用`OnPush`策略时，需要使用的`Immutable`的数据结构，才能保证程序正常运行。

在`Angular`中我们可以在定义组件的`metadata`信息时，设定每个组件的变化检测策略。
```javascript
//OnPush策略
    selector: 'profile-card',
    template: `
       <div>
         <profile-name [name]='profile.name'></profile-name>
         <profile-age [age]='profile.age'></profile-age>
       </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
```
`ChangeDetectorRef`是组件的变化检测器的引用，我们可以在组件中的通过依赖注入的方式来获取该对象：
```javascript
import { ChangeDetectorRef } from '@angular/core';
@Component({}) class MyComponent {
    constructor(private cdRef: ChangeDetectorRef) {}
}
```
`ChangeDetectorRef`变化检测类中主要方法有以下几个：
angular中存在组件树，每个组件有变化检测，形成了变化检测树
- markForCheck() - 在组件的 metadata 中如果设置了 changeDetection: ChangeDetectionStrategy.OnPush 条件，那么变化检测不会再次执行，除非手动调用该方法。
- detach() - 从变化检测树中分离变化检测器，该组件的变化检测器将不再执行变化检测，除非手动调用 reattach() 方法。
- reattach() - 重新添加已分离的变化检测器，使得该组件及其子组件都能执行变化检测
- detectChanges() - 从该组件到各个子组件执行一次变化检测

使用`Observables`机制提升性能和不可变的对象类似，但当发生变化的时候，`Observables`不会创建新的模型，但我们可以通过订阅`Observables`对象，
在变化发生之后，进行视图更新。使用`Observables`机制的时候，我们同样需要设置组件的变化检测策略为`OnPush`。

总结一下变化检测的原理：Angular 应用是一个响应系统，变化检测总是从根组件到子组件这样一个从上到下的顺序开始执行，它是一棵线性的有向树，默认情况下，变化检测系统将会走遍整棵树，
但我们可以使用`OnPush`变化检测策略，在结合`Observables`对象，进而利用`ChangeDetectorRef`实例提供的方法，来实现局部的变化检测，最终提高系统的整体性能。

## Provider
在`Angular`中我们使用`Provider`来描述与`Token`关联的依赖对象的创建方式。`Angular`中依赖对象的创建方式有四种，它们分别是：
- useClass
- useValue
- useExisting
- useFactory
```javascript
//useClass
@Injectable()
export class ApiService {
   constructor(
      public http: Http,
      public loadingCtrl: LoadingController) {
   }
   ...
}

@NgModule({
  ...
  providers: [
       { provide: ApiService, useClass: ApiService } // 可使用简洁的语法，即直接使用ApiService
  ]
})
export class CoreModule { }

//useValue
{ provide: 'API_URL', useValue: 'http://my.api.com/v1' }

//useExisting
{ provide: 'ApiServiceAlias', useExisting: ApiService }

//useFactory
export function configFactory(config: AppConfig) {
  return () => config.load();
}

@NgModule({
  ...
  providers: [
       { provide: APP_INITIALIZER, useFactory: configFactory,
        deps: [AppConfig], multi: true }
  ]
})
export class CoreModule { }
```

## Directive
ngIf
- ngIf 指令用于根据表达式的值，在指定位置渲染 then 或 else 模板的内容。
- then 模板除非绑定到不同的值，否则默认是 ngIf 指令关联的内联模板。
- else 模板除非绑定对应的值，否则默认是 null。
```HTML
<div *ngIf="condition; then thenBlock; else elseBlock"></div>
<ng-template #thenBlock>...</ng-template>
<ng-template #elseBlock>...</ng-template>
```
ngForOf
```HTML
<li *ngFor="let item of items; index as i; trackBy: trackByFn">...</li>
<li *ngFor="let item of items; let i = index">
```
**`Angular`使用对象标识来跟踪可迭代对象中，每一项的插入和删除，并在`DOM`中做出相应的变化。但使用对象标识有一个问题，假设我们通过服务端获取可迭代对象，
当重新调用服务端接口获取新数据时，尽管服务端返回的数据没有变化，但它将产生一个新的对象。此时，`Angular`将完全销毁可迭代对象相关的`DOM`元素，
然后重新创建对应的`DOM`元素。这是一个很昂贵 (影响性能) 的操作，如果可能的话应该尽量避免。
因此，`Angular`提供了`trackBy`选项，让我们能够自定义跟踪算法。`trackBy`选项需绑定到一个包含`index`和`item`两个参数的函数对象。
若设定了`trackBy`选项，`Angular`将基于函数的返回值来跟踪变化。**

ngTmeplateOutlet
```HTML
<ng-container *ngTemplateOutlet="templateRefExp; context: contextExp"></ng-container>
<ng-container *ngTemplateOutlet="greet"></ng-container>
    <hr>
    <ng-container *ngTemplateOutlet="eng; context: myContext"></ng-container>
    <hr>
    <ng-container *ngTemplateOutlet="svk; context: myContext"></ng-container>
    <hr>
    <ng-template #greet><span>Hello</span></ng-template>
    <ng-template #eng let-name><span>Hello {{name}}!</span></ng-template>
    <ng-template #svk let-person="localSk"><span>Ahoj {{person}}!</span></ng-template>
```

自定义btn防抖动指令
```javascript
import { Directive, EventEmitter, HostListener, OnInit, Output, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from "rxjs/Subscription";
import 'rxjs/add/operator/debounceTime';

@Directive({
    selector: '[appDebounceClick]'
})
export class DebounceClickDirective implements OnInit, OnDestroy {
    @Input() debounceTime = 500;
    @Output() debounceClick = new EventEmitter();
    private clicks = new Subject<any>();
    private subscription: Subscription;

    constructor() { }

    ngOnInit() {
        this.subscription = this.clicks
            .debounceTime(this.debounceTime)
            .subscribe(e => this.debounceClick.emit(e));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    @HostListener('click', ['$event'])
    clickEvent(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
    }
}
```
`<ng-template>`和`<ng-container>`的区别：
- `<ng-template>`：使用 * 语法糖的结构指令，最终都会转换为`<ng-template>`或`<template>`模板指令，模板内的内容如果不进行处理，是不会在页面中显示的。
- `<ng-container`：是一个逻辑容器，可用于对节点进行分组，但不作为 DOM 树中的节点，它将被渲染为 HTML中的 comment 元素，它可用于避免添加额外的元素来使用结构指令。

## Decorator(装饰器)
装饰器是一些用于修饰 JavaScript 类的函数。Angular 定义了许多装饰器，这些装饰器会把一些特定种类的元数据附加到类上，以便 Angular 了解这些这些类的含义以及该如何使用它们。  
装饰器是一个表达式，该表达式被执行后，返回一个函数,函数的入参分别为 targe、name 和 descriptor
执行该函数后，可能返回 descriptor 对象，用于配置 target 对象  
装饰器的分类
- 类装饰器 (Class decorators)
- 属性装饰器 (Property decorators)
- 方法装饰器 (Method decorators)
- 参数装饰器 (Parameter decorators)

Angular内置装饰器分类
- 类装饰器
   @Component、@NgModule、@Pipe、@Injectable
- 属性装饰器
   @Input、@Output、@ContentChild、@ContentChildren、@ViewChild、@ViewChildren
- 方法装饰器
   @HostListener
- 参数装饰器
   @Inject、@Optional、@Self、@SkipSelf、@Host

## Pipe
用来对输入的数据进行处理，如大小写转换、数值和日期格式化等。
Angular内建管道及分类
---String -> String
- UpperCasePipe
- LowerCasePipe
- TitleCasePipe
---Number -> String
- DecimalPipe
- PercentPipe
- CurrencyPipe
---Object -> String
- JsonPipe
- DatePipe
---Tools
- SlicePipe
- AsyncPipe
- I18nPluralPipe
- I18nSelectPipe

管道参数
管道可以接收任意数量的参数，使用方式是在管道名称后面添加 : 和参数值。如 number: '1.4-4' ，若需要传递多个参数则参数之间用冒号隔开，具体示例如下：
<p>{{ 'semlinker' | slice:0:3 }}</p> <!-- Output: sem -->

管道链
我们可以将多个管道连接在一起，组成管道链对数据进行处理。
<p>{{ 'semlinker' | slice:0:3 | uppercase }}</p> <!-- Output: SEM -->

自定义Welcome管道
```javascript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'welcome' })
export class WelcomePipe implements PipeTransform {
  transform(value: string): string {
    if(!value) return value;
    if(typeof value !== 'string') {
      throw new Error('Invalid pipe argument for WelcomePipe');
    }
    return "Welcome to " + value;
  }
}

<p>{{ 'semlinker' | welcome }}</p> <!-- Output: Welcome to semlinker -->
```

管道分类
pure 管道（默认）：仅当管道输入值变化的时候，才执行转换操作，默认的类型是 pure 类型。
(备注：输入值变化是指原始数据类型如：string、number、boolean 等的数值或对象的引用值发生变化)
impure 管道：在每次变化检测期间都会执行，如鼠标点击或移动都会执行 impure 管道

async管道
```javascript
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'exe-observable-pipe',
    template: `
     <h4>Observable with AsyncPipe Component</h4>
     <p>{{ observable | async }}</p>
    `
})
export class ObservableAsyncPipeComponent {
    observable: Observable<number>

    constructor() {
        this.observable = this.getObservable();
    }

    getObservable(): Observable<number> {
        return Observable
            .interval(1000)
            .take(10)
            .map(v => v * v);
    }
}
```

## RxJS
RxJS 是基于观察者模式和迭代器模式以函数式编程思维来实现的。RxJS 中含有两个基本概念：Observables 与 Observer。
Observables 作为被观察者，是一个值或事件的流集合；而 Observer 则作为观察者，根据 Observables 进行处理。
Observables 与 Observer 之间的订阅发布关系(观察者模式) 如下：
订阅：Observer 通过 Observable 提供的 subscribe() 方法订阅 Observable。
发布：Observable 通过回调 next 方法向 Observer 发布事件。

Observable 对象可以被重复订阅
Observable 对象每次被订阅后，都会重新执行

BehaviorSubject 跟 Subject 最大的不同就是 BehaviorSubject 是用来保存当前最新的值，而不是单纯的发送事件。
BehaviorSubject 会记住最近一次发送的值，并把该值作为当前值保存在内部的属性中。

Promise vs Observable
- Promise
   返回单个值
   不可取消的
- Observable
   随着时间的推移发出多个值
   可以取消的
   支持 map、filter、reduce 等操作符
   延迟执行，当订阅的时候才会开始执行

mergeMap
```javascript
this.http.get(this.apiUrl)
      .map(res => res.json())
      .mergeMap(users => {
        this.username = users[6].username;
        return this.http.get(`${this.apiUrl}?username=${this.username}`)
          .map(res => res.json())
      })
      .subscribe(user => this.user = user);
```
forkJoin,该操作符与 Promise.all() 实现的功能类似
forkJoin 操作符接收一个 Observable 对象列表，然后并行地执行它们。
一旦列表的 Observable 对象都发出值后，forkJoin 操作符返回的 Observable 对象会发出新的值，即包含所有 Observable 对象输出值的列表
```javascript
let post1 = this.http.get(`${this.apiUrl}/1`);
    let post2 = this.http.get(`${this.apiUrl}/2`);

    Observable.forkJoin([post1, post2])
      .subscribe(results => {
        this.post1 = results[0];
        this.post2 = results[1];
      });
```

## Form
表单控件有以下 6 种状态：
- valid - 表单控件有效
- invalid - 表单控件无效
- pristine - 表单控件值未改变
- dirty - 表单控件值已改变
- touched - 表单控件已被访问过
- untouched - 表单控件未被访问过
```javascript
this.signupForm = this.fb.group({
  userName: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+_]+@[a-z0-9.-]+')]]
});
```
动态调整验证规则
```javascript
myControl.setValidators(Validators.email);
myControl.setValidators([Validators.required, Validators.maxLength(6)]);
myControl.clearValidators();
myControl.updateValueAndValidity();
```
动态调整验证规则功能
```javascript
ngOnInit(): void {
    ...
    this.signupForm.get('enableMobile').valueChanges
      .subscribe(value => this.checkMobile(value));     //监听值的变化
}

checkMobile(enableMobile: string): void {
  const mobileControl = this.signupForm.get('mobile');

  enableMobile === "1" ?
      mobileControl.setValidators([Validators.required,
        Validators.pattern('1(3|4|5|7|8)\\d{9}')]) :
      mobileControl.clearValidators();

    mobileControl.updateValueAndValidity();
}
```
更新模型的值，我们可以利用 FormGroup 对象的 patchValue() 方法：
```javascript
this.form.patchValue({
  name: 'Semlinker',
  event: {
    title: 'Angular 4.x\'s Road',
    location: 'Xiamen'
  }
});
```
对于 FormControl 对象来说，patchValue() 和 setValue() 这两个方法是等价的。此外 setValue() 方法中做了三件事：
- 更新控件当前值
- 判断是否注册 onChange 事件，若有则循环调用已注册的 changeFn 函数。
- 重新计算控件的值和验证状态
setValue() 方法相比 patchValue() 会更严格，会执行多个判断：
- 判断的是否为所有控件都设置更新值
- 判断控件是否存在
而 patchValue() 方法，会先使用 this.controls[name] 进行过滤，只更新参数 value 中设定控件的值。

## Router
根模块中使用`forRoot()`，子模块中使用`forChild()`
因为在`AppModule`中，`forRoot()`方法会导入路由模块中的指令和服务。
但对于子模块来说，`forChild()`方法仅会导入路由模块中定义的指令，而不会再次导入模块中定义的服务。

{ path: '/profile/:username', component: ProfileComponent }
我们已经建立一个动态路由，此时最重要的事情就是如何获取路由参数。要访问当前路由的相关信息，我们需要先从`@angular/router`模块中导入`ActivatedRoute`，
然后在组件类的构造函数中注入该对象，最后通过订阅该对象的`params`属性，来获取路由参数

子路由
```javascript
{
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: 'profile', component: ProfileSettingsComponent },
      { path: 'password', component: PasswordSettingsComponent }
    ]
}
```
接下来，我们需要做的最后一件事是在我们的`SettingsComponent`组件中添加`router-outlet`指令，因为我们要在设置页面中呈现子路由。
如果我们没有在`SettingsComponent`组件中添加`router-outlet`指令，尽管`/settings/password`匹配修改密码页面的路由地址，但修改密码页面将无法正常显示。
（也可以不定义父路由的`component`，那么`/settings/profile`和`/settings/password`路由定义的内容，将显示在`AppComponent`组件的`router-outlet`元素中。）

子模块
```javascript
{
    path: '',
    component: SettingsComponent,
    children: [
      { path: 'profile', component: ProfileSettingsComponent },
      { path: 'password', component: PasswordSettingsComponent }
    ]
}
```
主模块
```javascript
{
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule'
}
```
需要注意的是，我们没有将 SettingsModule 导入到我们的 AppModule 中，而是通过 loadChildren 属性，告诉 Angular 路由依据 loadChildren 属性
配置的路径去加载 SettingsModule 模块。这就是模块懒加载功能的具体应用，当用户访问 /settings/** 路径的时候，才会加载对应的 SettingsModule 模块，
这减少了应用启动时加载资源的大小。

我们传递一个字符串作为 loadChildren 的属性值，该字符串由三部分组成：
需要导入模块的相对路径
#分隔符
导出模块类的名称

路由指令
除了 router-outlet 指令，路由模块中还提供了一些其它指令

routerLink
`<a routerLink="/settings/password">Change password</a>`
如果我们想要链接到动态的路由地址，且该地址有一个 username 的路由变量，则我们可以按照以下方式配置 routerLink 对应的属性值：
`<a [routerLink]="['/profile', username]">`

routerLinkActive
通过使用 routerLinkActive 指令，当 a 元素对应的路由处于激活状态时，active 类将会自动添加到 a 元素上。
`<a routerLink="/settings/profile" routerLinkActive="active">Profile Settings</a>`

我们可以通过路由还提供的 API 实现与 routerLink 相同的功能。要使用 Router API，我们需要在组件类中注入 Router 对象
```javascript
 constructor(private router: Router) {}
 this.router.navigate(['/settings']);
```

假设当前的 URL 地址是：
/inbox/11/message/22(popup:compose)
当我们调用 router.navigateByUrl('/inbox/33/message/44') 方法后，此时的 URL 地址将变成 /inbox/33/message/44 。
但如果我们是调用 router.navigate('/inbox/33/message/44') 方法，当前的 URL 地址将变成 /inbox/33/message/44(popup:compose) 。

