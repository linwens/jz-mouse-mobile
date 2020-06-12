<template>
  <div class="breed-edit">
    <van-form>
      <van-field
        v-model="breedForm.name"
        label="繁育组名称"
        placeholder="请输入繁育组名称"
        :rules="[{ required: true, message: '请输入繁育组名称' }]"
      />
      <time-select btn-text="开始时间" :time.sync="breedForm.breedTime">
        <template slot="placeholder">
          <p>请选择开始时间</p>
        </template>
      </time-select>
    </van-form>
    <div class="add-btn df s-jcfe s-aic pt13 pb11">
      <van-button class="w90" hairline round size="small" color="#32C985" type="info">添加</van-button>
    </div>
    <!-- 列表 -->
    <main-list>
      <template>
        <collapse v-for="item in tableData" :key="item.id">
          <template slot="title">
            <div class="df s-aic">
              <span>实验组ADEsG</span>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>编号：<span>023</span></p>
              <p>周龄：<span>0周6天</span></p>
            </div>
            <div class="df s-aic">
              <p>性别：<span>雄</span></p>
              <p>体重：<span>10g</span></p>
            </div>
            <div class="df s-aic">
              <p>毛色：<span>灰色</span></p>
              <p>健康状况：<span>健康无异常</span></p>
            </div>
            <div class="df s-aic">
              <p>受孕时间：<span class="txt-btn--green">设置</span></p>
            </div>
          </template>
          <template slot="footer">
            <van-button class="w75 mr10" plain hairline round size="small" color="#333" type="info">查看</van-button>
            <van-button class="w75" plain hairline round size="small" color="#EB5444" type="info">删除</van-button>
          </template>
        </collapse>
      </template>
    </main-list>
    <bottom-btn @confirm="submit" />
  </div>
</template>

<script>
import MainList from '@/components/List/index.vue'
import Collapse from '@/components/Collapse/index.vue'
import BottomBtn from '@/components/BottomBtn/index.vue'
import TimeSelect from '@/components/Form/TimeSelect.vue'
import { addBreed, getbreedDetail, editBreed } from '@/api/breed'
import { calcWeek } from '@/components/Mixins/calcWeek'
import { Button, Form, Field } from 'vant'

export default {
  name: 'BreedEdit',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-field': Field,
    TimeSelect,
    MainList,
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
    this.$route.meta.title = this.type === 'add' ? '新增' : '编辑/查看'
    // 如果是编辑，获取详情
    const cacheInfo = this.$store.getters.addingBreed
    const cacheMouses = this.$store.getters.addingMouses
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
        this.$confirm('当前繁育组已有小鼠，是否要重新添加小鼠?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$set(this.breedForm, 'miceIds', [])
          this.$store.dispatch('app/cacheBreed', this.breedForm)
          this.goPage('breedAddMouse', { type: 'noBreed' })
        }).catch(function() {
        })
      } else {
        this.$store.dispatch('app/cacheBreed', this.breedForm)
        this.goPage('breedAddMouse', { type: 'noBreed' })
      }
    },
    goBack() {
      this.$store.dispatch('app/clearBreed')
      this.$router.back()
    },
    goMouse(row) {
      console.log('查看小鼠====', row)
      this.goPage('mouseEdit', { id: row.miceInfoId })
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
      const _this = this
      this.$confirm('是否确认删除小鼠："' + row.miceInfoId + '"?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const newList = this.breedForm.miceIds.filter((el) => {
          return el.miceInfoId !== row.miceInfoId
        })
        console.log(newList)
        this.$set(this.breedForm, 'miceIds', newList)
        _this.$message({
          showClose: true,
          message: '删除成功，确认提交后生效',
          type: 'success'
        })
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.breedForm)
          if (this.breedForm.miceIds.length === 0) {
            this.$message.error('请添加小鼠')
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
          if (this.type === 'add') {
            this.doAdd(params)
          } else {
            this.doEdit(params)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 新增
    doAdd(params) {
      addBreed(params).then((res) => {
        this.$message.success('新增繁育组成功')
        this.$store.dispatch('app/clearMouses')
        this.$store.dispatch('app/clearBreed')
        this.goBack()
      })
    },
    // 编辑
    doEdit(params) {
      editBreed(params).then((res) => {
        this.$message.success('编辑信息成功')
        this.$store.dispatch('app/clearMouses')
        this.$store.dispatch('app/clearBreed')
        this.goBack()
      })
    },
    // 设置受孕时间
    setPregTime(scope) {
      console.log(scope)
      this.mouseIndex = scope.$index
      this.dialogVisible = true
      this.breedTime.date = scope.row.pregnantTime === 0 ? null : scope.row.pregnantTime
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
    .add-btn {
      width: 90%;
      margin: 0 auto;
    }
  }
</style>
