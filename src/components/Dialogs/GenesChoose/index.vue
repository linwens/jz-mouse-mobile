<template>
  <div>
    <el-button type="primary" size="mini" class="w60" @click="showList()">{{ btnText }}</el-button>
    <!-- 文件列表弹窗 -->
    <el-dialog title="选择基因型" width="70%" :visible.sync="genesRecordVisible">
      <merge-table
        ref="crud"
        :data="genesData"
        :table-option="genesOption"
        :table-loading="genesLoading"
        @refresh-change="handleRefreshChange"
      >
        <template slot="menu" slot-scope="{scope}">
          <el-button
            type="text"
            size="mini"
            @click="choice(scope.row)"
          >
            选择
          </el-button>
        </template>
      </merge-table>
    </el-dialog>
  </div>
</template>

<script>
import MergeTable from '@/components/MergeTable'
import { genesOption } from './table'
import { getLisByVariety } from '@/api/genes'

export default {
  name: 'GenesChoose',
  components: {
    MergeTable
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
      genesOption,
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
