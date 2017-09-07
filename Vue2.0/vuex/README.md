# vuex状态管理
## 安装与引入
### 1.安装
> npm install vuex --save

### 2.新建文档store.js引入vuex
```
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
```
> 完成以上就成功创建了一个vuex的仓库文件了。

## state访问状态对象

[state](https://vuex.vuejs.org/zh-cn/state.html)我感觉像是vue里面的data，放的是基本属性。

### 1.在store.js文件里增加一个常量对象。
```
const state={
    count:1
}
```
### 2.用`export default`封装代码，让外部可以引用。
```
export default new Vuex.Store({
	state
})
```
### 3.vue组件中怎么用到呢，我们可以新建一个组件
```
<template>
  <div>
    <!-- 读取仓库里面的值 -->
    <p>{{$store.state.count}}</p>
  </div>
</template>
<script>
  //引入vuex仓库
  import store from '@/vuex/store'
  export default{
      data(){
          return{}
      },
      //使用仓库
      store        
  }
</script>
```
### 4.你会发现`<p>{{$store.state.count}}</p>`这里读取的值很长，并不美观，其实有更简洁的写法，就是通过`mapState`辅助函数来赋值
```
<template>
  <div>
    <!-- 在此就可以直接用count来代替$store.state.count了 -->
    <p>{{count}}</p>
  </div>
</template>
<script>
  //引入vuex仓库
  import store from '@/vuex/store'
  //从vuex中引入mapState
  import { mapState } from 'vuex'
  export default{
    data(){
      return{}
    },
    //在computed中相当于注册store.js中的count属性
    computed: {
    ...mapState(['count']),
    },
    //使用仓库
    store        
  }
</script>
```
## Mutations修改状态

更改 Vuex 的 store 中的状态的唯一方法是提交 [mutation](https://vuex.vuejs.org/zh-cn/mutations.html),我感觉 mutation 像是 vue 中的 methods 方法或者叫事件。

### 1.在store.js中加入两个方法
```
const mutations={
    add(state){
        state.count++;
    },
    reduce(state){
        state.count--;
    }
}
```
### 2.切记在`export default`封装代码中加入引用，让外部可以引用。
```
export default new Vuex.Store({
	state,
  //加入mutations
  mutations
})
```
### 3.在组件中加入两个按钮，使用仓库中的方法
```
<p>
  <button @click="$store.commit('add')">+</button>
  <button @click="$store.commit('reduce')">-</button>
</p>
```
> `$store.commit()`这个是vue中规定的调用写法

### 4.同样你会发现`$store.commit('add')`这里读取的值也很长，也并不美观，当然和上面的`state`一样有更简洁的写法，就是引入`mapMutations`
```
<template>
  <div>
    <p>{{count}}</p>  
    <p>
    <!-- 直接使用方法名 -->
      <button @click="add">+</button>
      <button @click="reduce">-</button>
    </p>
  </div>
</template>

<script>
import store from '@/vuex/store'
//引入mapMutations
import { mapState,mapMutations } from 'vuex'

export default {
  data () {
    return {}
  },
  computed: {
    ...mapState(['count']),
  },
  //注册store.js中的两个方法
  methods: {
    ...mapMutations(['add','reduce']),
  },
  store
}
</script>
```
### 5.传值

使用mutation是可以写入参数的，但样式上和我们一般看的不一样，因为它的方法默认接收state为第一参数，也就是说我们调用方法时输入的第一个参数，在store.js中的mutations里将是第二个参数。如下，修改store.js
```
const mutations = {
  //add方法中加入传值参数n
  add(state, n) {
    state.count += n;
  },
  reduce(state) {
    state.count--;
  }
}
```
组件中使用
```
<p>
  <!-- 直接传入参数即可 -->
  <button @click="add(10)">+</button>
  <button @click="reduce">-</button>
</p>
```

## getters计算过滤操作
[getters](https://vuex.vuejs.org/zh-cn/getters.html)就是一个过滤器的样子，感觉可以理解为vue中的计算方法computed。

### 1.我们首先要在store.js里用const声明我们的getters属性。
```
const getters = {
  //就是每次mutations改变state值时都先加上10这一步骤
  count: state => state.count += 10
}
```
### 2.同理在`export default`封装代码中加入引用。
```
export default new Vuex.Store({
	state,
  mutations,
  //加入getters的引用
  getters
})
```
### 3.在组件中使用
```
computed:{
    ...mapState(["count"]),
    count(){
        return this.$store.getters.count;
    }
},
```
> 写了这个配置后，在每次count的值发生变化的时候，都会进行加10的操作。

### 4.用mapGetters简化写法
```
<template>
  <div>
    <p>{{count}}</p>  
    <p>
      <button @click="add(10)">+</button>
      <button @click="reduce">-</button>
    </p> 
  </div>
</template>

<script>
import store from '@/vuex/store'
//引入mapGetters
import { mapState,mapMutations,mapGetters,} from 'vuex'

export default {
  data () {
    return {}
  },
  computed: {
    ...mapState(['count']),
    //注册使用mapGetters
    ...mapGetters(['count'])
  },
  methods: {
    ...mapMutations(['add','reduce']),
  },
  store
}
</script>
```
> 如此也能达到在每次count的值发生变化的时候，都会进行加10的操作。（就是执行了getters里的过滤方法了）

## actions异步修改状态
[actions](https://vuex.vuejs.org/zh-cn/actions.html)和之前讲的Mutations功能基本一样，不同点是，actions是异步的改变state状态，而Mutations是同步改变状态。而如何证明是异步的呢，我们以下实验一下即可

### 1.在store.js中加入
```
const actions = {
  addActions(context) {
    context.commit('add',10);
    setTimeout(()=>{
      context.commit('reduce');
      console.log('我后执行')      
    },3000);
    console.log('我先执行')
  },
  reduceActions({commit}) {
    commit('reduce');
  }
}
```
> context：上下文对象，可以理解为store本身。  
> {commit}：直接把commit对象传递进去，更容易理解为直接调用mutations里的方法。
### 2.同理在`export default`加入引用
```
export default new Vuex.Store({
  state,
  mutations,
  getters,
  //加入引用
  actions
})
```
### 3.在组件中使用（直接用mapActions了）
```
<template>
  <div>
    <p>{{count}}</p>  
    <p>
      <button @click="add(10)">+</button>
      <button @click="reduce">-</button>
    </p>
    <!-- 加入两个异步的按钮，调用actions里的方法 -->
     <p>
       异步</br>
      <button @click="addActions">+</button>
      <button @click="reduceActions">-</button>
    </p>  
  </div>
</template>

<script>
import store from '@/vuex/store'
//加入mapActions引用
import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vuex'
    }
  },
  computed: {
    ...mapState(['count']),
    ...mapGetters(['count'])
  },
  methods: {
    ...mapMutations(['add','reduce']),
    //注册方法
    ...mapActions(['addActions','reduceActions'])
  },
  store
}
</script>
```
> 在此，你点击异步的`+按钮`，然后查看控制台就会发现，先打印了`我先执行`然后三秒后再打印出`我后执行`的异步操作了。

## 最后放出store.js和组件模板的代码

### store.js
```
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  count: 1
}

const mutations = {
  add(state, n) {
    state.count += n;
  },
  reduce(state) {
    state.count--;
  }
}

const getters = {
  count: state => state.count += 10
}

const actions = {
  addActions(context) {
    context.commit('add',10);
    setTimeout(()=>{
      context.commit('reduce');
      console.log('我后执行')      
    },3000);
    console.log('我先执行')
  },
  reduceActions({commit}) {
    commit('reduce');
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
```
### 组件模板
```
<template>
  <div>
    <p>{{count}}</p>  
    <p>
      <button @click="add(10)">+</button>
      <button @click="reduce">-</button>
    </p>
     <p>
       异步</br>
      <button @click="addActions">+</button>
      <button @click="reduceActions">-</button>
    </p>  
  </div>
</template>

<script>
import store from '@/vuex/store'
import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'

export default {
  data () {
    return {}
  },
  computed: {
    ...mapState(['count']),
    ...mapGetters(['count'])
  },
  methods: {
    ...mapMutations(['add','reduce']),
    ...mapActions(['addActions','reduceActions'])
  },
  store
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
```





