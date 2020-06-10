<template>
  <div>
    <van-button class="w-100" hairline round size="small" color="#32C985" type="info" @click="goViewFiles">查看文件</van-button>
  </div>
</template>

<script>
import { goPage } from '@/components/Mixins/goPage'
import { Button } from 'vant'

export default {
  name: 'ViewFileGO',
  components: {
    'van-button': Button
  },
  mixins: [goPage],
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  methods: {
    goViewFiles() {
      this.goPage({ name: 'ViewFiles', params: {
        id: this.id
      }
      })
    }
  }
}
</script>

<style>

</style>
