# 内容涵盖

1. DOM 操作技术
    1. 动态脚本
    2. 动态样式
    3. 操作表格
    4. 使用 NodeList
2. 第十章 小结

# 10.2 DOM 操作技术

很多时候，DOM 操作都比较简明，因此用 JavaScript 生成那些通常原本是用 HTML 代码生成的内容并不麻烦。不过，也有一些时候，操作 DOM 并不像表面上看起来那么简单。由于浏览器中充斥着隐藏的陷阱和不兼容问题，用 JavaScript 代码处理 DOM 的某些部分要比处理其他部分更复杂一些。

## 10.2.1 动态脚本

使用 `<script>` 元素可以向页面中插入 JavaScript 代码，一种方式是通过其 src 特性包含外部文件，另一种方式就是用这个元素本身来包含代码。而这一节要讨论的动态脚本，指的是在页面加载时不存在，但将来的某一时刻通过修改 DOM 动态添加的脚本。跟操作 HTML 元素一样，**创建动态脚本也有两种方式：插入外部文件和直接插入 JavaScript 代码**。

动态加载的外部 JavaScript 文件能够立即运行，比如下面的 `<script>` 元素：

```
<script type="text/javascript" src="client.js"></script>
```

这个 `<script>` 元素包含了第 9 章的客户端检测脚本。而创建这个节点的 DOM 代码如下所示：

```
var script = document.createElement("script");
script.type = "text/javascript";
script.src = "client.js";
document.body.appendChild(script);
```

显然，这里的 DOM 代码如实反映了相应的 HTML 代码。不过，在执行最后一行代码把 `<script>` 元素添加到页面中之前，是不会下载外部文件的。也可以把这个元素添加到 `<head>` 元素中，效果相同。

整个过程可以使用下面的函数来封装：

```
function loadScript(url){
 var script = document.createElement("script");
 script.type = "text/javascript";
 script.src = url;
 document.body.appendChild(script);
}
```

然后，就可以通过调用这个函数来加载外部的 JavaScript 文件了：

```
loadScript("client.js");
```

加载完成后，就可以在页面中的其他地方使用这个脚本了。问题只有一个：怎么知道脚本加载完成呢？遗憾的是，并没有什么标准方式来探知这一点。不过，与此相关的一些事件倒是可以派上用场，但要取决于所用的浏览器，详细讨论请见第 13 章。

另一种指定 JavaScript 代码的方式是行内方式，如下面的例子所示：

```
<script type="text/javascript">
 function sayHi(){
 alert("hi");
 }
</script>
```

从逻辑上讲，下面的 DOM 代码是有效的：

```
var script = document.createElement("script");
script.type = "text/javascript";
script.appendChild(document.createTextNode("function sayHi(){alert('hi');}"));
document.body.appendChild(script);
```

在 Firefox、Safari、Chrome 和 Opera 中，这些 DOM 代码可以正常运行。但在 IE 中，则会导致错误。

IE 将 `<script>` 视为一个特殊的元素，不允许 DOM 访问其子节点。不过，可以使用 `<script>` 元素的text 属性来指定 JavaScript 代码，像下面的例子这样：

```
var script = document.createElement("script");
script.type = "text/javascript";
script.text = "function sayHi(){alert('hi');}";
document.body.appendChild(script);
```

经过这样修改之后的代码可以在 IE、Firefox、Opera 和 Safari 3 及之后版本中运行。Safari 3.0 之前的版本虽然不能正确地支持 text 属性，但却允许使用文本节点技术来指定代码。如果需要兼容早期版本的 Safari，可以使用下列代码：

```
var script = document.createElement("script");
script.type = "text/javascript";
var code = "function sayHi(){alert('hi');}";
try {
 script.appendChild(document.createTextNode("code"));
} catch (ex){
 script.text = "code";
}
document.body.appendChild(script);
```

这里，首先尝试标准的 DOM 文本节点方法，因为除了 IE（在 IE 中会导致抛出错误），所有浏览器都支持这种方式。如果这行代码抛出了错误，那么说明是 IE，于是就必须使用 text 属性了。整个过程可以用以下函数来表示：

```
function loadScriptString(code){
 var script = document.createElement("script");
 script.type = "text/javascript";
 try {
 script.appendChild(document.createTextNode(code));
 } catch (ex){
 script.text = code;
 }
 document.body.appendChild(script);
}
```

下面是调用这个函数的示例：

```
loadScriptString("function sayHi(){alert('hi');}");
```

以这种方式加载的代码会在全局作用域中执行，而且当脚本执行后将立即可用。实际上，这样执行代码与在全局作用域中把相同的字符串传递给 eval()是一样的。

## 10.2.2 动态样式

能够把 CSS 样式包含到 HTML 页面中的元素有两个。其中， `<link>` 元素用于包含来自外部的文件，而 `<style>` 元素用于指定嵌入的样式。与动态脚本类似，**所谓动态样式是指在页面刚加载时不存在的样式；动态样式是在页面加载完成后动态添加到页面中的**。

我们以下面这个典型的 `<link>` 元素为例：

```
<link rel="stylesheet" type="text/css" href="styles.css">
```

使用 DOM 代码可以很容易地动态创建出这个元素：

```
var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "style.css";
var head = document.getElementsByTagName("head")[0];
head.appendChild(link);
```

以上代码在所有主流浏览器中都可以正常运行。需要注意的是，必须将 `<link>` 元素添加到 `<head>` 而不是 `<body>` 元素，才能保证在所有浏览器中的行为一致。整个过程可以用以下函数来表示：

```
function loadStyles(url){
 var link = document.createElement("link");
 link.rel = "stylesheet";
 link.type = "text/css";
 link.href = url;
 var head = document.getElementsByTagName("head")[0];
 head.appendChild(link);
}
```

调用 loadStyles()函数的代码如下所示：

```
loadStyles("styles.css");
```

加载外部样式文件的过程是异步的，也就是加载样式与执行 JavaScript 代码的过程没有固定的次序。一般来说，知不知道样式已经加载完成并不重要；不过，也存在几种利用事件来检测这个过程是否完成的技术，这些技术将在第 13 章讨论。

另一种定义样式的方式是使用 `<style>` 元素来包含嵌入式 CSS，如下所示：

```
<style type="text/css">
body {
 background-color: red;
}
</style>
```

按照相同的逻辑，下列 DOM 代码应该是有效的：

```
var style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode("body{background-color:red}"));
var head = document.getElementsByTagName("head")[0];
head.appendChild(style);
```

以上代码可以在 Firefox、Safari、Chrome 和 Opera 中运行，在 IE 中则会报错。IE 将 `<style>` 视为一个特殊的、与 `<script>` 类似的节点，不允许访问其子节点。事实上，IE 此时抛出的错误与向 `<script>` 元素添加子节点时抛出的错误相同。解决 IE 中这个问题的办法，就是访问元素的 styleSheet 属性，该属性又有一个 cssText 属性，可以接受 CSS 代码（第 13 章将进一步讨论这两个属性），如下面的例子所示。

```
var style = document.createElement("style");
style.type = "text/css";
try{
 style.appendChild(document.createTextNode("body{background-color:red}"));
} catch (ex){
 style.styleSheet.cssText = "body{background-color:red}";
}
var head = document.getElementsByTagName("head")[0];
head.appendChild(style);
```

与动态添加嵌入式脚本类似，重写后的代码使用了 try-catch 语句来捕获 IE 抛出的错误，然后再使用针对 IE 的特殊方式来设置样式。因此，通用的解决方案如下。

```
function loadStyleString(css){
 var style = document.createElement("style");
 style.type = "text/css";
 try{
 style.appendChild(document.createTextNode(css));
 } catch (ex){
 style.styleSheet.cssText = css;
 }
 var head = document.getElementsByTagName("head")[0];
 head.appendChild(style);
}
```

调用这个函数的示例如下：

```
loadStyleString("body{background-color:red}");
```

这种方式会实时地向页面中添加样式，因此能够马上看到变化。如果专门针对 IE 编写代码，务必小心使用 styleSheet.cssText 属性。在重用
同一个 `<style>` 元素并再次设置这个属性时，有可能会导致浏览器崩溃。同样，将 cssText 属性设置为空字符串也可能导致浏览器崩溃。我们希望 IE 中的这个 bug 能够在将来被修复。

## 10.2.3 操作表格

`<table>` 元素是 HTML 中最复杂的结构之一。要想创建表格，一般都必须涉及表示表格行、单元格、表头等方面的标签。由于涉及的标签多，因而使用核心 DOM 方法创建和修改表格往往都免不了要编写大量的代码。假设我们要使用 DOM 来创建下面的 HTML 表格。

```
<table border="1" width="100%">
 <tbody>
 <tr>
 <td>Cell 1,1</td>
 <td>Cell 2,1</td>
 </tr>
 <tr>
 <td>Cell 1,2</td>
 <td>Cell 2,2</td>
 </tr>
 </tbody>
</table>
```

要使用核心 DOM 方法创建这些元素，得需要像下面这么多的代码：

```
//创建 table
var table = document.createElement("table");
table.border = 1;
table.width = "100%";

//创建 tbody
var tbody = document.createElement("tbody");
table.appendChild(tbody);

//创建第一行
var row1 = document.createElement("tr");
tbody.appendChild(row1);
var cell1_1 = document.createElement("td");
cell1_1.appendChild(document.createTextNode("Cell 1,1"));
row1.appendChild(cell1_1);
var cell2_1 = document.createElement("td");
cell2_1.appendChild(document.createTextNode("Cell 2,1"));
row1.appendChild(cell2_1);

//创建第二行
var row2 = document.createElement("tr");
tbody.appendChild(row2);
var cell1_2 = document.createElement("td");
cell1_2.appendChild(document.createTextNode("Cell 1,2"));
row2.appendChild(cell1_2);
var cell2_2= document.createElement("td");
cell2_2.appendChild(document.createTextNode("Cell 2,2"));
row2.appendChild(cell2_2);

//将表格添加到文档主体中
document.body.appendChild(table);
```

显然，DOM 代码很长，还有点不太好懂。为了方便构建表格，HTML DOM 还为 `<table>` 、 `<tbody>` 和 `<tr>` 元素添加了一些属性和方法。

为 `<table>` 元素添加的属性和方法如下。

1. caption：保存着对 `<caption>` 元素（如果有）的指针。
2. tBodies：是一个 `<tbody>` 元素的 HTMLCollection。
3. tFoot：保存着对 `<tfoot>` 元素（如果有）的指针。
4. tHead：保存着对 `<thead>` 元素（如果有）的指针。
5. rows：是一个表格中所有行的 HTMLCollection。
6. createTHead()：创建 `<thead>` 元素，将其放到表格中，返回引用。
7. createTFoot()：创建 `<tfoot>` 元素，将其放到表格中，返回引用。
8. createCaption()：创建 `<caption>` 元素，将其放到表格中，返回引用。
9. deleteTHead()：删除 `<thead>` 元素。
10. deleteTFoot()：删除 `<tfoot>` 元素。
11. deleteCaption()：删除 `<caption>` 元素。
12. deleteRow(pos)：删除指定位置的行。
13. insertRow(pos)：向 rows 集合中的指定位置插入一行。

为 `<tbody>` 元素添加的属性和方法如下。

1. rows：保存着 `<tbody>` 元素中行的 HTMLCollection。
2. deleteRow(pos)：删除指定位置的行。
3. insertRow(pos)：向 rows 集合中的指定位置插入一行，返回对新插入行的引用。

为 `<tr>` 元素添加的属性和方法如下。

1. cells：保存着 `<tr>` 元素中单元格的 HTMLCollection。
2. deleteCell(pos)：删除指定位置的单元格。
3. insertCell(pos)：向 cells 集合中的指定位置插入一个单元格，返回对新插入单元格的引用。

使用这些属性和方法，可以极大地减少创建表格所需的代码数量。例如，使用这些属性和方法可以将前面的代码重写如下（加阴影的部分是重写后的代码）。

```
//创建 table
var table = document.createElement("table");
table.border = 1;
table.width = "100%";

//创建 tbody
var tbody = document.createElement("tbody");
table.appendChild(tbody);

//创建第一行
tbody.insertRow(0);
tbody.rows[0].insertCell(0);
tbody.rows[0].cells[0].appendChild(document.createTextNode("Cell 1,1"));
tbody.rows[0].insertCell(1);
tbody.rows[0].cells[1].appendChild(document.createTextNode("Cell 2,1"));

//创建第二行
tbody.insertRow(1);
tbody.rows[1].insertCell(0);
tbody.rows[1].cells[0].appendChild(document.createTextNode("Cell 1,2"));
tbody.rows[1].insertCell(1);
tbody.rows[1].cells[1].appendChild(document.createTextNode("Cell 2,2"));

//将表格添加到文档主体中
document.body.appendChild(table);
```

在这次的代码中，创建 `<table>` 和 `<tbody>` 的代码没有变化。不同的是创建两行的部分，其中使用了 HTML DOM 定义的表格属性和方法。在创建第一行时，通过 `<tbody>` 元素调用了 insertRow() 方法，传入了参数 0——表示应该将插入的行放在什么位置上。执行这一行代码后，就会自动创建一行并将其插入到 `<tbody>` 元素的位置 0 上，因此就可以马上通过 tbody.rows[0]来引用新插入的行。

创建单元格的方式也十分相似，即通过 `<tr>` 元素调用 insertCell() 方法并传入放置单元格的位置。然后，就可以通过 tbody.rows[0].cells[0] 来引用新插入的单元格，因为新创建的单元格被插入到了这一行的位置 0 上。

总之，使用这些属性和方法创建表格的逻辑性更强，也更容易看懂，尽管技术上这两套代码都是正确的。

## 10.2.4 使用 NodeList

**理解 NodeList 及其“近亲” NamedNodeMap 和 HTMLCollection，是从整体上透彻理解 DOM 的关键所在。这三个集合都是“动态的”；换句话说，每当文档结构发生变化时，它们都会得到更新。因此，它们始终都会保存着最新、最准确的信息。从本质上说，所有 NodeList 对象都是在访问 DOM 文档时实时运行的查询**。例如，下列代码会导致无限循环：

```
var divs = document.getElementsByTagName("div"),
 i,
 div;
for (i=0; i < divs.length; i++){
 div = document.createElement("div");
 document.body.appendChild(div);
}
```

第一行代码会取得文档中所有 `<div>` 元素的 HTMLCollection。由于这个集合是“动态的”，因此只要有新 `<div>` 元素被添加到页面中，这个元素也会被添加到该集合中。浏览器不会将创建的所有集合都保存在一个列表中，而是在下一次访问集合时再更新集合。结果，在遇到上例中所示的循环代码时，就会导致一个有趣的问题。每次循环都要对条件 i < divs.length 求值，意味着会运行取得所有 `<div>` 元素的查询。考虑到循环体每次都会创建一个新 `<div>` 元素并将其添加到文档中，因此 divs.length 的值在每次循环后都会递增。既然 i 和 divs.length 每次都会同时递增，结果它们的值永远也不会相等。

如果想要迭代一个 NodeList，最好是使用 length 属性初始化第二个变量，然后将迭代器与该变量进行比较，如下面的例子所示：

```
var divs = document.getElementsByTagName("div"),
 i,
 len,
 div;
for (i=0, len=divs.length; i < len; i++){
 div = document.createElement("div");
 document.body.appendChild(div);
}
```

这个例子中初始化了第二个变量 len。由于 len 中保存着对 divs.length 在循环开始时的一个快照，因此就会避免上一个例子中出现的无限循环问题。在本章演示迭代 NodeList 对象的例子中，使用的都是这种更为保险的方式。

一般来说，应该尽量减少访问 NodeList 的次数。因为每次访问 NodeList，都会运行一次基于文档的查询。所以，可以考虑将从 NodeList 中取得的值缓存起来。

# 10.3 小结

DOM 是语言中立的 API，用于访问和操作 HTML 和 XML 文档。DOM1 级将 HTML 和 XML 文档形象地看作一个层次化的节点树，可以使用 JavaScript 来操作这个节点树，进而改变底层文档的外观和结构。

DOM 由各种节点构成，简要总结如下。

1. 最基本的节点类型是 Node，用于抽象地表示文档中一个独立的部分；所有其他类型都继承自 Node。
2. Document 类型表示整个文档，是一组分层节点的根节点。在 JavaScript 中，document 对象是 Document 的一个实例。使用 document 对象，有很多种方式可以查询和取得节点。
3. Element 节点表示文档中的所有 HTML 或 XML 元素，可以用来操作这些元素的内容和特性。
4. 另外还有一些节点类型，分别表示文本内容、注释、文档类型、CDATA 区域和文档片段。

访问 DOM 的操作在多数情况下都很直观，不过在处理 `<script>` 和 `<style>` 元素时还是存在一些复杂性。由于这两个元素分别包含脚本和样式信息，因此浏览器通常会将它们与其他元素区别对待。这些区别导致了在针对这些元素使用 innerHTML 时，以及在创建新元素时的一些问题。

理解 DOM 的关键，就是理解 DOM 对性能的影响。DOM 操作往往是 JavaScript 程序中开销最大的部分，而因访问 NodeList 导致的问题为最多。NodeList 对象都是“动态的”，这就意味着每次访问 NodeList 对象，都会运行一次查询。有鉴于此，最好的办法就是尽量减少 DOM 操作。
