# 6 面向对象的程序设计

**面向对象（Object-Oriented，OO）的语言有一个标志，那就是它们都有类的概念，而通过类可以创建任意多个具有相同属性和方法的对象。前面提到过，ECMAScript 中没有类的概念，因此它的对象也与基于类的语言中的对象有所不同。ECMA-262 把对象定义为：“无序属性的集合，其属性可以包含基本值、对象或者函数。”严格来讲，这就相当于说对象是一组没有特定顺序的值。对象的每个属性或方法都有一个名字，而每个名字都映射到一个值。正因为这样（以及其他将要讨论的原因），我们可以把 ECMAScript 的对象想象成散列表：无非就是一组名值对，其中值可以是数据或函数。每个对象都是基于一个引用类型创建的，这个引用类型可以是第 5 章讨论的原生类型，也可以是开发人员定义的类型。**。

# 内容涵盖

1. 理解对象
2. 属性类型
    1. 数据属性
    2. 访问属性
3. 定义多个属性
4. 读取属性的特性

# 理解对象
上一章曾经介绍过，创建自定义对象的最简单方式就是创建一个 Object 的实例，然后再为它添加属性和方法，如下所示。

```
var person = new Object();
person.name = "Nicholas";
person.age = 29;
person.job = "Software Engineer";
person.sayName = function(){
 alert(this.name);
};
```

> 上面的例子创建了一个名为 person 的对象，并为它添加了三个属性（name、age 和 job）和一个方法（sayName()）。其中，sayName()方法用于显示 this.name（将被解析为 person.name）的值。

早期的 JavaScript 开发人员经常使用这个模式创建新对象。几年后，对象字面量成为创建这种对象的首选模式。前面的例子用对象字面量语法可以写成这样：

```
var person = {
 name: "Nicholas",
 age: 29,
 job: "Software Engineer",
 sayName: function(){
 alert(this.name);
 }
};
```

> 这个例子中的 person 对象与前面例子中的 person 对象是一样的，都有相同的属性和方法。这些属性在创建时都带有一些特征值（characteristic），JavaScript 通过这些特征值来定义它们的行为。

# 6.1.1 属性类型

ECMA-262 第 5 版在定义只有内部才用的特性（attribute）时，描述了属性（property）的各种特征。

ECMA-262 定义这些特性是为了实现 JavaScript 引擎用的，因此在 JavaScript 中不能直接访问它们。为了表示特性是内部值，该规范把它们放在了两对儿方括号中，例如[[Enumerable]]。尽管 ECMA-262 第 3 版的定义有些不同，但本书只参考第 5 版的描述。

ECMAScript 中有两种属性：数据属性和访问器属性。

## 6.1.1.1 数据属性

数据属性包含一个数据值的位置。在这个位置可以读取和写入值。数据属性有 4 个描述其行为的特性。

1. [[Configurable]]：表示能否通过 delete **删除属性**从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性。像前面例子中那样直接在对象上定义的属性，它们的这个特性**默认值为 true**。
2. [[Enumerable]]：表示能否**通过 for-in 循环返回属性**。像前面例子中那样直接在对象上定义的属性，它们的这个特性**默认值为 true**。
3. [[Writable]]：表示能否**修改属性的值**。像前面例子中那样直接在对象上定义的属性，它们的这个特性**默认值为 true**。
4. [[Value]]：**包含这个属性的数据值。读取属性值的时候，从这个位置读；写入属性值的时候，把新值保存在这个位置**。这个特性的**默认值为 undefine**d。

对于像前面例子中那样直接在对象上定义的属性，它们的[[Configurable]]、[[Enumerable]]和[[Writable]]特性都被设置为 true，而[[Value]]特性被设置为指定的值。例如：

```
var person = {
 name: "Nicholas"
};
```

> 这里创建了一个名为 name 的属性，为它指定的值是"Nicholas"。**也就是说，[[Value]]特性将被设置为"Nicholas"**，而对这个值的任何修改都将反映在这个位置。

**要修改属性默认的特性，必须使用 ECMAScript 5 的 Object.defineProperty() 方法**。

**这个方法接收三个参数：属性所在的对象、属性的名字和一个描述符对象**。其中，描述符（descriptor）对象的属性必须是：configurable、enumerable、writable 和 value。设置其中的一或多个值，可以修改对应的特性值。例如：

```
var person = {};
Object.defineProperty(person, "name", {
 writable: false,
 value: "Nicholas"
});
alert(person.name); //"Nicholas"
person.name = "Greg";
alert(person.name); //"Nicholas"
```

> 这个例子创建了一个名为 name 的属性，它的值"Nicholas"是只读的。这个属性的值是不可修改的，如果尝试为它指定新值，则在非严格模式下，赋值操作将被忽略；在严格模式下，赋值操作将会导致抛出错误。

类似的规则也适用于不可配置的属性。例如：

```
var person = {};
Object.defineProperty(person, "name", {
 configurable: false,
 value: "Nicholas"
});
alert(person.name); //"Nicholas"
delete person.name;
alert(person.name); //"Nicholas"
```

> 把 configurable 设置为 false，表示不能从对象中删除属性。如果对这个属性调用 delete，则在非严格模式下什么也不会发生，而在严格模式下会导致错误。而且，一旦把属性定义为不可配置的，就不能再把它变回可配置了。此时，再调用 Object.defineProperty()方法修改除 writable 之外的特性，都会导致错误：

```
var person = {};
Object.defineProperty(person, "name", {
 configurable: false,
 value: "Nicholas"
});
//抛出错误
Object.defineProperty(person, "name", {
 configurable: true,
 value: "Nicholas"
});
```

> 也就是说，可以多次调用 Object.defineProperty()方法修改同一个属性，但在把 configurable 特性设置为 false 之后就会有限制了。

在调用 Object.defineProperty()方法时，如果不指定，configurable、enumerable 和 writable 特性的默认值都是 false。多数情况下，可能都没有必要利用 Object.defineProperty() 方法提供的这些高级功能。不过，理解这些概念对理解 JavaScript 对象却非常有用。

IE8 是第一个实现 Object.defineProperty()方法的浏览器版本。然而，这个版本的实现存在诸多限制：只能在 DOM 对象上使用这个方法，而且只能创建访问器属性。由于实现不彻底，**建议不要在 IE8 中使用 Object.defineProperty()方法**。

# 6.1.1.2 访问属性

访问器属性不包含数据值；它们包含一对儿 getter 和 setter 函数（不过，这两个函数都不是必需的）。

在读取访问器属性时，会调用 getter 函数，这个函数负责返回有效的值；在写入访问器属性时，会调用 setter 函数并传入新值，这个函数负责决定如何处理数据。访问器属性有如下 4 个特性。

1. [[Configurable]]：表示能否通过 delete **删除属性**从而重新定义属性，能否修改属性的特性，或者能否把属性修改为数据属性。对于直接在对象上定义的属性，这个特性的**默认值为true**。
2. [[Enumerable]]：表示能否通过 **for-in 循环返回属性**。对于直接在对象上定义的属性，这个特性的**默认值为 true**。
3. [[Get]]：在**读取属性时调用的函数**。**默认值为 undefined**。
4. [[Set]]：在**写入属性时调用的函数**。**默认值为 undefined**。

访问器属性不能直接定义，必须使用 Object.defineProperty()来定义。请看下面的例子。

```
var book = {
 _year: 2004,
 edition: 1
};
Object.defineProperty(book, "year", {
 get: function(){
 return this._year;
 },
 set: function(newValue){
 if (newValue > 2004) {
 this._year = newValue;
 this.edition += newValue - 2004;
 }
 }
});
book.year = 2005;
alert(book.edition); //2
```

> 以上代码创建了一个 book 对象，并给它定义两个默认的属性：_year 和 edition。_year 前面的下划线是一种常用的记号，用于表示只能通过对象方法访问的属性。而访问器属性 year 则包含一个 getter 函数和一个 setter 函数。getter 函数返回_year 的值，setter 函数通过计算来确定正确的版本。因此，把 year 属性修改为 2005 会导致 _year 变成 2005，而 edition 变为 2。这是使用访问器属性的常见方式，即设置一个属性的值会导致其他属性发生变化。

不一定非要同时指定 getter 和 setter。**只指定 getter 意味着属性是不能写，尝试写入属性会被忽略**。

**在严格模式下，尝试写入只指定了 getter 函数的属性会抛出错误**。

类似地，**只指定 setter 函数的属性也不能读，否则在非严格模式下会返回 undefined，而在严格模式下会抛出错误**。

支持 ECMAScript 5 的这个方法的浏览器有 IE9+（IE8 只是部分实现）、Firefox 4+、Safari 5+、Opera12+ 和 Chrome 。在这个方法之前，要创建访问器属性，一般都使用两个非标准的方法：`__defineGetter__()` 和 `__defineSetter__()` 。这两个方法最初是由 Firefox 引入的，后来 Safari 3、Chrome 1 和 Opera 9.5 也给出了相同的实现。使用这两个遗留的方法，可以像下面这样重写前面的例子。

```
var book = {
 _year: 2004,
 edition: 1
};
//定义访问器的旧有方法
book.__defineGetter__("year", function(){
 return this._year;
});
book.__defineSetter__("year", function(newValue){
 if (newValue > 2004) {
 this._year = newValue;
 this.edition += newValue - 2004;
 }
});
book.year = 2005;
alert(book.edition); //2
```

在不支持 Object.defineProperty() 方法的浏览器中不能修改 [[Configurable]] 和 [[Enumerable]]。

# 6.1.2 定义多个属性

由于为对象定义多个属性的可能性很大，ECMAScript 5 又定义了一个 **Object.defineProperties() 方法。利用这个方法可以通过描述符一次定义多个属性**。

这个**方法接收两个对象参数：第一个对象是要添加和修改其属性的对象，第二个对象的属性与第一个对象中要添加或修改的属性一一对应**。例如：

```
var book = {};
Object.defineProperties(book, {
 _year: {
 value: 2004
 },

 edition: {
 value: 1
 },
 year: {
 get: function(){
 return this._year;
 },
 set: function(newValue){
 if (newValue > 2004) {
 this._year = newValue;
 this.edition += newValue - 2004;
 }
 }
 }
});
```

> 以上代码在 book 对象上定义了两个数据属性（_year 和 edition）和一个访问器属性（year）。最终的对象与上一节中定义的对象相同。唯一的区别是这里的属性都是在同一时间创建的。

支持 Object.defineProperties()方法的浏览器有 IE9+、Firefox 4+、Safari 5+、Opera 12+ 和 Chrome。

# 6.1.3 读取属性的特性

使用 ECMAScript 5 的 **Object.getOwnPropertyDescriptor()方法，可以取得给定属性的描述符**。

这个**方法接收两个参数：属性所在的对象和要读取其描述符的属性名称**。返回值是一个对象，如果是访问器属性，这个对象的属性有 configurable、enumerable、get 和 set；如果是数据属性，这个对象的属性有 configurable、enumerable、writable 和 value。例如：

```
var book = {};
Object.defineProperties(book, {
 _year: {
 value: 2004
 },
 edition: {
 value: 1
 },
 year: {
 get: function(){
 return this._year;
 },
 set: function(newValue){
 if (newValue > 2004) {
 this._year = newValue;
 this.edition += newValue - 2004;
 }
 }
 }
});
var descriptor = Object.getOwnPropertyDescriptor(book, "_year");
alert(descriptor.value); //2004
alert(descriptor.configurable); //false
alert(typeof descriptor.get); //"undefined"
var descriptor = Object.getOwnPropertyDescriptor(book, "year");
alert(descriptor.value); //undefined
alert(descriptor.enumerable); //false
alert(typeof descriptor.get); //"function"
```

对于数据属性_year，value 等于最初的值，configurable 是 false，而 get 等于 undefined。

对于访问器属性 year，value 等于 undefined，enumerable 是 false，而 get 是一个指向 getter函数的指针。

在 JavaScript 中，可以针对任何对象——包括 DOM 和 BOM 对象，使用 Object.getOwnPropertyDescriptor()方法。支持这个方法的浏览器有 IE9+、Firefox 4+、Safari 5+、Opera 12+和 Chrome。
