<template>
  <div></div>
</template>

<script>
import { Toast, Dialog } from 'vant'

export default {
  name: 'BreedAddMouse',
  data() {
    return {
      curMouseId: null, // 当前选中小鼠的id
      mouseInfo: {},
      mouseExptInfo: {},
      activeName: 'first', // 鼠笼tab
      color: '#C4C4CD',
      // 附件
      fileUrl: 'http://localhost/test.pdf',
      // 查看记录
      recordDialog: false,
      recordList: [{
        type: 1,
        checkTime: 1587375335305,
        handleTime: 1587375335305,
        name: '张三'
      }],
      page: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 10 // 每页显示多少条
      },
      tableLoading: false,
      // 鼠笼列表
      cageList: [],
      cagePage: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 10 // 每页显示多少条
      },
      isChoosingCage: false, // 正在选鼠笼标识
      curCageMouseList: {}, // 当前鼠笼中选中小鼠列表
      cacheChoicedList: [], // 缓存选中鼠笼中小鼠列表
      choicedList: [], // 当前选中的小鼠列表
      choosedCage: 0, // 当前选中的鼠笼id
      needType: null, // 区分实验组，繁育组
      item_index: null // 实验组的列表项id或者索引值
    }
  },
  computed: {
    // 周龄，不存数据库
    weekAge() {
      if (!this.mouseInfo.birthDate) return 0
      const duration = +new Date() - this.mouseInfo.birthDate * 1000
      const weeks = duration / 1000 / 60 / 60 / 24 / 7
      return Math.floor(weeks)
    },
    // 天
    dayAge() {
      if (!this.mouseInfo.birthDate) return 0
      const duration = +new Date() - this.mouseInfo.birthDate * 1000
      const days = duration / 1000 / 60 / 60 / 24 % 7
      return Math.floor(days)
    },
    // 实验进度
    percentage() {
      if (!this.mouseExptInfo.startTime || !this.mouseExptInfo.endTime) {
        return 0
      }
      // 总时间间距
      const start = this.mouseExptInfo.startTime * 1000
      const end = this.mouseExptInfo.endTime * 1000
      const duration = end - start
      const now = +new Date()
      return ((now - start) / duration).toFixed(3) * 100

    },
    // 测试时间进度
    testTimeScale() {
      // 总时间间距
      const start = this.mouseExptInfo.startTime * 1000
      const end = this.mouseExptInfo.endTime * 1000
      const duration = end - start
      const scale = (this.mouseExptInfo.testTime * 1000 - start) / duration
      return scale * 380
    },
    // 处理时间进度
    handleTimeScale() {
      // 总时间间距
      const start = this.mouseExptInfo.startTime * 1000
      const end = this.mouseExptInfo.endTime * 1000
      const duration = end - start
      const scale = (this.mouseExptInfo.handleTime * 1000 - start) / duration
      return scale * 380
    }
  },
  watch: {
    // 监听每个鼠笼选中的小鼠，最后合并所有选中小鼠
    'curCageMouseList.mouses'(n, o) {
      const _self = this
      let list = this.cacheChoicedList
      const hasThis = this.cacheChoicedList.filter((el) => {
        return el.cid === _self.curCageMouseList.cid
      }).length > 0

      if (hasThis) {
        list = this.cacheChoicedList.filter((el) => {
          return el.cid !== _self.curCageMouseList.cid
        })
      }
      list.push(this.curCageMouseList)
      this.$set(this, 'cacheChoicedList', list)
      // 降维数组
      const allMouses = list.reduce(function(total, val, idx, arr) {
        return total.concat(val.mouses)
      }, [])
      this.choicedList = allMouses
    }
  },
  created() {
    this.getCageList()
    this.needType = this.$route.params.type
    console.log('this.$route.params.index===', this.$route.params.index)
    if (typeof this.$route.params.index === 'number') { // 实验组会带一个列表项的id或者索引
      this.item_index = this.$route.params.index
    }
    // 如果缓存里有小鼠信息了，先清掉
    if (this.$store.getters.addingMouses) {
      this.$store.dispatch('app/clearMouses')
    }
  },
  methods: {
    goBack() {
      console.log(this.$route)
      this.$router.back()
    },
    // 确认添加
    goAdd(row) {
      if (this.choicedList.length === 0) {
        Toast.fail('请选择小鼠')
        return false
      }
      // 添加到繁育组操作
      if (this.needType === 'noBreed') {
        this.add2breed(this.choicedList)
      }
      // 添加到实验组操作
      if (this.needType === 'noExpt') {
        const cacheExpt = this.$store.getters.addingExpt
        const curExpt = cacheExpt[this.item_index]

        const ids = this.choicedList.map(el => {
          return el.miceInfoId
        })
        curExpt.experimentGroupSelectionMiceIds = ids.join(',')
        console.log(curExpt)
        cacheExpt[this.item_index] = curExpt
        this.$store.dispatch('app/cacheExpts', cacheExpt)
        this.doAdd(this.choicedList)
      }
    },
    // 添加到繁育组
    add2breed(curMouses) {
      // 当前选中鼠笼中被选中的小鼠数
      const curCageMouse = curMouses.filter((el) => {
        return el.cid === this.choosedCage
      })
      const curCage = this.cageList.filter((el) => {
        return el.id === this.choosedCage
      })
      console.log('curMouses==', curMouses, 'curCageMouse==', curCageMouse, 'curCage==', curCage)
      // 选中了同一笼内的所有鼠
      if (curCageMouse.length === curCage[0].miceInfoByMiceCageQueryVO.length) {
        this.doAdd(curCageMouse)
        return false
      }
      // 选中同一鼠笼中部分小鼠
      // if (curCageMouse.length === curMouses.length && curCageMouse.length < curCage[0].miceInfoByMiceCageQueryVO.length) {}
      // 选择了不同笼内的小鼠
      Dialog.confirm({
        title: '警告',
        message: '繁育组小鼠需要在同一个鼠笼中且鼠笼中小鼠不能有其他状态的小鼠。您当前所选的小鼠不符合繁育要求，是否选择空闲鼠笼进行移笼？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({
          name: 'mouseCage',
          params: {
            mouses: curMouses,
            type: 'breed'
          }
        })
      }).catch(function() {
      })
    },
    // 确认添加
    doAdd(mouseArr) {
      this.$store.dispatch('app/cacheChoosedMouse', mouseArr)
      // 填充繁育组信息
      const cacheBreed = this.$store.getters.addingBreed // 繁育组信息
      // 更新繁育组数据
      cacheBreed.miceIds = cacheBreed.miceIds.concat(mouseArr)
      this.$store.dispatch('app/cacheBreed', cacheBreed)
      this.goBack()
    },
    goPage(r, obj) {
      this.$router.push({ name: r, params: obj })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 鼠笼列表
    getCageList() {
      this.tableLoading = true
      fetchCageList(Object.assign({
        isMy: 0,
        operator: this.$store.getters.info.id,
        current: this.cagePage.page,
        size: -1
      })).then(response => {
        this.cageList = response.data.records
        this.cagePage.total = response.data.total
      }).finally(() => {
        this.tableLoading = false
      })
    }
  },
  // 路由守卫，复用的页面，判断来源
  beforeRouteEnter(to, from, next) {
    console.log('enter====>', to, from)
    next(vm => {
      // 通过 `vm` 访问组件实例
      console.log('enter===next=>', to, from)
      vm.needType = 'noBreed'
    })
  }
}
</script>

<style>

</style>