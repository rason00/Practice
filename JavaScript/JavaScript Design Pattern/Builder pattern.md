# JavaScript-设计模式

## 建造者模式

将一个复杂对象的构建层与其表示层相互分离，同样的构建过程可以采取不同的表示。

<u>**工厂模式不关心你创建的过程，仅仅需要知道你最终的创建结果，而建造者模式虽然最终目的也是为了创建对象，但它更关心的是创建这个对象的整个过程。**</u>

例如：创建一个应聘者实例，创建过程中要注意这位应聘者有哪些兴趣爱好、他的姓名等信息，他所期望的职位，等等。

```javascript
// 创建一个人类
var Human = function(param) {
    
    // 技能
    this.skill = param && param.skill || '保密';
    
    // 兴趣爱好
    this.hobby = param && param.hobby || '保密';
}

// 人类原型方法
Human.prototype = {
    getSkill : function() {
        return this.skill;
    },
    getHobby : function() {
        return this.hobby;
    }
}

// 实例化姓名类
var Named = function(name) {
    var that = this;
    
    // 构造器
    // 构造函数解析姓名的姓与名
    (function(name, that) {
        that.wholeName = name;
        if(name.indexOf(' ') > -1) {
            that.FirstName = name.slice(0, name.indexOf(' '));
            that,secondName = name.slice(name.indexOf(' '));
        }
    })(name, that);
}

// 实例化职位类
var Work = function(work) {
    var that = this;
    
    // 构造器
    // 构造函数中通过传入职位特征来设置相应职位以及描述
    (function(work, that) {
        switch(work) {
            case 'code':
                that.work = '工程师';
                that.workDescript = '每天沉迷编程';
                break;
            case 'UI':
            case 'UE':
                that.work = '设计师';
                that.workDescript = '设计是一种艺术'
                break;
            default:
                that.work = work;
                that.workDescript = '对不起，我们不清楚你职业的描述'
        }
    })(work, that)
}

// 更换期望职位
Work.prototype.changeWork = function(work) {
    this.work = work;
}

// 添加职位描述
Work.prototype.changeDescript = function(setence) {
    this.workDescript = setence;
}
```

创建一位应聘者

```javascript
/***
 * 创建应聘者
 * 参数 name：姓名（全名）
 * 参数 work：期望职位
 **/
var Person = function(name, work) {
    
    // 创建应聘者缓存对象
    var _person = new Human();
    
    // 创建应聘者姓名解析对象
    _person.name = new Named(name);
    
    // 创建应聘者期望职位
    _person.work = new Work(work);
    
    // 返回应聘者对象
    return _person;
}

// 使用
var person = new Person('xiao ming', 'code');

console.log(person.skill);              // 保密
console.log(person.name.FirstName);     // xiao
console.log(person.work.work);          // 工程师
console.log(person.work.workDescript);  // 每天沉迷编程

person.work.changeDescript('更改描述');
console.log(person.work.workDescript);  // 更改描述
```

**<u>这种方式对于整体对象类的拆分无形中增加了结构的复杂性，因此如果对象颗粒度很小，或者模块间的复用率很低并且变动不大，最好还是创建整体对象。</u>**
> 以上笔记出自《JavaScript设计模式（张容铭）》