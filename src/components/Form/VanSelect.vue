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
    console.log(this.curVal, this.curValNum, this.columns)
    const nowVal = this.curVal || this.curValNum || JSON.stringify(this.curValArr)
    this.value = this.columns.filter((el) => el.value === nowVal)[0] ? this.columns.filter((el) => el.value === nowVal)[0][this.keyText] : ''
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
        if (this.curValArr && !this.curVal) {
          value = JSON.parse(rslt)
          this.$emit('update:curValArr', value)
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
