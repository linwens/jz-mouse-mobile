<template>
  <div class="dib">
    <i class="mouse__info--i dib" :style="{'width': '16px', 'height': '16px', 'backgroundColor': colorSquare}" @click="colorDialog = true" />
    <van-dialog
      v-model="colorDialog"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="#FF6358"
      @confirm="selectColor"
    >
      <div class="df s-jcc s-aic p10">
        <chrome-picker v-model="colorObj" />
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { Chrome } from 'vue-color'
import { Dialog } from 'vant'

export default {
  name: 'ColorPicker',
  components: {
    'chrome-picker': Chrome,
    [Dialog.Component.name]: Dialog.Component
  },
  props: {
    color: {
      type: String,
      default: '#f4f4f4'
    }
  },
  data() {
    return {
      colorDialog: false,
      colorSquare: this.color,
      colorObj: this.color
    }
  },
  watch: {
    color(n, o) {
      console.log('watch-color==', n)
      this.colorSquare = this.color
    }
  },
  methods: {
    selectColor() {
      console.log('colorObj====', this.colorObj)
      this.colorSquare = this.colorObj.hex
      this.$emit('update:color', this.colorObj.hex)
    }
  }
}
</script>

<style>

</style>
