<template>
  <div class="genes-list">
    <!-- 顶部栏 -->
    <top-bar :active-key="1">
      <template>
        <div class="w-100 df s-jcsb s-aic">
          <div>
            <add-variety class="w90 ml10" />
            <van-button class="w90 ml10" hairline round size="small" color="#32C985" type="info" to="/varietyEdit">新增基因型</van-button>
          </div>
          <span class="txt-btn--green fs14" @click="goList">查看品系列表</span>
        </div>
      </template>
    </top-bar>
    <!-- 列表 -->
    <main-list>
      <template>
        <collapse>
          <template slot="title">
            <div class="df s-aic xs-collapse__content--multiple">
              <span>ER-334</span>
              <span>34-IO98</span>
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
            <span class="txt-btn--green fs14">编辑</span>
            <span class="txt-btn--red fs14 ml15 mr8">删除</span>
          </template>
        </collapse>
      </template>
    </main-list>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar/index.vue'
import MainList from '@/components/List/index.vue'
import Collapse from '@/components/Collapse/index.vue'
import AddVariety from '@/components/Dialogs/AddVariety.vue'
import { goPage } from '@/components/Mixins/goPage'
import { delDelMouse, fetchList } from '@/api/delList'
import { Button } from 'vant'

export default {
  name: 'GenesList',
  components: {
    'van-button': Button,
    MainList,
    Collapse,
    TopBar,
    AddVariety
  },
  mixins: [goPage],
  data() {
    return {}
  },
  methods: {
    goList() {
      this.goPage('VarietyList', { type: 'list' })
    }
  }

}
</script>

<style>

</style>