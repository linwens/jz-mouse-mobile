<template>
  <div class="main-list pb20">
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="offset"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <slot />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { PullRefresh, List } from 'vant'

export default {
  name: 'MainList',
  components: {
    'van-pull-refresh': PullRefresh,
    'van-list': List
  },
  props: {
    offset: {
      type: Number,
      default: 200
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isFinished: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  watch: {
    isLoading(n, o) {
      console.log('关闭啊！', n)
      this.loading = n
    },
    isFinished(n, o) {
      this.finished = n
    }
  },
  methods: {
    onLoad() {
      // setTimeout(() => {
      //   if (this.refreshing) {
      //     this.list = [];
      //     this.refreshing = false;
      //   }

      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1);
      //   }
      //   this.loading = false;

      //   if (this.list.length >= 40) {
      //     this.finished = true;
      //   }
      // }, 1000);
      this.$emit('load')
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      // this.$emit('update:isLoading', true)
      console.log('下拉了')
      this.$emit('refresh')
    }
  }
}
</script>

<style lang="scss">
  .main-list {
    min-height: 30px;
    .van-pull-refresh {
      // padding-bottom: 20px;
    }
  }
</style>
