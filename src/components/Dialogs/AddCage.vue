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
      <van-form class="mt20 mb20">
        <van-field
          v-model="addCageForm.cageNo"
          label="笼位号"
          placeholder="请输入笼位号"
          :rules="[{ required: true, message: '请输入笼位号' }]"
        />
        <van-field
          v-model="addCageForm.roomNo"
          label="房间号"
          placeholder="请输入笼位号"
          :rules="[{ required: true, message: '请输入房间号' }]"
        />
        <van-field
          v-model="addCageForm.shelvesNo"
          label="架号"
          placeholder="请输入笼位号"
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
  created() {},
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
