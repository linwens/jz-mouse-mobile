<template>
  <div class="cage w-100">
    <div class="sum fs14">
      <p>剩余小鼠：<span>{{ mouseData.femaleMiceNum }}只(<i class="cl-purple">雌</i>)/{{ mouseData.maleMiceNum }}只(<i class="cl-blue">雄</i>)</span></p>
    </div>
    <div class="mouse__cages">
      <mouse-cage
        v-for="(item, index) in cageList"
        :key="index"
        :all-data="item"
        :is-choosing-cage="isChoosingCage"
        :cage-id="item.id"
        :choosed-cage.sync="choosedCage"
      />
    </div>
    <!-- 底部按钮 -->
    <bottom-btn btn-width-class="w100">
      <template slot="confirm">
        <van-button class="w100" round color="#32C985" size="small" type="info" @click="putIn">放入</van-button>
        <add-cage-btn :plain="false" btn-width-class="w100" @done="getCageList" />
      </template>
    </bottom-btn>
    <!-- 放老鼠弹窗 -->
    <van-dialog
      v-model="putInVisible"
      title="放入小鼠"
      get-container="body"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="#FF6358"
      @confirm="putInSubmit"
    >
      <van-form class="mt20 mb20">
        <van-field
          v-model="putInForm.female"
          label="雌"
          :disabled="optType === 'breed' || optType === 'expt'"
          @input="changeNum(putInForm.female, 'female')"
        />
        <van-field
          v-model="putInForm.male"
          label="雄"
          :disabled="optType === 'breed' || optType === 'expt'"
          @input="changeNum(putInForm.male, 'male')"
        />
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import MouseCage from '@/components/MouseCage/index.vue'
import AddCageBtn from '@/components/Dialogs/AddCage'
import BottomBtn from '@/components/BottomBtn/index.vue'
import { fetchCageList, addMouse, transferCage } from '@/api/mouse'
import { Button, Toast, Dialog, Form, Field } from 'vant'

export default {
  name: 'Cage',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-field': Field,
    [Dialog.Component.name]: Dialog.Component,
    BottomBtn,
    AddCageBtn,
    MouseCage
  },
  data() {
    return {
      canGo: false,
      optType: '', // 操作类型
      cageList: [], // 鼠笼列表
      cagePage: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 10 // 每页显示多少条
      },
      isChoosingCage: false, // 正在选鼠笼标识
      choosedCage: 0, // 当前选中的鼠笼id
      putInVisible: false,
      putInForm: {
        male: null,
        female: null
      },
      mouseData: {}, // 新增小鼠信息
      mouses: [] // 添加多个小鼠信息
    }
  },
  created() {
    if (!this.$route.params.type) { // 新增小鼠进来选笼放笼
      this.$set(this, 'mouseData', this.$route.params)
    } else if (this.$route.params.type === 'mouseEdit') { // 编辑小鼠进来
      this.optType = this.$route.params.type
      this.$set(this, 'mouseData', this.$route.params.mouses)
      const { gender } = this.$route.params.mouses
      let female = 0
      let male = 0
      if (gender === 0) {
        female = 0
        male = 1
      } else {
        female = 1
        male = 0
      }
      this.putInForm.female = female
      this.putInForm.male = male
      this.mouseData.femaleMiceNum = female
      this.mouseData.maleMiceNum = male
      // 选中小鼠id, 传数组
      this.ids = [this.mouseData.miceId]
    } else { // 繁育组进来选笼放笼
      this.optType = this.$route.params.type
      this.mouses = this.$route.params.mouses
      const male = this.mouses.filter((el) => {
        return el.gender === 0
      }).length
      const female = this.mouses.filter((el) => {
        return el.gender === 1
      }).length
      this.putInForm.female = female
      this.putInForm.male = male
      this.mouseData.femaleMiceNum = female
      this.mouseData.maleMiceNum = male
      // 选中小鼠id
      this.ids = this.mouses.map((el) => {
        return el.miceInfoId
      })
    }
    this.getCageList()
  },
  methods: {
    changeNum(val, type) { // 限制放入小鼠数量的输入值
      const value = Number(val)
      if (value < 0 || typeof value !== 'number' || isNaN(value)) {
        this.putInForm[type] = 0
      }
      if (value > this.mouseData[`${type}MiceNum`]) {
        this.putInForm[type] = this.mouseData[`${type}MiceNum`]
        Toast.fail(`${type === 'female' ? '雌' : '雄'}鼠最多只能放入${this.mouseData[`${type}MiceNum`]}只`)
      }
    },
    goBack() {
      if (this.mouseData.femaleMiceNum + this.mouseData.maleMiceNum === 0) {
        this.$router.back()
        return
      }
      Dialog.confirm({
        title: '警告',
        message: `当前仍有${parseInt(this.mouseData.femaleMiceNum) + parseInt(this.mouseData.maleMiceNum)}只小鼠尚未放入鼠笼，是否继续返回？`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.canGo = true
        this.$router.back()
      }).catch(function() {
      })
    },
    // 鼠笼列表
    getCageList() {
      this.tableLoading = true
      fetchCageList(Object.assign({
        isMy: 0,
        current: this.cagePage.page,
        size: -1
      })).then(res => {
        const { records } = res.data
        let list = []
        // 如果是添加繁育组，只展示空笼位
        if (this.optType === 'breed') {
          list = records.filter((el) => {
            return el.miceInfoByMiceCageQueryVO.length === 0
          })
        } else {
          list = records
        }
        this.cageList = list
        this.cagePage.total = res.data.total
      }).finally(() => {
        this.tableLoading = false
      })
    },
    // 放入操作
    putIn() {
      if (!this.choosedCage) {
        Toast.fail('请先选择鼠笼')
      } else {
        this.putInForm.female = this.mouseData.femaleMiceNum
        this.putInForm.male = this.mouseData.maleMiceNum
        this.putInVisible = true
      }
    },
    // 繁育组添加小鼠
    doTransferCage() {
      console.log(this.$router)
      console.log(this.$route.go)
      console.log(this.$router.go)
      transferCage({
        cageId: this.choosedCage,
        miceId: this.ids
      }).then((res) => {
        Toast.success('放入鼠笼成功')
        this.mouseData.femaleMiceNum -= this.putInForm.female
        this.mouseData.maleMiceNum -= this.putInForm.male
        if (this.optType === 'breed') { // 繁育组移笼
          this.$store.dispatch('app/cacheChoosedMouse', this.mouses)
          console.log(this.$route)
          this.$router.go(-2) // 直接跳回繁育组页面
          return
        }
        if (this.optType === 'mouseEdit') { // 编辑小鼠移笼
          const { varietiesName, varietiesId, genes, files } = this.$store.getters.cacheMouseInfo
          this.mouseData.cageId = this.choosedCage
          this.$store.dispatch('app/cacheMouseInfo', {
            common: this.mouseData,
            varietiesName,
            varietiesId,
            genes,
            files
          })
        }
        this.putInVisible = false
        this.$router.back()
      })
    },
    // 添加小鼠
    doAdd() {
      const { id: userId } = this.$store.getters.info
      const params = Object.assign({}, this.mouseData, {
        createTime: Math.floor(+new Date() / 1000),
        birthDate: this.mouseData.birthDate / 1000,
        separateCageRemindTime: this.mouseData.separateCageRemindTime / 1000,
        phenotypicIdentificationRemindTime: this.mouseData.phenotypicIdentificationRemindTime / 1000,
        createUser: userId,
        operator: userId,
        cid: this.choosedCage,
        maleMiceNum: this.putInForm.male,
        femaleMiceNum: this.putInForm.female
      })
      addMouse(params).then(res => {
        // 更新剩余小鼠数量
        this.mouseData.femaleMiceNum -= this.putInForm.female
        this.mouseData.maleMiceNum -= this.putInForm.male
        const { varietiesName, varietiesId, genes, files } = this.$store.getters.cacheMouseInfo
        this.$store.dispatch('app/cacheMouseInfo', {
          common: this.mouseData,
          varietiesName,
          varietiesId,
          genes,
          files
        })
        Toast.success('新增小鼠成功')
        this.getCageList()
        this.putInVisible = false
        if (this.mouseData.femaleMiceNum + this.mouseData.maleMiceNum === 0) {
          this.$store.dispatch('app/clearMouseInfo')
          this.$router.go(-2)
          return
        }
      })
    },
    putInSubmit() {
      if (this.putInForm.male > this.mouseData.maleMiceNum) {
        Toast.fail(`雄鼠数量不得大于${this.mouseData.maleMiceNum}`)
        return false
      }
      if (this.putInForm.female > this.mouseData.femaleMiceNum) {
        Toast.fail(`雌鼠数量不得大于${this.mouseData.femaleMiceNum}`)
        return false
      }
      if (this.putInForm.male === 0 && this.putInForm.female === 0) {
        Toast.fail('总数量必须大于0')
        return false
      }

      if (this.optType === 'breed') { // 添加入繁育组
        this.doTransferCage()
        return false
      }

      if (this.optType === 'mouseEdit') { // 编辑小鼠选择笼位
        this.doTransferCage()
        return false
      }
      this.doAdd()
    }
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    console.log(to)
    if (!this.canGo && this.mouseData.femaleMiceNum + this.mouseData.maleMiceNum !== 0) {
      const answer = window.confirm(`您当前还有${parseInt(this.mouseData.femaleMiceNum) + parseInt(this.mouseData.maleMiceNum)}只小鼠未新增完成，离开页面后系统将无法保留相关数据，是否继续离开？`)
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
</script>

<style lang="scss">
  .cage {
    .sum {
      padding: 15px;
      border-bottom: 1px solid #eee;
      color: #999;
      span {
        color: #333;
      }
    }
    .mouse__cages {
      box-sizing: border-box;
      width: 100%;
      padding: 0 15px;
    }
  }
</style>
