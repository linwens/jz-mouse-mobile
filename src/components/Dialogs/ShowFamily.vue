<template>
  <div class="dib">
    <el-button :type="btnType" :size="btnSize" @click="showFamily()">{{ btnText }}</el-button>
    <!-- 家谱弹窗 -->
    <el-dialog
      :style="{'margin-top': dupCount ? `-${20 * dupCount}px` : 0, 'left': 20 * dupCount + 'px'}"
      title="家谱记录"
      :visible.sync="dialogVisible"
      append-to-body
      width="70%"
    >
      <family-tree v-if="dialogVisible" :num="dupCount" :mice-id="miceId" />
    </el-dialog>
  </div>
</template>

<script>
import FamilyTree from '@/components/Charts/FamilyTree'
console.log('====4444=', FamilyTree)

export default {
  name: 'ShowFamily',
  components: {
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
