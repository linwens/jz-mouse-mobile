<template>
  <div class="dib">
    <van-button class="w-100" hairline round size="small" color="#32C985" type="info" @click="show = true">新增品系</van-button>
    <van-dialog
      v-model="show"
      title="新增品系"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="#FF6358"
      @confirm="confirm"
    >
      <van-form class="mt20 mb20">
        <van-field
          v-model="name"
          label="品系名称"
          placeholder="请输入品系名称"
          :rules="[{ required: true, message: '请输入品系名称' }]"
        />
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import { Button, Dialog, Form, Field } from 'vant';

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
      name: '',
      show: false
    }
  },
  methods: {
    confirm() {
      this.show = false
    }
  }

}
</script>

<style>

</style>