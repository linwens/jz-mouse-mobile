<template>
  <div class="view-files">
    <main-list :offset="10" :is-finished="noMore" :is-loading="filesLoading" @load="getList" @refresh="getList(1)">
      <template>
        <collapse v-for="(item, index) in filesData" :key="item.id">
          <template slot="title">
            <div class="df s-aic s-jcsb">
              <span>{{ item.fileName }}</span>
              <i class="cl-grey-9">{{ item.fileType }}</i>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>上传时间：<span>{{ item.createTime * 1000 | timeFormat('yyyy年MM月dd日 hh:mm:ss') }}</span></p>
            </div>
          </template>
          <template slot="footer">
            <van-button class="mr10" plain hairline round size="small" color="#333" type="info">预览</van-button>
            <van-button plain hairline round size="small" color="#EB5444" type="info" @click="rowItemDel({item, index})">移除</van-button>
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
    // bizType: { // 上传文件对应的业务类型
    //   type: String,
    //   default: ''
    // },
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
      bizType: null,
      isAdmin: false,
      btnText: '查看',
      // 实验记录表格
      filesRecordVisible: false,
      filesLoading: false,
      noMore: false,
      filesPage: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 5 // 每页显示多少条
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
    this.id = this.$route.query.id
    this.bizType = this.$route.query.bizType
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
    getList(page) {
      if (page === 1) { // 如果展示第一页，先清列表
        this.noMore = false
        this.filesData = []
      }
      this.filesLoading = true
      getFilesList(Object.assign({
        bizId: this.id,
        bizType: this.bizType,
        current: page || this.filesPage.page,
        size: this.filesPage.limit
      })).then(res => {
        this.filesData = this.filesData.concat(res.data.records)
        if (this.filesPage.page >= res.data.pages) {
          this.noMore = true
        } else {
          this.filesPage.page = res.data.current + 1
        }
        this.filesPage.total = res.data.total
      }).finally(() => {
        this.filesLoading = false
      })
    },
    // handleRefreshChange() {
    //   this.getList()
    // },
    // 删除
    rowItemDel: function(scope) {
      const _this = this
      if (!(scope.item.own || this.isAdmin)) { // 不是自己的信息无权删除
        Toast.fail('无权限删除他人负责的小鼠的文件')
        return
      }
      Dialog.confirm({
        title: '警告',
        message: `是否确认删除数据为${scope.item.fileName}的文件吗?`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        if (scope.item.fileId) {
          return delFile(scope.item.fileId)
        }
        if (!scope.item.fileId) {
          _this.filesData.splice(scope.index, 1)
        }
      }).then(() => {
        this.getList(1)
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
