<template>
  <div class="variety-list w-100">
    <!-- 列表 -->
    <main-list :offset="10" :is-finished="noMore" :is-loading="tableLoading" @load="getList" @refresh="getList(1)">
      <template>
        <collapse v-for="item in tableData" :key="item.id">
          <template slot="title">
            <div class="df s-aic xs-collapse__content--multiple">
              <span>{{ item.varietiesName }}</span>
              <span>{{ item.operatorName }}</span>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>创建时间：<span>{{ item.createTime * 1000 | timeFormat('yyyy-MM-dd hh:mm:ss') }}</span></p>
            </div>
          </template>
          <template slot="footer">
            <span class="txt-btn--green fs14" @click="goEdit(item)">详情</span>
            <span class="txt-btn--red fs14 ml15 mr8" @click="rowItemDel(item)">删除</span>
          </template>
        </collapse>
      </template>
    </main-list>
    <bottom-btn>
      <template slot="confirm">
        <add-variety class="w150" @done="getList(1)" />
      </template>
    </bottom-btn>
    <!-- 编辑品系弹窗 -->
    <van-dialog
      v-model="varietyDialog"
      title="编辑品系"
      get-container="body"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="#FF6358"
      @confirm="doEdit"
    >
      <van-form :show-error-message="false" class="mt20 mb20">
        <van-field
          v-model="editVarietyForm.varietiesName"
          required
          label="品系名称"
          placeholder="请输入品系名称"
          :rules="[{ required: true, message: '品系名称不能为空' }]"
        />
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import MainList from '@/components/List/index.vue'
import Collapse from '@/components/Collapse/index.vue'
import BottomBtn from '@/components/BottomBtn/index.vue'
import AddVariety from '@/components/Dialogs/AddVariety.vue'
import { varietiesList, putItemObj, delItemObj } from '@/api/variety'
import { Toast, Dialog, Form, Field } from 'vant'

export default {
  name: 'VarietyList',
  components: {
    'van-form': Form,
    'van-field': Field,
    [Dialog.Component.name]: Dialog.Component,
    AddVariety,
    MainList,
    Collapse,
    BottomBtn
  },
  data() {
    return {
      tableLoading: false,
      noMore: false,
      page: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 10 // 每页显示多少条
      },
      tableData: [],
      // 编辑品系
      editVarietyForm: {},
      varietyDialog: false
    }
  },
  created() {

  },
  methods: {
    goEdit(row) {
      this.varietyDialog = true
      const cacheRow = JSON.parse(JSON.stringify(row))
      this.$set(this, 'editVarietyForm', cacheRow)
      console.log(this.editVarietyForm)
    },
    goPage(obj) {
      this.$router.push({ name: 'varietyEdit', params: obj })
    },
    handleRefreshChange() {
      this.getList()
    },
    // 删除
    rowItemDel: function(row) {
      console.log(row)
      Dialog.confirm({
        title: '警告',
        message: `是否确认删除品系：${row.varietiesName}的数据?`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delItemObj(row.id)
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
      varietiesList(Object.assign({
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
    // 编辑品系
    doEdit() {
      this.varietyDialog = false
      const { id, operator, state, varietiesName } = this.editVarietyForm
      if (!varietiesName) {
        Toast.fail('品系名称不能为空')
        return false
      }
      putItemObj({
        id,
        operator,
        state,
        varietiesName,
        userId: this.$store.getters.info.id
      }).then((res) => {
        console.log(res)
        // 存储输入过的值
        this.$store.dispatch('user/setInputHistory', {
          varietiesName
        })
        this.getList(1)
      })
    }
  }
}
</script>

<style lang="scss">
  .variety-list {
    padding-top: 16px;
    margin-bottom: 50px;
  }
</style>
