# 6.2.3 原型模式

**我们创建的每个函数都有一个 prototype（原型）属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。如果按照字面意思来理解，那么 prototype 就是通过调用构造函数而创建的那个对象实例的原型对象**。

# 内容涵盖

1. 理解原型对象
2. 原型与 in 操作符
3. 更简单的原型语法
4. 原型的动态属性
5. 原生对象的原型
6. 原型对象的问题

使用原型对象的好处是可以让所有对象实例共享它所包含的属性和方法。换句话说，不必在构造函数中定义对象实例的信息，而是可以将这些信息直接添加到原型对象中，如下面的例子所示。

```
function Person(){
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
 alert(this.name);
};
var person1 = new Person();
person1.sayName(); //"Nicholas"
var person2 = new Person();
person2.sayName(); //"Nicholas"
alert(person1.sayName == person2.sayName); //true
```

在此，我们将 sayName() 方法和所有属性直接添加到了 Person 的 prototype 属性中，构造函数变成了空函数。即使如此，也仍然可以通过调用构造函数来创建新对象，而且新对象还会具有相同的属性和方法。**但与构造函数模式不同的是，新对象的这些属性和方法是由所有实例共享的。换句话说，person1 和 person2 访问的都是同一组属性和同一个 sayName() 函数**。要理解原型模式的工作原理，必须先理解 ECMAScript 中原型对象的性质。

# 6.2.3.1 理解原型对象

无论什么时候，只要创建了一个新函数，就会根据一组特定的规则为该函数创建一个 prototype 属性，这个属性指向函数的原型对象。**在默认情况下，所有原型对象都会自动获得一个 constructor （构造函数）属性，这个属性包含一个指向 prototype 属性所在函数的指针**。就拿前面的例子来说，Person.prototype. constructor 指向 Person。而通过这个构造函数，我们还可继续为原型对象添加其他属性和方法。

创建了自定义的构造函数之后，其原型对象默认只会取得 constructor 属性；至于其他方法，则都是从 Object 继承而来的。当调用构造函数创建一个新实例后，该实例的内部将包含一个指针（内部属性），指向构造函数的原型对象。ECMA-262 第 5 版中管这个指针叫[[Prototype]]。虽然在脚本中没有标准的方式访问[[Prototype]]，但 Firefox、Safari 和 Chrome 在每个对象上都支持一个属性 `__proto__`；而在其他实现中，这个属性对脚本则是完全不可见的。不过，要明确的真正重要的一点就是，这个连接存在于实例与构造函数的原型对象之间，而不是存在于实例与构造函数之间。

**虽然在所有实现中都无法访问到[[Prototype]]，但可以通过 isPrototypeOf() 方法来确定对象之间是否存在这种关系**。从本质上讲，如果[[Prototype]]指向调用 isPrototypeOf() 方法的对象（Person.prototype），那么这个方法就返回 true，如下所示：

```
alert(Person.prototype.isPrototypeOf(person1)); //true
alert(Person.prototype.isPrototypeOf(person2)); //true
```

> 这里，我们用原型对象的 isPrototypeOf() 方法测试了 person1 和 person2。因为它们内部都有一个指向 Person.prototype 的指针，因此都返回了 true。

ECMAScript 5 增加了一个新方法，叫 **Object.getPrototypeOf()，在所有支持的实现中，这个方法返回[[Prototype]]的值**。例如：

```
alert(Object.getPrototypeOf(person1) == Person.prototype); //true
alert(Object.getPrototypeOf(person1).name); //"Nicholas"
```

> 这里的第一行代码只是确定 Object.getPrototypeOf() 返回的对象实际就是这个对象的原型。第二行代码取得了原型对象中 name 属性的值，也就是"Nicholas"。使用 Object.getPrototypeOf() 可以方便地取得一个对象的原型，而这在利用原型实现继承（本章稍后会讨论）的情况下是非常重要的。

支持这个方法的浏览器有 IE9+、Firefox 3.5+、Safari 5+、Opera 12+和 Chrome。

**每当代码读取某个对象的某个属性时，都会执行一次搜索，目标是具有给定名字的属性**。搜索**首先从对象实例本身开始**。如果在实例中找到了具有给定名字的属性，则返回该属性的值；如果没有找到，则**继续搜索指针指向的原型对象**，在原型对象中查找具有给定名字的属性。如果在原型对象中找到了这个属性，则返回该属性的值。

也就是说，在我们调用 person1.sayName()的时候，会先后执行两次搜索。首先，解析器会问：“实例 person1 有 sayName 属性吗？”答：“没有。”然后，它继续搜索，再问：“person1 的原型有 sayName 属性吗？”答：“有。”于是，它就读取那个保存在原型对象中的函数。当我们调用 person2.sayName()时，将会重现相同的搜索过程，得到相同的结果。

而这正是多个对象实例共享原型所保存的属性和方法的基本原理。

前面提到过，原型最初只包含 constructor 属性，而该属性也是共享的，因此可以通过对象实例访问。

虽然**可以通过对象实例访问保存在原型中的值，但却不能通过对象实例重写原型中的值**。

如果在实例中添加了一个属性，而该属性与实例原型中的一个属性同名，那我们就在实例中创建该属性，该属性将会**屏蔽原型中的那个属性**。来看下面的例子。

```
function Person(){
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
 alert(this.name);
};
var person1 = new Person();
var person2 = new Person();
person1.name = "Greg";
alert(person1.name); //"Greg"——来自实例
alert(person2.name); //"Nicholas"——来自原型
```


> 在这个例子中，person1 的 name 被一个新值给屏蔽了。但无论访问 person1.name 还是访问 person2.name 都能够正常地返回值，即分别是"Greg"（来自对象实例）和"Nicholas"（来自原型）。当在 alert()中访问 person1.name 时，需要读取它的值，因此就会在这个实例上搜索一个名为 name 的属性。这个属性确实存在，于是就返回它的值而不必再搜索原型了。当以同样的方式访问 person2.name 时，并没有在实例上发现该属性，因此就会继续搜索原型，结果在那里找到了 name 属性。

**当为对象实例添加一个属性时，这个属性就会屏蔽原型对象中保存的同名属性；换句话说，添加这个属性只会阻止我们访问原型中的那个属性，但不会修改那个属性。即使将这个属性设置为 null，也只会在实例中设置这个属性，而不会恢复其指向原型的连接**。

**不过，使用 delete 操作符则可以完全删除实例属性，从而让我们能够重新访问原型中的属性**，如下所示。

```
function Person(){
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
 alert(this.name);
};
var person1 = new Person();
var person2 = new Person();
person1.name = "Greg";
alert(person1.name); //"Greg"——来自实例
alert(person2.name); //"Nicholas"——来自原型
delete person1.name; //删除实例属性，以后再访问将是访问到原型
alert(person1.name); //"Nicholas"——来自原型
```

> 在这个修改后的例子中，我们使用 delete 操作符删除了 person1.name，之前它保存的"Greg"值屏蔽了同名的原型属性。把它删除以后，就恢复了对原型中 name 属性的连接。因此，接下来再调用person1.name 时，返回的就是原型中 name 属性的值了。

**使用 hasOwnProperty() 方法可以检测一个属性是存在于实例中，还是存在于原型中**。这个方法（不要忘了它是从 Object 继承来的）**只在给定属性存在于对象实例中时，才会返回 true**。来看下面这个例子。

```
function Person(){
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
 alert(this.name);
};
var person1 = new Person();
var person2 = new Person();
alert(person1.hasOwnProperty("name")); //false（因为 person1 中没有 name）
person1.name = "Greg";
alert(person1.name); //"Greg"——来自实例
alert(person1.hasOwnProperty("name")); //true（因为上面 person1 新建了 name）
alert(person2.name); //"Nicholas"——来自原型
alert(person2.hasOwnProperty("name")); //false
delete person1.name;
alert(person1.name); //"Nicholas"——来自原型
alert(person1.hasOwnProperty("name")); //false（因为上面 person1 删除了 name）
```

> 通过使用 hasOwnProperty() 方法，什么时候访问的是实例属性，什么时候访问的是原型属性就一清二楚了。**调用 person1.hasOwnProperty( "name") 时，只有当 person1 重写 name 属性后才会返回 true**，因为只有这时候 name 才是一个实例属性，而非原型属性。

ECMAScript 5 的 Object.getOwnPropertyDescriptor() 方法只能用于实例属性，要取得原型属性的描述符，必须直接在原型对象上调用 Object.getOwnPropertyDescriptor() 方法。

# 6.2.3.2 原型与 in 操作符

有两种方式使用 in 操作符：单独使用和在 for-in 循环中使用。**在单独使用时，in 操作符会在通过对象能够访问给定属性时返回 true，无论该属性存在于实例中还是原型中**。看一看下面的例子。

```
function Person(){
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
 alert(this.name);
};
var person1 = new Person();
var person2 = new Person();
alert(person1.hasOwnProperty("name")); //false
alert("name" in person1); //true（因为 name 在 person1 原型中有）
person1.name = "Greg";
alert(person1.name); //"Greg" ——来自实例
alert(person1.hasOwnProperty("name")); //true
alert("name" in person1); //true（因为 name 在 person1 实例中有）
alert(person2.name); //"Nicholas" ——来自原型
alert(person2.hasOwnProperty("name")); //false
alert("name" in person2); //true（因为 name 在 person2 原型中有）
delete person1.name;
alert(person1.name); //"Nicholas" ——来自原型
alert(person1.hasOwnProperty("name")); //false
alert("name" in person1); //true（因为 name 在 person1 原型中有）
```

> 在以上代码执行的整个过程中，**name 属性要么是直接在对象上访问到的，要么是通过原型访问到的**。因此，调用"name" in person1 **始终都返回 true**，无论该属性存在于实例中还是存在于原型中。

同时使用 hasOwnProperty() 方法和 in 操作符，就可以确定该属性到底是存在于对象中，还是存在于原型中，如下所示。

```
function hasPrototypeProperty(object, name){
 return !object.hasOwnProperty(name) && (name in object);
}
```

由于 in 操作符只要通过对象能够访问到属性就返回 true，hasOwnProperty() 只在属性存在于实例中时才返回 true，**因此只要 in 操作符返回 true 而 hasOwnProperty() 返回 false，就可以确定属性是原型中的属性**。下面来看一看上面定义的函数 hasPrototypeProperty() 的用法。

```
function Person(){
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
 alert(this.name);
};
var person = new Person();
alert(hasPrototypeProperty(person, "name")); //true
person.name = "Greg";
alert(hasPrototypeProperty(person, "name")); //false
```

> 在这里，name 属性先是存在于原型中，因此 hasPrototypeProperty() 返回 true。当在实例中重写 name 属性后，该属性就存在于实例中了，因此 hasPrototypeProperty()返回 false。即使原型中仍然有 name 属性，但由于现在实例中也有了这个属性，因此原型中的 name 属性就用不到了。

**在使用 for-in 循环时，返回的是所有能够通过对象访问的、可枚举的（enumerated）属性**，其中**既包括存在于实例中的属性，也包括存在于原型中的属性**。屏

**蔽了原型中不可枚举属性（即将[[Enumerable]]标记为 false 的属性）的实例属性也会在 for-in 循环中返回**，因为根据规定，所有开发人员定义的属性都是可枚举的——只有在 IE8 及更早版本中例外。

IE 早期版本的实现中存在一个 bug，即屏蔽不可枚举属性的实例属性不会出现在 for-in 循环中。例如：

```
var o = {
 toString : function(){
 return "My Object";
 }
};
for (var prop in o){
 if (prop == "toString"){
 alert("Found toString"); //在 IE 中不会显示
 }
}
```

> 当以上代码运行时，应该会显示一个警告框，表明找到了 toString()方法。这里的对象 o 定义了一个名为 toString() 的方法，该方法屏蔽了原型中（不可枚举）的 toString() 方法。

在 IE 中，由于其实现认为原型的 toString() 方法被打上了值为 false 的[[Enumerable]]标记，因此应该跳过该属性，结果我们就不会看到警告框。该 bug 会影响默认不可枚举的所有属性和方法，包括：hasOwnProperty()、propertyIsEnumerable()、toLocaleString()、toString()和 valueOf()。

ECMAScript 5 也将 constructor 和 prototype 属性的[[Enumerable]]特性设置为 false，但并不是所有浏览器都照此实现。**要取得对象上所有可枚举的实例属性，可以使用 ECMAScript 5 的 Object.keys() 方法。这个方法接收一个对象作为参数，返回一个包含所有可枚举属性的字符串数组**。例如：

```
function Person(){
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
 alert(this.name);
};
var keys = Object.keys(Person.prototype);
alert(keys); //"name,age,job,sayName"
var p1 = new Person();
p1.name = "Rob";
p1.age = 31;
var p1keys = Object.keys(p1);
alert(p1keys); //"name,age"
```

> 这里，变量 keys 中将保存一个数组，数组中是字符串"name"、"age"、"job"和"sayName"。这个顺序也是它们在 for-in 循环中出现的顺序。如果是通过 Person 的实例调用，则 Object.keys()返回的数组只包含"name"和"age"这两个实例属性。

如果你想要得到所有实例属性，无论它是否可枚举，都可以使用 Object.getOwnPropertyNames() 方法。

```
var keys = Object.getOwnPropertyNames(Person.prototype);
alert(keys); //"constructor,name,age,job,sayName"
```

> **注意结果中包含了不可枚举的 constructor 属性**。

Object.keys() 和 Object.getOwnPropertyNames() 方法都可以用来替代 for-in 循环。支持这两个方法的浏览器有 IE9+、Firefox 4+、Safari 5+、Opera12+ 和 Chrome。

# 6.2.3.3 更简单的原型语法

读者大概注意到了，前面例子中每添加一个属性和方法就要敲一遍 Person.prototype。为减少不必要的输入，也为了从视觉上更好地封装原型的功能，**更常见的做法是用一个包含所有属性和方法的对象字面量来重写整个原型对象**，如下面的例子所示。

```
function Person(){
}
Person.prototype = {
 name : "Nicholas",
 age : 29,
 job: "Software Engineer",
 sayName : function () {
 alert(this.name);
 }
};
```

> 在上面的代码中，我们将 Person.prototype 设置为等于一个以对象字面量形式创建的新对象。**最终结果相同，但有一个例外：constructor 属性不再指向 Person 了**。

前面曾经介绍过，每创建一个函数，就会同时创建它的 prototype 对象，这个对象也会自动获得 constructor 属性。而我们在这里使用的语法，本质上完全重写了默认的 prototype 对象，**因此 constructor 属性也就变成了新对象的 constructor 属性（指向 Object 构造函数），不再指向 Person 函数**。

此时，尽管 instanceof操作符还能返回正确的结果，但通过 constructor 已经无法确定对象的类型了，如下所示。

```
var friend = new Person();
alert(friend instanceof Object); //true
alert(friend instanceof Person); //true
alert(friend.constructor == Person); //false
alert(friend.constructor == Object); //true
```

在此，用 instanceof 操作符测试 Object 和 Person 仍然返回 true，但 constructor 属性则等于 Object 而不等于 Person 了。**如果 constructor 的值真的很重要，可以像下面这样特意将它设置回适当的值**。

```
function Person(){
}
Person.prototype = {
 constructor : Person,
 name : "Nicholas",
 age : 29,
 job: "Software Engineer",
 sayName : function () {
 alert(this.name);
 }
};
```

> 以上代码特意包含了一个 constructor 属性，并将它的值设置为 Person，从而确保了通过该属性能够访问到适当的值。

**注意，以这种方式重设 constructor 属性会导致它的[[Enumerable]]特性被设置为 true**。默认情况下，原生的 constructor 属性是不可枚举的，因此如果你使用兼容 ECMAScript 5 的 JavaScript 引擎，可以试一试 Object.defineProperty()。

```
function Person(){
}
Person.prototype = {
 name : "Nicholas",
 age : 29,
 job : "Software Engineer",
 sayName : function () {
 alert(this.name);
 }
};

//重设构造函数，只适用于 ECMAScript 5 兼容的浏览器
Object.defineProperty(Person.prototype, "constructor", {
 enumerable: false,
 value: Person
}); 
```

# 6.2.3.4 原型的动态属性

由于在原型中查找值的过程是一次搜索，因此我们对原型对象所做的任何修改都能够立即从实例上反映出来——即使是**先创建了实例后修改原型也照样如此**。请看下面的例子。

```
var friend = new Person();
Person.prototype.sayHi = function(){
 alert("hi");
};
friend.sayHi(); //"hi"（没有问题！）
```

> 以上代码先创建了 Person 的一个实例，并将其保存在 person 中。然后，下一条语句在 Person.prototype 中添加了一个方法 sayHi()。即使 person 实例是在添加新方法之前创建的，但它仍然可以访问这个新方法。

**其原因可以归结为实例与原型之间的松散连接关系。当我们调用 person.sayHi() 时，首先会在实例中搜索名为 sayHi 的属性，在没找到的情况下，会继续搜索原型。因为实例与原型之间的连接只不过是一个指针，而非一个副本，因此就可以在原型中找到新的 sayHi 属性并返回保存在那里的函数**。

尽管可以随时为原型添加属性和方法，并且修改能够立即在所有对象实例中反映出来，**但如果是重写整个原型对象，那么情况就不一样了**。我们知道，**调用构造函数时会为实例添加一个指向最初原型的[[Prototype]]指针，而把原型修改为另外一个对象就等于切断了构造函数与最初原型之间的联系**。

**请记住：实例中的指针仅指向原型，而不指向构造函数**。看下面的例子。

```
function Person(){
}
var friend = new Person();（指针指向 Person 的最初原型（最初原型理解为暂时是空的））

Person.prototype = {  （把原型赋值为另一个对象，即切断了构造函数与最初原型的联系）
 constructor: Person,
 name : "Nicholas",
 age : 29,
 job : "Software Engineer",
 sayName : function () {
 alert(this.name);
 }
};
friend.sayName(); //error（找的是最初原型，里面为空的所有没有 sayName）
```

> 在这个例子中，我们先创建了 Person 的一个实例，然后又重写了其原型对象。然后在调用 friend.sayName() 时发生了错误，因为 friend 指向的原型中不包含以该名字命名的属性。

# 6.2.3.5 原生对象的原型

原型模式的重要性不仅体现在创建自定义类型方面，就连所有原生的引用类型，都是采用这种模式创建的。所有原生引用类型（Object、Array、String，等等）都在其构造函数的原型上定义了方法。

例如，在 Array.prototype 中可以找到 sort() 方法，而在 String.prototype 中可以找到 substring() 方法，如下所示。

···
alert(typeof Array.prototype.sort); //"function"
alert(typeof String.prototype.substring); //"function"
···

**通过原生对象的原型，不仅可以取得所有默认方法的引用，而且也可以定义新方法。可以像修改自定义对象的原型一样修改原生对象的原型，因此可以随时添加方法**。下面的代码就给基本包装类型 String 添加了一个名为 startsWith()的方法。

```
String.prototype.startsWith = function (text) {
 return this.indexOf(text) == 0;
};
var msg = "Hello world!";
alert(msg.startsWith("Hello")); //true
```

> 这里新定义的 startsWith() 方法会在传入的文本位于一个字符串开始时返回 true。既然方法被添加给了 String.prototype，那么当前环境中的所有字符串就都可以调用它。由于 msg 是字符串，而且后台会调用 String 基本包装函数创建这个字符串，因此通过 msg 就可以调用 startsWith()方法。

尽管可以这样做，但不推荐在产品化的程序中修改原生对象的原型。如果因某个实现中缺少某个方法，就在原生对象的原型中添加这个方法，那么当在另一个支持该方法的实现中运行代码时，就可能会导致命名冲突。而且，这样做也可能会意外地重写原生方法。

# 6.2.3.6 原型对象的问题

原型模式也不是没有缺点。**首先，它省略了为构造函数传递初始化参数这一环节，结果所有实例在默认情况下都将取得相同的属性值**。虽然这会在某种程度上带来一些不方便，但还不是原型的最大问题。

**原型模式的最大问题是由其共享的本性所导致的**。

原型中所有属性是被很多实例共享的，这种共享对于函数非常合适。对于那些包含基本值的属性倒也说得过去，毕竟（如前面的例子所示），通过在实例上添加一个同名属性，可以隐藏原型中的对应属性。**然而，对于包含引用类型值的属性来说，问题就比较突出了**。来看下面的例子。

```
function Person(){
}
Person.prototype = {
 constructor: Person,
 name : "Nicholas",
 age : 29,
 job : "Software Engineer",
 friends : ["Shelby", "Court"],
 sayName : function () {
 alert(this.name);
 }
};
var person1 = new Person();
var person2 = new Person();
person1.friends.push("Van");
alert(person1.friends); //"Shelby,Court,Van"
alert(person2.friends); //"Shelby,Court,Van"
alert(person1.friends === person2.friends); //true
```

在此，Person.prototype 对象有一个名为 friends 的属性，该属性包含一个字符串数组。然后，创建了 Person 的两个实例。接着，**修改了 person1.friends 引用的数组，向数组中添加了一个字符串**。由于 friends 数组存在于 Person.prototype 而非 person1 中，所以刚刚提到的修改也会通过 **person2.friends（与 person1.friends 指向同一个数组）反映出来**。

假如我们的初衷就是像这样在所有实例中共享一个数组，那么对这个结果我没有话可说。可是，实例一般都是要有属于自己的全部属性的。而这个问题正是我们很少看到有人单独使用原型模式的原因所在。
