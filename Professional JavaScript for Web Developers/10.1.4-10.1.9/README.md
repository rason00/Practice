# 内容涵盖

1. Text 类型
    1. 创建文本节点
    2. 规范化文本节点
    3. 分割文本节点
2. Comment 类型
3. CDATASection 类型
4. CDATASection 类型
5. DocumentFragment 类型
6. Attr 类型

# 10.1.4 Text 类型

文本节点由 Text 类型表示，包含的是可以照字面解释的纯文本内容。纯文本中可以包含转义后的 HTML 字符，但不能包含 HTML 代码。Text 节点具有以下特征：

1. nodeType 的值为 3；
2. nodeName 的值为"#text"；
3. nodeValue 的值为节点所包含的文本；
4. parentNode 是一个 Element；
5. 不支持（没有）子节点。

可以通过 nodeValue 属性或 data 属性访问 Text 节点中包含的文本，这两个属性中包含的值相同。对 nodeValue 的修改也会通过 data 反映出来，反之亦然。使用下列方法可以操作节点中的文本。

1. appendData(text)：将 text 添加到节点的末尾。
2. deleteData(offset, count)：从 offset 指定的位置开始删除 count 个字符。
3. insertData(offset, text)：在 offset 指定的位置插入 text。
4. replaceData(offset, count, text)：用 text 替换从 offset 指定的位置开始到 offset + count 为止处的文本。
5. splitText(offset)：从 offset 指定的位置将当前文本节点分成两个文本节点。
6. substringData(offset, count)：提取从 offset 指定的位置开始到 offset+count 为止处的字符串。

除了这些方法之外，文本节点还有一个 length 属性，保存着节点中字符的数目。而且，nodeValue.length 和 data.length 中也保存着同样的值。

在默认情况下，每个可以包含内容的元素最多只能有一个文本节点，而且必须确实有内容存在。来看几个例子。

```
<!-- 没有内容，也就没有文本节点 -->
<div></div>

<!-- 有空格，因而有一个文本节点 -->
<div> </div>

<!-- 有内容，因而有一个文本节点 -->
<div>Hello World!</div>
```

上面代码给出的第一个 `<div>` 元素没有内容，因此也就不存在文本节点。开始与结束标签之间只要存在内容，就会创建一个文本节点。因此，第二个 `<div>` 元素中虽然只包含一个空格，但仍然有一个文本子节点；文本节点的 nodeValue 值是一个空格。第三个 `<div>` 也有一个文本节点，其 nodeValue 的值为"Hello World!"。可以使用以下代码来访问这些文本子节点。

```
var textNode = div.firstChild; //或者 div.childNodes[0]
```

在取得了文本节点的引用后，就可以像下面这样来修改它了。

```
div.firstChild.nodeValue = "Some other message";
```

如果这个文本节点当前存在于文档树中，那么修改文本节点的结果就会立即得到反映。另外，在修改文本节点时还要注意，此时的字符串会经过 HTML（或 XML，取决于文档类型）编码。换句话说，小于号、大于号或引号都会像下面的例子一样被转义。

```
//输出结果是"Some &lt;strong&gt;other&lt;/strong&gt; message"
div.firstChild.nodeValue = "Some <strong>other</strong> message";
```

应该说，这是在向 DOM 文档中插入文本之前，先对其进行 HTML 编码的一种有效方式。

在 IE8、Firefox、Safari、Chrome 和 Opera 中，可以通过脚本访问 Text 类型的构造函数和原型。

## 1. 创建文本节点

可以使用 document.createTextNode()创建新文本节点，这个方法接受一个参数——要插入节点中的文本。与设置已有文本节点的值一样，作为参数的文本也将按照 HTML 或 XML 的格式进行编码。

```
var textNode = document.createTextNode("<strong>Hello</strong> world!");
```

在创建新文本节点的同时，也会为其设置 ownerDocument 属性。不过，除非把新节点添加到文档树中已经存在的节点中，否则我们不会在浏览器窗口中看到新节点。下面的代码会创建一个 `<div>` 元素并向其中添加一条消息。

```
var element = document.createElement("div");
element.className = "message";
var textNode = document.createTextNode("Hello world!");
element.appendChild(textNode);
document.body.appendChild(element);
```

这个例子创建了一个新 `<div>` 元素并为它指定了值为"message"的 class 特性。然后，又创建了一个文本节点，并将其添加到前面创建的元素中。最后一步，就是将这个元素添加到了文档的 `<body>` 元素中，这样就可以在浏览器中看到新创建的元素和文本节点了。

一般情况下，每个元素只有一个文本子节点。不过，在某些情况下也可能包含多个文本子节点，如下面的例子所示。

```
var element = document.createElement("div");
element.className = "message";
var textNode = document.createTextNode("Hello world!");
element.appendChild(textNode);
var anotherTextNode = document.createTextNode("Yippee!");
element.appendChild(anotherTextNode);
document.body.appendChild(element);
```

如果两个文本节点是相邻的同胞节点，那么这两个节点中的文本就会连起来显示，中间不会有空格。

## 2. 规范化文本节点

DOM 文档中存在相邻的同胞文本节点很容易导致混乱，因为分不清哪个文本节点表示哪个字符串。

另外，DOM 文档中出现相邻文本节点的情况也不在少数，于是就催生了一个能够将相邻文本节点合并的方法。这个方法是由 Node 类型定义的（因而在所有节点类型中都存在），名叫 normalize()。如果在一个包含两个或多个文本节点的父元素上调用 normalize()方法，则会将所有文本节点合并成一个节点，结果节点的 nodeValue 等于将合并前每个文本节点的 nodeValue 值拼接起来的值。来看一个例子。

```
var element = document.createElement("div");
element.className = "message";
var textNode = document.createTextNode("Hello world!");
element.appendChild(textNode);
var anotherTextNode = document.createTextNode("Yippee!");
element.appendChild(anotherTextNode);
document.body.appendChild(element);
alert(element.childNodes.length); //2
element.normalize();
alert(element.childNodes.length); //1
alert(element.firstChild.nodeValue); // "Hello world!Yippee!"
```

浏览器在解析文档时永远不会创建相邻的文本节点。这种情况只会作为执行 DOM 操作的结果出现。在某些情况下，执行 normalize()方法会导致 IE6 崩溃。不过，在 IE6 后来的补丁中，可能已经修复了这个问题（未经证实）。IE7 及更高版本中不存在这个问题。

## 3. 分割文本节点

Text 类型提供了一个作用与 normalize() 相反的方法：splitText()。这个方法会将一个文本节点分成两个文本节点，即按照指定的位置分割 nodeValue 值。原来的文本节点将包含从开始到指定位置之前的内容，新文本节点将包含剩下的文本。这个方法会返回一个新文本节点，该节点与原节点的 parentNode 相同。来看下面的例子。

```
var element = document.createElement("div");
element.className = "message";
var textNode = document.createTextNode("Hello world!");
element.appendChild(textNode);
document.body.appendChild(element);
var newNode = element.firstChild.splitText(5);
alert(element.firstChild.nodeValue); //"Hello"
alert(newNode.nodeValue); //" world!"
alert(element.childNodes.length); //2
```

在这个例子中，包含"Hello world!"的文本节点被分割为两个文本节点，从位置 5 开始。位置 5 是"Hello"和"world!"之间的空格，因此原来的文本节点将包含字符串"Hello"，而新文本节点将包含文本"world!"（包含空格）。

分割文本节点是从文本节点中提取数据的一种常用 DOM 解析技术。

# 10.1.5 Comment 类型

注释在 DOM 中是通过 Comment 类型来表示的。Comment 节点具有下列特征：

1. nodeType 的值为 8；
2. nodeName 的值为"#comment"；
3. nodeValue 的值是注释的内容；
4. parentNode 可能是 Document 或 Element；
5. 不支持（没有）子节点。

Comment 类型与 Text 类型继承自相同的基类，因此它拥有除 splitText()之外的所有字符串操作方法。与 Text 类型相似，也可以通过 nodeValue 或 data 属性来取得注释的内容。

注释节点可以通过其父节点来访问，以下面的代码为例。

```
<div id="myDiv"><!--A comment --></div>
```

在此，注释节点是 `<div>` 元素的一个子节点，因此可以通过下面的代码来访问它。

```
var div = document.getElementById("myDiv");
var comment = div.firstChild;
alert(comment.data); //"A comment"
```

另外，使用 document.createComment()并为其传递注释文本也可以创建注释节点，如下面的例子所示。

```
var comment = document.createComment("A comment ");
```

显然，开发人员很少会创建和访问注释节点，因为注释节点对算法鲜有影响。此外，浏览器也不会识别位于 `</html>` 标签后面的注释。如果要访问注释节点，一定要保证它们是 `<html>` 元素的后代（即位于 `<html>` 和 `</html>` 之间）。

在 Firefox、Safari、Chrome 和 Opera 中，可以访问 Comment 类型的构造函数和原型。在 IE8 中，注释节点被视作标签名为"!"的元素。也就是说，使用 getElementsByTagName() 可以取得注释节点。尽管 IE9 没有把注释当成元素，但它仍然通过一个名为 HTMLCommentElement 的构造函数来表示注释。

# 10.1.6 CDATASection 类型

CDATASection 类型只针对基于 XML 的文档，表示的是 CDATA 区域。与 Comment 类似，CDATASection 类型继承自 Text 类型，因此拥有除 splitText()之外的所有字符串操作方法。CDATASection 节点具有下列特征：

1. nodeType 的值为 4；
2. nodeName 的值为"#cdata-section"；
3. nodeValue 的值是 CDATA 区域中的内容；
4. parentNode 可能是 Document 或 Element；
5. 不支持（没有）子节点。

CDATA 区域只会出现在 XML 文档中，因此多数浏览器都会把 CDATA 区域错误地解析为 Comment 或 Element。以下面的代码为例：

```
<div id="myDiv"><![CDATA[This is some content.]]></div>
```

> 这个例子中的 `<div>` 元素应该包含一个 CDATASection 节点。可是，四大主流浏览器无一能够这样解析它。即使对于有效的 XHTML 页面，浏览器也没有正确地支持嵌入的 CDATA 区域。

在真正的 XML 文档中，可以使用 document.createCDataSection()来创建 CDATA 区域，只需为其传入节点的内容即可。

在 Firefox、Safari、Chrome 和 Opera 中，可以访问 CDATASection 类型的构造函数和原型。IE9 及之前版本不支持这个类型。

# 10.1.7 CDATASection 类型

DocumentType 类型在 Web 浏览器中并不常用，仅有 Firefox、Safari 和 Opera 支持它（Chrome 4.0 也支持 DocumentType 类型）。

DocumentType 包含着与文档的 doctype 有关的所有信息，它具有下列特征：

1. nodeType 的值为 10；
2. nodeName 的值为 doctype 的名称；
3. nodeValue 的值为 null；
4. parentNode 是 Document；
5. 不支持（没有）子节点。

在 DOM1 级中，DocumentType 对象不能动态创建，而只能通过解析文档代码的方式来创建。支持它的浏览器会把 DocumentType 对象保存在 document.doctype 中 。

DOM1 级描述了 DocumentType 对象的 3 个属性：name、entities 和 notations。其中，name 表示文档类型的名称；entities 是由文档类型描述的实体的 NamedNodeMap 对象；notations 是由文档类型描述的符号的 NamedNodeMap 对象。

通常，浏览器中的文档使用的都是 HTML 或 XHTML 文档类型，因而 entities 和 notations 都是空列表（列表中的项来自行内文档类型声明）。但不管怎样，只有 name 属性是有用的。这个属性中保存的是文档类型的名称，也就是出现在<!DOCTYPE 之后的文本。

以下面严格型 HTML4.01 的文档类型声明为例：

```
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd">
DocumentType 的 name 属性中保存的就是"HTML"：
alert(document.doctype.name); //"HTML"
```

IE 及更早版本不支持 DocumentType，因此 document.doctype 的值始终都等于 null。可是，这些浏览器会把文档类型声明错误地解释为注释，并且为它创建一个注释节点。IE9 会给 document.doctype 赋正确的对象，但仍然不支持访问 DocumentType 类型。

# 10.1.8 DocumentFragment 类型

在所有节点类型中，只有 DocumentFragment 在文档中没有对应的标记。DOM 规定文档片段（document fragment）是一种“轻量级”的文档，可以包含和控制节点，但不会像完整的文档那样占用额外的资源。DocumentFragment 节点具有下列特征：

1. nodeType 的值为 11；
2. nodeName 的值为"#document-fragment"；
3. nodeValue 的值为 null；
4. parentNode 的值为 null；
5. 子节点可以是 Element、ProcessingInstruction、Comment、Text、CDATASection 或 EntityReference。

虽然不能把文档片段直接添加到文档中，但可以将它作为一个“仓库”来使用，即可以在里面保存将来可能会添加到文档中的节点。要创建文档片段，可以使用 document.createDocumentFragment() 方法，如下所示：

```
var fragment = document.createDocumentFragment();
```

文档片段继承了 Node 的所有方法，通常用于执行那些针对文档的 DOM 操作。如果将文档中的节点添加到文档片段中，就会从文档树中移除该节点，也不会从浏览器中再看到该节点。添加到文档片段中的新节点同样也不属于文档树。可以通过 appendChild()或 insertBefore()将文档片段中内容添加到文档中。在将文档片段作为参数传递给这两个方法时，实际上只会将文档片段的所有子节点添加到相应位置上；文档片段本身永远不会成为文档树的一部分。来看下面的 HTML 示例代码：

```
<ul id="myList"></ul>
```

假设我们想为这个 `<ul>` 元素添加 3 个列表项。如果逐个地添加列表项，将会导致浏览器反复渲染（呈现）新信息。为避免这个问题，可以像下面这样使用一个文档片段来保存创建的列表项，然后再一次性将它们添加到文档中。

```
var fragment = document.createDocumentFragment();
var ul = document.getElementById("myList");
var li = null;
for (var i=0; i < 3; i++){
 li = document.createElement("li");
 li.appendChild(document.createTextNode("Item " + (i+1)));
 fragment.appendChild(li);
}
ul.appendChild(fragment);
```

在这个例子中，我们先创建一个文档片段并取得了对 `<ul>` 元素的引用。然后，通过 for 循环创建 3 个列表项，并通过文本表示它们的顺序。为此，需要分别创建 `<li>` 元素、创建文本节点，再把文本节点添加到 `<li>` 元素。接着使用 appendChild() 将 `<li>` 元素添加到文档片段中。循环结束后，再调用 appendChild() 并传入文档片段，将所有列表项添加到 `<ul>` 元素中。此时，文档片段的所有子节点都被删除并转移到了 `<ul>` 元素中。

# 10.1.9 Attr 类型

元素的特性在 DOM 中以 Attr 类型来表示。在所有浏览器中（包括 IE8），都可以访问 Attr 类型的构造函数和原型。从技术角度讲，特性就是存在于元素的 attributes 属性中的节点。特性节点具有下列特征：

1. nodeType 的值为 2；
2. nodeName 的值是特性的名称；
3. nodeValue 的值是特性的值；
4. parentNode 的值为 null；
5. 在 HTML 中不支持（没有）子节点；
6. 在 XML 中子节点可以是 Text 或 EntityReference。

尽管它们也是节点，但特性却不被认为是 DOM 文档树的一部分。开发人员最常使用的是 getAttribute()、setAttribute() 和remveAttribute()方法，很少直接引用特性节点。

Attr 对象有 3 个属性：name、value 和 specified。其中，name 是特性名称（与 nodeName 的值相同），value 是特性的值（与 nodeValue 的值相同），而 specified 是一个布尔值，用以区别特性是在代码中指定的，还是默认的。

使用 document.createAttribute()并传入特性的名称可以创建新的特性节点。例如，要为元素添加 align 特性，可以使用下列代码：

```
var attr = document.createAttribute("align");
attr.value = "left";
element.setAttributeNode(attr);
alert(element.attributes["align"].value); //"left"
alert(element.getAttributeNode("align").value); //"left"
alert(element.getAttribute("align")); //"left"
```

这个例子创建了一个新的特性节点。由于在调用 createAttribute() 时已经为 name 属性赋了值，所以后面就不必给它赋值了。之后，又把 value 属性的值设置为"left"。为了将新创建的特性添加到元素中，必须使用元素的 setAttributeNode() 方法。添加特性之后，可以通过下列任何方式访问该特性：attributes 属性、getAttributeNode() 方法以及 getAttribute() 方法。其中，attributes 和 getAttributeNode()都会返回对应特性的 Attr 节点，而 getAttribute()则只返回特性的值。

我们并不建议直接访问特性节点。实际上，使用 getAttribute()、setAttribute() 和 removeAttribute() 方法远比操作特性节点更为方便。
