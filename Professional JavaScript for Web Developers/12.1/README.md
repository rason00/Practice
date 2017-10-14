# 12 DOM2 和 DOM3 

DOM1 级主要定义的是 HTML 和 XML 文档的底层结构。DOM2 和 DOM3 级则在这个结构的基础上引入了更多的交互能力，也支持了更高级的 XML 特性。为此，DOM2 和 DOM3 级分为许多模块（模块之间具有某种关联），分别描述了 DOM 的某个非常具体的子集。这些模块如下。

1. DOM2 级核心（DOM Level 2 Core）：在 1 级核心基础上构建，为节点添加了更多方法和属性。
2. DOM2 级视图（DOM Level 2 Views）：为文档定义了基于样式信息的不同视图。
3. DOM2 级事件（DOM Level 2 Events）：说明了如何使用事件与 DOM 文档交互。
4. DOM2 级样式（DOM Level 2 Style）：定义了如何以编程方式来访问和改变 CSS 样式信息。
5. DOM2 级遍历和范围（DOM Level 2 Traversal and Range）：引入了遍历 DOM 文档和选择其特定部分的新接口。
6. DOM2 级 HTML（DOM Level 2 HTML）：在 1 级 HTML 基础上构建，添加了更多属性、方法和新接口。

本章探讨除“DOM2 级事件”之外的所有模块，“DOM2 级事件”模块将在第 13 章进行全面讲解。DOM3 级又增加了“XPath”模块和“加载与保存”（Load and Save）模块。这些模块将在第 18 章讨论。

# 内容涵盖

1. DOM 变化
    1. 针对 XML 命名空间的变化
    2. 其他方面的变化

# 12.1 DOM 变化

DOM2 级和 3 级的目的在于扩展 DOM API，以满足操作 XML 的所有需求，同时提供更好的错误处理及特性检测能力。从某种意义上讲，实现这一目的很大程度意味着对命名空间的支持。“DOM2 级核心”没有引入新类型，它只是在 DOM1 级的基础上通过增加新方法和新属性来增强了既有类型。“DOM3 级核心”同样增强了既有类型，但也引入了一些新类型。

类似地，“DOM2 级视图”和“DOM2 级 HTML”模块也增强了 DOM 接口，提供了新的属性和方法。由于这两个模块很小，因此我们将把它们与“DOM2 级核心”放在一起，讨论基本 JavaScript 对象的变化。可以通过下列代码来确定浏览器是否支持这些 DOM 模块。

```
var supportsDOM2Core = document.implementation.hasFeature("Core", "2.0");
var supportsDOM3Core = document.implementation.hasFeature("Core", "3.0");
var supportsDOM2HTML = document.implementation.hasFeature("HTML", "2.0");
var supportsDOM2Views = document.implementation.hasFeature("Views", "2.0");
var supportsDOM2XML = document.implementation.hasFeature("XML", "2.0");
```

本章只讨论那些已经有浏览器实现的部分，任何浏览器都没有实现的部分将不作讨论。

## 12.1.1 针对 XML 命名空间的变化

有了 XML 命名空间，不同 XML 文档的元素就可以混合在一起，共同构成格式良好的文档，而不必担心发生命名冲突。从技术上说，HTML 不支持 XML 命名空间，但 XHTML 支持 XML 命名空间。

因此，本节给出的都是 XHTML 的示例。命名空间要使用 xmlns 特性来指定。XHTML 的命名空间是 http://www.w3.org/1999/xhtml，在任何格式良好 XHTML 页面中，都应该将其包含在 `<html>` 元素中，如下面的例子所示。

```
<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
 <title>Example XHTML page</title>
 </head>
 <body>
 Hello world!
 </body>
</html>
```

对这个例子而言，其中的所有元素默认都被视为 XHTML 命名空间中的元素。要想明确地为 XML 命名空间创建前缀，可以使用 xmlns 后跟冒号，再后跟前缀，如下所示。

```
<xhtml:html xmlns:xhtml="http://www.w3.org/1999/xhtml">
 <xhtml:head>
 <xhtml:title>Example XHTML page</xhtml:title>
 </xhtml:head>
 <xhtml:body>
 Hello world!
 </xhtml:body>
</xhtml:html>
```

这里为 XHTML 的命名空间定义了一个名为 xhtml 的前缀，并要求所有 XHTML 元素都以该前缀开头。有时候为了避免不同语言间的冲突，也需要使用命名空间来限定特性，如下面的例子所示。

```
<xhtml:html xmlns:xhtml="http://www.w3.org/1999/xhtml">
 <xhtml:head>
 <xhtml:title>Example XHTML page</xhtml:title>
 </xhtml:head>
 <xhtml:body xhtml:class="home">
 Hello world!
 </xhtml:body>
</xhtml:html>
```

这个例子中的特性 class 带有一个 xhtml 前缀。在只基于一种语言编写 XML 文档的情况下，命名空间实际上也没有什么用。不过，在混合使用两种语言的情况下，命名空间的用处就非常大了。来看一看下面这个混合了 XHTML 和 SVG 语言的文档：

```
<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
 <title>Example XHTML page</title>
 </head>
 <body>
 <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
 viewBox="0 0 100 100" style="width:100%; height:100%">
 <rect x="0" y="0" width="100" height="100" style="fill:red"/>
 </svg>
 </body>
</html>
```

在这个例子中，通过设置命名空间，将 `<svg>` 标识为了与包含文档无关的元素。此时，`<svg>` 元素的所有子元素，以及这些元素的所有特性，都被认为属于 http://www.w3.org/2000/svg 命名空间。即使这个文档从技术上说是一个 XHTML文档，但因为有了命名空间，其中的 SVG代码也仍然是有效的。

对于类似这样的文档来说，最有意思的事发生在调用方法操作文档节点的情况下。例如，在创建一个元素时，这个元素属于哪个命名空间呢？在查询一个特殊标签名时，应该将结果包含在哪个命名空间中呢？“DOM2 级核心”通过为大多数 DOM1 级方法提供特定于命名空间的版本解决了这个问题。

### 1. Node 类型的变化

在 DOM2 级中，Node 类型包含下列特定于命名空间的属性。

1. localName：不带命名空间前缀的节点名称。
2. namespaceURI：命名空间 URI 或者（在未指定的情况下是）null。
3. prefix：命名空间前缀或者（在未指定的情况下是）null。

当节点使用了命名空间前缀时，其 nodeName 等于 prefix+":"+ localName。以下面的文档为例：

```
<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
 <title>Example XHTML page</title>
 </head>
 <body>
 <s:svg xmlns:s="http://www.w3.org/2000/svg" version="1.1"
 viewBox="0 0 100 100" style="width:100%; height:100%">
 <s:rect x="0" y="0" width="100" height="100" style="fill:red"/>
 </s:svg>
 </body>
</html>
```

对于 `<html>` 元素来说，它的 localName 和 tagName 是"html"，namespaceURI 是"http://www.w3.org/1999/xhtml"，而 prefix 是 null。对于 `<s:svg>` 元素而言，它的 localName 是"svg"，tagName 是"s:svg"，namespaceURI 是"http://www.w3.org/2000/svg"，而 prefix 是"s"。

DOM3 级在此基础上更进一步，又引入了下列与命名空间有关的方法。

1. isDefaultNamespace(namespaceURI)：在指定的 namespaceURI 是当前节点的默认命名空间的情况下返回 true。
2. lookupNamespaceURI(prefix)：返回给定 prefix 的命名空间。
3. lookupPrefix(namespaceURI)：返回给定 namespaceURI 的前缀。

针对前面的例子，可以执行下列代码：

```
alert(document.body.isDefaultNamespace("http://www.w3.org/1999/xhtml"); //true

//假设 svg 中包含着对<s:svg>的引用
alert(svg.lookupPrefix("http://www.w3.org/2000/svg")); //"s"
alert(svg.lookupNamespaceURI("s")); //"http://www.w3.org/2000/svg"
```

在取得了一个节点，但不知道该节点与文档其他元素之间关系的情况下，这些方法是很有用的。

### 2. Document 类型的变化

DOM2 级中的 Document 类型也发生了变化，包含了下列与命名空间有关的方法。

1. createElementNS(namespaceURI, tagName)：使用给定的 tagName 创建一个属于命名空间 namespaceURI 的新元素。
2. createAttributeNS(namespaceURI, attributeName)：使用给定的 attributeName 创建一个属于命名空间 namespaceURI 的新特性。
3. getElementsByTagNameNS(namespaceURI, tagName)：返回属于命名空间 namespaceURI的 tagName 元素的 NodeList。

使用这些方法时需要传入表示命名空间的 URI（而不是命名空间前缀），如下面的例子所示。

```
//创建一个新的 SVG 元素
var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");

//创建一个属于某个命名空间的新特性
var att = document.createAttributeNS("http://www.somewhere.com", "random");

//取得所有 XHTML 元素
var elems = document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "*");
```

只有在文档中存在两个或多个命名空间时，这些与命名空间有关的方法才是必需的。

### 3. Element 类型的变化

“DOM2 级核心”中有关 Element 的变化，主要涉及操作特性。新增的方法如下。

1. getAttributeNS(namespaceURI,localName)：取得属于命名空间 namespaceURI 且名为 localName 的特性。
2. getAttributeNodeNS(namespaceURI,localName)：取得属于命名空间 namespaceURI 且名为 localName 的特性节点。
3. getElementsByTagNameNS(namespaceURI, tagName)：返回属于命名空间 namespaceURI 的 tagName 元素的 NodeList。
4. hasAttributeNS(namespaceURI,localName)：确定当前元素是否有一个名为 localName的特性，而且该特性的命名空间是 namespaceURI。注意，“DOM2 级核心”也增加了一个 hasAttribute() 方法，用于不考虑命名空间的情况。
5. removeAttriubteNS(namespaceURI,localName)：删除属于命名空间 namespaceURI 且名为 localName 的特性。
6. setAttributeNS(namespaceURI,qualifiedName,value)：设置属于命名空间 namespaceURI 且名为 qualifiedName 的特性的值为 value。
7. setAttributeNodeNS(attNode)：设置属于命名空间 namespaceURI 的特性节点。

除了第一个参数之外，这些方法与 DOM1 级中相关方法的作用相同；第一个参数始终都是一个命名空间 URI。

### 4. NamedNodeMap 类型的变化

NamedNodeMap 类型也新增了下列与命名空间有关的方法。由于特性是通过 NamedNodeMap 表示的，因此这些方法多数情况下只针对特性使用。

1. getNamedItemNS(namespaceURI,localName)：取得属于命名空间 namespaceURI 且名为 localName 的项。
2. removeNamedItemNS(namespaceURI,localName)：移除属于命名空间 namespaceURI 且名为 localName 的项。
3. setNamedItemNS(node)：添加 node，这个节点已经事先指定了命名空间信息。

由于一般都是通过元素访问特性，所以这些方法很少使用。

## 12.1.2 其他方面的变化

DOM 的其他部分在“DOM2 级核心”中也发生了一些变化。这些变化与 XML 命名空间无关，而是更倾向于确保 API 的可靠性及完整性。

### 1. DocumentType 类型的变化

DocumentType 类型新增了 3 个属性：publicId、systemId 和 internalSubset。其中，前两个属性表示的是文档类型声明中的两个信息段，这两个信息段在 DOM1 级中是没有办法访问到的。以下面的 HTML 文档类型声明为例。

```
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
 "http://www.w3.org/TR/html4/strict.dtd">
```

对这个文档类型声明而言，publicId是"-//W3C//DTD HTML 4.01//EN"，而systemId是"http://www.w3.org/TR/html4/strict.dtd"。在支持 DOM2 级的浏览器中，应该可以运行下列代码。

```
alert(document.doctype.publicId);
alert(document.doctype.systemId);
```

实际上，很少需要在网页中访问此类信息。

最后一个属性 internalSubset，用于访问包含在文档类型声明中的额外定义，以下面的代码为例。

```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
[<!ELEMENT name (#PCDATA)>] >
```

访问 document.doctype.internalSubset 将得到"`<!ELEMENT name (#PCDATA)>`"。这种内部子集（internal subset）在 HTML 中极少用到，在 XML 中可能会更常见一些。

### 2. Document 类型的变化

Document 类型的变化中唯一与命名空间无关的方法是 importNode()。这个方法的用途是从一个文档中取得一个节点，然后将其导入到另一个文档，使其成为这个文档结构的一部分。需要注意的是，每个节点都有一个 ownerDocument 属性，表示所属的文档。如果调用 appendChild()时传入的节点属于不同的文档（ownerDocument 属性的值不一样），则会导致错误。但在调用 importNode()时传入不同文档的节点则会返回一个新节点，这个新节点的所有权归当前文档所有。

说起来，importNode()方法与 Element 的 cloneNode()方法非常相似，它接受两个参数：要复制的节点和一个表示是否复制子节点的布尔值。返回的结果是原来节点的副本，但能够在当前文档中使用。来看下面的例子：

```
var newNode = document.importNode(oldNode, true); //导入节点及其所有子节点
document.body.appendChild(newNode);
```

这个方法在 HTML 文档中并不常用，在 XML 文档中用得比较多（更多讨论请参见第 18 章）。

“DOM2 级视图”模块添加了一个名为 defaultView 的属性，其中保存着一个指针，指向拥有给定文档的窗口（或框架）。除此之外，“视图”规范没有提供什么时候其他视图可用的信息，因而这是唯一一个新增的属性。除 IE 之外的所有浏览器都支持 defaultView 属性。在 IE 中有一个等价的属性名叫 parentWindow（Opera 也支持这个属性）。因此，要确定文档的归属窗口，可以使用以下代码。

```
var parentWindow = document.defaultView || document.parentWindow;
```

除了上述一个方法和一个属性之外，“DOM2级核心”还为 document.implementation 对象规定了两个新方法：createDocumentType()和 createDocument()。前者用于创建一个新的 DocumentType 节点，接受 3 个参数：文档类型名称、publicId、systemId。例如，下列代码会创建一个新的 HTML 4.01 Strict 文档类型。

```
var doctype = document.implementation.createDocumentType("html",
 "-//W3C//DTD HTML 4.01//EN",
 "http://www.w3.org/TR/html4/strict.dtd");
```

由于既有文档的文档类型不能改变，因此 createDocumentType() 只在创建新文档时有用；创建新文档时需要用到 createDocument() 方法。这个方法接受 3 个参数：针对文档中元素的 namespaceURI、文档元素的标签名、新文档的文档类型。下面这行代码将会创建一个空的新 XML 文档。

```
var doc = document.implementation.createDocument("", "root", null);
```

这行代码会创建一个没有命名空间的新文档，文档元素为 `<root>`，而且没有指定文档类型。要想创建一个 XHTML 文档，可以使用以下代码。

```
var doctype = document.implementation.createDocumentType("html",
 " -//W3C//DTD XHTML 1.0 Strict//EN",
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd");
var doc = document.implementation.createDocument("http://www.w3.org/1999/xhtml",
"html", doctype);
```

这样，就创建了一个带有适当命名空间和文档类型的新 XHTML 文档。不过，新文档当前只有文档元素 `<html>`，剩下的所有元素都需要继续添加。

“DOM2 级 HTML”模块也为 document.implementation 新增了一个方法，名叫 createHTMLDocument()。这个方法的用途是创建一个完整的 HTML 文档，包括 `<html>`、`<head>`、`<title>` 和 `<body>` 元素。这个方法只接受一个参数，即新创建文档的标题（放在 `<title>` 元素中的字符串），返回新的 HTML 文档，如下所示：

```
var htmldoc = document.implementation.createHTMLDocument("New Doc");
alert(htmldoc.title); //"New Doc"
alert(typeof htmldoc.body); //"object"
```

通过调用 createHTMLDocument() 创建的这个文档，是 HTMLDocument 类型的实例，因而具有该类型的所有属性和方法，包括 title 和 body 属性。只有 Opera 和 Safari 支持这个方法。

### 3. Node 类型的变化

Node 类型中唯一与命名空间无关的变化，就是添加了 isSupported() 方法。与 DOM1 级为 document.implementation 引入的 hasFeature() 方法类似，isSupported() 方法用于确定当前节点具有什么能力。这个方法也接受相同的两个参数：特性名和特性版本号。如果浏览器实现了相应特性，而且能够基于给定节点执行该特性，isSupported() 就返回 true。来看一个例子：

```
if (document.body.isSupported("HTML", "2.0")){
 //执行只有"DOM2 级 HTML"才支持的操作
}
```

由于不同实现在决定对什么特性返回 true 或 false 时并不一致，这个方法同样也存在与 hasFeature() 方法相同的问题。为此，我们建议在确定某个特性是否可用时，最好还是使用能力检测。

DOM3 级引入了两个辅助比较节点的方法：isSameNode()和 isEqualNode()。这两个方法都接受一个节点参数，并在传入节点与引用的节点相同或相等时返回 true。所谓相同，指的是两个节点引用的是同一个对象。所谓相等，指的是两个节点是相同的类型，具有相等的属性（nodeName、nodeValue，等等），而且它们的 attributes 和 childNodes 属性也相等（相同位置包含相同的值）。来看一个例子。

```
var div1 = document.createElement("div");
div1.setAttribute("class", "box");
var div2 = document.createElement("div");
div2.setAttribute("class", "box");
alert(div1.isSameNode(div1)); //true
alert(div1.isEqualNode(div2)); //true
alert(div1.isSameNode(div2)); //false
```

这里创建了两个具有相同特性的 `<div>` 元素。这两个元素相等，但不相同。

DOM3 级还针对为 DOM 节点添加额外数据引入了新方法。其中，setUserData() 方法会将数据指定给节点，它接受 3 个参数：要设置的键、实际的数据（可以是任何数据类型）和处理函数。以下代码可以将数据指定给一个节点。

```
document.body.setUserData("name", "Nicholas", function(){});
```

然后，使用 getUserData()并传入相同的键，就可以取得该数据，如下所示：

```
var value = document.body.getUserData("name");
```

传入 setUserData() 中的处理函数会在带有数据的节点被复制、删除、重命名或引入一个文档时调用，因而你可以事先决定在上述操作发生时如何处理用户数据。处理函数接受 5 个参数：表示操作类型的数值（1 表示复制，2 表示导入，3 表示删除，4 表示重命名）、数据键、数据值、源节点和目标节点。在删除节点时，源节点是 null；除在复制节点时，目标节点均为 null。在函数内部，你可以决定如何存储数据。来看下面的例子。

```
var div = document.createElement("div");
div.setUserData("name", "Nicholas", function(operation, key, value, src, dest){
 if (operation == 1){
 dest.setUserData(key, value, function(){}); }
});
var newDiv = div.cloneNode(true);
alert(newDiv.getUserData("name")); //"Nicholas"
```

这里，先创建了一个 `<div>` 元素，然后又为它添加了一些数据（用户数据）。在使用 cloneNode() 复制这个元素时，就会调用处理函数，从而将数据自动复制到了副本节点。结果在通过副本节点调用 getUserData() 时，就会返回与原始节点中包含的相同的值。

### 4. 框架的变化

框架和内嵌框架分别用 HTMLFrameElement 和 HTMLIFrameElement 表示，它们在 DOM2级中都有了一个新属性，名叫 contentDocument。这个属性包含一个指针，指向表示框架内容的文档对象。在此之前，无法直接通过元素取得这个文档对象（只能使用 frames 集合）。可以像下面这样使用这个属性。

```
var iframe = document.getElementById("myIframe");
var iframeDoc = iframe.contentDocument; //在 IE8 以前的版本中无效
```

由于 contentDocument 属性是 Document 类型的实例，因此可以像使用其他 HTML 文档一样使用它，包括所有属性和方法。Opera、Firefox、Safari 和 Chrome 支持这个属性。IE8 之前不支持框架中的 contentDocument 属性，但支持一个名叫 contentWindow 的属性，该属性返回框架的 window 对象，而这个 window 对象又有一个 document 属性。因此，要想在上述所有浏览器中访问内嵌框架的文
档对象，可以使用下列代码。

```
var iframe = document.getElementById("myIframe");
var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
```

所有浏览器都支持 contentWindow 属性。

访问框架或内嵌框架的文档对象要受到跨域安全策略的限制。如果某个框架中的页面来自其他域或不同子域，或者使用了不同的协议，那么要访问这个框架的文档对象就会导致错误。
