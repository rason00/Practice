# 5.6 基本包装类型

**ECMAScript 还提供了 3 个特殊的引用类型：Boolean、Number 和 String。这些类型与本章介绍的其他引用类型相似，但同时也具有与各自的基本类型相应的特殊行为。**。

# 内容涵盖

1. Boolean 类型
2. Number 类型
3. String 类型]
    1. 字符方法
    2. 字符串操作方法
    3. 字符串位置方法
    4. trim() 方法
    5. 字符串大小转换方法
    6. 字符串的模式匹配方法
    7. localeCompare() 方法
    8. fromCharCode() 方法
    9. HTML 方法

实际上，每当读取一个基本类型值的时候，后台就会创建一个对应的基本包装类型的对象，从而让我们能够调用一些方法来操作这些数据。来看下面的例子。

```
var s1 = "some text";
var s2 = s1.substring(2);
```

这个例子中的变量 s1 包含一个字符串，字符串当然是基本类型值。而下一行调用了 s1 的substring() 方法，并将返回的结果保存在了 s2 中。**我们知道，基本类型值不是对象，因而从逻辑上讲它们不应该有方法（尽管如我们所愿，它们确实有方法）**。其实，**为了让我们实现这种直观的操作，后台已经自动完成了一系列的处理**。当第二行代码访问 s1 时，访问过程处于一种读取模式，也就是要从内存中读取这个字符串的值。而在读取模式中访问字符串时，后台都会自动完成下列处理。

1. 创建 String 类型的一个实例；
2. 在实例上调用指定的方法；
3. 销毁这个实例。

可以将以上三个步骤想象成是执行了下列 ECMAScript 代码。

```
var s1 = new String("some text");
var s2 = s1.substring(2);
s1 = null;
```

> 经过此番处理，基本的字符串值就变得跟对象一样了。而且，上面这三个步骤也分别适用于 Boolean 和 Number 类型对应的布尔值和数字值。

**引用类型与基本包装类型的主要区别就是对象的生存期**。

**使用 new 操作符创建的引用类型的实例，在执行流离开当前作用域之前都一直保存在内存中**。

**而自动创建的基本包装类型的对象，则只存在于一行代码的执行瞬间，然后立即被销毁**。

这意味着我们不能在运行时为基本类型值添加属性和方法。来看下面的例子：

```
var s1 = "some text";
s1.color = "red";
alert(s1.color); //undefined
```

> 在此，第二行代码试图为字符串 s1 添加一个 color 属性。但是，当第三行代码再次访问 s1 时，其 color 属性不见了。**问题的原因就是第二行创建的 String 对象在执行第三行代码时已经被销毁了。第三行代码又创建自己的 String 对象，而该对象没有 color 属性**。

当然，可以显式地调用 Boolean、Number 和 String 来创建基本包装类型的对象。不过，应该在绝对必要的情况下再这样做，因为这种做法很容易让人分不清自己是在处理基本类型还是引用类型的值。

对基本包装类型的实例调用 typeof 会返回"object"，而且所有基本包装类型的对象都会被转换为布尔值 true。

Object 构造函数也会像工厂方法一样，根据传入值的类型返回相应基本包装类型的实例。例如：

```
var obj = new Object("some text");
alert(obj instanceof String); //true
```

把字符串传给 Object 构造函数，就会创建 String 的实例；而传入数值参数会得到 Number 的实例，传入布尔值参数就会得到 Boolean 的实例。

要注意的是，使用 new 调用基本包装类型的构造函数，与直接调用同名的转型函数是不一样的。例如：

```
var value = "25";
var number = Number(value); //转型函数
alert(typeof number); //"number"
var obj = new Number(value); //构造函数
alert(typeof obj); //"object"
```

> 在这个例子中，变量 number 中保存的是基本类型的值 25，而变量 obj 中保存的是 Number 的实例。要了解有关转型函数的更多信息，请参考第 3 章。

尽管不建议显式地创建基本包装类型的对象，但它们操作基本类型值的能力还是相当重要的。而每个基本包装类型都提供了操作相应值的便捷方法。

# 5.6.1 Boolean 类型

**Boolean 类型是与布尔值对应的引用类型**。要创建 Boolean 对象，可以像下面这样调用 Boolean构造函数并传入 true 或 false 值。

```
var booleanObject = new Boolean(true);
```

**Boolean 类型的实例重写了 valueOf() 方法，返回基本类型值true 或false；重写了 toString() 方法，返回字符串"true"和"false"**。可是，Boolean 对象在 ECMAScript 中的用处不大，因为它经常会造成人们的误解。其中最常见的问题就是在布尔表达式中使用 Boolean 对象，例如：

```
var falseObject = new Boolean(false);
var result = falseObject && true;
alert(result); //true
var falseValue = false;
result = falseValue && true;
alert(result); //false
```

> 在这个例子中，我们使用 false 值创建了一个 Boolean 对象。然后，将这个对象与基本类型值 true 构成了逻辑与表达式。在布尔运算中，false && true 等于 false。可是，示例中的这行代码是对 falseObject 而不是对它的值（false）进行求值。

前面讨论过，布尔表达式中的所有对象都会被转换为 true，因此 falseObject 对象在布尔表达式中代表的是 true。结果，true && true 当然就等于 true 了。

基本类型与引用类型的布尔值还有两个区别。

1. 首先，typeof 操作符对基本类型返回"boolean"，而对引用类型返回"object"。
2. 其次，由于 Boolean 对象是 Boolean 类型的实例，所以使用 instanceof 操作符测试 Boolean 对象会返回 true，而测试基本类型的布尔值则返回 false。

例如：

```
alert(typeof falseObject); //object
alert(typeof falseValue); //boolean
alert(falseObject instanceof Boolean); //true
alert(falseValue instanceof Boolean); //false
```

> 理解基本类型的布尔值与 Boolean 对象之间的区别非常重要——当然，**建议是永远不要使用 Boolean 对象**。

# 5.6.2 Number 类型

**Number 是与数字值对应的引用类型。要创建 Number 对象，可以在调用 Number 构造函数时向其中传递相应的数值**。下面是一个例子。

```
var numberObject = new Number(10);
```

与 Boolean 类型一样，Number 类型也重写了 valueOf()、toLocaleString()和 toString() 方法。重写后的 valueOf()方法返回对象表示的基本类型的数值，另外两个方法则返回字符串形式的数值。我们在第 3 章还介绍过，可以为 toString()方法传递一个表示基数的参数，告诉它返回几进制数值的字符串形式，如下面的例子所示。

```
var num = 10;
alert(num.toString()); //"10"
alert(num.toString(2)); //"1010"
alert(num.toString(8)); //"12"
alert(num.toString(10)); //"10"
alert(num.toString(16)); //"a"
```

除了继承的方法之外，Number 类型还提供了一些用于将数值格式化为字符串的方法。其中，toFixed() 方法会按照指定的小数位返回数值的字符串表示，例如：

```
var num = 10;
alert(num.toFixed(2)); //"10.00"
```

> 这里给 toFixed()方法传入了数值 2，意思是显示几位小数。

如果数值本身包含的小数位比指定的还多，那么接近指定的最大小数位的值就会舍入，如下面的例子所示。

```
var num = 10.005;
alert(num.toFixed(2)); //"10.01"
```

**能够自动舍入的特性，使得 toFixed()方法很适合处理货币值。但需要注意的是，不同浏览器给这个方法设定的舍入规则可能会有所不同**。在给 toFixed() 传入 0 的情况下，IE8 及之前版本不能正确舍入范围在{(-0.94,-0.5],[0.5,0.94)}之间的值。对于这个范围内的值，IE 会返回 0，而不是-1 或 1；其他浏览器都能返回正确的值。IE9 修复了这个问题。

toFixed()方法可以表示带有 0 到 20 个小数位的数值。但这只是标准实现的范围，有些浏览器也可能支持更多位数。

另外可用于格式化数值的方法是 toExponential()，该方法返回以指数表示法（也称 e 表示法）表示的数值的字符串形式。与 toFixed() 一样，toExponential() 也接收一个参数，而且该参数同样也是指定输出结果中的小数位数。看下面的例子。

```
var num = 10;
alert(num.toExponential(1)); //"1.0e+1"
```

以上代码输出了"1.0e+1"；不过，这么小的数值一般不必使用 e 表示法。如果你想得到表示某个数值的最合适的格式，就应该使用 toPrecision() 方法。对于一个数值来说，toPrecision() 方法可能会返回固定大小（fixed）格式，也可能返回指数（exponential）格式；具体规则是看哪种格式最合适。这个方法接收一个参数，即表示数值的所有数字的位数（不包括指数部分）。请看下面的例子。

```
var num = 99;
alert(num.toPrecision(1)); //"1e+2"
alert(num.toPrecision(2)); //"99"
alert(num.toPrecision(3)); //"99.0"
```

以上代码首先完成的任务是以一位数来表示 99，结果是"1e+2"，即 100。因为一位数无法准确地表示 99，因此 toPrecision() 就将它向上舍入为 100，这样就可以使用一位数来表示它了。而接下来的用两位数表示 99，当然还是"99"。最后，在想以三位数表示 99 时，toPrecision()方法返回了"99.0"。实际上，toPrecision() 会根据要处理的数值决定到底是调用 toFixed() 还是调用 toExponential()。

而这三个方法都可以通过向上或向下舍入，做到以最准确的形式来表示带有正确小数位的值。toPrecision() 方法可以表现 1 到 21 位小数。某些浏览器支持的范围更大，但这是典型实现的范围。

与 Boolean 对象类似，Number 对象也以后台方式为数值提供了重要的功能。但与此同时，**仍然不建议直接实例化 Number 类型**，而原因与显式创建 Boolean 对象一样。具体来讲，就是在使用 typeof 和 instanceof 操作符测试基本类型数值与引用类型数值时，得到的结果完全不同，如下面的例子所示。

```
var numberObject = new Number(10);
var numberValue = 10;
alert(typeof numberObject); //"object"
alert(typeof numberValue); //"number"
alert(numberObject instanceof Number); //true
alert(numberValue instanceof Number); //false
```

> 在使用 typeof 操作符测试基本类型数值时，始终会返回"number"，而在测试 Number 对象时，则会返回"object"。类似地，Number 对象是 Number 类型的实例，而基本类型的数值则不是。

# 5.6.3 String 类型

**String 类型是字符串的对象包装类型，可以像下面这样使用 String 构造函数来创建**。

```
var stringObject = new String("hello world");
```

**String 对象的方法也可以在所有基本的字符串值中访问到。其中，继承的 valueOf()、toLocaleString() 和toString() 方法，都返回对象所表示的基本字符串值**。

**String 类型的每个实例都有一个 length 属性，表示字符串中包含多个字符**。来看下面的例子。

```
var stringValue = "hello world";
alert(stringValue.length); //"11"
```

> 这个例子输出了字符串"hello world"中的字符数量，即"11"。应该注意的是，即使字符串中包含双字节字符（不是占一个字节的 ASCII 字符），每个字符也仍然算一个字符。

String 类型提供了很多方法，用于辅助完成对 ECMAScript 中字符串的解析和操作。

## 5.6.3.1 字符方法

**两个用于访问字符串中特定字符的方法是：charAt() 和 charCodeAt()。这两个方法都接收一个参数，即基于 0 的字符位置**。其中，charAt()方法以单字符字符串的形式返回给定位置的那个字符（ECMAScript 中没有字符类型）。例如：

```
var stringValue = "hello world";
alert(stringValue.charAt(1)); //"e"
```

> 字符串"hello world"位置 1 处的字符是"e"，因此调用 charAt(1)就返回了"e"。

**如果你想得到的不是字符而是字符编码**，那么就要像下面这样使用 charCodeAt() 了。

```
var stringValue = "hello world";
alert(stringValue.charCodeAt(1)); //输出"101"（ e 的字符编码 101）
```

> 这个例子输出的是"101"，也就是小写字母"e"的字符编码。

ECMAScript 5 还定义了另一个访问个别字符的方法。在支持此方法的浏览器中，可以使用方括号加数字索引来访问字符串中的特定字符，如下面的例子所示。

```
var stringValue = "hello world";
alert(stringValue[1]); //"e"
```

> 使用方括号表示法访问个别字符的语法得到了 IE8 及 Firefox、Safari、Chrome 和 Opera 所有版本的支持。如果是在 IE7 及更早版本中使用这种语法，会返回 undefined 值（尽管根本不是特殊的undefined 值）。

## 5.6.3.2 字符串操作方法

下面介绍与操作字符串有关的几个方法。第一个就是 **concat()，用于将一或多个字符串拼接起来，返回拼接得到的新字符串**。先来看一个例子。

```
var stringValue = "hello ";
var result = stringValue.concat("world");
alert(result); //"hello world"
alert(stringValue); //"hello"
```

> 在这个例子中，通过 stringValue 调用 concat() 方法返回的结果是"hello world"——但stringValue 的值则保持不变。

实际上，**concat() 方法可以接受任意多个参数**，也就是说可以通过它拼接任意多个字符串。再看一个例子：

```
var stringValue = "hello ";
var result = stringValue.concat("world", "!");
alert(result); //"hello world!"
alert(stringValue); //"hello"
```

> 实践中使用更多的还是加号操作符（+）。而且，使用加号操作符在大多数情况下都比使用concat()方法要简便易行（特别是在拼接多个字符串的情况下）。

**ECMAScript还提供了三个基于子字符串创建新字符串的方法：slice()、substr() 和 substring()。这三个方法都会返回被操作字符串的一个子字符串，而且也都接受一或两个参数。第一个参数指定子字符串的开始位置，第二个参数（在指定的情况下）表示子字符串到哪里结束**。

具体来说，**slice() 和 substring() 的第二个参数指定的是子字符串最后一个字符后面的位置**。而 **substr() 的第二个参数指定的则是返回的字符个数**。如果**没有给这些方法传递第二个参数，则将字符串的长度作为结束位置**。与 concat() 方法一样，**slice()、substr() 和 substring() 也不会修改字符串本身的值——它们只是返回一个基本类型的字符串值，对原始字符串没有任何影响**。请看下面的例子。

```
var stringValue = "hello world";
alert(stringValue.slice(3)); //"lo world"
alert(stringValue.substring(3)); //"lo world"
alert(stringValue.substr(3)); //"lo world"
alert(stringValue.slice(3, 7)); //"lo w"
alert(stringValue.substring(3,7)); //"lo w"
alert(stringValue.substr(3, 7)); //"lo worl"（7是指，返回的字符个数）
```

> slice()和 substring()返回"lo w"（"world"中的"o"处于位置 7，因此结果中不包含"o"），但 substr()返回"lo worl"，因为它的第二
个参数指定的是要返回的字符个数。

在传递给这些方法的参数是负值的情况下，它们的行为就不尽相同了。

1. 其中，slice() 方法会将传入的负值与字符串的长度相加，
2. substr() 方法将负的第一个参数加上字符串的长度，而将负的第二个参数转换为 0。
3. 最后，substring() 方法会把所有负值参数都转换为 0。下面来看例子。

```
var stringValue = "hello world";
alert(stringValue.slice(-3)); //"rld"
alert(stringValue.substring(-3)); //"hello world"
alert(stringValue.substr(-3)); //"rld"
alert(stringValue.slice(3, -4)); //"lo w"
alert(stringValue.substring(3, -4)); //"hel"
alert(stringValue.substr(3, -4)); //""（空字符串）
```

> 在给 slice()和 substr()传递一个负值参数时，它们的行为相同。这是因为-3 会被转换为 8（字符串长度加参数 11+(-3)=8），实际上相当于调用了 slice(8)和 substr(8)。但 substring()方法则返回了全部字符串，因为它将-3 转换成了 0。IE 的 JavaScript 实现在处理向 substr() 方法传递负值的情况时存在问题，它会返回原始的字符串。IE9 修复了这个问题。当第二个参数是负值时，这三个方法的行为各不相同。slice() 方法会把第二个参数转换为 7，这就相当于调用了 slice(3,7)，因此返回"lo w"。substring()方法会把第二个参数转换为 0，使调用变成了 substring(3,0)，而由于这个方法会将较小的数作为开始位置，将较大的数作为结束位置，因此最终相当于调用了 substring(0,3)。substr()也会将第二个参数转换为 0，这也就意味着返回包含零个字符的字符串，也就是一个空字符串。

## 5.6.3.3 字符串位置方法

**有两个可以从字符串中查找子字符串的方法：indexOf() 和 lastIndexOf()。这两个方法都是从一个字符串中搜索给定的子字符串，然后返子字符串的位置（如果没有找到该子字符串，则返回-1）**。

**这两个方法的区别在于：indexOf()方法从字符串的开头向后搜索子字符串，而 lastIndexOf() 方法是从字符串的末尾向前搜索子字符串**。还是来看一个例子吧。

```
var stringValue = "hello world";
alert(stringValue.indexOf("o")); //4
alert(stringValue.lastIndexOf("o")); //7
```

> 子字符串"o"第一次出现的位置是 4，即"hello"中的"o"；最后一次出现的位置是 7，即"world"中的"o"。如果"o"在这个字符串中仅出现了一次，那么 indexOf()和 lastIndexOf()会返回相同的位置值。

**这两个方法都可以接收可选的第二个参数，表示从字符串中的哪个位置开始搜索**。换句话说，**indexOf() 会从该参数指定的位置向后搜索，忽略该位置之前的所有字符；而 lastIndexOf() 则会从指定的位置向前搜索，忽略该位置之后的所有字符**。看下面的例子。

```
var stringValue = "hello world";
alert(stringValue.indexOf("o", 6)); //7
alert(stringValue.lastIndexOf("o", 6)); //4
```

在将第二个参数 6 传递给这两个方法之后，得到了与前面例子相反的结果。这一次，由于 indexOf() 是从位置 6（字母"w"）开始向后搜索，结果在位置 7 找到了"o"，因此它返回 7。而 lastIndexOf() 是从位置 6 开始向前搜索。结果找到了"hello"中的"o"，因此它返回 4。在使用第二个参数的情况下，可以通过循环调用 indexOf()或 lastIndexOf()来找到所有匹配的子字符串，如下面的例子所示：

```
var stringValue = "Lorem ipsum dolor sit amet, consectetur adipisicing elit";
var positions = new Array();
var pos = stringValue.indexOf("e");
while(pos > -1){
 positions.push(pos);
 pos = stringValue.indexOf("e", pos + 1);
}

alert(positions); //"3,24,32,35,52"
```

这个例子通过不断增加 indexOf()方法开始查找的位置，遍历了一个长字符串。在循环之外，首先找到了"e"在字符串中的初始位置；而进入循环后，则每次都给 indexOf()传递上一次的位置加 1。这样，就确保了每次新搜索都从上一次找到的子字符串的后面开始。每次搜索返回的位置依次被保存在数组 positions 中，以便将来使用。

## 5.6.3.4 trim() 方法

ECMAScript 5 为所有字符串定义了 **trim() 方法。这个方法会创建一个字符串的副本，删除前置及后缀的所有空格，然后返回结果**。例如：

```
var stringValue = " hello world ";
var trimmedStringValue = stringValue.trim();
alert(stringValue); //" hello world "
alert(trimmedStringValue); //"hello world"
```

由于 trim()返回的是字符串的副本，所以原始字符串中的前置及后缀空格会保持不变。支持这个方法的浏览器有 IE9+、Firefox 3.5+、Safari 5+、Opera 10.5+和 Chrome。此外，Firefox 3.5+、Safari 5+ 和 Chrome 8+还支持非标准的 trimLeft()和 trimRight()方法，分别用于删除字符串开头和末尾的空格。

## 5.6.3.5 字符串大小转换方法

接下来要介绍的是一组与大小写转换有关的方法。**ECMAScript 中涉及字符串大小写转换的方法有 4 个：toLowerCase()、toLocaleLowerCase()、toUpperCase() 和 toLocaleUpperCase()**。

其中，toLowerCase()和 toUpperCase()是两个经典的方法，借鉴自 java.lang.String 中的同名方法。而 toLocaleLowerCase()和 toLocaleUpperCase()方法则是针对特定地区的实现。对有些地区来说，针对地区的方法与其通用方法得到的结果相同，但少数语言（如土耳其语）会为 Unicode 大小写转换应用特殊的规则，这时候就必须使用针对地区的方法来保证实现正确的转换。以下是几个例子。

```
var stringValue = "hello world";
alert(stringValue.toLocaleUpperCase()); //"HELLO WORLD"
alert(stringValue.toUpperCase()); //"HELLO WORLD"
alert(stringValue.toLocaleLowerCase()); //"hello world"
alert(stringValue.toLowerCase()); //"hello world"
```

以上代码调用的 toLocaleUpperCase() 和 toUpperCase() 都返回了"HELLO WORLD"，就像调用toLocaleLowerCase() 和 toLowerCase() 都返回"hello world"一样。一般来说，在不知道自己的代码将在哪种语言环境中运行的情况下，还是使用针对地区的方法更稳妥一些。

## 5.6.3.6 字符串的模式匹配方法

String 类型定义了几个用于在字符串中匹配模式的方法。第一个方法就是 **match()，在字符串上调用这个方法，本质上与调用 RegExp 的 exec()方法相同。match()方法只接受一个参数，要么是一个正则表达式，要么是一个 RegExp 对象**。来看下面的例子。

```
var text = "cat, bat, sat, fat";
var pattern = /.at/;
//与 pattern.exec(text)相同
var matches = text.match(pattern);
alert(matches.index); //0
alert(matches[0]); //"cat"
alert(pattern.lastIndex); //0
```

> 本例中的 match() 方法返回了一个数组；如果是调用 RegExp 对象的 exec()方法并传递本例中的字符串作为参数，那么也会得到与此相同的数组：数组的第一项是与整个模式匹配的字符串，之后的每一项（如果有）保存着与正则表达式中的捕获组匹配的字符串。

另一个用于查找模式的方法是 **search()。这个方法的唯一参数与 match()方法的参数相同：由字符串或 RegExp 对象指定的一个正则表达式。search()方法返回字符串中第一个匹配项的索引；如果没有找到匹配项，则返回-1。而且，search()方法始终是从字符串开头向后查找模式**。看下面的例子。

```
var text = "cat, bat, sat, fat";
var pos = text.search(/at/);
alert(pos); //1
```

> 这个例子中的 search()方法返回 1，即"at"在字符串中第一次出现的位置。

为了简化替换子字符串的操作，ECMAScript 提供了 **replace() 方法。这个方法接受两个参数：第一个参数可以是一个 RegExp 对象或者一个字符串（这个字符串不会被转换成正则表达式），第二个参数可以是一个字符串或者一个函数。如果第一个参数是字符串，那么只会替换第一个子字符串**。要想替换所有子字符串，唯一的办法就是提供一个正则表达式，而且要指定全局（g）标志，如下所示。

```
var text = "cat, bat, sat, fat";
var result = text.replace("at", "ond");
alert(result); //"cond, bat, sat, fat"
result = text.replace(/at/g, "ond");
alert(result); //"cond, bond, sond, fond"
```

> 在这个例子中，首先传入 replace()方法的是字符串"at"和替换用的字符串"ond"。替换的结果是把"cat"变成了"cond"，但字符串中的其他字符并没有受到影响。然后，通过将第一个参数修改为带有全局标志的正则表达式，就将全部"at"都替换成了"ond"。

如果第二个参数是字符串，那么还可以使用一些特殊的字符序列，将正则表达式操作得到的值插入到结果字符串中。下表列出了 ECMAScript 提供的这些特殊的字符序列。

| 字符序列 | 替换文本 |
| ------- | ------- |
| $$ | $ |
| $& | 匹配整个模式的子字符串。与RegExp.lastMatch的值相同 |
| $' | 匹配的子字符串之前的子字符串。与RegExp.leftContext的值相同 |
| $` | 匹配的子字符串之后的子字符串。与RegExp.rightContext的值相同 |
| $n | 匹配第n个捕获组的子字符串，其中n等于0～9。例如，$1是匹配第一个捕获组的子字符串，$2是匹配第 |

二个捕获组的子字符串，以此类推。如果正则表达式中没有定义捕获组，则使用空字符串 $nn 匹配第 nn 个捕获组的子字符串，其中 nn 等于01～99。例如，$01 是匹配第一个捕获组的子字符串，$02 是匹配第二个捕获组的子字符串，以此类推。如果正则表达式中没有定义捕获组，则使用空字符串通过这些特殊的字符序列，可以使用最近一次匹配结果中的内容，如下面的例子所示。

```
var text = "cat, bat, sat, fat";
result = text.replace(/(.at)/g, "word ($1)");
alert(result); //word (cat), word (bat), word (sat), word (fat)
```

> 此，每个以"at"结尾的单词都被替换了，替换结果是"word"后跟一对圆括号，而圆括号中是被字符序列 $1 所替换的单词。

replace() 方法的第二个参数也可以是一个函数。在只有一个匹配项（即与模式匹配的字符串）的情况下，会向这个函数传递 3 个参数：模式的匹配项、模式匹配项在字符串中的位置和原始字符串。在正则表达式中定义了多个捕获组的情况下，传递给函数的参数依次是模式的匹配项、第一个捕获组的匹配项、第二个捕获组的匹配项……，但最后两个参数仍然分别是模式的匹配项在字符串中的位置和原始字符串。这个函数应该返回一个字符串，表示应该被替换的匹配项使用函数作为 replace()方法的第二个参数可以实现更加精细的替换操作，请看下面这个例子。

```
function htmlEscape(text){
 return text.replace(/[<>"&]/g, function(match, pos, originalText){
 switch(match){
 case "<":
 return "&lt;";
 case ">":
 return "&gt;";
 case "&":
 return "&amp;";
 case "\"":
 return "&quot;";
 }
 });
}
alert(htmlEscape("<p class=\"greeting\">Hello world!</p>"));
//&lt;p class=&quot;greeting&quot;&gt;Hello world!&lt;/p&gt;
```

> 这里，我们为插入 HTML 代码定义了函数 htmlEscape()，这个函数能够转义 4 个字符：小于号、大于号、和号以及双引号。实现这种转义的最简单方式，就是使用正则表达式查找这几个字符，然后定义一个能够针对每个匹配的字符返回特定 HTML 实体的函数。

最后一个与模式匹配有关的方法是 **split()，这个方法可以基于指定的分隔符将一个字符串分割成多个子字符串，并将结果放在一个数组中**。分隔符可以是字符串，也可以是一个 RegExp 对象（这个方法不会将字符串看成正则表达式）。split()方法可以接受可选的第二个参数，用于指定数组的大小，以便确保返回的数组不会超过既定大小。请看下面的例子。

```
var colorText = "red,blue,green,yellow";
var colors1 = colorText.split(","); //["red", "blue", "green", "yellow"]
var colors2 = colorText.split(",", 2); //["red", "blue"]
var colors3 = colorText.split(/[^\,]+/); //["", ",", ",", ",", ""]
```

在这个例子中，colorText 是逗号分隔的颜色名字符串。基于该字符串调用 split(",") 会得到一个包含其中颜色名的数组，用于分割字符串的分隔符是逗号。为了将数组截短，让它只包含两项，可以为 split() 方法传递第二个参数 2。最后，通过使用正则表达式，还可以取得包含逗号字符的数组。需要注意的是，在最后一次调用 split()返回的数组中，第一项和最后一项是两个空字符串。之所以会这样，是因为通过正则表达式指定的分隔符出现在了字符串的开头（即子字符串"red"）和末尾（即子字符串"yellow"）。

对 split()中正则表达式的支持因浏览器而异。尽管对于简单的模式没有什么差别，但对于未发现匹配项以及带有捕获组的模式，匹配的行为就不大相同了。以下是几种常见的差别。

1. IE8 及之前版本会忽略捕获组。ECMA-262 规定应该把捕获组拼接到结果数组中。IE9 能正确地在结果中包含捕获组。
2. Firefox 3.6 及之前版本在捕获组未找到匹配项时，会在结果数组中包含空字符串；ECMA-262 规定没有匹配项的捕获组在结果数组中应该用 undefined 表示。

## 5.6.3.7 localeCompare() 方法

与操作字符串有关的最后一个方法是 **localeCompare()，这个方法比较两个字符串，并返回下列值中的一个**：

1. 如果字符串在字母表中应该排在字符串参数之前，则返回一个负数（大多数情况下是-1，具体的值要视实现而定）；
2. 如果字符串等于字符串参数，则返回 0；
3. 如果字符串在字母表中应该排在字符串参数之后，则返回一个正数（大多数情况下是 1，具体的值同样要视实现而定）。

下面是几个例子。

```
var stringValue = "yellow";
alert(stringValue.localeCompare("brick")); //1
alert(stringValue.localeCompare("yellow")); //0
alert(stringValue.localeCompare("zoo")); //-1
```

> 这个例子比较了字符串"yellow"和另外几个值："brick"、"yellow"和"zoo"。因为"brick"在字母表中排在"yellow"之前，所以 localeCompare() 返回了 1；而"yellow"等于"yellow"，所以localeCompare() 返回了 0；最后，"zoo"在字母表中排在"yellow"后面，所以 localeCompare() 返回了-1。

再强调一次，因为 localeCompare()返回的数值取决于实现，所以最好是像下面例子所示的这样使用这个方法。

```
function determineOrder(value) {
 var result = stringValue.localeCompare(value);
 if (result < 0){
 alert("The string 'yellow' comes before the string '" + value + "'.");
 } else if (result > 0) {
 alert("The string 'yellow' comes after the string '" + value + "'.");
 } else {
 alert("The string 'yellow' is equal to the string '" + value + "'.");
 }
}
determineOrder("brick");
determineOrder("yellow");
determineOrder("zoo");
```

> 使用这种结构，就可以确保自己的代码在任何实现中都可以正确地运行了。

localeCompare()方法比较与众不同的地方，就是实现所支持的地区（国家和语言）决定了这个方法的行为。比如，美国以英语作为 ECMAScript 实现的标准语言，因此 localeCompare() 就是区分大小写的，于是大写字母在字母表中排在小写字母前头就成为了一项决定性的比较规则。不过，在其他地区恐怕就不是这种情况了。

## 5.6.3.8 fromCharCode() 方法

另外，String 构造函数本身还有一个静态方法：**fromCharCode()。这个方法的任务是接收一或多个字符编码，然后将它们转换成一个字符串。从本质上来看，这个方法与实例方法 charCodeAt() 执行的是相反的操作**。来看一个例子：

```
alert(String.fromCharCode(104, 101, 108, 108, 111)); //"hello"
```

在这里，我们给 fromCharCode()传递的是字符串"hello"中每个字母的字符编码。

## 5.6.3.9 HTML 方法

早期的 Web 浏览器提供商觉察到了使用 JavaScript 动态格式化 HTML 的需求。于是，这些提供商就扩展了标准，实现了一些专门用于简化常见 HTML 格式化任务的方法。下表列出了这些 HTML 方法。不过，需要请读者注意的是，应该尽量不使用这些方法，因为它们创建的标记通常无法表达语义。

| 方 法 | 输出结果 |
| ----- | ------- |
| anchor(name) | `<a name= "name">string</a>` |
| big() | `<big>string</big>` |
| bold() | `<b>string</b>` |
| fixed() | `<tt>string</tt>` |
| fontcolor(color) | `<font color="color">string</font>` |
| fontsize(size) | `<font size="size">string</font>` |
| italics() | `<i>string</i>` |
| link(url) | `<a href="url">string</a>` |
| small() | `<small>string</small>` |
| strike() | `<strike>string</strike>` |
| sub() | `<sub>string</sub>` |
| sup() | `<sup>string</sup>` |
