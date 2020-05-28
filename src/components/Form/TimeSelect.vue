<template>
  <div class="time-select">
    <van-cell class="time-select__placeholder" :title="btnText" is-link @click="showOptions">
      <template #default>
        <slot name="placeholder" />
      </template>
    </van-cell>
    <!-- 弹出 -->
    <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        title="选择开始时间"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
  </div>
</template>

<script>
import {
  Cell,
  Popup,
  DatetimePicker,
  Toast
} from 'vant'

export default {
  name: 'TimeSelect',
  components: {
    'van-cell': Cell,
    'van-popup': Popup,
    'van-datetime-picker': DatetimePicker
  },
  props: {
    btnText: {
      type: String,
      default: '时间选择'
    },
    time: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      show: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date()
    }
  },
  methods: {
    showOptions() {
      this.show = true
    },
    onConfirm(value, index) {
      Toast(`当前值：${value}, 当前索引：${index}`)
      this.show = false
    },
    onChange(picker, value, index) {
      // Toast(`当前值：${value}, 当前索引：${index}`)
    },
    onCancel() {
      Toast('取消')
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .time-select {
    &__placeholder .van-cell__value p {
      font-size: 12px;
      color: #999;
    }
  }
</style>
