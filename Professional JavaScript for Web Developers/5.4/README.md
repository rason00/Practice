# 5.4 RegExp 类型

**ECMAScript 通过 RegExp 类型来支持正则表达式。使用下面类似 Perl 的语法，就可以创建一个正则表达式**。

```
var expression = / pattern / flags ;
```

# 内容涵盖

1. RegExp 实例属性
2. RegExp 实例方法
3. RegExp 构造函数属性
4. 模式的局限性

其中的模式（pattern）部分可以是任何简单或复杂的正则表达式，可以包含字符类、限定符、分组、向前查找以及反向引用。每个正则表达式都可带有一或多个标志（flags），用以标明正则表达式的行为。**正则表达式的匹配模式支持下列 3 个标志**。

1. g：表示全局（global）模式，即模式将被应用于所有字符串，而非在发现第一个匹配项时立即停止；
2. i：表示不区分大小写（case-insensitive）模式，即在确定匹配项时忽略模式与字符串的大小写；
3. m：表示多行（multiline）模式，即在到达一行文本末尾时还会继续查找下一行中是否存在与模式匹配的项。

因此，一个正则表达式就是一个模式与上述 3 个标志的组合体。不同组合产生不同结果，如下面的例子所示。

```
/*
* 匹配字符串中所有"at"的实例
*/
var pattern1 = /at/g;

/*
* 匹配第一个"bat"或"cat"，不区分大小写
*/
var pattern2 = /[bc]at/i;

/*
* 匹配所有以"at"结尾的 3 个字符的组合，不区分大小写
*/
var pattern3 = /.at/gi;
```

与其他语言中的正则表达式类似，模式中使用的所有元字符都必须转义。正则表达式中的元字符包括：

```
( [ { \ ^ $ | ) ? * + .]}
```

这些元字符在正则表达式中都有一或多种特殊用途，因此如果想要匹配字符串中包含的这些字符，就必须对它们进行转义。下面给出几个例子。

```
/*
* 匹配第一个"bat"或"cat"，不区分大小写
*/
var pattern1 = /[bc]at/i;

/*
* 匹配第一个" [bc]at"，不区分大小写
*/
var pattern2 = /\[bc\]at/i;

/*
* 匹配所有以"at"结尾的 3 个字符的组合，不区分大小写
*/
var pattern3 = /.at/gi;

/*
* 匹配所有".at"，不区分大小写
*/
var pattern4 = /\.at/gi;
```

> 在上面的例子中，pattern1 匹配第一个"bat"或"cat"，不区分大小写。而要想直接匹配"[bc]at"的话，就需要像定义 pattern2 一样，对其中的两个方括号进行转义。对于 pattern3 来说，句点表示位于"at"之前的任意一个可以构成匹配项的字符。但如果想匹配".at"，则必须对句点本身进行转义，如 pattern4 所示。

前面举的这些例子都是以字面量形式来定义的正则表达式。**另一种创建正则表达式的方式是使用 RegExp 构造函数，它接收两个参数：一个是要匹配的字符串模式，另一个是可选的标志字符串**。可以使用字面量定义的任何表达式，都可以使用构造函数来定义，如下面的例子所示。

```
/*
* 匹配第一个"bat"或"cat"，不区分大小写
*/
var pattern1 = /[bc]at/i;

/*
* 与 pattern1 相同，只不过是使用构造函数创建的
*/
var pattern2 = new RegExp("[bc]at", "i");
```

> 在此，pattern1 和 pattern2 是两个完全等价的正则表达式。**要注意的是，传递给 RegExp 构造函数的两个参数都是字符串（不能把正则表达式字面量传递给 RegExp 构造函数）。由于 RegExp 构造函数的模式参数是字符串，所以在某些情况下要对字符进行双重转义**。

**所有元字符都必须双重转义，那些已经转义过的字符也是如此，例如\n（字符\在字符串中通常被转义为\\，而在正则表达式字符串中就会变成\\\\）**。下表给出了一些模式，左边是这些模式的字面量形式，右边是使用 RegExp 构造函数定义相同模式时使用的字符串。

| 字面量模式 | 等价的字符串 |
| --------- | ----------- |
| /\[bc\]at/ | "\\[bc\\]at" |
| /\.at/ | "\\.at" |
| /name\/age/ | "name\\/age" |
| /\d.\d{1,2}/ | "\\d.\\d{1,2}" |
| /\w\\hello\\123/ | "\\w\\\\hello\\\\123" |

使用正则表达式字面量和使用 RegExp 构造函数创建的正则表达式不一样。在 ECMAScript 3 中，正则表达式字面量始终会共享同一个 RegExp 实例，而使用构造函数创建的每一个新 RegExp 实例都是一个新实例。来看下面的例子。

```
var re = null,
    i;

for (i=0; i < 10; i++){
 re = /cat/g;
 re.test("catastrophe");
}

for (i=0; i < 10; i++){
 re = new RegExp("cat", "g");
 re.test("catastrophe");
}
```

> 在第一个循环中，即使是循环体中指定的，**但实际上只为/cat/创建了一个 RegExp 实例。由于实例属性（下一节介绍实例属性）不会重置，所以在循环中再次调用 test() 方法会失败**。**这是因为第一次调用 test() 找到了"cat"，但第二次调用是从索引为 3 的字符（上一次匹配的末尾）开始的，所以就找不到它了**。由于会测试到字符串末尾，所以下一次再调用 test() 就又从开头开始了。

> 第二个循环使用 RegExp 构造函数在每次循环中创建正则表达式。**因为每次迭代都会创建一个新的 RegExp 实例，所以每次调用 test() 都会返回 true**。**ECMAScript 5 明确规定，使用正则表达式字面量必须像直接调用 RegExp 构造函数一样，每次都创建新的 RegExp 实例。IE9+、Firefox 4+和 Chrome 都据此做出了修改**。

# 5.4.1 RegExp 实例属性

RegExp 的每个实例都具有下列属性，通过这些属性可以取得有关模式的各种信息。

1. global：布尔值，表示是否设置了 g 标志。
2. ignoreCase：布尔值，表示是否设置了 i 标志。
3. multiline：布尔值，表示是否设置了 m 标志。
4. lastIndex：整数，表示开始搜索下一个匹配项的字符位置，从 0 算起。
5. source：正则表达式的字符串表示，按照字面量形式而非传入构造函数中的字符串模式返回。

通过这些属性可以获知一个正则表达式的各方面信息，但却没有多大用处，因为这些信息全都包含在模式声明中。例如：

```
var pattern1 = /\[bc\]at/i;

alert(pattern1.global);       //false
alert(pattern1.ignoreCase);   //true
alert(pattern1.multiline);    //false
alert(pattern1.lastIndex);    //0
alert(pattern1.source);       //"\[bc\]at"

var pattern2 = new RegExp("\\[bc\\]at", "i");

alert(pattern2.global);       //false
alert(pattern2.ignoreCase);   //true
alert(pattern2.multiline);    //false
alert(pattern2.lastIndex);    //0
alert(pattern2.source);       //"\[bc\]at"
```

> 我们注意到，尽管第一个模式使用的是字面量，第二个模式使用了 RegExp 构造函数，但它们的 source 属性是相同的。可见，source 属性保存的是规范形式的字符串，即字面量形式所用的字符串。

# 5.4.2 RegExp 实例方法

**RegExp 对象的主要方法是 exec()，该方法是专门为捕获组而设计的**。

**exec()接受一个参数，即要应用模式的字符串，然后返回包含第一个匹配项信息的数组；或者在没有匹配项的情况下返回 null**。

**返回的数组虽然是 Array 的实例，但包含两个额外的属性：index 和 input。其中，index 表示匹配项在字符串中的位置，而 input 表示应用正则表达式的字符串**。在数组中，第一项是与整个模式匹配的字符串，其他项是与模式中的捕获组匹配的字符串（如果模式中没有捕获组，则该数组只包含一项）。请看下面的例子。

```
var text = "mom and dad and baby";
var pattern = /mom( and dad( and baby)?)?/gi;
var matches = pattern.exec(text);
alert(matches.index); // 0
alert(matches.input); // "mom and dad and baby"
alert(matches[0]);    // "mom and dad and baby"
alert(matches[1]);    // " and dad and baby"
alert(matches[2]);    // " and baby"
```

> 这个例子中的模式包含两个捕获组。最内部的捕获组匹配"and baby"，而包含它的捕获组匹配"anddad"或者"and dad and baby"。当把字符串传入 exec()方法中之后，发现了一个匹配项。**因为整个字符串本身与模式匹配，所以返回的数组 matchs 的 index 属性值为 0。数组中的第一项是匹配的整个字符串，第二项包含与第一个捕获组匹配的内容，第三项包含与第二个捕获组匹配的内容**。

对于 exec() 方法而言，即使在模式中设置了全局标志（g），它每次也只会返回一个匹配项。**在不设置全局标志的情况下，在同一个字符串上多次调用 exec() 将始终返回第一个匹配项的信息**。**而在设置全局标志的情况下，每次调用 exec() 则都会在字符串中继续查找新匹配项**，如下面的例子所示。

```
var text = "cat, bat, sat, fat";

var pattern1 = /.at/;
var matches = pattern1.exec(text);

alert(matches.index);           //0
alert(matches[0]);              //cat
alert(pattern1.lastIndex);      //0

matches = pattern1.exec(text);

alert(matches.index);           //0
alert(matches[0]);              //cat
alert(pattern1.lastIndex);      //0

var pattern2 = /.at/g;
var matches = pattern2.exec(text);

alert(matches.index);           //0
alert(matches[0]);              //cat
alert(pattern2.lastIndex);      //3

matches = pattern2.exec(text);

alert(matches.index);           //5
alert(matches[0]);              //bat
alert(pattern2.lastIndex);      //8
```

> 第一个模式 pattern1 不是全局模式，因此每次调用 exec() 返回的都是第一个匹配项（"cat"）。而第二个模式 pattern2 是全局模式，因此每次调用 exec() 都会返回字符串中的下一个匹配项，直至搜索到字符串末尾为止。此外，还应该注意模式的 lastIndex 属性的变化情况。在全局匹配模式下，lastIndex 的值在每次调用 exec() 后都会增加，而在非全局模式下则始终保持不变。

**IE 的 JavaScript 实现在 lastIndex 属性上存在偏差，即使在非全局模式下，lastIndex 属性每次也会变化**。

**正则表达式的第二个方法是 test()，它接受一个字符串参数。在模式与该参数匹配的情况下返回true；否则，返回 false**。**在只想知道目标字符串与某个模式是否匹配，但不需要知道其文本内容的情况下，使用这个方法非常方便**。因此，test() 方法经常被用在 if 语句中，如下面的例子所示。

```
var text = "000-00-0000";
var pattern = /\d{3}-\d{2}-\d{4}/;
if (pattern.test(text)){
 alert("The pattern was matched.");
}
```

> 在这个例子中，我们使用正则表达式来测试了一个数字序列。如果输入的文本与模式匹配，则显示一条消息。这种用法经常出现在验证用户输入的情况下，因为我们只想知道输入是不是有效，至于它为什么无效就无关紧要了。

RegExp 实例继承的 toLocaleString() 和 toString() 方法都会返回正则表达式的字面量，与创建正则表达式的方式无关。例如：

```
var pattern = new RegExp("\\[bc\\]at", "gi")
;
alert(pattern.toString());        // /\[bc\]at/gi
alert(pattern.toLocaleString());  // /\[bc\]at/gi
```

> 即使上例中的模式是通过调用 RegExp 构造函数创建的，但 toLocaleString() 和 toString() 方法仍然会像它是以字面量形式创建的一样显示其字符串表示。正则表达式的 valueOf()方法返回正则表达式本身。

# 5.4.3 RegExp 构造函数属性

RegExp 构造函数包含一些属性（这些属性在其他语言中被看成是静态属性）。**这些属性适用于作用域中的所有正则表达式，并且基于所执行的最近一次正则表达式操作而变化**。

关于这些属性的另一个独特之处，就是可以通过两种方式访问它们。换句话说，这些属性分别有一个长属性名和一个短属性名（Opera 是例外，它不支持短属性名）。下表列出了 RegExp 构造函数的属性。

| 长属性名 | 短属性名 | 说 明 |
| ------- | --------  | ---- |
| input | $_ | 最近一次要匹配的字符串。Opera未实现此属性 |
| lastMatch | $& | 最近一次的匹配项。Opera未实现此属性 |
| lastParen | $+ | 最近一次匹配的捕获组。Opera未实现此属性 |
| leftContext | $` | input字符串中lastMatch之前的文 |本
| multiline | $* | 布尔值，表示是否所有表达式都使用多行模式。IE和Opera未实现此属性 |
| rightContext | $' | Input字符串中lastMatch之后的文本 |

使用这些属性可以从 exec() 或 test() 执行的操作中提取出更具体的信息。请看下面的例子。

```
var text = "this has been a short summer";
var pattern = /(.)hort/g;

/*
 * 注意：Opera 不支持 input、lastMatch、lastParen 和 multiline 属性
 * Internet Explorer 不支持 multiline 属性
 */

if (pattern.test(text)){
 alert(RegExp.input);         // this has been a short summer
 alert(RegExp.leftContext);   // this has been a
 alert(RegExp.rightContext);  // summer
 alert(RegExp.lastMatch);     // short
 alert(RegExp.lastParen);     // s
 alert(RegExp.multiline);     // false
}
```

以上代码创建了一个模式，匹配任何一个字符后跟 hort，而且把第一个字符放在了一个捕获组中。RegExp 构造函数的各个属性返回了下列值：

1. input 属性返回了原始字符串；
2. leftContext 属性返回了单词 short 之前的字符串，而 rightContext 属性则返回了 short之后的字符串；
3. lastMatch 属性返回最近一次与整个正则表达式匹配的字符串，即 short；
4. lastParen 属性返回最近一次匹配的捕获组，即例子中的 s。

如前所述，**例子使用的长属性名都可以用相应的短属性名来代替。只不过，由于这些短属性名大都不是有效的 ECMAScript 标识符，因此必须通过方括号语法来访问它们**，如下所示。

```
var text = "this has been a short summer";
var pattern = /(.)hort/g;

/*
 * 注意：Opera 不支持 input、lastMatch、lastParen 和 multiline 属性
 * Internet Explorer 不支持 multiline 属性
 */

if (pattern.test(text)){
 alert(RegExp.$_);        // this has been a short summer
 alert(RegExp["$`"]);     // this has been a
 alert(RegExp["$'"]);     // summer
 alert(RegExp["$&"]);     // short
 alert(RegExp["$+"]);     // s
 alert(RegExp["$*"]);     // false
}
```

除了上面介绍的几个属性之外，还有多达 9 个用于存储捕获组的构造函数属性。访问这些属性的语法是 RegExp.$1、RegExp.$2…RegExp.$9，分别用于存储第一、第二……第九个匹配的捕获组。在调用 exec()或 test()方法时，这些属性会被自动填充。然后，我们就可以像下面这样来使用它们。

```
var text = "this has been a short summer";
var pattern = /(..)or(.)/g;

if (pattern.test(text)){
 alert(RegExp.$1);        //sh
 alert(RegExp.$2);        //t
}
```

这里创建了一个包含两个捕获组的模式，并用该模式测试了一个字符串。即使 test() 方法只返回一个布尔值，但 RegExp 构造函数的属性 $1 和 $2 也会被匹配相应捕获组的字符串自动填充。

# 5.4.4 模式的局限性

尽管 ECMAScript 中的正则表达式功能还是比较完备的，但仍然缺少某些语言（特别是 Perl）所支持的高级正则表达式特性。下面列出了 ECMAScript 正则表达式不支持的特性（要了解更多相关信息，请访问 www.regular-expressions.info）。

1. 匹配字符串开始和结尾的\A 和\Z 锚（但支持以插入符号（^）和美元符号（$）来匹配字符串的开始和结尾）
2. 向后查找（lookbehind）（但完全支持向前查找（lookahead））
3. 并集和交集类
4. 原子组（atomic grouping）
5. Unicode 支持（单个字符除外，如\uFFFF）
6. 命名的捕获组（但支持编号的捕获组）
7. s（single，单行）和 x（free-spacing，无间隔）匹配模式
8. 条件匹配
9. 正则表达式注释
