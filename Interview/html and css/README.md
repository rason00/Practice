# Html和css

### 1.XHTML和HTML有什么区别
> HTML是一种基本的WEB网页设计语言，XHTML是一个基于XML的置标语言  
> 最主要的不同：  
> XHTML 元素必须被正确地嵌套。  
> XHTML 元素必须被关闭。  
> 标签名必须用小写字母。  
> XHTML 文档必须拥有根元素。  

### 2.前端页面有哪三层构成，分别是什么?作用是什么?
> 结构层 Html 表示层 CSS 行为层 js;  

### 3.你做的页面在哪些流览器测试过?这些浏览器的内核分别是什么?
> Ie(Ie内核) 火狐（Gecko） 谷歌（webkit,Blink） opera(Presto),Safari(wbkit)

### 4.什么是语义化的HTML?
> 直观的认识标签 对于搜索引擎的抓取有好处，用正确的标签做正确的事情！  
> html语义化就是让页面的内容结构化，便于对浏览器、搜索引擎解析；  
> 在没有样式CCS情况下也以一种文档格式显示，并且是容易阅读的。  
> 搜索引擎的爬虫依赖于标记来确定上下文和各个关键字的权重，利于 SEO。  
> 使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。  

### 5.html5有哪些新特性?
> HTML5 现在已经不是 SGML 的子集，主要是关于图像，位置，存储，多任务等功能的增加。  
> 绘画 canvas  
> 用于媒介回放的 video 和 audio 元素  
> 本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失；  
> sessionStorage 的数据在浏览器关闭后自动删除  
> 语意化更好的内容元素，比如 article、footer、header、nav、section  
> 表单控件，calendar、date、time、email、url、search  
> 新的技术webworker, websockt, Geolocation  

### 6.html5移除了哪些元素?
> 移除的元素  
> 纯表现的元素：basefont，big，center，font, s，strike，tt，u；  
> 对可用性产生负面影响的元素：frame，frameset，noframes；  

### 7.说下行内元素和块级元素的区别？行内块元素的兼容性使用？（IE8 以下）
> 行内元素：会在水平方向排列，不能包含块级元素，设置width无效，height无效(可以设置line-height)，margin上下无效，padding上下无效。  
> 块级元素：各占据一行，垂直方向排列。从新行开始结束接着一个断行。  
> 兼容性：display:inline-block;*display:inline;*zoom:1;  

### 8.页面导入样式时，使用link和@import有什么区别？
> （1）link属于XHTML标签，除了加载CSS外，还能用于定义RSS, 定义rel连接属性等作用；而@import是CSS提供的，只能用于加载CSS;  
> （2）页面被加载的时，link会同时被加载，而@import引用的CSS会等到页面被加载完再加载;  
> （3）import是CSS2.1 提出的，只在IE5以上才能被识别，而link是XHTML标签，无兼容问题。  

### 9.box-sizing常用的属性有哪些？分别有什么作用？
> box-sizing: content-box|border-box|inherit;  
> content-box:宽度和高度分别应用到元素的内容框。在宽度和高度之外绘制元素的内边距和边框(元素默认效果)。  
> border-box:元素指定的任何内边距和边框都将在已设定的宽度和高度内进行绘制。通过从已设定的宽度和高度分别减去边框和内边距才能得到内容的宽度和高度。  

### 10.写出几种IE6 BUG的解决方法
> 1.双边距BUG float引起的 使用display  
> 2.3像素问题 使用float引起的 使用dislpay:inline -3px  
> 3.超链接hover 点击后失效 使用正确的书写顺序 link visited hover active  
> 4.Ie z-index问题 给父级添加position:relative  
> 5.Png 透明 使用js代码 改  
> 6.Min-height 最小高度 ！Important 解决’  
> 7.select 在ie6下遮盖 使用iframe嵌套  
> 8.为什么没有办法定义1px左右的宽度容器（IE6默认的行高造成的，使用over:hidden,zoom:0.08 line-height:1px）  

### 11.标签上title与alt属性的区别是什么?
> Alt 当图片不显示是 用文字代表。  
> Title 为该属性提供信息  

### 12.清除浮动的几种方式，各自的优缺点
> 1.使用空标签清除浮动 clear:both（理论上能清楚任何标签，，，增加无意义的标签）  
> 2.使用overflow:auto（空标签元素清除浮动而不得不增加无意代码的弊端,,使用zoom:1用于兼容IE）  
> 3.是用afert伪元素清除浮动(用于非IE浏览器)  

### 13、行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？
> 行内元素：a、b、span、img、input、strong、select、label、em、button、textarea  
> 块级元素：div、ul、li、dl、dt、dd、p、h1-h6、blockquote  
> 空元素：即系没有内容的HTML元素，例如：br、meta、hr、link、input、img  

### 14.介绍一下CSS的盒子模型？
> 有两种， IE 盒子模型、标准 W3C 盒子模型；IE的content部分包含了 border 和 pading;  
> 盒模型： 内容(content)、填充(padding)、边界(margin)、 边框(border)  

### 15.前端页面有哪三层构成，分别是什么?作用是什么?
> 结构层 Html 表示层 CSS 行为层 js;  

### 16.HTML5 为什么只需要写 !DOCTYPE HTML？
> HTML5 不基于 SGML，因此不需要对DTD进行引用，但是需要doctype来规范浏览器的行为（让浏览器按照它们应该的方式来运行）；而HTML4.01基于SGML,所以需要对DTD进行引用，才能告知浏览器文档所使用的文档类型。  

### 17.Doctype作用？标准模式与兼容模式各有什么区别?
> !DOCTYPE声明位于位于HTML文档中的第一行，处于html 标签之前。告知浏览器的解析器用什么文档标准解析这个文档。DOCTYPE不存在或格式不正确会导致文档以兼容模式呈现。  
> 标准模式的排版 和JS运作模式都是以该浏览器支持的最高标准运行。在兼容模式中，页面以宽松的向后兼容的方式显示,模拟老式浏览器的行为以防止站点无法工作。  

### 18.CSS隐藏元素的几种方法（至少说出三种）
> 1.Opacity:元素本身依然占据它自己的位置并对网页的布局起作用。它也将响应用户交互;  
> 2.Visibility:与 opacity 唯一不同的是它不会响应任何用户交互。此外，元素在读屏软件中也会被隐藏;  
> 3.Display:display 设为 none 任何对该元素直接打用户交互操作都不可能生效。此外，读屏软件也不会读到元素的内容。这种方式产生的效果就像元素完全不存在;  
> 4.Position:不会影响布局，能让元素保持可以操作;  
> 5.Clip-path:clip-path 属性还没有在 IE 或者 Edge 下被完全支持。如果要在你的 clip-path 中使用外部的 SVG 文件，浏览器支持度还要低;  

### 19.CSS清除浮动的几种方法（至少两种）
> 使用带clear属性的空元素  
> 使用CSS的overflow属性；  
> 使用CSS的:after伪元素；  
> 使用邻接元素处理；  

### 20.CSS居中（包括水平居中和垂直居中）
> 内联元素居中方案  
> 水平居中设置：  
> 1.行内元素  
> 设置 text-align:center；  
>   
> 2.Flex布局  
> 设置display:flex;justify-content:center;(灵活运用,支持Chroime，Firefox，IE9+)  
>   
> 垂直居中设置：  
> 1.父元素高度确定的单行文本（内联元素）  
> 设置 height = line-height；  
>   
> 2.父元素高度确定的多行文本（内联元素）  
> a:插入 table （插入方法和水平居中一样），然后设置 vertical-align:middle；  
> b:先设置 display:table-cell 再设置 vertical-align:middle；  
> 块级元素居中方案  
>   
> 水平居中设置：  
> 1.定宽块状元素  
> 设置 左右 margin 值为 auto；  
>   
> 2.不定宽块状元素  
> a:在元素外加入 table 标签（完整的，包括 table、tbody、tr、td），该元素写在 td 内，然后设置 margin 的值为 auto；  
> b:给该元素设置 displa:inine 方法；  
> c:父元素设置 position:relative 和 left:50%，子元素设置 position:relative 和 left:50%；  
>   
> 垂直居中设置：  
> 使用position:absolute（fixed）,设置left、top、margin-left、margin-top的属性;  
> 利用position:fixed（absolute）属性，margin:auto这个必须不要忘记了;  
> 利用display:table-cell属性使内容垂直居中;  
> 使用css3的新属性transform:translate(x,y)属性;  
> 使用:before元素;  

### 21.写出几种IE6 BUG的解决方法
> 1.双边距BUG float引起的 使用display  
> 2.3像素问题 使用float引起的 使用dislpay:inline -3px  
> 3.超链接hover 点击后失效 使用正确的书写顺序 link visited hover active  
> 4.Ie z-index问题 给父级添加position:relative  
> 5.Png 透明 使用js代码改  
> 6.Min-height 最小高度 ！Important 解决’  
> 7.select 在ie6下遮盖 使用iframe嵌套  
> 9.为什么没有办法定义1px左右的宽度容器（IE6默认的行高造成的，使用over:hidden,zoom:0.08 line-height:1px）  

### 22.CSS 选择符有哪些？哪些属性可以继承？优先级算法如何计算？
> id选择器（ # myid）  
> 类选择器（.myclassname）  
> 标签选择器（div, h1, p）  
> 相邻选择器（h1 + p）  
> 子选择器（ul > li）  
> 后代选择器（li a）  
> 通配符选择器（ * ）  
> 属性选择器（a[rel = “external”]）  
> 伪类选择器（a: hover, li: nth – child）  
> 可继承的样式： font-size font-family color, UL LI DL DD DT;  
> 不可继承的样式：border padding margin width height ;  
> 优先级就近原则，同权重情况下样式定义最近者为准;  
> 优先级为:  
> !important > id > class > tag  
> important 比 内联优先级高  

### 23.CSS3新增伪类举例：
> p:first-of-type:选择属于其父元素的首个p元素的每个p元素。  
> p:last-of-type:选择属于其父元素的最后p元素的每个p元素。  
> p:only-of-type:选择属于其父元素唯一的p元素的每个p元素。  
> p:only-child:选择属于其父元素的唯一子元素的每个p元素。  
> p:nth-child(2):选择属于其父元素的第二个子元素的每个p元素。  
> :enabled:控制表单控件的启用状态。  
> :disabled:控制表单控件的禁用状态。  
> :checked:单选框或复选框被选中。  

### 24.css3有哪些新特性？
> CSS3实现圆角（border-radius），阴影（box-shadow），  
> 对文字加特效（text-shadow、），线性渐变（gradient），旋转（transform）  
> transform:rotate(9deg) scale(0.85,0.90) translate(0px,-30px) skew(-9deg,0deg);//旋转,缩放,定位,倾斜  
> 增加了更多的CSS选择器  多背景 rgba  
> 在CSS3中唯一引入的伪元素是::selection.  
> 媒体查询，多栏布局  

### 25.低端浏览器怎么支持Html5新标签：
> IE8/IE7/IE6支持通过document.createElement方法产生的标签，  
> 可以利用这一特性让这些浏览器支持HTML5新标签，  
> 当然最好的方式是直接使用成熟的框架、使用最多的是html5shim框架  
>        `<!--[if lt IE 9]>  
>        <script> src="http://html5shim.googlecode.com/svn/trunk/html5.js"</script>  
>        <![endif]-->  `

### 26.常见兼容性问题？
> 1.png24位的图片在iE6浏览器上出现背景，解决方案是做成PNG8.也可以引用一段脚本处理.  
> 2.浏览器默认的margin和padding不同。解决方案是加一个全局的*{margin:0;padding:0;}来统一。  
> 3.IE6双边距bug:块属性标签float后，又有横行的margin情况下，在ie6显示margin比设置的大。  
> 4.浮动ie产生的双倍距离（IE6双边距问题：在IE6下，如果对元素设置了浮动，同时又设置了margin-left或margin-right，margin值会加倍。）  
> 5.#box{ float:left; width:10px; margin:0 0 0 100px;}  
> 6.这种情况之下IE会产生20px的距离，解决方案是在float的标签样式控制中加入
> 7._display:inline;将其转化为行内属性。(这个符号只有ie6会识别)  

> 8.渐进识别的方式，从总体中逐渐排除局部。  
> 首先，巧妙的使用“\9”这一标记，将IE游览器从所有情况中分离出来。  
> 接着，再次使用“+”将IE8和IE7、IE6分离开来，这样IE8已经独立识别。  
> css  
> .bb{  
> background-color:#f1ee18;/*所有识别*/  
> .background-color:#00deff\9; /*IE6、7、8识别*/  
> +background-color:#a200ff;/*IE6、7识别*/  
> _background-color:#1e0bd1;/*IE6识别*/  
> }

### 27.display:none和visibility:hidden的区别？
> display:none  隐藏对应的元素，在文档布局中不再给它分配空间，它各边的元素会合拢，就当他从来不存在。  
> visibility:hidden  隐藏对应的元素，但是在文档布局中仍保留原来的空间。  

### 28.position:absolute和float属性的异同
> 共同点：对内联元素设置float和absolute属性，可以让元素脱离文档流，并且可以设置其宽高。  
> 不同点：float仍会占据位置，absolute会覆盖文档流中的其他元素。  

### 29.介绍一下box-sizing属性？
> box-sizing属性主要用来控制元素的盒模型的解析模式。默认值是content-box。  
> content-box：让元素维持W3C的标准盒模型。元素的宽度/高度由border + padding + content的宽度/高度决定，设置width/height属性指的是content部分的宽/高  
> border-box：让元素维持IE传统盒模型（IE6以下版本和IE6~7的怪异模式）。设置width/height属性指的是border + padding + content  
> 标准浏览器下，按照W3C规范对盒模型解析，一旦修改了元素的边框或内距，就会影响元素的盒子尺寸，就不得不重新计算元素的盒子尺寸，从而影响整个页面的布局。  

### 30.position的值， relative和absolute分别是相对于谁进行定位的？
> absolute :生成绝对定位的元素， 相对于最近一级的 定位不是 static 的父元素来进行定位。  
> fixed （老IE不支持）生成绝对定位的元素，通常相对于浏览器窗口或 frame 进行定位。  
> relative 生成相对定位的元素，相对于其在普通流中的位置进行定位。  
> static 默认值。没有定位，元素出现在正常的流中  
> sticky 生成粘性定位的元素，容器的位置根据正常文档流计算得出  
