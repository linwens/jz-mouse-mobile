<template>
  <div>
    <van-button round size="small" color="#00CB7C" type="primary" @click="showList">{{ btnText }}</van-button>
    <!-- 基因型列表弹窗 -->
    <van-popup
      v-model="genesRecordVisible"
      position="bottom"
      :style="{ height: '50%' }"
      get-container="body"
    >
      <main-list>
        <template>
          <collapse v-for="item in genesData" :key="item.id">
            <template slot="title">
              <div class="df s-aic s-jcsb">
                <span>基因型</span>
              </div>
            </template>
            <template slot="content">
              <div class="df s-aic">
                <p>饲养条件：<span>饲养条件巴拉啦</span></p>
                <p>负责人：<span>小勾</span></p>
              </div>
              <div class="df s-aic">
                <p>健康状况：<span>健康</span></p>
                <p>毛色：<span>灰色</span></p>
              </div>
              <div class="df s-aic">
                <p>应用领域：<span>范德萨范德萨发飞洒发发顺丰撒是否是否范德萨范德萨发飞洒发发顺丰撒是否是否范德萨范德萨发飞洒发发顺丰撒是否是否</span></p>
              </div>
            </template>
            <template slot="footer">
              <van-button class="mr10" plain hairline round size="small" color="#333" type="info" @click="choice(item)">选择</van-button>
            </template>
          </collapse>
        </template>
      </main-list>
    </van-popup>
  </div>
</template>

<script>
import MainList from '@/components/List/index.vue'
import Collapse from '@/components/Collapse/index.vue'
import { Button, Popup } from 'vant'
import { getLisByVariety } from '@/api/genes'

export default {
  name: 'GenesChoose',
  components: {
    'van-button': Button,
    'van-popup': Popup,
    MainList,
    Collapse
  },
  props: {
    id: {
      type: Number,
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
      getLisByVariety({
        id: this.id
      }).then(res => {
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
