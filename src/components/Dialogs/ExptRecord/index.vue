<template>
  <div>
    <van-button :class="btnWidthClass" round :size="size" color="#333" plain type="primary" @click="showList">{{ btnText }}</van-button>
    <!-- 文件列表弹窗 -->
    <van-popup
      v-model="recordDialog"
      position="bottom"
      :style="{ height: '50%' }"
      get-container="body"
    >
      <collapse v-for="item in recordList" :key="item.id">
        <template slot="title">
          <div class="df s-aic s-jcsb">
            <span>实验记录</span>
          </div>
        </template>
        <template slot="content">
          <div class="df s-aic">
            <p>操作类型：<span>{{ item.operationType === 0 ? '检测' : '处理' }}</span></p>
            <p>操作人：<span>{{ item.operationName }}</span></p>
          </div>
          <div class="df s-aic">
            <p>操作时间：<span>{{ item.createTime * 1000 | timeFormat('yyyy年MM月dd日 hh:mm:ss') }}</span></p>
          </div>
          <div class="df s-aic">
            <p>处理检测时间：<span>{{ item.time * 1000 | timeFormat('yyyy年MM月dd日 hh:mm:ss') }}</span></p>
          </div>
        </template>
        <template slot="footer">
          <van-button class="mr10" plain hairline round size="small" color="#EB5444" type="info" @click="rowItemDel(item)">删除</van-button>
        </template>
      </collapse>
    </van-popup>
  </div>
</template>

<script>
import Collapse from '@/components/Collapse/index.vue'
import { Button, Popup, Toast, Dialog } from 'vant'
import { getExptRecord, delExptRecord } from '@/api/experiment'

export default {
  name: 'ExptRecord',
  components: {
    'van-button': Button,
    'van-popup': Popup,
    Collapse
  },
  props: {
    id: {
      type: Number,
      default: null
    },
    btnWidthClass: {
      type: String,
      default: 'w75'
    },
    btnText: {
      type: String,
      default: '查看记录'
    },
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      isAdmin: false,
      // 基因型列表
      recordDialog: false,
      recordLoading: false,
      recordList: [],
      page: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 10 // 每页显示多少条
      }
    }
  },
  mounted() {
    this.isAdmin = this.$store.getters.info.admin
  },
  methods: {
    // 展示列表
    showList() {
      console.log(this.id)
      if (!this.id) {
        Toast.fail('请先选中小鼠')
        return
      }
      this.getList()
      this.recordDialog = true
    },
    // 获取列表
    getList() {
      this.recordLoading = true
      getExptRecord({
        experimentId: this.id,
        current: this.page.page,
        size: this.page.limit
      }).then(res => {
        this.recordList = res.data.records
        console.log(this.recordList)
      }).finally(() => {
        this.recordLoading = false
      })
    },
    handleRefreshChange() {
      this.getList()
    },
    // 删除
    rowItemDel: function(row) {
      if (!(row.own || this.isAdmin)) { // 不是自己的信息无权删除
        Toast.fail('无权限删除他人记录')
        return
      }
      Dialog.confirm({
        title: '警告',
        message: `是否确认删除实验记录 ${row.id}?`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delExptRecord(row.id)
      }).then(() => {
        this.getList()
        Toast.success('删除成功')
      }).catch(function() {
      })
    }
  }
}
</script>

<style lang="scss">

</style>
