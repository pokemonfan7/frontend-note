## Class
### 基本语法
ES6 的类，完全可以看作构造函数的另一种写法。
```javascript
class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true
```
上面代码表明，类的数据类型就是函数，类本身就指向构造函数。  
使用的时候，也是直接对类使用new命令，跟构造函数的用法完全一致。

构造函数的prototype属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的prototype属性上面。  
在类的实例上面调用方法，其实就是调用原型上的方法。

**类的内部所有定义的方法，都是不可枚举的（non-enumerable）,这一点与 ES5 的行为不一致。**

### constructor方法
constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。  
constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象，此时实例对象将不再是原来类的实例  
类必须使用new调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用new也可以执行。

### 类的实例
与 ES5 一样，实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）。  
与 ES5 一样，类的所有实例共享一个原型对象。这也意味着，可以通过实例的`__proto__`属性为“类”添加方法。但不推荐使用，推荐使用`Object.getPrototypeOf` 方法来获取实例对象的原型，然后再来为原型添加方法/属性。

### setter&getter
与 ES5 一样，在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
```javascript
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 'getter'
```
上面代码中，prop属性有对应的存值函数和取值函数，因此赋值和读取行为都被自定义了。

### Class表达式
与函数一样，类也可以使用表达式的形式定义。
```javascript
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
```
上面代码使用表达式定义了一个类。需要注意的是，这个类的名字是MyClass而不是Me，Me只在 Class 的内部代码可用，指代当前类。  
如果类的内部没用到的话，可以省略Me，也就是可以写成下面的形式。  
`const MyClass = class { /* ... */ };`
采用 Class 表达式，可以写出立即执行的 Class。
```javascript
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('张三');

person.sayName(); // "张三"
```

### 静态方法
类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。  
**注意，如果静态方法包含this关键字，这个this指的是类，而不是实例。**
```javascript
class Foo {
  static bar() {
    this.baz();
  }
  static baz() {
    console.log('hello');
  }
  baz() {
    console.log('world');
  }
}

Foo.bar() // hello
```
上面代码中，静态方法bar调用了this.baz，这里的this指的是Foo类，而不是Foo的实例，等同于调用Foo.baz。另外，从这个例子还可以看出，静态方法可以与非静态方法重名。  
父类的静态方法，可以被子类继承。静态方法也是可以从super对象上调用的。

## Class继承
### 简介
**子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。**  
ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this。  

### Object.getPrototypeOf()
Object.getPrototypeOf方法可以用来从子类上获取父类。
`Object.getPrototypeOf(ColorPoint) === Point // true`
因此，可以使用这个方法判断，一个类是否继承了另一个类。

### super关键字
super这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。

第一种情况，super作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次super函数。  
**注意，super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B**  
作为函数时，super()只能用在子类的构造函数之中，用在其他地方就会报错。

第二种情况，super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。  
ES6 规定，在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例。  
由于this指向子类实例，所以如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性。  
如果super作为对象，用在静态方法之中，这时super将指向父类，而不是父类的原型对象。  
另外，在子类的静态方法中通过super调用父类的方法时，方法内部的this指向当前的子类，而不是子类的实例。

### 类的prototype属性和__proto__属性
1. 子类的__proto__属性，表示构造函数的继承，总是指向父类。
2. 子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性。

这样的结果是因为，类的继承是按照下面的模式实现的。
```javascript
class A {
}

class B {
}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);

// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);

const b = new B();
```
Object.setPrototypeOf方法的实现
```javascript
Object.setPrototypeOf = function (obj, proto) {
  obj.__proto__ = proto;
  return obj;
}
```
因此，就得到了上面的结果。
```javascript
Object.setPrototypeOf(B.prototype, A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;

Object.setPrototypeOf(B, A);
// 等同于
B.__proto__ = A;
```

下面，讨论两种情况。第一种，子类继承Object类。
```jvascript
class A extends Object {
}

A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
```
这种情况下，A其实就是构造函数Object的复制，A的实例就是Object的实例。

第二种情况，不存在任何继承。
```javascript
class A {
}

A.__proto__ === Function.prototype // true
A.prototype.__proto__ === Object.prototype // true
```
这种情况下，A作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承`Function.prototype`。但是，A调用后返回一个空对象（即Object实例），所以`A.prototype.__proto__`指向构造函数（Object）的prototype属性。

### 实例的`__proto__`属性
子类实例的__proto__属性的__proto__属性，指向父类实例的__proto__属性。也就是说，子类的原型的原型，是父类的原型。

### 原生构造函数的继承
原生构造函数是指语言内置的构造函数，通常用来生成数据结构。ECMAScript 的原生构造函数大致有下面这些。
```javascript
Boolean()
Number()
String()
Array()
Date()
Function()
RegExp()
Error()
Object()
```
以前，这些原生构造函数是无法继承的

ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承。下面是一个继承Array的例子。
```javascript
class MyArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new MyArray();
arr[0] = 12;
arr.length // 1

arr.length = 0;
arr[0] // undefined
```

**注意，继承Object的子类，有一个行为差异。**
```javascript
class NewObj extends Object{
  constructor(){
    super(...arguments);
  }
}
var o = new NewObj({attr: true});
o.attr === true  // false
```
上面代码中，NewObj继承了Object，但是无法通过super方法向父类Object传参。这是因为 ES6 改变了Object构造函数的行为，一旦发现Object方法不是通过new Object()这种形式调用，ES6 规定Object构造函数会忽略参数。

## promise
### Promise捕获错误与 try catch 等同
```javascript
var p1 = new Promise(function(resolve, reject) {
    throw Error('sync error')
})
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
//
var p1 = new Promise(function(resolve, reject) {
    setTimeout(() => {
        throw Error('async error')   
    })
})
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
//
var p1 = new Promise(function(resolve, reject) {
    resolve()
})
    .then(res => {
        throw Error('sync error') 
    })
```

正确答案是：
1. Error被catch到，最后console.log输出
2. 错误无法被catch，控制台报错
3. promise没有catch，错误被捕获后又被抛出，控制台报错

这里考查的主要是Promise的错误捕获，其实仔细想想js中能用的错误捕获也只能是try catch了，而try catch只能捕获同步错误，并且在没有传入错误监听的时候会将捕获到的错误抛出。

### Promise 拥有状态变化
```javascript
var p1 = new Promise(function(resolve, reject) {
    resolve(1)
    throw Error('sync error')
})
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
//
var p1 = new Promise(function(resolve, reject) {
    reject(2)
    resolve(1)
})
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
//
var p1 = new Promise(function(resolve, reject) {
    resolve(1)
})
    .then(res => {
        throw Error('sync error')
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

正确答案是：
1. 输出 1
2. 输出 2
3. console.log输出错误

Promise是一个有状态的容器，当状态被凝固了，后面的resolve或reject就不会被触发。简单的说就是同一个Promise只能触发一个状态监听（onFulfilled或onRejected）。

### Promise 方法中的回调是异步的
```javascript
var p1 = new Promise(function(resolve, reject) {
    resolve()
    setTimeout(() => {
        console.log(1)
    })
    console.log(2)
})
    .then(res => {
        console.log(3)
    })
console.log(4)
```

正确答案是：
web依次输出：2 4 3 1

### Promise 会存储返回值
```javascript
var p1 = new Promise(function(resolve, reject) {
    reject(1)
})
    .catch(err => {
        console.log(err)
        return 2
    })

setTimeout(() => {
    p1
        .then(res => console.log(res))
}, 1000)
```

正确答案是：
先输出 1
1秒后输出 2

Promise会将最后的值存储起来，如果在下次使用promise方法的时候回直接返回该值的promise。

### Promise 方法每次都返回一个新的Promise
```javascript
var p1 = new Promise(function(resolve, reject) {
    reject(1)
})
    .then(
        res => {
            console.log(res)
            return 2
        },
        err => {
            console.log(err)
            return 3
        }
    )
    .catch(err => {
        console.log(err)
        return 4
    })
    .finally(res => {
        console.log(res)
        return 5
    })
    .then(
        res => console.log(res),
        err => console.log(err)
    )
```

正确答案是：
依次输出：1 undefined 3

Promise能够链式调用的原因是它的每一个方法都返回新的promise，哪怕是finally方法，特殊的是fanilly会返回上一个promise的值包装成的新promise，并且finally也不接收参数，因为无论Promise是reject还是fulfill它都会被调用。
***
### 基本用法
ES6 规定，Promise对象是一个构造函数，用来生成Promise实例。  
下面代码创造了一个Promise实例。
```javascript
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数。
```javascript
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

Promise 新建后就会立即执行。

下面是一个用Promise对象实现的 Ajax 操作的例子。
```javascript
const getJSON = function(url) {
  const promise = new Promise(function(resolve, reject){
    const handler = function() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    const client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();

  });

  return promise;
};

getJSON("/posts.json").then(function(json) {
  console.log('Contents: ' + json);
}, function(error) {
  console.error('出错了', error);
});
```
上面代码中，getJSON是对 XMLHttpRequest 对象的封装，用于发出一个针对 JSON 数据的 HTTP 请求，并且返回一个Promise对象。

resolve函数的参数除了正常的值以外，还可能是另一个 Promise 实例
```javascript
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
// Error: fail
```
上面代码中，p1是一个 Promise，3 秒之后变为rejected。p2的状态在 1 秒之后改变，resolve方法返回的是p1。由于p2返回的是另一个 Promise，导致p2自己的状态无效了，由p1的状态决定p2的状态。所以，后面的then语句都变成针对后者（p1）。又过了 2 秒，p1变为rejected，导致触发catch方法指定的回调函数。

调用resolve或reject并不会终结 Promise 的参数函数的执行。
```javascript
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```

### Promise.prototype.then
then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即then方法后面再调用另一个then方法。
```javascript
getJSON("/posts.json").then(function(json) {
  return json.post;
}).then(function(post) {
  // ...
});
```
上面的代码使用then方法，依次指定了两个回调函数。第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数。

采用链式的then，可以指定一组按照次序调用的回调函数。这时，前一个回调函数，有可能返回的还是一个Promise对象（即有异步操作），这时后一个回调函数，就会等待该Promise对象的状态发生变化，才会被调用。

### Promise.prototype.catch
Promise.prototype.catch方法是.then(null, rejection)或.then(undefined, rejection)的别名，用于指定发生错误时的回调函数。
```javascript
getJSON('/posts.json').then(function(posts) {
  // ...
}).catch(function(error) {
  // 处理 getJSON 和 前一个回调函数运行时发生的错误
  console.log('发生错误！', error);
});
```
上面代码中，getJSON方法返回一个 Promise 对象，如果该对象状态变为resolved，则会调用then方法指定的回调函数；如果异步操作抛出错误，状态就会变为rejected，就会调用catch方法指定的回调函数，处理这个错误。**另外，then方法指定的回调函数，如果运行中抛出错误，也会被catch方法捕获。**

如果 Promise 状态已经变成resolved，再抛出错误是无效的。

Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获。
```javascript
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
});
```
上面代码中，一共有三个 Promise 对象：一个由getJSON产生，两个由then产生。它们之中任何一个抛出的错误，都会被最后一个catch捕获。

跟传统的try/catch代码块不同的是，如果没有使用catch方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。
```javascript
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  console.log('everything is great');
});

setTimeout(() => { console.log(123) }, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123
```
上面代码中，someAsyncThing函数产生的 Promise 对象，内部有语法错误。浏览器运行到这一行，会打印出错误提示ReferenceError: x is not defined，但是不会退出进程、终止脚本执行，2 秒之后还是会输出123。这就是说，Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”。

catch方法之中，还能再抛出错误。

### Promise.prototype.finally
finally方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是fulfilled还是rejected。这表明，finally方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。

### Promise.all
Promise.all方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

`const p = Promise.all([p1, p2, p3]);`

上面代码中，Promise.all方法接受一个数组作为参数，p1、p2、p3都是 Promise 实例，如果不是，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。（Promise.all方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。）

p的状态由p1、p2、p3决定，分成两种情况:
- 只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
- 只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。

**注意，如果作为参数的 Promise 实例，自己定义了catch方法，那么它一旦被rejected，并不会触发Promise.all()的catch方法。**

### Promise.race
Promise.race方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

`const p = Promise.race([p1, p2, p3]);`

上面代码中，只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。

### Promise.resolve
Promise.resolve等价于下面的写法。
```javascript
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```
1. 参数是一个 Promise 实例
如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。

2. 参数是一个thenable对象
thenable对象指的是具有then方法的对象，比如下面这个对象。
```javascript
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};
```
Promise.resolve方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then方法。

3. 参数不是具有then方法的对象，或根本就不是对象
如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的 Promise 对象，状态为resolved。  
返回 Promise 实例的状态从一生成就是resolved，所以回调函数会立即执行。Promise.resolve方法的参数，会同时传给回调函数。

4. 不带有任何参数
Promise.resolve方法允许调用时不带参数，直接返回一个resolved状态的 Promise 对象。  
所以，如果希望得到一个 Promise 对象，比较方便的方法就是直接调用Promise.resolve方法。
```javascript
const p = Promise.resolve();

p.then(function () {
  // ...
});
```
上面代码的变量p就是一个 Promise 对象。p.then执行时间和普通 Promise 对象一样

### Promise.reject
```javascript
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
});
// 出错了
```
上面代码生成一个 Promise 对象的实例p，状态为rejected，回调函数会立即执行。

**注意，Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。这一点与Promise.resolve方法不一致。**

### Promise.try
实际开发中，经常遇到一种情况：不知道或者不想区分，函数f是同步函数还是异步操作，但是想用 Promise 来处理它。因为这样就可以不管f是否包含异步操作，都用then方法指定下一步流程，用catch方法处理f抛出的错误。
```javascript
Promise.try(() => database.users.get({id: userId}))
  .then(...)
  .catch(...)
```
事实上，Promise.try就是模拟try代码块，就像promise.catch模拟的是catch代码块。

## Object.seal()、Object.freeze()
- `Object.seal()`密封的对象可以改变它们现有的属性。
- `Object.freeze()`冻结的对象中现有属性是不可变的。

## 声明变量
- ES5:`var` `function`
- ES6:`let` `const` `import` `class`

## String(字符串)
- includes(): 返回布尔值，表示是否找到了参数字符串。支持第二个参数，表示开始搜索的位置。针对从第n个位置直到字符串结束。
- startsWith(): 返回布尔值，表示参数字符串是否在原字符串的头部。支持第二个参数，表示开始搜索的位置。针对从第n个位置直到字符串结束。
- endsWith(): 返回布尔值，表示参数字符串是否在原字符串的尾部。支持第二个参数，表示开始搜索的位置。针对前n个字符。
- repeat():
   - 'na'.repeat(2.4) //'nana'
   1. 参数先进行向下取整运算Math.floor()
   2. 参数是负数或者Infinity，会报错。
   3. 参数是NaN相当于0
- padStart():
   - `'x'.padStart(5, 'ab') // 'ababx'`
   - `'x'.padStart(4, 'ab') // 'abax'`
      1. `padStart()`的常见用途是为数值补全指定位数。下面代码生成 10 位的数值字符串。
         - `'1'.padStart(10, '0') // "0000000001"`
         - `'12'.padStart(10, '0') // "0000000012"`
         - `'123456'.padStart(10, '0') // "0000123456"`
      2. 另一个用途是提示字符串格式。
         - `'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"`
         - `'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"`
- padEnd():
   - `'x'.padEnd(5, 'ab') // 'xabab'`
   - `'x'.padEnd(4, 'ab') // 'xaba'`

## number(数字)
- Number.isFinite(): 用来检查一个数值是否为有限的（finite），即不是Infinity。如果参数类型不是数值，一律返回false。
- Number.isNaN(): 用来检查一个值是否为NaN。如果参数类型不是NaN，Number.isNaN一律返回false。

### 指数运算符(**)
- 2 ** 2 // 4
- 2 ** 3 // 8

### Math对象拓展
- Math.trunc(): 用于去除一个数的小数部分，返回整数部分。
- Math.cbrt(): 用于计算一个数的立方根。
- Math.hypot(): 返回所有参数的平方和的平方根。
   - Math.hypot(3, 4)  // 5

## function(函数)
### 函数参数的默认值
一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。
等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。
```javascript
let x = 1;

function f(y = x) {
  let x = 2;
  console.log(y);
}

f() // 1
```
上面代码中，函数f调用时，参数y = x形成一个单独的作用域。这个作用域里面，变量x本身没有定义，所以指向外层的全局变量x。
函数调用时，函数体内部的局部变量x影响不到默认值变量x。

利用参数默认值，可以指定某一个参数不得省略，如果省略就抛出一个错误。
```javascript
function throwIfMissing() {
  throw new Error('Missing parameter');
}

function foo(mustBeProvided = throwIfMissing()) {
  return mustBeProvided;
}

foo()
// Error: Missing parameter
```

### rest参数
ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了。
rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。
```javascript
function push(array, ...items) {
  items.forEach(function(item) {
    array.push(item);
    console.log(item);
  });
}

var a = [];
push(a, 1, 2, 3)
```
注意，rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错。

### 函数name属性
函数的name属性，返回该函数的函数名。
```javascript
var f = function () {};

// ES5
f.name // ""

// ES6
f.name // "f"
```

## Array(数组)
### 扩展运算符(...)
- 扩展运算符的应用
   1. 复制数组
   2. 合并数组(不过，...和concat都是浅拷贝，使用的时候需要注意。数组中有对象时，是对象的引用)
   3. 与解构赋值结合（如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则会报错。）
   4. 字符串
      扩展运算符还可以将字符串转为真正的数组。
      [...'hello']   // [ "h", "e", "l", "l", "o" ]
      上面的写法，有一个重要的好处，那就是能够正确识别四个字节的 Unicode 字符。
   5. 实现了 Iterator 接口的对象
      任何 Iterator 接口的对象，都可以用扩展运算符转为真正的数组。
   6. Map 和 Set 结构，Generator 函数
      扩展运算符内部调用的是数据结构的 Iterator 接口，因此只要具有 Iterator 接口的对象，都可以使用扩展运算符，比如 Map 结构。
      ```javascript
      let map = new Map([
        [1, 'one'],
        [2, 'two'],
        [3, 'three'],
      ]);

      let arr = [...map.keys()]; // [1, 2, 3]
      ```
      Generator 函数运行后，返回一个遍历器对象，因此也可以使用扩展运算符。
      ```javascript
      const go = function*(){
        yield 1;
        yield 2;
        yield 3;
      };

      [...go()] // [1, 2, 3]
      ```

### Array.from
Array.from方法用于将两类对象转为真正的数组：
类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。

Array.from方法还支持类似数组的对象。所谓类似数组的对象，本质特征只有一点，即必须有length属性。因此，任何有length属性的对象，
都可以通过Array.from方法转为数组，而此时扩展运算符就无法转换。
```javascript
Array.from({ length: 3 });
// [ undefined, undefined, undefined ]
```

Array.from还可以接受第二个参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组。
```javascript
Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);
Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]
```

### Array.of
Array.of方法用于将一组值，转换为数组。
```javascript
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1
这个方法的主要目的，是弥补数组构造函数Array()的不足。因为参数个数的不同，会导致Array()的行为有差异。
Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]
```

### find()、findIndex()
这两个方法都可以接受第二个参数，用来绑定回调函数的this对象。
```javascript
function f(v){
  return v > this.age;
}
let person = {name: 'John', age: 20};
[10, 12, 26, 15].find(f, person);
```
另外，这两个方法都可以发现NaN，弥补了数组的indexOf方法的不足。

### fill()
fill方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。
```javascript
['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']
```
注意，如果填充的类型为对象，那么被赋值的是同一个内存地址的对象，而不是深拷贝对象。

### keys()、values()、entries()
keys()是对键名的遍历
values()是对键值的遍历
entries()是对键值对的遍历
```javascript
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"
```

### includes()
Array.prototype.includes方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的includes方法类似。
indexOf方法有两个缺点:
1. 不够语义化，它的含义是找到参数值的第一个出现位置，所以要去比较是否不等于-1，表达起来不够直观。
2. 内部使用严格相等运算符（===）进行判断，这会导致对NaN的误判。

另外，Map 和 Set 数据结构有一个has方法，需要注意与includes区分。

Map 结构的has方法，是用来查找键名的，比如Map.prototype.has(key)、WeakMap.prototype.has(key)、Reflect.has(target, propertyKey)。
Set 结构的has方法，是用来查找值的，比如Set.prototype.has(value)、WeakSet.prototype.has(value)。

### flat()、flatMap()
数组的成员有时还是数组，Array.prototype.flat()用于将嵌套的数组“拉平”，变成一维的数组。
该方法返回一个新数组，对原数据没有影响。
```javascript
[1, 2, [3, 4]].flat()
// [1, 2, 3, 4]

[1, 2, [3, [4, 5]]].flat(2)
// [1, 2, 3, 4, 5]
```
上面代码中，flat()的参数为2，表示要“拉平”两层的嵌套数组。  
如果不管有多少层嵌套，都要转成一维数组，可以用Infinity关键字作为参数。
```javascript
[1, [2, [3]]].flat(Infinity)
// [1, 2, 3]
```
flatMap()方法对原数组的每个成员执行一个函数（相当于执行Array.prototype.map()），
然后对返回值组成的数组执行flat()方法。该方法返回一个新数组，不改变原数组。
```javascript
// 相当于 [[2, 4], [3, 6], [4, 8]].flat()
[2, 3, 4].flatMap((x) => [x, x * 2])
// [2, 4, 3, 6, 4, 8]
```
flatMap()只能展开一层数组。

### 数组空位
由于空位的处理规则非常不统一，所以建议避免出现空位。

### reduce替代filter+map
```javascript
const characters = [
  { name: 'ironman', env: 'marvel' },
  { name: 'black_widow', env: 'marvel' },
  { name: 'wonder_woman', env: 'dc_comics' },
];

console.log(
characters.reduce((acc, character) => {
return character.env === 'marvel'?
acc.concat(Object.assign({}, character, { alsoSeenIn: ['Avengers'] })):
acc;
}, [])
)
```

## Object(对象)
### 可枚举性
对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。
Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。
```javascript
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,
//    writable: true,
//    enumerable: true,
//    configurable: true
//  }
```

for...in会返回继承的属性
总的来说，操作中引入继承的属性会让问题复杂化，大多数时候，我们只关心对象自身的属性。
所以，尽量不要用for...in循环，而用Object.keys()代替。

### Object.is()
Object.is用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。
不同之处只有两个：一是+0不等于-0，二是NaN等于自身。
```javascript
+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

### Object.assign()
Object.assign方法的第一个参数是目标对象，后面的参数都是源对象。

其他类型的值（数值、字符串、布尔值、null、undefined）不在首参数，不会报错。
但是，除了字符串会以数组形式，拷贝入目标对象，其他值都不会产生效果。这是因为只有字符串的包装对象，会产生可枚举属性。
```javascript
const v1 = 'abc';
const v2 = true;
const v3 = 10;

const obj = Object.assign({}, v1, v2, v3);
console.log(obj); // { "0": "a", "1": "b", "2": "c" }
```
Object.assign拷贝的属性是有限制的，只拷贝源对象的自身属性（不拷贝继承属性），也不拷贝不可枚举的属性（enumerable: false）。

### Object.setPrototypeOf()、Object.getPrototypeOf()
Object.setPrototypeOf()方法的作用与__proto__相同，用来设置一个对象的prototype对象，返回参数对象本身。它是 ES6 正式推荐的设置原型对象的方法。

Object.getPrototypeOf()方法与Object.setPrototypeOf方法配套，用于读取一个对象的原型对象。

### Object.fromEntries() !目前仅火狐支持
Object.fromEntries()方法是Object.entries()的逆操作，用于将一个键值对数组转为对象。
```javascript
Object.fromEntries([
  ['foo', 'bar'],
  ['baz', 42]
])
// { foo: "bar", baz: 42 }
```
该方法的主要目的，是将键值对的数据结构还原为对象，因此特别适合将 Map 结构转为对象。

该方法的一个用处是配合URLSearchParams对象，将查询字符串转为对象。
```javascript
Object.fromEntries(new URLSearchParams('foo=bar&baz=qux'))
// { foo: "bar", baz: "qux" }
```

### super
我们知道，this关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字super，指向当前对象的原型对象。
注意，super关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错。

### 遍历对象
1. for...in  循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。
2. Object.keys(obj)  返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。
3. Object.getOwnPropertyNames(obj)  返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。
4. Object.getOwnPropertySymbols(obj)  返回一个数组，包含对象自身的所有 Symbol 属性的键名。
5. Reflect.ownKeys(obj)  返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。

首先遍历所有数值键，按照数值升序排列。
其次遍历所有字符串键，按照加入时间升序排列。
最后遍历所有 Symbol 键，按照加入时间升序排列。

## Set
ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

Set 本身是一个构造函数，用来生成 Set 数据结构。

const s = new Set();

Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===），
主要的区别是NaN等于自身，而精确相等运算符认为NaN不等于自身。
在Set中，两个对象总是不相等的。

Array.from方法可以将 Set 结构转为数组。
```javascript
const items = new Set([1, 2, 3, 4, 5]);
const array = Array.from(items);
```

### Set的实例属性和方法
Set 结构的实例有以下属性:
1. Set.prototype.constructor：构造函数，默认就是Set函数。
2. Set.prototype.size：返回Set实例的成员总数。

Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。
四个操作方法:
1. add(value)：添加某个值，返回 Set 结构本身。
2. delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
3. has(value)：返回一个布尔值，表示该值是否为Set的成员。
4. clear()：清除所有成员，没有返回值。
```javascript
s.add(1).add(2).add(2);
// 注意2被加入了两次
s.size // 2
s.has(1) // true
s.has(2) // true
s.has(3) // false
s.delete(2);
s.has(2) // false
```
四个遍历方法:
1. keys()：返回键名的遍历器
2. values()：返回键值的遍历器
3. entries()：返回键值对的遍历器
4. forEach()：使用回调函数遍历每个成员

需要特别指出的是，Set的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用 Set 保存一个回调函数列表，调用时就能保证按照添加顺序调用。
由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致。

数组的map和filter方法也可以间接用于 Set 了。
```javascript
let set = new Set([1, 2, 3]);
set = new Set([...set].map(x => x * 2));
// 返回Set结构：{2, 4, 6}

let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));
// 返回Set结构：{2, 4}
```

因此使用 Set 可以很容易地实现并集（Union）、交集（Intersect）和差集（Difference）。
```javascript
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// 差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```

## Map
### Map的实例属性和方法
Map 结构的实例有以下属性:
1. size 属性：size属性返回 Map 结构的成员总数。

五个操作方法:
1. set(key, value)
set方法设置键名key对应的键值为value，然后返回整个 Map 结构。如果key已经有值，则键值会被更新，否则就新生成该键。
```javascript
const m = new Map();

m.set('edition', 6)        // 键是字符串
m.set(262, 'standard')     // 键是数值
m.set(undefined, 'nah')    // 键是 undefined
```
set方法返回的是当前的Map对象，因此可以采用链式写法。
```javascript
let map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');
```
2. get(key)
get方法读取key对应的键值，如果找不到key，返回undefined。
3. has(key)
has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
4. delete(key)
delete方法删除某个键，返回true。如果删除失败，返回false。
5. clear()
clear方法清除所有成员，没有返回值。

遍历方法:
Map 结构原生提供三个遍历器生成函数和一个遍历方法:
1. keys()：返回键名的遍历器。
2. values()：返回键值的遍历器。
3. entries()：返回所有成员的遍历器。
4. forEach()：遍历 Map 的所有成员。

需要特别注意的是，Map 的遍历顺序就是插入顺序。
```javascript
const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let key of map.keys()) {
  console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
  console.log(value);
}
// "no"
// "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"
```

Map 结构转为数组结构，比较快速的方法是使用扩展运算符（...）。
```javascript
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]
```

结合数组的map方法、filter方法，可以实现 Map 的遍历和过滤（Map 本身没有map和filter方法）。
```javascript
const map0 = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');

const map1 = new Map(
  [...map0].filter(([k, v]) => k < 3)
);
// 产生 Map 结构 {1 => 'a', 2 => 'b'}

const map2 = new Map(
  [...map0].map(([k, v]) => [k * 2, '_' + v])
    );
// 产生 Map 结构 {2 => '_a', 4 => '_b', 6 => '_c'}
```

## 与其他数据结构的互相转换
1. Map转为数组
Map 转为数组最方便的方法，就是使用扩展运算符（...）。
```javascript
const myMap = new Map()
  .set(true, 7)
  .set({foo: 3}, ['abc']);
[...myMap]
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
```
2. 数组转为Map
将数组传入 Map 构造函数，就可以转为 Map。
```javascript
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
// Map {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }
```
3. Map 转为对象
如果所有 Map 的键都是字符串，它可以无损地转为对象。
```javascript
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map()
  .set('yes', true)
  .set('no', false);
strMapToObj(myMap)
// { yes: true, no: false }
```
如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。
4. 对象转为 Map
```javascript
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

objToStrMap({yes: true, no: false})
// Map {"yes" => true, "no" => false}
```
5. Map 转为 JSON
Map 转为 JSON 要区分两种情况。一种情况是，Map 的键名都是字符串，这时可以选择转为对象 JSON。
```javascript
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap)
// '{"yes":true,"no":false}'
```
另一种情况是，Map 的键名有非字符串，这时可以选择转为数组 JSON。
```javascript
function mapToArrayJson(map) {
  return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap)
// '[[true,7],[{"foo":3},["abc"]]]'
```
6. JSON 转为 Map
JSON 转为 Map，正常情况下，所有键名都是字符串。
```javascript
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}

jsonToStrMap('{"yes": true, "no": false}')
// Map {'yes' => true, 'no' => false}
```
但是，有一种特殊情况，整个 JSON 就是一个数组，且每个数组成员本身，又是一个有两个成员的数组。
这时，它可以一一对应地转为 Map。这往往是 Map 转为数组 JSON 的逆操作。
```javascript
function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
}

jsonToMap('[[true,7],[{"foo":3},["abc"]]]')
// Map {true => 7, Object {foo: 3} => ['abc']}
```

## Iterator
Iterator 接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即for...of循环。当使用for...of循环遍历某种数据结构时，
该循环会自动去寻找 Iterator 接口。

一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是“可遍历的”（iterable）。

ES6 规定，默认的 Iterator 接口部署在数据结构的Symbol.iterator属性，


原生具备 Iterator 接口的数据结构如下。

Array
Map
Set
String
TypedArray
函数的 arguments 对象
NodeList 对象

一个数据结构只要部署了Symbol.iterator属性，就被视为具有 iterator 接口，就可以用for...of循环遍历它的成员。
也就是说，for...of循环内部调用的是数据结构的Symbol.iterator方法。

for...of循环相比上面几种做法，有一些显著的优点。
```javascript
for (let value of myArray) {
  console.log(value);
}
```
有着同for...in一样的简洁语法，但是没有for...in那些缺点。
不同于forEach方法，它可以与break、continue和return配合使用。
提供了遍历所有数据结构的统一操作接口。
