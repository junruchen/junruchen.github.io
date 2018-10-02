### JS 问题
#### 一、 按钮快速点击，导致提交多次请求的问题
**问题描述**：对于post put delete类型的form，快速多次点击按钮时会触发多次请求

**最终效果**：快速多次点击时，仅触发一次请求

**解决方案一【form提交的地方单独控制请求】**

坏处是：
- 状态判断的代码与接口请求的代码混合在一起
- 每个需要触发接口请求的按钮都需要增加该逻辑，在项目已经完成的情况下工作量大
- 无法控制get类型请求

方法：

- 增加一个变量记录接口请求的状态，从而控制按钮的`disabled`
- ElementUI 中 button 组件提供 `loading` 属性，可实现控制按钮点击
- 借助 `promise`
  ```
  module.submit = function() {
    if (this.promise_.state() === 'pending') {
      return
    }
    return this.promise_ = $.post('/api/save')
  }
  ```

**解决方案二【请求层统一处理】**

判断接口请求类型，

post put delete: 如果相同的请求处于执行中状态，且前后间隔不超过1s，则忽略该请求

get：【或者get不需要处理？？？】如果有多个相同的请求，则返回最后一次请求，忽略之前的请求
