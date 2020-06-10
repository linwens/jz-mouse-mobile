export const genesOption = {
  border: false,
  noIndex: true,
  stripe: true,
  headerCellStyle: {
    color: '#333',
    backgroundColor: '#F0F0F0'
  },
  rowClassName: 'mouse__table--stripe',
  align: 'left',
  menu: true,
  menuWidth: 60,

  column: [{
    label: '基因型名称',
    prop: 'geneName',
    overHidden: true
  }, {
    label: '饲养条件',
    prop: 'miceCondition',
    width: 80,
    overHidden: true
  }, {
    label: '健康状态',
    prop: 'status',
    width: 80,
    overHidden: true
  }, {
    label: '毛色',
    prop: 'color',
    width: 80,
    overHidden: true
  }, {
    label: '应用领域',
    prop: 'area',
    overHidden: true
  }]
}
