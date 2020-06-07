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
    <van-cell class="time-select__placeholder" :title="btnText" is-link @click="showPicker = true">
      <template #default>
        <slot name="placeholder" />
      </template>
    </van-cell>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
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
    btnText: {
      type: String,
      default: '时间选择'
    }
  },
  data() {
    return {
      value: '',
      columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
      showPicker: false
    }
  },
  methods: {
    onConfirm(value) {
      this.value = value
      this.showPicker = false
    }
  }
}
</script>

<style lang="scss">

</style>
