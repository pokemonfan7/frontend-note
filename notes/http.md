## HTTP2优化
- 二进制传输代替文本传输
- 多路复用：只用一个tcp连接来传输资源
- 头部压缩：下一次的请求只会带上相较于之前的请求所带的更新了的头部信息
- 服务器推送：当请求html文件时，服务器会将其中的css文件、js文件一同响应给客户端

## HTTPs加密机制
HTTPs 采用混合的加密机制，使用非对称密钥加密用于传输对称密钥来保证传输过程的安全性，之后使用对称密钥加密进行通信来保证通信过程的效率。

## 三次握手的原因
第三次握手是为了防止失效的连接请求到达服务器，让服务器错误打开连接。  
客户端发送的连接请求如果在网络中滞留，那么就会隔很长一段时间才能收到服务器端发回的连接确认。客户端等待一个超时重传时间之后，就会重新请求连接。但是这个滞留的连接请求最后还是会到达服务器，如果不进行三次握手，那么服务器就会打开两个连接。如果有第三次握手，客户端会忽略服务器之后发送的对滞留连接请求的连接确认，不进行第三次握手，因此就不会再次打开连接。

## Web安全
### xss(cross site scripting) 跨站脚本攻击
定义: 指攻击者在网页嵌入脚本，用户浏览网页触发恶意脚本执行  
XSS攻击分为3类：存储型（持久型）、反射型（非持久型）、基于DOM

如何防范:
- 设置HttpOnly以避免cookie劫持的危险
- 过滤，对诸如`<script>`、`<img>`、`<a>`等标签进行过滤
- 编码，像一些常见的符号，如`<>`在输入的时候要对其进行转换编码
- 限制，对于一些可以预期的输入可以通过限制长度强制截断来进行防御

### csrf(cross site request forgery) 跨站请求伪造
定义: 是一种劫持受信任用户向服务器发送非预期请求的攻击方式

如何防范:  
- 验证 HTTP Referer 字段
- 请求地址中添加 token 并验证
- HTTP 头中自定义属性并验证

### sql注入(SQL injection)
定义: 在未授权情况下，非法访问数据库信息  

如何防范:  
- 杜绝用户提交的参数入库并且执行
- 在代码层，不准出现sql语句
- 在web输入参数处，对所有的参数做sql转义
- 上线测试，需要使用sql自动注入工具进行所有的页面sql注入测试

## WebSocket
### 入门
```javascript
function socketConnect(url) {
    // 客户端与服务器进行连接
    let ws = new WebSocket(url); // 返回`WebSocket`对象，赋值给变量ws
    // 连接成功回调
    ws.onopen = e => {
        console.log('连接成功', e)
        ws.send('我发送消息给服务端'); // 客户端与服务器端通信
    }
    // 监听服务器端返回的信息
    ws.onmessage = e => {
        console.log('服务器端返回：', e.data)
        // do something
    }
    return ws; // 返回websocket对象
}
let wsValue = socketConnect('ws://121.40.165.18:8800'); // websocket对象
```

### 日常使用
```javascript
class WebSocketClass {
		/**
		 * @description: 初始化实例属性，保存参数
		 * @param {String} url ws的接口
		 * @param {Function} msgCallback 服务器信息的回调传数据给函数
		 * @param {String} name 可选值 用于区分ws，用于debugger
		 */
		constructor(url, msgCallback, name = 'default') {
			this.url = url;
			this.msgCallback = msgCallback;
			this.name = name;
			this.ws = null;  // websocket对象
			this.status = null; // websocket是否关闭
		}

		/**
		 * @description: 初始化 连接websocket或重连webSocket时调用
		 * @param {*} 可选值 要传的数据
		 */
		connect(data) {
			// 新建 WebSocket 实例
			this.ws = new WebSocket(this.url);
			this.ws.onopen = e => {
				// 连接ws成功回调
				this.status = 'open';
				console.log(`${this.name}连接成功`, e)
				// this.heartCheck();
				if (data !== undefined) {
					// 有要传的数据,就发给后端
					return this.ws.send(data);
				}
			}
			// 监听服务器端返回的信息
			this.ws.onmessage = e => {
				// 把数据传给回调函数，并执行回调
				// if (e.data === 'pong') {
				//     this.pingPong = 'pong'; // 服务器端返回pong,修改pingPong的状态
				// }
				return this.msgCallback(e.data);
			}
			// ws关闭回调
			this.ws.onclose = e => {
				this.closeHandle(e); // 判断是否关闭
			}
			// ws出错回调
			this.onerror = e => {
				this.closeHandle(e); // 判断是否关闭
			}
		}

		// heartCheck() {
		//     // 心跳机制的时间可以自己与后端约定
		//     this.pingPong = 'ping'; // ws的心跳机制状态值
		//     this.pingInterval = setInterval(() => {
		//         if (this.ws.readyState === 1) {
		//             // 检查ws为链接状态 才可发送
		//             this.ws.send('ping'); // 客户端发送ping
		//         }
		//     }, 10000)
		//     this.pongInterval = setInterval(() => {
		//         this.pingPong = false;
		//         if (this.pingPong === 'ping') {
		//             this.closeHandle('pingPong没有改变为pong'); // 没有返回pong 重启webSocket
		//         }
		//         // 重置为ping 若下一次 ping 发送失败 或者pong返回失败(pingPong不会改成pong)，将重启
		//         console.log('返回pong')
		//         this.pingPong = 'ping'
		//     }, 20000)
		// }
		// 发送信息给服务器
		sendHandle(data) {
			console.log(`${this.name}发送消息给服务器:`, data)
			return this.ws.send(data);
		}

		closeHandle(e = 'err') {
			// 因为webSocket并不稳定，规定只能手动关闭(调closeMyself方法)，否则就重连
			if (this.status !== 'close') {
				console.log(`${this.name}断开，重连websocket`, e)
				// if (this.pingInterval !== undefined && this.pongInterval !== undefined) {
				//     // 清除定时器
				//     clearInterval(this.pingInterval);
				//     clearInterval(this.pongInterval);
				// }
				this.connect(); // 重连
			} else {
				console.log(`${this.name}websocket手动关闭`)
			}
		}

		// 手动关闭WebSocket
		closeMyself() {
			console.log(`关闭${this.name}`)
			this.status = 'close';
			return this.ws.close();
		}
	}

	function someFn(data) {
		console.log('接收服务器消息的回调：', data);
	}

	// const wsValue = new WebSocketClass('ws://121.40.165.18:8800', someFn, 'wsName'); // 这个链接一天只能发送消息50次
	const wsValue = new WebSocketClass('wss://echo.websocket.org', someFn, 'wsName'); // 阮一峰老师教程链接
	wsValue.connect('立即与服务器通信'); // 连接服务器
	// setTimeout(() => {
	//     wsValue.sendHandle('传消息给服务器')
	// }, 1000);
	// setTimeout(() => {
	//     wsValue.closeMyself(); // 关闭ws
	// }, 10000)
```

WebSocket并不稳定，在使用一段时间后，可能会断开连接，貌似至今没有一个为何会断开连接的公论，所以我们需要让WebSocket保持连接状态，这里推荐两种方法。  
WebSocket设置变量，判断是否手动关闭连接：  
class类中就是用的这种方式:设置一个变量，在webSocket关闭/报错的回调中，判断是不是手动关闭的，如果不是的话，就重新连接，这样做的优缺点如下：
- 优点：请求较少(相对于心跳连接)，易设置。  
- 缺点：可能会导致丢失数据,在断开重连的这段时间中，恰好双方正在通信。

WebSocket心跳机制：  
因为第一种方案的缺点，并且可能会有其他一些未知情况导致断开连接而没有触发Error或Close事件。这样就导致实际连接已经断开了，而客户端和服务端却不知道，还在傻傻的等着消息来。

然后聪明的程序猿们想出了一种叫做心跳机制的解决方法：  
客户端就像心跳一样每隔固定的时间发送一次ping，来告诉服务器，我还活着，而服务器也会返回pong，来告诉客户端，服务器还活着。  
具体的实现方法，在上面class的注释中，将其打开，即可看到效果。

## TCP传输的三次握手四次挥手策略
`SYN`同步标志、`ACK`确认标志、`FIN`结束标志

### 三次握手建立连接
为了准确无误地把数据送达目标处，`TCP`协议采用了三次握手策略。  
用`TCP`协议把数据包送出去后，`TCP`不会对传送后的情况置之不理，它一定会向对方确认是否成功送达。握手过程中使用了`TCP`的标志：`SYN`和`ACK`。  
发送端首先发送一个带`SYN`标志的数据包给对方。接收端收到后，回传一个带有`SYN/ACK`标志的数据包以示传达确认信息。  
最后，发送端再回传一个带`ACK`标志的数据包，代表“握手”结束。  
若在握手过程中某个阶段莫名中断，`TCP`协议会再次以相同的顺序发送相同的数据包。

### 四次挥手断开连接
- 第一次挥手：主动关闭方发送一个`FIN`，用来关闭主动方到被动关闭方的数据传送，也就是主动关闭方告诉被动关闭方：我已经不会再给你发数据了(当然，在`FIN`包之前发送出去的数据，如果没有收到对应的`ACK`确认报文，主动关闭方依然会重发这些数据)，但是，此时主动关闭方还可以接受数据。
- 第二次挥手：被动关闭方收到`FIN`包后，发送一个`ACK`给对方，确认序号为收到序号+1（与`SYN`相同，一个`FIN`占用一个序号）。
- 第三次挥手：被动关闭方发送一个`FIN`，用来关闭被动关闭方到主动关闭方的数据传送，也就是告诉主动关闭方，我的数据也发送完了，不会再给你发数据了。
- 第四次挥手：主动关闭方收到`FIN`后，发送一个`ACK`给被动关闭方，确认序号为收到序号+1，至此，完成四次挥手。

## HTTP头信息控制缓存
强制缓存：200 from cache  
Expires：描述的是一个绝对时间，因为服务器时间和客户端时间可能存在差异，所以使用较少  
Cache-control：描述的是一个相对时间，在进行缓存命中的时候，都是利用客户端时间进行判断，管理更有效，安全一些 Cache-Control: max-age=3600  
协商缓存：304 not modified  
Last-Modified/If-Modified-Since：标示这个响应资源的最后修改时间。Last-Modified是服务器相应给客户端的，If-Modified-Sinces是客户端发给服务器，服务器判断这个缓存时间是否是最新的，是的话拿缓存。  
Etag/If-None-Match：Etag和Last-Modified类似，他是发送一个字符串来标识版本。

### 总结
- 浏览器端缓存分为200 from cache和304 not modified
- HTTP协议中Cache-Control 和 Expires可以用来设置新鲜度的限值，前者是HTTP1.1中新增的响应头，后者是HTTP1.0中的响应头。
- Cache-Control设置max-age（单位为s），而Expires指定的是具体的过期日期而不是秒数
- Cache-Control和Expires同时使用的话，Cache-Control会覆盖Expires
- 客户端不用关心ETag值如何产生，只要服务在资源状态发生变更的情况下将ETag值发送给它就行
- ETag常与If-None-Match或者If-Match一起，由客户端通过HTTP头信息(包括ETag值)发送给服务端处理。
- Last-Modified常与If-Modified-Since一起由客户端将Last-Modified值包括在HTTP头信息中发给服务端进行处理。
- 有些文档资源周期性的被重写，但实际内容没有改变。此时文件元数据中会显示文件最近的修改日期与If-Modified-Since不相同，导致不必要的响应。

## Etag
聪明的服务器开发者会把ETags和GET请求的“If-None-Match”头一起使用，这样可利用客户端（例如浏览器）的缓存。  
因为服务器首先产生ETag，服务器可在稍后使用它来判断页面是否已经被修改。  
本质上，客户端通过将该记号传回服务器要求服务器验证其（客户端）缓存。  
其过程如下：  
客户端请求一个页面（A）。  
服务器返回页面A，并在给A加上一个ETag。  
客户端展现该页面，并将页面连同ETag一起缓存。  
客户再次请求页面A，并将上次请求时服务器返回的ETag一起传递给服务器。  
服务器检查该ETag，并判断出该页面自上次客户端请求之后还未被修改，直接返回响应304（未修改——Not Modified）和一个空的响应体。  

## CDN的基本原理
广泛采用各种缓存服务器，将这些缓存服务器分布到用户访问相对集中的地区或网络中，在用户访问网站时，利用全局负载技术将用户的访问指向距离最近的工作正常的缓存服务器上，由缓存服务器直接响应用户请求。


