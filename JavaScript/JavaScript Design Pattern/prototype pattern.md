# JavaScript-设计模式

## 原型模式

**<u>原型模式就是将原型对象指向创建对象的类，使这些类共享原型对象的方法和属性。JavaScript 是基于原型链实现对象之间的继承，这种继承是基于一种对象属性或者方法的共享，而不是对属性和方法的复制。</u>**

### 创建一个焦点图

页面中的焦点图其切换的动画是多样化的，可能上下，左右，渐隐等。

```javascript
// 图片轮播图类
var LoopImages = function(imgArr, container) {
    this.imagesArray = imgArr;        // 轮播图片数组
    this.container = container;       // 轮播图片容器
    this.createImage = function() {}  // 创建轮播图片
    this.changeImage = function() {}  // 切换下一张图片
}

// 上下切换
var SlideLoopImg = function(imgArr, container) {
    
    // 构造函数继承 图片轮播类
    LoopImages.call(this, imgArr, container);
    
    // 重写继承的切换下一张图片方法
    this.changeImage = function() {
        console.log('修改切换图片为上下切换');
    }
}

// 渐隐切换
var FadeLoopImg = function(imgArr, container, arrow) {
    LoopImages.call(this, imgArr, container);
    
    // 切换箭头 私有变量
    this.arrow = arrow;
    this.changeImage = function() {
        console.log('修改切换图片为渐隐切换');
    }
}

// 实例化一个渐隐切换图片类
var fadeImg = new FadeLoopImg([
    '01.png',
    '02.png',
    '03.png'
], 'slide', [
    'left.png',
    'right.png'
]);
fadeImg.changeImage();  // 修改切换图片为渐隐切换
```

> 基类 LoopImages 是要被子类继承的，此时每次子类继承都要创建一次父类，假如父类的构造函数中创建时存在很多消耗很大的逻辑，或者每次初始化都做一些重复的东西，这样就对性能消耗很大。

### 最优的解决方案

创建基类时，对于每次创建的一些简单而又差异化的属性放在构造函数中，将一些消耗资源较大的方法放到基类的原型中，这样可以避免很多不必要的消耗。

```javascript
// 图片轮播类
var LoopImages = function(imgArr, container) {
    this.imagesArray = imgArr;    	// 轮播图片数组
    this.container = container;     // 轮播图片容器
}

LoopImages.prototype = {
    
    // 创建轮播图片
    createImage: function() {
        console.log('创建轮播图片');
    },
    
    // 切换下一张图片
    changeImage: function() {
        console.log('切换下一张图片');
    }
}

// 上下切换
var SlideLoopImg = function(imgArr, container) {
    
    // 构造函数继承 图片轮播类
    LoopImages.call(this, imgArr, container);
}

SlideLoopImg.prototype = new LoopImages()

// 重写继承的切换下一张图片方法
SlideLoopImg.prototype.changeImage = function() {
    console.log('修改切换图片为上下切换');
}

// 渐隐切换
var FadeLoopImg = function(imgArr, container, arrow) {
    LoopImages.call(this, imgArr, container);
    
    // 切换箭头 私有变量
    this.arrow = arrow;
}

FadeLoopImg.prototype = new LoopImages();
FadeLoopImg.prototype.changeImage = function() {
    console.log('修改切换图片为渐隐切换');
}

// 实例化一个渐隐切换图片类
var fadeImg = new FadeLoopImg([
    '01.png',
    '02.png',
    '03.png'
], 'slide', [
    'left.png',
    'right.png'
]);

// 测试用例
console.log(fadeImg.container);   // slide
fadeImg.changeImage();            // 修改切换图片为渐隐切换
```

### 原型的拓展

原型对象是一个共享对象，继承时对它的一个指向引用，所以，对原型拓展，不论是子类还是父类的实例对象都会继承下来。

```javascript
// 父类拓展
LoopImages.prototypr.getImageLength = function() {
    return this.imageArray.length;
}

//子类拓展
FadeLoopImg.prototype.getContainer = function() {
    return this.container;
}

console.log(fadeImg.getImageLength());    // 3
console.log(fadeImg.getContainer());      // slide

```

> 不要随意修改基类原型，因为这会影响到其他继承基类的方法。

### 原型继承

原型模式更多的是用在对对象的创建上。比如创建一个实例对象的构造函数比较复杂，或者耗时比较长，或者通过创建多个对象来实现。此时最好不要用 new 关键字去复制这些类，但可以通过对这些对象或者方法进行复制来实现创建。首先要有一个原型模式的对象复制方法。

```javascript
/****
 * 基于已经存在的模版对象克隆出新对象的模式
 * arhuments[0], arguments[1], argument[2]: 参数1，2，3 表示模版对象
 * 注意。这里对模版引用类型的属性实质上进行浅复制（引用类型属性共享），当然根据需求可以自行深复制（引用类型属性复制）
 ****/
function prototypeExtend() {
    var F = function() {},  // 缓存类，为实例化返回对象临时创建
     args = arguments,      // 模版对象参数序列
        i = 0,
      len = args.length;
    for(; i < len; i++) {
        
        // 遍历每个模版对象中的属性
        for(var j in args[i]) {
            
            // 将这些属性复制到缓存类原型中
            F.prototype[j] = args[i][j];
        }
    }
    
    // 返回缓存类的一个实例
    return new F();
}
```

比如企鹅游戏中我们创建一个企鹅对象，如果游戏中没有企鹅基类，只提供一些动作模版对象，我们就可以通过实现对这些模版对象的继承来创建一个企鹅实例对象。

```javascript
var penguin = prototypeExtend({
    speed: 20,
    swim: function() {
        console.log('游泳速度 ' + this.speed);
    }
},{
    run: function(speed) {
        console.log('奔跑速度 ' + speed);
    }
},{
    jump: function() {
        console.log('跳跃动作');
    }
})
```

既然通过 prototypeExtend 创建的是一个对象，我们就无需再用 new 去创建新的实例对象，我们可以直接使用这个对象。

```javascript
penguin.swim();    // 游泳速度 20
penguin.run(10);   // 奔跑速度 10
penguin.jump();    // 跳跃动作
```

## 小结

<u>**原型模式可以让多个对象分享同一个原型对象的属性和方法，这也是一种继承法法，不过这种继承的实现是不需要创建的，而是将原型对象分享给那些继承的对象。当然有时需要让每个继承对象独立拥有一份原型对象，此时我们就需要对原型对象进行复制。**</u>

<u>**由此可以看出，原型对象更合适在创建复杂对象时，对于那些需求一直在变化而导致对象结构不停地改变时，将那些比较稳定的属性与方法共用而提取的继承实现。**</u>

> 以上笔记出自《JavaScript设计模式（张容铭）》