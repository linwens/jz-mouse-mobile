<template>
  <div class="breed-list">
    <!-- 顶部栏 -->
    <top-bar :active-key="4">
      <template>
        <div class="w-100 df s-jcfe s-aic">
          <van-button class="w90" hairline round size="small" color="#32C985" type="info" to="/breededit">新增繁育组</van-button>
        </div>
      </template>
    </top-bar>
    <!-- 列表 -->
    <main-list>
      <template>
        <collapse v-for="item in tableData" :key="item.id">
          <template slot="title">
            <div class="df s-aic">
              <span>实验组ADEGss</span>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>小鼠数量：<span>8</span></p>
            </div>
            <div class="df s-aic">
              <p>繁育时间：<span>2020-02-04 20:02:22 </span></p>
            </div>
            <div class="df s-aic">
              <p>创建时间：<span>2020-02-04 20:02:22 </span></p>
            </div>
          </template>
          <template slot="footer">
            <van-button class="mr10" plain hairline round size="small" color="#333" type="info">查看</van-button>
            <van-button plain hairline round size="small" color="#EB5444" type="info">删除</van-button>
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
import { delDelMouse, fetchList } from '@/api/delList'
import { Button, Toast } from 'vant'

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
      page: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 10 // 每页显示多少条
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
      const id = row.id
      this.goPage({ type: 'edit', id: id })
    },
    goPage(obj) {
      this.$router.push({ name: 'breedEdit', params: obj })
    },
    handleRefreshChange() {
      this.getList()
    },
    // 删除
    rowItemDel: function(row) {
      const _this = this
      this.$confirm('是否确认删除繁育组："' + row.name + '"的数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delBreedGroup(row.id)
      }).then(() => {
        this.getList()
        Toast.success('删除成功')
      }).catch(function() {
      })
    },
    // 获取列表
    getList() {
      this.tableLoading = true
      fetchList(Object.assign({
        current: this.page.page,
        size: this.page.limit
      })).then(response => {
        this.tableData = response.data.records
        this.page.total = response.data.total
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>

<style>

</style>