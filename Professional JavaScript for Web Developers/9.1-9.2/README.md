# 9 客户端检测

**检测 Web 客户端的手段很多，而且各有利弊。但最重要的还是要知道，不到万不得已，就不要使用客户端检测。只要能找到更通用的方法，就应该优先采用更通用的方法。一言以蔽之，先设计最通用的方案，然后再使用特定于浏览器的技术增强该方案。**

# 内容涵盖

1. 能力检测
    1. 更可靠的能力检测
    2. 能力检测，不是浏览器检测
2. 怪癖检测

# 9.1 能力检测

**最常用也最为人们广泛接受的客户端检测形式是能力检测（又称特性检测）**。能力检测的目标不是
识别特定的浏览器，而是识别浏览器的能力。采用这种方式不必顾及特定的浏览器如何如何，只要确定浏览器支持特定的能力，就可以给出解决方案。能力检测的基本模式如下：

```
if (object.propertyInQuestion){
 //使用 object.propertyInQuestion
}
```

举例来说，IE5.0 之前的版本不支持 document.getElementById() 这个 DOM 方法。尽管可以使用非标准的 document.all 属性实现相同的目的，但 IE 的早期版本中确实不存在 document.getElementById()。于是，也就有了类似下面的能力检测代码：

```
function getElement(id){
 if (document.getElementById){
 return document.getElementById(id);
 } else if (document.all){
 return document.all[id];

 } else {
 throw new Error("No way to retrieve element!");
 }
}
```

> 这里的 getElement() 函数的用途是返回具有给定 ID 的元素。因为 document.getElementById() 是实现这一目的的标准方式，所以一开始就测试了这个方法。如果该函数存在（不是未定义），则使用该函数。否则，就要继续检测 document.all 是否存在，如果是，则使用它。如果上述两个特性都不存在（很有可能），则创建并抛出错误，表示这个函数无法使用。

要理解能力检测，首先必须理解两个重要的概念。

如前所述，**第一个概念就是先检测达成目的的最常用的特性**。对前面的例子来说，就是要先检测 document.getElementById()，后检测 document.all。先检测最常用的特性可以保证代码最优化，因为在多数情况下都可以避免测试多个条件。

**第二个重要的概念就是必须测试实际要用到的特性**。一个特性存在，不一定意味着另一个特性也存在。

来看一个例子：

```
function getWindowWidth(){
 if (document.all){ //假设是 IE
 return document.documentElement.clientWidth; //错误的用法！！！
 } else {
 return window.innerWidth;
 }
}
```

> 这是一个错误使用能力检测的例子。getWindowWidth() 函数首先检查 document.all 是否存在，如果是则返回 document.documentElement.clientWidth。第 8 章曾经讨论过，IE8 及之前版本确实不支持 window.innerWidth 属性。**但问题是 document.all 存在也不一定表示浏览器就是 IE。实际上，也可能是 Opera；Opera 支持 document.all，也支持 window.innerWidth**。

## 9.1.1 更可靠的能力检测

能力检测对于想知道某个特性是否会按照适当方式行事（而不仅仅是某个特性存在）非常有用。上一节中的例子利用类型转换来确定某个对象成员是否存在，但这样你还是不知道该成员是不是你想要的。来看下面的函数，它用来确定一个对象是否支持排序。

```
//不要这样做！这不是能力检测——只检测了是否存在相应的方法
function isSortable(object){
 return !!object.sort;
}
```

> 这个函数通过检测对象是否存在 sort() 方法，来确定对象是否支持排序。问题是，任何包含 sort 属性的对象也会返回 true。

```
var result = isSortable({ sort: true });
```

检测某个属性是否存在并不能确定对象是否支持排序。更好的方式是检测 sort 是不是一个函数。

```
//这样更好：检查 sort 是不是函数
function isSortable(object){
 return typeof object.sort == "function";
}
```

> 这里的 typeof 操作符用于确定 sort 的确是一个函数，因此可以调用它对数据进行排序。在可能的情况下，要尽量使用 typeof 进行能力检测。特别是，宿主对象没有义务让 typeof 返回合理的值。

最令人发指的事儿就发生在 IE 中。大多数浏览器在检测到 document.createElement() 存在时，都会返回 true。

```
 //在 IE8 及之前版本中不行
function hasCreateElement(){
 return typeof document.createElement == "function";
}
```

> 在 IE8 及之前版本中，这个函数返回 false，因为 typeof document.createElement 返回的是"object"，而不是"function"。

如前所述，DOM 对象是宿主对象，IE 及更早版本中的宿主对象是通过 COM 而非 JScript 实现的。因此，document.createElement() 函数确实是一个 COM 对象，所以 typeof 才会返回"object"。IE9 纠正了这个问题，对所有 DOM 方法都返回"function"。

关于 typeof 的行为不标准，IE 中还可以举出例子来。ActiveX 对象（只有 IE 支持）与其他对象的行为差异很大。例如，不使用 typeof 测试某个属性会导致错误，如下所示。

```
//在 IE 中会导致错误
var xhr = new ActiveXObject("Microsoft.XMLHttp");
if (xhr.open){ //这里会发生错误
 //执行操作
}
```

像这样直接把函数作为属性访问会导致 JavaScript 错误。使用 typeof 操作符会更靠谱一点，但 IE对 typeof xhr.open 会返回"unknown"。这就意味着，在浏览器环境下测试任何对象的某个特性是否存在，要使用下面这个函数。

```
// 作者：Peter Michaux
function isHostMethod(object, property) {
 var t = typeof object[property];
 return t=='function' ||
 (!!(t=='object' && object[property])) ||
 t=='unknown';
}

// 可以像下面这样使用这个函数：
result = isHostMethod(xhr, "open"); //true
result = isHostMethod(xhr, "foo"); //false
```

目前使用 isHostMethod() 方法还是比较可靠的，因为它考虑到了浏览器的怪异行为。不过也要注意，宿主对象没有义务保持目前的实现方式不变，也不一定会模仿已有宿主对象的行为。所以，这个函数——以及其他类似函数，都不能百分之百地保证永远可靠。作为开发人员，必须对自己要使用某个功能的风险作出理性的估计。

## 9.1.2 能力检测，不是浏览器检测

检测某个或某几个特性并不能够确定浏览器。下面给出的这段代码（或与之差不多的代码）可以在许多网站中看到，这种“浏览器检测”代码就是**错误地依赖能力检测的典型示例**。

```
//错误！还不够具体
var isFirefox = !!(navigator.vendor && navigator.vendorSub);

//错误！假设过头了
var isIE = !!(document.all && document.uniqueID);
```

> 这两行代码代表了对能力检测的典型误用。以前，确实可以通过检测 navigator.vendor 和 navigator.vendorSub 来确定 Firefox 浏览器。但是，Safari 也依葫芦画瓢地实现了相同的属性。于是，这段代码就会导致人们作出错误的判断。为检测 IE，代码测试了 document.all 和 document.uniqueID。这就相当于假设 IE 将来的版本中仍然会继续存在这两个属性，同时还假设其他浏览器都不会实现这两个属性。最后，这两个检测都使用了双逻辑非操作符来得到布尔值（比先存储后访问的效果更好）。

实际上，根据浏览器不同将能力组合起来是更可取的方式。如果你知道自己的应用程序需要使用某些特定的浏览器特性，那么最好是一次性检测所有相关特性，而不要分别检测。看下面的例子。

```
//确定浏览器是否支持 Netscape 风格的插件
var hasNSPlugins = !!(navigator.plugins && navigator.plugins.length);

//确定浏览器是否具有 DOM1 级规定的能力
var hasDOM1 = !!(document.getElementById && document.createElement &&
 document.getElementsByTagName);
```

> 以上例子展示了两个检测：一个检测浏览器是否支持 Netscapte 风格的插件；另一个检测浏览器是否具备 DOM1 级所规定的能力。得到的布尔值可以在以后继续使用，从而节省重新检测能力的时间。

在实际开发中，应该将能力检测作为确定下一步解决方案的依据，而不是用它来判断用户使用的是什么浏览器。

# 9.2 怪癖检测

与能力检测类似，**怪癖检测（quirks detection）的目标是识别浏览器的特殊行为**。但与能力检测确认浏览器支持什么能力不同，怪癖检测是想要知道浏览器存在什么缺陷（“怪癖”也就是 bug）。

这通常需要运行一小段代码，以确定某一特性不能正常工作。例如，IE8 及更早版本中存在一个 bug，即如果某个实例属性与[[Enumerable]]标记为 false 的某个原型属性同名，那么该实例属性将不会出现在 fon-in 循环当中。可以使用如下代码来检测这种“怪癖”。

```
var hasDontEnumQuirk = function(){
 var o = { toString : function(){} };
 for (var prop in o){

 if (prop == "toString"){
 return false;
 }
 }
 return true;
}();
```

> 以上代码通过一个匿名函数来测试该“怪癖”，函数中创建了一个带有 toString() 方法的对象。在正确的 ECMAScript 实现中，toString 应该在 for-in 循环中作为属性返回。

另一个经常需要检测的“怪癖”是 Safari 3 以前版本会枚举被隐藏的属性。可以用下面的函数来检测该“怪癖”。

```
var hasEnumShadowsQuirk = function(){
 var o = { toString : function(){} };
 var count = 0;
 for (var prop in o){
 if (prop == "toString"){
 count++;
 }
 }
 return (count > 1);
}();
```

> 如果浏览器存在这个 bug，那么使用 for-in 循环枚举带有自定义的 toString() 方法的对象，就会返回两个 toString 的实例。

一般来说，“怪癖”都是个别浏览器所独有的，而且通常被归为 bug。在相关浏览器的新版本中，这些问题可能会也可能不会被修复。由于检测“怪癖”涉及运行代码，因此我们建议仅检测那些对你有直接影响的“怪癖”，而且最好在脚本一开始就执行此类检测，以便尽早解决问题。
