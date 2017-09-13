# 3.6 语句

**ECMA-262 规定了一组语句（也称为流控制语句）。语句通常使用一或多个关键字来完成给定任务。语句可以很简单，例如通知函数退出；也可以比较复杂，例如指定重复执行某个命令的次数**。

# 内容涵盖

1. if 语句
2. do-while 语句
3. while 语句
4. for 语句
5. for-in 语句
6. label 语句
7. break 和 continue 语句
8. with 语句
9. switch 语句

# 3.6.1 if 语句

大多数编程语言中最为常用的一个语句就是 if 语句。请看下面的例子。

```
if (i > 25) {
 alert("Greater than 25.");
} else if (i < 0) {
 alert("Less than 0.");
} else {
 alert("Between 0 and 25, inclusive.");
} 
```

# 3.6.2 do-while 语句

**do-while 语句是一种后测试循环语句，即只有在循环体中的代码执行之后，才会测试出口条件**。

换句话说，**在对条件表达式求值之前，循环体内的代码至少会被执行一次**。以下是 do-while 语句的语法：

```
do {
 statement
} while (expression);
下面是一个示例：
var i = 0;
do {
 i += 2;
} while (i < 10);
alert(i); 
```

> 像 do-while 这种后测试循环语句最常用于循环体中的代码至少要被执行一次的情形。

# 3.6.3 while 语句

**while 语句属于前测试循环语句，也就是说，在循环体内的代码被执行之前，就会对出口条件求值**。以下是 while 语句的例子：

```
var i = 0;
while (i < 10) {
 i += 2;
} 
```

> 变量 i 开始时的值为 0，每次循环都会递增 2。开始就判断条件语句，而只要 i 的值小于 10，循环就会继续下去。

# 3.6.4 for 语句

**for 语句也是一种前测试循环语句，但它具有在执行循环之前初始化变量和定义循环后要执行的代码的能力**。以下是 for 语句的示例：

```
var count = 10;
for (var i = 0; i < count; i++){
 alert(i);
} 

// 以上 for 循环与以下 while 循环功能相同

var count = 10;
var i = 0;
while (i < count){
 alert(i);
 i++;
} 
```

> 使用 while 循环做不到的，使用 for 循环同样也做不到。也就是说，for 循环只是把与循环有关的代码集中在了一个位置。

for 语句中的初始化表达式、控制表达式和循环后表达式都是可选的。将这三个表达式全部省略，就会创建一个无限循环，例如：

```
for (;;) { // 无限循环
 doSomething();
}
```

而只给出控制表达式实际上就把 for 循环转换成了 while 循环，例如：

```
var count = 10;
var i = 0;
for (; i < count; ){
 alert(i);
 i++;
} 
```

> 由于 for 语句存在极大的灵活性，因此它也是 ECMAScript 中最常用的一个语句。

# 3.6.5 for-in 语句

for-in 语句是一种精准的迭代语句，可以用来枚举对象的属性。以下是 for-in 语句的一个示例：

```
for (var propName in window) {
 document.write(propName);
}
```

在这个例子中，我们使用 for-in 循环来显示了 BOM 中 window 对象的所有属性。每次执行循环时，都会将 window 对象中存在的一个属性名赋值给变量 propName。这个过程会一直持续到对象中的所有属性都被枚举一遍为止。

如果表示要迭代的对象的变量值为 null 或 undefined，for-in 语句会抛出错误。ECMAScript 5 更正了这一行为；对这种情况不再抛出错误，而只是不执行循环体。为了保证最大限度的兼容性，**建议在使用 for-in 循环之前，先检测确认该对象的值不是 null 或 undefined**。

# 3.6.6 label 语句

使用 label 语句可以在代码中添加标签，以便将来使用,label 可以break或者continue联合使用，如下例子：

```
var temp=0;  
start:  
for(var i=0; i<5; i++) {  
    for(var m=0; m<5; m++) {  
        if(m==1) {  
            break start;  // 终止循环 start ，在这即终止了整个 for 循环。
        }  
        temp++;  
    }  
}  
alert(temp);  
```

> 弹出的结果是 1 如果不加直接 break 而不是 break start 的话弹出的将是5；

# 3.6.7 break 和 continue 语句

break 和 continue 语句用于在循环中精确地控制代码的执行。其中，**break 语句会立即退出循环，强制继续执行循环后面的语句。而 continue 语句虽然也是立即退出循环，但退出循环后会从循环的顶部继续执行**。请看下面的例子：

```
var num = 0;
for (var i=1; i < 10; i++) {
 if (i % 5 == 0) {
 break;
 }
 num++;
}
alert(num); //4 
```

> 在变量 i 等于 5 时，循环总共执行了 4 次；而 break 语句的执行，导致了循环在 num 再次递增之前就退出了。

如果把 break 替换为 continue 的话，则可以看到另一种结果：

```
var num = 0;
for (var i=1; i < 10; i++) {
 if (i % 5 == 0) {
 continue;
 }
 num++;
}
alert(num); //8
```

> 当变量 i 等于 5 时，循环会在 num 再次递增之前退出，但接下来执行的是下一次循环，即 i 的值等于 6 的循环。于是，循环又继续执行，直到 i 等于 10 时自然结束。而 num 的最终值之所以是 8，是因为 continue 语句导致它少递增了一次。

break 和 continue 语句都可以与 label 语句联合使用，从而返回代码中特定的位置。这种联合使用的情况多发生在循环嵌套的情况下，如下面的例子所示：

```
var num = 0;
outermost:
for (var i=0; i < 10; i++) {
 for (var j=0; j < 10; j++) {
 if (i == 5 && j == 5) {
 break outermost;
 }
 num++;
 }
}
alert(num); //55 
```

> 添加 label 这个标签的结果将导致 break 语句不仅会退出内部的 for 语句（即使用变量 j 的循环），而且也会退出外部的 for 语句（即使用变量 i 的循环）

同样，continue 语句也可以像这样与 label 语句联用，如下面的例子所示：

```
var num = 0;
outermost:
for (var i=0; i < 10; i++) {
 for (var j=0; j < 10; j++) {
 if (i == 5 && j == 5) {
 continue outermost;
 }
 num++;
 }
}
alert(num); //95 
```

> 当 j 是 5时，continue 语句执行，而这也就意味着内部循环少执行了 5 次，因此 num 的结果是 95。

# 3.6.8 with 语句

with 语句的作用是将代码的作用域设置到一个特定的对象中。定义 with 语句的目的主要是为了简化多次编写同一个对象的工作，如下面的例子所示：

```
var qs = location.search.substring(1);
var hostName = location.hostname;
var url = location.href;

// 上面几行代码都包含 location 对象。如果使用 with 语句，可以把上面的代码改写成如下所示：

with(location){
 var qs = search.substring(1);
 var hostName = hostname;
 var url = href;
}

// 或以下例子：

var sMessage = "hello";
with(sMessage) {
  alert(toUpperCase());	//输出 "HELLO"
}
```

在这个重写后的例子中，使用 with 语句关联了 location 对象。这意味着在 with 语句的代码块内部，每个变量首先被认为是一个局部变量，而如果在局部环境中找不到该变量的定义，就会查询 location 对象中是否有同名的属性。如果发现了同名属性，则以 location 对象属性的值作为变量的值。

**严格模式下不允许使用 with 语句，否则将视为语法错误**。

> 由于大量使用 with 语句会导致性能下降，同时也会给调试代码造成困难，因此在开发大型应用程序时，不建议使用 with 语句。

# 3.6.9 switch 语句

switch 语句与 if 语句的关系最为密切，而且也是在其他语言中普遍使用的一种流控制语句。如下所示：

```
if (i == 25){
 alert("25");
} else if (i == 35) {
 alert("35");
} else if (i == 45) {
 alert("45");
} else {
 alert("Other");
}

// 而与此等价的 switch 语句如下所示：

switch (i) {
 case 25:
 alert("25");
 break;
 case 35:
 alert("35");
 break;
 case 45:
 alert("45");
 break;
 default:
 alert("Other");
}
```

通过为每个 case 后面都添加一个 break 语句，就可以避免同时执行多个 case 代码的情况。假如确实需要混合几种情形，不要忘了在代码中添加注释，说明你是有意省略了 break 关键字，如下所示：

```
switch (i) {
 case 25:
 /* 合并两种情形 */
 case 35:
 alert("25 or 35");
 break;
 case 45:
 alert("45");
 break;
 default:
 alert("Other");
}
```

在 switch 语句中可以使用任何数据类型（在很多其他语言中只能使用数值），无论是字符串，还是对象都没有问题。其次，每个 case 的值不一定是常量，可以是变量，甚至是表达式。请看下面这个例子：

```
switch ("hello world") {
 case "hello" + " world":
 alert("Greeting was found.");
 break;
 case "goodbye":
 alert("Closing was found.");
 break;
 default:
 alert("Unexpected message was found.");
}
// 结果就会显示 "Greeting was found."

var num = 25;
switch (true) {
 case num < 0:
 alert("Less than 0.");
 break;
 case num >= 0 && num <= 10:
 alert("Between 0 and 10.");
 break;
 case num > 10 && num <= 20:
 alert("Between 10 and 20.");
 break;
 default:
 alert("More than 20.");
}
// 结果弹出 "More than 20."
```

> **switch 语句在比较值时使用的是全等操作符，因此不会发生类型转换（例如，字符串"10"不等于数值 10）**。
