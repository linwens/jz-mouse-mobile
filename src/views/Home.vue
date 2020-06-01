<template>
  <div class="home">
    <!-- 顶部栏 -->
    <top-bar :active-key="0">
      <template>
        <div class="w-100 df s-jcsb s-aic">
          <xs-select class="ml17" />
          <van-icon name="chat-o" dot />
        </div>
      </template>
    </top-bar>
    <!-- bar -->
    <sum-bar id="1" :show="activeName === 'mine'" :type="barType" />
    <tab-bar />
  </div>
</template>

<script>
import {
  Icon
} from 'vant'
// @ is an alias to /src
import TopBar from '@/components/TopBar/index.vue'
import FormSelect from '@/components/Form/select.vue'
import TabBar from '@/components/TabBar/index.vue'
import SumBar from '@/components/Charts/SumBar'

export default {
  name: 'Home',
  components: {
    'van-icon': Icon,
    'xs-select': FormSelect,
    TopBar,
    TabBar,
    SumBar
  },
  data() {
    return {
      activeName: 'mine'
    }
  }
}
</script>
<style lang="scss">
  .test-box{
    width: 200px;
    height: 50px;
    background-color: red;
  }
</style>
