# 3.7 函数

**函数对任何语言来说都是一个核心的概念。通过函数可以封装任意多条语句，而且可以在任何地方、任何时候调用执行。ECMAScript 中的函数使用 function 关键字来声明，后跟一组参数以及函数体**。
<!-- more -->

# 内容涵盖

1. 理解参数
2. 没有重载
3. 第三章小结

函数的基本语法如下所示：

```
function functionName(arg0, arg1,...,argN) {
 statements
}

// 以下是一个函数示例：

function sayHi(name, message) {
 alert("Hello " + name + "," + message);
}

sayHi("Nicholas", "how are you today?");
// 输出结果是"Hello Nicholas,how are you today?"

```

ECMAScript 中的函数在定义时不必指定是否返回值。实际上，任何函数在任何时候都可以通过
return 语句后跟要返回的值来实现返回值。请看下面的例子：

```
function sum(num1, num2) {
 return num1 + num2;
}

var result = sum(5, 10);
```

> 这个 sum()函数的作用是把两个值加起来返回一个结果。除了 return 语句之外，没有任何声明表示该函数会返回一个值。

位于 return 语句之后的任何代码都永远不会执行。例如：

```
function sum(num1, num2) {
 return num1 + num2;
 alert("Hello world"); // 永远不会执行
}
```

一个函数中也可以包含多个 return 语句，如下面这个例子中所示：

```
function diff(num1, num2) {
 if (num1 < num2) {
 return num2 - num1;
 } else {
 return num1 - num2;
 }
}
```

return 语句也可以不带有任何返回值。在这种情况下，函数在停止执行后将返回 undefined 值。这种用法一般用在需要提前停止函数执行而又不需要返回值的情况下。比如在下面这个例子中，就不会显示警告框：

```
function sayHi(name, message) {
 return;                                 // 终止函数
 alert("Hello " + name + "," + message); // 永远不会调用
}
```

> 推荐的做法是要么让函数始终都返回一个值，要么永远都不要返回值。否则，如果函数有时候返回值，有时候有不返回值，会给调试代码带来不便。

严格模式对函数有一些限制：

1. 不能把函数命名为 eval 或 arguments；
2. 不能把参数命名为 eval 或 arguments；
3. 不能出现两个命名参数同名的情况。

> 如果发生以上情况，就会导致语法错误，代码无法执行。

# 3.7.1 理解参数
ECMAScript 函数不介意传递进来多少个参数，也不在乎传进来参数是什么数据类型。也就是说，即便你定义的函数只接收两个参数，在调用这个函数时也未必一定要传递两个参数。可以传递一个、三个甚至不传递参数。之所以会这样，原因是 ECMAScript 中的参数在内部是用一个数组来表示的。函数接收到的始终都是这个数组，而不关心数组中包含哪些参数（如果有参数的话）。实际上，在函数体内可以通过 arguments 对象来访问这个参数数组，从而获取传递给函数的每一个参数。

其实，arguments 对象只是与数组类似（它并不是 Array 的实例），因为可以使用方括号语法访问它的每一个元素（即第一个元素是 arguments[0]，第二个元素是 argumetns[1]，以此类推），使用 length 属性来确定传递进来多少个参数。在前面的例子中，sayHi()函数的第一个参数的名字叫 name，而该参数的值也可以通过访问 arguments[0] 来获取。因此，那个函数也可以像下面这样重写，即不显式地使用命名参数：

```
function sayHi(name, message) {
 return;                                 // 终止函数
 alert("Hello " + name + "," + message); // 永远不会调用
}

// 上面等价于下面

function sayHi() {
 alert("Hello " + arguments[0] + "," + arguments[1]);
}
```

> 这个重写后的函数中不包含命名的参数。虽然没有使用 name 和 message 标识符，但函数的功能依旧。

这个事实说明了 ECMAScript 函数的一个重要特点：命名的参数只提供便利，但不是必需的。另外，在命名参数方面， ECMAScript 中，解析器不会验证命名参数。通过访问 arguments 对象的 length 属性可以获知有多少个参数传递给了函数。下面这个函数会在每次被调用时，输出传入其中的参数个数：

```
function howManyArgs() {
 alert(arguments.length);
}
howManyArgs("string", 45); //2
howManyArgs(); //0
howManyArgs(12); //1
```

开发人员可以利用这一点让函数能够接收任意个参数并分别实现适当的功能。请看下面的例子：

```
function doAdd() {
 if(arguments.length == 1) {
 alert(arguments[0] + 10);
 } else if (arguments.length == 2) {
 alert(arguments[0] + arguments[1]);
 }
}
doAdd(10); //20
doAdd(30, 20); //50
```

另一个与参数相关的重要方面，就是 arguments 对象可以与命名参数一起使用，如下面的例子所示：

```
function doAdd(num1, num2) {
 if(arguments.length == 1) {
 alert(num1 + 10);
 } else if (arguments.length == 2) {
 alert(arguments[0] + num2);
 }
}
```

关于 arguments 的行为，还有一点比较有意思。那就是它的值永远与对应命名参数的值保持同步。例如：

```
function doAdd(num1, num2) {
 arguments[1] = 10;
 alert(arguments[0] + num2);
}
```

每次执行这个 doAdd()函数都会重写第二个参数，将第二个参数的值修改为 10。因为 arguments 对象中的值会自动反映到对应的命名参数，所以修改 arguments[1]，也就修改了 num2，结果它们的值都会变成 10。不过，这并不是说读取这两个值会访问相同的内存空间；它们的内存空间是独立的，但它们的值会同步。

另外还要记住，如果只传入了一个参数，那么为 arguments[1]设置的值不会反应到命名参数中。这是因为 arguments 对象的长度是由传入的参数个数决定的，不是由定义函数时的命名参数的个数决定的。

关于参数还要记住最后一点：**没有传递值的命名参数将自动被赋予 undefined 值**。这就跟定义了变量但又没有初始化一样。例如，如果只给 doAdd()函数传递了一个参数，则 num2 中就会保存undefined 值。

严格模式对如何使用 arguments 对象做出了一些限制：

1. 首先，像前面例子中那样的赋值会变得无效。也就是说，即使把 arguments[1]设置为 10，num2 的值仍然还是 undefined。
2. 其次，重写 arguments 的值会导致语法错误（代码将不会执行）。ECMAScript 中的所有参数传递的都是值，不可能通过引用传递参数。

# 3.7.2 没有重载

ECMAScript 函数不能像传统意义上那样实现重载，ECMAScirpt 函数没有签名，因为其参数是由包含零或多个值的数组来表示的。而没有函数签名，真正的重载是不可能做到的。

**如果在 ECMAScript 中定义了两个名字相同的函数，则该名字只属于后定义的函数。请看下面的例子**：

```
function addSomeNumber(num){
 return num + 100;
}
function addSomeNumber(num) { \\ 后一个会覆盖掉前面的
 return num + 200;
}
var result = addSomeNumber(100); //300
```

> 通过检查传入函数中参数的类型和数量并作出不同的反应，可以模仿方法的重载。

# 3.8 小结

ECMAScript 中包含了所有基本的语法、操作符、数据类型以及完成基本的计算任务所必需的对象，但没有对取得输入和产生输出的机制作出规定。理解 ECMAScript 及其纷繁复杂的各种细节，是理解其在 Web 浏览器中的实现——JavaScript 的关键。目前大多数实现所遵循的都是 ECMA-262 第 3 版，但很多也已经着手开始实现第 5 版了。以下简要总结了 ECMAScript 中基本的要素。

1. ECMAScript 中的基本数据类型包括 Undefined、Null、Boolean、Number 和 String。
2. 与其他语言不同，ECMScript 没有为整数和浮点数值分别定义不同的数据类型，Number 类型可用于表示所有数值。
3. ECMAScript 中也有一种复杂的数据类型，即 Object 类型，该类型是这门语言中所有对象的基础类型。
4. 严格模式为这门语言中容易出错的地方施加了限制。
5. ECMAScript 提供了很多与 C 及其他类 C 语言中相同的基本操作符，包括算术操作符、布尔操作符、关系操作符、相等操作符及赋值操作符等。
6. ECMAScript 从其他语言中借鉴了很多流控制语句，例如 if 语句、for 语句和 switch 语句等。ECMAScript 中的函数与其他语言中的函数有诸多不同之处。
7. 无须指定函数的返回值，因为任何 ECMAScript 函数都可以在任何时候返回任何值。
8. 实际上，未指定返回值的函数返回的是一个特殊的 undefined 值。
9. ECMAScript 中也没有函数签名的概念，因为其函数参数是以一个包含零或多个值的数组的形式传递的。
10. 可以向 ECMAScript 函数传递任意数量的参数，并且可以通过 arguments 对象来访问这些参数。
11. 由于不存在函数签名的特性，ECMAScript 函数不能重载。
