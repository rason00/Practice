# 内容涵盖

1. 专有扩展
    1. 文档模式
    2. children 属性
    3. contains() 方法
    4. 插入文本
    5. 滚动
2. 第十一章 小结

# 11.4 专有扩展

虽然所有浏览器开发商都知晓坚持标准的重要性，但在发现某项功能缺失时，这些开发商都会一如既往地向 DOM 中添加专有扩展，以弥补功能上的不足。表面上看，这种各行其事的做法似乎不太好，但实际上专有扩展为 Web 开发领域提供了很多重要的功能，这些功能最终都在 HTML5 规范中得到了标准化。

即便如此，仍然还有大量专有的 DOM 扩展没有成为标准。但这并不是说它们将来不会被写进标准，而只是说在编写本书的时候，它们还是专有功能，而且只得到了少数浏览器的支持。

## 11.4.1 文档模式

IE8 引入了一个新的概念叫“文档模式”（document mode）。**页面的文档模式决定了可以使用什么功能。换句话说，文档模式决定了你可以使用哪个级别的 CSS，可以在 JavaScript 中使用哪些 API，以及如何对待文档类型（doctype）**。到了 IE9，总共有以下 4 种文档模式。

1. IE5：以混杂模式渲染页面（IE5 的默认模式就是混杂模式）。IE8 及更高版本中的新功能都无法使用。
2. IE7：以 IE7 标准模式渲染页面。IE8 及更高版本中的新功能都无法使用。
3. IE8：以 IE8 标准模式渲染页面。IE8 中的新功能都可以使用，因此可以使用 Selectors API、更多 CSS2 级选择符和某些 CSS3 功能，还有一些 HTML5 的功能。不过 IE9 中的新功能无法使用。
4. IE9：以 IE9 标准模式渲染页面。IE9 中的新功能都可以使用，比如 ECMAScript 5、完整的 CSS3 以及更多 HTML5 功能。这个文档模式是最高级的模式。

要理解 IE8 及更高版本的工作原理，必须理解文档模式。

要强制浏览器以某种模式渲染页面，可以使用 HTTP 头部信息 X-UA-Compatible，或通过等价的 `<meta>` 标签来设置：

```
<meta http-equiv="X-UA-Compatible" content="IE=IEVersion">
```

注意，这里 IE 的版本（IEVersion）有以下一些不同的值，而且这些值并不一定与上述 4 种文档模式对应。

1. Edge：始终以最新的文档模式来渲染页面。忽略文档类型声明。对于 IE8，始终保持以 IE8 标准模式渲染页面。对于 IE9，则以 IE9 标准模式渲染页面。
2. EmulateIE9：如果有文档类型声明，则以 IE9 标准模式渲染页面，否则将文档模式设置为 IE5。
3. EmulateIE8：如果有文档类型声明，则以 IE8 标准模式渲染页面，否则将文档模式设置为 IE5。
4. EmulateIE7：如果有文档类型声明，则以 IE7 标准模式渲染页面，否则将文档模式设置为 IE5。
5. 9：强制以 IE9 标准模式渲染页面，忽略文档类型声明。
6. 8：强制以 IE8 标准模式渲染页面，忽略文档类型声明。
7. 7：强制以 IE7 标准模式渲染页面，忽略文档类型声明。
8. 5：强制将文档模式设置为 IE5，忽略文档类型声明。

比如，要想让文档模式像在 IE7 中一样，可以使用下面这行代码：

```
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7">
```

如果不打算考虑文档类型声明，而直接使用 IE7 标准模式，那么可以使用下面这行代码：

```
<meta http-equiv="X-UA-Compatible" content="IE=7">
```

没有规定说必须在页面中设置 X-UA-Compatible。默认情况下，浏览器会通过文档类型声明来确定是使用最佳的可用文档模式，还是使用混杂模式。

通过 document.documentMode 属性可以知道给定页面使用的是什么文档模式。这个属性是 IE8 中新增的，它会返回使用的文档模式的版本号（在 IE9 中，可能返回的版本号为 5、7、8、9）：

```
var mode = document.documentMode;
```

知道页面采用的是什么文档模式，有助于理解页面的行为方式。无论在什么文档模式下，都可以访问这个属性。

## 11.4.2 children 属性

由于 IE9 之前的版本与其他浏览器在处理文本节点中的空白符时有差异，因此就出现了 children 属性。这个属性是 HTMLCollection 的实例，只包含元素中同样还是元素的子节点。除此之外，children 属性与 childNodes 没有什么区别，即在元素只包含元素子节点时，这两个属性的值相同。

下面是访问 children 属性的示例代码：

```
var childCount = element.children.length;
var firstChild = element.children[0];
```

支持 children 属性的浏览器有 IE5、Firefox 3.5、Safari 2（但有 bug）、Safari 3（完全支持）、Opera8 和 Chrome（所有版本）。IE8 及更早版本的 children 属性中也会包含注释节点，但 IE9 之后的版本则只返回元素节点。

## 11.4.3 contains() 方法

在实际开发中，经常**需要知道某个节点是不是另一个节点的后代。IE 为此率先引入了 contains() 方法**，以便不通过在 DOM 文档树中查找即可获得这个信息。**调用 contains() 方法的应该是祖先节点，也就是搜索开始的节点，这个方法接收一个参数，即要检测的后代节点。如果被检测的节点是后代节点，该方法返回 true；否则，返回 false**。以下是一个例子：

```
alert(document.documentElement.contains(document.body)); //true
```

> 这个例子测试了 `<body>` 元素是不是 `<html>` 元素的后代，在格式正确的 HTML 页面中，以上代码返回 true。

支持 contains()方法的浏览器有 IE、Firefox 9+、Safari、Opera 和 Chrome。

使用 DOM Level 3 compareDocumentPosition() 也能够确定节点间的关系。支持这个方法的浏览器有 IE9+、Firefox、Safari、Opera 9.5+和 Chrome。如前所述，这个方法用于确定两个节点间的关系，返回一个表示该关系的位掩码（ bitmask）。下表列出了这个位掩码的值。

| 掩码 | 节点关系 |
| ---- | ------- |
| 1 | 无关（给定的节点不在当前文档中） |
| 2 | 居前（给定的节点在DOM树中位于参考节点之前） |
| 4 | 居后（给定的节点在DOM树中位于参考节点之后） |
| 8 | 包含（给定的节点是参考节点的祖先） |
| 16 | 被包含（给定的节点是参考节点的后代） |

为模仿 contains() 方法，应该关注的是掩码 16。可以对 compareDocumentPosition() 的结果执行按位与，以确定参考节点（调用 compareDocumentPosition() 方法的当前节点）是否包含给定的节点（传入的节点）。来看下面的例子：

```
var result = document.documentElement.compareDocumentPosition(document.body);
alert(!!(result & 16));
```

> 执行上面的代码后，结果会变成 20（表示“居后”的 4 加上表示“被包含”的 16）。对掩码 16 执行按位操作会返回一个非零数值，而两个逻辑非操作符会将该数值转换成布尔值。

使用一些浏览器及能力检测，就可以写出如下所示的一个通用的 contains 函数：

```
function contains(refNode, otherNode){
 if (typeof refNode.contains == "function" &&
 (!client.engine.webkit || client.engine.webkit >= 522)){
 return refNode.contains(otherNode);
 } else if (typeof refNode.compareDocumentPosition == "function"){
 return !!(refNode.compareDocumentPosition(otherNode) & 16);
 } else {
 var node = otherNode.parentNode;
 do {
 if (node === refNode){
 return true;
 } else {
 node = node.parentNode;
 }
 } while (node !== null);
 return false;
 }
}
```

这个函数组合使用了三种方式来确定一个节点是不是另一个节点的后代。函数的第一个参数是参考节点，第二个参数是要检查的节点。在函数体内，首先检测 refNode 中是否存在 contains() 方法（能力检测）。这一部分代码还检查了当前浏览器所用的 WebKit 版本号。如果方法存在而且不是 WebKit（!client.engine.webkit），则继续执行代码。否则，如果浏览器是 WebKit 且至少是 Safari 3（WebKit 版本号为 522 或更高），那么也可以继续执行代码。在 WebKit 版本号小于 522 的 Safari 浏览器中，contains() 方法不能正常使用。

接下来检查是否存在 compareDocumentPosition() 方法，而函数的最后一步则是自 otherNode 开始向上遍历 DOM 结构，以递归方式取得 parentNode，并检查其是否与 refNode 相等。在文档树的顶端，parentNode 的值等于 null，于是循环结束。这是针对旧版本 Safari 设计的一个后备策略。

## 11.4.4 插入文本

前面介绍过，IE 原来专有的插入标记的属性 innerHTML 和 outerHTML 已经被 HTML5 纳入规范。

但另外两个插入文本的专有属性则没有这么好的运气。这两个没有被 HTML5 看中的属性是 innerText 和 outerText。

### 1. innerText 属性

**通过 innertText 属性可以操作元素中包含的所有文本内容，包括子文档树中的文本**。在通过 innerText 读取值时，它会按照由浅入深的顺序，将子文档树中的所有文本拼接起来。在通过 innerText 写入值时，结果会删除元素的所有子节点，插入包含相应文本值的文本节点。来看下面这个 HTML 代码示例。

```
<div id="content">
 <p>This is a <strong>paragraph</strong> with a list following it.</p>
 <ul>
 <li>Item 1</li>
 <li>Item 2</li>
 <li>Item 3</li>
 </ul>
</div>
```

对于这个例子中的 `<div>` 元素而言，其 innerText 属性会返回下列字符串：

```
This is a paragraph with a list following it.
Item 1
Item 2
Item 3
```

由于不同浏览器处理空白符的方式不同，因此输出的文本可能会也可能不会包含原始 HTML 代码中的缩进。

使用 innerText 属性设置这个 `<div>` 元素的内容，则只需一行代码：

```
div.innerText = "Hello world!";
```

执行这行代码后，页面的 HTML 代码就会变成如下所示。

```
<div id="content">Hello world!</div>
```

设置 innerText 属性移除了先前存在的所有子节点，完全改变了 DOM 子树。此外，设置 innerText 属性的同时，也对文本中存在的 HTML 语法字符（小于号、大于号、引号及和号）进行了编码。再看一个例子。

```
div.innerText = "Hello & welcome, <b>\"reader\"!</b>";
```

运行以上代码之后，会得到如下所示的结果。

```
<div id="content">Hello &amp; welcome, &lt;b&gt;&quot;reader&quot;!&lt;/b&gt;</div>
```

设置 innerText 永远只会生成当前节点的一个子文本节点，而为了确保只生成一个子文本节点，就必须要对文本进行 HTML 编码。利用这一点，可以通过 innerText 属性过滤掉 HTML 标签。方法是将 innerText 设置为等于 innerText，这样就可以去掉所有 HTML 标签，比如：

```
div.innerText = div.innerText;
```

> 执行这行代码后，就用原来的文本内容替换了容器元素中的所有内容（包括子节点，因而也就去掉了 HTML 标签）。

支持 innerText 属性的浏览器包括 IE4+、Safari 3+、Opera 8+和 Chrome。Firefox 虽然不支持 innerText，但支持作用类似的 textContent 属性。textContent 是 DOM Level 3 规定的一个属性，其他支持 textContent 属性的浏览器还有 IE9+、Safari 3+、Opera 10+和 Chrome。为了确保跨浏览器兼容，有必要编写一个类似于下面的函数来检测可以使用哪个属性。

```
function getInnerText(element){
 return (typeof element.textContent == "string") ?
 element.textContent : element.innerText;
}
function setInnerText(element, text){
 if (typeof element.textContent == "string"){
 element.textContent = text;
 } else {
 element.innerText = text;
 }
}
```

这两个函数都接收一个元素作为参数，然后检查这个元素是不是有 textContent 属性。如果有，那么 typeof element.textContent 应该是"string"；如果没有，那么这两个函数就会改为使用 innerText。可以像下面这样调用这两个函数。

```
setInnerText(div, "Hello world!");
alert(getInnerText(div)); //"Hello world!"
```

使用这两个函数可以确保在不同的浏览器中使用正确的属性。

实际上，innerText 与 textContent 返回的内容并不完全一样。比如，innerText 会忽略行内的样式和脚本，而 textContent 则会像返回其他文本一样返回行内的样式和脚本代码。避免跨浏览器兼容问题的最佳途径，就是从不包含行内样式或行内脚本的 DOM 子树副本或 DOM 片段中读取文本。

### 2. outerText 属性

除了作用范围扩大到了包含调用它的节点之外，outerText 与 innerText 基本上没有多大区别。

在读取文本值时，outerText 与 innerText 的结果完全一样。但在写模式下，outerText 就完全不同了：outerText 不只是替换调用它的元素的子节点，而是会替换整个元素（包括子节点）。比如：

```
div.outerText = "Hello world!";
```

这行代码实际上相当于如下两行代码：

```
var text = document.createTextNode("Hello world!");
div.parentNode.replaceChild(text, div);
```

本质上，新的文本节点会完全取代调用 outerText 的元素。此后，该元素就从文档中被删除，无法访问。

支持 outerText 属性的浏览器有 IE4+、Safari 3+、Opera 8+和 Chrome。由于这个属性会导致调用它的元素不存在，因此并不常用。我们也建议读者尽可能不要使用这个属性。

## 11.4.5 滚动

如前所述，HTML5 之前的规范并没有就与页面滚动相关的 API 做出任何规定。但 HTML5 在将 scrollIntoView() 纳入规范之后，仍然还有其他几个专有方法可以在不同的浏览器中使用。下面列出的几个方法都是对 HTMLElement 类型的扩展，因此在所有元素中都可以调用。

1. scrollIntoViewIfNeeded(alignCenter)：只在当前元素在视口中不可见的情况下，才滚动浏览器窗口或容器元素，最终让它可见。如果当前元素在视口中可见，这个方法什么也不做。如果将可选的 alignCenter 参数设置为 true，则表示尽量将元素显示在视口中部（垂直方向）。Safari 和 Chrome 实现了这个方法。
2. scrollByLines(lineCount)：将元素的内容滚动指定的行高，lineCount 值可以是正值，也可以是负值。Safari 和 Chrome 实现了这个方法。
3. scrollByPages(pageCount)：将元素的内容滚动指定的页面高度，具体高度由元素的高度决定。Safari 和 Chrome 实现了这个方法。

希望大家要注意的是，scrollIntoView()和 scrollIntoViewIfNeeded()的作用对象是元素的容器，而 scrollByLines()和 scrollByPages()影响的则是元素自身。下面还是来看几个示例吧。

```
//将页面主体滚动 5 行
document.body.scrollByLines(5);

//在当前元素不可见的时候，让它进入浏览器的视口
document.images[0].scrollIntoViewIfNeeded();

//将页面主体往回滚动 1 页
document.body.scrollByPages(-1);
```

由于 scrollIntoView() 是唯一一个所有浏览器都支持的方法，因此还是这个方法最常用。

## 11.5 小结

虽然 DOM 为与 XML 及 HTML 文档交互制定了一系列核心 API，但仍然有几个规范对标准的 DOM 进行了扩展。这些扩展中有很多原来是浏览器专有的，但后来成为了事实标准，于是其他浏览器也都提供了相同的实现。本章介绍的三个这方面的规范如下。

1. Selectors API，定义了两个方法，让开发人员能够基于 CSS 选择符从 DOM 中取得元素，这两个方法是 querySelector()和 querySelectorAll()。
2. Element Traversal，为 DOM 元素定义了额外的属性，让开发人员能够更方便地从一个元素跳到另一个元素。之所以会出现这个扩展，是因为浏览器处理 DOM 元素间空白符的方式不一样。
3. HTML5，为标准的 DOM 定义了很多扩展功能。其中包括在 innerHTML 属性这样的事实标准基础上提供的标准定义，以及为管理焦点、设置字符集、滚动页面而规定的扩展 API。

虽然目前 DOM 扩展的数量还不多，但随着 Web 技术的发展，相信一定还会涌现出更多扩展来。很多浏览器都在试验专有的扩展，而这些扩展一旦获得认可，就能成为“伪”标准，甚至会被收录到规范的更新版本中。
