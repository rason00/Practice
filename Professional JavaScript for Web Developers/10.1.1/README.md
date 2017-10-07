# 10 DOM 

**DOM（文档对象模型）是针对 HTML 和 XML 文档的一个 API（应用程序编程接口）。DOM 描绘了一个层次化的节点树，允许开发人员添加、移除和修改页面的某一部分。DOM 脱胎于 Netscape 及微软公司创始的 DHTML（动态 HTML），但现在它已经成为表现和操作页面标记的真正的跨平台、语言中立的方式。**

# 内容涵盖

1. 节点层次
    1. Node 类型
        1. nodeName 和 nodeValue 属性
        2. 节点关系
        3. 节点操作
        4. 其他方法

# 10.1 节点层次

DOM 可以将任何 HTML 或 XML 文档描绘成一个由多层节点构成的结构。节点分为几种不同的类型，每种类型分别表示文档中不同的信息及（或）标记。每个节点都拥有各自的特点、数据和方法，另外也与其他节点存在某种关系。节点之间的关系构成了层次，而所有页面标记则表现为一个以特定节点为根节点的树形结构。以下面的 HTML 为例：

```
<html>
 <head>
 <title>Sample Page</title>
 </head>
 <body>
 <p>Hello World!</p>
 </body>
</html>
```

可以将这个简单的 HTML 文档表示为一个层次结构，文档节点是每个文档的根节点。在这个例子中，文档节点只有一个子节点，即 `<html>` 元素，我们称之为文档元素。文档元素是文档的最外层元素，文档中的其他所有元素都包含在文档元素中。每个文档只能有一个文档元素。在 HTML 页面中，文档元素始终都是 `<html>` 元素。在 XML 中，没有预定义的元素，因此任何元素都可能成为文档元素。

每一段标记都可以通过树中的一个节点来表示：HTML 元素通过元素节点表示，特性（attribute）通过特性节点表示，文档类型通过文档类型节点表示，而注释则通过注释节点表示。总共有 12 种节点类型，这些类型都继承自一个基类型。

# 10.1.1 Node 类型

DOM1 级定义了一个 Node 接口，该接口将由 DOM 中的所有节点类型实现。这个 Node 接口在 JavaScript 中是作为 Node 类型实现的；除了 IE 之外，在其他所有浏览器中都可以访问到这个类型。

JavaScript 中的所有节点类型都继承自 Node 类型，因此所有节点类型都共享着相同的基本属性和方法。每个节点都有一个 nodeType 属性，用于表明节点的类型。节点类型由在 Node 类型中定义的下列12 个数值常量来表示，任何节点类型必居其一：

1. Node.ELEMENT_NODE(1)；
2. Node.ATTRIBUTE_NODE(2)；
3. Node.TEXT_NODE(3)；
4. Node.CDATA_SECTION_NODE(4)；
5. Node.ENTITY_REFERENCE_NODE(5)；
6. Node.ENTITY_NODE(6)；
7. Node.PROCESSING_INSTRUCTION_NODE(7)；
8. Node.COMMENT_NODE(8)；
9. Node.DOCUMENT_NODE(9)；
10. Node.DOCUMENT_TYPE_NODE(10)；
11. Node.DOCUMENT_FRAGMENT_NODE(11)；
12. Node.NOTATION_NODE(12)。

通过比较上面这些常量，可以很容易地确定节点的类型，例如：

```
if (someNode.nodeType == Node.ELEMENT_NODE){ //在 IE 中无效
 alert("Node is an element.");
}
```

这个例子比较了 someNode.nodeType 与 Node.ELEMENT_NODE 常量。如果二者相等，则意味着 someNode 确实是一个元素。然而，由于 IE 没有公开 Node 类型的构造函数，因此上面的代码在 IE 中会导致错误。为了确保跨浏览器兼容，最好还是将 nodeType 属性与数字值进行比较，如下所示：

```
if (someNode.nodeType == 1){ //适用于所有浏览器
 alert("Node is an element.");
}
```

并不是所有节点类型都受到 Web 浏览器的支持。开发人员最常用的就是元素和文本节点。本章后面将详细讨论每个节点类型的受支持情况及使用方法。

## 1. nodeName 和 nodeValue 属性

要了解节点的具体信息，可以使用 nodeName 和 nodeValue 这两个属性。这两个属性的值完全取决于节点的类型。在使用这两个值以前，最好是像下面这样先检测一下节点的类型。

```
if (someNode.nodeType == 1){
 value = someNode.nodeName; //nodeName 的值是元素的标签名
}
```

> 在这个例子中，首先检查节点类型，看它是不是一个元素。如果是，则取得并保存 nodeName 的值。

对于元素节点，nodeName 中保存的始终都是元素的标签名，而 nodeValue 的值则始终为 null。

## 2. 节点关系

文档中所有的节点之间都存在这样或那样的关系。节点间的各种关系可以用传统的家族关系来描述，相当于把文档树比喻成家谱。在 HTML 中，可以将 `<body>` 元素看成是 `<html>` 元素的子元素；相应地，也就可以将 `<html>` 元素看成是 `<body>` 元素的父元素。而 `<head>` 元素，则可以看成是 `<body>` 元素的同胞元素，因为它们都是同一个父元素 `<html>` 的直接子元素。

每个节点都有一个 childNodes 属性，其中保存着一个 NodeList 对象。NodeList 是一种类数组对象，用于保存一组有序的节点，可以通过位置来访问这些节点。请注意，虽然可以通过方括号语法来访问 NodeList 的值，而且这个对象也有 length 属性，但它并不是 Array 的实例。NodeList 对象的独特之处在于，它实际上是基于 DOM 结构动态执行查询的结果，因此 DOM 结构的变化能够自动反映在 NodeList 对象中。我们常说，NodeList 是有生命、有呼吸的对象，而不是在我们第一次访问它们的某个瞬间拍摄下来的一张快照。

下面的例子展示了如何访问保存在 NodeList 中的节点——可以通过方括号，也可以使用 item() 方法。

```
var firstChild = someNode.childNodes[0];
var secondChild = someNode.childNodes.item(1);
var count = someNode.childNodes.length;
```

无论使用方括号还是使用 item() 方法都没有问题，但使用方括号语法看起来与访问数组相似，因此颇受一些开发人员的青睐。另外，要注意 length 属性表示的是访问 NodeList 的那一刻，其中包含的节点数量。我们在本书前面介绍过，对 arguments 对象使用 Array.prototype.slice() 方法可以将其转换为数组。而采用同样的方法，也可以将 NodeList 对象转换为数组。来看下面的例子：

```
//在 IE8 及之前版本中无效
var arrayOfNodes = Array.prototype.slice.call(someNode.childNodes,0);
```

除 IE8 及更早版本之外，这行代码能在任何浏览器中运行。由于 IE8 及更早版本将 NodeList 实现为一个 COM 对象，而我们不能像使用 JScript 对象那样使用这种对象，因此上面的代码会导致错误。要想在 IE 中将 NodeList 转换为数组，必须手动枚举所有成员。下列代码在所有浏览器中都可以运行：

```
function convertToArray(nodes){
 var array = null;
 try {
 array = Array.prototype.slice.call(nodes, 0); //针对非 IE 浏览器
 } catch (ex) {
 array = new Array();
 for (var i=0, len=nodes.length; i < len; i++){
 array.push(nodes[i]);
 }
 }
 return array;
}
```

> 这个 convertToArray()函数首先尝试了创建数组的最简单方式。如果导致了错误（说明是在 IE8 及更早版本中），则通过 try-catch 块来捕获错误，然后手动创建数组。这是另一种检测怪癖的形式。

每个节点都有一个 parentNode 属性，该属性指向文档树中的父节点。包含在 childNodes 列表中的所有节点都具有相同的父节点，因此它们的 parentNode 属性都指向同一个节点。此外，包含在 childNodes 列表中的每个节点相互之间都是同胞节点。通过使用列表中每个节点的 previousSibling 和 nextSibling 属性，可以访问同一列表中的其他节点。列表中第一个节点的 previousSibling 属性值为 null，而列表中最后一个节点的 nextSibling 属性的值同样也为 null，如下面的例子所示：

```
if (someNode.nextSibling === null){
 alert("Last node in the parent’s childNodes list.");
} else if (someNode.previousSibling === null){
 alert("First node in the parent’s childNodes list.");
}
```

当然，如果列表中只有一个节点，那么该节点的 nextSibling 和 previousSibling 都为 null。

父节点与其第一个和最后一个子节点之间也存在特殊关系。父节点的 firstChild 和 lastChild 属性分别指向其 childNodes 列表中的第一个和最后一个节点。其中，someNode.firstChild 的值始终等于 someNode.childNodes[0] ， 而 someNode.lastChild 的值始终等于 someNode.childNodes [someNode.childNodes.length-1]。在只有一个子节点的情况下，firstChild 和 lastChild 指向同一个节点。如果没有子节点，那么 firstChild 和 lastChild 的值均为 null。明确这些关系能够对我们查找和访问文档结构中的节点提供极大的便利。

在反映这些关系的所有属性当中，childNodes 属性与其他属性相比更方便一些，因为只须使用简单的关系指针，就可以通过它访问文档树中的任何节点。另外，hasChildNodes() 也是一个非常有用的方法，这个方法在节点包含一或多个子节点的情况下返回 true；应该说，这是比查询 childNodes 列表的 length 属性更简单的方法。

所有节点都有的最后一个属性是 ownerDocument，该属性指向表示整个文档的文档节点。这种关系表示的是任何节点都属于它所在的文档，任何节点都不能同时存在于两个或更多个文档中。通过这个属性，我们可以不必在节点层次中通过层层回溯到达顶端，而是可以直接访问文档节点。

虽然所有节点类型都继承自 Node，但并不是每种节点都有子节点。本章后面将会讨论不同节点类型之间的差异。

## 3. 操作节点

因为关系指针都是只读的，所以 DOM 提供了一些操作节点的方法。其中，最常用的方法是 appendChild()，用于向 childNodes 列表的末尾添加一个节点。添加节点后，childNodes 的新增节点、父节点及以前的最后一个子节点的关系指针都会相应地得到更新。更新完成后，appendChild() 返回新增的节点。来看下面的例子：

```
var returnedNode = someNode.appendChild(newNode);
alert(returnedNode == newNode); //true
alert(someNode.lastChild == newNode); //true
```

如果传入到 appendChild() 中的节点已经是文档的一部分了，那结果就是将该节点从原来的位置转移到新位置。即使可以将 DOM 树看成是由一系列指针连接起来的，但任何 DOM 节点也不能同时出现在文档中的多个位置上。因此，如果在调用 appendChild()时传入了父节点的第一个子节点，那么该节点就会成为父节点的最后一个子节点，如下面的例子所示。

```
//someNode 有多个子节点
var returnedNode = someNode.appendChild(someNode.firstChild);
alert(returnedNode == someNode.firstChild); //false
alert(returnedNode == someNode.lastChild); //true
```

如果需要把节点放在 childNodes 列表中某个特定的位置上，而不是放在末尾，那么可以使用 insertBefore() 方法。这个方法接受两个参数：要插入的节点和作为参照的节点。插入节点后，被插入的节点会变成参照节点的前一个同胞节点（previousSibling），同时被方法返回。如果参照节点是 null，则 insertBefore() 与 appendChild() 执行相同的操作，如下面的例子所示。

```
//插入后成为最后一个子节点
returnedNode = someNode.insertBefore(newNode, null);
alert(newNode == someNode.lastChild); //true

//插入后成为第一个子节点
var returnedNode = someNode.insertBefore(newNode, someNode.firstChild);
alert(returnedNode == newNode); //true
alert(newNode == someNode.firstChild); //true

//插入到最后一个子节点前面
returnedNode = someNode.insertBefore(newNode, someNode.lastChild);
alert(newNode == someNode.childNodes[someNode.childNodes.length-2]); //true
```

前面介绍的 appendChild() 和 insertBefore() 方法都只插入节点，不会移除节点。而下面要介绍的 replaceChild() 方法接受的两个参数是：要插入的节点和要替换的节点。要替换的节点将由这个方法返回并从文档树中被移除，同时由要插入的节点占据其位置。来看下面的例子。

```
//替换第一个子节点
var returnedNode = someNode.replaceChild(newNode, someNode.firstChild);

//替换最后一个子节点
returnedNode = someNode.replaceChild(newNode, someNode.lastChild);
```

在使用 replaceChild() 插入一个节点时，该节点的所有关系指针都会从被它替换的节点复制过来。尽管从技术上讲，被替换的节点仍然还在文档中，但它在文档中已经没有了自己的位置。

如果只想移除而非替换节点，可以使用 removeChild()方法。这个方法接受一个参数，即要移除的节点。被移除的节点将成为方法的返回值，如下面的例子所示。

```
//移除第一个子节点
var formerFirstChild = someNode.removeChild(someNode.firstChild);

//移除最后一个子节点
var formerLastChild = someNode.removeChild(someNode.lastChild);
```

与使用 replaceChild()方法一样，通过 removeChild()移除的节点仍然为文档所有，只不过在文档中已经没有了自己的位置。

前面介绍的四个方法操作的都是某个节点的子节点，也就是说，要使用这几个方法必须先取得父节点（使用 parentNode 属性）。另外，并不是所有类型的节点都有子节点，如果在不支持子节点的节点上调用了这些方法，将会导致错误发生。

## 4. 其他方法

有两个方法是所有类型的节点都有的。第一个就是 cloneNode()，用于创建调用这个方法的节点的一个完全相同的副本。cloneNode() 方法接受一个布尔值参数，表示是否执行深复制。在参数为 true 的情况下，执行深复制，也就是复制节点及其整个子节点树；在参数为 false 的情况下，执行浅复制，即只复制节点本身。复制后返回的节点副本属于文档所有，但并没有为它指定父节点。因此，这个节点副本就成为了一个“孤儿”，除非通过 appendChild()、insertBefore()或 replaceChild() 将它添加到文档中。例如，假设有下面的 HTML 代码。

```
<ul>
 <li>item 1</li>
 <li>item 2</li>
 <li>item 3</li>
</ul>
```

如果我们已经将 `<ul>` 元素的引用保存在了变量 myList 中，那么通常下列代码就可以看出使用 cloneNode() 方法的两种模式。

```
var deepList = myList.cloneNode(true);
alert(deepList.childNodes.length); //3（IE < 9）或 7（其他浏览器）
var shallowList = myList.cloneNode(false);
alert(shallowList.childNodes.length); //0
```

在这个例子中，deepList 中保存着一个对 myList 执行深复制得到的副本。因此，deepList 中包含 3 个列表项，每个列表项中都包含文本。而变量 shallowList 中保存着对 myList 执行浅复制得到的副本，因此它不包含子节点。deepList.childNodes.length 中的差异主要是因为 IE8 及更早版本与其他浏览器处理空白字符的方式不一样。IE9 之前的版本不会为空白符创建节点。

cloneNode() 方法不会复制添加到 DOM 节点中的 JavaScript 属性，例如事件处理程序等。这个方法只复制特性、（在明确指定的情况下也复制）子节点，其他一切都不会复制。IE 在此存在一个 bug，即它会复制事件处理程序，所以我们建议在复制之前最好先移除事件处理程序。

我们要介绍的最后一个方法是 normalize()，这个方法唯一的作用就是处理文档树中的文本节点。由于解析器的实现或 DOM 操作等原因，可能会出现文本节点不包含文本，或者接连出现两个文本节点的情况。当在某个节点上调用这个方法时，就会在该节点的后代节点中查找上述两种情况。如果找到了空文本节点，则删除它；如果找到相邻的文本节点，则将它们合并为一个文本节点。本章后面还将进一步讨论这个方法。
