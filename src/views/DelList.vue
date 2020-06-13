<template>
  <div class="del-list">
    <!-- 顶部栏 -->
    <top-bar :active-key="5">
      <template>
        <div class="w-100 df s-jcfe s-aic">
          <p class="del-list__sum fs15">总计：<span>{{ page.total }}条数据</span></p>
        </div>
      </template>
    </top-bar>
    <!-- 列表 -->
    <main-list :offset="10" :is-finished="noMore" :is-loading="tableLoading" @load="getList" @refresh="getList(1)">
      <template>
        <collapse v-for="item in tableData" :key="item.miceNo">
          <template slot="title">
            <div class="df s-aic xs-collapse__content--multiple">
              <span class="fs10">{{ item.varietiesName }}</span>
              <span class="fs10">{{ item.geneName }}</span>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>编号：<span>{{ item.miceNo }}</span></p>
            </div>
            <div class="df s-aic">
              <p>出生日期：<span>{{ item.birthDate * 1000 | timeFormat('yyyy-MM-dd') }}</span></p>
              <p>类型：<span>{{ item.miceStatusDesc }}</span></p>
            </div>
            <div class="df s-aic">
              <p>性别：<span>{{ item.gender === 0 ? '雄' : '雌' }}</span></p>
              <p>体重：<span>{{ item.weight }}</span></p>
            </div>
            <div class="df s-aic">
              <p>毛色：<span>{{ item.color }}</span></p>
              <p>健康状况：<span>{{ item.healthyStatus }}</span></p>
            </div>
          </template>
          <template slot="footer">
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
import { delDelMouse, fetchList } from '@/api/delList'
import { Button, Toast, Dialog } from 'vant'

export default {
  name: 'DelList',
  components: {
    'van-button': Button,
    MainList,
    Collapse,
    TopBar
  },
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
    handleRefreshChange() {
      this.getList()
    },
    // 删除
    rowItemDel: function(row) {
      Dialog.confirm({
        title: '警告',
        message: `是否确认删除小鼠：${row.miceId}的数据?`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDelMouse({
          miceId: row.miceId
        })
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
    }
  }
}
</script>

<style lang="scss">
  .del-list {
    &__sum{
      color: #999999;
      text-align: right;
      > span {
        color: #333;
      }
    }
  }
</style>
