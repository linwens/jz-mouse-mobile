<template>
  <div>
    <!-- <van-field
      readonly
      clickable
      name="picker"
      :value="value"
      label="选择器"
      placeholder="点击选择城市"
      @click="showPicker = true"
    /> -->
    <van-cell class="time-select__placeholder" :title="btnText" :value="placeholder" is-link @click="showPicker = true" />
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
  Field,
  Popup,
  Picker
} from 'vant'

export default {
  name: 'VanSelect',
  components: {
    'van-cell': Cell,
    // 'van-field': Field,
    'van-popup': Popup,
    'van-picker': Picker
  },
  props: {
    curVal: {
      type: Number || String,
      default: null
    },
    placeholder: {
      type: String,
      default: ''
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
      showPicker: false
    }
  },
  watch: {
    columns(n, o) {
      console.log('n=====', n)
      const names = n.map((el) => {
        return el[this.keyText]
      })
      console.log(names)
      this.$set(this, 'formatCol', names)
    }
  },
  methods: {
    onConfirm(value) {
      console.log('============', value)
      this.value = value
      this.$emit('update:placeholder', value)
      const choicedOne = this.columns.filter((el) => {
        console.log(el[this.keyText])
        return el[this.keyText] === value
      })
      this.$emit('update:curVal', choicedOne[0][this.valText])
      console.log(choicedOne, this.curVal)
      this.showPicker = false
    }
  }
}
</script>

<style lang="scss">

</style>
