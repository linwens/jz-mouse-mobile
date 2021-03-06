<template>
  <div class="breed-list">
    <!-- 顶部栏 -->
    <top-bar :active-key="3">
      <template>
        <div class="w-100 df s-jcfe s-aic">
          <van-button class="w90" hairline round size="small" color="#32C985" type="info" to="/exptAdd">新增实验组</van-button>
        </div>
      </template>
    </top-bar>
    <!-- 列表 -->
    <main-list :offset="10" :is-finished="noMore" :is-loading="tableLoading" @load="getList" @refresh="getList(1)">
      <template>
        <collapse v-for="item in tableData" :key="item.id">
          <template slot="title">
            <div class="df s-aic s-jcsb">
              <span>{{ item.name }}</span>
              <i class="cl-grey-9">{{ item.startTime * 1000 | timeFormat('yyyy.MM.dd') }} - {{ item.endTime * 1000 | timeFormat('yyyy.MM.dd') }}</i>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>实验组数量：<span>{{ item.experimentSampleGroupNum }}</span></p>
              <p>小鼠数量：<span>{{ item.miceTotal }}</span></p>
            </div>
            <div class="df s-aic">
              <p class="w-100">最新检测时间：<span>{{ item.newTestTime * 1000 | timeFormat('yyyy-MM-dd hh:mm:ss') }}</span></p>
            </div>
            <div class="df s-aic">
              <p class="w-100">最新处理时间：<span>{{ item.newHandleTime * 1000 | timeFormat('yyyy-MM-dd hh:mm:ss') }}</span><expt-record v-if="item.id" :id="item.id" btn-type="text" class="ml10" /></p>
            </div>
            <div class="df s-aic">
              <p class="w-100">建模检测结果：
                <view-files :id="item.id" biz-type="mice" btn-type="text" btn-text="查看" />
                <upload-btn :id="item.id" btn-text="上传" biz-type="experiment" class="dib ml18" />
              </p>
            </div>
          </template>
          <template slot="footer">
            <set-time :id="item.id" btn-text="设置时间" type="text" class="dib mr10" :start-time="item.startTime" :end-time="item.endTime" />
            <van-button class="mr10" plain hairline round size="small" color="#333" type="info" @click="doEnd(item.id)">手动结束</van-button>
            <van-button class="mr10" plain hairline round size="small" color="#333" type="info" @click="goEdit(item)">详情</van-button>
            <van-button plain hairline round size="small" color="#EB5444" type="info" @click="rowItemDel(item)">删除</van-button>
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
import SetTime from '@/components/Dialogs/SetTime'
import ViewFiles from '@/components/ViewFiles'
import UploadBtn from '@/components/Dialogs/Upload'
import ExptRecord from '@/components/Dialogs/ExptRecord'
import { delExptObj, fetchList, endExpt } from '@/api/experiment'
import { Button, Toast, Dialog } from 'vant'

export default {
  name: 'ExperimentIndex',
  components: {
    'van-button': Button,
    ViewFiles,
    UploadBtn,
    ExptRecord,
    SetTime,
    MainList,
    Collapse,
    TopBar
  },
  data() {
    return {
      tableLoading: false,
      noMore: false,
      page: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 5 // 每页显示多少条
      },
      tableData: []
    }
  },
  created() {

  },
  methods: {
    goAdd() {
      this.goPage('ExperimentAdd', { type: 'add' })
    },
    goEdit(row) {
      const id = row.id
      this.$router.push({ name: 'ExperimentEdit', params: { id }})
    },
    goPage(r, obj) {
      this.$router.push({ name: r, params: obj })
    },
    handleRefreshChange() {
      this.getList()
    },
    // 删除
    rowItemDel: function(row) {
      Dialog.confirm({
        title: '警告',
        message: `是否确认删除实验组: "${row.name}"吗?`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delExptObj(row.id)
      }).then(() => {
        this.getList(1)
        Toast.success('删除成功')
      }).catch(function() {
      })
    },
    // 获取列表
    getList(page) {
      if (page === 1) { // 如果展示第一页，先清列表
        this.noMore = false
        this.tableData = []
      }
      this.tableLoading = true
      fetchList(Object.assign({
        current: page || this.page.page,
        size: this.page.limit
      })).then(res => {
        this.tableData = this.tableData.concat(res.data.records)
        if (this.page.page > res.data.pages) {
          this.noMore = true
        } else {
          this.page.page = res.data.current + 1
        }
        this.page.total = res.data.total
      }).finally(() => {
        this.tableLoading = false
      })
    },
    // 手动结束
    doEnd(id) {
      const _self = this
      Dialog.confirm({
        title: '警告',
        message: '是否确认结束当前实验组',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        endExpt({
          experimentId: id
        }).then((res) => {
          Toast('手动结束实验成功')
          this.getList(1)
        })
      }).catch(function() {
      })
    }
  }
}
</script>

<style lang="scss">

</style>
