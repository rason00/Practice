# 组件通信

## 父子组件通信

> 通过[props](https://cn.vuejs.org/v2/api/#props)接收信息。

- HTML
````
<div id = 'app'>
  <!-- msg是需要传递过去的值 -->
  <fu msg = 'fusay'></fu>
</div>
````

- JS
```
Vue.component('fu', {
  //模板中使用fu传来的值显示在p上
  template: `
    <p>{{ this.msg }}</p>
  `,
  //用props获取fu传来的值
  props: ['msg']
})
// 实例一个vue
new Vue({
  el: '#app',
})

```

## 子父组件通信

> 通过触发实例事件[$emit](https://cn.vuejs.org/v2/api/#vm-emit-event-…args)达到传参。

- html
```
<div id = 'app'>
  <fu></fu>
</div>
```

- JS
```
Vue.component('fu', {
  //监听zi组件的触发事件，触发一个函数，显示传递过来的数值。
  template: `
    <div>
      <zi @showZi="showMsg"></zi>
      zisay:{{zimsg}}
    </div>
  `,
  methods: {
    //触发的函数用来赋值
    showMsg(data) {
      this.zimsg = data;
    }
  },
  data() {
    return {
      zimsg: ''
    }
  }
})
Vue.component('zi', {
  //添加click方法，实现点击显示内容
  template: `
  <button @click='onClick()'>say</button>
  `,
  methods: {
    onClick() {
      //click方法触发实例事件，第一个参数是触发实例的名称，第二个参数是触发实例的值（数据）
      this.$emit('showZi', 'showzimsg');
    }
  }
})

new Vue({
  el: '#app',
})
```

## 平行组件通信

> 使用外部的事件调度器实现平行通信

- html
```
<div id="app">
  <one></one>
  <two></two>
</div>
```

- JS
```
//设置外部调度器
var e = new Vue();

Vue.component('one', {
  //设置input按确定或按钮触发click事件后传递信息
  template: `
    <div>
      <input @keyup.enter='say' v-model='oneSay'>
      <button @click='say'>say</button>
    </div>
  `,
  methods: {
    //click触发实例事件，使用外部调度器接收
    say() {
      e.$emit('oneSaySomething', this.oneSay);
    }
  },
  data() {
    return {
      oneSay: '',
    }
  }
})
Vue.component('two', {
  template: `
    <div>
      one say: {{receiveSay}}
    </div>
    `,
  mounted() {
    //存储this，因为下面e.后this将指定为e的外部调度器
    let me = this;
    //监听外部调度器中，one触发的实例方法
    e.$on('oneSaySomething', (data) => {
      me.receiveSay = data;
    })
  },
  data() {
    return {
      receiveSay: '',
    }
  }
})

new Vue({
  el: '#app',
})
```
