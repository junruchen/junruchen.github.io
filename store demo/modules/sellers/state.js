export default {
  queryParams: {
    // 公司类型
    types: '',
    // 经营模式
    model: '',
    // 星级
    level: '',
    // 搜索内容
    searchWord: '',
    // 地区
    area: '-1'
  },
  // 邀请列表
  inviteList: [],
  // 卖家列表
  sellerList: [],
  // 总页数
  totalPage: 0,
  // 当前页
  currentPage: 1,
  // 每页显示条数
  pageSize: 0,
  demandId: '',
  // 当前需求已经邀请的卖家数量
  addedCount: 0,
  // 加载动画状态
  loading: false,
  // 每次最多邀请数量
  inviteListMaxLength: 20,
  // 一条需求最多邀请数量
  demandSellerMaxLength: 50
}
