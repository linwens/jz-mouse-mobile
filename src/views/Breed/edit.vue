<template>
  <div class="breed-edit">
    <van-form :show-error-message="false">
      <van-field
        v-if="disabled"
        v-model="breedForm.name"
        required
        label="繁育组名称"
        placeholder="请输入繁育组名称"
        :rules="[{ required: true, message: '请输入繁育组名称' }]"
      />
      <div v-else class="file--span fs14">
        <span>繁育组名称 {{ breedForm.name }}</span>
      </div>
      <time-select :disabled="!disabled" btn-text="合笼时间" title="选择合笼时间" :time.sync="breedForm.breedTime">
        <template slot="placeholder">
          <p>选择日期时间</p>
        </template>
      </time-select>
    </van-form>
    <div v-if="disabled" class="add-btn df s-jcfe s-aic pt13 pb11">
      <van-button class="w90" hairline round size="small" color="#32C985" type="info" @click="goAdd()">添加</van-button>
    </div>
    <!-- 列表 -->
    <div>
      <collapse v-for="(item, index) in breedForm.miceIds" :key="item.id">
        <template slot="title">
          <div class="df s-aic xs-collapse__content--multiple">
            <span class="fs10">{{ item.varietiesName }}</span>
            <span class="fs10">{{ item.geneName }}</span>
          </div>
        </template>
        <template slot="content">
          <div class="df s-aic">
            <p>编号：<span>{{ item.miceNo }}</span></p>
          </div>
          <div class="df s-aic">
            <p>周龄：<span>{{ calcWeek(item.birthDate) }}</span></p>
            <p>性别：<span>{{ item.gender === 0 ? '雄' : '雌' }}</span></p>
          </div>
          <div class="df s-aic">
            <p>体重：<span>{{ item.weight ? `${item.weight}g` : '' }}</span></p>
            <p>毛色：<span>{{ item.geneColor }}</span></p>
          </div>
          <div class="df s-aic">
            <p>健康状况：<span>{{ item.status }}</span></p>
          </div>
          <div v-if="item.gender === 1" class="df s-aic">
            <p>受孕时间：
              <span v-if="item.pregnantTime" class="txt-btn--green" @click="setPregTime({item, index})">
                {{ item.pregnantTime | timeFormat('yyyy-MM-dd') }}
              </span>
              <span v-else class="txt-btn--green" @click="setPregTime({item, index})">设置受孕时间</span>
            </p>
          </div>
        </template>
        <template v-if="disabled" slot="footer">
          <van-button class="w75 mr10" plain hairline round size="small" color="#333" type="info" @click="goMouse(item)">查看</van-button>
          <van-button class="w75" plain hairline round size="small" color="#EB5444" type="info" @click="rowItemDel(item)">删除</van-button>
        </template>
      </collapse>
    </div>
    <bottom-btn :right-btn-text="disabled ? '确定' : '编辑'" @confirm="submitForm" />
    <!-- 设置时间弹窗 -->
    <van-dialog
      v-model="dialogVisible"
      title="设置受孕时间"
      get-container="body"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="#FF6358"
      @confirm="submitPregTime"
    >
      <van-form class="mt20 mb20">
        <time-select btn-text="日期时间" :time.sync="breedTime.date">
          <template slot="placeholder">
            <p>选择日期时间</p>
          </template>
        </time-select>
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import Collapse from '@/components/Collapse/index.vue'
import BottomBtn from '@/components/BottomBtn/index.vue'
import TimeSelect from '@/components/Form/TimeSelect.vue'
import { addBreed, getbreedDetail, editBreed } from '@/api/breed'
import { calcWeek } from '@/components/Mixins/calcWeek'
import { Button, Form, Field, Toast, Dialog } from 'vant'

export default {
  name: 'BreedEdit',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-field': Field,
    [Dialog.Component.name]: Dialog.Component,
    TimeSelect,
    Collapse,
    BottomBtn
  },
  mixins: [calcWeek],
  data() {
    return {
      canEdit: false, // 可编辑状态
      type: '',
      breedForm: {
        id: 0,
        name: '',
        breedTime: null,
        // date: null,
        // time: null,
        miceIds: []
      },
      breedTime: {
        date: ''
      },
      mouseIndex: 0, // 当前小鼠索引
      dialogVisible: false,
      tableLoading: false,
      page: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 10 // 每页显示多少条
      },
      tableData: []
    }
  },
  computed: {
    disabled() {
      return this.type === 'add' || this.canEdit
    }
  },
  mounted() {
    console.log(this.$route)
    // 不能用 === 0；有时0  有时'0'
    this.type = this.$route.params.id == 0 ? 'add' : 'edit'
    console.log('type=', this.type)
    this.$route.meta.title = this.type === 'add' ? '新增' : '编辑/查看'
    // 如果是编辑，获取详情
    const cacheInfo = this.$store.getters.addingBreed
    const cacheMouses = this.$store.getters.addingMouses
    console.log(this.$store.getters)
    console.log(cacheInfo)
    cacheInfo.miceIds = cacheMouses // CNMB
    console.log(this.type)
    if (Object.keys(cacheInfo).length > 0 && cacheInfo.id == this.$route.params.id) {
      if (cacheInfo.miceIds.length === 0) { // 如果返回回来没有小鼠信息就请求下接口
        const id = this.$route.params.id
        this.getDetail(id)
      } else {
        this.$set(this, 'breedForm', cacheInfo)
      }
    } else {
      if (this.type === 'edit') {
        console.log('请求获取数据')
        const id = this.$route.params.id
        this.getDetail(id)
      }
    }
  },
  methods: {
    // 添加小鼠
    goAdd() {
      // 每次添加都先删除原有小鼠
      if (this.breedForm.miceIds.length > 0) {
        Dialog.confirm({
          title: '警告',
          message: '当前繁育组已有小鼠，是否要重新添加小鼠?',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$set(this.breedForm, 'miceIds', [])
          this.$store.dispatch('app/cacheBreed', this.breedForm)
          this.goPage('BreedAddMouse', { type: 'noBreed' })
        }).catch(function() {
        })
      } else {
        this.$store.dispatch('app/cacheBreed', this.breedForm)
        this.goPage('BreedAddMouse', { type: 'noBreed' })
      }
    },
    goBack() {
      this.$store.dispatch('app/clearBreed')
      this.$router.back()
    },
    goMouse(row) {
      console.log('查看小鼠====', row)
      this.goPage('MouseEdit', { id: row.miceInfoId })
    },
    goPage(r, obj) {
      this.$router.push({ name: r, params: obj })
    },
    handleRefreshChange() {
      this.getList()
    },
    // 删除
    rowItemDel: function(row) {
      console.log('row=====', row)
      console.log('miceIds==', this.breedForm.miceIds)
      Dialog.confirm({
        title: '警告',
        message: `是否确认删除小鼠："${row.miceNo}"?`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const newList = this.breedForm.miceIds.filter((el) => {
          return el.miceInfoId !== row.miceInfoId
        })
        console.log(newList)
        this.$set(this.breedForm, 'miceIds', newList)
        Toast.success('删除成功，确认提交后生效')
      }).catch(function() {
      })
    },
    // 获取繁育组详情
    getDetail(id) {
      getbreedDetail({
        id
      }).then((res) => {
        const { miceInfoFromMiceBreedVO, breedTime, ...other } = res.data
        const miceArr = miceInfoFromMiceBreedVO.map((el) => {
          el.pregnantTime *= 1000
          return el
        })
        this.$set(this, 'breedForm', Object.assign({}, other, {
          miceIds: miceArr
        }, {
          breedTime: breedTime * 1000
        }))
        console.log(this.breedForm)
      })
    },
    // 提交
    submitForm(formName) {
      if (this.type !== 'add' && !this.canEdit) {
        this.canEdit = true
        return false
      }
      if (this.breedForm.name === '') {
        Toast.fail('请输入繁育组名称')
        return false
      }
      console.log(this.breedForm)
      if (this.breedForm.miceIds.length === 0) {
        Toast.fail('请添加小鼠')
        return false
      }
      const miceArr = this.breedForm.miceIds.map((el) => {
        const { miceInfoId: miceId, pregnantTime } = el
        return {
          miceId,
          pregnantTime: pregnantTime / 1000 || 0
        }
      })
      const { id: userId } = this.$store.getters.info
      const { miceIds, ...other } = this.breedForm
      const params = Object.assign({}, other, {
        breedTime: this.breedForm.breedTime / 1000,
        createTime: Math.floor(+new Date() / 1000),
        createUser: userId,
        miceInfoInAddMiceBreedDTOList: miceArr
      })
      console.log('===|||--===', params.breedTime)
      if (this.type === 'add') {
        this.doAdd(params)
      } else {
        this.doEdit(params)
      }
    },
    // 新增
    doAdd(params) {
      addBreed(params).then((res) => {
        Toast.success('新增繁育组成功')
        this.$store.dispatch('app/clearMouses')
        this.$store.dispatch('app/clearBreed')
        this.goBack()
      })
    },
    // 编辑
    doEdit(params) {
      console.log('doEdit==', params)
      editBreed(params).then((res) => {
        Toast.success('编辑信息成功')
        this.$store.dispatch('app/clearMouses')
        this.$store.dispatch('app/clearBreed')
        this.goBack()
      })
    },
    // 设置受孕时间
    setPregTime(scope) {
      console.log(scope)
      this.mouseIndex = scope.index
      this.dialogVisible = true
      this.breedTime.date = scope.item.pregnantTime === 0 ? null : scope.item.pregnantTime
    },
    submitPregTime() {
      console.log(this.timeFormat)
      console.log(this.breedForm.miceIds, this.mouseIndex, this.breedTime.date)
      this.$set(this.breedForm.miceIds[this.mouseIndex], 'pregnantTime', this.breedTime.date)
      console.log(this.breedForm.miceIds[this.mouseIndex].pregnantTime)
      this.dialogVisible = false
    }
  },
  // 路由守卫，复用的页面，判断来源
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 是添加小鼠返回的
      if (from.name === 'breedAddMouse') {
        // const addingMouses = vm.$store.getters.addingMouses ? JSON.parse(vm.$store.getters.addingMouses) : [] // 选中小鼠列表
        // const cacheBreed = vm.$store.getters.addingBreed ? JSON.parse(vm.$store.getters.addingBreed) : null // 繁育组信息
        // console.log('添加小鼠后返回', cacheBreed, addingMouses)
        // if (cacheBreed) {
        //   cacheBreed.miceIds = addingMouses
        //   // 回填信息
        //   console.log('vm.breedForm===1======', vm.breedForm)
        //   vm.$set(vm, 'breedForm', cacheBreed)
        //   console.log('vm.breedForm===2======', vm.breedForm)
        // }
        vm.canEdit = true
      }
    })
  }
}
</script>

<style lang="scss">
  .breed-edit {
    margin-bottom: 80px;
    .add-btn {
      width: 90%;
      margin: 0 auto;
    }
  }
</style>
