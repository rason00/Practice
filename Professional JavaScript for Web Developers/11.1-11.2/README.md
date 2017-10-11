# 11 DOM 扩展

对 DOM 的两个主要的扩展是 Selectors API（选择符 API）和 HTML5。这两个扩展都源自开发社区，而将某些常见做法及 API 标准化一直是众望所归。此外，还有一个不那么引人瞩目的 Element Traversal （元素遍历）规范，为 DOM 添加了一些属性。虽然前述两个主要规范（特别是 HTML5）已经涵盖了大量的 DOM 扩展，但专有扩展依然存在。本章也会介绍专有的 DOM 扩展。

# 内容涵盖

1. 选择符 API
    1. querySelector() 方法
    2. querySelectorAll() 方法
    3. matchesSelector() 方法
2. 元素遍历

# 11.1 选择符 API

众多 JavaScript 库中最常用的一项功能，就是根据 CSS 选择符选择与某个模式匹配的 DOM 元素。

实际上，jQuery（www.jquery.com）的核心就是通过 CSS 选择符查询 DOM 文档取得元素的引用，从而抛开了 getElementById() 和 getElementsByTagName()。

Selectors API（www.w3.org/TR/selectors-api/）是由 W3C 发起制定的一个标准，致力于让浏览器原生支持 CSS 查询。所有实现这一功能的 JavaScript 库都会写一个基础的 CSS 解析器，然后再使用已有的 DOM 方法查询文档并找到匹配的节点。尽管库开发人员在不知疲倦地改进这一过程的性能，但到头来都只能通过运行 JavaScript 代码来完成查询操作。而把这个功能变成原生 API 之后，解析和树查询操作可以在浏览器内部通过编译后的代码来完成，极大地改善了性能。

Selectors API Level 1 的核心是两个方法：querySelector() 和 querySelectorAll()。在兼容的浏览器中，可以通过 Document 及 Element 类型的实例调用它们。目前已完全支持 Selectors API Level 1 的浏览器有 IE 8+、Firefox 3.5+、Safari 3.1+、Chrome 和 Opera 10+。

## 11.1.1 querySelector() 方法

**querySelector() 方法接收一个 CSS 选择符，返回与该模式匹配的第一个元素，如果没有找到匹配的元素，返回 null**。请看下面的例子。

```
//取得 body 元素
var body = document.querySelector("body");

//取得 ID 为"myDiv"的元素
var myDiv = document.querySelector("#myDiv");

//取得类为"selected"的第一个元素
var selected = document.querySelector(".selected");

//取得类为"button"的第一个图像元素
var img = document.body.querySelector("img.button");
```

**通过 Document 类型调用 querySelector() 方法时，会在文档元素的范围内查找匹配的元素。而通过 Element 类型调用 querySelector() 方法时，只会在该元素后代元素的范围内查找匹配的元素**。

CSS 选择符可以简单也可以复杂，视情况而定。如果传入了不被支持的选择符，querySelector() 会抛出错误。

## 11.1.2 querySelectorAll() 方法

**querySelectorAll() 方法接收的参数与 querySelector() 方法一样，都是一个 CSS 选择符，但返回的是所有匹配的元素而不仅仅是一个元素。这个方法返回的是一个 NodeList 的实例**。

具体来说，返回的值实际上是带有所有属性和方法的 NodeList，而其底层实现则类似于一组元素的快照，而非不断对文档进行搜索的动态查询。这样实现可以避免使用 NodeList 对象通常会引起的大多数性能问题。

**只要传给 querySelectorAll() 方法的 CSS 选择符有效，该方法都会返回一个 NodeList 对象，而不管找到多少匹配的元素。如果没有找到匹配的元素，NodeList 就是空的**。

与 querySelector() 类似，能够调用 querySelectorAll() 方法的类型包括 Document、DocumentFragment 和 Element。下面是几个例子。

```
//取得某 <div> 中的所有 <em> 元素（类似于 getElementsByTagName("em")）
var ems = document.getElementById("myDiv").querySelectorAll("em");

//取得类为"selected"的所有元素
var selecteds = document.querySelectorAll(".selected");

//取得所有 <p> 元素中的所有 <strong> 元素
var strongs = document.querySelectorAll("p strong");
```

要取得返回的 NodeList 中的每一个元素，可以使用 item() 方法，也可以使用方括号语法，比如：

```
var i, len, strong;
for (i=0, len=strongs.length; i < len; i++){
 strong = strongs[i]; //或者 strongs.item(i)
 strong.className = "important";
}
```

同样与 querySelector() 类似，如果传入了浏览器不支持的选择符或者选择符中有语法错误，querySelectorAll() 会抛出错误。

## 11.1.3 matchesSelector() 方法

**Selectors API Level 2 规范为 Element 类型新增了一个方法 matchesSelector()。这个方法接收一个参数，即 CSS 选择符，如果调用元素与该选择符匹配，返回 true；否则，返回 false**。看例子。

```
if (document.body.matchesSelector("body.page1")){
 //true
}
```

在取得某个元素引用的情况下，使用这个方法能够方便地检测它是否会被 querySelector() 或 querySelectorAll() 方法返回。

截至 2011 年年中，还没有浏览器支持 matchesSelector() 方法；不过，也有一些实验性的实现。IE 9+通过 msMatchesSelector() 支持该方法，Firefox 3.6+ 通过 mozMatchesSelector() 支持该方法，Safari 5+ 和 Chrome 通过 webkitMatchesSelector() 支持该方法。因此，**如果你想使用这个方法，最好是编写一个包装函数**。

```
function matchesSelector(element, selector){
 if (element.matchesSelector){
 return element.matchesSelector(selector);
 } else if (element.msMatchesSelector){
 return element.msMatchesSelector(selector);
 } else if (element.mozMatchesSelector){
 return element.mozMatchesSelector(selector);
 } else if (element.webkitMatchesSelector){
 return element.webkitMatchesSelector(selector);
 } else {
 throw new Error("Not supported.");
 }
}
if (matchesSelector(document.body, "body.page1")){
 //执行操作
} 
```

# 11.2 元素遍历

对于元素间的空格，IE9 及之前版本不会返回文本节点，而其他所有浏览器都会返回文本节点。这样，就导致了在使用 childNodes 和 firstChild 等属性时的行为不一致。为了弥补这一差异，而同时又保持 DOM 规范不变，Element Traversal 规范（www.w3.org/TR/ElementTraversal/）新定义了一组属性。

Element Traversal API 为 DOM 元素添加了以下 5 个属性。

1. childElementCount：返回子元素（不包括文本节点和注释）的个数。
2. firstElementChild：指向第一个子元素；firstChild 的元素版。
3. lastElementChild：指向最后一个子元素；lastChild 的元素版。
4. previousElementSibling：指向前一个同辈元素；previousSibling 的元素版。
5. nextElementSibling：指向后一个同辈元素；nextSibling 的元素版。

支持的浏览器为 DOM 元素添加了这些属性，利用这些元素不必担心空白文本节点，从而可以更方便地查找 DOM 元素了。

下面来看一个例子。**过去**，要跨浏览器遍历某元素的所有子元素，需要像下面这样写代码。

```
var i,
 len,
 child = element.firstChild;
while(child != element.lastChild){
 if (child.nodeType == 1){ //检查是不是元素
 processChild(child);
 }
 child = child.nextSibling;
}
```

而使用 Element Traversal **新增的元素，代码会更简洁**。

```
var i,
 len,
 child = element.firstElementChild;
while(child != element.lastElementChild){
 processChild(child); //已知其是元素
 child = child.nextElementSibling;
}
```

支持 Element Traversal 规范的浏览器有 IE 9+、Firefox 3.5+、Safari 4+、Chrome 和 Opera 10+。
