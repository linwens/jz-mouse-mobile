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
    <main-list>
      <template>
        <collapse>
          <template slot="title">
            <div class="df s-aic xs-collapse__content--multiple">
              <span>ER-334</span>
              <span>34-IO98</span>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>编号：<span>023</span></p>
              <p>出生日期：<span>2020-02-01</span></p>
            </div>
            <div class="df s-aic">
              <p>性别：<span>雄</span></p>
              <p>体重：<span>10g</span></p>
            </div>
            <div class="df s-aic">
              <p>毛色：<span>灰色</span></p>
              <p>健康状况：<span>健康无异常</span></p>
            </div>
            <div class="df s-aic">
              <p>类型：<span>手动删除</span></p>
            </div>
          </template>
          <template slot="footer">
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
import { Button } from 'vant'

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
      page: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 10 // 每页显示多少条
      },
      tableData: []
    }
  },
  created() {
    this.isAdmin = this.$store.getters.info.admin
    this.getList()
  },
  methods: {
    handleRefreshChange() {
      this.getList()
    },
    // 删除
    rowItemDel: function(row) {
      const _this = this
      this.$confirm('是否确认删除小鼠："' + row.miceId + '"的数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDelMouse({
          miceId: row.miceId
        })
      }).then(() => {
        this.getList()
        _this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
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
