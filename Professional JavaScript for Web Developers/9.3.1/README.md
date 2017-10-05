# 9.3 用户代理检测

第三种，也是争议最大的一种客户端检测技术叫做用户代理检测。用户代理检测通过检测用户代理字符串来确定实际使用的浏览器。在每一次 HTTP 请求过程中，用户代理字符串是作为响应首部发送的，而且该字符串可以通过 JavaScript 的 navigator.userAgent 属性访问。在服务器端，通过检测用户代理字符串来确定用户使用的浏览器是一种常用而且广为接受的做法。而在客户端，用户代理检测一般被当作一种万不得已才用的做法，其优先级排在能力检测和（或）怪癖检测之后。

提到与用户代理字符串有关的争议，就不得不提到电子欺骗（spoofing）。所谓电子欺骗，就是指浏览器通过在自己的用户代理字符串加入一些错误或误导性信息，来达到欺骗服务器的目的。要弄清楚这个问题的来龙去脉，必须从 Web 问世初期用户代理字符串的发展讲起。

# 内容涵盖

1. 用户代理字符串的历史
    1. 早期的浏览器
    2. Netscape Navigator 3 和 Internet Explorer 3
    3. Netscape Communicator 4 和 IE4～IE8
    4. Gecko
    5. WebKit
    6. Konqueror
    7. Chrome
    8. Opera
    9. iOS 和 Android

# 9.3.1 用户代理字符串的历史

HTTP 规范（包括 1.0 和 1.1 版）明确规定，浏览器应该发送简短的用户代理字符串，指明浏览器的名称和版本号。RFC 2616（即 HTTP 1.1 协议规范）是这样描述用户代理字符串的：

> “产品标识符常用于通信应用程序标识自身，由软件名和版本组成。使用产品标识符的大多数领域也允许列出作为应用程序主要部分的子产品，由空格分隔。按照惯例，产品要按照相应的重要程度依次列出，以便标识应用程序。”

上述规范进一步规定，用户代理字符串应该以一组产品的形式给出，字符串格式为：标识符/产品版本号。但是，现实中的用户代理字符串则绝没有如此简单。

## 1 早期的浏览器

1993 年，美国 NCSA（National Center for Supercomputing Applications，国家超级计算机中心）发布了世界上第一款 Web 浏览器 Mosaic。这款浏览器的用户代理字符串非常简单，类似如下所示。

```
Mosaic/0.9
```

> 尽管这个字符串在不同操作系统和不同平台下会有所变化，但其基本格式还是简单明了的。正斜杠前面的文本表示产品名称（有时候会出现 NCSA Mosaic 或其他类似字样），而斜杠后面的文本是产品的版本号。

Netscape Communications 公司介入浏览器开发领域后，遂将自己产品的代号定名为 Mozilla（Mosaic Killer 的简写，意即 Mosaic 杀手）。该公司第一个公开发行版，Netscape Navigator 2 的用户代理字符串具有如下格式。

```
Mozilla/版本号 [语言] (平台; 加密类型)
```

Netscape 在坚持将产品名和版本号作为用户代理字符串开头的基础上，又在后面依次添加了下列信息。

1. 语言：即语言代码，表示应用程序针对哪种语言设计。
2. 平台：即操作系统和（或）平台，表示应用程序的运行环境。
3. 加密类型：即安全加密的类型。可能的值有 U（128 位加密）、I（40 位加密）和 N（未加密）。

典型的 Netscape Navigator 2 的用户代理字符串如下所示。

```
Mozilla/2.02 [fr] (WinNT; I)
```

> 这个字符串表示浏览器是 Netscape Navigator 2.02，为法语国家编译，运行在 Windows NT 平台下，加密类型为 40 位。那个时候，通过用户代理字符串中的产品名称，至少还能够轻易地确定用户使用的是什么浏览器。

## 2 Netscape Navigator 3 和 Internet Explorer 3 

1996 年，Netscape Navigator 3 发布，随即超越 Mosaic 成为当时最流行的 Web 浏览器。而用户代理字符串只作了一些小的改变，删除了语言标记，同时允许添加操作系统或系统使用的 CPU 等可选信息。于是，格式变成如下所示。

```
Mozilla/版本号 (平台; 加密类型 [; 操作系统或 CPU 说明])
```

运行在 Windows 系统下的 Netscape Navigator 3 的用户代理字符串大致如下。

```
Mozilla/3.0 (Win95; U)
```

> 这个字符串表示 Netscape Navigator 3 运行在 Windows 95 中，采用了 128 位加密技术。可见，在 Windows 系统中，字符串中的操作系统或 CPU 说明被省略了。

Netscape Navigator 3 发布后不久，微软也发布了其第一款赢得用户广泛认可的 Web 浏览器，即 Internet Explorer 3。由于 Netscape 浏览器在当时占绝对市场份额，许多服务器在提供网页之前都要专门检测该浏览器。如果用户通过 IE 打不开相关网页，那么这个新生的浏览器很可能就会夭折。于是，微软决定将 IE 的用户代理字符串修改成兼容 Netscape 的形式，结果如下：

```
Mozilla/2.0 (compatible; MSIE 版本号; 操作系统)
```

例如，Windows 95 平台下的 Internet Explorer 3.02 带有如下用户代理字符串：

```
Mozilla/2.0 (compatible; MSIE 3.02; Windows 95)
```

由于当时的大多数浏览器嗅探程序只检测用户代理字符串中的产品名称部分，结果 IE 就成功地将自己标识为 Mozilla，从而伪装成 Netscape Navigator。微软的这一做法招致了很多批评，因为它违反了浏览器标识的惯例。更不规范的是，IE 将真正的浏览器版本号插入到了字符串的中间。

字符串中另外一个有趣的地方是标识符 Mozilla 2.0（而不是 3.0）。毕竟，当时的主流版本是 3.0，改成 3.0 应该对微软更有利才对。但真正的谜底到现在还没有揭开——但很可能只是人为疏忽所致。

## 3 Netscape Communicator 4 和 IE4～IE8 

1997 年 8 月，Netscapte Communicator 4 发布（这一版将浏览器名字中的 Navigator 换成了 Communicator）。Netscape 继续遵循了第 3 版时的用户代理字符串格式：

```
Mozilla/版本号 (平台; 加密类型 [; 操作系统或 CPU 说明])
```

因此，Windows 98 平台中第 4 版的用户代理字符串如下所示：

```
Mozilla/4.0 (Win98; I)
```

Netscape 在发布补丁时，子版本号也会相应提高，用户代理字符串如下面的 4.79 版所示：

```
Mozilla/4.79 (Win98; I)
```

但是，微软在发布 Internet Explorer 4 时，顺便将用户代理字符串修改成了如下格式：

```
Mozilla/4.0 (compatible; MSIE 版本号; 操作系统)
```

换句话说，对于 Windows 98 中运行的 IE4 而言，其用户代理字符串为：

```
Mozilla/4.0 (compatible; MSIE 4.0; Windows 98)
```

经过此番修改，Mozilla 版本号就与实际的 IE 版本号一致了，为识别它们的第四代浏览器提供了方便。但令人遗憾的是，两者的一致性仅限于这一个版本。在 Internet Explorer 4.5 发布时（只针对 Macs），虽然 Mozilla 版本号还是 4，但 IE 版本号则改成了如下所示：

```
Mozilla/4.0 (compatible; MSIE 4.5; Mac_PowerPC)
```

此后，IE 的版本一直到 7 都沿袭了这个模式：

```
Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)
```

而 IE8 的用户代理字符串中添加了呈现引擎（Trident）的版本号：

```
Mozilla/4.0 (compatible; MSIE 版本号; 操作系统; Trident/Trident 版本号)
```

例如：

```
Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)
```

这个新增的 Trident 记号是为了让开发人员知道 IE8 是不是在兼容模式下运行。如果是，则 MSIE 的版本号会变成 7，但 Trident 及版本号还会留在用户代码字符串中：

```
Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0)
```

增加这个记号有助于分辨浏览器到底是 IE7（没有 Trident 记号），还是运行在兼容模式下的 IE8。IE9 对字符串格式做了一点调整。Mozilla 版本号增加到了 5.0，而 Trident 的版本号也升到了 5.0。IE9 默认的用户代理字符串如下：

```
Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)
```

如果 IE9 运行在兼容模式下，字符串中的 Mozilla 版本号和 MSIE 版本号会恢复旧的值，但 Trident的版本号仍然是 5.0。例如，下面就是 IE9 运行在 IE7 兼容模式下的用户代理字符串：

```
Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0)
```

所有这些变化都是为了确保过去的用户代理检测脚本能够继续发挥作用，同时还能给新脚本提供更丰富的信息。

## 4 Gecko

Gecko 是 Firefox 的呈现引擎。当初的 Gecko 是作为通用 Mozilla 浏览器的一部分开发的，而第一个采用 Gecko 引擎的浏览器是 Netscape 6。为 Netscape 6 编写的一份规范中规定了未来版本中用户代理字符串的构成。这个新格式与 4.x 版本中相对简单的字符串相比，有着非常大的区别，如下所示：

```
Mozilla/Mozilla 版本号 (平台; 加密类型; 操作系统或 CPU; 语言; 预先发行版本)
 Gecko/Gecko 版本号 应用程序或产品/应用程序或产品版本号
```

这个明显复杂了很多的用户代理字符串中蕴含很多新想法。下表列出了字符串中各项的用意。

| 字符串项 | 必需吗 | 说 明 |
| ------- | ------  | ---- |
| Mozilla 版本号 | 是 | Mozilla 的版本号 |
| 平台 | 是 | 浏览器运行的平台。可能的值包括 Windows、Mac 和 X11（指 Unix 的 X 窗口系统） |
| 加密类型 | 是 | 加密技术的类型：U 表示 128 位、I 表示 40 位、N 表示未加密操作系统或 CPU 是 浏览器运行的操作系统或计算机系统使用的 CPU。在 Windows 平台中，这一项指 Windows 的版本（如 WinNT、Win95，等等）。如果平台是 Macintosh，这一项指 CPU（针对 PowerPC 的 68K、PPC，或 MacIntel）。如果平台是 X11，这一项是 Unix 操作系统的名称，与使用 Unix 命令 uname–sm 得到的名称相同 |
| 语言 | 是 | 浏览器设计时所针对的目标用户语言 |
| 预先发行版本 | 否 | 最初用于表示 Mozilla 的预先发行版本，现在则用来表示 Gecko 呈现引擎的版本号 |
| Gecko 版本号 | 是 | Gecko 呈现引擎的版本号，但由 yyyymmdd 格式的日期表示 |
| 应用程序或产品 | 否 | 使用 Gecko 的产品名。可能是 Netscape、Firefox 等 |
| 应用程序或产品版本号 | 否 | 应用程序或产品的版本号；用于区分 Mozilla 版本号和 Gecko 版本号 |

为了帮助读者更好地理解 Gecko 的用户代理字符串，下面我们来看几个从基于 Gecko 的浏览器中取得的字符串。

```
Windows XP 下的 Netscape 6.21：
Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:0.9.4) Gecko/20011128 Netscape6/6.2.1

Linux 下的 SeaMonkey 1.1a：
Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1b2) Gecko/20060823 SeaMonkey/1.1a

Windows XP 下的 Firefox 2.0.0.11：
Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11

Mac OS X 下的 Camino 1.5.1：
Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en; rv:1.8.1.6) Gecko/20070809 Camino/1.5.1
```

以上这些用户代理字符串都取自基于 Gecko 的浏览器（只是版本有所不同）。很多时候，检测特定的浏览器还不如搞清楚它是否基于 Gecko 更重要。每个字符串中的 Mozilla 版本都是 5.0，自从第一个基于 Gecko 的浏览器发布时修改成这个样子，至今就没有改变过；而且，看起来以后似乎也不会有什么变化。

随着 Firefox 4 发布，Mozilla 简化了这个用户代理字符串。主要改变包括以下几方面。

1. 删除了“语言”记号（例如，前面例子中的“en-US”）。
2. 在浏览器使用强加密（默认设置）时，不显示“加密类型”。也就是说，Mozilla 用户代理字符串中不会再出现“U”，而“I”和“N”还会照常出现。
3. “平台”记号从 Windows 用户代理字符串中删除了，“操作系统或 CPU”中始终都包含“Windows”字符串。
4. “Gecko 版本号”固定为“Gecko/20100101”。

最后，Firefox 4 用户代理字符串变成了下面这个样子：

```
Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox 4.0.1 
```

## 5 WebKit

2003 年，Apple 公司宣布要发布自己的 Web 浏览器，名字定为 Safari。Safari 的呈现引擎叫 WebKit，是 Linux 平台中 Konqueror 浏览器的呈现引擎 KHTML 的一个分支。几年后，WebKit 独立出来成为了一个开源项目，专注于呈现引擎的开发。

这款新浏览器和呈现引擎的开发人员也遇到了与 Internet Explorer 3.0 类似的问题：如何确保这款浏览器不被流行的站点拒之门外？答案就是向用户代理字符串中放入足够多的信息，以便站点能够信任它与其他流行的浏览器是兼容的。于是，WebKit 的用户代理字符串就具备了如下格式：

```
Mozilla/5.0 (平台; 加密类型; 操作系统或 CPU; 语言) AppleWebKit/AppleWebKit 版本号
 (KHTML, like Gecko) Safari/Safari 版本号
```

以下就是一个示例：

```
Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) AppleWebKit/124 (KHTML, like Gecko)
 Safari/125.1
```

> 显然，这又是一个很长的用户代理字符串。其中不仅包含了 Apple WebKit 的版本号，也包含了 Safari 的版本号。出于兼容性的考虑，有关人员很快就决定了将 Safari 标识为 Mozilla。

至今，基于 WebKit 的所有浏览器都将自己标识为 Mozilla 5.0，与基于 Gecko 的浏览器完全一样。但 Safari 的版本号则通常是浏览器的编译版本号，不一定与发布时的版本号对应。换句话说，虽然 Safari 1.25 的用户代理字符串中包含数字 125.1，但两者却不一一对应。

Safari 预发行 1.0 版用户代理字符串中最耐人寻味，也是最饱受诟病的部分就是字符串"(KHTML,like Gecko)"。Apple 因此收到许多开发人员的反馈，他们认为这个字符串明显是在欺骗客户端和服务器，实际上是想让它们把 Safari 当成 Gecko（好像光添加 Mozilla/5.0 还嫌不够）。Apple 的回应与微软在 IE 的用户代理字符串遭到责难时如出一辙：Safari 与 Mozilla 兼容，因此网站不应该将 Safari 用户拒之门外，否则用户就会认为自己的浏览器不受支持。

到了 Safari 3.0 发布时，其用户代理字符串又稍微变长了一点。下面这个新增的 Version 记号一直到现在都被用来标识 Safari 实际的版本号：

```
Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) AppleWebKit/522.15.5 (KHTML, like Gecko) Version/3.0.3 Safari/522.15.5
```

需要注意的是，这个变化只在 Safari 中有，在 WebKit 中没有。换句话说，其他基于 WebKit 的浏览器可能没有这个变化。一般来说，确定浏览器是否基于 WebKit 要比确定它是不是 Safari 更有价值，就像针对 Gecko 一样。

## 6 Konqueror

与 KDE Linux 集成的 Konqueror，是一款基于 KHTML 开源呈现引擎的浏览器。尽管 Konqueror 只能在 Linux 中使用，但它也有数量可观的用户。为确保最大限度的兼容性，Konqueror 效仿 IE 选择了如下用户代理字符串格式：

```
Mozilla/5.0 (compatible; Konqueror/ 版本号; 操作系统或 CPU )
```

不过，为了与 WebKit 的用户代理字符串的变化保持一致，Konqueror 3.2 又有了变化，以如下格式将自己标识为 KHTML：

```
Mozilla/5.0 (compatible; Konqueror/ 版本号; 操作系统或 CPU) KHTML/ KHTML 版本号 (like Gecko)
```

下面是一个例子：

```
Mozilla/5.0 (compatible; Konqueror/3.5; SunOS) KHTML/3.5.0 (like Gecko)
```

其中，Konqueror 与 KHTML 的版本号比较一致，即使有差别也很小，例如 Konqueror 3.5使用 KHTML 3.5.1。

## 7 Chrome

谷歌公司的 Chrome 浏览器以 WebKit 作为呈现引擎，但使用了不同的 JavaScript 引擎。在 Chrome 0.2 这个最初的 beta 版中，用户代理字符串完全取自 WebKit，只添加了一段表示 Chrome 版本号的信息，格式如下：

```
Mozilla/5.0 ( 平台; 加密类型; 操作系统或 CPU; 语言) AppleWebKit/AppleWebKit 版本号 (KHTML, like Gecko) Chrome/ Chrome 版本号 Safari/ Safari 版本
```

Chrome 7 的完整的用户代理字符串如下：

```
Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/534.7 (KHTML, like Gecko) Chrome/7.0.517.44 Safari/534.7
```

其中，WebKit 版本与 Safari 版本看起来似乎始终会保持一致，尽管没有十分的把握。

## 8 Opera

仅就用户代理字符串而言，Opera 应该是最有争议的一款浏览器了。Opera 默认的用户代理字符串是所有现代浏览器中最合理的——正确地标识了自身及其版本号。在 Opera 8.0 之前，其用户代理字符串采用如下格式：

```
Opera/ 版本号 (操作系统或 CPU; 加密类型) [语言]
```

Windows XP 中的 Opera 7.54 会显示下面的用户代理字符串：

```
Opera/7.54 (Windows NT 5.1; U) [en]
```

Opera 8 发布后，用户代理字符串的“语言”部分被移到圆括号内，以便更好地与其他浏览器匹配，如下所示：

```
Opera/ 版本号 (操作系统或 CPU; 加密类型; 语言)
```

Windows XP 中的 Opera 8 会显示下面的用户代理字符串：

```
Opera/8.0 (Windows NT 5.1; U; en)
```

默认情况下，Opera 会以上面这种简单的格式返回一个用户代理字符串。目前来看，Opera 也是主要浏览器中唯一一个使用产品名和版本号来完全彻底地标识自身的浏览器。可是，与其他浏览器一样，Opera 在使用自己的用户代理字符串时也遇到了问题。即使技术上正确，但因特网上仍然有不少浏览器嗅探代码，只钟情于报告 Mozilla 产品名的那些用户代理字符串。另外还有相当数量的代码则只对 IE 或 Gecko 感兴趣。Opera 没有选择通过修改自身的用户代理字符串来迷惑嗅探代码，而是干脆选择通过修改自身的用户代理字符串将自身标识为一个完全不同的浏览器。

Opera 9 以后，出现了两种修改用户代理字符串的方式。一种方式是将自身标识为另外一个浏览器，如 Firefox 或者 IE。在这种方式下，用户代理字符串就如同 Firefox 或 IE 的用户代理字符串一样，只不过末尾追加了字符串 Opera 及 Opera 的版本号。下面是一个例子：

```
Mozilla/5.0 (Windows NT 5.1; U; en; rv:1.8.1) Gecko/20061208 Firefox/2.0.0 Opera 9.50
Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; en) Opera 9.50
```

> 第一个字符串将 Opera 9.5 标识为 Firefox 2，同时带有 Opera 版本信息。第二个字符串将 Opera 9.5标识为 IE6，也包含了 Opera 版本信息。这两个用户代理字符串可以通过针对 Firefox 或 IE 的大多数测试，不过还是为识别 Opera 留下了余地。

Opera 标识自身的另一种方式，就是把自己装扮成 Firefox 或 IE。在这种隐瞒真实身份的情况下，用户代理字符串实际上与其他浏览器返回的相同——既没有 Opera 字样，也不包含 Opera 版本信息。换句话说，在启用了身份隐瞒功能的情况下，无法将 Opera 和其他浏览器区别开来。另外，由于 Opera 喜欢在不告知用户的情况下针对站点来设置用户代理字符串，因此问题就更复杂化了。例如，打开 My Yahoo!站点（http://my.yahoo.com）会自动导致 Opera 将自己装扮成 Firefox。如此一来，要想识别 Opera就难上加难了。

在 Opera 7 以前的版本中，Opera 会解析 Windows 操作系统字符串的含义。例如，Windows NT 5.1 实际上就是 Windows XP，因此 Opera 会在用户代理字符串中包含 Windows XP 而非 Windows NT 5.1。为了与其他浏览器更兼容，Opera 7 开始包含正式的操作系统版本，而非解析后的版本。

Opera 10 对代理字符串进行了修改。现在的格式是：

```
Opera/9.80 (操作系统或 CPU; 加密类型; 语言) Presto/Presto 版本号 Version/版本号
```

注意，初始的版本号 Opera/9.80 是固定不变的。实际并没有 Opera 9.8，但工程师们担心写得不好的浏览器嗅探脚本会将 Opera/10.0 错误的解释为 Opera 1，而不是 Opera 10。因此，Opera 10 又增加了 Presto 记号（Presto 是 Opera 的呈现引擎）和 Version 记号，后者用以保存实际的版本号。以下是 Windows7 中 Opera 10.63 的用户代理字符串：

```
Opera/9.80 (Windows NT 6.1; U; en) Presto/2.6.30 Version/10.63 
```

## 9 iOS 和 Android

移动操作系统 iOS 和 Android 默认的浏览器都基于 WebKit，而且都像它们的桌面版一样，共享相同的基本用户代理字符串格式。iOS 设备的基本格式如下：

```
Mozilla/5.0 (平台; 加密类型; 操作系统或 CPU like Mac OS X; 语言)
AppleWebKit/AppleWebKit 版本号 (KHTML, like Gecko) Version/浏览器版本号
Mobile/移动版本号 Safari/Safari 版本号
```

注意用于辅助确定 Mac 操作系统的"like Mac OS X"和额外的 Mobile 记号。一般来说，Mobile 记号的版本号（移动版本号）没什么用，主要是用来确定 WebKit 是移动版，而非桌面版。而平台则可能是"iPhone"、"iPod"或"iPad"。例如：

```
Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us)
AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16
```

在 iOS 3 之前，用户代理字符串中不会出现操作系统版本号。

Android 浏览器中的默认格式与 iOS 的格式相似，没有移动版本号（但有 Mobile 记号）。例如：

```
Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91)
AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
```

这是 Google Nexus One 手机的用户代理字符串。不过，其他 Android 设备的模式也一样。
