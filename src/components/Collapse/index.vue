<template>
  <div class="xs-collapse">
    <van-collapse v-model="activeNames">
      <van-collapse-item title="标题1" name="1">
        <template #title>
          <slot name="title" />
        </template>
        <div class="xs-collapse__content">
          <slot name="content" />
        </div>
        <div v-if="footer" class="xs-collapse__fotter h35 df s-aic s-jcfe">
          <slot name="footer" />
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import { Collapse, CollapseItem } from 'vant'

export default {
  name: 'Collapse',
  components: {
    'van-collapse': Collapse,
    'van-collapse-item': CollapseItem
  },
  props: {
    footer: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeNames: ['1']
    }
  }
}
</script>

<style lang="scss">
  .xs-collapse {
    .van-collapse  {
      box-sizing: border-box;
      padding: 0 14px;
      width: 100%;
      margin: 10px auto 0;
    }
    .van-collapse-item {
      border: 1px solid #D6D6D6;
      &__content {
        padding: 0;
      }
      .van-cell {
        height: 50px;
        align-items: center;
        background-color: #F0F0F0;
      }
    }

    &__content {
      padding: 10px 15px;
      font-size: 14px;
      p:nth-child(1) {
        min-width: 47%;
        line-height: 1.6;
      }
      span {
        color: #333;
      }
      &--multiple {
        span {
          word-break:break-all;
          line-height: 1;
        }
        span:nth-child(1) {
          min-width: 50%;
        }
      }
    }

    &__fotter {
      border-top: 1px solid #D6D6D6;
      padding: 0 7px;
    }
  }
</style>
