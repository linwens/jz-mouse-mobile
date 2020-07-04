<template>
  <div class="time-select">
    <van-cell class="time-select__placeholder" :title="btnText" is-link @click="disabled ? null : showOptions()">
      <template #default>
        {{ +new Date(value) | timeFormat(format) }}
      </template>
    </van-cell>
    <!-- 弹出 -->
    <van-popup v-model="show" get-container="body" position="bottom" :style="{ width: '100%', height: '40%' }">
      <van-datetime-picker
        v-model="currentDate"
        class="w-100"
        :type="type"
        :title="title"
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
    type: {
      type: String,
      default: 'datetime'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: '时间选择'
    },
    time: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: '选择日期时间'
    }
  },
  data() {
    return {
      value: '',
      show: false,
      minDate: new Date(2019, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date()
    }
  },
  computed: {
    format() {
      const MAP = {
        'date': 'yyyy-MM-dd',
        'time': 'hh:mm',
        'month-day': 'MM-dd',
        'year-month': 'yyyy-MM',
        'datetime': 'yyyy-MM-dd hh:mm:ss'
      }
      return MAP[this.type]
    }
  },
  watch: {
    time(n, o) {
      console.log('time.length===', (n + '').length)
      if (n) {
        this.value = n
      }
    }
  },
  created() {
    this.value = this.time
  },
  methods: {
    showOptions() {
      this.show = true
    },
    onConfirm(value, index) {
      console.log(`当前值：${value}, 当前索引：${index}`)
      const timestamp = +new Date(value)
      console.log(timestamp)
      this.value = value
      this.$emit('update:time', timestamp)
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
