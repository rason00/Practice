js
---
#### 1.数组方法pop() push() unshift() shift()
> Push()尾部添加 pop()尾部删除  
> Unshift()头部添加 shift()头部删除  

### 2.call和apply的区别
> Object.call(this,obj1,obj2,obj3)  
> Object.apply(this,arguments)  

### 3.介绍js的基本数据类型　　
> Undefined、Null、Boolean、Number、String  

### 4.js有哪些内置对象？
> 数据封装类对象：Object、Array、Boolean、Number 和 String  
> 其他对象：Function、Arguments、Math、Date、RegExp、Error  

### 5.ES6的了解
> 新增模板字符串（为JavaScript提供了简单的字符串插值功能）、箭头函数（操作符左边为输入的参数，而右边则是进行的操作以及返回的值Inputs=>outputs。）、for-of（用来遍历数据—例如数组中的值。）arguments对象可被不定参数和默认参数完美代替。ES6将promise对象纳入规范，提供了原生的Promise对象。增加了let和const命令，用来声明变量。增加了块级作用域。let命令实际上就增加了块级作用域。ES6规定，var命令和function命令声明的全局变量，属于全局对象的属性；let命令、const命令、class命令声明的全局变量，不属于全局对象的属性。还有就是引入module模块的概念

### 6.js继承方式及其优缺点
> 原型链继承的缺点  
> 一是字面量重写原型会中断关系，使用引用类型的原型，并且子类型还无法给超类型传递参数  
> 借用构造函数（类式继承）  
> 借用构造函数虽然解决了刚才两种问题，但没有原型，则复用无从谈起。所以我们需要原型链+借用构造函数的模式，这种模式称为组合继承  
> 组合式继承  
> 组合式继承是比较常用的一种继承方法，其背后的思路是 使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法  
> 实现了函数复用，又保证每个实例都有它自己的属性。  

### 7.用过哪些设计模式？
> 工厂模式：  
> 构造函数模式  

### 8.说说你对闭包的理解
> 使用闭包主要是为了设计私有的方法和变量。闭包的优点是可以避免全局变量的污染，缺点是闭包会常驻内存，会增大内存使用量，使用不当很容易造成内存泄露。在js中，函数即闭包，只有函数才会产生作用域的概念  
> 闭包有三个特性：  
> 1.函数嵌套函数  
> 2.函数内部可以引用外部的参数和变量  
> 3.参数和变量不会被垃圾回收机制回收  

### 9.请你谈谈Cookie的优缺点
> 优点：极高的扩展性和可用性  
> 1.通过良好的编程，控制保存在cookie中的session对象的大小。  
> 2.通过加密和安全传输技术（SSL），减少cookie被破解的可能性。  
> 3.只在cookie中存放不敏感数据，即使被盗也不会有重大损失。  
> 4.控制cookie的生命期，使之不会永远有效。偷盗者很可能拿到一个过期的cookie。  
> 缺点：  
> 1.`Cookie`数量和长度的限制。每个domain最多只能有20条cookie，每个cookie长度不能超过4KB，否则会被截掉.  
> 2.安全性问题。如果cookie被人拦截了，那人就可以取得所有的session信息。即使加密也与事无补，因为拦截者并不需要知道cookie的意义，他只要原样转发cookie就可以达到目的了。  
> 3.有些状态不可能保存在客户端。例如，为了防止重复提交表单，我们需要在服务器端保存一个计数器。如果我们把这个计数器保存在客户端，那么它起不到任何作用。  

### 10.浏览器本地存储
> 在较高版本的浏览器中，js提供了sessionStorage和globalStorage。在HTML5中提供了localStorage来取代globalStorage。  
> html5中的Web Storage包括了两种存储方式：sessionStorage和localStorage。  
> sessionStorage用于本地存储一个会话（session）中的数据，这些数据只有在同一个会话中的页面才能访问并且当会话结束后数据也随之销毁。因此sessionStorage不是一种持久化的本地存储，仅仅是会话级别的存储。  
> 而localStorage用于持久化的本地存储，除非主动删除数据，否则数据是永远不会过期的。  

### 11.web storage和cookie的区别
> Web Storage的概念和cookie相似，区别是它是为了更大容量存储设计的。Cookie的大小是受限的，并且每次你请求一个新的页面的时候Cookie都会被发送过去，这样无形中浪费了带宽，另外cookie还需要指定作用域，不可以跨域调用。  
> 除此之外，Web Storage拥有setItem,getItem,removeItem,clear等方法，不像cookie需要前端开发者自己封装setCookie，getCookie。  
> 但是cookie也是不可以或缺的：cookie的作用是与服务器进行交互，作为HTTP规范的一部分而存在 ，而Web Storage仅仅是为了在本地“存储”数据而生  
> 浏览器的支持除了IE７及以下不支持外，其他标准浏览器都完全支持(ie及FF需在web服务器里运行)，值得一提的是IE总是办好事，例如IE7、IE6中的userData其实就是javascript本地存储的解决方案。通过简单的代码封装可以统一到所有的浏览器都支持web storage。  
> localStorage和sessionStorage都具有相同的操作方法，例如setItem、getItem和removeItem等  

### 12.cookie 和session 的区别：
> 1、cookie数据存放在客户的浏览器上，session数据放在服务器上。  
> 2、cookie不是很安全，别人可以分析存放在本地的COOKIE并进行COOKIE欺骗  
> 考虑到安全应当使用session。  
> 3、session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能  
> 考虑到减轻服务器性能方面，应当使用COOKIE。  
> 4、单个cookie保存的数据不能超过4K，很多浏览器都限制一个站点最多保存20个cookie。  
> 5、所以个人建议：  
> 将登陆信息等重要信息存放为SESSION  
> 其他信息如果需要保留，可以放在COOKIE中  

### 13.javascript对象的几种创建方式
> 1，工厂模式  
> 2，构造函数模式  
> 3，原型模式  
> 4，混合构造函数和原型模式  
> 5，动态原型模式  
> 6，寄生构造函数模式  
> 7，稳妥构造函数模式  

### 14.javascript继承的6种方法
> 1，原型链继承  
> 2，借用构造函数继承  
> 3，组合继承(原型+借用构造)  
> 4，原型式继承  
> 5，寄生式继承  
> 6，寄生组合式继承  

### 15.创建ajax的过程
> (1)创建`XMLHttpRequest`对象,也就是创建一个异步调用对象.  
> (2)创建一个新的`HTTP`请求,并指定该`HTTP`请求的方法、`URL`及验证信息.  
> (3)设置响应`HTTP`请求状态变化的函数.  
> (4)发送`HTTP`请求.  
> (5)获取异步调用返回的数据.  
> (6)使用JavaScript和DOM实现局部刷新.  

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET','demo.php','true');
    xmlHttp.send()
    xmlHttp.onreadystatechange = function(){
        if(xmlHttp.readyState === 4 & xmlHttp.status === 200){
            ......
        }
    }

### 16.document.write()的用法
> document.write()方法可以用在两个方面：页面载入过程中用实时脚本创建页面内容，以及用延时脚本创建本窗口或新窗口的内容。  
> document.write只能重绘整个页面。innerHTML可以重绘页面的一部分  

### 17.事件、IE与火狐的事件机制有什么区别？ 如何阻止冒泡？
> 1. 我们在网页中的某个操作（有的操作对应多个事件）。例如：当我们点击一个按钮就会产生一个事件。是可以被 JavaScript 侦测到的行为。  
> 2. 事件处理机制：IE是事件冒泡、firefox同时支持两种事件模型，也就是：捕获型事件和冒泡型事件。  
> 3. `ev.stopPropagation()`;注意旧ie的方法 `ev.cancelBubble = true`;  

### 18.GET和POST的区别，何时使用POST？
> GET：一般用于信息获取，使用URL传递参数，对所发送信息的数量也有限制，一般在2000个字符  
> POST：一般用于修改服务器上的资源，对所发送的信息没有限制。  
> GET方式需要使用Request.QueryString来取得变量的值，而POST方式通过Request.Form来获取变量的值，  
> 也就是说Get是通过地址栏来传值，而Post是通过提交表单来传值。  
> 然而，在以下情况中，请使用 POST 请求：  
> 无法使用缓存文件（更新服务器上的文件或数据库）  
> 向服务器发送大量数据（POST 没有数据量限制）  
> 发送包含未知字符的用户输入时，POST 比 GET 更稳定也更可靠  

### 19.null和undefined的区别？
> null是一个表示”无”的对象，转为数值时为0；undefined是一个表示”无”的原始值，转为数值时为NaN。  
> 当声明的变量还未被初始化时，变量的默认值为undefined。  
> null用来表示尚未存在的对象，常用来表示函数企图返回一个不存在的对象。  
> undefined表示”缺少值”，就是此处应该有一个值，但是还没有定义。典型用法是：  
> （1）变量被声明了，但没有赋值时，就等于undefined。  
> （2) 调用函数时，应该提供的参数没有提供，该参数等于undefined。  
> （3）对象没有赋值的属性，该属性的值为undefined。  
> （4）函数没有返回值时，默认返回undefined。  
> null表示”没有对象”，即该处不应该有值。典型用法是：  
> （1） 作为函数的参数，表示该函数的参数不是对象。  
> （2） 作为对象原型链的终点。  

### 20.说说你对作用域链的理解
> 作用域链的作用是保证执行环境里有权访问的变量和函数是有序的，作用域链的变量只能向上访问，变量访问到window对象即被终止，作用域链向下访问变量是不被允许的。  

### 21.Javascript垃圾回收方法
> 标记清除（mark and sweep）  
> 这是JavaScript最常见的垃圾回收方式，当变量进入执行环境的时候，比如函数中声明一个变量，垃圾回收器将其标记为“进入环境”，当变量离开环境的时候（函数执行结束）将其标记为“离开环境”。  
> 垃圾回收器会在运行的时候给存储在内存中的所有变量加上标记，然后去掉环境中的变量以及被环境中变量所引用的变量（闭包），在这些完成之后仍存在标记的就是要删除的变量了  
> 引用计数(reference counting)  
> 在低版本IE中经常会出现内存泄露，很多时候就是因为其采用引用计数方式进行垃圾回收。引用计数的策略是跟踪记录每个值被使用的次数，当声明了一个 变量并将一个引用类型赋值给该变量的时候这个值的引用次数就加1，如果该变量的值变成了另外一个，则这个值得引用次数减1，当这个值的引用次数变为0的时 候，说明没有变量在使用，这个值没法被访问了，因此可以将其占用的空间回收，这样垃圾回收器会在运行的时候清理掉引用次数为0的值占用的空间。  
> 在IE中虽然JavaScript对象通过标记清除的方式进行垃圾回收，但BOM与DOM对象却是通过引用计数回收垃圾的，也就是说只要涉及BOM及DOM就会出现循环引用问题。  
　
### 22.this对象的理解　
> this总是指向函数的直接调用者（而非间接调用者）；  
> 如果有new关键字，this指向new出来的那个对象；  
> 在事件中，this指向触发这个事件的对象，特殊的是，IE中的attachEvent中的this总是指向全局对象Window。  

### 23.eval是做什么的？　
> 它的功能是把对应的字符串解析成JS代码并运行；  
> 应该避免使用eval，不安全，非常耗性能（2次，一次解析成js语句，一次执行）。  
> 由JSON字符串转换为JSON对象的时候可以用eval，var obj =eval('('+ str +')')。  

### 24.JSON 的了解？
> JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式。它是基于JavaScript的一个子集。数据格式简单, 易于读写, 占用带宽小。  
> 格式：采用键值对，例如：{'age':'12', 'name':'back'}  

### 25.call() 和 apply() 的区别和作用？
> apply()函数有两个参数：第一个参数是上下文，第二个参数是参数组成的数组。如果上下文是null，则使用全局对象代替。  
> 如：function.apply(this,[1,2,3]);  
> call()的第一个参数是上下文，后续是实例传入的参数序列。  
> 如：function.call(this,1,2,3);  

### 26.split() join() 的区别
> 前者是切割成数组的形式，后者是将数组转换成字符串  

### 27.document load 和document ready的区别
> Document.onload 是在结构和样式加载完才执行js  
> Document.ready原生种没有这个方法，jquery中有 $().ready(function)  

### 28.”==”和“===”的不同
> 前者会自动转换类型  
> 后者不会  

### 29.DOM怎样添加、移除、移动、复制、创建和查找节点
> 1）创建新节点  
> createDocumentFragment() //创建一个DOM片段  
> createElement() //创建一个具体的元素  
> createTextNode() //创建一个文本节点  
> 2）添加、移除、替换、插入  
> appendChild() //添加  
> removeChild() //移除  
> replaceChild() //替换  
> insertBefore() //插入  
> 3）查找  
> getElementsByTagName() //通过标签名称  
> getElementsByName() //通过元素的Name属性的值  
> getElementById() //通过元素Id，唯一性  

### 30,如何消除一个数组里面重复的元素？
    // 方法一：
    var arr1 =[1,2,2,2,3,3,3,4,5,6],
        arr2 = [];
    for(var i = 0,len = arr1.length; i< len; i++){
        if(arr2.indexOf(arr1[i]) < 0){
            arr2.push(arr1[i]);
        }
    }
    document.write(arr2); // 1,2,3,4,5,6

### 31.请描述一下cookies，sessionStorage和localStorage的区别
> sessionStorage用于本地存储一个会话（session）中的数据，这些数据只有在同一个会话中的页面才能访问并且当会话结束后数据也随之销毁。因此sessionStorage不是一种持久化的本地存储，仅仅是会话级别的存储。而localStorage用于持久化的本地存储，除非主动删除数据，否则数据是永远不会过期的。  
> web storage和cookie的区别  
> Web Storage的概念和cookie相似，区别是它是为了更大容量存储设计的。Cookie的大小是受限的，并且每次你请求一个新的页面的时候Cookie都会被发送过去，这样无形中浪费了带宽，另外cookie还需要指定作用域，不可以跨域调用。  
> 除此之外，Web Storage拥有setItem,getItem,removeItem,clear等方法，不像cookie需要前端开发者自己封装setCookie，getCookie。但是Cookie也是不可以或缺的：Cookie的作用是与服务器进行交互，作为HTTP规范的一部分而存在 ，而Web Storage仅仅是为了在本地“存储”数据而生。  

### 32.统计字符串中字母个数或统计最多字母数。
    var str = "aaaabbbccccddfgh";
    var obj  = {};
    for(var i=0;i<str.length;i++){
        var v = str.charAt(i);
        if(obj[v] && obj[v].value == v){
            obj[v].count = ++ obj[v].count;
        }else{
            obj[v] = {};
            obj[v].count = 1;
            obj[v].value = v;
        }
    }
    for(key in obj){
        document.write(obj[key].value +'='+obj[key].count+'&nbsp;'); // a=4  b=3  c=4  d=2  f=1  g=1  h=1 
    }   

### 33.手写数组快速排序
> 关于快排算法的详细说明，可以参考阮一峰老师的文章快速排序  
> "快速排序"的思想很简单，整个排序过程只需要三步：  
> （1）在数据集之中，选择一个元素作为"基准"（pivot）。  
> （2）所有小于"基准"的元素，都移到"基准"的左边；所有大于"基准"的元素，都移到"基准"的右边。  
> （3）对"基准"左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。  
> 参考代码:  

    var quickSort = function(arr) {
        if (arr.length <= 1) { return arr; }
        var pivotIndex = Math.floor(arr.length / 2);
        var pivot = arr.splice(pivotIndex, 1)[0];
        var left = [];
        var right = [];
        for (var i = 0; i < arr.length; i++){
            if (arr[i] < pivot) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }
        return quickSort(left).concat([pivot], quickSort(right));
    };

### 34.JavaScript实现二分法查找
> 二分法查找，也称折半查找，是一种在有序数组中查找特定元素的搜索算法。查找过程可以分为以下步骤：  
> （1）首先，从有序数组的中间的元素开始搜索，如果该元素正好是目标元素（即要查找的元素），则搜索过程结束，否则进行下一步。  
> （2）如果目标元素大于或者小于中间元素，则在数组大于或小于中间元素的那一半区域查找，然后重复第一步的操作。  
> （3）如果某一步数组为空，则表示找不到目标元素。  
> 参考代码:  

    // 非递归算法
        function binary_search(arr, key) {
            var low = 0,
                high = arr.length - 1;
            while(low <= high){
                var mid = parseInt((high + low) / 2);
                if(key == arr[mid]){
                    return  mid;
                }else if(key > arr[mid]){
                    low = mid + 1;
                }else if(key < arr[mid]){
                    high = mid -1;
                }else{
                    return -1;
                }
            }
        };
        var arr = [1,2,3,4,5,6,7,8,9,10,11,23,44,86];
        var result = binary_search(arr,10);
        alert(result); // 9 返回目标元素的索引值       

    // 递归算法
        function binary_search(arr,low, high, key) {
            if (low > high){
                return -1;
            }
            var mid = parseInt((high + low) / 2);
            if(arr[mid] == key){
                return mid;
            }else if (arr[mid] > key){
                high = mid - 1;
                return binary_search(arr, low, high, key);
            }else if (arr[mid] < key){
                low = mid + 1;
                return binary_search(arr, low, high, key);
            }
        };
        var arr = [1,2,3,4,5,6,7,8,9,10,11,23,44,86];
        var result = binary_search(arr, 0, 13, 10);
        alert(result); // 9 返回目标元素的索引值  


