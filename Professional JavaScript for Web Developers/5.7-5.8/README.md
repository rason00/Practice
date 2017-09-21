# 5.7 单体内置对象

**ECMA-262 对内置对象的定义是：“由 ECMAScript 实现提供的、不依赖于宿主环境的对象，这些对象在 ECMAScript 程序执行之前就已经存在了。”意思就是说，开发人员不必显式地实例化内置对象，因为它们已经实例化了。前面我们已经介绍了大多数内置对象，例如 Object、Array 和 String。ECMA-262 还定义了两个单体内置对象：Global 和 Math。**。

# 内容涵盖

1. Global 对象
    1. URL 编码方法
    2. eval() 方法
    3. Global 对象的属性
    4. window 对象
2. Math 对象
    1. Math 对象的属性
    2. min() 和 max() 方法
    3. 舍入方法
    4. random() 方法
    5. 其他方法
3. 第五章小结

# 5.7.1 Global 对象

Global（全局）对象可以说是 ECMAScript 中最特别的一个对象了，因为不管你从什么角度上看，这个对象都是不存在的。ECMAScript 中的 Global 对象在某种意义上是作为一个终极的“兜底儿对象”来定义的。**换句话说，不属于任何其他对象的属性和方法，最终都是它的属性和方法**。

**事实上，没有全局变量或全局函数；所有在全局作用域中定义的属性和函数，都是 Global 对象的属性**。本书前面介绍过的那些函数，诸如 isNaN()、isFinite()、parseInt() 以及 parseFloat()，实际上全都是 Global 对象的方法。除此之外，Global 对象还包含其他一些方法。

## 5.7.1.1 URL 编码方法

**Global 对象的 encodeURI() 和 encodeURIComponent() 方法可以对 URI（Uniform Resource Identifiers，通用资源标识符）进行编码，以便发送给浏览器**。

**有效的 URI 中不能包含某些字符，例如空格。而这两个 URI 编码方法就可以对 URI 进行编码，它们用特殊的 UTF-8 编码替换所有无效的字符，从而让浏览器能够接受和理解**。

其中，encodeURI()主要用于整个 URI（例如，http://www.wrox.com/illegal value.htm），而 encodeURIComponent()主要用于对 URI 中的某一段（例如前面 URI 中的 illegal value.htm）进行编码。

它们的主要区别在于，encodeURI() 不会对本身属于 URI 的特殊字符进行编码，例如冒号、正斜杠、问号和井字号；而 encodeURIComponent() 则会对它发现的任何非标准字符进行编码。来看下面的例子。

```
var uri = "http://www.wrox.com/illegal value.htm#start";

alert(encodeURI(uri));          //"http://www.wrox.com/illegal%20value.htm#start"

alert(encodeURIComponent(uri)); //"http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.htm%23start"
```

> 使用 **encodeURI() 编码后的结果是除了空格之外的其他字符都原封不动，只有空格被替换成了%20**。而 **encodeURIComponent() 方法则会使用对应的编码替换所有非字母数字字符**。这也正是可以对整个 URI 使用 encodeURI()，而只能对附加在现有 URI 后面的字符串使用 encodeURIComponent() 的原因所在。

一般来说，我们使用 encodeURIComponent() 方法的时候要比使用 encodeURI() 更多，因为在实践中更常见的是对查询字符串参数而不是对基础 URI进行编码。

与 **encodeURI() 和 encodeURIComponent() 方法对应的两个方法分别是 decodeURI() 和 decodeURIComponent()**。

其中，**decodeURI() 只能对使用 encodeURI() 替换的字符进行解码。例如，它可将%20 替换成一个空格，但不会对%23 作任何处理，因为%23 表示井字号（#），而井字号不是使用 encodeURI() 替换的**。

同样地，**decodeURIComponent() 能够解码使用 encodeURIComponent() 编码的所有字符，即它可以解码任何特殊字符的编码**。来看下面的例子：

```
var uri = "http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.htm%23start";

alert(decodeURI(uri));
//http%3A%2F%2Fwww.wrox.com%2Fillegal value.htm%23start

alert(decodeURIComponent(uri));
//http://www.wrox.com/illegal value.htm#start
```

> 这里，变量 uri 包含着一个由 encodeURIComponent() 编码的字符串。在第一次调用 decodeURI()输出的结果中，只有%20 被替换成了空格。而在第二次调用 decodeURIComponent()输出的结果中，所有特殊字符的编码都被替换成了原来的字符，得到了一个未经转义的字符串（但这个字符串并不是一个有效的 URI）。

URI 方法 encodeURI()、encodeURIComponent()、decodeURI() 和 decodeURIComponent() 用于替代已经被 ECMA-262 第 3 版废弃的escape() 和unescape() 方法。URI方法能够编码所有 Unicode 字符，而原来的方法只能正确地编码 ASCII 字符。
因此在开发实践中，特别是在产品级的代码中，一定要使用 URI 方法，不要使用 escape() 和 unescape() 方法。

## 5.7.1.2 eval() 方法

现在，我们介绍最后一个——**大概也是整个 ECMAScript 语言中最强大的一个方法：eval()**。

**eval() 方法就像是一个完整的 ECMAScript 解析器，它只接受一个参数，即要执行的 ECMAScript（或 JavaScript）字符串**。看下面的例子：

```
eval("alert('hi')");

//这行代码的作用等价于下面这行代码：

alert("hi");
```
**当解析器发现代码中调用 eval() 方法时，它会将传入的参数当作实际的 ECMAScript 语句来解析，然后把执行结果插入到原位置**。通过 **eval() 执行的代码被认为是包含该次调用的执行环境的一部分，因此被执行的代码具有与该执行环境相同的作用域链**。这意味着通过 eval() 执行的代码可以引用在包含环境中定义的变量，举个例子：

```
var msg = "hello world";
eval("alert(msg)"); //"hello world"
```

> 可见，变量 msg 是在 eval()调用的环境之外定义的，但其中调用的 alert() 仍然能够显示"hello world"。这是因为上面第二行代码最终被替换成了一行真正的代码。

同样地，我们也可以在 eval() 调用中定义一个函数，然后再在该调用的外部代码中引用这个函数：

```
eval("function sayHi() { alert('hi'); }");
sayHi();
```

> 显然，函数 sayHi() 是在 eval() 内部定义的。但由于对 eval() 的调用最终会被替换成定义函数
的实际代码，因此可以在下一行调用 sayHi()。

对于变量也一样：

```
eval("var msg = 'hello world'; ");
alert(msg); //"hello world"
```

> **在 eval()中创建的任何变量或函数都不会被提升**，因为在解析代码的时候，它们被包含在一个字符串中；它们只在 eval() 执行的时候创建。

**严格模式下，在外部访问不到 eval() 中创建的任何变量或函数，因此前面两个例子都会导致错误**。

同样，**在严格模式下，为 eval 赋值也会导致错误**：

```
"use strict";
eval = "hi"; //causes error
```

能够解释代码字符串的能力非常强大，但也非常危险。因此在使用 eval() 时必须极为谨慎，特别是在用它执行用户输入数据的情况下。否则，可能会有恶意用户输入威胁你的站点或应用程序安全的代码（即所谓的代码注入）。

## 5.7.1.3 Global 对象的属性

Global 对象还包含一些属性，其中一部分属性已经在本书前面介绍过了。例如，特殊的值 undefined、NaN 以及 Infinity 都是 Global 对象的属性。此外，所有原生引用类型的构造函数，像 Object 和 Function，也都是 Global 对象的属性。下表列出了 Global 对象的所有属性。

| 属 性 | 说 明 | 属 性 | 说 明 |
| ----- | ----  | --- | --- |
| undefined | 特殊值undefined | Date | 构造函数Date |
| NaN | 特殊值NaN|  RegExp | 构造函数RegExp |
| Infinity | 特殊值Infinity | Error | 构造函数Error |
| Object | 构造函数Object | EvalError | 构造函数EvalError |
| Array | 构造函数Array | RangeError | 构造函数RangeError |
| Function | 构造函数Function | ReferenceError | 构造函数ReferenceError |
| Boolean | 构造函数Boolean | SyntaxError | 构造函数SyntaxError |
| String | 构造函数String | TypeError | 构造函数TypeError |
| Number | 构造函数Number | URIError | 构造函数URIError |

> ECMAScript 5 明确禁止给 undefined、NaN 和 Infinity 赋值，这样做即使在非严格模式下也会导致错误。

## 5.7.1.4 window 对象

**ECMAScript 虽然没有指出如何直接访问 Global 对象，但 Web 浏览器都是将这个全局对象作为 window 对象的一部分加以实现的。因此，在全局作用域中声明的所有变量和函数，就都成为了 window 对象的属性**。来看下面的例子。

```
var color = "red";
function sayColor(){
 alert(window.color);
}
window.sayColor(); //"red"
```

> 这里定义了一个名为 color 的全局变量和一个名为 sayColor() 的全局函数。在 sayColor() 内部，我们通过 window.color 来访问 color 变量，以说明全局变量是 window 对象的属性。然后，又使用 window.sayColor() 来直接通过 window 对象调用这个函数，结果显示在了警告框中。

JavaScript 中的 window 对象除了扮演 ECMAScript 规定的 Global 对象的角色外，还承担了很多别的任务。第 8 章在讨论浏览器对象模型时将详细介绍 window 对象。另一种取得 Global 对象的方法是使用以下代码：

```
var global = function(){
 return this;
}();
```

> 以上代码创建了一个立即调用的函数表达式，返回 this 的值。如前所述，在没有给函数明确指定 this 值的情况下（无论是通过将函数添加为对象的方法，还是通过调用 call() 或 apply()），this 值等于 Global 对象。而像这样通过简单地返回 this 来取得 Global 对象，在任何执行环境下都是可行的。第 7 章将深入讨论函数表达式。

# 5.7.2 Math 对象

ECMAScript 还为保存数学公式和信息提供了一个公共位置，即 Math 对象。与我们在 JavaScript 直接编写的计算功能相比，Math 对象提供的计算功能执行起来要快得多。Math 对象中还提供了辅助完成这些计算的属性和方法。

## 5.7.2.1 Math 对象的属性

Math 对象包含的属性大都是数学计算中可能会用到的一些特殊值。下表列出了这些属性。

| 属 性 | 说 明 |
| ----- | ---- |
| Math.E | 自然对数的底数，即常量e的值 |
| Math.LN10 | 10的自然对数 |
| Math.LN2 | 2的自然对数 |
| Math.LOG2E | 以2为底e的对数 |
| Math.LOG10E | 以10为底e的对数 |
| Math.PI | π的值 |
| Math.SQRT1_2 | 1/2的平方根（即2的平方根的倒数） |
| Math.SQRT2 | 2的平方根 |

虽然讨论这些值的含义和用途超出了本书范围，但你确实可以随时使用它们。

## 5.7.2.2 min() 和 max() 方法

Math 对象还包含许多方法，用于辅助完成简单和复杂的数学计算。其中，**min() 和 max() 方法用于确定一组数值中的最小值和最大值。这两个方法都可以接收任意多个数值参数**，如下面的例子所示。

```
var max = Math.max(3, 54, 32, 16);
alert(max); //54
var min = Math.min(3, 54, 32, 16);
alert(min); //3
```

对于 3、54、32 和 16，Math.max() 返回 54，而 Math.min() 返回 3。这两个方法经常用于避免多余的循环和在 if 语句中确定一组数的最大值。

**要找到数组中的最大或最小值，可以像下面这样使用 apply() 方法**。

```
var values = [1, 2, 3, 4, 5, 6, 7, 8];
var max = Math.max.apply(Math, values);
```

这个技巧的关键是把 Math 对象作为 apply() 的第一个参数，从而正确地设置 this 值。然后，可以将任何数组作为第二个参数。

## 5.7.2.3 舍入方法

下面来介绍将小数值舍入为整数的几个方法：Math.ceil()、Math.floor()和 Math.round()。这三个方法分别遵循下列舍入规则：

1. Math.ceil()执行向上舍入，即它总是将数值向上舍入为最接近的整数；
2. Math.floor()执行向下舍入，即它总是将数值向下舍入为最接近的整数；
3. Math.round()执行标准舍入，即它总是将数值四舍五入为最接近的整数（这也是我们在数学课上学到的舍入规则）。

下面是使用这些方法的示例：

```
alert(Math.ceil(25.9)); //26
alert(Math.ceil(25.5)); //26
alert(Math.ceil(25.1)); //26
alert(Math.round(25.9)); //26
alert(Math.round(25.5)); //26
alert(Math.round(25.1)); //25
alert(Math.floor(25.9)); //25
alert(Math.floor(25.5)); //25
alert(Math.floor(25.1)); //25
```

> 对于所有介于 25 和 26（不包括 26）之间的数值，Math.ceil()始终返回 26，因为它执行的是向上舍入。Math.round()方法只在数值大于等于 25.5 时返回 26；否则返回 25。最后，Math.floor() 对所有介于 25 和 26（不包括 26）之间的数值都返回 25。

## 5.7.2.4 random() 方法

**Math.random() 方法返回大于等于 0 小于 1 的一个随机数**。

对于某些站点来说，这个方法非常实用，因为可以利用它来随机显示一些名人名言和新闻事件。套用下面的公式，就可以利用 Math.random()
从某个整数范围内随机选择一个值。

```
值 = Math.floor(Math.random() * 可能值的总数 + 第一个可能的值)
```

> 公式中用到了 Math.floor() 方法，这是因为 Math.random() 总返回一个小数值。而用这个小数值乘以一个整数，然后再加上一个整数，最终结果仍然还是一个小数。举例来说，如果你想选择一个 1 到 10 之间的数值，可以像下面这样编写代码：

```
var num = Math.floor(Math.random() * 10 + 1);
```

> 总共有 10 个可能的值（1 到 10），而第一个可能的值是 1。而如果想要选择一个介于 2 到 10 之间的值，就应该将上面的代码改成这样：

```
var num = Math.floor(Math.random() * 9 + 2);
```

> 从 2 数到 10 要数 9 个数，因此可能值的总数就是 9，而第一个可能的值就是 2。

多数情况下，其实都可以通过一个函数来计算可能值的总数和第一个可能的值，例如：

```
function selectFrom(lowerValue, upperValue) {
 var choices = upperValue - lowerValue + 1;
 return Math.floor(Math.random() * choices + lowerValue);
}
var num = selectFrom(2, 10);
alert(num); // 介于 2 和 10 之间（包括 2 和 10）的一个数值
```

> 函数 selectFrom() 接受两个参数：应该返回的最小值和最大值。而用最大值减最小值再加 1 得到了可能值的总数，然后它又把这些数值套用到了前面的公式中。这样，通过调用 selectFrom(2,10) 就可以得到一个介于 2 和 10 之间（包括 2 和 10）的数值了。

利用这个函数，可以方便地从数组中随机取出一项，例如：

```
var colors = ["red", "green", "blue", "yellow", "black", "purple", "brown"];
var color = colors[selectFrom(0, colors.length-1)];
alert(color); // 可能是数组中包含的任何一个字符串
```

> 在这个例子中，传递给 selectFrom() 的第二个参数是数组的长度减 1，也就是数组中最后一项的位置。

## 5.7.2.5 其他方法

Math 对象中还包含其他一些与完成各种简单或复杂计算有关的方法，但详细讨论其中每一个方法的细节及适用情形超出了本书的范围。下面我们就给出一个表格，其中列出了这些没有介绍到的 Math对象的方法。

| 方 法 | 说 明 | 方 法 | 说 明 |
| -----| -----| ------| ----- |
| Math.abs(num) | 返回 num 的绝对值 | Math.asin(x) | 返回 x 的反正弦值 |
| Math.exp(num) | 返回 Math.E 的 num 次幂 | Math.atan(x) | 返回 x 的反正切值 |
| Math.log(num) | 返回 num 的自然对数 | Math.atan2(y,x) | 返回 y/x 的反正切值 |
| Math.pow(num,power) | 返回 num 的 power 次幂 | Math.cos(x) | 返回 x 的余弦值 |
| Math.sqrt(num) | 返回 num 的平方根 | Math.sin(x) | 返回 x 的正弦值 |
| Math.acos(x) | 返回 x 的反余弦值 | Math.tan(x) | 返回 x 的正切值 |

虽然 ECMA-262 规定了这些方法，但不同实现可能会对这些方法采用不同的算法。毕竟，计算某个值的正弦、余弦和正切的方式多种多样。也正因为如此，这些方法在不同的实现中可能会有不同的精度。

# 5.8 第五章小结

对象在 JavaScript 中被称为引用类型的值，而且有一些内置的引用类型可以用来创建特定的对象，现简要总结如下：

1. 引用类型与传统面向对象程序设计中的类相似，但实现不同；
2. Object 是一个基础类型，其他所有类型都从 Object 继承了基本的行为；
3. Array 类型是一组值的有序列表，同时还提供了操作和转换这些值的功能；
4. Date 类型提供了有关日期和时间的信息，包括当前日期和时间以及相关的计算功能；
5. RegExp 类型是 ECMAScript 支持正则表达式的一个接口，提供了最基本的和一些高级的正则表达式功能。

函数实际上是 Function 类型的实例，因此函数也是对象；而这一点正是 JavaScript 最有特色的地方。由于函数是对象，所以函数也拥有方法，可以用来增强其行为。

因为有了基本包装类型，所以 JavaScript 中的基本类型值可以被当作对象来访问。三种基本包装类型分别是：Boolean、Number 和 String。以下是它们共同的特征：

1. 每个包装类型都映射到同名的基本类型；
2. 在读取模式下访问基本类型值时，就会创建对应的基本包装类型的一个对象，从而方便了数据操作；
3. 操作基本类型值的语句一经执行完毕，就会立即销毁新创建的包装对象。

在所有代码执行之前，作用域中就已经存在两个内置对象：Global 和 Math。在大多数 ECMAScript 实现中都不能直接访问 Global 对象；不过，Web 浏览器实现了承担该角色的 window 对象。全局变量和函数都是 Global 对象的属性。Math 对象提供了很多属性和方法，用于辅助完成复杂的数学计算任务。
