# 内容涵盖

1. 样式
    1. 访问元素的样式
        1. DOM 样式属性和方法
        2. 计算的样式
    2. 操作样式表
        1. CSS 规则
        2. 创建规则
        3. 删除规则
    3. 元素大小
        1. 偏移量
        2. 客户区大小
        3. 滚动大小
        4. 确定元素大小

# 12.2 样式

在 HTML 中定义样式的方式有 3 种：通过 `<link/>` 元素包含外部样式表文件、使用 `<style/>` 元素定义嵌入式样式，以及使用 style 特性定义针对特定元素的样式。“DOM2 级样式”模块围绕这 3 种应用样式的机制提供了一套 API。要确定浏览器是否支持 DOM2 级定义的 CSS 能力，可以使用下列代码。

```
var supportsDOM2CSS = document.implementation.hasFeature("CSS", "2.0");
var supportsDOM2CSS2 = document.implementation.hasFeature("CSS2", "2.0"); 
```

## 12.2.1 访问元素的样式

任何支持 style 特性的 HTML 元素在 JavaScript 中都有一个对应的 style 属性。**这个 style 对象是 CSSStyleDeclaration 的实例，包含着通过 HTML 的 style 特性指定的所有样式信息，但不包含与外部样式表或嵌入样式表经层叠而来的样式**。在 style 特性中指定的任何 CSS 属性都将表现为这个 style 对象的相应属性。**对于使用短划线（分隔不同的词汇，例如 background-image）的 CSS 属性名，必须将其转换成驼峰大小写形式，才能通过 JavaScript 来访问**。下表列出了几个常见的 CSS 属性及其在 style 对象中对应的属性名。

| CSS属性 | JavaScript属性 |
| ------- | ------------- |
| background-image | style.backgroundImage |
| color | style.color |
| display | style.display |
| font-family | style.fontFamily |

多数情况下，都可以通过简单地转换属性名的格式来实现转换。其中一个不能直接转换的 CSS 属性就是 float。由于 float 是 JavaScript 中的保留字，因此不能用作属性名。“DOM2 级样式”规范规定样式对象上相应的属性名应该是 cssFloat；Firefox、Safari、Opera 和 Chrome 都支持这个属性，而 IE 支持的则是 styleFloat。

只要取得一个有效的 DOM 元素的引用，就可以随时使用 JavaScript 为其设置样式。以下是几个例子。

```
var myDiv = document.getElementById("myDiv");

//设置背景颜色
myDiv.style.backgroundColor = "red";

//改变大小
myDiv.style.width = "100px";
myDiv.style.height = "200px";

//指定边框
myDiv.style.border = "1px solid black";
```

在以这种方式改变样式时，元素的外观会自动被更新。

在标准模式下，所有度量值都必须指定一个度量单位。在混杂模式下，可以将style.width 设置为"20"，浏览器会假设它是"20px"；但在标准模式下，将 style.width 设置为"20"会导致被忽略——因为没有度量单位。在实践中，最好始终都指定度量单位。

通过 style 对象同样可以取得在 style 特性中指定的样式。以下面的 HTML 代码为例。

```
<div id="myDiv" style="background-color:blue; width:10px; height:25px"></div>
```

在 style 特性中指定的样式信息可以通过下列代码取得。

```
alert(myDiv.style.backgroundColor); //"blue"
alert(myDiv.style.width); //"10px"
alert(myDiv.style.height); //"25px"
```

如果没有为元素设置 style 特性，那么 style 对象中可能会包含一些默认的值，但这些值并不能准确地反映该元素的样式信息。

### 1. DOM 样式属性和方法

“DOM2级样式”规范还为 style 对象定义了一些属性和方法。这些属性和方法在提供元素的 style 特性值的同时，也可以修改样式。下面列出了这些属性和方法。

1. cssText：如前所述，通过它能够访问到 style 特性中的 CSS 代码。
2. length：应用给元素的 CSS 属性的数量。
3. parentRule：表示 CSS 信息的 CSSRule 对象。本节后面将讨论 CSSRule 类型。
4. getPropertyCSSValue(propertyName)：返回包含给定属性值的 CSSValue 对象。
5. getPropertyPriority(propertyName)：如果给定的属性使用了!important 设置，则返回"important"；否则，返回空字符串。
6. getPropertyValue(propertyName)：返回给定属性的字符串值。
7. item(index)：返回给定位置的 CSS 属性的名称。
8. removeProperty(propertyName)：从样式中删除给定属性。
9. setProperty(propertyName,value,priority)：将给定属性设置为相应的值，并加上优先权标志（"important"或者一个空字符串）。

通过 cssText 属性可以访问 style 特性中的 CSS代码。在读取模式下，cssText 返回浏览器对 style 特性中 CSS 代码的内部表示。在写入模式下，赋给 cssText 的值会重写整个 style 特性的值；也就是说，以前通过 style 特性指定的样式信息都将丢失。例如，如果通过 style 特性为元素设置了边框，然后再以不包含边框的规则重写 cssText，那么就会抹去元素上的边框。下面是使用 cssText 属性的一个例子。

```
myDiv.style.cssText = "width: 25px; height: 100px; background-color: green";
alert(myDiv.style.cssText);
```

设置 cssText 是为元素应用多项变化最快捷的方式，因为可以一次性地应用所有变化。

设计 length 属性的目的，就是将其与 item() 方法配套使用，以便迭代在元素中定义的 CSS 属性。在使用 length 和 item() 时，style 对象实际上就相当于一个集合，都可以使用方括号语法来代替 item() 来取得给定位置的 CSS 属性，如下面的例子所示。

```
for (var i=0, len=myDiv.style.length; i < len; i++){
 alert(myDiv.style[i]); //或者 myDiv.style.item(i)
}
```

无论是使用方括号语法还是使用 item()方法，都可以取得 CSS 属性名（"background-color"，不是"backgroundColor"）。然后，就可以在 getPropertyValue()中使用取得的属性名进一步取得属性的值，如下所示。

```
var prop, value, i, len;
for (i=0, len=myDiv.style.length; i < len; i++){
 prop = myDiv.style[i]; //或者 myDiv.style.item(i)
 value = myDiv.style.getPropertyValue(prop);
 alert(prop + " : " + value);
}
```

getPropertyValue() 方法取得的始终都是 CSS 属性值的字符串表示。如果你需要更多信息，可以使用 getPropertyCSSValue() 方法，它返回一个包含两个属性的 CSSValue 对象，这两个属性分别是：cssText 和 cssValueType。其中，cssText 属性的值与 getPropertyValue()返回的值相同，而 cssValueType 属性则是一个数值常量，表示值的类型：0 表示继承的值，1 表示基本的值，2 表示值列表，3 表示自定义的值。以下代码既输出 CSS 属性值，也输出值的类型。

```
var prop, value, i, len;
for (i=0, len=myDiv.style.length; i < len; i++){
 prop = myDiv.style[i]; //或者 myDiv.style.item(i)
 value = myDiv.style.getPropertyCSSValue(prop);
 alert(prop + " : " + value.cssText + " (" + value.cssValueType + ")");
}
```

在实际开发中，getPropertyCSSValue() 使用得比 getPropertyValue() 少得多。IE9+、Safarie 3+ 以及 Chrome 支持这个方法。Firefox 7 及之前版本也提供这个访问，但调用总返回 null。

要从元素的样式中移除某个 CSS 属性，需要使用 removeProperty() 方法。使用这个方法移除一个属性，意味着将会为该属性应用默认的样式（从其他样式表经层叠而来）。例如，要移除通过 style 特性设置的 border 属性，可以使用下面的代码。

```
myDiv.style.removeProperty("border");
```

在不确定某个给定的 CSS 属性拥有什么默认值的情况下，就可以使用这个方法。只要移除相应的属性，就可以为元素应用默认值。

除非另有说明，本节讨论的属性和方法都得到了 IE9+、Firefox、Safari、Opera 9+ 以及 Chrome 的支持。

### 2. 计算的样式

虽然 style 对象能够提供支持 style 特性的任何元素的样式信息，但它不包含那些从其他样式表层叠而来并影响到当前元素的样式信息。

“DOM2 级样式”增强了 document.defaultView，提供了 getComputedStyle() 方法。这个方法接受两个参数：要取得计算样式的元素和一个伪元素字符串（例如":after"）。如果不需要伪元素信息，第二个参数可以是 null。getComputedStyle() 方法返回一个 CSSStyleDeclaration 对象（与 style 属性的类型相同），其中包含当前元素的所有计算的样式。

以下面这个 HTML 页面为例。

```
<!DOCTYPE html>
<html>
<head>
 <title>Computed Styles Example</title>
 <style type="text/css">
 #myDiv {
 background-color: blue;
 width: 100px;
 height: 200px;
 }
 </style>
</head>
<body>
 <div id="myDiv" style="background-color: red; border: 1px solid black"></div>
</body>
</html>
```

应用给这个例子中 `<div>` 元素的样式一方面来自嵌入式样式表（`<style>` 元素中的样式），另一方面来自其 style 特性。但是，style 特性中设置了 backgroundColor 和 border，没有设置 width 和 height，后者是通过样式表规则应用的。以下代码可以取得这个元素计算后的样式。

```
var myDiv = document.getElementById("myDiv");
var computedStyle = document.defaultView.getComputedStyle(myDiv, null);
alert(computedStyle.backgroundColor); // "red"
alert(computedStyle.width); // "100px"
alert(computedStyle.height); // "200px"
alert(computedStyle.border); // 在某些浏览器中是"1px solid black"
```

在这个元素计算后的样式中，背景颜色的值是"red"，宽度值是"100px"，高度值是"200px"。我们注意到，背景颜色不是"blue"，因为这个样式在自身的 style 特性中已经被覆盖了。边框属性可能会也可能不会返回样式表中实际的 border 规则（Opera 会返回，但其他浏览器不会）。存在这个差别的原因是不同浏览器解释综合（rollup）属性（如 border）的方式不同，因为设置这种属性实际上会涉及很多其他属性。在设置 border 时，实际上是设置了四个边的边框宽度、颜色、样式属性（ border-left-width 、 border-top-color 、 border-bottom-style ，等等）。因此 ，即使computedStyle.border 不会在所有浏览器中都返回值，但 computedStyle.borderLeftWidth 会返回值。

需要注意的是，即使有些浏览器支持这种功能，但表示值的方式可能会有所区别。例如，Firefox 和 Safari 会将所有颜色转换成 RGB 格式（例如红色是 rgb(255,0,0)）。因此，在使用 getComputedStyle()方法时，最好多在几种浏览器中测试一下。

IE 不支持 getComputedStyle()方法，但它有一种类似的概念。在 IE 中，每个具有 style 属性的元素还有一个 currentStyle 属性。这个属性是 CSSStyleDeclaration 的实例，包含当前元素全部计算后的样式。取得这些样式的方式也差不多，如下面的例子所示。

```
var myDiv = document.getElementById("myDiv");
var computedStyle = myDiv.currentStyle;
alert(computedStyle.backgroundColor); //"red"
alert(computedStyle.width); //"100px"
alert(computedStyle.height); //"200px"
alert(computedStyle.border); //undefined
```

与 DOM 版本的方式一样，IE 也没有返回 border 样式，因为这是一个综合属性。

无论在哪个浏览器中，最重要的一条是要记住所有计算的样式都是只读的；不能修改计算后样式对象中的 CSS 属性。此外，计算后的样式也包含属于浏览器内部样式表的样式信息，因此任何具有默认值的 CSS 属性都会表现在计算后的样式中。例如，所有浏览器中的 visibility 属性都有一个默认值，但这个值会因实现而异。在默认情况下，有的浏览器将 visibility 属性设置为"visible"，而有的浏览器则将其设置为"inherit"。换句话说，不能指望某个 CSS 属性的默认值在不同浏览器中是相同的。如果你需要元素具有某个特定的默认值，应该手工在样式表中指定该值。

## 12.2.2 操作样式表

CSSStyleSheet 类型表示的是样式表，包括通过 `<link>` 元素包含的样式表和在 `<style>` 元素中定义的样式表。有读者可能记得，这两个元素本身分别是由 HTMLLinkElement 和 HTMLStyleElement 类型表示的。但是，CSSStyleSheet 类型相对更加通用一些，它只表示样式表，而不管这些样式表在 HTML 中是如何定义的。此外，上述两个针对元素的类型允许修改 HTML 特性，但 CSSStyleSheet 对象则是一套只读的接口（有一个属性例外）。使用下面的代码可以确定浏览器是否支持 DOM2 级样式表。

```
var supportsDOM2StyleSheets = document.implementation.hasFeature("StyleSheets", "2.0");
```

CSSStyleSheet 继承自 StyleSheet，后者可以作为一个基础接口来定义非 CSS 样式表。从 StyleSheet 接口继承而来的属性如下。

1. disabled：表示样式表是否被禁用的布尔值。这个属性是可读/写的，将这个值设置为 true 可以禁用样式表。
2. href：如果样式表是通过<link>包含的，则是样式表的 URL；否则，是 null。
3. media：当前样式表支持的所有媒体类型的集合。与所有 DOM 集合一样，这个集合也有一个length 属性和一个 item()方法。也可以使用方括号语法取得集合中特定的项。如果集合是空列表，表示样式表适用于所有媒体。在 IE 中，media 是一个反映 `<link>` 和 `<style>` 元素 media特性值的字符串。
4. ownerNode：指向拥有当前样式表的节点的指针，样式表可能是在 HTML 中通过 `<link>` 或 `<style/>` 引入的（在 XML 中可能是通过处理指令引入的）。如果当前样式表是其他样式表通过 @import 导入的，则这个属性值为 null。IE 不支持这个属性。
5. parentStyleSheet：在当前样式表是通过@import 导入的情况下，这个属性是一个指向导入它的样式表的指针。
6. title：ownerNode 中 title 属性的值。
7. type：表示样式表类型的字符串。对 CSS 样式表而言，这个字符串是"type/css"。除 了 disabled 属性之外，其他属性都是只读的。在支持以上所有这些属性的基础上，CSSStyleSheet 类型还支持下列属性和方法：
8. cssRules：样式表中包含的样式规则的集合。IE 不支持这个属性，但有一个类似的 rules 属性。
9. ownerRule：如果样式表是通过 @import 导入的，这个属性就是一个指针，指向表示导入的规则；否则，值为 null。IE 不支持这个属性。
10. deleteRule(index)：删除 cssRules 集合中指定位置的规则。IE 不支持这个方法，但支持一个类似的 removeRule()方法。
11. insertRule(rule,index)：向 cssRules 集合中指定的位置插入 rule 字符串。IE 不支持这个方法，但支持一个类似的 addRule() 方法。

应用于文档的所有样式表是通过 document.styleSheets 集合来表示的。通过这个集合的 length 属性可以获知文档中样式表的数量，而通过方括号语法或 item()方法可以访问每一个样式表。来看一个例子。

```
var sheet = null;
for (var i=0, len=document.styleSheets.length; i < len; i++){
 sheet = document.styleSheets[i];
 alert(sheet.href);
}
```

> 以上代码可以输出文档中使用的每一个样式表的 href 属性（`<style>` 元素包含的样式表没有 href 属性）。

不同浏览器的 document.styleSheets 返回的样式表也不同。所有浏览器都会包含 `<style>` 元素和 rel 特性被设置为"stylesheet"的 `<link>` 元素引入的样式表。IE 和 Opera 也包含 rel 特性被设置为"alternate stylesheet"的 `<link>` 元素引入的样式表。

也可以直接通过 `<link>` 或 `<style>` 元素取得 CSSStyleSheet 对象。DOM 规定了一个包含 CSSStyleSheet 对象的属性，名叫 sheet；除了 IE，其他浏览器都支持这个属性。IE 支持的是 styleSheet 属性。要想在不同浏览器中都能取得样式表对象，可以使用下列代码。

```
function getStyleSheet(element){
 return element.sheet || element.styleSheet;
}

//取得第一个<link/>元素引入的样式表
var link = document.getElementsByTagName("link")[0];
var sheet = getStylesheet(link);
```

这里的 getStyleSheet()返回的样式表对象与 document.styleSheets 集合中的样式表对象相同。

### 1. CSS 规则

CSSRule 对象表示样式表中的每一条规则。实际上，CSSRule 是一个供其他多种类型继承的基类型，其中最常见的就是 CSSStyleRule 类型，表示样式信息（其他规则还有@import、@font-face、@page 和@charset，但这些规则很少有必要通过脚本来访问）。CSSStyleRule 对象包含下列属性。

1. cssText：返回整条规则对应的文本。由于浏览器对样式表的内部处理方式不同，返回的文本可能会与样式表中实际的文本不一样；Safari 始终都会将文本转换成全部小写。IE 不支持这个属性。
2. parentRule：如果当前规则是导入的规则，这个属性引用的就是导入规则；否则，这个值为 null。IE 不支持这个属性。
3. parentStyleSheet：当前规则所属的样式表。IE 不支持这个属性。
4. selectorText：返回当前规则的选择符文本。由于浏览器对样式表的内部处理方式不同，返回的文本可能会与样式表中实际的文本不一样（例如，Safari 3 之前的版本始终会将文本转换成全部小写）。在 Firefox、Safari、Chrome 和 IE 中这个属性是只读的。Opera允许修改 selectorText。
5. style：一个 CSSStyleDeclaration 对象，可以通过它设置和取得规则中特定的样式值。
6. type：表示规则类型的常量值。对于样式规则，这个值是 1。IE 不支持这个属性。

其中三个最常用的属性是 cssText、selectorText 和 style。cssText 属性与 style.cssText 属性类似，但并不相同。前者包含选择符文本和围绕样式信息的花括号，后者只包含样式信息（类似于元素的 style.cssText）。此外，cssText 是只读的，而 style.cssText 也可以被重写。

大多数情况下，仅使用 style 属性就可以满足所有操作样式规则的需求了。这个对象就像每个元素上的 style 属性一样，可以通过它读取和修改规则中的样式信息。以下面的 CSS 规则为例。

```
div.box {
 background-color: blue;
 width: 100px;
 height: 200px;
}
```

假设这条规则位于页面中的第一个样式表中，而且这个样式表中只有这一条样式规则，那么通过下列代码可以取得这条规则的各种信息。

```
var sheet = document.styleSheets[0];
var rules = sheet.cssRules || sheet.rules; //取得规则列表
var rule = rules[0]; //取得第一条规则
alert(rule.selectorText); //"div.box"
alert(rule.style.cssText); //完整的 CSS 代码
alert(rule.style.backgroundColor); //"blue"
alert(rule.style.width); //"100px"
alert(rule.style.height); //"200px"
```

使用这种方式，可以像确定元素的行内样式信息一样，确定与规则相关的样式信息。与使用元素的方式一样，在这种方式下也可以修改样式信息，如下面的例子所示。

```
var sheet = document.styleSheets[0];
var rules = sheet.cssRules || sheet.rules; //取得规则列表
var rule = rules[0]; //取得第一条规则
rule.style.backgroundColor = "red"
```

必须要注意的是，以这种方式修改规则会影响页面中适用于该规则的所有元素。换句话说，如果有两个带有 box 类的 `<div>` 元素，那么这两个元素都会应用修改后的样式。

### 2. 创建规则

DOM 规定，要向现有样式表中添加新规则，需要使用 insertRule()方法。这个方法接受两个参数：规则文本和表示在哪里插入规则的索引。下面是一个例子。

```
sheet.insertRule("body { background-color: silver }", 0); //DOM 方法
```

这个例子插入的规则会改变元素的背景颜色。插入的规则将成为样式表中的第一条规则（插入到了位置 0）——规则的次序在确定层叠之后应用到文档的规则时至关重要。Firefox、Safari、Opera 和 Chrome 都支持 insertRule() 方法。

IE8 及更早版本支持一个类似的方法，名叫 addRule()，也接收两必选参数：选择符文本和 CSS 样式信息；一个可选参数：插入规则的位置。在 IE 中插入与前面例子相同的规则，可使用如下代码。

```
sheet.addRule("body", "background-color: silver", 0); //仅对 IE 有效
```

有关这个方法的规定中说，最多可以使用 addRule()添加 4 095 条样式规则。超出这个上限的调用将会导致错误。

要以跨浏览器的方式向样式表中插入规则，可以使用下面的函数。这个函数接受 4 个参数：要向其中添加规则的样式表以及与 addRule()相同的 3 个参数，如下所示。

```
function insertRule(sheet, selectorText, cssText, position){
 if (sheet.insertRule){
 sheet.insertRule(selectorText + "{" + cssText + "}", position);
 } else if (sheet.addRule){
 sheet.addRule(selectorText, cssText, position);
 }
}
```

下面是调用这个函数的示例代码。

```
insertRule(document.styleSheets[0], "body", "background-color: silver", 0);
```

虽然可以像这样来添加规则，但随着要添加规则的增多，这种方法就会变得非常繁琐。因此，如果要添加的规则非常多，我们建议还是采用第 10 章介绍过的动态加载样式表的技术。

### 3. 删除规则

从样式表中删除规则的方法是 deleteRule()，这个方法接受一个参数：要删除的规则的位置。例如，要删除样式表中的第一条规则，可以使用以下代码。

```
sheet.deleteRule(0); //DOM 方法
```

IE 支持的类似方法叫 removeRule()，使用方法相同，如下所示：

```
sheet.removeRule(0); //仅对 IE 有效
```

下面是一个能够跨浏览器删除规则的函数。第一个参数是要操作的样式表，第二个参数是要删除的规则的索引。

```
function deleteRule(sheet, index){
 if (sheet.deleteRule){
 sheet.deleteRule(index);
 } else if (sheet.removeRule){
 sheet.removeRule(index);
 }
}
```

调用这个函数的方式如下。

```
deleteRule(document.styleSheets[0], 0);
```

与添加规则相似，删除规则也不是实际 Web 开发中常见的做法。考虑到删除规则可能会影响 CSS层叠的效果，因此请大家慎重使用。

## 12.2.3 元素大小

本节介绍的属性和方法并不属于“DOM2 级样式”规范，但却与 HTML 元素的样式息息相关。DOM 中没有规定如何确定页面中元素的大小。IE 为此率先引入了一些属性，以便开发人员使用。目前，所有主要的浏览器都已经支持这些属性。

### 1. 偏移量

首先要介绍的属性涉及偏移量（offset dimension），包括元素在屏幕上占用的所有可见的空间。元素的可见大小由其高度、宽度决定，包括所有内边距、滚动条和边框大小（注意，不包括外边距）。通过下列 4 个属性可以取得元素的偏移量。

1. offsetHeight：元素在垂直方向上占用的空间大小，以像素计。包括元素的高度、（可见的）水平滚动条的高度、上边框高度和下边框高度。
2. offsetWidth：元素在水平方向上占用的空间大小，以像素计。包括元素的宽度、（可见的）垂直滚动条的宽度、左边框宽度和右边框宽度。
3. offsetLeft：元素的左外边框至包含元素的左内边框之间的像素距离。
4. offsetTop：元素的上外边框至包含元素的上内边框之间的像素距离。

其中，offsetLeft 和 offsetTop 属性与包含元素有关，包含元素的引用保存在 offsetParent属性中。offsetParent 属性不一定与 parentNode 的值相等。例如，`<td>` 元素的 offsetParent 是作为其祖先元素的 `<table>` 元素，因为 `<table>` 是在 DOM 层次中距 `<td>` 最近的一个具有大小的元素。

要想知道某个元素在页面上的偏移量，将这个元素的 offsetLeft 和 offsetTop 与其 offsetParent 的相同属性相加，如此循环直至根元素，就可以得到一个基本准确的值。以下两个函数就可以用于分别取得元素的左和上偏移量。

```
function getElementLeft(element){
 var actualLeft = element.offsetLeft;
 var current = element.offsetParent;
 while (current !== null){
 actualLeft += current.offsetLeft;
 current = current.offsetParent;
 }
 return actualLeft;
}
function getElementTop(element){
 var actualTop = element.offsetTop;
 var current = element.offsetParent;
 while (current !== null){
 actualTop += current. offsetTop;
 current = current.offsetParent;
 }
 return actualTop;
}
```

这两个函数利用 offsetParent 属性在 DOM 层次中逐级向上回溯，将每个层次中的偏移量属性合计到一块。对于简单的 CSS 布局的页面，这两函数可以得到非常精确的结果。对于使用表格和内嵌框架布局的页面，由于不同浏览器实现这些元素的方式不同，因此得到的值就不太精确了。一般来说，页面中的所有元素都会被包含在几个 `<div>` 元素中，而这些 `<div>` 元素的 offsetParent 又是 `<body>` 元素，所以 getElementLeft() 与 getElementTop() 会返回与 offsetLeft 和 offsetTop 相同的值。

所有这些偏移量属性都是只读的，而且每次访问它们都需要重新计算。因此，应该尽量避免重复访问这些属性；如果需要重复使用其中某些属性的值，可以将它们保存在局部变量中，以提高性能。

### 2. 客户区大小
元素的客户区大小（client dimension），指的是元素内容及其内边距所占据的空间大小。有关客户区大小的属性有两个：clientWidth 和 clientHeight。其中，clientWidth 属性是元素内容区宽度加上左右内边距宽度；clientHeight 属性是元素内容区高度加上上下内边距高度。

从字面上看，客户区大小就是元素内部的空间大小，因此滚动条占用的空间不计算在内。最常用到
这些属性的情况，就是像第 8 章讨论的确定浏览器视口大小的时候。如下面的例子所示，要确定浏览器
视口大小，可以使用 document.documentElement 或 document.body（在 IE7 之前的版本中）的
clientWidth 和 clientHeight。
function getViewport(){
 if (document.compatMode == "BackCompat"){
 return {
 width: document.body.clientWidth,
 height: document.body.clientHeight
 };
 } else {
 return {
 width: document.documentElement.clientWidth,
 height: document.documentElement.clientHeight
 };
 }
}
这个函数首先检查 document.compatMode 属性，以确定浏览器是否运行在混杂模式。Safari 3.1
之前的版本不支持这个属性，因此就会自动执行 else 语句。Chrome、Opera 和 Firefox 大多数情况下都
运行在标准模式下，因此它们也会前进到 else 语句。这个函数会返回一个对象，包含两个属性：width
和 height；表示浏览器视口（<html>或<body>元素）的大小。
与偏移量相似，客户区大小也是只读的，也是每次访问都要重新计算的。

### 3. 滚动大小

最后要介绍的是滚动大小（scroll dimension），指的是包含滚动内容的元素的大小。有些元素（例如 `<html>` 元素），即使没有执行任何代码也能自动地添加滚动条；但另外一些元素，则需要通过 CSS 的 overflow 属性进行设置才能滚动。以下是 4 个与滚动大小相关的属性。

1. scrollHeight：在没有滚动条的情况下，元素内容的总高度。
2. scrollWidth：在没有滚动条的情况下，元素内容的总宽度。
3. scrollLeft：被隐藏在内容区域左侧的像素数。通过设置这个属性可以改变元素的滚动位置。
4. scrollTop：被隐藏在内容区域上方的像素数。通过设置这个属性可以改变元素的滚动位置。

scrollWidth 和 scrollHeight 主要用于确定元素内容的实际大小。例如，通常认为 `<html>` 元素是在 Web 浏览器的视口中滚动的元素（IE6 之前版本运行在混杂模式下时是 `<body>` 元素）。因此，带有垂直滚动条的页面总高度就是 document.documentElement.scrollHeight。

对于不包含滚动条的页面而言， scrollWidth 和 scrollHeight 与 clientWidth 和 clientHeight 之间的关系并不十分清晰。在这种情况下，基于 document.documentElement 查看这些属性会在不同浏览器间发现一些不一致性问题，如下所述。

1. Firefox 中这两组属性始终都是相等的，但大小代表的是文档内容区域的实际尺寸，而非视口的尺寸。
2. Opera、Safari 3.1 及更高版本、Chrome 中的这两组属性是有差别的，其中 scrollWidth 和 scrollHeight 等于视口大小，而 clientWidth 和 clientHeight 等于文档内容区域的大小。
3. IE（在标准模式）中的这两组属性不相等，其中 scrollWidth 和 scrollHeight 等于文档内容区域的大小，而 clientWidth 和 clientHeight 等于视口大小。

在确定文档的总高度时（包括基于视口的最小高度时），必须取得 scrollWidth/clientWidth 和 scrollHeight/clientHeight 中的最大值，才能保证在跨浏览器的环境下得到精确的结果。下面就是这样一个例子。

```
var docHeight = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight);
var docWidth = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth);
```

注意，对于运行在混杂模式下的 IE，则需要用 document.body 代替 document.documentElement。通过 scrollLeft 和 scrollTop 属性既可以确定元素当前滚动的状态，也可以设置元素的滚动位置。在元素尚未被滚动时，这两个属性的值都等于 0。

如果元素被垂直滚动了，那么 scrollTop 的值会大于 0，且表示元素上方不可见内容的像素高度。如果元素被水平滚动了，那么 scrollLeft 的值会大于 0，且表示元素左侧不可见内容的像素宽度。这两个属性都是可以设置的，因此将元素的 scrollLeft 和 scrollTop 设置为 0，就可以重置元素的滚动位置。下面这个函数会检测元素是否位于顶部，如果不是就将其回滚到顶部。

```
function scrollToTop(element){
 if (element.scrollTop != 0){
 element.scrollTop = 0;
 }
}
```

这个函数既取得了 scrollTop 的值，也设置了它的值。

### 4. 确定元素大小

IE、Firefox 3+、Safari 4+、Opera 9.5及 Chrome为每个元素都提供了一个 getBoundingClientRect()方法。这个方法返回会一个矩形对象，包含 4 个属性：left、top、right 和 bottom。这些属性给出了元素在页面中相对于视口的位置。但是，浏览器的实现稍有不同。IE8 及更早版本认为文档的左上角坐标是(2, 2)，而其他浏览器包括 IE9 则将传统的(0,0)作为起点坐标。因此，就需要在一开始检查一下位于(0,0)处的元素的位置，在 IE8 及更早版本中，会返回(2,2)，而在其他浏览器中会返回(0,0)。来看下面的函数：

```
function getBoundingClientRect(element){
 if (typeof arguments.callee.offset != "number"){
 var scrollTop = document.documentElement.scrollTop;
 var temp = document.createElement("div");
 temp.style.cssText = "position:absolute;left:0;top:0;";
 document.body.appendChild(temp);
 arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop;
 document.body.removeChild(temp);
 temp = null;
 }
 var rect = element.getBoundingClientRect();
 var offset = arguments.callee.offset;
 return {
 left: rect.left + offset,
 right: rect.right + offset,
 top: rect.top + offset,
 bottom: rect.bottom + offset
 };
}
```

这个函数使用了它自身的属性来确定是否要对坐标进行调整。第一步是检测属性是否有定义，如果没有就定义一个。最终的 offset 会被设置为新元素上坐标的负值，实际上就是在 IE 中设置为 -2，在 Firefox 和 Opera 中设置为 -0。为此，需要创建一个临时的元素，将其位置设置在(0,0)，然后再调用其 getBoundingClientRect()。而之所以要减去视口的 scrollTop，是为了防止调用这个函数时窗口被滚动了。这样编写代码，就无需每次调用这个函数都执行两次 getBoundingClientRect()了。接下来，再在传入的元素上调用这个方法并基于新的计算公式创建一个对象。

对于不支持 getBoundingClientRect() 的浏览器，可以通过其他手段取得相同的信息。一般来说，right 和 left 的差值与 offsetWidth 的值相等，而 bottom 和 top 的差值与 offsetHeight 相等。而且，left 和 top 属性大致等于使用本章前面定义的 getElementLeft() 和 getElementTop() 函数取得的值。综合上述，就可以创建出下面这个跨浏览器的函数：

```
function getBoundingClientRect(element){
 var scrollTop = document.documentElement.scrollTop;
 var scrollLeft = document.documentElement.scrollLeft;

 if (element.getBoundingClientRect){
 if (typeof arguments.callee.offset != "number"){
 var temp = document.createElement("div");
 temp.style.cssText = "position:absolute;left:0;top:0;";
 document.body.appendChild(temp);
 arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop;
 document.body.removeChild(temp);
 temp = null;
 }
 var rect = element.getBoundingClientRect();
 var offset = arguments.callee.offset;
 return {
 left: rect.left + offset,
 right: rect.right + offset,
 top: rect.top + offset,
 bottom: rect.bottom + offset
 };
 } else {
 var actualLeft = getElementLeft(element);
 var actualTop = getElementTop(element);
 return {
 left: actualLeft - scrollLeft,
 right: actualLeft + element.offsetWidth - scrollLeft,
 top: actualTop - scrollTop,
 bottom: actualTop + element.offsetHeight - scrollTop
 }
 }
}
```

这个函数在 getBoundingClientRect() 有效时，就使用这个原生方法，而在这个方法无效时则使用默认的计算公式。在某些情况下，这个函数返回的值可能会有所不同，例如使用表格布局或使用滚动元素的情况下。

由于这里使用了 arguments.callee，所以这个方法不能在严格模式下使用。
