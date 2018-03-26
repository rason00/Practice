# JavaScript-设计模式

## 单例模式

**<u>单例模式：又被称为单体模式，是只允许实例化一次的对象类。有时我们也用一个对象来规划一个命名空间，井井有条地管理对象上的属性和方法。</u>**

### 创建一个小型代码库

```javascript
var A = {
    
    Util: {
        util_method1: function() {},
        util_method2: function() {},
        // ...
    },
    
    Tool: {
        tool_method1: function() {},
        tool_method2: function() {},
        // ...
    },
    
    Ajax: {
        get: function() {},
        post: function() {},
        // ...
    },
    
    other: {
        // ...
    },
    
    // ...
}

// 想用公共模块、工具模块、ajax模块方法时如下
A.Util.util_method2();
A.Tool.tool_method1();
A.Ajax.get();
```

### 无法修改的静态变量

```javascript
var Conf = (function() {
    
    // 私有变量
    var conf = {
        MAX_NUM: 100,
        MIN_NUM: 1,
        COUNT: 1000
    }
    
    // 返回取值对象
    return {

        // 取值器方法
        get: function(name) {
            return conf[name] ? conf[name] : null;
        }
    }
})();
```

> 没有赋值器我们就不能修改内部定义的变量了，如要使用创建了的静态变量如下即可。

```javascript
var count = Conf.get('COUNT');
console.log(count);    // 1000
```

### 惰性单例

有时候对于单例对象需要延迟创建，所以在单例中还存在一种延迟的形式，可以称之为‘惰性创建’。

```javascript
// 惰性载入单例
var LazySingle = (function() {
    
    // 单例实例引用
    var _instance = null;
    
    // 单例
    function Single() {
        
        /* 这里定义私有属性和方法 */
        
        return {
            publicMethod: function() {},
            publicProperty: '1.0'
        }
    }
    
    // 获取单例对象接口
    return function() {
        
        // 如果为创建单例将创建单例
        if(!_instance) {
            _instance = Single();
        }
        
        // 返回单例
        return _instance;
    }
})();

// 测试
console.log(LazySingle().publicProperty);  // 1.0
```

> 以上笔记出自《JavaScript设计模式（张容铭）》