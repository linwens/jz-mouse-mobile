<template>
  <div class="breed-list">
    <!-- 顶部栏 -->
    <top-bar :active-key="4">
      <template>
        <div class="w-100 df s-jcfe s-aic">
          <van-button class="w90" hairline round size="small" color="#32C985" type="info" to="/exptEdit">新增实验组</van-button>
        </div>
      </template>
    </top-bar>
    <!-- 列表 -->
    <main-list>
      <template>
        <collapse>
          <template slot="title">
            <div class="df s-aic s-jcsb">
              <span>实验组ADEGss</span>
              <i class="cl-grey-9">2020.02.04-2020.02.04</i>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>实验组数量：<span>8</span></p>
              <p>小鼠数量：<span>8</span></p>
            </div>
            <div class="df s-aic">
              <p>最新检测时间：<span>2020-02-04 20:02:22 </span></p>
            </div>
            <div class="df s-aic">
              <p>最新处理时间：<span>2020-02-04 20:02:22 </span><span class="txt-btn--green ml14">操作记录</span></p>
            </div>
            <div class="df s-aic">
              <p>建模检测结果：<span class="txt-btn--green">查看</span><span class="txt-btn--green ml18">上传</span></p>
            </div>
          </template>
          <template slot="footer">
            <van-button class="mr10" plain hairline round size="small" color="#333" type="info">设置时间</van-button>
            <van-button class="mr10" plain hairline round size="small" color="#333" type="info">手动结束</van-button>
            <van-button class="mr10" plain hairline round size="small" color="#333" type="info">详情</van-button>
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
  name: 'ExperimentIndex',
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

<style lang="scss">

</style>
