# this

## this到底是什么

this 是在运行时进行绑定的，并不是在编写时绑定，他的上下文取决于函数调用时的各种条件。this 的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。

## 绑定规则

函数的执行过程中，调用位置决定 this 的绑定对象。

### 默认绑定

独立函数调用。可以把这条规则看作是无法应用其他规则时的默认规则。

> 代码如下

```javascript
function foot() {
    console.log(this.a);
}

var a = 2;
foo() // 2
```

> 在代码中，`foo ()`是直接使用不带任何修饰的函数引用进行调用的，因此只能使用<u>*默认绑定*</u>，无法应用其他规则

如果使用严格模式（strict mode），那么全局对象将无法使用<u>*默认绑定*</u>，因此 this 会绑定到 undefined ：

```javascript
function foo() {
    "use strict";
    console.log(this.a);
}

var a = 2;
foo(); // TypeError: this is undefined
```

> 只有`foo()`运行在非 strict mode 下时，<u>*默认绑定*</u>才能绑定到全局对象；严格模式下雨 `foo()`的调用位置无关

### 隐式绑定

另一条规则时调用位置是否有上下文对象，或者说是否被某个对象拥有或者包含。

```javascript
function foo() {
    console.log(this.a);
}

var obj = {
    a: 2,
    foo: foo;
};

obj.foo() // 2
```

> 函数 `foo()`被调用时 obj 对象“拥有”或者“包含”它

<u>*隐式绑定*</u>规则会把函数调用中的 this 绑定到这个上下文对象。因为调用 `foo()`时 this 被绑定到 obj，因此 this.a 和 obj.a 是一样的。

对象属性引用链中只有最顶层或者说最后一层会影响调用位置

```javascript
function foo() {
    console.log(this.a);
}

var obj2 = {
    a: 42,
    foo: foo
};

var obj1 = {
    a: 2,
    obj2: obj2
};

obj1.obj2.foo(); // 42（最后一层是obj2）
```

#### 隐式丢失

一个最常见的 this 绑定问题就是被<u>*隐式绑定*</u>的函数会<u>*丢失绑定*</u>对象，也就是说他会应用默认绑定，从而把 this 绑定到全局对象或者 undefined 上，取决于是否严格模式

```javascript
function foo() {
    console.log(this.a);
}

var obj = {
    a: 2,
    foo: foo
};

var bar = obj.foo; // 函数别名！
var a = "some code"; // a是全局对象的属性
bar(); // "some code"
```

> bar 是 obj.foo 的一个引用，它引用的是 foo 函数本身，因此此时的 `bar()`其实是一个不带任何修饰的函数调用，因此应用了<u>*默认绑定*</u>。

```javascript
function foo() {
    console.log(this.a);
}

function doFoo(fn) {
    // fn 其实引用的是foo
    fn(); // 调用位置
}

var obj = {
    a: 2,
    foo: foo
};

var a = "some code"; // a 是全局对象
doFoo(obj.foo); // "some code"
```

> 同上面一个例子一样，在 obj.foo 时，其 `foo()`中的 this 指向的是 obj 中的 `a: 2`，而后其以参数形式赋值给了`doFoo()`中的`fn()`，此时在调用`doFoo()`时 this 指向的是其环境下的全局对象 a。

<u>*隐式绑定*</u>时，我们必须在一个对象内部包含一个指向函数的属性，并通过这个属性间接引用函数，从而把 this 间接（隐式）绑定到这个对象上。

### 显式绑定

JavaScript 提供的绝大多书函数以及你自己创建的所有函数都可以使用 call(..) 和 apply(..) 方法。

它们的第一个参数是一个对象，它们会把这个对象绑定到 this，接着在调用函数时指定这个 this。因为你可以直接指定 this 的绑定对象，因此称之为<u>*显示绑定*</u>。

```javascript
function foo() {
    console.log(this.a);
}

var obj = {
    a: 2
};

foo.call(obj); // 2
```

> 通过 foo.call(..)， 我们可以在调用 foo 时强制把它的 this 绑定到 obj 上。

#### 硬绑定

<u>*硬绑定*</u>时解决隐式丢失的一种方法。

```javascript
function foo() {
	console.log( this.a );
}

var obj = {
    a:2
};

var bar = function() {
    foo.call( obj );
};

bar(); // 2
setTimeout( bar, 100 ); // 2
// 硬绑定的 bar 不可能再修改它的
this bar.call( window ); // 2
```

> 因为每次调用`bar()`时，都会在其内部手动的执行了`foo.call(obj)`，因此无论外部怎么调用和改变，执行到这步时，都会绑定到 obj 上，这种绑定是一种显示的强制绑定，我们称之为硬绑定。

<u>*硬绑定*</u>的典型应用场景就是创建一个包裹函数，传入所有的参数并返回接收到的所有值：

```javascript
function foo(something) {
    console.log(this.a, somethingh);
    return this.a + something;
}

var obj = {
    a: 2
};

var bar = function() {
    // foo 的 this 绑定到 obj ，并且把传入的实参传给 foo 中的 something
    return foo.paaly(obj, arguments);
}

var b = bar(3); // 2 3
console.log(b); // 5
```

 另一种使用方法是创建一个 i 可以重复使用的辅助函数：

```Javascript
function foo(something) {
    console.log(this.a, something);
    return this.a + something;
}

// 简单的辅助绑定函数
function bind(fn, obj) {
    return function() {
        return fn.apply(obj, arguments);
    };
}

var obj = {
    a: 2
};

var bar = bind(foo, obj);
var b = bar(3); // 2 3
console.log(b); // 5
```

由于<u>*硬绑定*</u>是一种非常常用的模式，所以在 ES5 中提供了内置的方法`Function.prototype.bind`，它的用法如下：

```javascript
function foo(something) {
    console.log(this.a, something);
    return this.a + something;
}

var obj = {
    a: 2
};

var bar = foo.bind(obj);
var b = bar(3); // 2 3
console.log(b); // 5
```

> bind(..) 会返回一个硬编码的新函数，它会把参数设置为 this 的上下文并调用原始函数。

#### API调用的“上下文”

第三方库的许多函数，以及 JavaScript 语言和宿主环境中许多的内置函数，都提供了一个可选参数，通常被称为“上下文”（context），其作用和 bind(..) 一样，确保你的回调函数使用指定的 this。

```javascript
function foo(el) {
    console.log(el, this.id);
}

var obj = {
    id: "something"
};

// 调用 foo(..) 时把 this 绑定到 obj
[1, 2, 3].forEach(foo, obj);
// 1 something 2 something 3 something
```

> 这些函数实际上就是通过 call(..) 或者 apply(..) 实现了<u>*显示绑定*</u>

### new绑定

使用 new 来调用函数，活着说发生构造函数调用时，会自动执行下面的操作。

1. 创建（或者说构造）一个全新的对象。
2. 这个新对象会被执行 [[ 原型 ]] 连接。
3. 这个新对象会绑定到函数调用的 this。
4. 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。

```javascript
function foo(a) {
    this.a = a;
}

var bar = new foo(2);
console.log(bar.a); // 2
```

> 使用 new 来调用 foo(..) 时，我们会构造一个新对象并把它绑定到 foo(..) 调用中的 this 上。new 时最后一种可以影响函数调用时 this 绑定行为的方法，称之为 <u>*new 绑定*</u>。

## 优先级

毫无疑问，<u>*默认绑定*</u>的优先级是四条规则中最低的。

```javascript
function foo() {
	console.log(this.a);
}

var obj1 = {
    a: 2,
    foo: foo
};

var obj2 = {
    a: 3,
    foo: foo
};

obj1.foo(); // 2
obj2.foo(); // 3

obj1.foo.call(obj2); // 3
obj2.foo.call(obj1); // 2
```

> <u>*显示绑定*</u>优先级高于<u>*隐式绑定*</u>

```javascript
function foo(something) {
    this.a = something;
}

var obj1 = {
    foo: foo
};

var obj2 = {}

obj1.foo(2);
console.log(obj1.a); // 2

obj1.foo.call(obj2, 3);
console.log(obj2.a); // 3

var bar = new obj1.foo(4);
console.log(obj1.a); // 2
console.log(bar.a); // 4
```

> <u>*new 绑定*</u>比<u>*隐式绑定*</u>优先级高

<u>*new 绑定*</u>和<u>*显式绑定*</u>没办法直接比较，但可以和<u>*硬绑定*</u>对比

```javascript
function foo(something) {
    this.a = something;
}

var obj1 = {};

var bar = foo.bind(obj1);
bar(2);
console.log(obj1.a); // 2

var baz = new bar(3);
console.log(obj1.a); //2
console.log(baz.a); //3
```

> bar 被硬绑定到 obj1 上，但是 new bar(3) 并没有预期的把 obj1.a 修改为 3。相反，new 修改了硬绑定(到 obj1 的)调用 bar(..) 中的 this。因为使用了 new 绑定，我们得到了一个名字为 baz 的新对象，并且 baz.a 的值是 3。	

### 判断this

判断函数在某个调用位置应用的是哪条规则。可这样判断：

1. 函数是否在 new 中调用（new 绑定）？如果是，this 绑定的是新创建的对象。var bar = new foo()
2. 函数是否通过 call、apply （显式绑定）或者硬绑定调用？如果是，this 绑定的是指定的对象。var bar = foo.call(obj)
3. 函数是否在某个上下文对象重化工调用（隐式绑定）？如果是，this 绑定的是哪个上下文对象。var bar = obj.foo()
4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 undefuned，否则绑定到全局对象。var bar = foo()

## 绑定例外

### 被忽略的this

如果把 null 或者 undefined 作为 this 的绑定对象传入 call、apply 或者 bind，这些值在调用时会被忽略，实际应用的是默认绑定规则：

```javascript
function foo() {
    console.log(this.a);
}

var a = 2;

foo.call(null); // 2
```

> 使用 null 来忽略 this 绑可能会产生一些副作用。如某个函数确实使用了 this （比如第三方库中的一个函数），那默认绑定规则会把 this 绑定到全局对象（在浏览器中这个对象是 window），这将导致不可预计的后果（比如修改全局对象）。

### 更安全的this

使用`Object.create(null)`来代替 null。

```javascript
function foo(a, b) {
    console.log("a:" + a + ", b:" + b);
}

// 我们使用DMZ空对象（比{}空得更彻底，不会创建 Object.prototype 这个委托）
var ø = Object.create(null);

// 把数组展开成参数
foo.apply(ø, [2, 3]); //a:2, b:3

// 使用 bind(..) 进行柯里化
var bar = foo.bind(ø, 2);
bar(3); // a:2, b:3
```

### 间接引用

需要注意的是，你有可能（有意或无意地）创建一个拿书的“间接引用”，这样调用这个函数会应用默认<u>*绑定规则*</u>。

间接引用最容易发生在赋值时：

```javascript
function foo() {
    console.log(this.a)
}

var a = 2;
var o = {a: 3, foo: foo};
var p = {a:4};

o.foo(); // 3
(p.foo = o.foo)(); // 2
```

> 赋值表达式 `p.foo = o.foo`的返回值是目标函数的引用，因此调用位置是 `foo()`而不是`p.foo()`或者`o.foo()`。这里会应用默认绑定。

### 软绑定

softBind 实现的<u>*软绑定*</u>功能：

```javascript
function foo() {
    console.log("name:" + this.name);
}

var obj = {name: "obj"},
    obj2 = {name: "obj2"},
    obj3 = {name: "obj3"};

var fooOBJ = foo.softBind(obj);

fooOBJ(); // name: obj

obj2.foo = foo.softBind(obj);
obj2.foo(); // name: obj2 <= 注意

fooOBJ.call(obj3); // name: obj3 <= 注意

setTimeout(obj2.foo, 10); // name: obj <= 注意
```

> 可以看到，<u>*软绑定*</u>版本的`foo()`可以手动将 this 绑定到 obj2 或者 obj3 上，单如果应用<u>*默认绑定*</u>，否则将 this 绑定到 obj。

### 箭头函数

在 ES6 中有一种无法使用上面规则的特殊函数类型：箭头函数。

箭头函数不使用 this 的四种标准规则，而是根据外层（函数或者全局）作用域来决定 this。

```javascript
function foo() {
    // 返回一个箭头函数
    return (a) => {
        // this 继承自 foo()
        console.log(this.a);
    };
}

var obj1 = {a:2};
var obj2 = {a:3};

var bar = foo.call(obj1);
bar.call(obj2); // 2 《= 注意不是 3 ！
```

> foo() 内部创建的箭头函数会捕获调用时 foo() 的 this。由于 foo() 的 this 绑定到 obj1，bar(引用箭头函数)的 this 也会绑定到 obj1，箭头函数的绑定无法被修改。(new 也不行!)

箭头函数可以像 bind(..) 一样确保函数的 this 被绑定到指定对象，在 ES6 之前我们已经在使用一种几乎和箭头函数完全一样的模式：

```javascript
function foo() {
    var self = this;
    setTimeout(function() {
        console.log(self.a);
    }, 100);
}

var obj = {a: 2};

foo.call(obj); // 2
```

如果你经常编写 this 风格的代码，但绝大部分时候会使用`self = this`或者箭头函数来否定 this 的机制，那你应当：

1. 只使用词法作用域并完全抛弃 this 风格代码；
2. 完全采用 this 风格，在必要时使用 bind(..)，尽量避免使用 `self = this`和箭头函数

## 小结

判断一个运行中函数的 this 绑定，需要找到这个函数的直接调用位置。找到后以下面四条规则判断 this 的绑定对象。

1. 由 new 调用？绑定到新创建的对象。
2. 由 call 或者 apply（或者bind）调用？绑定到指定的对象。
3. 由上下文对象调用？绑定到上下文对象。
4. 默认：在严格模式下绑定到 undefined，否则绑定到全局对象。

ES6 中的箭头函数不使用上面的规则，而是根据当前词法作用域来决定 this，具体说就是箭头函数会继承外层函数调用的 this 绑定（无论 this 绑定到什么）。这和 ES6 之前代码中的 `self = this`机制一样。

> 以上笔记出自《你不知道的JavaScript》（上卷）
