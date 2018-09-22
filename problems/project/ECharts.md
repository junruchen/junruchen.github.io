### ECharts 与 VUE
项目中使用Echarts制作了三个可视化大屏，出现了内存占用居高不下，内存泄漏问题

#### 解决方案
1. 按需引入ECharts图表和组件【92MB -> 80.8MB】

项目中大量使用了三种图表类型[折线图、饼图、柱状图]，仅使用了[legend、tooltip、datazoom]三种组件

因此：
```
import echarts from 'echarts'
```
变更为：
```
// 主模块引入
import echarts from 'echarts/lib/echarts'

// 图表引入
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'

// 组件引入
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/dataZoom'
```

2. 组件销毁
```
原因应该是element-ui自身封装了一层div在input标签外面，把原来的事件隐藏了，所以如下代码运行是无响应的

@keyup.enter="setParams('start', 0)"


vue提供了一种解决方案，在某个组件的根元素上监听一个原生事件。可以使用 v-on 的修饰符 .native。例如：

@keyup.enter.native="setParams('start', 0)"
```

3. element-ui的el-menu在使用路由时，刷新页面，default-active会变成默认值，而当前页面的菜单不会被高亮
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