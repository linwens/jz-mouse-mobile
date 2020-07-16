<template>
  <div class="mouse">
    <!-- info -->
    <div>
      <van-swipe :show-indicators="false" :loop="false">
        <van-swipe-item>
          <div class="mouse__info1">
            <h1 class="fs16">品系信息</h1>
            <div class="df s-aic">
              <p>品系：<span>{{ mouseInfo.varietiesName }}</span></p>
              <p>毛色：<span>{{ mouseInfo.geneColor }}</span></p>
            </div>
            <div class="df s-aic">
              <p>基因型：<span>{{ mouseInfo.geneName }}</span></p>
            </div>
            <div class="df s-aic">
              <p>饲养条件：<span>{{ mouseInfo.miceCondition }}</span></p>
            </div>
            <div class="df s-aic">
              <p>健康状况：<span>{{ mouseInfo.geneStatus }}</span></p>
            </div>
            <div class="df s-aic">
              <p>应用领域：<span>{{ mouseInfo.area }}</span></p>
            </div>
            <div class="df s-aic">
              <p>更改位置时间：<span>{{ mouseInfo.miceUpdateTime * 1000 | timeFormat('yyyy年MM月dd日 hh:mm:ss') }}</span></p>
            </div>
            <div class="df s-aic">
              <p>小鼠家谱：<show-family v-if="curMouseId" :mice-id="curMouseId" btn-type="text" /></p>
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="mouse__info1">
            <h1 class="fs16 mb5">实验信息</h1>
            <div class="df s-aic">
              <p>实验组名称：<span>{{ mouseExptInfo.experimentName }}</span></p>
              <p>分组名称：<span>{{ mouseExptInfo.sampleGroupName }}</span></p>
            </div>
            <div class="df s-aic">
              <p>起止时间：<span>{{ mouseExptInfo.startTime * 1000 | timeFormat('yyyy.M.dd') }}-{{ mouseExptInfo.endTime * 1000 | timeFormat('yyyy.M.dd') }}</span></p>
            </div>
            <div class="df s-aic">
              <p>处理：<span>{{ mouseExptInfo.eventName }}</span></p>
            </div>
            <h1 class="fs16 mt5 mb5">实验进度</h1>
            <div>
              <p class="df">
                检测实验结果:
                <view-files v-if="mouseExptInfo.experimentId" :id="mouseExptInfo.experimentId" class="ml10 mr15" btn-type="text" btn-text="查看" biz-type="experiment" />
                <upload-btn v-if="mouseExptInfo.experimentId && (isAdmin || activeName === 'myCage')" :id="mouseExptInfo.experimentId" btn-text="上传" biz-type="experiment" class="dib" />
              </p>
            </div>
            <div class="mt20 mb20">
              <div v-if="Object.keys(mouseExptInfo).length > 0" class="pos-r">
                <svg-icon v-for="item in mouseExptInfo.experimentTimes.filter(el=>{ return el.operationType === 1})" :key="item.time+item.operationType" icon-class="loc-green" class="mouse__progrTag mouse__progrTag--g" :style="{'left': setHandleTimeScale(item.time) + 'px'}" @click="showTips(item.time)" />
                <svg-icon v-for="item in mouseExptInfo.experimentTimes.filter(el=>{ return el.operationType === 0})" :key="item.time+item.operationType" icon-class="loc-yellow" class="mouse__progrTag mouse__progrTag--y" :style="{'left': setTestTimeScale(item.time) + 'px'}" @click="showTips(item.time)" />
                <van-progress :percentage="Number(percentage)" :stroke-width="16" color="#58A2FB" text-color="#fff" />
              </div>
            </div>
            <div class="df s-jcc s-aic">
              <p>
                <i class="fs10 mr10">
                  <svg-icon icon-class="circle" class="fs10 cl-green" />
                  处理时间
                </i>
                <i class="fs10">
                  <svg-icon icon-class="circle" class="fs10 cl-yellow" />
                  检测时间
                </i>
              </p>
              <div class="df s-jcc s-aic">
                <set-time v-if="mouseExptInfo.experimentId && (isAdmin || activeName === 'myCage')" :id="mouseExptInfo.experimentId" :start-time="mouseExptInfo.startTime" :end-time="mouseExptInfo.endTime" @done="setProgress" />
                <expt-record v-if="mouseExptInfo.experimentId" :id="mouseExptInfo.experimentId" class="ml10" />
              </div>
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="mouse__info1">
            <h1 class="fs16">基本信息</h1>
            <div class="df s-aic">
              <p>系统编号：<span>{{ mouseInfo.miceNo }}</span></p>
            </div>
            <div class="df s-aic">
              <p>性别：<span>{{ mouseInfo.gender >= 0 ? (mouseInfo.gender === 0 ? '雄' : '雌') : '' }}</span></p>
              <p>出生日期：<span>{{ mouseInfo.birthDate * 1000 | timeFormat('yyyy-MM-dd') }}</span></p>
            </div>
            <div class="df s-aic">
              <p>体重：<span>{{ mouseInfo.weight }}</span></p>
              <p>笼位号：<span>{{ mouseInfo.cageNo }}</span></p>
            </div>
            <div class="df s-aic">
              <p>周龄：<span>{{ mouseInfo.birthDate ? `${weekAge}周${dayAge}天` : '' }}</span></p>
              <p>状态：<span>{{ mouseInfo.miceStatusDesc }}</span></p>
            </div>
            <div class="df s-aic">
              <p class="df s-aic">显示颜色：<i class="mouse__info--i dib" :style="{'width': '16px', 'height': '16px', 'backgroundColor': mouseInfo.miceColor}" /></p>
              <p>附件：<span class="txt-btn--green">查看</span></p>
            </div>
            <div class="df s-aic pos-r">
              <p>标记：<span>21</span></p>
              <p class="pos-r">
                <span class="mouse__info--span">标记:</span>
                <i v-if="mouseInfo.position === 'custom'" class="mouse__info--i">{{ mouseInfo.sign }}</i>
                <img v-else class="pos-a mouse__info-sign" :src="`http://bllb-animal-test.oss-cn-hangzhou.aliyuncs.com/mice-sign/${mouseInfo.filePrefix}/${mouseInfo.sign}.jpg`" alt="">
              </p>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="mouse__cages">
      <mouse-cage
        v-for="(item, index) in cageList"
        :key="index"
        :need-type="needType"
        :all-data="item"
        :is-active="true"
        :choiced-list.sync="curCageMouseList"
        :is-choosing-cage="isChoosingCage"
        :cage-id="item.id"
        :choosed-cage.sync="choosedCage"
        :cur-mouse-id.sync="curMouseId"
        :cur-mouse.sync="mouseInfo"
        :cur-mouse-expt.sync="mouseExptInfo"
        :cant-choice-mouses="mouseIds"
      />
    </div>
    <bottom-btn>
      <template slot="confirm">
        <van-button class="w150" round size="small" color="#32C985" type="info" @click="goAdd()">确认添加</van-button>
      </template>
    </bottom-btn>
  </div>
</template>

<script>
import BottomBtn from '@/components/BottomBtn/index.vue'
import MouseCage from '@/components/MouseCage/index.vue'
// import AddCageBtn from '@/components/Dialogs/AddCage'
import ViewFiles from '@/components/ViewFiles'
import UploadBtn from '@/components/Dialogs/Upload'
import ExptRecord from '@/components/Dialogs/ExptRecord'
import SetTime from '@/components/Dialogs/SetTime'
import ShowFamily from '@/components/Dialogs/ShowFamily'
import {
  Swipe,
  SwipeItem,
  Button,
  Dialog,
  Toast,
  Progress
} from 'vant'
import { fetchCageList } from '@/api/mouse'

export default {
  name: 'ExptAddMouse',
  components: {
    'van-button': Button,
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
    'van-progress': Progress,
    BottomBtn,
    ExptRecord,
    SetTime,
    ShowFamily,
    // AddCageBtn,
    UploadBtn,
    ViewFiles,
    MouseCage
  },
  data() {
    return {
      mouseIds: [], // 已被选的老鼠id
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
      const { table: cacheExpt } = this.$store.getters.addingExpt
      const curExpt = cacheExpt[this.item_index]
      console.log('选中的小鼠===', n, cacheExpt, curExpt, this.item_index)
      if (n[0] && (curExpt.experimentGroupSelectionMiceIds.indexOf(n[0].miceInfoId + '') > -1)) {
        Toast.fail('当前小鼠已被选择，请更换小鼠')
        return
      }
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
      // const allMouses = list.reduce(function(total, val, idx, arr) {
      //   return total.concat(val.mouses)
      // }, [])
      // 取最新加入的小鼠
      const allMouses = list[list.length - 1].mouses
      console.log('allMouses===', allMouses)
      this.choicedList = allMouses
    }
  },
  created() {
    this.getCageList()
    this.needType = this.$route.params.type
    console.log('this.$route.params.index===', this.$route.params.index)
    // 实验组会带一个列表项的id或者索引
    console.log(this.$route.params.index, this.$store.getters.addingExpt)
    this.mouseIds = this.$store.getters.addingExpt.table.reduce(function(total, val, idx, arr) {
      return total.concat(val.experimentGroupSelectionMiceIds)
    }, []) // 告诉鼠笼被选了的老鼠id
    this.item_index = this.$route.params.index >= 0 ? this.$route.params.index : this.$store.getters.addingExpt.$index
  },
  methods: {
    goBack() {
      console.log(this.$route)
      this.$router.back()
    },
    // 确认添加
    goAdd(row) {
      console.log(this.choicedList)
      if (this.choicedList.length === 0) {
        Toast.fail('请选择小鼠')
        return false
      }
      // 添加到繁育组操作
      if (this.needType === 'noBreed') {
        this.add2breed(this.choicedList)
      }
      // 添加到实验组操作
      if (this.needType === 'noExpt' || Object.keys(this.$store.getters.addingExpt).length > 0) {
        const { table: cacheExpt, form, tags } = this.$store.getters.addingExpt
        const curExpt = cacheExpt[this.item_index]

        const newIds = this.choicedList.map(el => {
          return el.miceInfoId + ''
        })
        const ids = curExpt.experimentGroupSelectionMiceIds.concat(newIds)
        curExpt.experimentGroupSelectionMiceIds = ids

        cacheExpt[this.item_index] = curExpt
        this.$store.dispatch('app/cacheExpts', {
          form,
          tags,
          table: cacheExpt
        })
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
        message: '您当前所选的小鼠不符合繁育要求，请将选择空闲鼠笼进行移笼？',
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
    })
  }
}
</script>

<style lang="scss">
  .mouse {
    margin-bottom: 80px;

    .van-swipe-item {
      padding: 10px 15px;
      background-color: #F6F6F6;
    }

    &__btns {
      padding: 7px 15px;
    }

    &__cages {
      box-sizing: border-box;
      width: 100%;
      padding: 0 15px;
      margin-top: 20px;
    }

    &__info1 {
      height: 252px;
      padding: 10px 15px;
      background-color: #fff;
      font-size: 14px;

      h6 {
        color:#333
      }

      p {
        min-width: 47%;
        line-height: 1.6;
        color: #969799;
      }
      span {
        color: #333;
      }
    }

    &__progrTag {
      position: absolute;
      z-index: 1;
      &--g{
        top: -12px;
      }
      &--y{
        bottom: -12px;
      }
    }

    &__info-sign {
      top: 0;
      left: 0;
      width: 142px;
      height: 80px;
      border: 1px solid #eee;
    }
  }
</style>
