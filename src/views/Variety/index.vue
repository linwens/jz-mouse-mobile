<template>
  <div class="genes-list">
    <!-- 顶部栏 -->
    <top-bar :active-key="1">
      <template>
        <div class="w-100 df s-jcsb s-aic">
          <div>
            <add-variety class="w90 ml10" @done="getList(1)" />
            <van-button class="w90 ml10" hairline round size="small" color="#32C985" type="info" to="/varietyEdit">新增基因型</van-button>
          </div>
          <span class="txt-btn--green fs14" @click="goList">查看品系列表</span>
        </div>
      </template>
    </top-bar>
    <!-- 列表 -->
    <main-list :offset="10" :is-finished="noMore" :is-loading="tableLoading" @load="getList" @refresh="getList(1)">
      <template>
        <collapse v-for="item in tableData" :key="item.miceGeneId">
          <template slot="title">
            <div class="df s-aic xs-collapse__content--multiple">
              <span class="fs10" style="word-break:break-all;line-height: 1;">{{ item.varietiesName }}</span>
              <span class="fs10" style="word-break:break-all;line-height: 1;">{{ item.geneName }}</span>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>饲养条件：<span>{{ item.miceCondition }}</span></p>
              <p>负责人：<span>{{ item.operatorName }}</span></p>
            </div>
            <div class="df s-aic">
              <p>健康状况：<span>{{ item.status }}</span></p>
              <p>毛色：<span>{{ item.color }}</span></p>
            </div>
            <div class="df s-aic">
              <p>应用领域：<span>{{ item.area }}</span></p>
            </div>
          </template>
          <template slot="footer">
            <span class="txt-btn--green fs14" @click="goEdit(item)">编辑</span>
            <span class="txt-btn--red fs14 ml15 mr8" @click="rowItemDel(item)">删除</span>
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
import { Button, Toast, Dialog } from 'vant'

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
      Dialog.confirm({
        title: '警告',
        message: `是否确认删除品系"${row.varietiesName}"的"${row.geneName}"基因型?`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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