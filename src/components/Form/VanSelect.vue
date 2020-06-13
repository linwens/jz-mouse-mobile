<template>
  <div class="van-select">
    <!-- <van-field
      readonly
      clickable
      name="picker"
      :value="value"
      label="选择器"
      placeholder="点击选择城市"
      @click="showPicker = true"
    /> -->
    <van-button v-if="btnType === 'button'" type="default" size="small" class="df s-jcsb" :class="btnWidthClass" @click="showPicker = true">
      <i>{{ curBtnLabel || btnText }}</i>
      <svg-icon icon-class="select-icon" class="fs10" />
    </van-button>
    <van-cell v-if="btnType === 'cell'" class="time-select__placeholder" :title="btnText" :value="value" is-link @click="showPicker = true" />
    <!-- 弹窗 -->
    <van-popup v-model="showPicker" position="bottom" get-container="body">
      <van-picker
        show-toolbar
        :columns="formatCol"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import {
  Cell,
  Button,
  // Field,
  Popup,
  Picker
} from 'vant'

export default {
  name: 'VanSelect',
  components: {
    'van-button': Button,
    'van-cell': Cell,
    // 'van-field': Field,
    'van-popup': Popup,
    'van-picker': Picker
  },
  props: {
    btnType: {
      type: String,
      default: 'cell'
    },
    curVal: {
      type: String,
      default: null
    },
    curValNum: { // 数字类型
      type: Number,
      default: null
    },
    placeholder: {
      type: String,
      default: ''
    },
    btnWidthClass: {
      type: String,
      default: 'w75'
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    btnText: {
      type: String,
      default: '时间选择'
    },
    keyText: { // 键字段名
      type: String,
      default: 'label'
    },
    valText: { // 值字段名
      type: String,
      default: 'value'
    }
  },
  data() {
    return {
      value: '',
      formatCol: [],
      showPicker: false,
      curBtnLabel: ''
    }
  },
  watch: {
    columns(n, o) {
      const names = n.map((el) => {
        return el[this.keyText]
      })
      this.$set(this, 'formatCol', names)
    }
  },
  created() {
    console.log(this.curVal, this.curValNum)
  },
  methods: {
    onConfirm(value) {
      if (!value) {
        this.showPicker = false
        return false
      }
      this.value = value
      this.$emit('update:placeholder', value)
      const choicedOne = this.columns.filter((el) => {
        return el[this.keyText] === value
      })
      const rslt = choicedOne[0][this.valText]

      if (typeof rslt === 'string') {
        this.$emit('update:curVal', typeof rslt === 'object' ? JSON.stringify(rslt) : String(rslt))
      }
      if (typeof rslt === 'number') {
        this.$emit('update:curValNum', typeof rslt === 'object' ? JSON.stringify(rslt) : Number(rslt))
      }
      if (this.btnType === 'button') {
        this.curBtnLabel = choicedOne[0][this.keyText]
      } else {
        this.value = choicedOne[0][this.keyText]
      }
      this.showPicker = false

      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss">
  .van-select {
    .van-button__content {
      width: 100%;
    }
    .van-button__text {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
