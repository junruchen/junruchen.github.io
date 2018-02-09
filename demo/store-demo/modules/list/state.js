import config from 'src/config/static'
export default {
  queryParams: {
    searchType: '1',
    searchContent: '',
    demandStatus: '',
    dutyPerson: '',
    source: '',
    gmtStart: '',
    gmtEnd: ''
  },
  updateDemandParams: {
    id: '',
    companyName: '',
    contacter: '',
    dutyPerson: '',
    followStatus: '',
    contactTel: ''
    // status:''
  },
  dialogDetail: {
    id: '',
    source: '',
    publishTime: '',
    status: '',
    inquiry: '',
    originalDemand: '',
    buyerDetail: {},
    sellerDetail: {
      sellerPhone: '',
      sellerCompanyName: ''
    }
  },
  queryDetailParams: {
    virtualId: '',
    demandId: '',
    demandType: ''
  },
  queryProcessRecordParams: {
    demandId: ''
  },
  searchBack: {
    searchType: '',
    searchCnt: ''
  },
  updateProcessRecordParams: {
    content: '',
    demandId: ''
  },
  updateDemandStateBatchParams: {},
  inline: false,
  processRecord: [],
  dutyPersonMap: {},
  dateRange: '',
  demandStatusTags: config.demandStatusTags,
  sourceTags: config.sourceTags,
  searchTypeList: config.searchTypeList,
  stateTags: config.stateTags,
  demandIdentification: config.demandIdentification,
  hasSearch: false,
  multipleSelection: [],
  demandList: [],
  currentPage: 1,
  totalPage: 0,
  loading: false,
  cancelReasonList: {},
  deleteReasonList: {}
}
