<template>
  <div>
    <van-button :class="btnWidthClass" round :size="size" color="#333" plain type="primary" @click="setTimeDialog = true">{{ btnText }}</van-button>
    <!-- 设置时间弹窗 -->
    <van-dialog
      v-model="setTimeDialog"
      title="设置时间"
      get-container="body"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="#FF6358"
      @confirm="setTime"
    >
      <van-form class="mt20 mb20">
        <van-select
          btn-text="请选择类型"
          :cur-val.sync="setTimeForm.operationType"
          :columns="[
            {
              label: '检测时间',
              value: 0
            },
            {
              label: '处理时间',
              value: 1
            }
          ]"
        >
          <template slot="placeholder">
            <p>选择时间类型</p>
          </template>
        </van-select>
        <time-select btn-text="日期时间" :time.sync="setTimeForm.time">
          <template slot="placeholder">
            <p>选择日期时间</p>
          </template>
        </time-select>
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import VanSelect from '@/components/Form/VanSelect.vue'
import TimeSelect from '@/components/Form/TimeSelect.vue'
import { Button, Form, Toast, Dialog } from 'vant'
import { setExptTime } from '@/api/experiment'

export default {
  name: 'SetTime',
  components: {
    'van-button': Button,
    'van-form': Form,
    [Dialog.Component.name]: Dialog.Component,
    VanSelect,
    TimeSelect
  },
  props: {
    id: {
      type: Number,
      default: null
    },
    btnText: {
      type: String,
      default: '设置时间'
    },
    btnWidthClass: {
      type: String,
      default: 'w75'
    },
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      // 设置时间
      setTimeDialog: false,
      setTimeForm: {
        operationType: null,
        time: null
      }
    }
  },
  methods: {
    setTime() {
      this.setTimeDialog = false
      // 提交成功后触发done
      const { id: userId } = this.$store.getters.info
      setExptTime({
        createTime: Math.floor(+new Date() / 1000),
        experimentId: this.id,
        operationId: userId,
        remindState: 0,
        operationType: this.setTimeForm.operationType,
        time: Math.floor(this.setTimeForm.time / 1000)
      }).then((res) => {
        Toast.success('设置时间成功')
        if (res.data) {
          this.$emit('done', {
            type: this.setTimeForm.operationType,
            time: Math.floor(this.setTimeForm.time / 1000)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>
