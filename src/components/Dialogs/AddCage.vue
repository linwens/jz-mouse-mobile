<template>
  <div class="add-cage">
    <van-button :class="btnWidthClass" round size="small" color="#00CB7C" :plain="plain" type="primary" @click="clickGetNum">{{ btnText }}</van-button>
    <!-- 新增笼位弹窗 -->
    <van-dialog
      v-model="cageDialog"
      :title="btnText"
      get-container="body"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="#FF6358"
      @confirm="addCageSubmit"
    >
      <van-form :show-error-message="false" class="mt20 mb20">
        <van-field
          v-model="addCageForm.cageNo"
          required
          label="笼位号"
          placeholder="请输入笼位号"
          :rules="[{ required: true, message: '请输入笼位号' }]"
        />
        <van-field
          v-model="addCageForm.roomNo"
          required
          label="房间号"
          placeholder="请输入房间号"
          :rules="[{ required: true, message: '请输入房间号' }]"
        />
        <van-field
          v-model="addCageForm.shelvesNo"
          required
          label="架号"
          placeholder="请输入架号"
          :rules="[{ required: true, message: '请输入架号' }]"
        />
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import { addCage, getNewCageNo } from '@/api/mouse'
import { inputRemenber } from '@/components/Mixins/history'
import { Button, Dialog, Form, Field } from 'vant'

export default {
  name: 'VarietyEdit',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-field': Field,
    [Dialog.Component.name]: Dialog.Component
  },
  mixins: [inputRemenber],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    plain: {
      type: Boolean,
      default: true
    },
    btnWidthClass: {
      type: String,
      default: 'w75'
    },
    btnText: {
      type: String,
      default: '新增笼位'
    }
  },
  data() {
    return {
      addCageForm: {
        cageNo: '0', // el-autocomplete不是字符串会报类型错
        roomNo: '0',
        shelvesNo: '0'
      },
      cageDialog: false
    }
  },
  created() {
    const iptHistory = JSON.parse(JSON.stringify(this.$store.getters.inputHistory))
    const latestCageNo = iptHistory['cageNo'] ? iptHistory['cageNo'].pop() : 0
    const latestRoomNo = iptHistory['roomNo'] ? iptHistory['roomNo'].pop() : 0
    const latestShelvesNo = iptHistory['shelvesNo'] ? iptHistory['shelvesNo'].pop() : 0

    this.addCageForm.cageNo = latestCageNo ? latestCageNo.value : '0'
    this.addCageForm.roomNo = latestRoomNo ? latestRoomNo.value : '0'
    this.addCageForm.shelvesNo = latestShelvesNo ? latestShelvesNo.value : '0'
  },
  methods: {
    // 点击获取初始化笼位号
    clickGetNum() {
      getNewCageNo().then((res) => {
        this.addCageForm.cageNo = Number(res.data) + 1 + ''
      })
      this.cageDialog = true
    },
    addCageSubmit() {
      this.cageDialog = false
      // 提交成功后触发done
      const { id: userId } = this.$store.getters.info
      console.log('userinfo===', this.$store.getters.info)
      addCage(Object.assign(this.addCageForm, {
        operator: userId,
        createUser: userId,
        state: 0
      })).then((res) => {
        if (res.data) {
          // 存储输入过的值
          const { cageNo, roomNo, shelvesNo } = this.addCageForm
          this.$store.dispatch('user/setInputHistory', {
            cageNo,
            roomNo,
            shelvesNo
          })
          this.$emit('done')
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .add-cage {
    font-size: 0;
  }
</style>
