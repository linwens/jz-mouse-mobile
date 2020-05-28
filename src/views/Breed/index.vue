<template>
  <div class="breed-list">
    <!-- 顶部栏 -->
    <top-bar>
      <template>
        <div class="w-100 df s-jcfe s-aic">
          <van-button class="w90" hairline round size="small" color="#32C985" type="info" to="/breededit">新增实验组</van-button>
        </div>
      </template>
    </top-bar>
    <!-- 列表 -->
    <main-list>
      <template>
        <collapse>
          <template slot="title">
            <div class="df s-aic del-list__item-title">
              <span>实验组ADEG</span>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>小鼠数量：<span>8</span></p>
            </div>
            <div class="df s-aic">
              <p>繁育时间：<span>2020-02-04 20:02:22 </span></p>
            </div>
            <div class="df s-aic">
              <p>创建时间：<span>2020-02-04 20:02:22 </span></p>
            </div>
          </template>
          <template slot="footer">
            <van-button class="mr10" plain hairline round size="small" color="#333" type="info">查看</van-button>
            <van-button plain hairline round size="small" color="#EB5444" type="info">删除</van-button>
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
import { delDelMouse, fetchList } from '@/api/delList'
import { Button } from 'vant'

export default {
  name: 'BreedList',
  components: {
    'van-button': Button,
    MainList,
    Collapse,
    TopBar
  },
  data() {
    return {}
  }

}
</script>

<style>

</style>