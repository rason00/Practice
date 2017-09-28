# 内容涵盖

1. 模仿块级作用域
2. 私有变量
    1. 静态私有变量
    2. 模块模式
    3. 增强的模块模式
3. 第七章小结

# 7.3 模仿块级作用域

如前所述，JavaScript 没有块级作用域的概念。这意味着在块语句中定义的变量，实际上是在包含函数中而非语句中创建的，来看下面的例子。

```
function outputNumbers(count){
 for (var i=0; i < count; i++){
 alert(i);
 }
 alert(i); //计数
}
```

这个函数中定义了一个 for 循环，而变量 i 的初始值被设置为 0。在 Java、C++等语言中，变量 i 只会在 for 循环的语句块中有定义，循环一旦结束，变量 i 就会被销毁。可是在 JavaScrip 中，变量 i 是定义在 ouputNumbers() 的活动对象中的，因此从它有定义开始，就可以在函数内部随处访问它。即使像下面这样错误地重新声明同一个变量，也不会改变它的值。

```
function outputNumbers(count){
 for (var i=0; i < count; i++){
 alert(i);
 }

 var i; //重新声明变量
 alert(i); //计数
}
```

**JavaScript 从来不会告诉你是否多次声明了同一个变量；遇到这种情况，它只会对后续的声明视而不见（不过，它会执行后续声明中的变量初始化）**。匿名函数可以用来模仿块级作用域并避免这个问题。

用作块级作用域（通常称为私有作用域）的匿名函数的语法如下所示。

```
(function(){
 //这里是块级作用域
})();
```

以上代码**定义并立即调用**了一个匿名函数。将函数声明包含在一对圆括号中，表示它实际上是一个函数表达式。**而紧随其后的另一对圆括号会立即调用这个函数**。如果有感觉这种语法不太好理解，可以再看看下面这个例子。

```
var count = 5;
outputNumbers(count);
```

这里初始化了变量 count，将其值设置为 5。当然，这里的变量是没有必要的，因为可以把值直接传给函数。为了让代码更简洁，我们在调用函数时用 5 来代替变量 count，如下所示。

```
outputNumbers(5);
```

这样做之所以可行，是因为变量只不过是值的另一种表现形式，因此用实际的值替换变量没有问题。再看下面的例子。

```
var someFunction = function(){
 //这里是块级作用域
};
someFunction();
```

这个例子先定义了一个函数，然后立即调用了它。定义函数的方式是创建一个匿名函数，并把匿名函数赋值给变量 someFunction。而调用函数的方式是在函数名称后面添加一对圆括号，即 someFunction()。通过前面的例子我们知道，可以使用实际的值来取代变量 count，那在这里是不是也可以用函数的值直接取代函数名呢？ 然而，下面的代码却会导致错误。

```
function(){
 //这里是块级作用域
}(); //出错！
```

这段代码会导致语法错误，是因为 JavaScript 将 function 关键字当作一个函数声明的开始，而函数声明后面不能跟圆括号。然而，函数表达式的后面可以跟圆括号。要将函数声明转换成函数表达式，只要像下面这样给它加上一对圆括号即可。

```
(function(){
 //这里是块级作用域
})();
```

无论在什么地方，只要临时需要一些变量，就可以使用私有作用域，例如：

```
function outputNumbers(count){
 (function () {
 for (var i=0; i < count; i++){
 alert(i);
 }
 })();

 alert(i); //导致一个错误！
}
```

> 在这个重写后的 outputNumbers() 函数中，我们在 for 循环外部插入了一个私有作用域。在匿名函数中定义的任何变量，都会在执行结束时被销毁。因此，变量 i 只能在循环中使用，使用后即被销毁。

而在私有作用域中能够访问变量 count，是因为这个匿名函数是一个闭包，它能够访问包含作用域中的所有变量。

这种技术经常在全局作用域中被用在函数外部，从而限制向全局作用域中添加过多的变量和函数。一般来说，我们都应该尽量少向全局作用域中添加变量和函数。在一个由很多开发人员共同参与的大型应用程序中，过多的全局变量和函数很容易导致命名冲突。而通过创建私有作用域，每个开发人员既可以使用自己的变量，又不必担心搞乱全局作用域。例如：

```
(function(){
 var now = new Date();
 if (now.getMonth() == 0 && now.getDate() == 1){
 alert("Happy new year!");
 }
})();
```

> 把上面这段代码放在全局作用域中，可以用来确定哪一天是 1 月 1 日；如果到了这一天，就会向用户显示一条祝贺新年的消息。其中的变量 now 现在是匿名函数中的局部变量，而我们不必在全局作用域中创建它。

这种做法可以减少闭包占用的内存问题，因为没有指向匿名函数的引用。只要函数执行完毕，就可以立即销毁其作用域链了。

# 7.4 私有变量

**严格来讲，JavaScript 中没有私有成员的概念；所有对象属性都是公有的。不过，倒是有一个私有变量的概念。任何在函数中定义的变量，都可以认为是私有变量，因为不能在函数的外部访问这些变量**。

**私有变量包括函数的参数、局部变量和在函数内部定义的其他函数**。来看下面的例子：

```
function add(num1, num2){
 var sum = num1 + num2;
 return sum;
}
```

> 在这个函数内部，有 3 个私有变量：num1、num2 和 sum。在函数内部可以访问这几个变量，但在函数外部则不能访问它们。如果在这个函数内部创建一个闭包，那么闭包通过自己的作用域链也可以访问这些变量。而利用这一点，就可以创建用于访问私有变量的公有方法。

**我们把有权访问私有变量和私有函数的公有方法称为特权方法（privileged method）**。

**有两种在对象上创建特权方法的方式**。**第一种是在构造函数中定义特权方法**，基本模式如下。

```
function MyObject(){
 //私有变量和私有函数
 var privateVariable = 10;
 function privateFunction(){
 return false;
 }
 //特权方法
 this.publicMethod = function (){
 privateVariable++;
 return privateFunction();
 };
}
```

> 这个模式在构造函数内部定义了所有私有变量和函数。然后，又继续创建了能够访问这些私有成员的特权方法。**能够在构造函数中定义特权方法，是因为特权方法作为闭包有权访问在构造函数中定义的所有变量和函数**。对这个例子而言，变量 privateVariable 和函数 privateFunction() 只能通过特权方法 publicMethod() 来访问。在创建 MyObject 的实例后，除了使用 publicMethod() 这一个途径外，没有任何办法可以直接访问 privateVariable 和 privateFunction()。

**利用私有和特权成员，可以隐藏那些不应该被直接修改的数据**，例如：

```
function Person(name){
 this.getName = function(){
 return name;
 };
 this.setName = function (value) {
 name = value;
 };
}
var person = new Person("Nicholas");
alert(person.getName()); //"Nicholas"
person.setName("Greg");
alert(person.getName()); //"Greg"
```

> 以上代码的构造函数中定义了两个特权方法：getName() 和 setName()。这两个方法都可以在构造函数外部使用，而且都有权访问私有变量 name。但在 Person 构造函数外部，没有任何办法访问 name。

由于这两个方法是在构造函数内部定义的，它们作为闭包能够通过作用域链访问 name。私有变量 name 在 Person 的每一个实例中都不相同，因为每次调用构造函数都会重新创建这两个方法。不过，**在构造函数中定义特权方法也有一个缺点，那就是你必须使用构造函数模式来达到这个目的**。第 6 章曾经讨论过，构造函数模式的缺点是针对每个实例都会创建同样一组新方法，而使用静态私有变量来实现特权方法就可以避免这个问题。

# 7.4.1 静态私有变量

**通过在私有作用域中定义私有变量或函数，同样也可以创建特权方法**，其基本模式如下所示。

```
(function(){

 //私有变量和私有函数
 var privateVariable = 10;
 function privateFunction(){
 return false;
 }

 //构造函数
 MyObject = function(){ // MyObject 没有用 var 声明，即是全局变量
 };

 //公有/特权方法
 MyObject.prototype.publicMethod = function(){
 privateVariable++;
 return privateFunction();
 };
})();
```

这个模式创建了一个私有作用域，并在其中封装了一个构造函数及相应的方法。在私有作用域中，首先定义了私有变量和私有函数，然后又定义了构造函数及其公有方法。公有方法是在原型上定义的，这一点体现了典型的原型模式。需要注意的是，这个模式在定义构造函数时并没有使用函数声明，而是使用了函数表达式。**函数声明只能创建局部函数**，但那并不是我们想要的。出于同样的原因，我们也没有在声明 MyObject 时使用 var 关键字。记住：**初始化未经声明的变量，总是会创建一个全局变量**。因此，**MyObject 就成了一个全局变量，能够在私有作用域之外被访问到**。但也要知道，在严格模式下给未经声明的变量赋值会导致错误。

这个模式与在构造函数中定义特权方法的主要区别，就在于私有变量和函数是由实例共享的。由于特权方法是在原型上定义的，因此所有实例都使用同一个函数。而这个特权方法，作为一个闭包，总是保存着对包含作用域的引用。来看一看下面的代码。

```
(function(){

 var name = "";

 Person = function(value){
 name = value;
 };

 Person.prototype.getName = function(){
 return name;
 };

 Person.prototype.setName = function (value){
 name = value;
 };
})();

var person1 = new Person("Nicholas");

alert(person1.getName()); //"Nicholas"
person1.setName("Greg");
alert(person1.getName()); //"Greg"

var person2 = new Person("Michael");

alert(person1.getName()); //"Michael"
alert(person2.getName()); //"Michael"
```

> 这个例子中的 Person 构造函数与 getName() 和 setName() 方法一样，都有权访问私有变量 name。**在这种模式下，变量 name 就变成了一个静态的、由所有实例共享的属性。也就是说，在一个实例上调用 setName() 会影响所有实例**。而调用 setName() 或新建一个 Person 实例都会赋予 name 属性一个新值。**结果就是所有实例都会返回相同的值**。

以这种方式创建静态私有变量会因为使用原型而增进代码复用，但每个实例都没有自己的私有变量。到底是使用实例变量，还是静态私有变量，最终还是要视你的具体需求而定。多查找作用域链中的一个层次，就会在一定程度上影响查找速度。而这正是使用闭包和私有变量的一个显明的不足之处。

# 7.4.2 模块模式

前面的模式是用于为自定义类型创建私有变量和特权方法的。而道格拉斯所说的模块模式（module pattern）则是为单例创建私有变量和特权方法。**所谓单例（singleton），指的就是只有一个实例的对象**。按照惯例，JavaScript 是以对象字面量的方式来创建单例对象的。

```
var singleton = {
 name : value,
 method : function () {
 //这里是方法的代码
 }
};
```

模块模式通过为单例添加私有变量和特权方法能够使其得到增强，其语法形式如下：

```
var singleton = function(){

 //私有变量和私有函数
 var privateVariable = 10;

 function privateFunction(){
 return false;
 }

 //特权/公有方法和属性
 return {
 publicProperty: true,
 publicMethod : function(){
 privateVariable++;
 return privateFunction();
 }
 };
}();
```

这个模块模式使用了一个返回对象的匿名函数。在这个匿名函数内部，首先定义了私有变量和函数。然后，将一个对象字面量作为函数的值返回。返回的对象字面量中只包含可以公开的属性和方法。由于这个对象是在匿名函数内部定义的，因此它的公有方法有权访问私有变量和函数。从本质上来讲，这个对象字面量定义的是单例的公共接口。这种模式在需要对单例进行某些初始化，同时又需要维护其私有变量时是非常有用的，例如：

```
var application = function(){
 //私有变量和函数
 var components = new Array();
 //初始化
 components.push(new BaseComponent());
 //公共
 return {
 getComponentCount : function(){
 return components.length;
 },
 registerComponent : function(component){
 if (typeof component == "object"){
 components.push(component);
 }
 }
 };
}();
```

在 Web 应用程序中，经常需要使用一个单例来管理应用程序级的信息。这个简单的例子创建了一个用于管理组件的 application 对象。在创建这个对象的过程中，首先声明了一个私有的 components 数组，并向数组中添加了一个 BaseComponent 的新实例（在这里不需要关心 BaseComponent 的代码，我们只是用它来展示初始化操作）。而返回对象的 getComponentCount() 和 registerComponent() 方法，都是有权访问数组 components 的特权方法。前者只是返回已注册的组件数目，后者用于注册新组件。

简言之，如果必须创建一个对象并以某些数据对其进行初始化，同时还要公开一些能够访问这些私有数据的方法，那么就可以使用模块模式。以这种模式创建的每个单例都是 Object 的实例，因为最终要通过一个对象字面量来表示它。事实上，这也没有什么；毕竟，单例通常都是作为全局对象存在的，我们不会将它传递给一个函数。因此，也就没有什么必要使用 instanceof 操作符来检查其对象类型了。

# 7.4.3 增强的模块模式

有人进一步改进了模块模式，即在返回对象之前加入对其增强的代码。这种增强的模块模式适合那些单例必须是某种类型的实例，同时还必须添加某些属性和（或）方法对其加以增强的情况。来看下面的例子。

```
var singleton = function(){
 //私有变量和私有函数
 var privateVariable = 10;
 function privateFunction(){
 return false;
 }
 //创建对象
 var object = new CustomType();
 //添加特权/公有属性和方法
 object.publicProperty = true;
 object.publicMethod = function(){
 privateVariable++;
 return privateFunction();
 };
 //返回这个对象
 return object;
}();
```

如果前面演示模块模式的例子中的 application 对象必须是 BaseComponent 的实例，那么就可以使用以下代码。

```
var application = function(){
 //私有变量和函数
 var components = new Array();
 //初始化
 components.push(new BaseComponent());
 //创建 application 的一个局部副本
 var app = new BaseComponent();
 //公共接口
 app.getComponentCount = function(){
 return components.length;
 };
 app.registerComponent = function(component){
 if (typeof component == "object"){
 components.push(component);
 }
 };
 //返回这个副本
 return app;
}();
```

在这个重写后的应用程序（application）单例中，首先也是像前面例子中一样定义了私有变量。主要的不同之处在于命名变量 app 的创建过程，因为它必须是 BaseComponent 的实例。这个实例实际上是 application 对象的局部变量版。此后，我们又为 app 对象添加了能够访问私有变量的公有方法。最后一步是返回 app 对象，结果仍然是将它赋值给全局变量 application。

# 7.5 小结

 JavaScript 编程中，函数表达式是一种非常有用的技术。使用函数表达式可以无须对函数命名，从而实现动态编程。匿名函数，也称为拉姆达函数，是一种使用 JavaScript 函数的强大方式。以下总结了函数表达式的特点。

1. 函数表达式不同于函数声明。函数声明要求有名字，但函数表达式不需要。没有名字的函数表达式也叫做匿名函数。
2. 在无法确定如何引用函数的情况下，递归函数就会变得比较复杂；
3. 递归函数应该始终使用 arguments.callee 来递归地调用自身，不要使用函数名——函数名可能会发生变化。

当在函数内部定义了其他函数时，就创建了闭包。闭包有权访问包含函数内部的所有变量，原理如下。

1. 在后台执行环境中，闭包的作用域链包含着它自己的作用域、包含函数的作用域和全局作用域。
2. 通常，函数的作用域及其所有变量都会在函数执行结束后被销毁。
3. 但是，当函数返回了一个闭包时，这个函数的作用域将会一直在内存中保存到闭包不存在为止。

使用闭包可以在 JavaScript 中模仿块级作用域（JavaScript 本身没有块级作用域的概念），要点如下。

1. 创建并立即调用一个函数，这样既可以执行其中的代码，又不会在内存中留下对该函数的引用。
2. 结果就是函数内部的所有变量都会被立即销毁——除非将某些变量赋值给了包含作用域（即外部作用域）中的变量。

闭包还可以用于在对象中创建私有变量，相关概念和要点如下。

1. 即使 JavaScript 中没有正式的私有对象属性的概念，但可以使用闭包来实现公有方法，而通过公有方法可以访问在包含作用域中定义的变量。
2. 有权访问私有变量的公有方法叫做特权方法。
3. 可以使用构造函数模式、原型模式来实现自定义类型的特权方法，也可以使用模块模式、增强的模块模式来实现单例的特权方法。

JavaScript 中的函数表达式和闭包都是极其有用的特性，利用它们可以实现很多功能。不过，因为创建闭包必须维护额外的作用域，所以过度使用它们可能会占用大量内存。
