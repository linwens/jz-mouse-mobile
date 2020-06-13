<template>
  <div class="expt-edit">
    <van-form>
      <van-field
        v-model="exptForm.name"
        label="实验组名称"
        placeholder="请输入实验组名称"
        :rules="[{ required: true, message: '请输入实验组名称' }]"
      />
      <time-select btn-text="开始时间" :time.sync="exptForm.exptTime">
        <template slot="placeholder">
          <p>请选择开始时间</p>
        </template>
      </time-select>
      <time-select btn-text="结束时间" :time.sync="exptForm.exptTime">
        <template slot="placeholder">
          <p>请选择结束时间</p>
        </template>
      </time-select>
      <time-select btn-text="处理时间" :time.sync="exptForm.exptTime">
        <template slot="placeholder">
          <p>请选择处理时间</p>
        </template>
      </time-select>
      <van-select btn-text="处理时间提醒">
        <template slot="placeholder">
          <p>是否开启处理时间提醒</p>
        </template>
      </van-select>
      <time-select btn-text="检测时间" :time.sync="exptForm.exptTime">
        <template slot="placeholder">
          <p>请选择检测时间</p>
        </template>
      </time-select>
      <van-select btn-text="检测时间提醒">
        <template slot="placeholder">
          <p>是否开启检测时间提醒</p>
        </template>
      </van-select>
      <van-select btn-text="实验结束后小鼠状态">
        <template slot="placeholder">
          <p></p>
        </template>
      </van-select>
      <!-- 检测信息标签 -->
      <div>
        <van-cell title="检测信息" :border="false">
          <template #right-icon>
            <span class="txt-btn--green">添加</span>
          </template>
        </van-cell>
        <div class="expt-edit__tags">
          <van-tag
            plain
            color="#58A2FB"
            closeable
            size="medium"
            type="primary"
          >
            标签dad签da签daa
          </van-tag>
        </div>
      </div>
    </van-form>
    <div class="add-btn df s-jcfe s-aic pt13 pb11">
      <van-button class="w90" hairline round size="small" color="#32C985" type="info">新增分组</van-button>
    </div>
    <!-- 列表 -->
    <main-list>
      <template>
        <collapse v-for="item in tableData" :key="item.id">
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
              <p>小鼠：<span class="txt-btn--green">查看小鼠</span><span class="txt-btn--green ml18">添加小鼠</span></p>
            </div>
          </template>
          <template slot="footer">
            <van-button class="w75 mr10" plain hairline round size="small" color="#333" type="info">编辑</van-button>
            <van-button class="w75" plain hairline round size="small" color="#EB5444" type="info">删除</van-button>
          </template>
        </collapse>
      </template>
    </main-list>
    <bottom-btn @confirm="saveExptInfo" />
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
              <van-button class="mr10" plain hairline round size="small" color="#EB5444" type="info" @click="delMouse(item)">删除</van-button>
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
import { getExptInfoById, updateExptInfo } from '@/api/experiment'
import { getMouseInfoByIds } from '@/api/mouse'
import { calcWeek } from '@/components/Mixins/calcWeek'
import { Button, Form, Field, Tag, Cell, Toast, Dialog } from 'vant'

export default {
  name: 'ExperimentEdit',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-field': Field,
    'van-tag': Tag,
    'van-cell': Cell,
    VanSelect,
    TimeSelect,
    MainList,
    Collapse,
    BottomBtn
  },
  mixins: [calcWeek],
  data() {
    return {
      canEdit: false, // 是否可编辑
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
      // 新增标签
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
      tableLoading: false,
      tableData: [],
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
  created() {
    console.log(this.$route)
    const cacheExpts = this.$store.getters.addingExpt
    if (Object.keys(cacheExpts).length > 0 && cacheExpts.form.experimentId == this.$route.params.id) {
      const addingExpt = this.$store.getters.addingExpt
      this.$set(this, 'experimentForm', addingExpt.form)
      this.$set(this, 'tableData', addingExpt.table)
    } else {
      this.getExptInfoById(this.$route.params.id)
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
      this.setStorageInfo(scope.$index)
      this.goPage('experimentAddMouse', { type: 'noExpt', index: scope.$index })
    },
    goPage(r, obj) {
      this.$router.push({ name: r, params: obj })
    },
    goBack() {
      this.$store.dispatch('app/clearExpts')
      this.$router.back()
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
        message: `是否确认删除小鼠"${scope.row.miceNo}"的数据?`,
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
        this.editListItem(this.addGroupForm)
      } else {
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
      console.log('编辑确定', data)
      const { index, ...other } = data
      other.testName = other.testName ? other.testName.join(';') : ''

      this.$set(this.tableData, index, other)
      this.setStorageInfo()
    },
    // 查看小鼠列表
    showMouses(scope) {
      this.curGroupIndex = scope.$index
      const idArr = scope.row.experimentGroupSelectionMiceIds
      if (idArr.length === 0) {
        Toast.fail('没有小鼠')
      } else {
        this.getMouseList(idArr)
        this.mousesDialog = true
      }
    },
    // 获取小鼠列表
    getMouseList(ids) {
      getMouseInfoByIds(ids).then(res => {
        this.$set(this, 'mouseList', res.data)
      })
    },
    // 获取实验组信息
    getExptInfoById(id) {
      getExptInfoById({
        experimentId: id
      }).then((res) => {
        const { experimentId, experimentName, experimentLabels, experimentGroupInfo, startTime, endTime, handleTimeFlag, testTimeFlag, endMiceState } = res.data
        // 格式化小鼠ids
        const groupInfo = experimentGroupInfo.map(el => {
          const ids = el.experimentGroupSelectionMiceIds
          el.experimentGroupSelectionMiceIds = ids ? ids.split(',') : []
          return el
        })

        // 实验组标签信息
        this.$set(this, 'tags', experimentLabels)
        // 分组列表信息
        this.$set(this, 'tableData', groupInfo)
        // 实验组基础信息
        this.$set(this, 'experimentForm', {
          experimentId,
          experimentName,
          endMiceState,
          handleTimeFlag,
          testTimeFlag,
          startTime: startTime * 1000,
          endTime: endTime * 1000
        })
      })
    },
    // 编辑保存
    saveExptInfo() {
      if (!this.canEdit) {
        this.canEdit = true
        return false
      }
      const { startTime, endTime, handleTime, testTime, ...other } = this.experimentForm
      const { id: userId } = this.$store.getters.info
      // 实验分组数据格式整理
      const cacheTableData = JSON.parse(JSON.stringify(this.tableData))
      console.log('this.tableData==', this.tableData, cacheTableData)
      const groupInfo = cacheTableData.map(el => {
        el.testName = el.testName ? el.testName.split(';') : []
        el.experimentGroupSelectionMiceIds = el.experimentGroupSelectionMiceIds.join(',')
        return el
      })
      console.log('this.tags==', this.tags)
      const lables = this.tags.map((el) => {
        return el.label
      })
      updateExptInfo(Object.assign({}, {
        experimentId: this.$route.params.id,
        createUser: userId,
        startTime: startTime / 1000,
        endTime: endTime / 1000,
        handleTime: handleTime / 1000,
        testTime: testTime / 1000,
        experimentLabels: lables.join(','),
        experimentGroupInfo: groupInfo
      }, other)).then((res) => {
        Toast.success('编辑实验组成功')
        this.$store.dispatch('app/clearExpts')
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
        vm.canEdit = true
      }
    })
  }
}
</script>

<style lang="scss">
  .expt-edit {
    margin-bottom: 50px;

    &__tags {
      padding: 0 13px;
      .van-tag {
        margin-right: 5px;
      }
    }

    .add-btn {
      width: 90%;
      margin: 0 auto;
    }
  }
</style>
