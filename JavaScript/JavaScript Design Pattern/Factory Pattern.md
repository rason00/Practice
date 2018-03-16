# JavaScript-设计模式

## 简单工厂模式

封装一个函数，使用的时候，只要知道这个函数，就可以通过这个函数创建我们需要的对象。

例如，去体育商品店卖体育器材，我们不必关心里面有什么商品，去到只需问售货员，她会帮你找到东西。

```javascript
// 篮球类
var Basketball = function() {
    this.intro = '篮球盛行于美国';
}

Basketball.prototype = {
    getBallSize: function() {
        console.loge('篮球很大');
    },
    // more code
}

// 足球类
var Football = function() {
    this.intro = '巴西足球很厉害';
}

Football.prototype = {
    getBallSize : function() {
        console.log('足球很大');
    },
    // more code
}

// 体育商店
var sport = function(name) {
    switch(name) {
        case 'NBA': return new Basketball();
        case 'wordCup': return new Football();
    }
}

// 使用
var footnall = sport('wordCup');
console.log(footnall);			// <==Football
console.log(footnall.intro);	// ‘巴西足球很厉害’
footnall.getBallSize();			// 足球很大
```

上面是通过 new 实例化对象创建的，还可以通过创建一个新对象，提炼相同之处，然后包装增强其属性来实现简单工厂模式。

例如，一本书都有序、目录、正文的结构，然后其不同的地方是书名、出版时间等。

```javascript
// 工厂模式
function book(name, time) {
    
    // 创建一个对象，并对对象拓展属性和方法
    var o = new Object();
    o.name = name;
    o.time = time;
    o.getName = function() {
        console.log(this.name);
    };
    
    // 返回对象
    return o;
}

var book1 = book('js', '2018');	
var book2 = book('css', '2017');

book1.getName();	// js
book2.getName();	// css
```



## 工厂模式

工厂模式本意是将实际创建对象工作推迟到子类中，安全起见，我么采用安全模式类，把创建对象的积累放到原型中即可。

### 安全模式类

**<u>安全模式类就是为了防止调用时没有使用 new</u>** 

```javascript
var Demo = function() {
    if(!(this instanceof Demo)) {
        return new Dwmo();
    }
}

Demo.prototypr = {
    show: function() {
        console.log('获取成功');
    }
}

var d = new Demo();
d.show();	// 获取成功

var e = Demo();
e.show();	// 获取成功
```

创建一个书本类

```Javascript
var Book = function(name, content) {
    if(this instanceof Book) {
        var s = new this[name](content);
        return s;
    } else {
        return new Book(name, content);
    }
}

Book.prototype = {
    java: function(content) {
        console.log(content);
    },
    javascript: function(content) {
        console.log(content);
    },
    css: function(content) {
        console.log(content);
	}
}

var book1 = new Book('java', 'hello java');

var book2 = Book('javascript', 'hello javascript');
```

## 小结

1. **<u>简单工厂模式适用于单类对象，工厂模式适合创建多类对象</u>**
2. **<u>工厂模式主要为了创建对象实例，关心的是最终产出（创建）的是什么，不关心创建过程。</u>**

> 以上笔记出自《JavaScript设计模式（张容铭）》