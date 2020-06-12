<template>
  <div class="genes-list">
    <!-- 顶部栏 -->
    <top-bar :active-key="1">
      <template>
        <div class="w-100 df s-jcsb s-aic">
          <div>
            <add-variety class="w90 ml10" />
            <van-button class="w90 ml10" hairline round size="small" color="#32C985" type="info" to="/varietyEdit">新增基因型</van-button>
          </div>
          <span class="txt-btn--green fs14" @click="goList">查看品系列表</span>
        </div>
      </template>
    </top-bar>
    <!-- 列表 -->
    <main-list :is-loading="tableLoading" @load="getList" @refresh="getList(1)">
      <template>
        <collapse v-for="item in tableData" :key="item.miceGeneId">
          <template slot="title">
            <div class="df s-aic xs-collapse__content--multiple">
              <span>ER-334</span>
              <span>34-IO98</span>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>饲养条件：<span>饲养条件巴拉啦</span></p>
              <p>负责人：<span>小勾</span></p>
            </div>
            <div class="df s-aic">
              <p>健康状况：<span>健康</span></p>
              <p>毛色：<span>灰色</span></p>
            </div>
            <div class="df s-aic">
              <p>应用领域：<span>范德萨范德萨发飞洒发发顺丰撒是否是否范德萨范德萨发飞洒发发顺丰撒是否是否范德萨范德萨发飞洒发发顺丰撒是否是否</span></p>
            </div>
          </template>
          <template slot="footer">
            <span class="txt-btn--green fs14">编辑</span>
            <span class="txt-btn--red fs14 ml15 mr8">删除</span>
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
import AddVariety from '@/components/Dialogs/AddVariety.vue'
import { goPage } from '@/components/Mixins/goPage'
import { fetchList } from '@/api/variety'
import { delGenes } from '@/api/genes'
import { Button, Toast } from 'vant'

export default {
  name: 'GenesList',
  components: {
    'van-button': Button,
    MainList,
    Collapse,
    TopBar,
    AddVariety
  },
  mixins: [goPage],
  data() {
    return {
      isAdmin: false,
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
    this.isAdmin = this.$store.getters.info.admin
  },
  methods: {
    goGenes() {
      this.goPage('VarietyEdit', { type: 'add' })
    },
    goList() {
      this.goPage('VarietyList', { type: 'list' })
    },
    goEdit(row) {
      this.goPage('VarietyEdit', row)
    },
    goPage(r, obj) {
      this.$router.push({ name: r, params: obj })
    },
    handleRefreshChange() {
      this.getList()
    },
    // 新增品系
    addVariety() {},
    // 删除
    rowItemDel: function(row) {
      console.log(row)
      const _this = this
      this.$confirm(`是否确认删除品系"${row.varietiesName}"的"${row.geneName}"基因型?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('del====row', row)
        const { miceGeneId } = row
        return delGenes(miceGeneId)
      }).then(() => {
        this.getList()
        Toast.success('删除成功')
      }).catch(() => {
      })
    },
    // 获取列表
    getList(page) {
      this.tableLoading = true
      if (this.noMore) return false
      fetchList(Object.assign({
        current: page || this.page.page,
        size: this.page.limit
      })).then(response => {
        this.tableData = this.tableData.concat(response.data.records)
        this.page.page = response.data.current + 1
        if (this.page.page > response.data.pages) {
          this.noMore = true
        }
        this.page.total = response.data.total
      }).finally(() => {
        console.log('结束')
        this.tableLoading = false
      })
    }
  }
}
</script>

<style>

</style>