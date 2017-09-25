# 内容涵盖

1. 组合使用构造函数模式和原型模式
2. 动态原型模式
3. 寄生构造函数模式
4. 稳妥构造函数模式


# 6.2.4 组合使用构造函数模式和原型模式

创建自定义类型的最常见方式，就是组合使用构造函数模式与原型模式。构造函数模式用于定义实例属性，而原型模式用于定义方法和共享的属性。结果，每个实例都会有自己的一份实例属性的副本，但同时又共享着对方法的引用，最大限度地节省了内存。另外，这种混成模式还支持向构造函数传递参数；可谓是集两种模式之长。下面的代码重写了前面的例子。

```
function Person(name, age, job){
 this.name = name;
 this.age = age;
 this.job = job;
 this.friends = ["Shelby", "Court"];
}
Person.prototype = {
 constructor : Person,
 sayName : function(){
 alert(this.name);
 }
}
var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
person1.friends.push("Van");
alert(person1.friends); //"Shelby,Count,Van"
alert(person2.friends); //"Shelby,Count"
alert(person1.friends === person2.friends); //false
alert(person1.sayName === person2.sayName); //true
```

> 在这个例子中，实例属性都是在构造函数中定义的，而由所有实例共享的属性 constructor 和方法 sayName() 则是在原型中定义的。而修改了 person1.friends（向其中添加一个新字符串），并不会影响到 person2.friends，因为它们分别引用了不同的数组。

**这种构造函数与原型混成的模式，是目前在 ECMAScript 中使用最广泛、认同度最高的一种创建自定义类型的方法。可以说，这是用来定义引用类型的一种默认模式**。

# 6.2.5 动态原型模式

有其他 OO 语言经验的开发人员在看到独立的构造函数和原型时，很可能会感到非常困惑。动态原型模式正是致力于解决这个问题的一个方案，**它把所有信息都封装在了构造函数中，而通过在构造函数中初始化原型（仅在必要的情况下），又保持了同时使用构造函数和原型的优点**。换句话说，可以通过检查某个应该存在的方法是否有效，来决定是否需要初始化原型。来看一个例子。

```
function Person(name, age, job){
 //属性
 this.name = name;
 this.age = age;
 this.job = job;

 //方法
 if (typeof this.sayName != "function"){

 Person.prototype.sayName = function(){
 alert(this.name);
 };

 }
}
var friend = new Person("Nicholas", 29, "Software Engineer");
friend.sayName();
```

> 注意构造函数代码中方法的部分。这里只在 sayName() 方法不存在的情况下，才会将它添加到原型中。这段代码只会在初次调用构造函数时才会执行。此后，原型已经完成初始化，不需要再做什么修改了。不过要记住，这里对原型所做的修改，能够立即在所有实例中得到反映。因此，这种方法确实可以说非常完美。其中，if 语句检查的可以是初始化之后应该存在的任何属性或方法——不必用一大堆 if 语句检查每个属性和每个方法；只要检查其中一个即可。对于采用这种模式创建的对象，还可以使用 instanceof 操作符确定它的类型。

**使用动态原型模式时，不能使用对象字面量重写原型。前面已经解释过了，如果在已经创建了实例的情况下重写原型，那么就会切断现有实例与新原型之间的联系**。

# 6.2.6 寄生构造函数模式

通常，在前述的几种模式都不适用的情况下，可以使用**寄生（parasitic）构造函数模式。这种模式的基本思想是创建一个函数，该函数的作用仅仅是封装创建对象的代码，然后再返回新创建的对象**；但从表面上看，这个函数又很像是典型的构造函数。下面是一个例子。

```
function Person(name, age, job){
 var o = new Object();
 o.name = name;
 o.age = age;
 o.job = job;
 o.sayName = function(){
 alert(this.name);
 };
 return o;
}
var friend = new Person("Nicholas", 29, "Software Engineer");
friend.sayName(); //"Nicholas"
```

> 在这个例子中，Person 函数创建了一个新对象，并以相应的属性和方法初始化该对象，然后又返回了这个对象。除了使用 new 操作符并把使用的包装函数叫做构造函数之外，这个模式跟工厂模式其实是一模一样的。构造函数在不返回值的情况下，默认会返回新对象实例。而通过在构造函数的末尾添加一个 return 语句，可以重写调用构造函数时返回的值。

这个模式可以在特殊的情况下用来为对象创建构造函数。假设我们想创建一个具有额外方法的特殊数组。由于不能直接修改 Array 构造函数，因此可以使用这个模式。

```
function SpecialArray(){

 //创建数组
 var values = new Array();

 //添加值
 values.push.apply(values, arguments);

 //添加方法
 values.toPipedString = function(){
 return this.join("|");
 };

 //返回数组
 return values;
}

var colors = new SpecialArray("red", "blue", "green");
alert(colors.toPipedString()); //"red|blue|green"
```

> 在这个例子中，我们创建了一个名叫 SpecialArray 的构造函数。在这个函数内部，首先创建了一个数组，然后 push() 方法（用构造函数接收到的所有参数）初始化了数组的值。随后，又给数组实例添加了一个 toPipedString() 方法，该方法返回以竖线分割的数组值。最后，将数组以函数值的形式返回。接着，我们调用了 SpecialArray 构造函数，向其中传入了用于初始化数组的值，此后又调用了 toPipedString() 方法。

关于寄生构造函数模式，有一点需要说明：首先，返回的对象与构造函数或者与构造函数的原型属性之间没有关系；也就是说，构造函数返回的对象与在构造函数外部创建的对象没有什么不同。为此，不能依赖 instanceof 操作符来确定对象类型。由于存在上述问题，我们建议在可以使用其他模式的情况下，不要使用这种模式。

# 6.2.7 稳妥构造函数模式

道格拉斯·克罗克福德（Douglas Crockford）发明了 JavaScript 中的稳妥对象（durable objects）这个概念。**所谓稳妥对象，指的是没有公共属性，而且其方法也不引用 this 的对象**。稳妥对象最适合在一些安全的环境中（这些环境中会禁止使用 this 和 new），或者在防止数据被其他应用程序（如 Mashup 程序）改动时使用。**稳妥构造函数遵循与寄生构造函数类似的模式，但有两点不同：一是新创建对象的实例方法不引用 this；二是不使用 new 操作符调用构造函数**。按照稳妥构造函数的要求，可以将前面的 Person 构造函数重写如下。

```
function Person(name, age, job){

 //创建要返回的对象
 var o = new Object();

 //可以在这里定义私有变量和函数
 //添加方法
 o.sayName = function(){
 alert(name);
 };

 //返回对象
 return o;
}
```

> 注意，在以这种模式创建的对象中，除了使用 sayName()方法之外，没有其他办法访问 name 的值。

可以像下面使用稳妥的 Person 构造函数。

```
var friend = Person("Nicholas", 29, "Software Engineer");
friend.sayName(); //"Nicholas"
```

> 这样，变量 friend 中保存的是一个稳妥对象，而除了调用 sayName() 方法外，没有别的方式可以访问其数据成员。即使有其他代码会给这个对象添加方法或数据成员，但也不可能有别的办法访问传入到构造函数中的原始数据。

与寄生构造函数模式类似，使用稳妥构造函数模式创建的对象与构造函数之间也没有什么关系，因此 instanceof 操作符对这种对象也没有意义。
