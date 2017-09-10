
# 内容涵盖
1. [第二章小结](#2)
2. [3.1：语法](#3.1)
3. [3.2：关键字和保留字](#3.2)
4. [3.3：变量](#3.3)

<span id="2"></span>
## 第二章（在 HTML 中使用 JavaScript ）小结

> 1. 在包含外部 `JavaScript` 文件时，必须将 `src` 属性设置为指向相应文件的 `URL` 。而这个文件既可以是与包含它的页面位于同一个服务器的文件，也可以是其他任何域中的文件。  
> 2. 所有 `<script>` 元素都会按照它们在页面中出现的先后顺序依次被解析。在不使用 `defer` 和 `async` 属性的情况下，只有在解析完前面 `<script>` 元素中的代码之后，才会开始解析后面 `<script>` 元素中的代码。  
> 3. 由于浏览器会先解析完不使用 `defer` 属性的 `<script>` 元素中的代码，然后再解析后面的内容，**所以一般应该把 `<script>` 元素放在页面内容最后，即主要内容后面， `</body>` 标签前面**  。
> 4. 使用 `defer` 属性可以脚本在文档完全呈现之后再执行。延后脚本总是按照指定它们的顺序执行。  
> 5. 使用 `async` 属性可以表示当前脚本不必等待其他脚本，也不必阻塞文档呈现。不能保证异步脚本按照它们在页面中出现的顺序执行。  
> 6. 使用 `<noscript>` 元素可以指定在不支持脚本的浏览器中显示的代替内容。但在启用了脚本的情况下，浏览器不会显示 `<noscript>` 元素中的任何内容。

<span id="3.1"></span>
## 3.1 语法
### 3.1.1 区分大小写

第一个概念是 **ECMAScript 中的一切（变量、函数名和操作符）都区分大小写**。这就意味着，变量名 `test` 和 `Test` 分别表示两个完全不用的变量，而函数名不能使用 `typeOf` ,因为它是一个关键字（3.2节介绍关键字），但 `typeOf` 则完全可以是一个有效的函数名。

### 3.1.2 标识符
所谓标识符，就是指变量、函数、属性的名字，或者函数的参数。**标识符可以是按照下列格式规则组合起来的一或多个字符：**
> 1. 第一个字符必须是一个字母、下划线（_）或一个美元符号（$）;  
> 2. 其他字符可以是字母、下划线、美元符号或数字。

**按照惯例， ECMAScript 标识符采用驼峰大小写格式**，也就是第一个字母小写，剩下每个单词的首字母大写，例如：
```
firstSecond
myCar
doSomethingImportant
```

### 3.1.3 注释
```
// 单行注释

/*
*  这是一个多行
*  （块级）注释
*/
```
> 多行注释中的2.3行都以一个星号开头，但这不是必须的，纯粹是为了提高注释的可读性。

### 3.1.4 严格模式
ECMAScript 5 引入了严格模式（strict mode）的概念。在严格模式下，ECMAScript 3 中的一些不确定的行为将得到处理，而且对某些不安全的操作也会抛出错误。**要在整个脚本中启用严格模式，可以在顶部添加如下代码**
```
"ues strict";
//代码体
```
**在函数内部的上方包含这条编译指示，也可以指定函数在严格模式下执行：**
```
function doSomething() {
  "ues strict";
  //函数体
}
```
> 支持严格模式的浏览器包括：IE 10+、Firedox 4+、Safari 5.1+、Opera 12+、Chrome。

### 3.1.5 语句
**ECMAScript 中的语句以一个分号结尾（;）**，如果省略分号，则由解析器确定语句的结尾，如下所示：
```
var sun = a + b     //没有分号也有效--不推荐
var diff = a - b;     //有效语句--推荐
```
可以使用 C 风格的语法把多条语句组合到一个代码块中，即代码块以左花括号（{）开头，以右花括号（}）结尾：
```
if (test) {        //推荐使用
  alert(test);
}

if (test)          //有效但易出错，不推荐
  alert(test);
```
> 在控制语句中使用代码块可以让编码意图更加清晰，而且也能降低修改代码时出错的几率。

<span id="3.2"></span>
## 关键字和保留字
ECMA-262 描述了一组具有特定用途的关键字。按照规则，**关键字也是语言保留的，不能用作标识符**。以下就是 ECMAScript 的全部关键字：

```
break       do          instanceof    typeof
case        else        new           var
catch       finally     return        void
continue    for         switch        while
debugger    function    this          with
default     if          throw
delete      in          try
```
保留字：
```
abstract    enum        int           short
boolean     export      interdace     staic
byte        extends     long          super
char        final       native        synchronized
class       float       package       throws
const       goto        private       transient
debugger    implements  protected     volatile
double      import      public
```
第五版把在非严格模式下运行时的保留字缩减为下列这些：
```
class       enum        extends       super
const       export      import
```
在严格模式下，第五版还对以下保留字施加了限制：
```
implements  package     public
interface   private     static
let         protected   yield
```
在实现 ECMAScript 3 的 JavaScript 引擎中使用关键字作为标识符，会导致 “ Identifier Expected ” 错误。

一般来说，最好都不要使用关键字和保留字作为标识符和属性名，以便与将来的 ECMAScript 版本兼容。

<span id="3.3"></span>
## 3.3变量
ECMAScript 的变量是松散型的，所谓松散型就是可以用来保存任何类型数据。定义变量时使用 `var` 操作符：
```
var message;
```

> 这行代码定义了一个名为 `message` 的变量,该变量保存一个特殊值--`undefined`（未初始化的变量皆保存此值）。因此定义变量时就可同时设置变量的值，如下：

```
var message = "hi";
message = 100;        //有效，但不推荐
```

> 虽然我们不建议修改变量所保存值的类型，但这种操作在 ECMAScript 中完全有效。

有一点注意，使用 `var` 定义的变量将成为定义该变量的作用域的局部变量。也就是说，这个变量在函数退出后就会被销毁，例如：
```
function test() {
  var message = "hi";   //局部变量
}
test();
alert(message);         //报错
```
如果省略 `var` 操作符，则会创建一个全局变量：
```
function test() {
  message = "hi";
}
test();
alert(message);         //"hi"
```
> 虽然省略 `var` 操作符可以定义全局变量，但是这不是推荐做法。因为在局部作用域中定义全局变量很难维护，也会由于相应变量不会马上就有定义而导致不必要的混乱。给未经声明的变量赋值在严格模式下会导致抛出 ReferenceError 错误。

可以使用一条语句定义多个变量，用逗号分隔：
```
var message = "hi",
    found = false,
    age = 26;
```
> 二三行的缩进不是必要的，只是提高可读性，同时也可以直接放在一行完成代码。  
> 在严格模式下，不能定义名为 `eval` 或 `arguments` 的变量，否则会导致语法报错。

