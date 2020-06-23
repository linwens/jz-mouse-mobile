<template>
  <div class="mouse">
    <!-- 顶部栏 -->
    <top-bar :active-key="0" />
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
                <van-progress ref="progress" :percentage="percentage" :stroke-width="16" color="#58A2FB" :text-color="percentage > 80 ? '#fff' : '#58A2FB'" />
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
                <set-time v-if="mouseExptInfo.experimentId && (isAdmin || activeName === 'myCage')" :id="mouseExptInfo.experimentId" :end-time="mouseExptInfo.endTime" @done="setProgress" />
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
              <p>体重：<span>{{ mouseInfo.weight ? `${mouseInfo.weight}g` : '' }}</span></p>
              <p>笼位号：<span>{{ mouseInfo.cageNo }}</span></p>
            </div>
            <div class="df s-aic">
              <p>周龄：<span>{{ mouseInfo.birthDate ? `${weekAge}周${dayAge}天` : '' }}</span></p>
              <p>状态：<span>{{ mouseInfo.miceStatusDesc }}</span></p>
            </div>
            <div class="df s-aic">
              <p class="df s-aic">显示颜色：<i class="mouse__info--i dib" :style="{'width': '16px', 'height': '16px', 'backgroundColor': mouseInfo.miceColor}" /></p>
              <p>附件：<view-files :id="mouseInfo.miceId" biz-type="mice" btn-type="text" btn-text="查看" /></p>
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
    <!-- tabs -->
    <div class="mouse__tabs">
      <van-tabs v-model="activeName" animated color="#00CB7C" line-width="50%" @click="handleClick">
        <van-tab title="我的鼠笼" name="myCage">
          <div class="mouse__btns df s-jcsb s-aic">
            <div class="df s-jcsb" style="width: 50%">
              <add-cage-btn :disabled="isBuilding || isDeling" @done="getCageList" />
              <van-button class="w75 mr8" round size="small" color="#00CB7C" plain type="primary" :disabled="isBuilding || isDeling" @click="moveCage()">{{ moveBtnText }}</van-button>
            </div>
            <div class="df s-jcsb" style="width: 50%">
              <van-button class="w75 ml8" round size="small" color="#00CB7C" plain type="primary" :disabled="isMoving || isBuilding || isDeling" @click="goAdd()">新建小鼠</van-button>
              <van-button class="w75" round size="small" color="#00CB7C" plain type="primary" :disabled="isMoving || isDeling" @click="goBuild()">{{ buildBtnText }}</van-button>
            </div>
          </div>
          <div class="mouse__btns df s-jcsb s-aic">
            <div class="df s-jcsb" style="width: 50%">
              <van-button class="w75" round size="small" color="#00CB7C" plain type="primary" :disabled="isMoving || isBuilding" @click="goDel()">{{ delBtnText }}</van-button>
              <van-button class="w75 mr8" round size="small" color="#00CB7C" plain type="primary" :disabled="isMoving || isBuilding || isDeling || (!curMouseId && !choosedCage)" @click="goEdit()">编辑</van-button>
            </div>
            <div class="df s-jcfe" style="width: 50%">
              <van-button class="w75" round size="small" color="#EB5444" plain type="primary" @click="cancel()">取消</van-button>
            </div>
          </div>
          <div class="mouse__cages">
            <mouse-cage
              v-for="(item, index) in cageList"
              :key="index"
              :all-data="item"
              :is-active="isMoving || isBuilding&&(choosedCage === item.id) || isDeling"
              :disabled="(isMoving && transStep < 2 ) || (isBuilding&&(choosedCage !== item.id))"
              :choiced-list.sync="curCageMouseList"
              :is-choosing-cage="isChoosingCage"
              :cage-id="item.id"
              :choosed-cage.sync="choosedCage"
              :cur-mouse-id.sync="curMouseId"
              :cur-mouse.sync="mouseInfo"
              :cur-mouse-expt.sync="mouseExptInfo"
              @refresh="getCageList"
            />
          </div>
        </van-tab>
        <van-tab title="其他鼠笼" name="otherCage">
          <div class="mouse__cages">
            <mouse-cage
              v-for="(item, index) in cageList"
              :key="index"
              :shift="false"
              :all-data="item"
              :is-active="false"
              :disabled="false"
              :choiced-list.sync="curCageMouseList"
              :is-choosing-cage="isChoosingCage"
              :cage-id="item.id"
              :choosed-cage.sync="choosedCage"
              :cur-mouse-id.sync="curMouseId"
              :cur-mouse.sync="mouseInfo"
              :cur-mouse-expt.sync="mouseExptInfo"
            />
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <!-- 编辑鼠笼 -->
    <van-dialog
      v-model="cageDialog"
      title="编辑"
      get-container="body"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="#FF6358"
      @confirm="editCageSubmit"
    >
      <van-form :show-error-message="false">
        <van-field
          v-model="editCageForm.cageNo"
          label="笼位号"
          placeholder="请输入笼位号"
          :rules="[{ required: true, message: '笼位号不能为空' }]"
        />
        <van-field
          v-model="editCageForm.roomNo"
          label="房间号"
          placeholder="请输入房间号"
        />
        <van-field
          v-model="editCageForm.shelvesNo"
          label="架号"
          placeholder="请输入架号"
        />
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar/index.vue'
import MouseCage from '@/components/MouseCage/index.vue'
import AddCageBtn from '@/components/Dialogs/AddCage'
import ViewFiles from '@/components/ViewFiles'
import UploadBtn from '@/components/Dialogs/Upload'
import ExptRecord from '@/components/Dialogs/ExptRecord'
import SetTime from '@/components/Dialogs/SetTime'
import ShowFamily from '@/components/Dialogs/ShowFamily'
import {
  Swipe,
  SwipeItem,
  Tab,
  Tabs,
  Button,
  Dialog,
  Toast,
  Progress,
  Form,
  Field
} from 'vant'
import { transferCage, editCage, delMiceByMiceId, fetchCageList, getMouseExpInfo } from '@/api/mouse'
import { dateTimeFormatter } from '@/utils'

export default {
  name: 'MouseIndex',
  components: {
    'van-button': Button,
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
    'van-tab': Tab,
    'van-tabs': Tabs,
    'van-progress': Progress,
    'van-form': Form,
    'van-field': Field,
    [Dialog.Component.name]: Dialog.Component,
    ExptRecord,
    SetTime,
    ShowFamily,
    AddCageBtn,
    TopBar,
    UploadBtn,
    ViewFiles,
    MouseCage
  },
  data() {
    return {
      pgWidth: 0, // 进度条长度
      isAdmin: false,
      curMouseId: null, // 当前选中小鼠的id
      mouseInfo: {},
      mouseExptInfo: {},
      testTimeScale: 0, // 测试时间标记
      handleTimeScale: 0, // 处理时间标记
      activeName: 'myCage', // 鼠笼tab
      color: '#C4C4CD',
      // 附件
      fileUrl: 'http://localhost/test.pdf',
      tableLoading: false,
      // 鼠笼列表
      cageList: [],
      cagePage: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 10 // 每页显示多少条
      },
      // 移笼相关
      transStep: 0, // 移笼步骤操作节点
      moveBtnText: '移笼',
      isMoving: false, // 正在移笼标识
      isChoosingCage: false, // 正在选鼠笼标识
      curCageMouseList: {}, // 当前鼠笼中选中小鼠列表
      cacheChoicedList: [], // 缓存选中鼠笼中小鼠列表
      choicedList: [], // 当前选中的小鼠列表
      choosedCage: null, // 当前选中的鼠笼id
      // 新建子鼠
      buildStep: 0, // 新建子鼠步骤操作节点
      buildBtnText: '新建子鼠',
      isBuilding: false, // 正在新建子鼠标识
      // 删除小鼠
      delBtnText: '移除小鼠',
      isDeling: false, // 正在删除小鼠标识
      // 编辑鼠笼
      cageDialog: false,
      editCageForm: {
        cageNo: '',
        roomNo: '',
        shelvesNo: ''
      }
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
      return Math.floor(days) + 1
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
      const now = +new Date() > end ? end : +new Date()
      return (((now - start) / duration) * 100).toFixed(2)
    }
    /* // 测试时间进度
    testTimeScale() {
      console.log('=-#########=====', this.mouseExptInfo)
      // 总时间间距
      const start = this.mouseExptInfo.startTime * 1000
      const end = this.mouseExptInfo.endTime * 1000
      const duration = end - start
      const scale = (this.mouseExptInfo.testTime * 1000 - start) / duration
      return scale * 380
    },
    // 处理时间进度
    handleTimeScale() {
      console.log('=-=-=-=====', this.mouseExptInfo)
      // 总时间间距
      const start = this.mouseExptInfo.startTime * 1000
      const end = this.mouseExptInfo.endTime * 1000
      const duration = end - start
      const scale = (this.mouseExptInfo.handleTime * 1000 - start) / duration
      return scale * 380
    } */
  },
  watch: {
    'mouseExptInfo.experimentId'(n, o) {
      console.log('id变化了', n)
      // this.setTestTimeScale()
      // this.setHandleTimeScale()
    },
    // 监听每个鼠笼选中的小鼠，最后合并所有选中小鼠
    'curCageMouseList.mouses'(n, o) {
      if (!n) return // 如果mouses不存在，说明是清空，则不执行后续逻辑
      const _self = this
      let list = this.cacheChoicedList
      // 当前缓存的鼠笼里包含当前选中的鼠笼，即：有当前鼠笼了
      const hasThis = this.cacheChoicedList.filter((el) => {
        return el.cid === _self.curCageMouseList.cid
      }).length > 0

      if (hasThis) { // 把缓存的鼠笼删掉，后面重新塞入当前选中的鼠笼
        list = this.cacheChoicedList.filter((el) => {
          return el.cid !== _self.curCageMouseList.cid
        })
      }
      // 重新塞入鼠笼
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
    this.isAdmin = this.$store.getters.info.admin
    this.getCageList()
    this.pgWidth = window.innerWidth - 56
  },
  methods: {
    showTips(val) {
      const time = dateTimeFormatter(val * 1000, 'yyyy-MM-dd hh:mm')
      Toast(time)
    },
    setHandleTimeScale(time) {
      const start = this.mouseExptInfo.startTime * 1000
      const end = this.mouseExptInfo.endTime * 1000
      const duration = end - start
      const scale = (time * 1000 - start) / duration
      return (scale * this.pgWidth).toFixed(2)
    },
    setTestTimeScale(time) {
      const start = this.mouseExptInfo.startTime * 1000
      const end = this.mouseExptInfo.endTime * 1000
      const duration = end - start
      const scale = (time * 1000 - start) / duration
      return (scale * this.pgWidth).toFixed(2)
    },
    editCageSubmit() {
      this.cageDialog = false
      // 提交成功后触发done
      const { id: userId } = this.$store.getters.info
      editCage(Object.assign(this.editCageForm, {
        id: this.choosedCage,
        operator: userId
      })).then((res) => {
        Toast.success('编辑鼠笼成功')
        this.getCageList()
      })
    },
    // 编辑查看小鼠
    goEdit() {
      if (!this.curMouseId && this.choosedCage) { // 编辑鼠笼
        console.log(this.choosedCage)
        const curCage = this.cageList.filter((el) => {
          return el.id === this.choosedCage
        })[0]
        console.log(curCage)
        const { cageNo, roomNo, shelvesNo } = curCage
        this.editCageForm.cageNo = cageNo
        this.editCageForm.roomNo = roomNo
        this.editCageForm.shelvesNo = shelvesNo
        this.cageDialog = true
        return
      }
      if (this.curMouseId) { // 跳转小鼠编辑页
        const id = this.curMouseId
        this.$router.push({ name: 'MouseEdit', params: { id, canEdit: 1 }})
      }
    },
    // 新增小鼠
    goAdd(row) {
      this.goPage('MouseAddMouse', { id: 1 })
    },
    goPage(r, obj) {
      console.log('跳转啊', r, obj)
      this.$router.push({ name: r, params: obj })
    },
    handleClick(tab, event) {
      console.log(tab, event)
      this.getCageList()
    },
    // 鼠笼列表
    getCageList() {
      this.tableLoading = true
      fetchCageList(Object.assign({
        operator: this.activeName === 'myCage' ? this.$store.getters.info.id : '',
        // current: this.cagePage.page,
        size: -1, // -1获取全部数据； this.cagePage.limit,
        isMy: this.activeName === 'myCage' ? 0 : 1
      })).then(response => {
        this.cageList = response.data.records
        this.cagePage.total = response.data.total
      }).finally(() => {
        this.tableLoading = false
      })
    },
    // 移笼操作
    moveCage() {
      if (this.transStep === 0 && this.choosedCage) {
        this.choosedCage = null
      }
      // 选中了鼠笼后
      if (this.choosedCage && this.choicedList.length > 0) {
        Dialog.confirm({
          title: '警告',
          message: '是否确认移笼?',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doChageCage()
        }).catch(function() {
        })
        return
      }

      const noMouse = this.cageList.length === 0
      if (noMouse) { // 当前没老鼠
        Toast.fail({
          message: '系统中没有小鼠，请添加小鼠后进行操作'
        })
      } else {
        if (this.transStep === 0) {
          this.isMoving = true
          this.transStep = 1
          this.moveBtnText = '下一步'
          return
        }
        // 当前选中了小鼠
        if (this.transStep === 1 && this.choicedList.length > 0) {
          this.isChoosingCage = true
          this.transStep = 2
          Toast.fail({
            message: '请选择鼠笼'
          })
        }
        if (this.transStep === 1 && this.choicedList.length === 0) {
          Toast.fail({
            message: '请选择小鼠'
          })
        }
      }
    },
    // 确定移笼
    doChageCage() {
      const ids = this.choicedList.map(el => {
        return el.miceInfoId
      })
      transferCage({
        cageId: this.choosedCage,
        miceId: ids
      }).then((res) => {
        this.$set(this, 'choicedList', [])
        this.$set(this, 'cacheChoicedList', [])
        this.$set(this, 'curCageMouseList', {})

        this.cancel()
        this.getCageList()
      })
    },
    // 取消操作
    cancel() {
      this.moveBtnText = '移笼'
      this.isMoving = false
      this.transStep = 0
      this.buildStep = 0
      this.buildBtnText = '新增子鼠'
      this.isBuilding = false
      this.delBtnText = '移除小鼠'
      this.isDeling = false

      this.isChoosingCage = false
      // this.choicedList = []
      this.$set(this, 'choicedList', [])
      this.$set(this, 'cacheChoicedList', [])
      this.$set(this, 'curCageMouseList', {})
      this.choosedCage = null
      this.curMouseId = null
      this.getCageList() // 为了规避多选框勾选没法取消的折中办法
    },
    // 新增子鼠操作
    goBuild(row) {
      // 如果没有选中鼠笼
      console.log(this.choosedCage, this.curCageMouseList, this.cageList, this.cacheChoicedList)
      if (!this.choosedCage) {
        Toast.fail({
          message: '请先选择鼠笼'
        })
      } else {
        // 如果当前鼠笼里没有小鼠(找到当前鼠笼，获取小鼠信息)
        const thisCageNoMouse = this.cageList.filter((el) => {
          return el.id === this.choosedCage
        })[0].miceInfoByMiceCageQueryVO.length === 0
        if (thisCageNoMouse) {
          Toast.fail({
            message: '当前鼠笼中没有小鼠，请添加小鼠后进行操作'
          })
          return
        }
        if (this.buildStep === 0) {
          this.isBuilding = true
          this.buildStep = 1
          this.buildBtnText = '下一步'
          return
        }

        // 当前选中了小鼠
        if (this.buildStep === 1 && this.choicedList.length > 0) {
          const genders = this.choicedList.map(el => {
            return el.gender
          })
          if (genders.length !== 2 || genders[0] === genders[1]) {
            Toast.fail({
              message: '请选择两只不同性别的小鼠'
            })
            return false
          }
          const curCage = this.cageList.filter((el) => {
            return el.id === this.choosedCage
          })
          const { cageNo, roomNo, shelvesNo } = curCage[0]
          this.$store.dispatch('app/cacheChildMouse', {
            parents: this.choicedList,
            cage: {
              cageNo,
              roomNo,
              shelvesNo
            }
          })
          this.goPage('MouseAddChild')
        }

        if (this.buildStep === 1 && this.choicedList.length === 0) {
          Toast.fail({
            message: '请选择小鼠'
          })
        }
      }
    },
    // 删除小鼠
    goDel(row) {
      if (this.isDeling) {
        // 当前选中了小鼠
        if (this.choicedList.length > 0) {
          console.log(this.choicedList)
          const miceIds = this.choicedList.map((el) => {
            return el.miceInfoId
          })
          console.log(miceIds)
          Dialog.confirm({
            title: '警告',
            message: '是否确认删除小鼠?',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log('提交删除')
            delMiceByMiceId({
              miceId: miceIds
            }).then((res) => {
              Toast.success('删除小鼠成功')
              this.getCageList()
            })
            this.cancel()
          }).catch(function() {
          })
        } else {
          Toast.fail({
            message: '没有选中小鼠，请添加小鼠后进行操作'
          })
        }
      } else {
        this.delBtnText = '下一步'
        this.isDeling = true
      }
    },
    // 设置时间后修改进度条
    setProgress(obj) {
      getMouseExpInfo(this.curMouseId).then((res) => {
        console.log('getMouseExpInfo', res)
        this.$set(this, 'mouseExptInfo', res.data[0] || {})
      })
    }
  }
}
</script>

<style lang="scss">
  .mouse {

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
      min-height: 252px;
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

    .van-progress__pivot {
      background: none!important;
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
