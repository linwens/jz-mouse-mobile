export const recordOption = {
  border: false,
  noIndex: true,
  stripe: false,
  headerCellStyle: {
    color: '#333',
    backgroundColor: '#F0F0F0'
  },
  rowClassName: 'mouse__table--stripe',
  align: 'left',
  menu: true,

  column: [{
    label: '操作类型',
    prop: 'operationType',
    align: 'center',
    dicData: [
      {
        label: '检测',
        value: 0
      }, {
        label: '处理',
        value: 1
      }
    ]
  }, {
    label: '处理检测时间',
    prop: 'time',
    format: 'yyyy-MM-dd hh:mm:ss',
    width: 200
  }, {
    label: '操作时间',
    prop: 'createTime',
    format: 'yyyy-MM-dd hh:mm:ss',
    width: 200
  }, {
    label: '操作人',
    prop: 'operationName',
    overHidden: true
  }]
}
