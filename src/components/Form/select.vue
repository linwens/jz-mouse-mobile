<template>
  <div class="form-select">
    <van-button type="default" size="small" class="df s-jcsb w150" @click="showOptions">
      <i>{{ btnText }}</i>
      <svg-icon icon-class="select-icon" class="fs10" />
    </van-button>
    <!-- 弹出 -->
    <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
      <van-picker
        title="标题"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
        @change="onChange"
      />
    </van-popup>
  </div>
</template>

<script>
import {
  Button,
  Popup,
  Picker,
  Toast
} from 'vant'

export default {
  name: 'FormSelect',
  components: {
    'van-button': Button,
    'van-popup': Popup,
    'van-picker': Picker,
  },
  props: {
    options: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      show: false,
      btnText: '',
      columns: ['我的小鼠', '实验室小鼠', '实验室人员']
    }
  },
  created() {
    this.btnText = this.columns[0] // 默认展示第一个选项的内容
  },
  methods: {
    showOptions() {
      this.show = true
    },
    onConfirm(value, index) {
      Toast(`当前值：${value}, 当前索引：${index}`)
      this.btnText = value
      const MAP = new Map()
      MAP.set('我的小鼠', 'currentVarieties')
      MAP.set('实验室小鼠', 'allVarieties')
      MAP.set('实验室人员', 'operator')

      this.$emit('choiced', MAP.get(value))
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
  .form-select {
    .van-button__content {
      width: 100%;
    }
    .van-button__text {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
