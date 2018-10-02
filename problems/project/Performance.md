## 性能优化
项目中使用Echarts制作了三个可视化大屏，出现了内存占用居高不下的问题

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

2. 组件销毁时，取消监听事件
3. 组件销毁时，取消定时事件
4. resize scroll 事件节流防抖