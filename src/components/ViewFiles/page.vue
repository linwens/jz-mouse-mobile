<template>
  <div class="view-files">
    <main-list>
      <template>
        <collapse v-for="item in filesData" :key="item.id">
          <template slot="title">
            <div class="df s-aic s-jcsb">
              <span>小鼠文件</span>
              <i class="cl-grey-9">.jpg</i>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>上传时间：<span>2020-02-04 20:02:22 </span></p>
            </div>
          </template>
          <template slot="footer">
            <van-button class="mr10" plain hairline round size="small" color="#333" type="info">预览</van-button>
            <van-button plain hairline round size="small" color="#EB5444" type="info">移除</van-button>
          </template>
        </collapse>
      </template>
    </main-list>
    <!-- 底部按钮 -->
    <bottom-btn>
      <template slot="confirm">
        <span></span>
      </template>
    </bottom-btn>
  </div>
</template>

<script>
import FileViewer from '@/components/FileViewer'
import MainList from '@/components/List/index.vue'
import Collapse from '@/components/Collapse/index.vue'
import BottomBtn from '@/components/BottomBtn/index.vue'
import { delFile, getFilesList } from '@/api/cmn'
import { Button, Toast, Dialog } from 'vant'

export default {
  name: 'ViewFiles',
  components: {
    FileViewer,
    'van-button': Button,
    MainList,
    BottomBtn,
    Collapse
  },
  props: {
    // id: {
    //   type: Number,
    //   default: 0
    // },
    bizType: { // 上传文件对应的业务类型
      type: String,
      default: ''
    },
    cacheList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      id: null,
      isAdmin: false,
      btnText: '查看',
      // 实验记录表格
      filesRecordVisible: false,
      filesLoading: false,
      filesPage: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 10 // 每页显示多少条
      },
      filesData: []
    }
  },
  watch: {
    cacheList(n, o) {
      console.log('更新cachelist')
      this.$set(this, 'filesData', n)
    }
  },
  created() {
    this.isAdmin = this.$store.getters.info.admin
    this.id = this.$route.params.id
    if (this.id) {
      this.getList()
    }
  },
  methods: {
    // 展示列表
    showList() {
      if (this.id) {
        this.getList()
      }
      this.filesRecordVisible = true
    },
    // 获取列表
    getList() {
      this.filesLoading = true
      getFilesList(Object.assign({
        bizId: this.id,
        bizType: this.bizType,
        current: this.filesPage.page,
        size: this.filesPage.limit
      })).then(response => {
        this.filesData = response.data.records
        this.filesPage.total = response.data.total
      }).finally(() => {
        this.filesLoading = false
      })
    },
    handleRefreshChange() {
      this.getList()
    },
    // 删除
    rowItemDel: function(scope) {
      const _this = this
      if (!(scope.row.own || this.isAdmin)) { // 不是自己的信息无权删除
        Toast.fail('无权限删除他人负责的小鼠的文件')
        return
      }
      Dialog.confirm({
        title: '警告',
        message: `是否确认删除数据为${scope.row.fileName}的文件吗?`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        if (scope.row.fileId) {
          return delFile(scope.row.fileId)
        }
        if (!scope.row.fileId) {
          _this.filesData.splice(scope.$index, 1)
        }
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
  .view-files {
    margin-top: 20px;
  }
</style>
