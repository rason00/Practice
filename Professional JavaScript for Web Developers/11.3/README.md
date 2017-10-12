# 内容涵盖

1. HTML 5
    1. 与类相关的扩充
    2. 焦点管理
    3. HTMLDocument 的变化
    4. 字符集属性
    5. 自定义数据属性
    6. 插入标记
    7. scrollIntoView() 方法

# 11.3 HTML 5

对于传统 HTML 而言，HTML5 是一个叛逆。所有之前的版本对 JavaScript 接口的描述都不过三言两语，主要篇幅都用于定义标记，与 JavaScript 相关的内容一概交由 DOM 规范去定义。

而 HTML5 规范则围绕如何使用新增标记定义了大量 JavaScript API。其中一些 API 与 DOM 重叠，定义了浏览器应该支持的 DOM 扩展。

因为 HTML5 涉及的面非常广，本节只讨论与 DOM 节点相关的内容。HTML5 的其他相关内容将在本书其他章节中穿插介绍。

# 11.3.1 与类相关的扩充

HTML4 在 Web 开发领域得到广泛采用后导致了一个很大的变化，即 class 属性用得越来越多，一方面可以通过它为元素添加样式，另一方面还可以用它表示元素的语义。

于是，自然就有很多 JavaScript 代码会来操作 CSS 类，比如动态修改类或者搜索文档中具有给定类或给定的一组类的元素，等等。为了让开发人员适应并增加对 class 属性的新认识，HTML5 新增了很多 API，致力于简化 CSS 类的用法。

## 1. getElementsByClassName() 方法

**HTML5 添加的 getElementsByClassName() 方法是最受人欢迎的一个方法，可以通过 document 对象及所有 HTML 元素调用该方法**。这个方法最早出现在 JavaScript 库中，是通过既有的 DOM 功能实现的，而原生的实现具有极大的性能优势。

**getElementsByClassName() 方法接收一个参数，即一个包含一或多个类名的字符串，返回带有指定类的所有元素的 NodeList**。传入多个类名时，类名的先后顺序不重要。来看下面的例子。

```
//取得所有类中包含"username"和"current"的元素，类名的先后顺序无所谓
var allCurrentUsernames = document.getElementsByClassName("username current");

//取得 ID 为"myDiv"的元素中带有类名"selected"的所有元素
var selected = document.getElementById("myDiv").getElementsByClassName("selected");
```

调用这个方法时，只有位于调用元素子树中的元素才会返回。**在 document 对象上调用 getElementsByClassName() 始终会返回与类名匹配的所有元素，在元素上调用该方法就只会返回后代元素中匹配的元素**。

使用这个方法可以更方便地为带有某些类的元素添加事件处理程序，从而不必再局限于使用 ID 或标签名。不过别忘了，因为返回的对象是 NodeList，所以使用这个方法与使用 getElementsByTagName() 以及其他返回 NodeList 的 DOM 方法都具有同样的性能问题。

支持 getElementsByClassName()方法的浏览器有 IE 9+、Firefox 3+、Safari 3.1+、Chrome 和 Opera 9.5+。

## 2. classList 属性

在操作类名时，需要通过 className 属性添加、删除和替换类名。因为 className 中是一个字符串，所以即使只修改字符串一部分，也必须每次都设置整个字符串的值。比如，以下面的 HTML 代码为例。

```
<div class="bd user disabled">...</div>
```

这个 `<div>` 元素一共有三个类名。要从中删除一个类名，需要把这三个类名拆开，删除不想要的那个，然后再把其他类名拼成一个新字符串。请看下面的例子。

```
//删除"user"类
//首先，取得类名字符串并拆分成数组
var classNames = div.className.split(/\s+/);

//找到要删的类名
var pos = -1,
 i,
 len;
for (i=0, len=classNames.length; i < len; i++){
 if (classNames[i] == "user"){
 pos = i;
 break;
 }
}

//删除类名
classNames.splice(i,1);

//把剩下的类名拼成字符串并重新设置
div.className = classNames.join(" ");
```

为了从 `<div>` 元素的 class 属性中删除"user"，以上这些代码都是必需的。必须得通过类似的算法替换类名并确认元素中是否包含该类名。添加类名可以通过拼接字符串完成，但必须要通过检测确定不会多次添加相同的类名。很多 JavaScript 库都实现了这个方法，以简化这些操作。

HTML5 新增了一种操作类名的方式，可以让操作更简单也更安全，那就是为所有元素添加 classList 属性。这个 classList 属性是新集合类型 DOMTokenList 的实例。与其他 DOM 集合类似，DOMTokenList 有一个表示自己包含多少元素的 length 属性，而要取得每个元素可以使用 item() 方法，也可以使用方括号语法。此外，这个新类型还定义如下方法。

1. add(value)：将给定的字符串值添加到列表中。如果值已经存在，就不添加了。
2. contains(value)：表示列表中是否存在给定的值，如果存在则返回 true，否则返回 false。
3. remove(value)：从列表中删除给定的字符串。
4. toggle(value)：如果列表中已经存在给定的值，删除它；如果列表中没有给定的值，添加它。

这样，前面那么多行代码用下面这一行代码就可以代替了：

```
div.classList.remove("user");
```

以上代码能够确保其他类名不受此次修改的影响。其他方法也能极大地减少类似基本操作的复杂性，如下面的例子所示。

```
//删除"disabled"类
div.classList.remove("disabled");

//添加"current"类
div.classList.add("current");

//切换"user"类
div.classList.toggle("user");

//确定元素中是否包含既定的类名
if (div.classList.contains("bd") && !div.classList.contains("disabled")){
 //执行操作
)

//迭代类名
for (var i=0, len=div.classList.length; i < len; i++){
 doSomething(div.classList[i]);
}
```

有了 classList 属性，除非你需要全部删除所有类名，或者完全重写元素的 class 属性，否则也就用不到 className 属性了。

支持 classList 属性的浏览器有 Firefox 3.6+和 Chrome。

# 11.3.2 焦点管理

HTML5 也添加了辅助管理 DOM 焦点的功能。

**首先就是 document.activeElement 属性，这个属性始终会引用 DOM 中当前获得了焦点的元素。元素获得焦点的方式有页面加载、用户输入（通常是通过按 Tab 键）和在代码中调用 focus() 方法**。来看几个例子。

```
var button = document.getElementById("myButton");
button.focus();
alert(document.activeElement === button); //true
```

默认情况下，文档刚刚加载完成时，document.activeElement 中保存的是 document.body 元素的引用。文档加载期间，document.activeElement 的值为 null。

另外就是新增了 **document.hasFocus() 方法，这个方法用于确定文档是否获得了焦点**。

```
var button = document.getElementById("myButton");
button.focus();
alert(document.hasFocus()); //true
```

通过检测文档是否获得了焦点，可以知道用户是不是正在与页面交互。

查询文档获知哪个元素获得了焦点，以及确定文档是否获得了焦点，这两个功能最重要的用途是提高 Web 应用的无障碍性。无障碍 Web 应用的一个主要标志就是恰当的焦点管理，而确切地知道哪个元素获得了焦点是一个极大的进步，至少我们不用再像过去那样靠猜测了。

实现了这两个属性的浏览器的包括 IE 4+、Firefox 3+、Safari 4+、Chrome 和 Opera 8+。

# 11.3.3 HTMLDocument 的变化

HTML5 扩展了 HTMLDocument，增加了新的功能。与 HTML5 中新增的其他 DOM 扩展类似，这些变化同样基于那些已经得到很多浏览器完美支持的专有扩展。所以，尽管这些扩展被写入标准的时间相对不长，但很多浏览器很早就已经支持这些功能了。

## 1. readyState 属性
IE4 最早为 document 对象引入了 readyState 属性。然后，其他浏览器也都陆续添加这个属性，最终 HTML5 把这个属性纳入了标准当中。Document 的 readyState 属性有两个可能的值：

1. loading，正在加载文档；
2. complete，已经加载完文档。

**使用 document.readyState 的最恰当方式，就是通过它来实现一个指示文档已经加载完成的指示器**。在这个属性得到广泛支持之前，要实现这样一个指示器，必须借助 onload 事件处理程序设置一个标签，表明文档已经加载完毕。document.readyState 属性的基本用法如下。

```
if (document.readyState == "complete"){
 //执行操作
}
```

支持 readyState 属性的浏览器有 IE4+、Firefox 3.6+、Safari、Chrome 和 Opera 9+。

## 2. 兼容模式

自从 IE6 开始区分渲染页面的模式是标准的还是混杂的，检测页面的兼容模式就成为浏览器的必要功能。IE 为此给 document 添加了一个名为 compatMode 的属性，这个属性就是为了告诉开发人员浏览器采用了哪种渲染模式。就像下面例子中所展示的那样，**在标准模式下，document.compatMode 的值等于"CSS1Compat"，而在混杂模式下，document.compatMode 的值等于"BackCompat"**。

```
if (document.compatMode == "CSS1Compat"){
 alert("Standards mode");
} else {
 alert("Quirks mode");
}
```

后来，陆续实现这个属性的浏览器有 Firefox、Safari 3.1+、Opera 和 Chrome。最终，HTML5 也把这个属性纳入标准，对其实现做出了明确规定。

## 3. head 属性

作为对 document.body 引用文档的 `<body>` 元素的补充，HTML5 新增了 document.head 属性，引用文档的 `<head>` 元素。要引用文档的 `<head>` 元素，可以结合使用这个属性和另一种后备方法。

```
var head = document.head || document.getElementsByTagName("head")[0];
```

如果可用，就使用 document.head，否则仍然使用 getElementsByTagName() 方法。

实现 document.head 属性的浏览器包括 Chrome 和 Safari 5。

# 11.3.4 字符集属性

HTML5 新增了几个与文档字符集有关的属性。

**其中，charset 属性表示文档中实际使用的字符集，也可以用来指定新字符集。默认情况下，这个属性的值为"UTF-16"，但可以通过 `<meta>` 元素、响应头部或直接设置 charset 属性修改这个值**。来看一个例子。

```
alert(document.charset); //"UTF-16"
document.charset = "UTF-8";
```

**另一个属性是 defaultCharset，表示根据默认浏览器及操作系统的设置，当前文档默认的字符集应该是什么**。如果文档没有使用默认的字符集，那 charset 和 defaultCharset 属性的值可能会不一样，例如：

```
if (document.charset != document.defaultCharset){
 alert("Custom character set being used.");
}
```

通过这两个属性可以得到文档使用的字符编码的具体信息，也能对字符编码进行准确地控制。运行适当的情况下，可以保证用户正常查看页面或使用应用。

支持 document.charset 属性的浏览器有 IE、Firefox、Safari、Opera 和 Chrome。支持 document.defaultCharset 属性的浏览器有 IE、Safari 和 Chrome。

# 11.3.5 自定义数据属性

**HTML5 规定可以为元素添加非标准的属性，但要添加前缀 data-，目的是为元素提供与渲染无关的信息，或者提供语义信息。这些属性可以任意添加、随便命名，只要以 data-开头即可**。来看一个例子。

```
<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
```

**添加了自定义属性之后，可以通过元素的 dataset 属性来访问自定义属性的值**。dataset 属性的值是 DOMStringMap 的一个实例，也就是一个名值对儿的映射。在这个映射中，每个 data-name 形式的属性都会有一个对应的属性，只不过属性名没有 data-前缀（比如，自定义属性是 data-myname，那映射中对应的属性就是 myname）。还是看一个例子吧。

```
//本例中使用的方法仅用于演示
var div = document.getElementById("myDiv");

//取得自定义属性的值
var appId = div.dataset.appId;
var myName = div.dataset.myname;

//设置值
div.dataset.appId = 23456;
div.dataset.myname = "Michael";

//有没有"myname"值呢？
if (div.dataset.myname){
 alert("Hello, " + div.dataset.myname);
}
```

如果需要给元素添加一些不可见的数据以便进行其他处理，那就要用到自定义数据属性。在跟踪链接或混搭应用中，通过自定义数据属性能方便地知道点击来自页面中的哪个部分。

在编写本书时，支持自定义数据属性的浏览器有 Firefox 6+和 Chrome。

# 11.3.6 插入标记

虽然 DOM 为操作节点提供了细致入微的控制手段，但在需要给文档插入大量新 HTML 标记的情况下，通过 DOM 操作仍然非常麻烦，因为不仅要创建一系列 DOM 节点，而且还要小心地按照正确的顺序把它们连接起来。相对而言，使用插入标记的技术，直接插入 HTML 字符串不仅更简单，速度也更快。以下与插入标记相关的 DOM 扩展已经纳入了 HTML5 规范。

## 1. innerHTML 属性

**在读模式下，innerHTML 属性返回与调用元素的所有子节点（包括元素、注释和文本节点）对应的 HTML 标记。在写模式下，innerHTML 会根据指定的值创建新的 DOM 树，然后用这个 DOM 树完全替换调用元素原先的所有子节点**。下面是一个例子。

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

对于上面的 `<div>` 元素来说，它的 innerHTML 属性会返回如下字符串。

```
<p>This is a <strong>paragraph</strong> with a list following it.</p>
<ul>
 <li>Item 1</li>
 <li>Item 2</li>
 <li>Item 3</li>
</ul>
```

但是，不同浏览器返回的文本格式会有所不同。IE 和 Opera 会将所有标签转换为大写形式，而 Safari、Chrome 和 Firefox 则会原原本本地按照原先文档中（或指定这些标签时）的格式返回 HTML，包括空格和缩进。不要指望所有浏览器返回的 innerHTML 值完全相同。

**在写模式下，innerHTML 的值会被解析为 DOM 子树，替换调用元素原来的所有子节点**。因为它的值被认为是 HTML，所以其中的所有标签都会按照浏览器处理 HTML 的标准方式转换为元素（同样，这里的转换结果也因浏览器而异）。如果设置的值仅是文本而没有 HTML 标签，那么结果就是设置纯文本，如下所示。

```
div.innerHTML = "Hello world!";
```

为 innerHTML 设置的包含 HTML 的字符串值与解析后 innerHTML 的值大不相同。来看下面的例子。

```
div.innerHTML = "Hello & welcome, <b>\"reader\"!</b>";
```

以上操作得到的结果如下：

```
<div id="content">Hello &amp; welcome, <b>&quot;reader&quot;!</b></div>
```

**设置了 innerHTML 之后，可以像访问文档中的其他节点一样访问新创建的节点。为 innerHTML 设置 HTML 字符串后，浏览器会将这个字符串解析为相应的 DOM树。因此设置了 innerHTML 之后，再从中读取 HTML 字符串，会得到与设置时不一样的结果。原因在于返回的字符串是根据原始 HTML 字符串创建的 DOM 树经过序列化之后的结果**。

使用 innerHTML 属性也有一些限制。比如，在大多数浏览器中，通过 innerHTML 插入 `<script>` 元素并不会执行其中的脚本。IE8 及更早版本是唯一能在这种情况下执行脚本的浏览器，但必须满足一些条件。一是必须为 `<script>` 元素指定 defer 属性，二是 `<script>` 元素必须位于（微软所谓的）“有作用域的元素”（scoped element）之后。`<script>` 元素被认为是“无作用域的元素”（NoScope element），
也就是在页面中看不到的元素，与 `<style>` 元素或注释类似。如果通过 innerHTML 插入的字符串开头就是一个“无作用域的元素”，那么 IE 会在解析这个字符串前先删除该元素。换句话说，以下代码达不到目的：

```
div.innerHTML = "<script defer>alert('hi');<\/script>"; //无效
```

此时，innerHTML 字符串一开始（而且整个）就是一个“无作用域的元素”，所以这个字符串会变成空字符串。如果想插入这段脚本，必须在前面添加一个“有作用域的元素”，可以是一个文本节点，也可以是一个没有结束标签的元素如 `<input>` 。例如，下面这几行代码都可以正常执行：

```
div.innerHTML = "_<script defer>alert('hi');<\/script>";
div.innerHTML = "<div>&nbsp;</div><script defer>alert('hi');<\/script>";
div.innerHTML = "<input type=\"hidden\"><script defer>alert('hi');<\/script>";
```

第一行代码会在 `<script>` 元素前插入一个文本节点。事后，为了不影响页面显示，你可能需要移除这个文本节点。第二行代码采用的方法类似，只不过使用的是一个包含非换行空格的 `<div>` 元素。如果仅仅插入一个空的 `<div>` 元素，还是不行；必须要包含一点儿内容，浏览器才会创建文本节点。同样，为了不影响页面布局，恐怕还得移除这个节点。第三行代码使用的是一个隐藏的 `<input>` 域，也能达到相同的效果。不过，由于隐藏的 `<input>` 域不影响页面布局，因此这种方式在大多数情况下都是首选。

大多数浏览器都支持以直观的方式通过 innerHTML 插入 `<style>` 元素，例如：
```
div.innerHTML = "<style type=\"text/css\">body {background-color: red; }</style>";
```

但在 IE8 及更早版本中，`<style>` 也是一个“没有作用域的元素”，因此必须像下面这样给它前置一个“有作用域的元素”：

```
div.innerHTML = "_<style type=\"text/css\">body {background-color: red; }</style>";
div.removeChild(div.firstChild);
```

并不是所有元素都支持 innerHTML 属性。不支持 innerHTML 的元素有：`<col>`、`<colgroup>`、`<frameset>`、`<head>`、`<html>`、`<style>`、`<table>`、`<tbody>`、`<thead>`、`<tfoot>` 和 `<tr>`。此外，在 IE8 及更早版本中，`<title>` 元素也没有 innerHTML 属性。

Firefox 对在内容类型为 application/xhtml+xml 的 XHTML文档中设置 innerHTML 有严格的限制。在 XHTML 文档中使用 innerHTML 时，XHTML 代码必须完全符合要求。如果代码格式不正确，设置 innerHTML 将会静默地失败。

无论什么时候，只要使用 innerHTML 从外部插入 HTML，都应该首先以可靠的方式处理 HTML。

**IE8 为此提供了 window.toStaticHTML() 方法，这个方法接收一个参数，即一个 HTML 字符串；返回一个经过无害处理后的版本——从源 HTML 中删除所有脚本节点和事件处理程序属性**。下面就是一个例子：

```
var text = "<a href=\"#\" onclick=\"alert('hi')\">Click Me</a>";
var sanitized = window.toStaticHTML(text); //Internet Explorer 8 only
alert(sanitized); //"<a href=\"#\">Click Me</a>"
```

这个例子将一个 HTML 链接字符串传给了 toStaticHTML() 方法，得到的无害版本中去掉了 onclick 属性。虽然目前只有 IE8 原生支持这个方法，但我们还是建议读者在通过 innerHTML 插入代码之前，尽可能先手工检查一下其中的文本内容。

## 2. outerHTML 属性

**在读模式下，outerHTML 返回调用它的元素及所有子节点的 HTML 标签。在写模式下，outerHTML 会根据指定的 HTML 字符串创建新的 DOM 子树，然后用这个 DOM 子树完全替换调用元素**。下面是一个例子。

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

**如果在 `<div>` 元素上调用 outerHTML，会返回与上面相同的代码，包括 `<div>` 本身**。不过，由于浏览器解析和解释 HTML 标记的不同，结果也可能会有所不同。（这里的不同与使用 innerHTML 属性时存在的差异性质是一样的。）

使用 outerHTML 属性以下面这种方式设置值：

```
div.outerHTML = "<p>This is a paragraph.</p>";
```

这行代码完成的操作与下面这些 DOM 脚本代码一样：

```
var p = document.createElement("p");
p.appendChild(document.createTextNode("This is a paragraph."));
div.parentNode.replaceChild(p, div);
```

结果，就是新创建的 `<p>` 元素会取代 DOM 树中的` <div>` 元素。

支持 outerHTML 属性的浏览器有 IE4+、Safari 4+、Chrome 和 Opera 8+。Firefox 7 及之前版本都不支持 outerHTML 属性。

## 3. insertAdjacentHTML() 方法

**插入标记的最后一个新增方式是 insertAdjacentHTML() 方法。这个方法最早也是在IE中出现的，它接收两个参数：插入位置和要插入的 HTML 文本**。第一个参数必须是下列值之一：

1. "beforebegin"，在当前元素之前插入一个紧邻的同辈元素；
2. "afterbegin"，在当前元素之下插入一个新的子元素或在第一个子元素之前再插入新的子元素；
3. "beforeend"，在当前元素之下插入一个新的子元素或在最后一个子元素之后再插入新的子元素；
4. "afterend"，在当前元素之后插入一个紧邻的同辈元素。

注意，这些值都必须是小写形式。第二个参数是一个 HTML 字符串（与 innerHTML 和 outerHTML 的值相同），如果浏览器无法解析该字符串，就会抛出错误。以下是这个方法的基本用法示例。

```
//作为前一个同辈元素插入
element.insertAdjacentHTML("beforebegin", "<p>Hello world!</p>");

//作为第一个子元素插入
element.insertAdjacentHTML("afterbegin", "<p>Hello world!</p>");

//作为最后一个子元素插入
element.insertAdjacentHTML("beforeend", "<p>Hello world!</p>");

//作为后一个同辈元素插入
element.insertAdjacentHTML("afterend", "<p>Hello world!</p>");
```

支持 insertAdjacentHTML() 方法的浏览器有 IE、Firefox 8+、Safari、Opera 和 Chrome。

## 4. 内存与性能问题

使用本节介绍的方法替换子节点可能会导致浏览器的内存占用问题，尤其是在 IE 中，问题更加明显。在删除带有事件处理程序或引用了其他 JavaScript 对象子树时，就有可能导致内存占用问题。假设某个元素有一个事件处理程序（或者引用了一个 JavaScript 对象作为属性），在使用前述某个属性将该元素从文档树中删除后，元素与事件处理程序（或 JavaScript 对象）之间的绑定关系在内存中并没有一并删除。如果这种情况频繁出现，页面占用的内存数量就会明显增加。因此，在使用 innerHTML、outerHTML 属性和 insertAdjacentHTML()方法时，最好先手工删除要被替换的元素的所有事件处理程序和 JavaScript 对象属性（第 13 章将进一步讨论事件处理程序）。

不过，使用这几个属性——特别是使用 innerHTML，仍然还是可以为我们提供很多便利的。一般来说，在插入大量新 HTML 标记时，使用 innerHTML 属性与通过多次 DOM 操作先创建节点再指定它们之间的关系相比，效率要高得多。这是因为在设置 innerHTML 或 outerHTML 时，就会创建一个 HTML 解析器。这个解析器是在浏览器级别的代码（通常是 C++编写的）基础上运行的，因此比执行 JavaScript 快得多。不可避免地，创建和销毁 HTML 解析器也会带来性能损失，所以最好能够将设置 innerHTML 或 outerHTML 的次数控制在合理的范围内。例如，下列代码使用 innerHTML 创建了很多列表项：

```
for (var i=0, len=values.length; i < len; i++){
 ul.innerHTML += "<li>" + values[i] + "</li>"; //要避免这种频繁操作！！
}
```

这种每次循环都设置一次 innerHTML 的做法效率很低。而且，每次循环还要从 innerHTML 中读取一次信息，就意味着每次循环要访问两次 innerHTML。最好的做法是单独构建字符串，然后再一次性地将结果字符串赋值给 innerHTML，像下面这样：

```
var itemsHtml = "";
for (var i=0, len=values.length; i < len; i++){
 itemsHtml += "<li>" + values[i] + "</li>";
}
ul.innerHTML = itemsHtml;
```

这个例子的效率要高得多，因为它只对 innerHTML 执行了一次赋值操作。

# 11.3.7 scrollIntoView() 方法

如何滚动页面也是 DOM 规范没有解决的一个问题。为了解决这个问题，浏览器实现了一些方法，以方便开发人员更好地控制页面滚动。在各种专有方法中，HTML5 最终选择了 scrollIntoView() 作为标准方法。

scrollIntoView() 可以在所有 HTML 元素上调用，通过滚动浏览器窗口或某个容器元素，调用元素就可以出现在视口中。如果给这个方法传入 true 作为参数，或者不传入任何参数，那么窗口滚动之后会让调用元素的顶部与视口顶部尽可能平齐。如果传入 false 作为参数，调用元素会尽可能全部出现在视口中，（可能的话，调用元素的底部会与视口顶部平齐。）不过顶部不一定平齐，例如：

```
//让元素可见
document.forms[0].scrollIntoView();
```

当页面发生变化时，一般会用这个方法来吸引用户的注意力。实际上，为某个元素设置焦点也会导致浏览器滚动并显示出获得焦点的元素。

支持 scrollIntoView()方法的浏览器有 IE、Firefox、Safari 和 Opera。
