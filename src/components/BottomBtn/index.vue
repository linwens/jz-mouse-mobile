<template>
  <div class="bottom-btn df s-jcsa s-aic">
    <van-button :class="btnWidthClass" round color="#F6AC2D" size="small" type="info" @click="goback">{{ leftBtnText }}</van-button>
    <slot name="confirm">
      <van-button :class="btnWidthClass" round color="#32C985" size="small" type="info" @click="confirm">{{ rightBtnText }}</van-button>
    </slot>
  </div>
</template>

<script>
import { Button } from 'vant'

export default {
  name: 'BottomBtn',
  components: {
    'van-button': Button
  },
  props: {
    btnWidthClass: {
      type: String,
      default: 'w150'
    },
    leftBtnText: {
      type: String,
      default: '返回'
    },
    rightBtnText: {
      type: String,
      default: '确定'
    }
  },
  methods: {
    goback() {
      this.$router.back()
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss">
  .bottom-btn {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60px;
    border-top: 1px solid #D6D6D6;
    background: #fff;
  }
</style>