# 内容涵盖

1. location 对象
    1. 查询字符串参数
    2. 位置操作
2. navigator 对象
    1. 检测插件
    2. 注册处理程序
3. screen 对象
4. history 对象
5. 第八章 小结

# 8.2 location 对象

**location 是最有用的 BOM 对象之一，它提供了与当前窗口中加载的文档有关的信息，还提供了一些导航功能。事实上，location 对象是很特别的一个对象，因为它既是 window 对象的属性，也是 document 对象的属性；换句话说，window.location 和 document.location 引用的是同一个对象**。

location 对象的用处不只表现在它保存着当前文档的信息，还表现在它将 URL 解析为独立的片段，让开发人员可以通过不同的属性访问这些片段。下表列出了 location 对象的所有属性（注：省略了每个属性前面的 location 前缀）。

| 属 性 名 | 例 子 | 说 明 |
| ------- | --- | ----  |
| hash | "#contents" | 返回URL中的hash（#号后跟零或多个字符），如果URL中不包含散列，则返回空字符串 |
| host | "www.wrox.com:80" | 返回服务器名称和端口号（如果有） |
| hostname | "www.wrox.com" | 返回不带端口号的服务器名称 |
| href | "http:/www.wrox.com" | 返回当前加载页面的完整URL。而location对象的 toString() 方法也返回这个值 |
| pathname | "/WileyCDA/" | 返回URL中的目录和（或）文件名 |
| port | "8080" | 返回URL中指定的端口号。如果URL中不包含端口号，则这个属性返回空字符串 |
| protocol | "http:" | 返回页面使用的协议。通常是http:或https: |
| search | "?q=javascript" | 返回URL的查询字符串。这个字符串以问号开头 |

## 8.2.1 查询字符串参数

虽然通过上面的属性可以访问到 location 对象的大多数信息，但其中访问 URL 包含的查询字符串的属性并不方便。

尽管 location.search 返回从问号到 URL 末尾的所有内容，但却没有办法逐个访问其中的每个查询字符串参数。为此，可以像下面这样创建一个函数，用以解析查询字符串，然后返回包含所有参数的一个对象：

```
function getQueryStringArgs(){
 //取得查询字符串并去掉开头的问号
 var qs = (location.search.length > 0 ? location.search.substring(1) : ""),

 //保存数据的对象
 args = {},

 //取得每一项
 items = qs.length ? qs.split("&") : [],
 item = null,
 name = null,
 value = null,
 //在 for 循环中使用
 i = 0,
 len = items.length;
 //逐个将每一项添加到 args 对象中
 for (i=0; i < len; i++){
 item = items[i].split("=");
 name = decodeURIComponent(item[0]);
 value = decodeURIComponent(item[1]);
 if (name.length) {
 args[name] = value;
 }
 }

 return args;
}
```

> 这个函数的第一步是先去掉查询字符串开头的问号。当然，前提是 location.search 中必须要包含一或多个字符。然后，所有参数将被保存在 args 对象中，该对象以字面量形式创建。接下来，根据和号（&）来分割查询字符串，并返回 name=value 格式的字符串数组。下面的 for 循环会迭代这个数组，然后再根据等于号分割每一项，从而返回第一项为参数名，第二项为参数值的数组。再使用 decodeURIComponent() 分别解码 name 和 value（因为查询字符串应该是被编码过的）。最后，将 name 作为 args 对象的属性，将 value 作为相应属性的值。

下面给出了使用这个函数的示例。

```
//假设查询字符串是?q=javascript&num=10
var args = getQueryStringArgs();
alert(args["q"]); //"javascript"
alert(args["num"]); //"10"
```

> 可见，每个查询字符串参数都成了返回对象的属性。这样就极大地方便了对每个参数的访问。

## 8.2.2 位置操作

使用 location 对象可以通过很多方式来改变浏览器的位置。

首先，也是最常用的方式，就是使用 **assign() 方法并为其传递一个 URL**，如下所示。

```
location.assign("http://www.wrox.com");
```

> 这样，就可以立即打开新 URL 并在浏览器的历史记录中生成一条记录。

**如果是将 location.href 或 window.location 设置为一个 URL 值，也会以该值调用 assign() 方法**。例如，下列两行代码与显式调用 assign() 方法的效果完全一样。

```
window.location = "http://www.wrox.com";
location.href = "http://www.wrox.com";
```

**在这些改变浏览器位置的方法中，最常用的是设置 location.href 属性**。

另外，修改location对象的其他属性也可以改变当前加载的页面。下面的例子展示了通过将hash、search、hostname、pathname 和 port 属性设置为新值来改变 URL。

```
//假设初始 URL 为 http://www.wrox.com/WileyCDA/

//将 URL 修改为"http://www.wrox.com/WileyCDA/#section1"
location.hash = "#section1";

//将 URL 修改为"http://www.wrox.com/WileyCDA/?q=javascript"
location.search = "?q=javascript";

//将 URL 修改为"http://www.yahoo.com/WileyCDA/"
location.hostname = "www.yahoo.com";

//将 URL 修改为"http://www.yahoo.com/mydir/"
location.pathname = "mydir";

//将 URL 修改为"http://www.yahoo.com:8080/WileyCDA/"
location.port = 8080;
```

**每次修改 location 的属性（hash 除外），页面都会以新 URL 重新加载**。

在 IE8、Firefox 1、Safari 2+、Opera 9+和 Chrome 中，修改 hash 的值会在浏览器的历史记录中生成一条新记录。在 IE 的早期版本中，hash 属性不会在用户单击“后退”和“前进”按钮时被更新，而只会在用户单击包含 hash 的 URL 时才会被更新。

**当通过上述任何一种方式修改 URL 之后，浏览器的历史记录中就会生成一条新记录，因此用户通过单击“后退”按钮都会导航到前一个页面。要禁用这种行为，可以使用 replace() 方法**。这个方法只接受一个参数，即要导航到的 URL；结果虽然会导致浏览器位置改变，但不会在历史记录中生成新记录。在调用 replace() 方法之后，用户不能回到前一个页面，来看下面的例子：


```
<!DOCTYPE html>
<html>
<head>
 <title>You won't be able to get back here</title>
</head>
 <body>
 <p>Enjoy this page for a second, because you won't be coming back here.</p>
 <script type="text/javascript">
 setTimeout(function () {
 location.replace("http://www.wrox.com/");
 }, 1000);
 </script>
</body>
</html>
```

> 如果将这个页面加载到浏览器中，浏览器就会在 1 秒钟后重新定向到 www.wrox.com。然后，“后退”按钮将处于禁用状态，如果不重新输入完整的 URL，则无法返回示例页面。

与位置有关的最后一个方法是 **reload()，作用是重新加载当前显示的页面**。

如果调用 reload() 时不传递任何参数，页面就会以最有效的方式重新加载。也就是说，如果页面自上次请求以来并没有改变过，页面就会从浏览器缓存中重新加载。如果要强制从服务器重新加载，则需要像下面这样为该方法传递参数 true。

```
location.reload(); //重新加载（有可能从缓存中加载）
location.reload(true); //重新加载（从服务器重新加载）
```

位于 reload() 调用之后的代码可能会也可能不会执行，这要取决于网络延迟或系统资源等因素。为此，**最好将 reload() 放在代码的最后一行**。

# 8.3 navigation 对象

最早由 Netscape Navigator 2.0 引入的 navigator 对象，现在已经成为识别客户端浏览器的事实标准。虽然其他浏览器也通过其他方式提供了相同或相似的信息（例如，IE 中的 window.clientInformation 和 Opera 中的 window.opera），但 navigator 对象却是所有支持 JavaScript 的浏览器所共有的。与其他 BOM 对象的情况一样，每个浏览器中的 navigator 对象也都有一套自己的属性。下表列出了存在于所有浏览器中的属性和方法，以及支持它们的浏览器版本。

| 属性或方法 | 说 明 | IE | Firefox | Safari/Chrome | Opera  |
| --------- | ----- | --  | ------  | ------------  | ----- |
| appCodeName | 浏览器的名称。通常都是Mozilla，即使在非Mozilla浏览器中也是如此 | 3.0+ | 1.0+ | 1.0+ | 7.0+ |
| appMinorVersion | 次版本信息 | 4.0+ | － | － | 9.5+ |
| appName | 完整的浏览器名称 | 3.0+ | 1.0+ | 1.0+ | 7.0+ |
| appVersion | 浏览器的版本。一般不与实际的浏览器版本对应 | 3.0+ | 1.0+ | 1.0+ | 7.0+ |
| buildID | 浏览器编译版本 | － | 2.0+ | － | － |
| cookieEnabled | 表示cookie是否启用 | 4.0+ | 1.0+ | 1.0+ | 7.0+ |
| cpuClass | 客户端计算机中使用的CPU类型（x86、68K、Alpha、PPC或Other） | 4.0+ | － | － | － |
| javaEnabled() | 表示当前浏览器中是否启用了Java | 4.0+ | 1.0+ | 1.0+ | 7.0+ |
| language | 浏览器的主语言 | － | 1.0+ | 1.0+ | 7.0+ |
| mimeTypes | 在浏览器中注册的MIME类型数组 | 4.0+ | 1.0+ | 1.0+ | 7.0+ |
| onLine | 表示浏览器是否连接到了因特网 | 4.0+ | 1.0+ | － | 9.5+ |
| opsProfile | 似乎早就不用了。查不到相关文档 | 4.0+ | － | － | － |
| oscpu | 客户端计算机的操作系统或使用的CPU | － | 1.0+ | － | － |
| platform | 浏览器所在的系统平台 | 4.0+ | 1.0+ | 1.0+ | 7.0+ |
| plugins | 浏览器中安装的插件信息的数组 | 4.0+ | 1.0+ | 1.0+ | 7.0+ |
| preference() | 设置用户的首选项 | － | 1.5+ | － | － |
| product | 产品名称（如 Gecko）| － | 1.0+ | 1.0+ | － |
| productSub | 关于产品的次要信息（如Gecko的版本） | － | 1.0+ | 1.0+ | － |
| registerContentHandler()  | 针对特定的MIME类型将一个站点注册为处理程序 | － | 2.0+ | － | － |
| registerProtocolHandler() | 针对特定的协议将一个站点注册为处理程序 | － | 2.0 | － | － |
| securityPolicy | 已经废弃。安全策略的名称。为了与Netscape Navigator 4向后兼容而保留下来 | － | 1.0+ | － | － |
| systemLanguage | 操作系统的语言 | 4.0+ | － | － | － |
| taintEnabled() | 已经废弃。表示是否允许变量被修改（taint）。为了与Netscape Navigator 3向后兼容而保留下来 | 4.0+ | 1.0+ | － | 7.0+ |
| userAgent | 浏览器的用户代理字符串 | 3.0+ | 1.0+ | 1.0+ | 7.0+ |
| userLanguage | 操作系统的默认语言 | 4.0+ | － | － | 7.0+ |
| userProfile | 借以访问用户个人信息的对象 | 4.0+ | － | － | － |
| vendor | 浏览器的品牌 | － | 1.0+ | 1.0+ | － |
| vendorSub | 有关供应商的次要信息 | － | 1.0+ | 1.0+ | － |

表中的这些 navigator 对象的属性通常用于检测显示网页的浏览器类型（第 9 章会详细讨论）。

## 8.3.1 检测插件

检测浏览器中是否安装了特定的插件是一种最常见的检测例程。对于非 IE 浏览器，可以使用 plugins 数组来达到这个目的。该数组中的每一项都包含下列属性。

1. name：插件的名字。
2. description：插件的描述。
3. filename：插件的文件名。
4. length：插件所处理的 MIME 类型数量。

一般来说，name 属性中会包含检测插件必需的所有信息，但有时候也不完全如此。在检测插件时，需要像下面这样循环迭代每个插件并将插件的 name 与给定的名字进行比较。

```
//检测插件（在 IE 中无效）
function hasPlugin(name){
 name = name.toLowerCase();
 for (var i=0; i < navigator.plugins.length; i++){
 if (navigator. plugins [i].name.toLowerCase().indexOf(name) > -1){
 return true;
 }
 }
 return false;
}

//检测 Flash
alert(hasPlugin("Flash"));

//检测 QuickTime
alert(hasPlugin("QuickTime"));
```

> 这个 hasPlugin() 函数接受一个参数：要检测的插件名。第一步是将传入的名称转换为小写形式，以便于比较。然后，迭代 plugins 数组，通过 indexOf() 检测每个 name 属性，以确定传入的名称是否出现在字符串的某个地方。比较的字符串都使用小写形式可以避免因大小写不一致导致的错误。而传入的参数应该尽可能具体，以避免混淆。应该说，像 Flash 和 QuickTime 这样的字符串就比较具体了，不容易导致混淆。在 Firefox、Safari、Opera 和 Chrome 中可以使用这种方法来检测插件。

**每个插件对象本身也是一个 MimeType 对象的数组，这些对象可以通过方括号语法来访问**。每个 MimeType 对象有 4 个属性：包含 MIME 类型描述的 description、回指插件对象的 enabledPlugin、表示与 MIME 类型对应的文件扩展名的字符串 suffixes（以逗号分隔）和表示完整 MIME 类型字符串的 type。

检测 IE 中的插件比较麻烦，因为 IE 不支持 Netscape 式的插件。**在 IE 中检测插件的唯一方式就是使用专有的 ActiveXObject 类型，并尝试创建一个特定插件的实例**。

IE 是以 COM 对象的方式实现插件的，而 COM 对象使用唯一标识符来标识。因此，要想检查特定的插件，就必须知道其 COM 标识符。

例如，Flash 的标识符是 ShockwaveFlash.ShockwaveFlash。知道唯一标识符之后，就可以编写类似下面的函数来检测 IE 中是否安装相应插件了。

```
//检测 IE 中的插件
function hasIEPlugin(name){
 try {
 new ActiveXObject(name);
 return true;
 } catch (ex){
 return false;
 }
}

//检测 Flash
alert(hasIEPlugin("ShockwaveFlash.ShockwaveFlash"));

//检测 QuickTime
alert(hasIEPlugin("QuickTime.QuickTime"));
```

> 在这个例子中，函数 hasIEPlugin()只接收一个 COM 标识符作为参数。在函数内部，首先会尝试创建一个 COM 对象的实例。之所以要在 try-catch 语句中进行实例化，是因为创建未知 COM 对象会导致抛出错误。这样，如果实例化成功，则函数返回 true；否则，如果抛出了错误，则执行 catch块，结果就会返回 false。例子最后检测 IE 中是否安装了 Flash 和 QuickTime 插件。

鉴于检测这两种插件的方法差别太大，因此典型的做法是针对每个插件分别创建检测函数，而不是使用前面介绍的通用检测方法。来看下面的例子。

```
//检测所有浏览器中的 Flash
function hasFlash(){
 var result = hasPlugin("Flash");
 if (!result){
 result = hasIEPlugin("ShockwaveFlash.ShockwaveFlash");
 }
 return result;
}

//检测所有浏览器中的 QuickTime
function hasQuickTime(){
 var result = hasPlugin("QuickTime");
 if (!result){
 result = hasIEPlugin("QuickTime.QuickTime");
 }
 return result;
}

//检测 Flash
alert(hasFlash());

//检测 QuickTime
alert(hasQuickTime());
```

> 上面代码中定义了两个函数：hasFlash()和 hasQuickTime()。每个函数都是先尝试使用不针对 IE 的插件检测方法。如果返回了 false（在 IE 中会这样），那么再使用针对 IE 的插件检测方法。如果 IE 的插件检测方法再返回 false，则整个方法也将返回 false。只要任何一次检测返回 true，整个方法都会返回 true。

**plugins 集合有一个名叫 refresh() 的方法，用于刷新 plugins 以反映最新安装的插件**。这个方法接收一个参数：表示是否应该重新加载页面的一个布尔值。如果将这个值设置为 true，则会重新加载包含插件的所有页面；否则，只更新 plugins 集合，不重新加载页面。

## 8.3.2 注册处理程序

Firefox 2为 navigator 对象新增了 registerContentHandler() 和 registerProtocolHandler() 方法（这两个方法是在 HTML5 中定义的，相关内容将在第 22 章讨论）。这两个方法可以让一个站点指明它可以处理特定类型的信息。

随着 RSS 阅读器和在线电子邮件程序的兴起，注册处理程序就为像使用桌面应用程序一样默认使用这些在线应用程序提供了一种方式。

其中，**registerContentHandler() 方法接收三个参数：要处理的 MIME 类型、可以处理该 MIME 类型的页面的 URL 以及应用程序的名称**。举个例子，要将一个站点注册为处理 RSS 源的处理程序，可以使用如下代码。

```
navigator.registerContentHandler("application/rss+xml", "http://www.somereader.com?feed=%s", "Some Reader");
```

> 第一个参数是 RSS 源的 MIME 类型。第二个参数是应该接收 RSS 源 URL 的 URL，其中的 %s 表示 RSS 源 URL，由浏览器自动插入。当下一次请求 RSS 源时，浏览器就会打开指定的 URL，而相应的 Web 应用程序将以适当方式来处理该请求。

Firefox 4 及之前版本只允许在 registerContentHandler() 方法中使用三个MIME 类型：application/rss+xml、application/atom+xml 和 application/vnd.mozilla.maybe. feed。这三个 MIME 类型的作用都一样，即为 RSS 或 ATOM 新闻源（feed）注册处理程序。

类似的调用方式也适用于 **registerProtocolHandler() 方法，它也接收三个参数：要处理的协议（例如，mailto 或 ftp）、处理该协议的页面的 URL 和应用程序的名称**。例如，要想将一个应用程序注册为默认的邮件客户端，可以使用如下代码。

```
navigator.registerProtocolHandler("mailto", "http://www.somemailclient.com?cmd=%s", "Some Mail Client");
```

> 这个例子注册了一个 mailto 协议的处理程序，该程序指向一个基于 Web 的电子邮件客户端。同样，第二个参数仍然是处理相应请求的 URL，而%s 则表示原始的请求。

Firefox 2 虽然实现了 registerProtocolHandler()，但该方法还不能用。Firefox 3 完整实现这个方法。

# 8.4 screen 对象

JavaScript 中有几个对象在编程中用处不大，而 screen 对象就是其中之一。screen 对象基本上只用来表明客户端的能力，其中包括浏览器窗口外部的显示器的信息，如像素宽度和高度等。每个浏览器中的 screen 对象都包含着各不相同的属性，下表列出了所有属性及支持相应属性的浏览器。

| 属 性 | 说 明 | IE | Firefox | Safari/Chrome | Opera |
| ----  | --- | - | --- | ---------- | ----- |
| availHeight | 屏幕的像素高度减系统部件高度之后的值（只读） | Y | Y | Y | Y |
| availLeft | 未被系统部件占用的最左侧的像素值（只读） |  | Y | Y |  |
| availTop | 未被系统部件占用的最上方的像素值（只读） |  | Y | Y |  |
| availWidth | 屏幕的像素宽度减系统部件宽度之后的值（只读） | Y | Y | Y | Y |
| bufferDepth | 读、写用于呈现屏外位图的位数 | Y |  |  |  |
| colorDepth | 用于表现颜色的位数；多数系统都是32（只读） | Y | Y | Y | Y |
| deviceXDPI | 屏幕实际的水平DPI（只读） | Y |  |  |  |
| deviceYDPI | 屏幕实际的垂直DPI（只读） | Y |  |  |  |
| fontSmoothingEnabled | 表示是否启用了字体平滑（只读） | Y |  |  |  |
| height | 屏幕的像素高度 | Y | Y | Y | Y |
| left | 当前屏幕距左边的像素距离 |  | Y |  |  |
| logicalXDPI | 屏幕逻辑的水平DPI（只读） | Y |  |  |  |
| logicalYDPI | 屏幕逻辑的垂直DPI（只读） | Y |  |  |  |
| pixelDepth | 屏幕的位深（只读） |  | Y | Y | Y |
| top | 当前屏幕距上边的像素距离 |  | Y |  |  |
| updateInterval | 读、写以毫秒表示的屏幕刷新时间间隔 | Y |  |  |  |
| width | 屏幕的像素宽度 | Y | Y | Y | Y |

这些信息经常集中出现在测定客户端能力的站点跟踪工具中，但通常不会用于影响功能。不过，有时候也可能会用到其中的信息来调整浏览器窗口大小，使其占据屏幕的可用空间，例如：`window.resizeTo(screen.availWidth, screen.availHeight)`;前面曾经提到过，许多浏览器都会禁用调整浏览器窗口大小的能力，因此上面这行代码不一定在所有环境下都有效。

涉及移动设备的屏幕大小时，情况有点不一样。运行 iOS 的设备始终会像是把设备竖着拿在手里一样，因此返回的值是 768×1024。而 Android 设备则会相应调用 screen.width 和 screen.height 的值。

# 8.5 history 对象

history 对象保存着用户上网的历史记录，从窗口被打开的那一刻算起。因为 history 是 window 对象的属性，因此每个浏览器窗口、每个标签页乃至每个框架，都有自己的 history 对象与特定的 window 对象关联。出于安全方面的考虑，开发人员无法得知用户浏览过的 URL。不过，借由用户访问过的页面列表，同样可以在不知道实际 URL 的情况下实现后退和前进。

**使用 go() 方法可以在用户的历史记录中任意跳转，可以向后也可以向前**。

**这个方法接受一个参数，表示向后或向前跳转的页面数的一个整数值。负数表示向后跳转（类似于单击浏览器的“后退”按钮），正数表示向前跳转（类似于单击浏览器的“前进”按钮）**。来看下面的例子。

```
//后退一页
history.go(-1);

//前进一页
history.go(1);

//前进两页
history.go(2);
```

也可以给 go() 方法传递一个字符串参数，此时浏览器会跳转到历史记录中包含该字符串的第一个位置——可能后退，也可能前进，具体要看哪个位置最近。如果历史记录中不包含该字符串，那么这个方法什么也不做，例如：

```
//跳转到最近的 wrox.com 页面
history.go("wrox.com");

//跳转到最近的 nczonline.net 页面
history.go("nczonline.net");
```

另外，还可以使用两个简写方法 back()和 forward()来代替 go()。顾名思义，这两个方法可以模仿浏览器的“后退”和“前进”按钮。

```
//后退一页
history.back();

//前进一页
history.forward();
```

除了上述几个方法外，**history 对象还有一个 length 属性，保存着历史记录的数量**。这个数量包括所有历史记录，即所有向后和向前的记录。对于加载到窗口、标签页或框架中的第一个页面而言，history.length 等于 0。通过像下面这样测试该属性的值，可以确定用户是否一开始就打开了你的页面。

```
if (history.length == 0){
 //这应该是用户打开窗口后的第一个页面
}
```

虽然 history 并不常用，但在创建自定义的“后退”和“前进”按钮，以及检测当前页面是不是用户历史记录中的第一个页面时，还是必须使用它。

当页面的 URL 改变时，就会生成一条历史记录。在 IE8 及更高版本、Opera、Firefox、Safari 3 及更高版本以及 Chrome 中，这里所说的改变包括 URL 中 hash 的变化（因此，设置 location.hash 会在这些浏览器中生成一条新的历史记录）。

# 8.6 小结

浏览器对象模型（BOM）以 window 对象为依托，表示浏览器窗口以及页面可见区域。同时，window 对象还是 ECMAScript 中的 Global 对象，因而所有全局变量和函数都是它的属性，且所有原生的构造函数及其他函数也都存在于它的命名空间下。本章讨论了下列 BOM 的组成部分。

1. 在使用框架时，每个框架都有自己的 window 对象以及所有原生构造函数及其他函数的副本。每个框架都保存在 frames 集合中，可以通过位置或通过名称来访问。
2. 有一些窗口指针，可以用来引用其他框架，包括父框架。
3. top 对象始终指向最外围的框架，也就是整个浏览器窗口。
4. parent 对象表示包含当前框架的框架，而 self 对象则回指 window。
5. 使用 location 对象可以通过编程方式来访问浏览器的导航系统。设置相应的属性，可以逐段或整体性地修改浏览器的 URL。
6. 调用 replace() 方法可以导航到一个新 URL，同时该 URL 会替换浏览器历史记录中当前显示的页面。
7. navigator 对象提供了与浏览器有关的信息。到底提供哪些信息，很大程度上取决于用户的浏览器；不过，也有一些公共的属性（如 userAgent）存在于所有浏览器中。

BOM 中还有两个对象：screen 和 history，但它们的功能有限。screen 对象中保存着与客户端显示器有关的信息，这些信息一般只用于站点分析。history 对象为访问浏览器的历史记录开了一个小缝隙，开发人员可以据此判断历史记录的数量，也可以在历史记录中向后或向前导航到任意页面。
