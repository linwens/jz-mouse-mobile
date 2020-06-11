<template>
  <div class="dib">
    <span v-if="btnType==='text'" class="txt-btn--green" @click="dialogVisible = true">{{ btnText }}</span>
    <van-button v-else round :size="btnSize" color="#00CB7C" type="primary" @click="showFamily">{{ btnText }}</van-button>
    <!-- 家谱弹窗 -->
    <van-popup
      v-model="dialogVisible"
      get-container="body"
      :style="{width: '80%', height: '90%', 'margin-top': dupCount ? `-${20 * dupCount}px` : 0, 'left': 20 * dupCount + 'px'}"
    >
      <family-tree v-if="dialogVisible" :num="dupCount" :mice-id="miceId" />
    </van-popup>
  </div>
</template>

<script>
import FamilyTree from '@/components/Charts/FamilyTree'
import { Popup } from 'vant'

export default {
  name: 'ShowFamily',
  components: {
    'van-popup': Popup,
    FamilyTree
  },
  props: {
    dupCount: {
      type: Number,
      default: 0
    },
    btnType: {
      type: String,
      default: 'text'
    },
    btnSize: {
      type: String,
      default: 'medium'
    },
    btnText: {
      type: String,
      default: '查看'
    },
    miceId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    // 展示家谱
    showFamily() {
      this.dialogVisible = true
    }
  }
}
</script>

<style>

</style>
