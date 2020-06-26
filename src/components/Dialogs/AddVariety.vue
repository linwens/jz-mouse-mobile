<template>
  <div class="dib">
    <van-button class="w-100" hairline round size="small" color="#32C985" type="info" @click="varietyDialog = true">新增品系</van-button>
    <van-dialog
      v-model="varietyDialog"
      title="新增品系"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="#FF6358"
      @confirm="fillVarity"
    >
      <van-form
        ref="addVarietyForm"
        :show-error-message="false"
        class="mt20 mb20"
      >
        <van-field
          v-model="addVarietyForm.varietiesName"
          required
          label="品系名称"
          placeholder="请输入品系名称"
          :rules="[{ required: true, message: '请输入品系名称' }]"
        />
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import { addItemObj } from '@/api/variety'
import { Button, Toast, Dialog, Form, Field } from 'vant'

export default {
  name: 'AddVariety',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-field': Field,
    [Dialog.Component.name]: Dialog.Component
  },
  data() {
    return {
      addVarietyForm: {
        varietiesName: ''
      },
      varietyDialog: false
    }
  },
  methods: {
    fillVarity() {
      // 提交成功后触发done
      const { varietiesName } = this.addVarietyForm
      const { id: operator, id: userId } = this.$store.getters.info
      if (!varietiesName) {
        Toast.fail('请输入品系名称')
        return false
      }
      this.varietyDialog = false
      addItemObj({
        varietiesName,
        operator,
        userId
      }).then((res) => {
        if (res.data) {
          this.$emit('done')
          this.addVarietyForm.varietiesName = ''
          this.$refs['addVarietyForm'].resetValidation() // 就为了没有错误提示
          Toast.success('新增品系成功')
        }
      })
    }
  }
}
</script>

<style>

</style>