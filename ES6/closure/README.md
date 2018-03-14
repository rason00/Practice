# 闭包

**<u>当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数实在当前词法作用域之外执行。</u>**

```javascript
function foo() {
    var a = 2;
    
    function bar() {
        console.log(a); // 2
    }
    
    return bar;
}

var baz = foo();

baz(); // 2 <== 这就是闭包！
```

> 函数`bar()`的词法作用域能够访问`foo()`的内部作用域。

无论使用何种方式对函数类型的值进行传递，当函数在别处被调用时都可以观察到闭包。

```javascript
function foo() {
    var a = 2;

    function baz() {
        console.log(a); // 2
    }
    
    bar(baz);
}

function bar(fn) {
    fn(); // <== 这也是闭包！
}
```

> 把内部函数 baz 传递给 bar，当调用这个内部函数时（现在叫作fn），它涵盖`foo()`内部作用域的闭包就可以观察到了，因为它能够访问 a。

传递函数也可以是间接的：

```javascript
var fn;
function foo() {
    var a = 2;
    
    function baz() {
        console.log(a);
    }
    
    fn = baz; // 将 baz 分配给全局变量 fn
}

function bar() {
    fn(); // 闭包！
}

foo();

bar(); // 2
```

> 无论通过何种手段将内部函数传递到所在词法作用域以外，它都会持有对原始定义作用域的引用，无论在何处执行这个函数都会使用闭包。

你已经写过的闭包

```javascript
function wait(msg) {
    setTimeout(function timer() {
        console.log(msg);
    }, 1000);
}

wait('something');
```

> timer 具有函数 wait(..) 的作用域闭包，wait(..) 在执行 1000 毫秒后，它的内部作用域没有消失，timer 函数依然可以访问传入的 msg 。

或者jQuery的闭包

```javascript
function foo(name, selector) {
    $(selector).click(function activator() {
        console.log(name);
    })
}

foo('sonmething1', '#test1');
foo('sonmething2', '#test2');
```

> 上面 jq 代码个人理解为，函数传递，`foo()`里面把`activator()`传递给了 jq 里面的 click，当调用完`foo()`函数后，其没有被销毁，在外部其他地方触发了 click 时，依旧可以访问到其所在作用域中的参数 name，这就是闭包。

**<u>本质上无论何时何地，如果将函数（访问它们各自的词法作用域）当作第一级的值类型并到处传递，你就会看到闭包在这些函数中的应用。在定时器、事件监听器、Ajax请求、跨窗口通信、Web Workers或者任何其他的异步（或者同步）任务中，只要使用了回调函数，实际上就是在使用闭包！</u>**

## 循环和闭包

分别输出1～5

```javascript
for(var i = 1; i <= 5; i++) {
    setTimeout(function timer() {
        console.log(i);
    }, i * 1000);
}
// 6 6 6 6 6
```

> 上面代码会输出 5 个 6，因为函数回调会在循环结束后才执行。事实上，哪怕定时设为0毫秒，里面的 timer 回调函数也是在循环结束后才执行，因此会输出 6。

我们需要一个闭包作用域，IIFE（立即执行函数式）会通过声明并立即执行一个函数来创建作用域。

```javascript
for(var i = 1; i <= 5; i++) {
    (function() {
        setTimeout(function() {
            console.log(i);
        }, i * 1000);
    })();
}
// 6 6 6 6 6
```

> 事实上，这样还是不行，因为现在创建了一个立即执行函数的确有了一个封闭的作用域，但是作用域里面仅仅只有一个 setTimeout，其参数 i 并没有得到保存，以至于最后还是抓取其之上的作用域里的已执行完的 for 循环等于 6 的 i。

设置一个变量存储 i

```javascript
for(var i = 1; i <= 5; i++) {
    (function(j) {
        setTimeout(function() {
            console.log(j);
        }, j * 1000);
    })(i); // 把 i 当作参数传给立即执行函数里面的 j
}
// 1 2 3 4 5
```

## 重返块作用域

使用 IIFE（立即执行函数式）在每次迭代时都穿件一个新的作用域。换句话说，每次迭代我们都需要一个块级作用域。而 ES6 中的 let 声明，可以用来劫持块级作用域，并且在这个块级作用域中声明一个变量。

本质上这是将一个块转换成一个可以被关闭的作用域。

```javascript
for(var i = 1; i <= 5; i++) {
    let j = i; // 这就是闭包的块级作用域！
    setTimeout(function() {
        console.log(j);
    }, j * 1000);
}
// 1 2 3 4 5
```

**<u>上面的代码还可以修改，因为 for 循环头部的 `var i = 1;`有一个特殊行为。这个行为指出变量在循环过程中不止一次被声明，每次迭代都会声明，随后的每个迭代都会使用上一个迭代结束时的值来初始化这个变量。</u>**

因此我们可以这样修改上面的代码：

```javascript
for(let i = 1; i <= 5; i++) {
    setTimeout(function timer() {
        console.log(i);
    }, i * 1000);
}
// 1 2 3 4 5
```

# 小结

**<u>当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域之外执行，这时就产生了闭包。</u>**
