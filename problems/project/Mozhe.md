记录墨者项目开发过程中遇到的问题

### CSS
1. flex布局问题
```
flex布局的justify-content: center属性与overflow: auto冲突，导致可滚动区域的内容展示不全。

暂时解决方案，将justify-content: center属性与overflow: auto分别定义在两个div上，坏处是多嵌套了一层div
```

2. CSS打包的问题
```
项目中使用两套css样式，一个是element的样式，另一个是项目中自定义的样式

import 'element-ui/lib/theme-chalk/index.css'
@import 'assets/css/index.styl'

在测试环境下，webpack打包会将先加载element样式，再加载项目样式
在线上环境下，正好相反，导致线上环境中的样式问题

需要详细了解webpack打包的机制

解决： 暂时将element的引入 放在页面最顶部
```

### Element UI框架
**期望测试的内容／或者等待学习的内容**
1. 更换主题
2. 国际化

**遇到的问题**
1. element-ui的el-input监听不了键盘事件的问题
```
原因应该是element-ui自身封装了一层div在input标签外面，把原来的事件隐藏了，所以如下代码运行是无响应的

@keyup.enter="setParams('start', 0)"


vue提供了一种解决方案，在某个组件的根元素上监听一个原生事件。可以使用 v-on 的修饰符 .native。例如：

@keyup.enter.native="setParams('start', 0)"
```

2. element-ui的el-menu在使用路由时，刷新页面，default-active会变成默认值，而当前页面的菜单不会被高亮
```
解决方案如下代码

// 设置 :default-active="'/' + $route.path.split('/')[1]"

<el-menu
      class="el-menu-vertical-demo"
      :collapse="open"
      router
      :default-active="'/' + $route.path.split('/')[1]"
      @select="select"
      background-color="#364150"
      text-color="#B4BCC8">

      <el-menu-item index="/dashboard" :route="{path: '/dashboard'}">
        <i class="icon-home"></i>
        <span slot="title">Dashboard</span>
      </el-menu-item>

      <el-menu-item index="/user" :route="{path: '/user'}">
        <i class="icon-user"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>

    </el-menu>
```