<template>
  <div>
    <van-button round size="small" color="#00CB7C" type="primary" @click="showList">{{ btnText }}</van-button>
    <!-- 基因型列表弹窗 -->
    <van-popup
      v-model="genesRecordVisible"
      class="pb10"
      position="bottom"
      :style="{ height: '50%' }"
      get-container="body"
    >
      <collapse v-for="item in genesData" :key="item.id">
        <template slot="title">
          <div class="df s-aic s-jcsb">
            <span>{{ item.geneName }}</span>
          </div>
        </template>
        <template slot="content">
          <div class="df s-aic">
            <p>饲养条件：<span>{{ item.miceCondition }}</span></p>
            <p>负责人：<span>{{ item.operatorName }}</span></p>
          </div>
          <div class="df s-aic">
            <p>健康状况：<span>{{ item.status }}</span></p>
            <p>毛色：<span>{{ item.color }}</span></p>
          </div>
          <div class="df s-aic">
            <p>应用领域：<span>{{ item.area }}</span></p>
          </div>
        </template>
        <template slot="footer">
          <van-button class="mr10" plain hairline round size="small" color="#333" type="info" @click="choice(item)">选择</van-button>
        </template>
      </collapse>
    </van-popup>
  </div>
</template>

<script>
import Collapse from '@/components/Collapse/index.vue'
import { Button, Popup } from 'vant'
import { getLisByVariety } from '@/api/genes'

export default {
  name: 'GenesChoose',
  components: {
    'van-button': Button,
    'van-popup': Popup,
    Collapse
  },
  props: {
    id: {
      type: null,
      default: null
    },
    btnText: {
      type: String,
      default: '查看'
    },
    genes: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 基因型列表
      genesRecordVisible: false,
      genesLoading: false,
      genesData: []
    }
  },
  methods: {
    // 展示列表
    showList() {
      this.getList()
      this.genesRecordVisible = true
    },
    // 获取列表
    getList() {
      this.genesLoading = true
      getLisByVariety(Object.assign({
        id: this.id
      })).then(res => {
        this.genesData = res.data
      }).finally(() => {
        this.genesLoading = false
      })
    },
    handleRefreshChange() {
      this.getList()
    },
    // 选择基因型
    choice(row) {
      this.$emit('update:genes', JSON.stringify(row))
      this.genesRecordVisible = false
    }
  }
}
</script>

<style lang="scss">

</style>
