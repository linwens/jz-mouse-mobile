<template>
  <div class="expt-add">
    <van-form>
      <van-field
        v-model="experimentForm.experimentName"
        label="实验组名称"
        placeholder="请输入实验组名称"
        :rules="[{ required: true, message: '请输入实验组名称' }]"
      />
      <time-select btn-text="开始时间" :time.sync="experimentForm.startTime">
        <template slot="placeholder">
          <p>请选择开始时间</p>
        </template>
      </time-select>
      <time-select btn-text="结束时间" :time.sync="experimentForm.endTime">
        <template slot="placeholder">
          <p>请选择结束时间</p>
        </template>
      </time-select>
      <time-select btn-text="处理时间" :time.sync="experimentForm.handleTime">
        <template slot="placeholder">
          <p>请选择处理时间</p>
        </template>
      </time-select>
      <van-select
        :cur-val-num.sync="experimentForm.handleTimeFlag"
        btn-text="处理时间提醒"
        :columns="[
          {
            label: '是',
            value: 0
          },
          {
            label: '否',
            value: 1
          }
        ]"
      >
        <template slot="placeholder">
          <p>是否开启处理时间提醒</p>
        </template>
      </van-select>
      <time-select btn-text="检测时间" :time.sync="experimentForm.testTime">
        <template slot="placeholder">
          <p>请选择检测时间</p>
        </template>
      </time-select>
      <van-select
        :cur-val-num.sync="experimentForm.testTimeFlag"
        btn-text="检测时间提醒"
        :columns="[
          {
            label: '是',
            value: 0
          },
          {
            label: '否',
            value: 1
          }
        ]"
      >
        <template slot="placeholder">
          <p>是否开启检测时间提醒</p>
        </template>
      </van-select>
      <van-select
        :cur-val-num.sync="experimentForm.endMiceState"
        btn-text="实验结束后小鼠状态"
        :columns="[
          {
            label: '处死',
            value: 5
          },
          {
            label: '闲置',
            value: 1
          }
        ]"
      >
        <template slot="placeholder">
          <p></p>
        </template>
      </van-select>
      <!-- 检测信息标签 -->
      <div>
        <van-cell title="检测信息" :border="false">
          <template #right-icon>
            <span class="txt-btn--green" @click="tagDialog = true">添加</span>
          </template>
        </van-cell>
        <div class="expt-add__tags">
          <van-tag
            v-for="(item, index) in tags"
            :key="index"
            plain
            color="#58A2FB"
            closeable
            size="medium"
            type="primary"
            @close="handleClose(item)"
          >
            {{ item.label }}
          </van-tag>
        </div>
      </div>
    </van-form>
    <div class="add-btn df s-jcfe s-aic pt13 pb11">
      <van-button class="w90" hairline round size="small" color="#32C985" type="info" @click="addNewGroup()">新增分组</van-button>
    </div>
    <!-- 列表 -->
    <main-list :offset="10" :is-finished="noMore" :is-loading="tableLoading" @refresh="getList(1)">
      <template>
        <collapse v-for="(item, index) in tableData" :key="item.id">
          <template slot="title">
            <div class="df s-aic s-jcsb">
              <span>实验组ADEsG</span>
              <span>处理药物成分</span>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>检测：<span>检测信息-01</span>;<span>检测信息-01</span>;<span>检测信息-01</span>;<span>检测信息-01</span></p>
            </div>
            <div class="df s-aic">
              <p>小鼠数量：<span>20</span></p>
            </div>
            <div class="df s-aic">
              <p>小鼠：
                <span class="txt-btn--green" @click="showMouses(item)">查看小鼠</span>
                <span class="txt-btn--green ml18" @click="goAddMouse({item, index})">添加小鼠</span>
              </p>
            </div>
          </template>
          <template slot="footer">
            <van-button class="w75 mr10" plain hairline round size="small" color="#333" type="info" @click="goEdit(item)">编辑</van-button>
            <van-button class="w75" plain hairline round size="small" color="#EB5444" type="info" @click="rowItemDel(item)">删除</van-button>
          </template>
        </collapse>
      </template>
    </main-list>
    <bottom-btn @confirm="doAddExpt" />
    <!-- 添加标签弹窗 -->
    <van-dialog
      v-model="tagDialog"
      title="增加检测信息"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="#FF6358"
      @confirm="addTag"
    >
      <van-form class="mt20 mb20">
        <van-field
          v-model="tagsForm.name"
          label="检测信息"
          placeholder="请输入检测信息"
          :rules="[{ required: true, message: '检测信息不能为空' }]"
        />
      </van-form>
    </van-dialog>
    <!-- 新建分组弹窗 -->
    <van-dialog
      v-model="addGroupDialog"
      title="分组信息"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="#FF6358"
      @confirm="addGroup"
    >
      <van-form ref="addGroupForm" class="mt20 mb20">
        <van-field
          v-model="addGroupForm.experimentGroupName"
          label="分组名称"
          placeholder="请输入分组名称"
          :rules="[{ required: true, message: '分组名称不能为空' }]"
        />
        <van-field
          v-model="addGroupForm.eventName"
          label="处理"
          placeholder="请输入处理信息"
        />
        <van-select
          :cur-val.sync="addGroupForm.testName"
          btn-text="检测信息"
          :columns="tags"
          key-text="label"
          val-text="id"
        />
      </van-form>
    </van-dialog>
    <!-- 小鼠列表弹窗 -->
    <van-popup
      v-model="mousesDialog"
      position="bottom"
      :style="{ height: '80%' }"
      closeable
      get-container="body"
    >
      <main-list>
        <template>
          <collapse v-for="item in mouseList" :key="item.id">
            <template slot="title">
              <div class="df s-aic s-jcsb">
                <span>实验记录</span>
              </div>
            </template>
            <template slot="content">
              <div class="df s-aic">
                <p>饲养条件：<span>饲养条件巴拉啦</span></p>
                <p>负责人：<span>小勾</span></p>
              </div>
              <div class="df s-aic">
                <p>应用领域：<span>范德萨范德萨发飞洒发发顺丰撒是否是否范德萨范德萨发飞洒发发顺丰撒是否是否范德萨范德萨发飞洒发发顺丰撒是否是否</span></p>
              </div>
            </template>
            <template slot="footer">
              <van-button class="mr10" plain hairline round size="small" color="#EB5444" type="info" @click="delMouse(item)">移除</van-button>
            </template>
          </collapse>
        </template>
      </main-list>
    </van-popup>
  </div>
</template>

<script>
import MainList from '@/components/List/index.vue'
import Collapse from '@/components/Collapse/index.vue'
import BottomBtn from '@/components/BottomBtn/index.vue'
import VanSelect from '@/components/Form/VanSelect.vue'
import TimeSelect from '@/components/Form/TimeSelect.vue'
import { addNewExpt, getGroupSampleList } from '@/api/experiment'
import { getMouseInfoByIds } from '@/api/mouse'
import { calcWeek } from '@/components/Mixins/calcWeek'
import { Button, Form, Field, Tag, Cell, Dialog, Popup, Toast } from 'vant'

export default {
  name: 'AddExperiment',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-field': Field,
    'van-tag': Tag,
    'van-cell': Cell,
    'van-popup': Popup,
    [Dialog.Component.name]: Dialog.Component,
    MainList,
    Collapse,
    BottomBtn,
    VanSelect,
    TimeSelect
  },
  mixins: [calcWeek],
  data() {
    return {
      experimentForm: {
        experimentName: '',
        startTime: null,
        endTime: null,
        handleTime: null,
        handleTimeFlag: 0,
        testTime: null,
        testTimeFlag: 0,
        endMiceState: 5
      },
      tags: [],
      tagsForm: {
        name: ''
      },
      tagDialog: false,
      // 新建分组
      addGroupDialog: false,
      addGroupForm: {
        experimentGroupName: '',
        eventName: '',
        testName: []
      },
      tableData: [],
      tableLoading: false,
      noMore: false,
      page: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 10 // 每页显示多少条
      },
      // 查看小鼠列表
      curGroupIndex: null, // 当前实验分组index
      mousesDialog: false,
      mouseList: [],
      page2: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 10 // 每页显示多少条
      }
    }
  },
  watch: {
    addGroupDialog(n, o) {
      if (!n) {
        this.$refs['addGroupForm'].resetValidation()
      }
    }
  },
  created() {
    const cacheExpts = this.$store.getters.addingExpt
    if (cacheExpts && cacheExpts.form.experimentId == this.$route.params.id) {
      const addingExpt = this.$store.getters.addingExpt
      this.$set(this, 'experimentForm', addingExpt.form)
      // this.$set(this, 'tags', addingExpt.tags)
      this.$set(this, 'tableData', addingExpt.table)
    }
  },
  methods: {
    setStorageInfo(index) { // 更新缓存数据
      this.$store.dispatch('app/cacheExpts', {
        form: this.experimentForm,
        tags: this.tags,
        table: this.tableData,
        $index: index >= 0 ? index : null
      })
    },
    goAddMouse(scope) {
      console.log(scope)
      this.setStorageInfo(scope.index)
      this.goPage('experimentAddMouse', { type: 'noExpt', index: scope.index })
    },
    goPage(r, obj) {
      this.$router.push({ name: r, params: obj })
    },
    goBack() {
      this.$router.back()
    },
    handleRefreshChange() {
      this.getList()
    },
    // 删除实验分组
    rowItemDel: function(scope) {
      console.log(scope)
      const _this = this
      Dialog.confirm({
        title: '警告',
        message: `是否确认删除实验分组："${scope.row.experimentGroupName}"?`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.tableData.splice(scope.$index, 1)
        Toast.success('删除成功,还需提交保存')
      }).catch(function() {
      })
    },
    // 删除小鼠
    delMouse: function(scope) {
      console.log(scope)
      const _this = this
      Dialog.confirm({
        title: '警告',
        message: `是否确认删除小鼠"${scope.row.miceId}"的数据?`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.mouseList.splice(scope.$index, 1)
        // 删除对应分组的小鼠id
        const curGroupMices = _this.tableData[_this.curGroupIndex].experimentGroupSelectionMiceIds
        const curMiceId = scope.row.miceId
        const index = curGroupMices.indexOf(curMiceId)
        curGroupMices.splice(index, 1)

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
      getGroupSampleList(Object.assign({
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
    // 编辑分组信息
    goEdit(scope) {
      const data = JSON.parse(JSON.stringify(scope.row))
      const exptLabels = scope.row.testName
      console.log(exptLabels)
      data.testName = exptLabels ? exptLabels.split(';') : []
      console.log('goEdit====', data)
      this.addGroupDialog = true
      this.addGroupForm = data
      this.addGroupForm.index = scope.$index
    },
    // 添加标签
    addTag() {
      if (this.tags.findIndex((el) => {
        return el.label === this.tagsForm.name
      }) === -1) {
        const newTags = this.tags
        newTags.push({
          id: this.tagsForm.name,
          label: this.tagsForm.name
        })
        this.$set(this, 'tags', newTags)
        this.setStorageInfo()
      }
      this.tagDialog = false
      this.tagsForm.name = ''
    },
    // 删除标签
    handleClose(tag) {
      this.tags.splice(this.tags.findIndex((el) => {
        return el.label === tag
      }), 1)
      this.setStorageInfo()
    },
    // 点击新建分组
    addNewGroup() {
      this.addGroupDialog = true
      for (const key in this.addGroupForm) {
        this.addGroupForm[key] = null
      }
    },
    // 新建分组
    addGroup() {
      this.addGroupDialog = false
      // 有编号就是编辑
      if (typeof this.addGroupForm.index === 'number') {
        Toast.success('编辑实验分组成功')
        this.editListItem(this.addGroupForm)
      } else {
        Toast.success('新增实验分组成功')
        this.addListItem(this.addGroupForm)
      }
    },
    // 新增列表项
    addListItem(data) {
      const item = JSON.parse(JSON.stringify(data))
      item.testName = data.testName ? data.testName.join(';') : ''
      // 小鼠数量新建时候为0
      item.experimentGroupSelectionMiceIds = []

      const newData = this.tableData
      newData.push(item)
      this.$set(this, 'tableData', newData)
      this.setStorageInfo()
    },
    // 编辑列表项
    editListItem(data) {
      console.log('编辑确定')
      const { index, ...other } = data
      other.testName = other.testName ? other.testName.join(';') : ''

      this.$set(this.tableData, index, other)
      this.setStorageInfo()
    },
    // 查看小鼠列表
    showMouses(scope) {
      this.curGroupIndex = scope.$index
      console.log(scope.row)
      this.getMouseList(scope.row.experimentGroupSelectionMiceIds)
      this.mousesDialog = true
    },
    // 获取小鼠列表
    getMouseList(ids) {
      getMouseInfoByIds(ids).then(res => {
        this.$set(this, 'mouseList', res.data)
      })
    },
    // 新增实验组
    doAddExpt() {
      const { startTime, endTime, handleTime, testTime, ...other } = this.experimentForm
      const { id: userId } = this.$store.getters.info
      // 实验分组数据格式整理
      const cacheTableData = JSON.parse(JSON.stringify(this.tableData))
      const groupInfo = cacheTableData.map(el => {
        el.testName = el.testName ? el.testName.split(';') : []
        el.experimentGroupSelectionMiceIds = el.experimentGroupSelectionMiceIds.join(',')
        return el
      })
      console.log(groupInfo)
      const lables = this.tags.map((el) => {
        return el.label
      })
      addNewExpt(Object.assign({}, {
        createUser: userId,
        startTime: startTime / 1000,
        endTime: endTime / 1000,
        handleTime: handleTime / 1000,
        testTime: testTime / 1000,
        experimentLabels: lables.join(','),
        experimentGroupInfo: groupInfo
      }, other)).then((res) => {
        Toast.success('新增实验组成功')
        this.$store.dispatch('app/clearExpts')
        this.$store.dispatch('app/clearMouses')
        this.goBack()
      })
    }
  },
  // 路由守卫，复用的页面，判断来源
  beforeRouteEnter(to, from, next) {
    console.log('enter====>', to, from)
    next(vm => {
      // 是添加小鼠返回的,组装列表项数据
      if (from.name === 'experimentAddMouse') {
        const addingExpt = vm.$store.getters.addingExpt
        vm.$set(vm, 'experimentForm', addingExpt ? addingExpt.form : {})
        vm.$set(vm, 'tags', addingExpt ? addingExpt.tags : [])
        vm.$set(vm, 'tableData', addingExpt ? addingExpt.table : [])
      }
    })
  }
}
</script>

<style>

</style>