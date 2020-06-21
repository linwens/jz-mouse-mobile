<template>
  <div class="dib">
    <span v-if="btnType === 'text'" class="txt-btn--green fs14" @click="goViewFiles">{{ btnText }}</span>
    <van-button v-else class="w-100" hairline round size="small" color="#32C985" type="info" @click="goViewFiles">{{ btnText }}</van-button>
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
    btnType: {
      type: String,
      default: 'button'
    },
    btnText: {
      type: String,
      default: '查看文件'
    },
    id: {
      type: Number,
      default: null
    },
    bizType: { // 上传文件对应的业务类型
      type: String,
      default: ''
    },
    cacheList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {
    goViewFiles() {
      console.log('goViewFiles===', this.id, this.bizType)
      this.$router.push({ path: '/viewFiles', query: {
        id: this.id,
        bizType: this.bizType
      }})
      // this.goPage('ViewFiles', {
      //   id: this.id,
      //   bizType: this.bizType
      // })
    }
  }
}
</script>

<style>

</style>
