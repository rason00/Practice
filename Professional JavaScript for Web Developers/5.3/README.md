# 5.3 Date 类型

**Date类型使用自 UTC（Coordinated Universal Time，国际协调时间）1970 年 1 月 1 日午夜（零时）开始经过的毫秒数来保存日期。在使用这种数据存储格式的条件下，Date 类型保存的日期能够精确到 1970 年 1 月 1 日之前或之后的 285616 年**。

# 内容涵盖

1. 继承的方法
2. 日期格式化方法
3. 日期/时间组件方法

要**创建一个日期对象，使用 new 操作符和 Date 构造函数即可**，如下所示。

```
var now = new Date();
```

**在调用 Date 构造函数而不传递参数的情况下，新创建的对象自动获得当前日期和时间**。

如果想根据特定的日期和时间创建日期对象，必须传入表示该日期的毫秒数（即从 UTC 时间 1970 年 1 月 1 日午夜起至该日期止经过的毫秒数）。为了简化这一计算过程，ECMAScript 提供了两个方法：Date.parse()和 Date.UTC()。

其中，**Date.parse() 方法接收一个表示日期的字符串参数，然后尝试根据这个字符串返回相应日期的毫秒数**。ECMA-262 没有定义 Date.parse() 应该支持哪种日期格式，因此这个方法的行为因实现而异，而且通常是因地区而异。将地区设置为美国的浏览器通常都接受下列日期格式：

1. “月/日/年”，如 6/13/2004；
2. “英文月名 日,年”，如 January 12,2004；
3. “英文星期几 英文月名 日 年 时:分:秒 时区”，如 Tue May 25 2004 00:00:00 GMT-0700。
4. ISO 8601 扩展格式 YYYY-MM-DDTHH:mm:ss.sssZ（例如 2004-05-25T00:00:00）。只有兼容ECMAScript 5 的实现支持这种格式。

例如，要为 2004 年 5 月 25 日创建一个日期对象，可以使用下面的代码：

```
var someDate = new Date(Date.parse("May 25, 2004"));
```

**如果传入 Date.parse() 方法的字符串不能表示日期，那么它会返回 NaN**。实际上，**如果直接将表示日期的字符串传递给 Date 构造函数，也会在后台调用 Date.parse()**。换句话说，下面的代码与前面的例子是等价的：

```
var someDate = new Date("May 25, 2004");
```

> 这行代码将会得到与前面相同的日期对象。

日期对象及其在不同浏览器中的实现有许多奇怪的行为。其中有一种倾向是将超出范围的值替换成当前的值，以便生成输出。例如，在解析"January 32, 2007"时，有的浏览器会将其解释为"February 1, 2007"。而 Opera 则倾向于插入当前月份的当前日期，返回"January 当前日期，2007"。也就是说，如果在 2007 年 9 月21 日运行前面的代码，将会得到"January 21, 2007"（都是 21 日）。

**Date.UTC()方法同样也返回表示日期的毫秒数。Date.UTC()的参数分别是年份、基于 0 的月份（一月是 0，二月是 1，以此类推）、月中的哪一天（1 到 31）、小时数（0 到 23）、分钟、秒以及毫秒数**。在这些参数中，**只有前两个参数（年和月）是必需的**。如果没有提供月中的天数，则假设天数为 1；如果省略其他参数，则统统假设为 0。以下是两个使用 Date.UTC()方法的例子：

```
// GMT 时间 2000 年 1 月 1 日午夜零时
var y2k = new Date(Date.UTC(2000, 0));
// GMT 时间 2005 年 5 月 5 日下午 5:55:55
var allFives = new Date(Date.UTC(2005, 4, 5, 17, 55, 55));
```

如同模仿 Date.parse()一样，Date 构造函数也会模仿 Date.UTC()，但有一点明显不同：日期和时间都基于本地时区而非 GMT 来创建。不过，Date 构造函数接收的参数仍然与 Date.UTC() 相同。

因此，如果第一个参数是数值，Date 构造函数就会假设该值是日期中的年份，而第二个参数是月份，以此类推。据此，可以将前面的例子重写如下。

```
// 本地时间 2000 年 1 月 1 日午夜零时
var y2k = new Date(2000, 0);
// 本地时间 2005 年 5 月 5 日下午 5:55:55
var allFives = new Date(2005, 4, 5, 17, 55, 55);
```

**ECMAScript 5 添加了 Data.now()方法，返回表示调用这个方法时的日期和时间的毫秒数**。这个方法简化了使用 Data 对象分析代码的工作。例如：

```
//取得开始时间
var start = Date.now();
//调用函数
doSomething();
//取得停止时间
var stop = Date.now(),
 result = stop – start;
 ```

> 支持 Data.now() 方法的浏览器包括 IE9+、Firefox 3+、Safari 3+、Opera 10.5 和 Chrome。在不支持它的浏览器中，使用 + 操作符把 Data 对象转换成字符串，也可以达到同样的目的。

```
//取得开始时间
var start = +new Date();
//调用函数
doSomething();
//取得停止时间
var stop = +new Date(),
 result = stop - start; 
```

# 5.3.1 继承的方法

Date 类型也重写了 toLocaleString()、toString() 和 valueOf() 方法。

Date 类型的 **toLocaleString() 方法会按照与浏览器设置的地区相适应的格式返回日期和时间**。这大致意味着时间格式中会包含 AM 或 PM，但不会包含时区信息（当然，具体的格式会因浏览器而异）。

而 **toString() 方法则通常返回带有时区信息的日期和时间，其中时间一般以军用时间（即小时的范围是 0 到 23）表示**。下面给出了在不同浏览器中调用 toLocaleString() 和 toString()方法，输出 PST（Pacific Standard Time，太平洋标准时间）时间 2007年 2 月 1 日午夜零时的结果。

```
Internet Explorer 8
toLocaleString() — Thursday, February 01, 2007 12:00:00 AM
toString() — Thu Feb 1 00:00:00 PST 2007

Firefox 3.5
toLocaleString() — Thursday, February 01, 2007 12:00:00 AM
toString() — Thu Feb 01 2007 00:00:00 GMT-0800 (Pacific Standard Time)

Safari 4
toLocaleString() — Thursday, February 01, 2007 00:00:00
toString() — Thu Feb 01 2007 00:00:00 GMT-0800 (Pacific Standard Time)

Chrome 4
toLocaleString() — Thu Feb 01 2007 00:00:00 GMT-0800 (Pacific Standard Time)
toString() — Thu Feb 01 2007 00:00:00 GMT-0800 (Pacific Standard Time)

Opera 10
toLocaleString() — 2/1/2007 12:00:00 AM
toString() — Thu, 01 Feb 2007 00:00:00 GMT-0800
```

> 显然，这两个方法在不同的浏览器中返回的日期和时间格式可谓大相径庭。事实上，toLocaleString() 和 toString()的这一差别仅在调试代码时比较有用，而在显示日期和时间时没有什么价值。

至于 Date 类型的 **valueOf() 方法，则根本不返回字符串，而是返回日期的毫秒表示**。因此，可以方便使用比较操作符（小于或大于）来比较日期值。请看下面的例子。

```
var date1 = new Date(2007, 0, 1); //"January 1, 2007"
var date2 = new Date(2007, 1, 1); //"February 1, 2007"
alert(date1 < date2);             //true
alert(date1 > date2);             //false
```

从逻辑上讲，2007 年 1 月 1 日要早于 2007 年 2 月 1 日，此时如果我们说前者小于后者比较符合常理。而表示 2007 年 1 月 1 日的毫秒值小于表示 2007 年 2 月 1 日的毫秒值，因此在首先使用小于操作符比较日期时，返回的结果是 true。这样，就为我们比较日期提供了极大方便。

# 5.3.2 日期格式化方法

Date 类型还有一些专门用于将日期格式化为字符串的方法，这些方法如下。

1. toDateString()——以特定于实现的格式显示星期几、月、日和年；
2. toTimeString()——以特定于实现的格式显示时、分、秒和时区；
3. toLocaleDateString()——以特定于地区的格式显示星期几、月、日和年；
4. toLocaleTimeString()——以特定于实现的格式显示时、分、秒；
5. toUTCString()——以特定于实现的格式完整的 UTC 日期。

> 与 toLocaleString() 和 toString() 方法一样，以上这些字符串格式方法的输出也是因浏览器而异的，因此没有哪一个方法能够用来在用户界面中显示一致的日期信息。除了前面介绍的方法之外，还有一个名叫 toGMTString() 的方法，这是一个与 toUTCString() 等价的方法，其存在目的在于确保向后兼容。不过，ECMAScript **推荐现在编写的代码一律使用 toUTCString() 方法**。

# 5.3.3 日期/时间组件方法

到目前为止，剩下还未介绍的 Date 类型的方法（如下表所示），都是直接取得和设置日期值中特定部分的方法了。需要注意的是，UTC 日期指的是在没有时区偏差的情况下（将日期转换为 GMT 时间）的日期值。

| 方 法 | 说 明 |
| ----- | ----  |
| getTime() | 返回表示日期的毫秒数；与valueOf()方法返回的值相同 |
| setTime(毫秒) | 以毫秒数设置日期，会改变整个日期 |
| getFullYear() | 取得4位数的年份（如2007而非仅07） |
| getUTCFullYear() | 返回UTC日期的4位数年份 |
| setFullYear(年) | 设置日期的年份。传入的年份值必须是4位数字（如2007而非仅07） |
| setUTCFullYear(年) | 设置UTC日期的年份。传入的年份值必须是4位数字（如2007而非仅07） |
| getMonth() | 返回日期中的月份，其中0表示一月，11表示十二月 |
| getUTCMonth() | 返回UTC日期中的月份，其中0表示一月，11表示十二月 |
| setMonth(月) | 设置日期的月份。传入的月份值必须大于0，超过11则增加年份 |
| setUTCMonth(月) | 设置UTC日期的月份。传入的月份值必须大于0，超过11则增加年份 |
| getDate() | 返回日期月份中的天数（1到31） |
| getUTCDate() | 返回UTC日期月份中的天数（1到31） |
| setDate(日) | 设置日期月份中的天数。如果传入的值超过了该月中应有的天数，则增加月份 |
| setUTCDate(日) | 设置UTC日期月份中的天数。如果传入的值超过了该月中应有的天数，则增加月份 |
| getDay() | 返回日期中星期的星期几（其中0表示星期日，6表示星期六） |
| getUTCDay() | 返回UTC日期中星期的星期几（其中0表示星期日，6表示星期六） |
| getHours() | 返回日期中的小时数（0到23） |
| getUTCHours() | 返回UTC日期中的小时数（0到23） |
| setHours(时) | 设置日期中的小时数。传入的值超过了23则增加月份中的天数 |
| setUTCHours(时) | 设置UTC日期中的小时数。传入的值超过了23则增加月份中的天数 |
| getMinutes() | 返回日期中的分钟数（0到59） |
| getUTCMinutes() | 返回UTC日期中的分钟数（0到59） |
| setMinutes(分) | 设置日期中的分钟数。传入的值超过59则增加小时数 |
| setUTCMinutes(分) | 设置UTC日期中的分钟数。传入的值超过59则增加小时数 |
| getSeconds() | 返回日期中的秒数（0到59） |
| getUTCSeconds() | 返回UTC日期中的秒数（0到59） |
| setSeconds(秒) | 设置日期中的秒数。传入的值超过了59会增加分钟数 |
| setUTCSeconds(秒) | 设置UTC日期中的秒数。传入的值超过了59会增加分钟数 |
| getMilliseconds() | 返回日期中的毫秒数 |
| getUTCMilliseconds() | 返回UTC日期中的毫秒数 |
| setMilliseconds(毫秒) | 设置日期中的毫秒数 |
| setUTCMilliseconds(毫秒) | 设置UTC日期中的毫秒数 |
| getTimezoneOffset() | 返回本地时间与UTC时间相差的分钟数。例如，美国东部标准时间返回300。在某地进入夏令时的情况下，这个值会有所变化 |
