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
      <i class="van-select__btn-text">{{ curBtnLabel || btnText }}</i>
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
    curValArr: {
      type: Array,
      default() {
        return []
      }
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
    },
    dataType: { // 数据类型
      type: String,
      default: null
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
      this.createOpt(n)
    }
  },
  created() {
    console.log(this.curVal, this.curValNum, this.columns, this.curVal || (this.curValNum >= 0 ? this.curValNum : null))
    let nowVal = null
    if (this.curVal) {
      nowVal = this.curVal
    }
    if (this.curValNum >= 0) {
      nowVal = this.curValNum
    }
    if (this.curValArr && this.curValArr.length > 0) {
      nowVal = JSON.stringify(this.curValArr)
    }
    console.log('nowVal===', nowVal)
    if (this.columns.length === 0) {
      if (this.dataType === 'arr') {
        this.value = JSON.parse(nowVal)[0]
      } else {
        this.value = nowVal
      }
    } else {
      if (this.dataType === 'arr') {
        this.value = this.columns.filter((el) => el[this.keyText] === JSON.parse(nowVal)[0])[0] ? this.columns.filter((el) => el[this.keyText] === JSON.parse(nowVal)[0])[0][this.keyText] : ''
      } else {
        this.value = this.columns.filter((el) => el.value === nowVal)[0] ? this.columns.filter((el) => el.value === nowVal)[0][this.keyText] : ''
      }
    }
    this.createOpt(this.columns)
  },
  methods: {
    // create options
    createOpt(arr) {
      const names = arr.map((el) => {
        return el[this.keyText]
      })
      this.$set(this, 'formatCol', names)
    },
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
        let value = null
        if (this.dataType === 'arr') {
          this.$emit('update:curValArr', [rslt])
        } else {
          value = typeof rslt === 'object' ? JSON.stringify(rslt) : String(rslt)
          this.$emit('update:curVal', value)
        }
        this.$emit('confirm', value)
      }
      if (typeof rslt === 'number') {
        const value = typeof rslt === 'object' ? JSON.stringify(rslt) : Number(rslt)
        this.$emit('update:curValNum', value)
        this.$emit('confirm', value)
      }
      if (this.btnType === 'button') {
        this.curBtnLabel = choicedOne[0][this.keyText]
      } else {
        this.value = choicedOne[0][this.keyText]
      }
      this.showPicker = false
    }
  }
}
</script>

<style lang="scss">
  .van-select {
    &__btn-text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
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
