<template>
  <div class="mouse-edit">
    <van-tabs v-model="activeName" color="#00CB7C" line-width="50%">
      <van-tab title="小鼠信息">
        <van-form :show-error-message="false">
          <van-field v-model="form.fatherId" label="父鼠编号" />
          <van-field v-model="form.motherId" label="母鼠编号" />
          <van-field
            v-model="varietiesName"
            required
            label="品系"
            disabled
            placeholder="请选择品系"
            :rules="[{ required: true, message: '请选择品系' }]"
          >
            <template #button>
              <choose-variety v-if="canEdit" :cur-variety.sync="curVariety" />
            </template>
          </van-field>
          <div class="genes-box">
            <van-field
              v-model="currentGene.geneName"
              required
              readonly
              label="基因型"
              placeholder="请输入基因型名称"
              :rules="[{ required: true, message: '请输入基因型名称' }]"
            />
            <van-field
              v-model="currentGene.miceCondition"
              readonly
              label="饲养条件"
              placeholder="请输入饲养条件"
            />
            <van-field
              v-model="currentGene.status"
              readonly
              label="健康状态"
              placeholder="请输入健康状态"
            />
            <van-field
              v-model="currentGene.color"
              readonly
              label="毛色"
              placeholder="请输入毛色"
            />
            <van-field
              v-model="currentGene.area"
              readonly
              label="应用领域"
              placeholder="请输入应用领域"
              rows="2"
              autosize
              type="textarea"
            />
            <div class="df s-jcfe s-aic pb10">
              <genes-choose :id="varietiesId" btn-text="选择" class="mr16" :genes.sync="genes" />
              <add-genes-btn
                :varieties-id="varietiesId"
                :varieties-name="varietiesName"
                :genes-data.sync="genes"
              />
            </div>
          </div>
          <van-field v-model="form.miceNo" label="编号" />
          <div class="file--span fs14">
            <span>状态 {{ statusLable }}</span>
          </div>
          <van-select
            :cur-val.sync="form.position"
            btn-text="标记"
            :columns="[
              {
                label: '头部',
                value: '头部'
              },
              {
                label: '足部',
                value: '足部'
              },
              {
                label: '自定义',
                value: 'custom'
              }
            ]"
          />
          <van-field v-model="form.sign" placeholder="输入1-99" />
          <div v-show="form.position !== 'custom'" class="mouse__edit--img mt8">
            <img v-if="form.position !== 'custom'" class="sign-img" :src="`http://bllb-animal-test.oss-cn-hangzhou.aliyuncs.com/mice-sign/${form.filePrefix}/${form.sign}.jpg`" alt="">
            <span class="pl16 pr16 fs14">示例：</span>
            <img class="sign-img" src="@/assets/test.jpg" alt="">
          </div>
          <div>
            <img src="" alt="">
            <img src="" alt="">
          </div>
          <van-field v-model="form.weight" label="体重">
            <template #extra>
              <span>g</span>
            </template>
          </van-field>
          <time-select btn-text="出生日期" :time.sync="form.birthDate">
            <template slot="placeholder">
              <p>请选择出生日期</p>
            </template>
          </time-select>
          <div class="df s-aic">
            <van-field v-model="weekAge" label="周龄" readonly>
              <template #extra>
                <span>周</span>
              </template>
            </van-field>
            <van-field v-model="dayAge" readonly>
              <template #extra>
                <span>天</span>
              </template>
            </van-field>
          </div>
          <van-select
            :cur-val-num.sync="form.pureHeterozygote"
            btn-text="纯/杂合子"
            :columns="[
              {
                label: '纯合子',
                value: 0
              },
              {
                label: '杂合子',
                value: 1
              },
              {
                label: '未测试',
                value: 2
              }
            ]"
          />
          <div class="file--span fs14">
            <span>展示颜色：<color-picker :color.sync="form.miceColor" /></span>
          </div>
          <time-select btn-text="分笼时间" :time.sync="form.separateCageRemindTime">
            <template slot="placeholder">
              <p>请选择分笼时间</p>
            </template>
          </time-select>
          <van-select
            btn-text="分笼提醒"
            :cur-val-num.sync="form.separateCageRemindFlag"
            :columns="[
              {
                label: '是',
                value: 0
              },
              {
                label: '否',
                value: 1
              }
            ]"
          >
            <template slot="placeholder">
              <p>是否开启处理时间提醒</p>
            </template>
          </van-select>
          <time-select btn-text="表型鉴定时间" :time.sync="form.phenotypicIdentificationRemindTime">
            <template slot="placeholder">
              <p>请选择表型鉴定时间</p>
            </template>
          </time-select>
          <van-select
            btn-text="表型鉴定提醒"
            :cur-val-num.sync="form.phenotypicIdentificationRemindFlag"
            :columns="[
              {
                label: '是',
                value: 0
              },
              {
                label: '否',
                value: 1
              }
            ]"
          >
            <template slot="placeholder">
              <p>是否开启表型鉴定时间提醒</p>
            </template>
          </van-select>
          <van-field
            v-model="cageInfo.cageNo"
            label="笼位号"
            placeholder="请输入笼位号名称"
          />
          <div class="cage-box">
            <van-field
              v-model="cageInfo.cageNo"
              readonly
              label="笼位号"
              placeholder="请输入笼位号名称"
            />
            <van-field
              v-model="cageInfo.roomNo"
              readonly
              label="房间号"
              placeholder="请输入房间号"
            />
            <van-field
              v-model="cageInfo.shelvesNo"
              readonly
              label="架号"
              placeholder="请输入架号"
            />
          </div>
          <div class="file--span fs14">
            <p>附件：
              <view-files v-if="canEdit" :id="curMouseId" biz-type="mice" btn-type="text" btn-text="查看附件" />
              <upload-btn v-if="canEdit" :id="curMouseId" btn-text="上传附件" biz-type="mice" class="dib ml18" />
            </p>
          </div>
        </van-form>
      </van-tab>
      <van-tab title="实验记录">
        <!-- 列表 -->
        <collapse v-for="item in tableData" :key="item.id" :footer="false">
          <template slot="title">
            <div class="df s-aic s-jcsb">
              <span>{{ item.experimentName }}</span>
              <i class="cl-grey-9">{{ item.startTime * 1000 | timeFormat('yyyy.MM.dd') }}-{{ item.endTime * 1000 | timeFormat('yyyy.MM.dd') }}</i>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>分组名称：<span>{{ item.sampleGroupName }}</span></p>
              <p>处理：<span>{{ item.eventName }}</span></p>
            </div>
            <div class="df s-aic">
              <p>检测：<span>{{ item.testName }}</span></p>
            </div>
          </template>
        </collapse>
      </van-tab>
    </van-tabs>
    <!-- 底部按钮 -->
    <bottom-btn :right-btn-text="canEdit ? '确定' : '编辑'" @confirm="save" />
  </div>
</template>

<script>
import Collapse from '@/components/Collapse/index.vue'
import ChooseVariety from '@/components/Dialogs/ChooseVariety'
import BottomBtn from '@/components/BottomBtn/index.vue'
import VanSelect from '@/components/Form/VanSelect.vue'
import TimeSelect from '@/components/Form/TimeSelect.vue'
import AddGenesBtn from '@/components/Dialogs/AddGenes.vue'
import ColorPicker from '@/components/Dialogs/ColorPicker.vue'
import ViewFiles from '@/components/ViewFiles'
import UploadBtn from '@/components/Dialogs/Upload'
import GenesChoose from '@/components/Dialogs/GenesChoose'
import { getMouseInfo, getMouseExpInfo, getCageInfo, editMouse } from '@/api/mouse'
import { Form, Field, Toast, Tab, Tabs } from 'vant'

export default {
  name: 'MouseEdit',
  components: {
    ViewFiles,
    'van-form': Form,
    'van-field': Field,
    'van-tab': Tab,
    'van-tabs': Tabs,
    Collapse,
    ChooseVariety,
    VanSelect,
    TimeSelect,
    BottomBtn,
    ColorPicker,
    AddGenesBtn,
    UploadBtn,
    GenesChoose
  },
  data() {
    return {
      canEdit: false, // 是否可编辑
      activeName: 0,
      curMouseId: 0,
      // 总表单
      form: {
        vid: '',
        fatherId: null,
        motherId: null,
        genotypes: null,
        maleMiceNum: 0,
        femaleMiceNum: 0,
        weight: null,
        birthDate: null,
        pureHeterozygote: null,
        color: '#00CB7C',
        separateCageRemindTime: null,
        separateCageRemindFlag: 0,
        phenotypicIdentificationRemindTime: null,
        phenotypicIdentificationRemindFlag: 0,
        deathStatus: 0,
        delFlag: 0,
        cageId: 0,
        roomNo: 0,
        shelvesNo: 0,
        miceNo: '',
        position: '',
        sign: '',
        filePrefix: '',
        status: 1 // 0:无，1：闲置，2：繁育，3：实验,4:手动处死5,实验处死
      },
      cacheFilesList: [],
      // 品系选择
      curVariety: {},
      varietiesName: '',
      varietiesId: '',
      // 基因型选择
      genes: '',
      // 当前选择的基因型
      currentGene: {
        varietiesName: '',
        geneName: '',
        miceCondition: '',
        status: '',
        color: '',
        area: ''
      },
      // ------------实验记录
      tableLoading: false,
      page: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 10 // 每页显示多少条
      },
      tableData: [],
      // 笼位号id
      cid: null,
      cageInfo: {
        cageNo: null,
        roomNo: null,
        shelvesNo: null
      }
    }
  },
  computed: {
    // 周龄，不存数据库
    weekAge() {
      if (!this.form.birthDate) return 0
      const duration = +new Date() - this.form.birthDate
      const weeks = duration / 1000 / 60 / 60 / 24 / 7
      return Math.floor(weeks)
    },
    // 天
    dayAge() {
      if (!this.form.birthDate) return 0
      const duration = +new Date() - this.form.birthDate
      const days = duration / 1000 / 60 / 60 / 24 % 7
      return Math.floor(days)
    },
    // statusLable
    statusLable() {
      const MAP = {
        0: '无',
        1: '闲置',
        2: '繁育',
        3: '实验',
        4: '手动处死',
        5: '实验处死'
      }
      return MAP[this.form.miceStatus]
    },
    pure(n, o) {
      const MAP = {
        0: '纯合子',
        1: '杂合子',
        2: '未测试'
      }
      return MAP[this.form.pureHeterozygote]
    }
  },
  watch: {
    curVariety(n, o) {
      const newVariety = n
      this.varietiesName = newVariety.varietiesName
      this.varietiesId = newVariety.id
      this.form.varietiesId = newVariety.id
    },
    genes(n, o) {
      const newGenes = JSON.parse(n)
      this.form.genotypes = newGenes.id
      this.fillGenes(newGenes)
    },
    'form.position'(n, o) {
      switch (n) {
        case '头部': this.form.filePrefix = 'ear'
          break
        case '足部': this.form.filePrefix = 'finger'
          break
        default: this.form.filePrefix = ''
      }
    },
    'form.cageId'(n, o) {
      if (!n) {
        this.getMouserInfo()
      }
    }
  },
  created() {
    if (this.$route.params.canEdit) { // 从小鼠管理的首页，点编辑进来，可直接编辑
      this.canEdit = true
    }
    this.curMouseId = Number(this.$route.params.id)
    console.log(this.$route)
    const cacheMouseInfo = this.$store.getters.cacheMouseInfo
    console.log('cacheMouseInfo======', cacheMouseInfo)
    if (Object.keys(cacheMouseInfo).length > 0) {
      const mouseInfo = this.$store.getters.cacheMouseInfo
      const { varietiesName, varietiesId, genes, common, files } = mouseInfo

      this.varietiesName = varietiesName
      this.varietiesId = Number(varietiesId)
      this.$set(this, 'form', common)
      this.$set(this, 'cacheFilesList', files)
      console.log('this.form', this.form)
      this.$set(this, 'currentGene', genes)
    } else {
      this.getMouserInfo()
    }
    getMouseExpInfo(this.curMouseId).then((res) => {
      this.$set(this, 'tableData', res.data)
    })
  },
  methods: {
    // 获取小鼠信息
    getMouserInfo() {
      getMouseInfo(this.curMouseId).then((res) => {
        console.log(res)
        const { geneName, varietiesName, miceCondition, area, status, color, varietiesId } = res.data
        this.varietiesName = varietiesName
        this.varietiesId = Number(varietiesId)
        this.$set(this, 'form', res.data)
        console.log('回填信息==', this.form)
        // 时间戳换算
        this.$set(this.form, 'birthDate', res.data.birthDate * 1000)
        this.$set(this.form, 'separateCageRemindTime', res.data.separateCageRemindTime * 1000)
        this.$set(this.form, 'phenotypicIdentificationRemindTime', res.data.phenotypicIdentificationRemindTime * 1000)
        this.form.varietiesId = Number(varietiesId)
        this.$set(this, 'currentGene', {
          varietiesName,
          geneName,
          miceCondition,
          status,
          color,
          area
        })
        // 获取鼠笼信息
        getCageInfo(this.form.cageId).then((res) => {
          this.$set(this, 'cageInfo', res.data)
        })
      })
    },
    // 上传成功回填url
    fillFilesUrl(data, fileList) {
      this.$set(this.form, 'files', data)
      // 填充文件查看列表
      const list = []
      for (let i = 0; i < data.length; i++) {
        const { name: fileName, type: bizType } = fileList[i].raw
        list.push({
          fileName,
          bizType,
          path: data[i]
        })
      }
      console.log('list', list)
      this.$set(this, 'cacheFilesList', list)
    },
    handleClick(tab, event) {
      console.log(tab, event)
      if (tab === 'second') {
        this.getList()
      }
    },
    doAddGenes() {
      this.addGenesDialog = false
      // 新增基因型
    },
    // 提交
    save() {
      if (!this.canEdit) {
        this.canEdit = true
        return false
      }
      const params = JSON.parse(JSON.stringify(this.form))
      // 时间戳换算
      params.birthDate = params.birthDate / 1000
      params.separateCageRemindTime = params.separateCageRemindTime / 1000
      params.phenotypicIdentificationRemindTime = params.phenotypicIdentificationRemindTime / 1000

      editMouse(params).then((res) => {
        Toast.success('修改小鼠信息成功')
        this.$store.dispatch('app/clearMouseInfo')
        this.goBack()
      })
    },
    // 选择品系 or 基因型
    chooseVarity() {
      this.varietyDialog = true
    },
    fillVarity() {
      this.varietyDialog = false
      // 填充品系
    },
    // 选择基因型
    chooseGenes() {
      this.genesDialog = true
    },
    // 新增基因型
    addGenes() {
      this.addGenesDialog = true
    },
    // 填充基因型信息
    fillGenes(res) {
      const { geneName, miceCondition, status, color, area } = res
      this.currentGene.geneName = geneName
      this.currentGene.miceCondition = miceCondition
      this.currentGene.status = status
      this.currentGene.color = color
      this.currentGene.area = area
    },
    goBack() {
      this.$router.back()
    },
    // 选笼位
    goCage() {
      this.form.vid = this.varietiesId
      if (this.checkForm()) {
        this.$store.dispatch('app/cacheMouseInfo', {
          varietiesName: this.varietiesName,
          varietiesId: this.varietiesId,
          genes: this.currentGene,
          files: this.cacheFilesList,
          common: this.form
        })
        this.$router.push({
          name: 'mouseCage',
          params: {
            mouses: this.form,
            type: 'mouseEdit'
          }
        })
      }
    },
    // 校验表单
    checkForm() {
      if (!this.form.vid) {
        Toast.fail('未选择品系')
        return false
      }
      if (!this.form.genotypes) {
        Toast.fail('未选择基因型')
        return false
      }
      if ((!this.form.position && !this.form.sign)) {
        Toast.fail('未设置标记位置')
        return false
      }
      return true
    }
    // --------------------- 实验记录
  },
  // 路由守卫，复用的页面，判断来源
  beforeRouteEnter(to, from, next) {
    console.log('enter====>', to, from)
    next(vm => {
      // 选择鼠笼后返回,回填数据(请求也获取了数据...)
      if (from.name === 'mouseCage') {
        const mouseInfo = vm.$store.getters.cacheMouseInfo
        const { varietiesName, varietiesId, genes, common, files } = mouseInfo

        vm.varietiesName = varietiesName
        vm.varietiesId = Number(varietiesId)
        vm.$set(vm, 'form', common)
        vm.$set(vm, 'cacheFilesList', files)
        vm.$set(vm, 'currentGene', genes)
        vm.canEdit = true
      }
    })
  }

}
</script>

<style lang="scss">
  .mouse-edit {
    margin-bottom: 80px;
  }
  .genes-box, .cage-box {
    width: 90%;
    margin: 0 auto;
    background-color: #F6F6F6;
    .van-cell {
      background-color: #F6F6F6;
    }
  }
  .sign-img {
    width: 126px;
    height: 69px;
    border: 1px solid #eee;
  }
</style>
