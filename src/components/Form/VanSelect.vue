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
    curMan: {
      type: Number,
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
        return el.userName
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
        console.log(el.userName)
        return el.userName === value
      })
      this.$emit('update:curMan', choicedOne[0].userId)
      console.log(choicedOne, this.curMan)
      this.showPicker = false
    }
  }
}
</script>

<style lang="scss">

</style>
