<template>
  <div class="sidebar df s-aic pl15 pr20 h50">
    <svg-icon icon-class="tab-open" class="fs20" @click="showSideBar"/>
    <slot></slot>
    <!-- 侧边栏 -->
    <van-popup v-model="show" position="left" :style="{ height: '100%' }">
      <div class="df s-jcfs s-aic p16">
        <svg-icon icon-class="tab-close" class="fs20" />
      </div>
      <van-sidebar v-model="curItem">
        <van-sidebar-item title="首页" url="/#/" />
        <van-sidebar-item title="品系管理" url="/#/genesList" />
        <van-sidebar-item title="小鼠管理" />
        <van-sidebar-item title="实验管理" url="/#/exptList" />
        <van-sidebar-item title="繁育管理" url="/#/breedList" />
        <van-sidebar-item title="移除小鼠列表" url="/#/delList" />
        <!-- <van-sidebar-item title="待处理事项" /> -->
      </van-sidebar>
    </van-popup>
  </div>
</template>

<script>
import {
  // Button,
  Sidebar,
  SidebarItem,
  Popup,
} from 'vant';

export default {
  name: 'TopBar',
  components: {
    // 'van-button': Button,
    'van-sidebar': Sidebar,
    'van-sidebar-item': SidebarItem,
    'van-popup': Popup,
  },
  props: {
    activeKey: { // 标签索引
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      show: false,
      curItem: this.activeKey
      // activeKey: 0, // 标签索引
    };
  },
  methods: {
    showSideBar() {
      this.show = true;
    },
  },
};
</script>

<style lang="scss">
  .sidebar {
    .van-sidebar {
      width: 187px;
    }
    .van-sidebar-item {
      padding-left: 17px;
      background-color: #fff;
    }
    .van-sidebar-item--select, .van-sidebar-item--select:active {
      background-color: #DFECF4;
      border-color: #58A2FB;
    }
  }
</style>
