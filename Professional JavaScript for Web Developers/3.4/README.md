
# 3.4 数据类型
**ECMAScript 中有 5 种简单数据类型（也称为基本数据类型）：Undefined、Null、Boolean、Number 和 String。还有一种复杂数据类型-- Object**。

# 内容涵盖
1. 3.4.1 Typeof操作符
2. 3.4.2 Undefined类型
3. 3.4.3 Null类型
4. 3.4.4 Boolean类型
5. 3.4.5 Number类型 
    1. 浮点数值
    2. 数值范围
    3. NaN
    4. 数值转换
6. 3.4.6 String类型
    1. 字符字面量
    2. 字符串的特点
    3. 转换为字符串
7. 3.4.7 Object类型


## 3.4.1 Typeof操作符
ECMAScript 是松散类型的，因此需要有一种手段来**检测给定变量的数据类型-- tyoeof** 就是负责这方面信息的操作符。对于一个值使用 typeof 操作符可能返回下列某个字符串：
```
"undefined"--如果这个值未定义；
"boolean"--如果这个值是布尔值；
"string"--如果这个值是字符串；
"number"--如果这个值是数值；
"object"--如果这个值是对象或null；
"function"--如果这个值是函数。
```
例子：
```
var message = "some string";
alert(typeof message);      //"string"
alert(typeof (message));    //"string"
alert(typeof 95);           //"number"
```
> `typeof` 是一个操作符而不是函数，因此例子中的圆括号尽管可以使用，担不是必需的。

有时 `typeof` 会返回一些令人迷惑但技术上却正确的值。比如，调用 `typeof null` 会返回 `"object"` ，因为特殊值 `null` 被认为是一个空的对象引用。 Safari 5 及之前版本、Chrome 7 及之前版本在对正则表达式调用 `typeof` 操作符是会返回 `"functions"` ，而其他浏览器在这种情况下会返回 `"object"` 。

<span id = "3.4.2"></span>
## 3.4.2 Undefined类型
**Undefined 类型只有一个值，即特殊的 `undefined` 。在使用 `var` 声明变量但未对其初始化时，这个变量的值就是 `undefined` , 例如**：
```
var message;
alert(message == undefined);  //true
```

包含 `undefined` 值的变量和尚未定义的变量还是不一样的，如下例子：
```
var message;  //这个变量声明之后取得了 undefined 值

//下面这个变量没有声明
//var age

alert(message);  //"undefined"
alert(age);      //报错
```

>对尚未声明过的变量，只能执行一项操作，即用 `typeof` 操作符检测其数据类型（对未经声明的变量调用 `delete` 不会导致错误，但这样做没有实际意义，而且在严格模式下确实会导出错误）。

然而令人困惑的是：对未初始化的变量执行 `typeof` 操作符会返回 `undefined` 值，而对未声明的变量执行 `typeof` 操作符也同样会返回 `undefined` 值。如下：
```
var message;  //这个变量声明之后取得了 undefinef 值

//下面这个变量并没有声明
//var age

alert(typeof message) //"undefined"
alert(typeof age)     //"undefined"
```

> 结果表明，对未初始化和未声明的变量执行 `typeof` 操作符都返回了 `undefined` 值。

> **即使未初始化的变量会自动被赋值为 `undefined` ，但显式地初始化变量依然是明智的选择。如果能做到这一点，那么当 `typeof` 操作符返回 `undefined` 值时，我们就知道被检查的变量还没有被声明，而不是未初始化**。

## 3.4.3 Null类型
**Null 类型是第二个只有一个值的数据类型，这个特殊值就是 `null` 。从逻辑角度来看， `null` 值表示一个空对象指针，而这也正是使用 `typeof` 操作符检测 `null` 值是会返回 `"object"` 的原因**，如下面例子所示：
```
var car = null;
alert(typeof car);  //"object"
```

**如果定义的变量准备在将来用于保存对象，那么最好将变量初始化为 `null` 而不是其他值**。这样，只要直接检查 `null` 值就可以知道相应的变量是否已经保存了一个对象的引用，如下例子：
```
if (car != null) {
  //对 car 对象执行某些操作
}
```

**实际上，`undefined` 值是派生自 `null` 值的，因此 ECMA-262 规定对它们的相等性测试要返回 `true` ：**
```
alert(null == undefined);  //true
```

> **尽管 `null` 和 `undefined` 有这样的关系，但他们的用途完全不同。只要意在保存对象的变量还没有正真保存对象，就应该明确地让该变量保存 `null` 值。这样做不仅可以体现 `null` 作为空对象指针的惯例，而且也有助于进一步区分 `null` 和 `undefined` 。**

<span id = "3.4.4"></span>
## 3.4.4 Boolean类型
**boolean 类型是 ECMAScript 中使用得最多的一种类型，该类型只有两个字面值： `true` 和 `false` 。这两个值与数字值不是一回事，因此 `true` 不一定等于 1 ，而 `false` 也不一定等于 0 。**

> 需要注意的是， `boolean` 类型的字面值 `true` 和 `false` 是区分大小写的。也就是说， `True` 和 `False` （以及其他的混合大小写形式）都不是 `boolean` 值，只是标识符。

虽然 `boolean` 类型的字面值只有两个，但是 ECMAScript 中所有的类型的值都是与这两个 `boolean` 值等价的值。将一个值转换为其对应的 `boolean` 值，可以调用转型函数 `Boolean()` ，如下：
```
var message = "Hello world!";
var messageAsBoolean = Boolean(message);
```

可以对任何数据类型的值调用 `Boolean()` 函数，而且总会返回一个 `boolean` 值。至于返回的这个值是 `true` 还是 `false` 。取决于要转换值的数据类型及其实际值。下表给出转换规则：

|  数据类型  | 转换为 true 值               | 转换为 false 值  |
|  -------  |  --------------------------- | -------------   |
|  boolean  |  true                        | false           |
|  string   |  任何非空字符串               | "" (空字符串)    |
|  number   |  任何非零数字值（包括无穷大）  | 0和NaN           |
|  objert   |  任何对象                     | null            |
|  undefined | n/a                         | undefined       |

这些转换规则对理解流控制语句（如 `if` 语句）自动执行相应的 `boolean` 转换非常重要，如下代码：
```
var message = "Hello world!";
if (message) {
  alert("Value is true");
}
```

> 因为字符串 `message` 被自动转换成了对应的 `boolean` 值 （ `true` ）。 

<span id = "3.4.5"></span>
## 3.4.5 Number类型
number 类型应该是 ECAMScript 中最令人关注的数据类型，这种类型使用 IEEE754 格式来表示整数和浮点数值（浮点数值在某些语言中也被称为双精度数值）。为支持各种数据类型， ECMA-262 定义了不同的数值字面量格式。

最基本的数值字面量格式是十进制整数：
```
var intNum = 55;  //整数
```
除了十进制，整数还可以通过八进制或十六进制表示。其中，八进制字面值第一位必须是零（0），后面是八进制数字序列（0-7）.如果超出范围，那么前导零将被忽略，后面数值将被当作十进制数值解析。如下：
```
var octalNum1 = 070;  //八进制的56
var octalNum2 = 079;  //无效的八进制数值--解析为79
var octalNum3 = 08;   //无效的八进制数值--解析为8
```

> 八进制字面量在严格模式下是无效的，会导致支持的 JavaScript引擎抛出错误。

十六进制字面值的前两个必须是 0x ，后跟任何十六进制数字（0-9 及 A-F）。其中，字母 A-F 可以大写，也可以小写。如下：
```
var hexNum1 = 0xA;  //十六进制的10
var hexNum2 = 0x1f; //十六进制的31
```

> 在进行算术计算时，所有以八进制和十六进制表示的数值最终都将被转换成十进制。

### 1.浮点数值
所谓浮点数值，就是该数值中必须包含一个小数点，并且小数点后面必须至少有一位数字。
```
var floatNum1 = 1.1;
var floatNum2 = 0.1;
var floatNum3 = .1;     //有效，但不推荐
```

由于保存浮点数值需要的内存空间是保存整数的两倍，因此 ECMAScript 会不失时机的将浮点数值转换为整数值。
```
var floatNum1 = 1.;   //小数点后面没有数字--解析为1
var floatNum2 = 10.0  //整数--解析为10
```

对于那些极大或极小的数值，可以用 `e` 表示法（即科学计数法）表示的浮点数值表示。
```
var floatNum = 3.125e7;   //等于31250000
```

> 上面 `e` 表示法的含义就是 “ 3.125 乘以 10 的 7 次方幂”。

> 也可以使用 `e` 表示法表示极小数值，在默认情况下，EMCAScript 会将那些小数点后面有6个零以上的浮点数值转换为已 `e` 表示法表示的数值（如：0.0000003 会被转换成 3e-7）。

浮点数值最高精度是 17 位小数，但在进行算术计算时其精度远远不如整数。例如，0.1 加 0.2 的结果不是 0.3 ，而是 0.30000000000000004 。因此不要做以下测试：
```
if(a + b == 0.3) {    //不要做这样的测试。
  alert("you got 0.3)
}
```

> 关于浮点数值计算会产生舍入误差问题，这是使用基于 IEEE754 数值的浮点计算的通病， ECMAScript 并非独此一家；其他使用相同数值格式的语言也存在这个问题。

### 2.数值范围
ECMAScript 能够表示的最小数值保存在 `Number.MIN_VALUE` 中--大多数浏览器中，这个值是 5e-324 ；能够表示的最大数值保存在 `Number.MAX_VALUE` 中--大多数浏览器中，这个值是 1.7976931348623157e+308 。如果超出，那么 JavaScript 会自动转换为特殊值 `Indinity` 值。（如果是负数则转换为 `-Infinity`）。

因为 `Infinity` 不能参与计算，要确定一个数值是不是有穷的，可以使用 isFinite() 函数：
```
var result = Number.MAX_VALUE + Number.MAX_VALUE;
alert(isFinite(result));  //false
```

### 3.NaN
NaN,即非数值（Not a Number）是一个特殊的数值，这个数字用于表示一个本来要返回数值的操作数未返回数值的情况（这样就不会抛出错误了）。如：任何数除以 0 会返回 `NaN` 而不会抛错，影响其他代码执行。

> **注：原书如此，但实际上只有 0 除以 0 才会返回 `NaN` ，正数除以 0 返回 `Infinity` ，负数除以 0 返回 `-Infinity`。**

NaN有两个特点：
1. 任何涉及 NaN 的操作（例如 NaN / 10）都返回 NaN
2. NaN 与任何值都不相等，包括 NaN 本身。

```
alert(NaN == NaN);  //false
```

针对 `NaN` 的特点， ECMAScrpit 定义了 `isNaN()` 函数。 `isNaN()` 在接收到一个值后，会尝试将这个值转换为数值。任何不能被转换为数值的值都会导致这个函数返回 `true` 。如下例子：
```
alert(isNaN(NaN));      //true
alert(isNaN(10));       //false（10是一个数值）
alert(isNaN("10"));     //false（可以被转换为10）
alert(isNaN("blue"));   //true（不能转换成数值）
alert(isNaN(true));     //false（可以被转换成数值）
```
 > `isNaN()` 也适用于对象。在基于对象调用 `isNaN()` 函数时，会首先调用对象的 `valueOf()` 方法，然后确定该方法返回的值是否可以转换为数值，如果不能则基于这个返回值再调用 `toString()` 方法，再测试返回值。

 ### 4.数值转换
 有 3 个函数可以把非数值转换为数值： `Number()` 、`parseInt()` 和 `parseFloat()` 。第一函数可以用于任何数据类型，而另外两个函数专门用于把字符串转换成数值。

 `Number()` 函数的转换规则如下：
 
1. 如果是 boolean 值，true 和 false 将分别被转换为 1 和 0 。
2. 如果是数字值，只是简单的传入和返回。
3. 如果是 null 值，返回 0 。
4. 如果是 undefined ，返回 NaN 。
5. 如果是字符串，遵循下列规则：
    1. 如果字符串中值包含数字（包括前面带正负号的情况），则将其转换为十进制数值（注意前导零会被忽略）。
    2. 如果字符串中包含有效的浮点格式，如 “1.1”，则将其转换为对应的浮点数值（同样，前导零会忽略）。
    3. 如果字符串中包含有效的十六进制格式，如“0xf”，将其转换为同大小的十进制数值。
    4. 如果字符串是空的（不包含任何字符），则转换为 0 。
    5. 如果字符串中包含除以上格式之外的字符，则转换为 NaN 。
6. 如果是对象，这调用对象的 valueOf() 方法，然后依照前面的规则转换返回值。如果转换返回值结果是 NaN ，这调用对象的 toString() 方法，然后再次依照前面规则转换返回的字符串值。

例子：

```
var num1 = Number("Hello World!");   //NaN
var num2 = Number("");               //0
var num3 = Number("000011");         //11
var num4 = Number("true");           //1
```

由于 `Number()` 函数转换字符串时比较复杂且不够合理，因此在处理整数的时候更常用的是 `parseInt()` 函数。它会忽略字符串的前置空格，直到找到第一个非空个字符。如果第一个字符不是数字字符或符号，就会返回 `NaN` ，也就是说转换空字符会返回 `NaN` （ `Number()` 对空字符返回 0 ）。如果第一个是数字字符，会继续解析第二个，直到遇到非数字字符为止。（因此，小数点字符会被认为是终止解析的。） 如下例子：
```
var num1 = parseInt("1234blue");   //1234
var num2 = parseInt("");           //NaN
var num3 = parseInt("0xA");        //10（十六进制）
var num4 = parseInt("22.5");       //22
var num5 = parseInt("070");        //56（八进制）
var num6 = parseInt("70");         //70（十进制）
var num7 = parseInt("0xf");        //15（十六进制）
```

> 在 ECMAScript 3 中，“070” 被当作八进制，故而转换为十进制 56 。而在 ECMAScript 5 中， `parseInt()` 已经不具有解析八进制能力，因此前导零会被忽略，会解析为十进制 70 。

为了消除在使用 `paresInt()` 函数时可能导致上述的困惑，可以添加第二参数：
```
var num = parseInt("0xAF", 16);   //175

//实际上如果指定 16 作为第二参数，字符串可以不带前缀 0x ，如下：

var num1 = parseInt("AF", 16);    //175
var num2 = parseInt("AF");        //NaN
```

与 `parseInt()` 与 `parseFloat()` 基本类似，而不同是以下：
1. 字符串第一个小数点是有效的，第二个小数点是无效的。（如： "22.34.5" 解析为 22.34）。
2. 始终忽略前导零。
3. 只解析十进制。

```
var num1 = parseFloat("1234blue");  //1234
var num2 = parseFloat("0xA");       //0
var num3 = parseFloat("22.5");      //22.5
var num4 = parseFloat("22.34.5");   //22.34
var num5 = parseFloat("0908.5");    //908.5
var num6 = parseFloat("3.125e7");   //31250000
```

## 3.4.6 String类型
string 类型用于表示由零或多个 16 位 Unicode 字符组成的字符序列，即字符串。
```
var firstName = "Rason";
var lastName = 'Rason';
var name = "Rason';       //语法错误
```

> 字符串可以由双引号或单引号表示，但必须成对闭合！

### 1.字符字面量
**string 数据类型包括一些特殊字符字面量，也叫转义序列**，用于表示非打印字符，或者具有其他用途的字符，这些字符字面量如下表所示：

  字面量 | 含义  
  ----- | ----- 
  \n  | 换行  
  \t  | 制表  
  \b  | 空格  
  \r  | 回车  
  \f  | 进纸
  \\  | 斜杠
  \'  | 单引号
  \"  | 双引号
  \xnn  | 十六进制代码 nn 表示一个字符。如：\x41 表示 "A"
  \unnn | 十六进制代码 nnn 表示一个 Unicode 字符。如： \u03a3 表示希腊字符Σ

任何字符串的长度都可以通过访问其 `length` 属性取得：
```
var text = "Hello World! \u03a3";
alert(text.length);         //输出 14
```

> 如果字符串中包含双字节字符，那么 `length` 属性可能不会精确的返回字符串中的数目。如上 `\u03a3` 六个字符被转义为一个字符了。 

### 2.字符串的特点
ECMAScript 中的字符串是不可变的，也就是说，字符串一旦创建，他们的值就不能改变。要改变，首先要销毁原字符串，在用另一个包含新值的字符串填充该变量：
```
var lang = "Java";
lang = lang + "Script";
```

### 3.转换为字符串
要把一个值，转换为字符串有两种方法：
1. `toString()` 方法：

```
var age = 11;
var ageAsString = age.toString();     //字符串"11"
var found = ture;
var foundAsString = found.toString()  //字符串"true"
```

可以传参数(输出任意进制的字符串值)：
```
var num = 10;
alert(num.toString());    //"10"
alert(num.toString(2));   //"1010"
alert(num.toString(8));   //"12"
alert(num.toString(10));   //"10"
alert(num.toString(16));  //"a"
```

每一个字符串都有 `toString()` 方法，但是 `null` 和 `undefined` 值没有这个方法，那么，在不知道转换的值是不是这两个值的时候，还可以通过转型函数：

2. `String()`转型函数：这个函数能将任何类型的值转换为字符串。规则如下：
    1. 如果值有 toString() 方法，则调用该方法（没有参数）并返回结果；
    2. 如果值是 nul ，则返回 "null"；
    3. 如果值是 undefined ，则返回 "undefined"。


例子：
```
var value1 = 10;
var value2 = true;
var value3 = null;
var value4;

alert(String(value1));   //"10"
alert(String(value2));   //"true"
alert(String(value3));   //"null"
alert(String(value4));   //"undefined"
```

## 3.4.7 Object类型
ECMAScript 中的对象其实就是一组数据和功能的集合，对象可以通过执行 `new` 操作符后跟要创建的对象类型的名称来创建。如下：
```
var o = new Object();
var o = new Object;     //有效，但不推荐！
```

**重要思想： `Object` 类型是所有它的实例的基础。换句话说， `Object` 类型所具有的任何属性和方法也同样存在于更具体的对象中。**

`Object` 的每个实例都具有下列属性和方法：

1. constructor：保存着用于创建当前对象的函数。对于前面的例子而言，构造函数（constructor）就是 Object()。
2. hasOwnProperty(propertyName)：用于检查给定的属性在当前对象实例中（而不是在实例原型中）是否存在。其中，作为参数的属性名（propertyName）必须以字符串形式指定（例如：o.hasOwnProperty("name)）。
3. isPrototypeOf(object)：用于检查传入的对象是否是传入对象的原型（第 5 章会讨论原型）。
4. propertyIsEnumerable(propertyName)：用于检查给定的属性是否能够使用 for-in 语句来枚举，参数（propertyName）必须以字符串形式指定。
5. toLocaleString()：返回对象的字符串表示，该字符串与执行环境的地区对应。
6. toString()：返回对象的字符串表示。
7. valueOf()：返回对象的字符串、数值或布尔值表示。通常与 toString() 方法的返回值相同。

> 由于在 ECMAScript 中 Object 是所有对象的基础，因此所有对象都具有以上这些基本的属性和方法。
