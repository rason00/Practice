# 4.1 基本类型和引用类型的值

**ECMAScript 变量可能包含两种不同数据类型的值：基本类型值和引用类型值。基本类型值指的是简单的数据段，而引用类型值指那些可能由多个值构成的对象**。

5 种基本数据类型：Undefined、Null、Boolean、Number 和 String。这 5 种基本数据类型是按值访问的，因为可以操作保存在变量中的实际的值。

引用类型的值是保存在内存中的对象。JavaScript 不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间。在操作对象时，实际上是在操作对象的引用而不是实际的对象。

> 这种说法不严密，当复制保存着对象的某个变量时，操作的是对象的引用。但在为对象添加属性时，操作的是实际的对象。

# 内容涵盖

1. 动态的属性
2. 复制变量值
3. 传递参数
4. 检测类型

# 4.1.1 动态的属性

**定义基本类型值和引用类型值的方式是类似的：创建一个变量并为该变量赋值**。

但是，当这个值保存到变量中以后，对不同类型值可以执行的操作则大相径庭。

对于引用类型的值，我们可以为其添加属性和方法，也可以改变和删除其属性和方法。请看下面的例子：

```
var person = new Object();
person.name = "Nicholas";
alert(person.name); //"Nicholas"
```

> 以上代码创建了一个对象并将其保存在了变量 person 中。然后，我们为该对象添加了一个名为 name 的属性，并将字符串值"Nicholas"赋给了这个属性。紧接着，又通过 alert()函数访问了这个新属性。如果对象不被销毁或者这个属性不被删除，则这个属性将一直存在。

但是，我们不能给基本类型的值添加属性，尽管这样做不会导致任何错误。比如：

```
var name = "Nicholas";
name.age = 27;
alert(name.age); //undefined
```

> 在这个例子中，我们为字符串 name 定义了一个名为 age 的属性，并为该属性赋值 27。但在下一行访问这个属性时，发现该属性不见了。这说明只能给引用类型值动态地添加属性，以便将来使用。

# 4.1.2 复制变量值

如果从一个变量向另一个变量复制 **基本类型** 的值，会在变量对象上创建一个新值，然后把该值复制
到为新变量分配的位置上。来看一个例子：

```
var num1 = 5;
var num2 = num1;

console.log(num1);  // 5
console.log(num2);  // 5

num2 = 10;          // 改变 num2 的值，num1 不受影响。
console.log(num1);  // 5
console.log(num2);  // 10
```

> num1 中保存的值是 5。当使用 num1 的值来初始化 num2 时，num2 中也保存了值 5。但 num2 中的 5 与 num1 中的 5 是完全独立的，这两个变量可以参与任何操作而不会相互影响。

当从一个变量向另一个变量复制**引用类型**的值时，同样也会将存储在变量对象中的值复制一份放到为新变量分配的空间中。

不同的是，这个值的副本实际上是一个**指针**，而这个指针指向存储在堆中的一个对象。复制操作结束后，**两个变量实际上将引用同一个对象**。因此，**改变其中一个变量，就会影响另一个变量**，如下面的例子所示：

```
var obj1 = new Object();
var obj2 = obj1;
obj1.name = "Nicholas";
alert(obj2.name); //"Nicholas"
```

> obj1 和 obj2 都指向同一个对象。这样，当为 obj1 添加 name 属性后，可以通过 obj2 来访问这个属性。

# 4.1.3 传递参数

**ECMAScript 中所有函数的参数都是按值传递的。也就是说，把函数外部的值复制给函数内部的参数，就和把值从一个变量复制到另一个变量一样**。

**基本类型值的传递如同基本类型变量的复制一样，而引用类型值的传递，则如同引用类型变量的复制一样**。

在向参数传递基本类型的值时，被传递的值会被复制给一个局部变量（即命名参数，或者用 ECMAScript 的概念来说，就是 arguments 对象中的一个元素）。

在向参数传递**引用类型**的值时，会把这个值在内存中的地址复制给一个局部变量，因此**这个局部变量的变化会反映在函数的外部**。

基本类型例子：

```
function addTen(num) {
 num += 10;
 return num;
}

var count = 20;
var result = addTen(count);
alert(count); //20，没有变化
alert(result); //30
```

num 是函数的局部变量。在调用这个函数时，变量 count 作为参数被传递给函数，数值 20 被复制给参数 num 以便在 addTen() 中使用。在函数内部，参数 num 的值被加上了 10，但这一变化不会影响函数外部的 count 变量。

引用类型例子：

```
function setName(obj) {
 obj.name = "Nicholas";
}
var person = new Object();
setName(person);
alert(person.name); //"Nicholas"
```

> obj 和 person 引用的是同一个对象。于是，当在函数内部为 obj 添加 name 属性后，函数外部的 person 也将有所反映。

有很多开发人员错误地认为：在局部作用域中修改的对象会在全局作用域中反映出来，就说明参数是按引用传递的。为了证明对象是按值传递的，再看一看下面这个经过修改的例子：

```
function setName(obj) {
 obj.name = "Nicholas";
 obj = new Object();
 obj.name = "Greg";
}
var person = new Object();
setName(person);
alert(person.name); //"Nicholas"
```

这个例子与前一个例子的唯一区别，就是在 setName()函数中添加了两行代码：

1. 一行代码为 obj重新定义了一个对象，
2. 另一行代码为该对象定义了一个带有不同值的 name 属性。

在把 person 传递给 setName() 后，其 name 属性被设置为"Nicholas"。然后，又将一个新对象赋给变量 obj，同时将其 name
属性设置为"Greg"。

如果 person 是按引用传递的，那么 person 就会自动被修改为指向其 name 属性值为 "Greg" 的新对象。但是，当接下来再访问 person.name 时，显示的值仍然是"Nicholas"。这说明即使在函数内部修改了参数的值，但原始的引用仍然保持未变。实际上，当在函数内部重写 obj 时，这个变量引用的就是一个局部对象了。而这个**局部对象会在函数执行完毕后立即被销毁**。

> 可以把 ECMAScript 函数的参数想象成局部变量。

# 4.1.4 检测类型

要检测一个变量是不是基本数据类型？第 3 章介绍的 typeof 操作符是最佳的工具。说得更具体一点，**typeof 操作符是确定一个变量是字符串、数值、布尔值，还是 undefined 的最佳工具。如果变量的值是一个对象或 null，则 typeof 操作符会返回"object"，如下例子**：

```
var s = "Nicholas";
var b = true;
var i = 22;
var u;
var n = null;
var o = new Object();
alert(typeof s); //string
alert(typeof i); //number
alert(typeof b); //boolean
alert(typeof u); //undefined
alert(typeof n); //object
alert(typeof o); //object
```

> 在检测基本数据类型时 typeof 是非常得力的助手，但在检测引用类型的值时，这个操作符的用处不大。

通常，我们并不是想知道某个值是对象，而是想知道它是什么类型的对象。为此，ECMAScript 提供了 instanceof 操作符，如果变量是给定引用类型（根据它的原型链来识别；第 6 章将介绍原型链）的实例，那么 instanceof 操作符就会返回 true。请看下面的例子：

```
alert(person instanceof Object);  // 变量 person 是 Object 吗？
alert(colors instanceof Array);   // 变量 colors 是 Array 吗？
alert(pattern instanceof RegExp); // 变量 pattern 是 RegExp 吗？

var b = '123';
alert(b instanceof String);     //false
alert(typeof b);                //string

var c = new String("123");
alert(c instanceof String);    //true
alert(typeof c);               //object

var arr = [1,2,3]; 
alert(arr instanceof Array);   // true
```

根据规定，**所有引用类型的值都是 Object 的实例。因此，在检测一个引用类型值和 Object 构造函数时，instanceof 操作符始终会返回 true**。

**如果使用 instanceof 操作符检测基本类型的值，则该操作符始终会返回 false，因为基本类型不是对象**。


> 使用 typeof 操作符检测函数时，该操作符会返回"function"。在 Safari 5 及之前版本和 Chrome 7 及之前版本中使用 typeof 检测正则表达式时，由于规范的原因，这个操作符也返回"function"。ECMA-262 规定任何在内部实现 [[Call]] 方法的对象都应该在应用 typeof 操作符时返回"function"。由于上述浏览器中的正则表达式也实现了这个方法，因此对正则表达式应用 typeof 会返回"function"。在 IE 和 Firefox 中，对正则表达式应用 typeof 会返回"object"。
