<template>
  <div class="breed-list">
    <!-- 顶部栏 -->
    <top-bar :active-key="4">
      <template>
        <div class="w-100 df s-jcfe s-aic">
          <van-button class="w90" hairline round size="small" color="#32C985" type="info" @click="goAdd">新增繁育组</van-button>
        </div>
      </template>
    </top-bar>
    <!-- 列表 -->
    <main-list :offset="10" :is-finished="noMore" :is-loading="tableLoading" @load="getList" @refresh="getList(1)">
      <template>
        <collapse v-for="item in tableData" :key="item.id">
          <template slot="title">
            <div class="df s-aic">
              <span>{{ item.name }}</span>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>小鼠数量：<span>{{ item.miceSum }}</span></p>
            </div>
            <div class="df s-aic">
              <p>繁育时间：<span>{{ item.breedTime * 1000 | timeFormat('yyyy-MM-dd hh:mm:ss') }}</span></p>
            </div>
            <div class="df s-aic">
              <p>创建时间：<span>{{ item.createTime * 1000 | timeFormat('yyyy-MM-dd hh:mm:ss') }}</span></p>
            </div>
          </template>
          <template slot="footer">
            <van-button class="mr10" plain hairline round size="small" color="#333" type="info" @click="goEdit(item)">查看</van-button>
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
import { delBreedGroup, fetchList } from '@/api/breed'
import { Button, Toast, Dialog } from 'vant'

export default {
  name: 'BreedList',
  components: {
    'van-button': Button,
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
      this.goPage({ type: 'add', id: 0 })
    },
    goEdit(row) {
      console.log('goEdit', row)
      const id = row.id
      this.goPage({ type: 'edit', id: id })
    },
    goPage(obj) {
      this.$router.push({ name: 'BreedEdit', params: obj })
    },
    handleRefreshChange() {
      this.getList()
    },
    // 删除
    rowItemDel: function(row) {
      Dialog.confirm({
        title: '警告',
        message: `是否确认删除繁育组："${row.name}"的数据?`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delBreedGroup(row.id)
      }).then(() => {
        this.getList()
        Toast.success('删除成功')
      }).catch(() => {
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
    }
  }
}
</script>

<style>

</style>
