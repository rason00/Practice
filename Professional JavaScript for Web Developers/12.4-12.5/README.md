# 内容涵盖

1. 范围
    1. DOM 中的范围
    2. IE8 及更早版本中的范围
2. 第十二章 小结

# 12.4 范围

为了让开发人员更方便地控制页面，“DOM2 级遍历和范围”模块定义了“范围”（range）接口。通过范围可以选择文档中的一个区域，而不必考虑节点的界限（选择在后台完成，对用户是不可见的）。

在常规的 DOM 操作不能更有效地修改文档时，使用范围往往可以达到目的。Firefox、Opera、Safari 和 Chrome 都支持 DOM 范围。IE 以专有方式实现了自己的范围特性。

## 12.4.1 DOM 中的范围

DOM2 级在 Document 类型中定义了 createRange() 方法。在兼容 DOM 的浏览器中，这个方法属于 document 对象。使用 hasFeature()或者直接检测该方法，都可以确定浏览器是否支持范围。

```
var supportsRange = document.implementation.hasFeature("Range", "2.0");
var alsoSupportsRange = (typeof document.createRange == "function");
```

如果浏览器支持范围，那么就可以使用 createRange() 来创建 DOM 范围，如下所示：

```
var range = document.createRange();
```

与节点类似，新创建的范围也直接与创建它的文档关联在一起，不能用于其他文档。创建了范围之后，接下来就可以使用它在后台选择文档中的特定部分。而创建范围并设置了其位置之后，还可以针对范围的内容执行很多种操作，从而实现对底层 DOM 树的更精细的控制。

每个范围由一个 Range 类型的实例表示，这个实例拥有很多属性和方法。下列属性提供了当前范围在文档中的位置信息。

1. startContainer：包含范围起点的节点（即选区中第一个节点的父节点）。
2. startOffset：范围在 startContainer 中起点的偏移量。如果 startContainer 是文本节点、注释节点或 CDATA 节点，那么 startOffset 就是范围起点之前跳过的字符数量。否则，startOffset 就是范围中第一个子节点的索引。
3. endContainer：包含范围终点的节点（即选区中最后一个节点的父节点）。
4. endOffset：范围在 endContainer 中终点的偏移量（与 startOffset 遵循相同的取值规则）。
5. commonAncestorContainer：startContainer 和 endContainer 共同的祖先节点在文档树中位置最深的那个。

在把范围放到文档中特定的位置时，这些属性都会被赋值。

### 1. 用 DOM 范围实现简单选择

**要使用范围来选择文档中的一部分，最简的方式就是使用 selectNode() 或 selectNodeContents()。这两个方法都接受一个参数，即一个 DOM 节点，然后使用该节点中的信息来填充范围。其中，selectNode() 方法选择整个节点，包括其子节点；而 selectNodeContents() 方法则只选择节点的子节点**。以下面的 HTML 代码为例。

```
<!DOCTYPE html>
<html>
 <body>
 <p id="p1"><b>Hello</b> world!</p>
 </body>
</html>
```

我们可以使用下列代码来创建范围：

```
var range1 = document.createRange();
 range2 = document.createRange();
 p1 = document.getElementById("p1");
range1.selectNode(p1);
range2.selectNodeContents(p1);
```

这里创建的两个范围包含文档中不同的部分：rang1 包含 `<p/>` 元素及其所有子元素，而 rang2 包含 `<b/>` 元素、文本节点"Hello"和文本节点"world!"

在调用 selectNode() 时，startContainer、endContainer 和 commonAncestorContainer 都等于传入节点的父节点，也就是这个例子中的 document.body。而 startOffset 属性等于给定节点在其父节点的 childNodes 集合中的索引（在这个例子中是 1——因为兼容 DOM 的浏览器将空格算作一个文本节点），endOffset 等于 startOffset 加 1（因为只选择了一个节点）。

在调用 selectNodeContents() 时，startContainer、endContainer 和 commonAncestorContainer 等于传入的节点，即这个例子中的 `<p>` 元素。而 startOffset 属性始终等于 0，因为范围从给定节点的第一个子节点开始。最后，endOffset 等于子节点的数量（node.childNodes.length），在这个例子中是 2。

此外，为了更精细地控制将哪些节点包含在范围中，还可以使用下列方法。

1. setStartBefore(refNode)：将范围的起点设置在 refNode 之前，因此 refNode 也就是范围选区中的第一个子节点。同时会将 startContainer 属性设置为 refNode.parentNode，将 startOffset 属性设置为 refNode 在其父节点的 childNodes 集合中的索引。
2. setStartAfter(refNode)：将范围的起点设置在 refNode 之后，因此 refNode 也就不在范围之内了，其下一个同辈节点才是范围选区中的第一个子节点。同时会将 startContainer 属性设置为 refNode.parentNode，将 startOffset 属性设置为 refNode 在其父节点的 childNodes 集合中的索引加 1。
3. setEndBefore(refNode)：将范围的终点设置在 refNode 之前，因此 refNode 也就不在范围之内了，其上一个同辈节点才是范围选区中的最后一个子节点。同时会将 endContainer 属性设置为 refNode.parentNode，将 endOffset 属性设置为 refNode 在其父节点的 childNodes 集合中的索引。
4. setEndAfter(refNode)：将范围的终点设置在 refNode 之后，因此 refNode 也就是范围选区中的最后一个子节点。同时会将 endContainer 属性设置为 refNode.parentNode，将 endOffset 属性设置为 refNode 在其父节点的 childNodes 集合中的索引加 1。

在调用这些方法时，所有属性都会自动为你设置好。不过，要想创建复杂的范围选区，也可以直接指定这些属性的值。

### 2. 用 DOM 范围实现复杂选择

要创建复杂的范围就得使用 setStart() 和 setEnd() 方法。这两个方法都接受两个参数：一个参照节点和一个偏移量值。对 setStart() 来说，参照节点会变成 startContainer，而偏移量值会变成 startOffset。对于 setEnd() 来说，参照节点会变成 endContainer，而偏移量值会变成 endOffset。

可以使用这两个方法来模仿 selectNode()和 selectNodeContents()。来看下面的例子：

```
var range1 = document.createRange();
 range2 = document.createRange();
 p1 = document.getElementById("p1");
 p1Index = -1;
 i, len;
for (i=0, len=p1.parentNode.childNodes.length; i < len; i++) {
 if (p1.parentNode.childNodes[i] == p1) {
 p1Index = i;
 break;
 }
}

range1.setStart(p1.parentNode, p1Index);
range1.setEnd(p1.parentNode, p1Index + 1);
range2.setStart(p1, 0);
range2.setEnd(p1, p1.childNodes.length);
```

显然，要选择这个节点（使用 range1），就必须确定当前节点（p1）在其父节点的 childNodes 集合中的索引。而要选择这个节点的内容（使用 range2），也不必计算什么；只要通过 setStart() 和 setEnd() 设置默认值即可。模仿 selectNode() 和 selectNodeContents() 并不是 setStart() 和 setEnd() 的主要用途，它们更胜一筹的地方在于能够选择节点的一部分。

假设你只想选择前面 HTML 示例代码中从"Hello"的"llo"到"world!"的"o"——很容易做到。第一步是取得所有节点的引用，如下面的例子所示：

```
var p1 = document.getElementById("p1");
 helloNode = p1.firstChild.firstChild;
 worldNode = p1.lastChild;
```

实际上，"Hello"文本节点是 `<p>` 元素的孙子节点，因为它本身是 `<b>` 元素的一个子节点。因此，p1.firstChild取得的是 `<b>` ，而p1.firstChild.firstChild取得的才是这个文本节点。"world!"文本节点是 `<p>` 元素的第二个子节点（也是最后一个子节点），因此可以使用 p1.lastChild 取得该节点。然后，必须在创建范围时指定相应的起点和终点，如下面的例子所示。

```
var range = document.createRange();
range.setStart(helloNode, 2);
range.setEnd(worldNode, 3);
```

因为这个范围的选区应该从"Hello"中"e"的后面开始，所以在 setStart() 中传入 helloNode 的同时，传入了偏移量 2（即"e"的下一个位置；"H"的位置是 0）。设置选区的终点时，在 setEnd() 中传入 worldNode 的同时传入了偏移量 3，表示选区之外的第一个字符的位置，这个字符是"r"，它的位置是 3（位置 0 上还有一个空格）。

由于 helloNode 和 worldNode 都是文本节点，因此它们分别变成了新建范围的 startContainer 和 endContainer。此时 startOffset 和 endOffset 分别用以确定两个节点所包含的文本中的位置，而不是用以确定子节点的位置（就像传入的参数为元素节点时那样）。此时的 commonAncestorContainer 是 `<p>` 元素，也就是同时包含这两个节点的第一个祖先元素。

当然，仅仅是选择了文档中的某一部分用处并不大。但重要的是，选择之后才可以对选区进行操作。

### 3. 操作 DOM 范围中的内容

在创建范围时 ，内部会为这个范围创建一个文档片段，范围所属的全部节点都被添加到了这个文档片段中。为了创建这个文档片段，范围内容的格式必须正确有效。在前面的例子中，我们创建的选区分别开始和结束于两个文本节点的内部，因此不能算是格式良好的 DOM 结构，也就无法通过 DOM 来表示。但是，范围知道自身缺少哪些开标签和闭标签，它能够重新构建有效的 DOM 结构以便我们对其进行操作。

对于前面的例子而言，范围经过计算知道选区中缺少一个开始的 `<b>` 标签，因此就会在后台动态加入一个该标签，同时还会在前面加入一个表示结束的</b>标签以结束"He"。于是，修改后的 DOM 就变成了如下所示。

```
<p><b>He</b><b>llo</b> world!</p>
```

另外，文本节点"world!"也被拆分为两个文本节点，一个包含"wo"，另一个包含"rld!"。最终的 DOM 树如图 12-8 所示，右侧是表示范围的文档片段的内容。

像这样创建了范围之后，就可以使用各种方法对范围的内容进行操作了（注意，表示范围的内部文档片段中的所有节点，都只是指向文档中相应节点的指针）。

第一个方法，也是最容易理解的方法，就是 deleteContents()。这个方法能够从文档中删除范围所包含的内容。例如：

```
var p1 = document.getElementById("p1");
 helloNode = p1.firstChild.firstChild;
 worldNode = p1.lastChild;
 range = document.createRange();
range.setStart(helloNode, 2);
range.setEnd(worldNode, 3);
range.deleteContents(); 
```

执行以上代码后，页面中会显示如下 HTML 代码：

```
<p><b>He</b>rld!</p>
```

由于范围选区在修改底层 DOM 结构时能够保证格式良好，因此即使内容被删除了，最终的 DOM结构依旧是格式良好的。

与 deleteContents() 方法相似，extractContents() 也会从文档中移除范围选区。但这两个方法的区别在于，extractContents()会返回范围的文档片段。利用这个返回的值，可以将范围的内容插入到文档中的其他地方。如下面的例子所示：

```
var p1 = document.getElementById("p1");
 helloNode = p1.firstChild.firstChild;
 worldNode = p1.lastChild;
 range = document.createRange();
range.setStart(helloNode, 2);
range.setEnd(worldNode, 3);
var fragment = range.extractContents();
p1.parentNode.appendChild(fragment);
```

在这个例子中，我们将提取出来的文档片段添加到了文档 `<body>` 元素的末尾。（记住，在将文档片段传入 appendChild() 方法中时，添加到文档中的只是片段的子节点，而非片段本身。）结果得到如下HTML 代码：

```
<p><b>He</b>rld!</p>
<b>llo</b> wo
```

还一种做法，即使用 cloneContents() 创建范围对象的一个副本，然后在文档的其他地方插入该副本。如下面的例子所示：

```
var p1 = document.getElementById("p1"),
 helloNode = p1.firstChild.firstChild,
 worldNode = p1.lastChild,
 range = document.createRange();
range.setStart(helloNode, 2);
range.setEnd(worldNode, 3);
var fragment = range.cloneContents();
p1.parentNode.appendChild(fragment);
```

这个方法与 extractContents() 非常类似，因为它们都返回文档片段。它们的主要区别在于，cloneContents() 返回的文档片段包含的是范围中节点的副本，而不是实际的节点。执行上面的操作后，页面中的 HTML 代码应该如下所示：

```
<p><b>Hello</b> world!</p>
<b>llo</b> wo
```

有一点请读者注意，那就是在调用上面介绍的方法之前，拆分的节点并不会产生格式良好的文档片段。换句话说，原始的 HTML 在 DOM 被修改之前会始终保持不变。

### 4. 插入 DOM 范围中的内容

利用范围，可以删除或复制内容，还可以像前面介绍的那样操作范围中的内容。使用 insertNode() 方法可以向范围选区的开始处插入一个节点。假设我们想在前面例子中的 HTML 前面插入以下 HTML 代码：

```
<span style="color: red">Inserted text</span>
```

那么，就可以使用下列代码：

```
var p1 = document.getElementById("p1");
 helloNode = p1.firstChild.firstChild;
 worldNode = p1.lastChild;
 range = document.createRange();
range.setStart(helloNode, 2);
range.setEnd(worldNode, 3);
var span = document.createElement("span");
span.style.color = "red";
span.appendChild(document.createTextNode("Inserted text"));
range.insertNode(span);
```

运行以上 JavaScript 代码，就会得到如下 HTML 代码：

```
<p id="p1"><b>He<span style="color: red">Inserted text</span>llo</b> world</p>
```

注意，`<span>` 正好被插入到了"Hello"中的"llo"前面，而该位置就是范围选区的开始位置。还要注意的是，由于这里没有使用上一节介绍的方法，结果原始的 HTML 并没有添加或删除 `<b>` 元素。使用这种技术可以插入一些帮助提示信息，例如在打开新窗口的链接旁边插入一幅图像。

除了向范围内部插入内容之外，还可以环绕范围插入内容，此时就要使用 surroundContents() 方法。这个方法接受一个参数，即环绕范围内容的节点。在环绕范围插入内容时，后台会执行下列步骤。

1. 提取出范围中的内容（类似执行 extractContent()）；
2. 将给定节点插入到文档中原来范围所在的位置上；
3. 将文档片段的内容添加到给定节点中。

可以使用这种技术来突出显示网页中的某些词句，例如下列代码：

```
var p1 = document.getElementById("p1");
 helloNode = p1.firstChild.firstChild;
 worldNode = p1.lastChild;
 range = document.createRange();
range.selectNode(helloNode);
var span = document.createElement("span");
span.style.backgroundColor = "yellow";
range.surroundContents(span);
```

会给范围选区加上一个黄色的背景。得到的 HTML 代码如下所示：

```
<p><b><span style="background-color:yellow">Hello</span></b> world!</p>
```

为了插入 `<span>`，范围必须包含整个 DOM 选区（不能仅仅包含选中的 DOM 节点）。

### 5. 折叠 DOM 范围

所谓折叠范围，就是指范围中未选择文档的任何部分。可以用文本框来描述折叠范围的过程。假设文本框中有一行文本，你用鼠标选择了其中一个完整的单词。然后，你单击鼠标左键，选区消失，而光标则落在了其中两个字母之间。同样，在折叠范围时，其位置会落在文档中的两个部分之间，可能是范围选区的开始位置，也可能是结束位置。

**使用 collapse() 方法来折叠范围，这个方法接受一个参数，一个布尔值，表示要折叠到范围的哪一端**。参数 true 表示折叠到范围的起点，参数 false 表示折叠到范围的终点。要确定范围已经折叠完毕，可以检查 collapsed 属性，如下所示：

```
range.collapse(true); //折叠到起点
alert(range.collapsed); //输出 true 
```

检测某个范围是否处于折叠状态，可以帮我们确定范围中的两个节点是否紧密相邻。例如，对于下面的 HTML 代码：

```
<p id="p1">Paragraph 1</p><p id="p2">Paragraph 2</p>
```

如果我们不知道其实际构成（比如说，这行代码是动态生成的），那么可以像下面这样创建一个范围。

```
var p1 = document.getElementById("p1"),
 p2 = document.getElementById("p2"),
 range = document.createRange();
range.setStartAfter(p1);
range.setStartBefore(p2);
alert(range.collapsed); //输出 true
```

在这个例子中，新创建的范围是折叠的，因为 p1 的后面和 p2 的前面什么也没有。

### 6. 比较 DOM 范围

在有多个范围的情况下，可以使用 compareBoundaryPoints()方法来确定这些范围是否有公共的边界（起点或终点）。这个方法接受两个参数：表示比较方式的常量值和要比较的范围。表示比较方式的常量值如下所示。

1. Range.START_TO_START(0)：比较第一个范围和第二个范围的起点；
2. Range.START_TO_END(1)：比较第一个范围的起点和第二个范围的终点；
3. Range.END_TO_END(2)：比较第一个范围和第二个范围的终点；
4. Range.END_TO_START(3)：比较第一个范围的终点和第一个范围的起点。

compareBoundaryPoints() 方法可能的返回值如下：如果第一个范围中的点位于第二个范围中的点之前，返回-1；如果两个点相等，返回 0；如果第一个范围中的点位于第二个范围中的点之后，返回 1。来看下面的例子。

```
var range1 = document.createRange();
var range2 = document.createRange();
var p1 = document.getElementById("p1");
range1.selectNodeContents(p1);
range2.selectNodeContents(p1);
range2.setEndBefore(p1.lastChild);
alert(range1.compareBoundaryPoints(Range.START_TO_START, range2)); //0
alert(range1.compareBoundaryPoints(Range.END_TO_END, range2)); //1
```

在这个例子中，两个范围的起点实际上是相同的，因为它们的起点都是由 selectNodeContents() 方法设置的默认值来指定的。因此，第一次比较返回 0。但是，range2 的终点由于调用 setEndBefore() 已经改变了，结果是 range1 的终点位于 range2 的终点后面，因此第二次比较返回 1。

### 7. 复制 DOM 范围

可以使用 cloneRange() 方法复制范围。这个方法会创建调用它的范围的一个副本。

```
var newRange = range.cloneRange();
```

新创建的范围与原来的范围包含相同的属性，而修改它的端点不会影响原来的范围。

### 8. 清理 DOM 范围

在使用完范围之后，最好是调用 detach() 方法，以便从创建范围的文档中分离出该范围。调用 detach() 之后，就可以放心地解除对范围的引用，从而让垃圾回收机制回收其内存了。来看下面的例子。

```
range.detach(); //从文档中分离
range = null; //解除引用
```

在使用范围的最后再执行这两个步骤是我们推荐的方式。一旦分离范围，就不能再恢复使用了。

## 12.4.2 IE8 及更早版本中的范围

虽然 IE9 支持 DOM 范围，但 IE8 及之前版本不支持 DOM 范围。不过，IE8 及早期版本支持一种类似的概念，即文本范围（text range）。文本范围是 IE 专有的特性，其他浏览器都不支持。顾名思义，文本范围处理的主要是文本（不一定是 DOM 节点）。通过 `<body>`、`<button>`、`<input>` 和 `<textarea>`等这几个元素，可以调用 createTextRange() 方法来创建文本范围。以下是一个例子：

```
var range = document.body.createTextRange();
```

像这样通过 document 创建的范围可以在页面中的任何地方使用（通过其他元素创建的范围则只能在相应的元素中使用）。与 DOM 范围类似，使用 IE 文本范围的方式也有很多种。

### 1. 用 IE 范围实现简单的选择

选择页面中某一区域的最简单方式，就是使用范围的 findText()方法。这个方法会找到第一次出现的给定文本，并将范围移过来以环绕该文本。如果没有找到文本，这个方法返回 false；否则返回 true。同样，仍然以下面的 HTML 代码为例。

```
<p id="p1"><b>Hello</b> world!</p>
```

要选择"Hello"，可以使用下列代码。

```
var range = document.body.createTextRange();
var found = range.findText("Hello");
```

在执行完第二行代码之后，文本"Hello"就被包围在范围之内了。为此，可以检查范围的 text 属性来确认（这个属性返回范围中包含的文本），或者也可以检查 findText() 的返回值——在找到了文本的情况下返回值为 true。例如：

```
alert(found); //true
alert(range.text); //"Hello"
```

还可以为 findText() 传入另一个参数，即一个表示向哪个方向继续搜索的数值。负值表示应该从当前位置向后搜索，而正值表示应该从当前位置向前搜索。因此，要查找文档中前两个"Hello"的实例，应该使用下列代码。

```
var found = range.findText("Hello");
var foundAgain = range.findText("Hello", 1);
```

IE 中与 DOM 中的 selectNode() 方法最接近的方法是 moveToElementText()，这个方法接受一个 DOM 元素，并选择该元素的所有文本，包括 HTML 标签。下面是一个例子。

```
var range = document.body.createTextRange();
var p1 = document.getElementById("p1");
range.moveToElementText(p1);
```

在文本范围中包含 HTML 的情况下，可以使用 htmlText 属性取得范围的全部内容，包括 HTML和文本，如下面的例子所示。

```
alert(range.htmlText);
```

IE 的范围没有任何属性可以随着范围选区的变化而动态更新。不过，其 parentElement() 方法倒是与 DOM 的 commonAncestorContainer 属性类似。

```
var ancestor = range.parentElement();
```

这样得到的父元素始终都可以反映文本选区的父节点。

### 2. 使用 IE 范围实现复杂的选择

在 IE 中创建复杂范围的方法，就是以特定的增量向四周移动范围。为此，IE 提供了 4 个方法：move()、moveStart()、moveEnd()和 expand()。这些方法都接受两个参数：移动单位和移动单位的数量。其中，移动单位是下列一种字符串值。

1. "character"：逐个字符地移动。
2. "word"：逐个单词（一系列非空格字符）地移动。
3. "sentence"：逐个句子（一系列以句号、问号或叹号结尾的字符）地移动。
4. "textedit"：移动到当前范围选区的开始或结束位置。

通过 moveStart() 方法可以移动范围的起点，通过 moveEnd() 方法可以移动范围的终点，移动的幅度由单位数量指定，如下面的例子所示。

```
range.moveStart("word", 2); //起点移动 2 个单词
range.moveEnd("character", 1); //终点移动 1 个字符
```

使用 expand() 方法可以将范围规范化。换句话说，expand()方法的作用是将任何部分选择的文本全部选中。例如，当前选择的是一个单词中间的两个字符，调用 expand("word")可以将整个单词都包含在范围之内。

而 move() 方法则首先会折叠当前范围（让起点和终点相等），然后再将范围移动指定的单位数量，如下面的例子所示。

```
range.move("character", 5); //移动 5 个字符
```

调用 move() 之后，范围的起点和终点相同，因此必须再使用 moveStart() 或 moveEnd() 创建新的选区。

### 3. 操作 IE 范围中的内容

在 IE 中操作范围中的内容可以使用 text 属性或 pasteHTML()方法。如前所述，通过 text 属性可以取得范围中的内容文本；但是，也可以通过这个属性设置范围中的内容文本。来看一个例子。

```
var range = document.body.createTextRange();
range.findText("Hello");
range.text = "Howdy";
```

如果仍以前面的 Hello World 代码为例，执行以上代码后的 HTML 代码如下。

```
<p id="p1"><b>Howdy</b> world!</p>
```

注意，在设置 text 属性的情况下，HTML 标签保持不变。

要向范围中插入 HTML 代码，就得使用 pasteHTML()方法，如下面的例子所示。

```
var range = document.body.createTextRange();
range.findText("Hello");
range.pasteHTML("<em>Howdy</em>");
```

执行这些代码后，会得到如下 HTML。

```
<p id="p1"><b><em>Howdy</em></b> world!</p>
```

不过，在范围中包含 HTML 代码时，不应该使用 pasteHTML()，因为这样很容易导致不可预料的结果——很可能是格式不正确的 HTML。

### 4. 折叠 IE 范围

IE 为范围提供的 collapse() 方法与相应的 DOM 方法用法一样：传入 true 把范围折叠到起点，传入 false 把范围折叠到终点。例如：

```
range.collapse(true); //折叠到起点
```

可惜的是，没有对应的 collapsed 属性让我们知道范围是否已经折叠完毕。为此，必须使用 boundingWidth 属性，该属性返回范围的宽度（以像素为单位）。如果 boundingWidth 属性等于 0，就说明范围已经折叠了：

```
var isCollapsed = (range.boundingWidth == 0);
```

此外，还有 boundingHeight、boundingLeft 和 boundingTop 等属性，虽然它们都不像 boundingWidth 那么有用，但也可以提供一些有关范围位置的信息。

### 5. 比较 IE 范围

IE 中的 compareEndPoints() 方法与 DOM 范围的 compareBoundaryPoints() 方法类似。这个方法接受两个参数：比较的类型和要比较的范围。比较类型的取值范围是下列几个字符串值："StartToStart"、"StartToEnd"、"EndToEnd"和"EndToStart"。这几种比较类型与比较 DOM 范围时使用的几个值是相同的。

同样与 DOM 类似的是，compareEndPoints() 方法也会按照相同的规则返回值，即如果第一个范围的边界位于第二个范围的边界前面，返回 -1；如果二者边界相同，返回 0；如果第一个范围的边界位于第二个范围的边界后面，返回 1。仍以前面的 Hello World 代码为例，下列代码将创建两个范围，一个选择"Hello world!"（包括 `<b>` 标签），另一个选择"Hello"。

```
var range1 = document.body.createTextRange();
var range2 = document.body.createTextRange();
range1.findText("Hello world!");
range2.findText("Hello");
alert(range1.compareEndPoints("StartToStart", range2)); //0
alert(range1.compareEndPoints("EndToEnd", range2)); //1
```

由于这两个范围共享同一个起点，所以使用 compareEndPoints() 比较起点返回 0。而 range1 的终点在 range2 的终点后面，所以 compareEndPoints()返回 1。

IE 中还有两个方法，也是用于比较范围的：isEqual()用于确定两个范围是否相等，inRange() 用于确定一个范围是否包含另一个范围。下面是相应的示例。

```
var range1 = document.body.createTextRange();
var range2 = document.body.createTextRange();
range1.findText("Hello World");
range2.findText("Hello");
alert("range1.isEqual(range2): " + range1.isEqual(range2)); //false
alert("range1.inRange(range2):" + range1.inRange(range2)); //true
```

这个例子使用了与前面相同的范围来示范这两个方法。由于这两个范围的终点不同，所以它们不相等，调用 isEqual()返回 false。由于 range2 实际位于 range1 内部，它的终点位于后者的终点之前、起点之后，所以 range2 被包含在 range1 内部，调用 inRange()返回 true。

### 6. 复制 IE 范围

在 IE 中使用 duplicate()方法可以复制文本范围，结果会创建原范围的一个副本，如下面的例子所示。

```
var newRange = range.duplicate();
```

新创建的范围会带有与原范围完全相同的属性。

# 12.5 小结

DOM2 级规范定义了一些模块，用于增强 DOM1 级。“DOM2 级核心”为不同的 DOM 类型引入了一些与 XML 命名空间有关的方法。这些变化只在使用 XML 或 XHTML 文档时才有用；对于 HTML 文档没有实际意义。除了与 XML 命名空间有关的方法外，“DOM2 级核心”还定义了以编程方式创建 Document 实例的方法，也支持了创建 DocumentType 对象。

“DOM2 级样式”模块主要针对操作元素的样式信息而开发，其特性简要总结如下。

1. 每个元素都有一个关联的 style 对象，可以用来确定和修改行内的样式。
2. 要确定某个元素的计算样式（包括应用给它的所有 CSS 规则），可以使用 getComputedStyle() 方法。
3. IE不支持 getComputedStyle()方法，但为所有元素都提供了能够返回相同信息 currentStyle 属性。
4. 可以通过 document.styleSheets 集合访问样式表。
5. 除 IE 之外的所有浏览器都支持针对样式表的这个接口，IE 也为几乎所有相应的 DOM 功能提供了自己的一套属性和方法。

“DOM2 级遍历和范围”模块提供了与 DOM 结构交互的不同方式，简要总结如下。

1. 遍历即使用 NodeIterator 或 TreeWalker 对 DOM 执行深度优先的遍历。
2. NodeIterator 是一个简单的接口，只允许以一个节点的步幅前后移动。而 TreeWalker 在提供相同功能的同时，还支持在 DOM 结构的各个方向上移动，包括父节点、同辈节点和子节点等方向。
3. 范围是选择 DOM 结构中特定部分，然后再执行相应操作的一种手段。
4. 使用范围选区可以在删除文档中某些部分的同时，保持文档结构的格式良好，或者复制文档中的相应部分。
5. IE8 及更早版本不支持“DOM2 级遍历和范围”模块，但它提供了一个专有的文本范围对象，可以用来完成简单的基于文本的范围操作。IE9 完全支持 DOM 遍历。
