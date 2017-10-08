# 内容涵盖

1. Document 类型
    1. 文档的子节点
    2. 文档信息
    3. 查找元素
    4. 特殊集合
    5. DOM 一致性检测
    6. 文档写入
2. Element 类型
    1. HTML 元素
    2. 取得特性
    3. 设置特性
    4. attributes 属性
    5. 创建元素)
    6. 元素的子节点

# 10.1.2 Document 类型

JavaScript 通过 Document 类型表示文档。**在浏览器中，document 对象是 HTMLDocument（继承自 Document 类型）的一个实例，表示整个 HTML 页面**。而且，document 对象是 window 对象的一个属性，因此可以将其作为全局对象来访问。Document 节点具有下列特征：

1. nodeType 的值为 9；
2. nodeName 的值为"#document"；
3. nodeValue 的值为 null；
4. parentNode 的值为 null；
5. ownerDocument 的值为 null；
6. 其子节点可能是一个 DocumentType（最多一个）、Element（最多一个）、ProcessingInstruction 或 Comment。

Document 类型可以表示 HTML 页面或者其他基于 XML 的文档。不过，最常见的应用还是作为 HTMLDocument 实例的 document 对象。通过这个文档对象，不仅可以取得与页面有关的信息，而且还能操作页面的外观及其底层结构。

在 Firefox、Safari、Chrome 和 Opera 中，可以通过脚本访问 Document 类型的构造函数和原型。但在所有浏览器中都可以访问 HTMLDocument 类型的构造函数和原型，包括 IE8及后续版本。

## 1 文档的子节点

虽然 DOM 标准规定 Document 节点的子节点可以是 DocumentType、Element、ProcessingInstruction 或 Comment，但还有两个内置的访问其子节点的快捷方式。

第一个就是 documentElement 属性，该属性始终指向 HTML 页面中的 `<html>` 元素。

另一个就是通过 childNodes 列表访问文档元素，但通过 documentElement 属性则能更快捷、更直接地访问该元素。

以下面这个简单的页面为例。

```
<html>
 <body>

 </body>
</html>
```

这个页面在经过浏览器解析后，其文档中只包含一个子节点，即 `<html>` 元素。可以通过 documentElement 或 childNodes 列表来访问这个元素，如下所示。

```
var html = document.documentElement; //取得对<html>的引用
alert(html === document.childNodes[0]); //true
alert(html === document.firstChild); //true
```
> 这个例子说明，documentElement、firstChild 和 childNodes[0] 的值相同，都指向 `<html>` 元素。

作为 HTMLDocument 的实例，document 对象还有一个 body 属性，直接指向 `<body>` 元素。因为开发人员经常要使用这个元素，**所以 document.body 在 JavaScript代码中出现的频率非常高**，其用法如下。

```
var body = document.body; //取得对<body>的引用
```

**所有浏览器都支持 document.documentElement 和 document.body 属性**。

Document 另一个可能的子节点是 DocumentType。通常将 `<!DOCTYPE>` 标签看成一个与文档其他部分不同的实体，可以通过 doctype 属性（在浏览器中是 document.doctype）来访问它的信息。

```
var doctype = document.doctype; //取得对<!DOCTYPE>的引用
```

浏览器对 document.doctype 的支持差别很大，可以给出如下总结。

1. IE8 及之前版本：如果存在文档类型声明，会将其错误地解释为一个注释并把它当作 Comment节点；而 document.doctype 的值始终为 null。
2. IE9+ 及 Firefox：如果存在文档类型声明，则将其作为文档的第一个子节点；document.doctype 是一个 DocumentType 节点，也可以通过 document.firstChild 或 document.childNodes[0] 访问同一个节点。
3. Safari、Chrome 和 Opera：如果存在文档类型声明，则将其解析，但不作为文档的子节点。document.doctype 是一个 DocumentType 节点，但该节点不会出现在 document.childNodes 中。

**由于浏览器对 document.doctype 的支持不一致，因此这个属性的用处很有限**。

从技术上说，出现在 `<html>` 元素外部的注释应该算是文档的子节点。然而，不同的浏览器在是否解析这些注释以及能否正确处理它们等方面，也存在很大差异。以下面简单的 HTML 页面为例。

```
<!--第一条注释 -->
<html>
 <body>

 </body>
</html>
<!--第二条注释 -->
```

看起来这个页面应该有 3 个子节点：注释、`<html>` 元素、注释。从逻辑上讲，我们会认为 document.childNodes 中应该包含与这 3 个节点对应的 3 项。但是，现实中的浏览器在处理位于 `<html>` 外部的注释方面存在如下差异。

1. IE8 及之前版本、Safari 3.1 及更高版本、Opera 和 Chrome 只为第一条注释创建节点，不为第二条注释创建节点。结果，第一条注释就会成为 document.childNodes 中的第一个子节点。
2. IE9 及更高版本会将第一条注释创建为 document.childNodes 中的一个注释节点，也会将第二条注释创建为 document.childNodes 中的注释子节点。
3. Firefox 以及 Safari 3.1 之前的版本会完全忽略这两条注释。

同样，浏览器间的这种不一致性也导致了位于 `<html>` 元素外部的注释没有什么用处。

多数情况下，我们都用不着在 document 对象上调用 appendChild()、removeChild() 和 replaceChild() 方法，因为文档类型（如果存在的话）是只读的，而且它只能有一个元素子节点（该节点通常早就已经存在了）。

## 2 文档信息

作为 HTMLDocument 的一个实例，document 对象还有一些标准的 Document 对象所没有的属性。

这些属性提供了 document 对象所表现的网页的一些信息。其中第一个属性就是 title，包含着 `<title>` 元素中的文本——显示在浏览器窗口的标题栏或标签页上。通过这个属性可以取得当前页面的标题，也可以修改当前页面的标题并反映在浏览器的标题栏中。修改 title 属性的值不会改变 `<title>` 元素。来看下面的例子。

```
//取得文档标题
var originalTitle = document.title;

//设置文档标题
document.title = "New page title";
```

接下来要介绍的 3 个属性都与对网页的请求有关，它们是 URL、domain 和 referrer。

URL 属性中包含页面完整的 URL（即地址栏中显示的 URL），domain 属性中只包含页面的域名，而 referrer 属性中则保存着链接到当前页面的那个页面的 URL。

在没有来源页面的情况下，referrer 属性中可能会包含空字符串。所有这些信息都存在于请求的 HTTP 头部，只不过是通过这些属性让我们能够在 JavaScrip 中访问它们而已，如下面的例子所示。

```
//取得完整的 URL
var url = document.URL;

//取得域名
var domain = document.domain;

//取得来源页面的 URL
var referrer = document.referrer;
```

URL 与 domain 属性是相互关联的。例如，如果 document.URL 等于 http://www.wrox.com/WileyCDA/，那么 document.domain 就等于 www.wrox.com。

在这 3 个属性中，只有 domain 是可以设置的。但由于安全方面的限制，也并非可以给 domain 设置任何值。如果 URL 中包含一个子域名，例如 p2p.wrox.com，那么就只能将 domain 设置为"wrox.com"（URL 中包含"www"，如 www.wrox.com 时，也是如此）。不能将这个属性设置为 URL 中不包含的域，如下面的例子所示。

```
//假设页面来自 p2p.wrox.com 域
document.domain = "wrox.com"; // 成功
document.domain = "nczonline.net"; // 出错！
```

当页面中包含来自其他子域的框架或内嵌框架时，能够设置 document.domain 就非常方便了。由于跨域安全限制，来自不同子域的页面无法通过 JavaScript 通信。而通过将每个页面的 document.domain 设置为相同的值，这些页面就可以互相访问对方包含的 JavaScript 对象了。

例如，假设有一个页面加载自 www.wrox.com，其中包含一个内嵌框架，框架内的页面加载自 p2p.wrox.com。由于 document.domain 字符串不一样，内外两个页面之间无法相互访问对方的 JavaScript 对象。但如果将这两个页面的 document.domain 值都设置为"wrox.com"，它们之间就可以通信了。

浏览器对 domain 属性还有一个限制，即如果域名一开始是“松散的”（loose），那么不能将它再设置为“紧绷的”（tight）。换句话说，在将 document.domain 设置为"wrox.com"之后，就不能再将其设置回"p2p.wrox.com"，否则将会导致错误，如下面的例子所示。

```
//假设页面来自于 p2p.wrox.com 域
document.domain = "wrox.com"; //松散的（成功）
document.domain = "p2p.wrox.com"; //紧绷的（出错！）
```

所有浏览器中都存在这个限制，但 IE8 是实现这一限制的最早的 IE 版本。

## 3 查找元素

说到**最常见的 DOM 应用**，恐怕就要数取得特定的某个或某组元素的引用，然后再执行一些操作了。

**取得元素的操作可以使用 document 对象的几个方法来完成。其中，Document 类型为此提供了两个方法：getElementById()和 getElementsByTagName()**。

第一个方法，getElementById()，接收一个参数：要取得的元素的 ID。如果找到相应的元素则返回该元素，如果不存在带有相应 ID 的元素，则返回 null。注意，这里的 ID 必须与页面中元素的 id 特性（attribute）严格匹配，包括大小写。以下面的元素为例。

```
<div id="myDiv">Some text</div>
```

可以使用下面的代码取得这个元素：

```
var div = document.getElementById("myDiv"); //取得<div>元素的引用
```

但是，下面的代码在除 IE7 及更早版本之外的所有浏览器中都将返回 null。

```
var div = document.getElementById("mydiv"); //无效的 ID（在 IE7 及更早版本中可以）
```

> **IE8 及较低版本不区分 ID 的大小写**，因此"myDiv"和"mydiv"会被当作相同的元素 ID。

如果页面中多个元素的 ID 值相同，getElementById()只返回文档中第一次出现的元素。IE7 及较低版本还为此方法添加了一个有意思的“怪癖”：name 特性与给定 ID 匹配的表单元素（ `<input>` 、 `<textarea>` 、 `<button>` 及 `<select>` ）也会被该方法返回。如果有哪个表单元素的 name 特性等于指定的 ID，而且该元素在文档中位于带有给定 ID 的元素前面，那么 IE 就会返回那个表单元素。来看下面的例子。

```
<input type="text" name="myElement" value="Text field">
<div id="myElement">A div</div>
```

> 基于这段 HTML 代码，在 IE7 中调用 document.getElementById("myElement ")，结果会返回 `<input>` 元素；而在其他所有浏览器中，都会返回对 `<div>` 元素的引用。

为了避免 IE 中存在的这个问题，最好的办法是不让表单字段的 name 特性与其他元素的 ID 相同。

另一个常用于取得元素引用的方法是 getElementsByTagName()。这个方法接受一个参数，即要取得元素的标签名，而返回的是包含零或多个元素的 NodeList。在 HTML 文档中，这个方法会返回一个 HTMLCollection 对象，作为一个“动态”集合，该对象与 NodeList 非常类似。例如，下列代码会取得页面中所有的 `<img>` 元素，并返回一个 HTMLCollection。

```
var images = document.getElementsByTagName("img");
```

这行代码会将一个 HTMLCollection 对象保存在 images 变量中。与 NodeList 对象类似，可以使用方括号语法或 item() 方法来访问 HTMLCollection 对象中的项。而这个对象中元素的数量则可以通过其 length 属性取得，如下面的例子所示。

```
alert(images.length); //输出图像的数量
alert(images[0].src); //输出第一个图像元素的 src 特性
alert(images.item(0).src); //输出第一个图像元素的 src 特性
```

HTMLCollection 对象还有一个方法，叫做 namedItem()，使用这个方法可以通过元素的 name 特性取得集合中的项。例如，假设上面提到的页面中包含如下 `<img>` 元素：

```
<img src="myimage.gif" name="myImage">
```

那么就可以通过如下方式从 images 变量中取得这个 `<img>` 元素：

```
var myImage = images.namedItem("myImage");
```

在提供按索引访问项的基础上，HTMLCollection 还支持按名称访问项，这就为我们取得实际想要的元素提供了便利。而且，对命名的项也可以使用方括号语法来访问，如下所示：

```
var myImage = images["myImage"];
```

对 HTMLCollection 而言，我们可以向方括号中传入数值或字符串形式的索引值。在后台，对数值索引就会调用 item()，而对字符串索引就会调用 namedItem()。

**要想取得文档中的所有元素，可以向 getElementsByTagName() 中传入"*"。在 JavaScript 及 CSS 中，星号（*）通常表示“全部”**。下面看一个例子。

```
var allElements = document.getElementsByTagName("*");
```

> 仅此一行代码返回的 HTMLCollection 中，就包含了整个页面中的所有元素——按照它们出现的先后顺序。换句话说，第一项是 `<html>` 元素，第二项是 `<head>` 元素，以此类推。由于 IE 将注释（Comment）实现为元素（Element），因此在 IE 中调用 getElementsByTagName("*")将会返回所有注释节点。

虽然标准规定标签名需要区分大小写，但为了最大限度地与既有 HTML 页面兼容，传给 getElementsByTagName() 的标签名是不需要区分大小写的。但对于 XML 页面而言（包括 XHTML），getElementsByTagName() 方法就会区分大小写。

第三个方法，也是只有 HTMLDocument 类型才有的方法，是 getElementsByName()。顾名思义，这个方法会返回带有给定 name 特性的所有元素。最常使用 getElementsByName() 方法的情况是取得单选按钮；为了确保发送给浏览器的值正确无误，所有单选按钮必须具有相同的 name 特性，如下面的例子所示。

```
<fieldset>
 <legend>Which color do you prefer?</legend>
 <ul>
 <li><input type="radio" value="red" name="color" id="colorRed">
 <label for="colorRed">Red</label></li>
 <li><input type="radio" value="green" name="color" id="colorGreen">
 <label for="colorGreen">Green</label></li>
 <li><input type="radio" value="blue" name="color" id="colorBlue">
 <label for="colorBlue">Blue</label></li>
 </ul>
</fieldset>
```

如这个例子所示，其中所有单选按钮的 name 特性值都是"color"，但它们的 ID 可以不同。ID 的作用在于将 `<label>` 元素应用到每个单选按钮，而 name 特性则用以确保三个值中只有一个被发送给浏览器。这样，我们就可以使用如下代码取得所有单选按钮：

```
var radios = document.getElementsByName("color");
```

与 getElementsByTagName() 类似，getElementsByName() 方法也会返回一个 HTMLCollectioin。但是，对于这里的单选按钮来说，namedItem() 方法则只会取得第一项（因为每一项的 name 特性都相同）。

## 4 特殊集合

除了属性和方法，document 对象还有一些特殊的集合。这些集合都是 HTMLCollection 对象，为访问文档常用的部分提供了快捷方式，包括：

1. document.anchors，包含文档中所有带 name 特性的 `<a>` 元素；
2. document.applets，包含文档中所有的 `<applet>` 元素，因为不再推荐使用 `<applet>` 元素，所以这个集合已经不建议使用了；
3. document.forms，包含文档中所有的 `<form>` 元素，与 document.getElementsByTagName("form") 得到的结果相同；
4. document.images，包含文档中所有的 `<img>` 元素，与 document.getElementsByTagName("img") 得到的结果相同；
5. document.links，包含文档中所有带 href 特性的 `<a>` 元素。

这个特殊集合始终都可以通过 HTMLDocument 对象访问到，而且，与 HTMLCollection 对象类似，集合中的项也会随着当前文档内容的更新而更新。

## 5 DOM 一致性检测

由于 DOM 分为多个级别，也包含多个部分，因此检测浏览器实现了 DOM 的哪些部分就十分必要了。document.implementation 属性就是为此提供相应信息和功能的对象，与浏览器对 DOM 的实现直接对应。DOM1 级只为 document.implementation 规定了一个方法，即 hasFeature()。这个方法接受两个参数：要检测的 DOM 功能的名称及版本号。如果浏览器支持给定名称和版本的功能，则该方法返回 true，如下面的例子所示：

```
var hasXmlDom = document.implementation.hasFeature("XML", "1.0");
```

下表列出了可以检测的不同的值及版本号。

| 功 能 | 版 本 号 | 说 明 |
| ----- | --------  | ---- |
| Core | 1.0、2.0、3.0 | 基本的DOM，用于描述表现文档的节点树 |
| XML | 1.0、2.0、3.0 | Core的XML扩展，添加了对CDATA、处理指令及实体的支持 |
| HTML | 1.0、2.0 | XML的HTML扩展，添加了对HTML特有元素及实体的支持 |
| Views | 2.0 | 基于某些样式完成文档的格式化 |
| StyleSheets | 2.0 | 将样式表关联到文档 |
| CSS | 2.0 | 对层叠样式表1级的支持 |
| CSS2 | 2.0 | 对层叠样式表2级的支持 |
| Events | 2.0，3.0 | 常规的DOM事件 |
| UIEvents | 2.0，3.0 | 用户界面事件 |
| MouseEvents | 2.0，3.0 | 由鼠标引发的事件（click、mouseover等） |
| MutationEvents | 2.0，3.0 | DOM树变化时引发的事件 |
| HTMLEvents | 2.0 | HTML4.01事件 |
| Range | 2.0 | 用于操作DOM树中某个范围的对象和方法 |
| Traversal | 2.0 | 遍历DOM树的方法 |
| LS | 3.0 | 文件与DOM树之间的同步加载和保存 |
| LS-Async | 3.0 | 文件与DOM树之间的异步加载和保存 |
| Validation | 3.0 | 在确保有效的前提下修改DOM树的方法 |

尽管使用 hasFeature()确实方便，但也有缺点。因为实现者可以自行决定是否与 DOM 规范的不同部分保持一致。事实上，要想让 hasFearture()方法针对所有值都返回 true 很容易，但返回 true 有时候也不意味着实现与规范一致。例如，Safari 2.x 及更早版本会在没有完全实现某些 DOM 功能的情况下也返回 true。为此，我们建议多数情况下，在使用 DOM 的某些特殊的功能之前，最好除了检测 hasFeature() 之外，还同时使用能力检测。

## 6 文档写入

**有一个 document 对象的功能已经存在很多年了，那就是将输出流写入到网页中的能力。这个能力体现在下列 4 个方法中：write()、writeln()、open() 和 close()**。

**其中，write() 和 writeln() 方法都接受一个字符串参数，即要写入到输出流中的文本。write() 会原样写入，而 writeln() 则会在字符串的末尾添加一个换行符（\n）**。

在页面被加载的过程中，可以使用这两个方法向页面中动态地加入内容，如下面的例子所示。

```
<html>
<head>
 <title>document.write() Example</title>
</head>
<body>
 <p>The current date and time is:
 <script type="text/javascript">
 document.write("<strong>" + (new Date()).toString() + "</strong>");
 </script>
 </p>
</body>
</html>
```

这个例子展示了在页面加载过程中输出当前日期和时间的代码。其中，日期被包含在一个 `<strong>` 元素中，就像在 HTML 页面中包含普通的文本一样。这样做会创建一个 DOM 元素，而且可以在将来访问该元素。通过 write() 和 writeln() 输出的任何 HTML 代码都将如此处理。

此外，还可以使用 write() 和 writeln() 方法动态地包含外部资源，例如 JavaScript 文件等。在包含 JavaScript 文件时，必须注意不能像下面的例子那样直接包含字符串"`</script>`"，因为这会导致该字符串被解释为脚本块的结束，它后面的代码将无法执行。

```
<html>
<head>
 <title>document.write() Example 2</title>
</head>
<body>
 <script type="text/javascript">
 document.write("<script type=\"text/javascript\" src=\"file.js\">" +
 "</script>");
 </script>
</body>
</html>
```

即使这个文件看起来没错，但字符串"`</script>`"将被解释为与外部的 `<script>` 标签匹配，结果文本");将会出现在页面中。为避免这个问题，只需加入转义字符\即可；第 2 章也曾经提及这个问题，解决方案如下。

```
<html>
<head>
 <title>document.write() Example 3</title>
</head>
<body>
 <script type="text/javascript">
 document.write("<script type=\"text/javascript\" src=\"file.js\">" +
 "<\/script>");
 </script>
</body>
</html>
```

字符串"`<\/script>`"不会被当作外部 `<script>` 标签的关闭标签，因而页面中也就不会出现多余的内容了。

前面的例子使用 document.write() 在页面被呈现的过程中直接向其中输出了内容。如果在文档加载结束后再调用 document.write()，那么输出的内容将会重写整个页面，如下面的例子所示：

```
<html>
<head>
 <title>document.write() Example 4</title>
</head>
<body>
 <p>This is some content that you won't get to see because it will be overwritten.</p>
 <script type="text/javascript">
 window.onload = function(){
 document.write("Hello world!");
 };
 </script>
</body>
</html>
```

> **在这个例子中，我们使用了 window.onload 事件处理程序（事件将在第 13 章讨论），等到页面完全加载之后延迟执行函数。函数执行之后，字符串"Hello world!"会重写整个页面内容**。

**方法 open() 和 close() 分别用于打开和关闭网页的输出流**。如果是在页面加载期间使用 write() 或 writeln() 方法，则不需要用到这两个方法。

严格型 XHTML 文档不支持文档写入。对于那些按照 application/xml+xhtml 内容类型提供的页面，这两个方法也同样无效。

# 10.1.3 Element 类型

除了 Document 类型之外，Element 类型就要算是 Web 编程中最常用的类型了。Element 类型用于表现 XML 或 HTML元素，提供了对元素标签名、子节点及特性的访问。Element 节点具有以下特征：

1. nodeType 的值为 1；
2. nodeName 的值为元素的标签名；
3. nodeValue 的值为 null；
4. parentNode 可能是 Document 或 Element；
5. 其子节点可能是 Element、Text、Comment、ProcessingInstruction、CDATASection 或 EntityReference。

要访问元素的标签名，可以使用 nodeName 属性，也可以使用 tagName 属性；这两个属性会返回相同的值（使用后者主要是为了清晰起见）。以下面的元素为例：

```
<div id="myDiv"></div>
```

可以像下面这样取得这个元素及其标签名：

```
var div = document.getElementById("myDiv");
alert(div.tagName); //"DIV"
alert(div.tagName == div.nodeName); //true
```

这里的元素标签名是 div，它拥有一个值为"myDiv"的 ID。可是，div.tagName 实际上输出的是"DIV"而非"div"。在 HTML 中，标签名始终都以全部大写表示；而在 XML（有时候也包括 XHTML）中，标签名则始终会与源代码中的保持一致。假如你不确定自己的脚本将会在 HTML 还是 XML 文档中执行，最好是在比较之前将标签名转换为相同的大小写形式，如下面的例子所示：

```
if (element.tagName == "div"){ //不能这样比较，很容易出错！
 //在此执行某些操作
}
if (element.tagName.toLowerCase() == "div"){ //这样最好（适用于任何文档）
 //在此执行某些操作
}
```

> 这个例子展示了围绕 tagName 属性的两次比较操作。第一次比较非常容易出错，因为其代码在HTML 文档中不管用。第二次比较将标签名转换成了全部小写，是我们推荐的做法，因为这种做法适用于 HTML 文档，也适用于 XML 文档。

可以在任何浏览器中通过脚本访问 Element 类型的构造函数及原型，包括 IE8 及之前版本。在 Safari 2 之前版本和 Opera 8 之前的版本中，不能访问 Element 类型的构造函数。

## 1 HTML 元素

所有 HTML 元素都由 HTMLElement 类型表示，不是直接通过这个类型，也是通过它的子类型来表示。HTMLElement 类型直接继承自Element 并添加了一些属性。添加的这些属性分别对应于每个 HTML 元素中都存在的下列标准特性。

1. id，元素在文档中的唯一标识符。
2. title，有关元素的附加说明信息，一般通过工具提示条显示出来。
3. lang，元素内容的语言代码，很少使用。
4. dir，语言的方向，值为"ltr"（left-to-right，从左至右）或"rtl"（right-to-left，从右至左），也很少使用。
5. className，与元素的class 特性对应，即为元素指定的CSS类。没有将这个属性命名为class，

是因为 class 是 ECMAScript 的保留字（有关保留字的信息，请参见第 1 章）。

上述这些属性都可以用来取得或修改相应的特性值。以下面的 HTML 元素为例：

```
<div id="myDiv" class="bd" title="Body text" lang="en" dir="ltr"></div>
```

元素中指定的所有信息，都可以通过下列 JavaScript 代码取得：

```
var div = document.getElementById("myDiv");
alert(div.id); //"myDiv""
alert(div.className); //"bd"
alert(div.title); //"Body text"
alert(div.lang); //"en"
alert(div.dir); //"ltr"
```

当然，像下面这样通过为每个属性赋予新的值，也可以修改对应的每个特性：

```
div.id = "someOtherId";
div.className = "ft";
div.title = "Some other text";
div.lang = "fr";
div.dir ="rtl";
```

并不是对所有属性的修改都会在页面中直观地表现出来。对 id 或 lang 的修改对用户而言是透明不可见的（假设没有基于它们的值设置的 CSS 样式），而对 title 的修改则只会在鼠标移动到这个元素之上时才会显示出来。对 dir 的修改会在属性被重写的那一刻，立即影响页面中文本的左、右对齐方式。

修改 className 时，如果新类关联了与此前不同的 CSS 样式，那么就会立即应用新的样式。前面提到过，所有 HTML 元素都是由 HTMLElement 或者其更具体的子类型来表示的。下表列出了所有 HTML 元素以及与之关联的类型（以斜体印刷的元素表示已经不推荐使用了）。注意，表中的这些类型在 Opera、Safari、Chrome 和 Firefox 中都可以通过 JavaScript 访问，但在 IE8 之前的版本中不能通过 JavaScript 访问。

| 元 素 | 类 型 | 元 素 | 类 型 |
| ----- | ----- | ----- | ---- |
| A | HTMLAnchorElement | EM | HTMLElement |
| ABBR | HTMLElement | FIELDSET | HTMLFieldSetElement |
| ACRONYM | HTMLElement | FONT | HTMLFontElement |
| ADDRESS | HTMLElement | FORM | HTMLFormElement |
| APPLET | HTMLAppletElement | FRAME | HTMLFrameElement |
| AREA | HTMLAreaElement | FRAMESET | HTMLFrameSetElement |
| B | HTMLElement | H1 | HTMLHeadingElement |
| BASE | HTMLBaseElement | H2 | HTMLHeadingElement |
| BASEFONT | HTMLBaseFontElement | H3 | HTMLHeadingElement |
| BDO | HTMLElement | H4 | HTMLHeadingElement |
| BIG | HTMLElement | H5 | HTMLHeadingElement |
| BLOCKQUOTE | HTMLQuoteElement | H6 | HTMLHeadingElement |
| BODY | HTMLBodyElement | HEAD | HTMLHeadElement |
| BR | HTMLBRElement | HR | HTMLHRElement |
| BUTTON | HTMLButtonElement | HTML | HTMLHtmlElement |
| CAPTION | HTMLTableCaptionElement | I | HTMLElement |
| CENTER | HTMLElement | IFRAME | HTMLIFrameElement |
| CITE | HTMLElement | IMG | HTMLImageElement |
| CODE | HTMLElement | INPUT | HTMLInputElement |
| COL | HTMLTableColElement | INS | HTMLModElement |
| COLGROUP | HTMLTableColElement | ISINDEX | HTMLIsIndexElement |
| DD | HTMLElement | KBD | HTMLElement |
| DEL | HTMLModElement | LABEL | HTMLLabelElement |
| DFN | HTMLElement | LEGEND | HTMLLegendElement |
| DIR | HTMLDirectoryElement | LI | HTMLLIElement |
| DIV | HTMLDivElement | LINK | HTMLLinkElement |
| DL | HTMLDListElement | MAP | HTMLMapElement |
| DT | HTMLElement | MENU | HTMLMenuElement |
| META | HTMLMetaElement | STRONG | HTMLElement |
| NOFRAMES | HTMLElement | STYLE | HTMLStyleElement |
| NOSCRIPT | HTMLElement | SUB | HTMLElement |
| OBJECT | HTMLObjectElement | SUP | HTMLElement |
| OL | HTMLOListElement | TABLE | HTMLTableElement |
| OPTGROUP | HTMLOptGroupElement | TBODY | HTMLTableSectionElement |
| OPTION | HTMLOptionElement | TD | HTMLTableCellElement |
| P | HTMLParagraphElement | TEXTAREA | HTMLTextAreaElement |
| PARAM | HTMLParamElement | TFOOT | HTMLTableSectionElement |
| PRE | HTMLPreElement | TH | HTMLTableCellElement |
| Q | HTMLQuoteElement | THEAD | HTMLTableSectionElement |
| S | HTMLElement | TITLE | HTMLTitleElement |
| SAMP | HTMLElement | TR | HTMLTableRowElement |
| SCRIPT | HTMLScriptElement | TT | HTMLElement |
| SELECT | HTMLSelectElement | U | HTMLElement |
| SMALL | HTMLElement | UL | HTMLUListElement |
| SPAN | HTMLElement | VAR | HTMLElement |
| STRIKE | HTMLElement |  |  |

表中的每一种类型都有与之相关的特性和方法。本书将会讨论其中很多类型。

## 2 取得特性

每个元素都有一或多个特性，这些特性的用途是给出相应元素或其内容的附加信息。操作特性的 DOM 方法主要有三个，分别是 getAttribute()、setAttribute()和 removeAttribute()。

这三个方法可以针对任何特性使用，包括那些以 HTMLElement 类型属性的形式定义的特性。来看下面的例子：

```
var div = document.getElementById("myDiv");
alert(div.getAttribute("id")); //"myDiv"
alert(div.getAttribute("class")); //"bd"
alert(div.getAttribute("title")); //"Body text"
alert(div.getAttribute("lang")); //"en"
alert(div.getAttribute("dir")); //"ltr"
```

注意，传递给 getAttribute()的特性名与实际的特性名相同。因此要想得到 class 特性值，应该传入"class"而不是"className"，后者只有在通过对象属性访问特性时才用。如果给定名称的特性不存在，getAttribute()返回 null。

通过 getAttribute() 方法也可以取得自定义特性（即标准 HTML 语言中没有的特性）的值，以下面的元素为例：

```
<div id="myDiv" my_special_attribute="hello!"></div>
```

这个元素包含一个名为 my_special_attribute 的自定义特性，它的值是"hello!"。可以像取得其他特性一样取得这个值，如下所示：

```
var value = div.getAttribute("my_special_attribute");
```

不过，特性的名称是不区分大小写的，即"ID"和"id"代表的都是同一个特性。另外也要注意，根据 HTML5 规范，自定义特性应该加上 data-前缀以便验证。

任何元素的所有特性，也都可以通过 DOM 元素本身的属性来访问。当然，HTMLElement 也会有 5 个属性与相应的特性一一对应。不过，只有公认的（非自定义的）特性才会以属性的形式添加到 DOM 对象中。以下面的元素为例：

```
<div id="myDiv" align="left" my_special_attribute="hello!"></div>
```

因为 id 和 align 在 HTML 中是 `<div>` 的公认特性，因此该元素的 DOM 对象中也将存在对应的属性。不过，自定义特性 my_special_attribute 在 Safari、Opera、Chrome 及 Firefox 中是不存在的；但 IE 却会为自定义特性也创建属性，如下面的例子所示：

```
alert(div.id); //"myDiv"
alert(div.my_special_attribute); //undefined（IE 除外）
alert(div.align); //"left"
```

有两类特殊的特性，它们虽然有对应的属性名，但属性的值与通过 getAttribute() 返回的值并不相同。

第一类特性就是 style，用于通过 CSS 为元素指定样式。在通过 getAttribute() 访问时，返回的 style 特性值中包含的是 CSS 文本，而通过属性来访问它则会返回一个对象。由于 style 属性是用于以编程方式访问元素样式的（本章后面讨论），因此并没有直接映射到 style 特性。

第二类与众不同的特性是 onclick 这样的事件处理程序。当在元素上使用时，onclick 特性中包含的是 JavaScript 代码，如果通过 getAttribute() 访问，则会返回相应代码的字符串。而在访问 onclick 属性时，则会返回一个 JavaScript 函数（如果未在元素中指定相应特性，则返回 null）。这是因为 onclick 及其他事件处理程序属性本身就应该被赋予函数值。

由于存在这些差别，在通过 JavaScript 以编程方式操作 DOM 时，开发人员经常不使用 getAttribute()，而是只使用对象的属性。只有在取得自定义特性值的情况下，才会使用getAttribute() 方法。

在 IE7及以前版本中，通过 getAttribute()方法访问 style 特性或 onclick 这样的事件处理特性时，返回的值与属性的值相同。换句话说，getAttribute("style") 返回一个对象，而 getAttribute("onclick") 返回一个函数。虽然 IE8 已经修复了这个 bug，但不同IE版本间的不一致性，也是导致开发人员不使用 getAttribute() 访问 HTML 特性的一个原因。

## 3 设置特性

与 getAttribute() 对应的方法是 setAttribute()，这个方法接受两个参数：要设置的特性名和值。如果特性已经存在，setAttribute() 会以指定的值替换现有的值；如果特性不存在，setAttribute() 则创建该属性并设置相应的值。来看下面的例子：

```
div.setAttribute("id", "someOtherId");
div.setAttribute("class", "ft");
div.setAttribute("title", "Some other text");
div.setAttribute("lang","fr");
div.setAttribute("dir", "rtl");
```

通过 setAttribute()方法既可以操作 HTML 特性也可以操作自定义特性。通过这个方法设置的特性名会被统一转换为小写形式，即"ID"最终会变成"id"。因为所有特性都是属性，所以直接给属性赋值可以设置特性的值，如下所示。

```
div.id = "someOtherId";
div.align = "left";
```

不过，像下面这样为 DOM 元素添加一个自定义的属性，该属性不会自动成为元素的特性。

```
div.mycolor = "red";
alert(div.getAttribute("mycolor")); //null（IE 除外）
```

这个例子添加了一个名为 mycolor 的属性并将它的值设置为"red"。在大多数浏览器中，这个属性都不会自动变成元素的特性，因此想通过 getAttribute()取得同名特性的值，结果会返回 null。可是，自定义属性在 IE 中会被当作元素的特性，反之亦然。

在 IE7 及以前版本中，setAttribute()存在一些异常行为。通过这个方法设置 class 和 style 特性，没有任何效果，而使用这个方法设置事件处理程序特性时也一样。尽管到了 IE8 才解决这些问题，但我们还是推荐通过属性来设置特性。

要介绍的最后一个方法是 removeAttribute()，这个方法用于彻底删除元素的特性。调用这个方法不仅会清除特性的值，而且也会从元素中完全删除特性，如下所示：

```
div.removeAttribute("class");
```

这个方法并不常用，但在序列化 DOM 元素时，可以通过它来确切地指定要包含哪些特性。

IE6 及以前版本不支持 removeAttribute()。

## 4 attributes 属性

Element 类型是使用 attributes 属性的唯一一个 DOM 节点类型。attributes 属性中包含一个 NamedNodeMap，与 NodeList 类似，也是一个“动态”的集合。元素的每一个特性都由一个 Attr 节点表示，每个节点都保存在 NamedNodeMap 对象中。NamedNodeMap 对象拥有下列方法。

1. getNamedItem(name)：返回 nodeName 属性等于 name 的节点；
2. removeNamedItem(name)：从列表中移除 nodeName 属性等于 name 的节点；
3. setNamedItem(node)：向列表中添加节点，以节点的 nodeName 属性为索引；
4. item(pos)：返回位于数字 pos 位置处的节点。

attributes 属性中包含一系列节点，每个节点的 nodeName 就是特性的名称，而节点的 nodeValue就是特性的值。要取得元素的 id 特性，可以使用以下代码。

```
var id = element.attributes.getNamedItem("id").nodeValue;
```

以下是使用方括号语法通过特性名称访问节点的简写方式。

```
var id = element.attributes["id"].nodeValue;
```

也可以使用这种语法来设置特性的值，即先取得特性节点，然后再将其 nodeValue 设置为新值，如下所示。

```
element.attributes["id"].nodeValue = "someOtherId";
```

调用 removeNamedItem()方法与在元素上调用 removeAttribute()方法的效果相同——直接删除具有给定名称的特性。下面的例子展示了两个方法间唯一的区别，即 removeNamedItem()返回表示被删除特性的 Attr 节点。

```
var oldAttr = element.attributes.removeNamedItem("id");
```

最后，setNamedItem()是一个很不常用的方法，通过这个方法可以为元素添加一个新特性，为此需要为它传入一个特性节点，如下所示。

```
element.attributes.setNamedItem(newAttr);
```

一般来说，由于前面介绍的 attributes 的方法不够方便，因此开发人员更多的会使用 getAttribute()、removeAttribute() 和 setAttribute() 方法。

不过，如果想要遍历元素的特性，attributes 属性倒是可以派上用场。在需要将 DOM 结构序列化为 XML 或 HTML 字符串时，多数都会涉及遍历元素特性。以下代码展示了如何迭代元素的每一个特性，然后将它们构造成 name="value" name="value"这样的字符串格式。

```
function outputAttributes(element){
 var pairs = new Array(),
 attrName,
 attrValue,
 i,
 len;
 for (i=0, len=element.attributes.length; i < len; i++){
 attrName = element.attributes[i].nodeName;
 attrValue = element.attributes[i].nodeValue;
 pairs.push(attrName + "=\"" + attrValue + "\"");
 }
 return pairs.join(" ");
}
```

这个函数使用了一个数组来保存名值对，最后再以空格为分隔符将它们拼接起来（这是序列化长字符串时的一种常用技巧）。通过 attributes.length 属性，for 循环会遍历每个特性，将特性的名称和值输出为字符串。关于以上代码的运行结果，以下是两点必要的说明。

1. 针对 attributes 对象中的特性，不同浏览器返回的顺序不同。这些特性在 XML 或 HTML 代码中出现的先后顺序，不一定与它们出现在 attributes 对象中的顺序一致。
2. IE7 及更早的版本会返回 HTML 元素中所有可能的特性，包括没有指定的特性。换句话说，返回 100 多个特性的情况会很常见。

针对 IE7 及更早版本中存在的问题，可以对上面的函数加以改进，让它只返回指定的特性。每个特性节点都有一个名为 specified 的属性，这个属性的值如果为 true，则意味着要么是在 HTML 中指定了相应特性，要么是通过 setAttribute()方法设置了该特性。在 IE 中，所有未设置过的特性的该属性值都为 false，而在其他浏览器中根本不会为这类特性生成对应的特性节点（因此，在这些浏览器中，任何特性节点的 specified 值始终为 true）。改进后的代码如下所示。

```
function outputAttributes(element){
 var pairs = new Array(),
 attrName,
 attrValue,
 i,
 len;
 for (i=0, len=element.attributes.length; i < len; i++){
 attrName = element.attributes[i].nodeName;
 attrValue = element.attributes[i].nodeValue;
 if (element.attributes[i].specified) {
 pairs.push(attrName + "=\"" + attrValue + "\"");
 }
 }
 return pairs.join(" ");
}
```

这个经过改进的函数可以确保即使在 IE7 及更早的版本中，也会只返回指定的特性。

## 5 创建元素

使用 document.createElement()方法可以创建新元素。这个方法只接受一个参数，即要创建元素的标签名。这个标签名在 HTML 文档中不区分大小写，而在 XML（包括 XHTML）文档中，则是区分大小写的。例如，使用下面的代码可以创建一个 `<div>` 元素。

```
var div = document.createElement("div");
```

在使用 createElement()方法创建新元素的同时，也为新元素设置了 ownerDocuemnt 属性。此时，还可以操作元素的特性，为它添加更多子节点，以及执行其他操作。来看下面的例子。

```
div.id = "myNewDiv";
div.className = "box";
```

在新元素上设置这些特性只是给它们赋予了相应的信息。由于新元素尚未被添加到文档树中，因此设置这些特性不会影响浏览器的显示。要把新元素添加到文档树，可以使用 appendChild()、insertBefore() 或 replaceChild() 方法。下面的代码会把新创建的元素添加到文档的 `<body>` 元素中。

```
document.body.appendChild(div);
```

一旦将元素添加到文档树中，浏览器就会立即呈现该元素。此后，对这个元素所作的任何修改都会实时反映在浏览器中。

在 IE 中可以以另一种方式使用 createElement()，即为这个方法传入完整的元素标签，也可以包含属性，如下面的例子所示。

```
var div = document.createElement("<div id=\"myNewDiv\" class=\"box\"></div >");
```

这种方式有助于避开在 IE7 及更早版本中动态创建元素的某些问题。下面是已知的一些这类问题。

1. 不能设置动态创建的 `<iframe>` 元素的 name 特性。
2. 不能通过表单的 reset() 方法重设动态创建的 `<input>` 元素（第 13 章将讨论 reset() 方法）。
3. 动态创建的 type 特性值为"reset"的 `<buttou>` 元素重设不了表单。
4. 动态创建的一批 name 相同的单选按钮彼此毫无关系。name 值相同的一组单选按钮本来应该用于表示同一选项的不同值，但动态创建的一批这种单选按钮之间却没有这种关系。

上述所有问题都可以通过在createElement()中指定完整的HTML标签来解决，如下面的例子所示。

```
if (client.browser.ie && client.browser.ie <=7){
 //创建一个带 name 特性的 iframe 元素
 var iframe = document.createElement("<iframe name=\"myframe\"></iframe>");
 //创建 input 元素
 var input = document.createElement("<input type=\"checkbox\">");
 //创建 button 元素
 var button = document.createElement("<button type=\"reset\"></button>");
 //创建单选按钮
 var radio1 = document.createElement("<input type=\"radio\" name=\"choice\" "＋
"value=\"1\">");
 var radio2 = document.createElement("<input type=\"radio\" name=\"choice\" "＋
"value=\"2\">");
}
```

与使用 createElement()的惯常方式一样，这样的用法也会返回一个 DOM 元素的引用。可以将这个引用添加到文档中，也可以对其加以增强。但是，由于这样的用法要求使用浏览器检测，因此我们建议只在需要避开 IE 及更早版本中上述某个问题的情况下使用。其他浏览器都不支持这种用法。

## 6 元素的子节点

元素可以有任意数目的子节点和后代节点，因为元素可以是其他元素的子节点。元素的 childNodes 属性中包含了它的所有子节点，这些子节点有可能是元素、文本节点、注释或处理指令。不同浏览器在看待这些节点方面存在显著的不同，以下面的代码为例。

```
<ul id="myList">
 <li>Item 1</li>
 <li>Item 2</li>
 <li>Item 3</li>
</ul>
```

如果是 IE 来解析这些代码，那么 `<ul>` 元素会有 3 个子节点，分别是 3 个 `<li>` 元素。但如果是在其他浏览器中， `<ul>` 元素都会有 7 个元素，包括 3 个 `<li>` 元素和 4 个文本节点（表示 `<li>` 元素之间的空白符）。如果像下面这样将元素间的空白符删除，那么所有浏览器都会返回相同数目的子节点。

```
<ul id="myList"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>
```

对于这段代码， `<ul>` 元素在任何浏览器中都会包含 3 个子节点。如果需要通过 childNodes 属性遍历子节点，那么一定不要忘记浏览器间的这一差别。这意味着在执行某项操作以前，通常都要先检查一下 nodeTpye 属性，如下面的例子所示。

```
for (var i=0, len=element.childNodes.length; i < len; i++){
 if (element.childNodes[i].nodeType == 1){
 //执行某些操作
 }
}
```

这个例子会循环遍历特定元素的每一个子节点，然后只在子节点的 nodeType 等于 1（表示是元素节点）的情况下，才会执行某些操作。

如果想通过某个特定的标签名取得子节点或后代节点该怎么办呢？实际上，元素也支持 getElementsByTagName() 方法。在通过元素调用这个方法时，除了搜索起点是当前元素之外，其他方面都跟通过 document 调用这个方法相同，因此结果只会返回当前元素的后代。例如，要想取得前面 `<ul>` 元素中包含的所有 `<li>` 元素，可以使用下列代码。

```
var ul = document.getElementById("myList");
var items = ul.getElementsByTagName("li");
```

要注意的是，这里 `<ul>` 的后代中只包含直接子元素。不过，如果它包含更多层次的后代元素，那么各个层次中包含的 `<li>` 元素也都会返回。
