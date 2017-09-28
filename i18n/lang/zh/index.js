export const zh = {
  header: {
    task: '任务',
    settings: '设置',
    signout: '退出'
  },
  menu: '{0}管理', // 如：服务管理
  common: {
    null: '暂无{0}', // 如：暂无任务，暂无机器
    search: '请输入搜索关键字',
    preview: '概览',
    all: '全部{0}', // 如：全部服务
    placeholder: '请输入{0}', // 如：请输入模版名称
    selectPlaceholder: '请选择{0}', // 如：请输入模版名称
    content: {
      name: '{0}名称',
      des: '{0}描述',
      info: '{0}详情',
      email: '{0}邮箱'
    },
    btn: {
      add: '添加{0}',
      new: '新建{0}', // 如：新建 或者新建服务
      edit: '编辑{0}', // 如：编辑 或者编辑某某
      confirm: '确定',
      cancel: '取消',
      del: '删除{0}', // 如：删除 或者删除模版
      handel: '操作',
      init: '初始化',
      check: '检查',
      change: '更改{0}' // 如 修改权限
    },
    position: {
      home: '首页',
      back: '返回上一页'
    },
    callback: {
      success: '{0}成功', // 如：创建成功，编辑成功
      error: '{0}失败', // 如：创建失败，编辑失败
      abnormal: '网络异常'
    },
    alert: '您确认{0}该{1}?' // 如：您确认删除某产品？ 您确认重启某服务？
  },
  type: {
    permissions: '权限',
    role: '角色',
    user: '用户',
    template: '模版',
    params: '参数组模版',
    software: '软件模版',
    plugin: '配件模版',
    alert: '报警规则模版',
    product: '产品',
    pool: '资源',
    resource: '资源池',
    backup: '备份池',
    reserve: '备用池',
    host: '机器',
    service: '服务'
  },
  permissions: {
    userDes: '管理用户，分配角色和服务',
    roleList: ['超级管理员', '资源管理员', '运维DBA', '开发DBA'],
    roleDesList: ['管理用户，分配角色和服务；管理角色，配置角色权限',
      '管理资源池、备份池、备用池',
      '管理服务，拥有全部的权限',
      '管理服务，拥有部分权限'],
    permissionsList: ['可修改模版参数', '可配置用户权限', '可备份权限', '可恢复权限', '可导出实例权限']
  },
  template: {
    paramVal: '参数取值',
    paramScope: '参数范围',
    alert: '规则'
  },
  productDomain: '产品域名',
  pool: {
    oversold: '超卖比例',
    cpuWaterline: 'CPU水位线',
    memWaterline: '内存水位线',
    diskIoWaterline: '磁盘容量水位线',
    diskUseWaterline: '磁盘利用率水位线',
    host: {
      id: '机器ID',
      ip: '机器IP',
      dirType: '存储类型',
      dir: '存储目录',
      status: '机器状态',
      cpus: 'CPU个数',
      mem: '内存容量'
    }
  }
}
