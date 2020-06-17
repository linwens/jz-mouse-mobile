<template>
  <div class="expt-edit">
    <van-form :show-error-message="false">
      <van-field
        v-model="experimentForm.experimentName"
        label="实验组名称"
        placeholder="请输入实验组名称"
        :disabled="!canEdit"
        :rules="[{ required: true, message: '请输入实验组名称' }]"
      />
      <time-select :disabled="!canEdit" btn-text="开始时间" :time.sync="experimentForm.startTime">
        <template slot="placeholder">
          <p>请选择开始时间</p>
        </template>
      </time-select>
      <time-select :disabled="!canEdit" btn-text="结束时间" :time.sync="experimentForm.endTime">
        <template slot="placeholder">
          <p>请选择结束时间</p>
        </template>
      </time-select>
      <van-select
        :disabled="!canEdit"
        btn-text="处理时间提醒"
        :cur-val-num.sync="experimentForm.handleTimeFlag"
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
      <van-select
        :disabled="!canEdit"
        btn-text="检测时间提醒"
        :cur-val-num.sync="experimentForm.testTimeFlag"
        :columns="[
          {
            label: '是',
            value: 0
          },
          {
            label: '否',
            value: 1
          }
        ]">
        <template slot="placeholder">
          <p>是否开启检测时间提醒</p>
        </template>
      </van-select>
      <van-select
        :disabled="!canEdit"
        btn-text="实验结束后小鼠状态"
        :cur-val-num.sync="experimentForm.endMiceState"
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
      />
      <!-- 检测信息标签 -->
      <div>
        <van-cell v-if="canEdit" title="检测信息" :border="false">
          <template #right-icon>
            <span class="txt-btn--green" @click="tagDialog = true">添加</span>
          </template>
        </van-cell>
        <div class="expt-edit__tags">
          <van-tag
            v-for="(item, index) in tags"
            :key="index"
            plain
            color="#58A2FB"
            :closeable="canEdit"
            size="medium"
            type="primary"
            @close="handleClose(item)"
          >
            {{ item.label }}
          </van-tag>
        </div>
      </div>
    </van-form>
    <div class="edit-btn df s-jcfe s-aic pt13 pb11">
      <van-button v-if="canEdit" class="w90" hairline round size="small" color="#32C985" type="info" @click="addNewGroup">新增分组</van-button>
    </div>
    <!-- 添加标签弹窗 -->
    <van-dialog
      v-model="tagDialog"
      title="增加检测信息"
      get-container="body"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="#FF6358"
      @confirm="addTag"
    >
      <van-form :show-error-message="false" class="mt20 mb20">
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
      get-container="body"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="#FF6358"
      @confirm="addGroup"
    >
      <van-form :show-error-message="false" class="mt20 mb20">
        <van-field
          v-model="addGroupForm.experimentGroupName"
          label="检测信息"
          placeholder="请输入检测信息"
          :rules="[{ required: true, message: '分组名称不能为空' }]"
        />
        <van-field
          v-model="addGroupForm.eventName"
          label="处理"
          placeholder="请输入处理信息"
        />
        <van-select
          data-type="arr"
          :cur-val-arr.sync="addGroupForm.testName"
          btn-text="检测信息"
          :columns="tags"
          key-text="label"
          val-text="label"
        />
      </van-form>
    </van-dialog>
    <!-- 列表 -->
    <div>
      <collapse v-for="(item, index) in tableData" :key="item.id">
        <template slot="title">
          <div class="df s-aic s-jcsb">
            <span>{{ item.experimentGroupName }}</span>
          </div>
        </template>
        <template slot="content">
          <div class="df s-aic">
            <p>检测：<span>{{ item.testName }}</span></p>
          </div>
          <div class="df s-aic">
            <p>小鼠数量：<span>{{ item.experimentGroupSelectionMiceIds.length }}</span></p>
          </div>
          <div class="df s-aic">
            <p>小鼠：<span class="txt-btn--green" @click="showMouses({item, index})">查看小鼠</span><span class="txt-btn--green ml18" @click="goAddMouse({item, index})">添加小鼠</span></p>
          </div>
        </template>
        <template v-if="canEdit" slot="footer">
          <van-button class="w75 mr10" plain hairline round size="small" color="#333" type="info" @click="goEdit({item, index})">编辑</van-button>
          <van-button class="w75" plain hairline round size="small" color="#EB5444" type="info" @click="rowItemDel({item, index})">删除</van-button>
        </template>
      </collapse>
    </div>
    <bottom-btn>
      <template slot="confirm">
        <van-button class="w150" round size="small" color="#32C985" type="info" @click="saveExptInfo()">{{ canEdit ? '确认' : '编辑' }}</van-button>
      </template>
    </bottom-btn>
    <!-- 小鼠列表弹窗 -->
    <van-popup
      v-model="mousesDialog"
      position="bottom"
      :style="{ height: '80%' }"
      closeable
      get-container="body"
    >
      <div class="mt30">
        <collapse v-for="(item, index) in mouseList" :key="item.id">
          <template slot="title">
            <div class="df s-aic s-jcsb">
              <span>查看小鼠</span>
            </div>
          </template>
          <template slot="content">
            <div class="de s-aic">
              <p>编号：<span>{{ item.miceNo }}</span></p>
            </div>
            <div class="de s-aic">
              <p>基因型：<span>{{ item.geneName }}</span></p>
            </div>
            <div class="df s-aic">
              <p>笼位号：<span>{{ item.cageNo }}</span></p>
              <p>标记：<span>{{ item.sign }}</span></p>
            </div>
            <div class="df s-aic">
              <p>性别：<span>{{ item.gender === 0 ? '雄' : '雌' }}</span></p>
              <p>周龄：<span>{{ calcWeek(item.birthDate) }}</span></p>
            </div>
            <div class="df s-aic">
              <p>体重：<span>{{ item.weight ? `${item.weight}g` : '' }}</span></p>
              <p>品系：<span>{{ item.varietiesName }}</span></p>
            </div>
            <div class="df s-aic">
              <p>健康状况：<span>{{ item.status }}</span></p>
              <p>毛色：<span>{{ item.color }}</span></p>
            </div>
          </template>
          <template slot="footer">
            <van-button class="mr10" plain hairline round size="small" color="#EB5444" type="info" @click="delMouse({item, index})">删除</van-button>
          </template>
        </collapse>

      </div>
    </van-popup>
  </div>
</template>

<script>
import Collapse from '@/components/Collapse/index.vue'
import BottomBtn from '@/components/BottomBtn/index.vue'
import VanSelect from '@/components/Form/VanSelect.vue'
import TimeSelect from '@/components/Form/TimeSelect.vue'
import { getExptInfoById, updateExptInfo } from '@/api/experiment'
import { getMouseInfoByIds } from '@/api/mouse'
import { calcWeek } from '@/components/Mixins/calcWeek'
import { Button, Form, Field, Tag, Cell, Toast, Dialog, Popup } from 'vant'

export default {
  name: 'ExperimentEdit',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-field': Field,
    'van-tag': Tag,
    'van-cell': Cell,
    'van-popup': Popup,
    [Dialog.Component.name]: Dialog.Component,
    VanSelect,
    TimeSelect,
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
    console.log(cacheExpts)
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
      this.setStorageInfo(scope.index)
      this.goPage('ExptAddMouse', { type: 'noExpt', index: scope.index })
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
        message: `是否确认删除实验分组："${scope.item.experimentGroupName}"?`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.tableData.splice(scope.index, 1)
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
        message: `是否确认删除小鼠"${scope.item.miceNo}"的数据?`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.mouseList.splice(scope.index, 1)
        // 删除对应分组的小鼠id
        const curGroupMices = _this.tableData[_this.curGroupIndex].experimentGroupSelectionMiceIds
        const curMiceId = scope.item.miceId
        const index = curGroupMices.indexOf(curMiceId)
        curGroupMices.splice(index, 1)

        Toast.success('删除成功')
      }).catch(function() {
      })
    },
    // 编辑分组信息
    goEdit(scope) {
      const data = JSON.parse(JSON.stringify(scope.item))
      const exptLabels = scope.item.testName
      data.testName = exptLabels ? exptLabels.split(';') : []

      this.addGroupDialog = true
      for (const key of Object.keys(data)) {
        this.addGroupForm[key] = data[key]
      }
      this.addGroupForm.index = scope.index
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
      console.log(this.addGroupForm)
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
      // item.testName = data.testName ? data.testName.join(';') : ''
      item.testName = data.testName ? data.testName : ''
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
      this.curGroupIndex = scope.index
      const idArr = scope.item.experimentGroupSelectionMiceIds
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
      if (from.name === 'ExptAddMouse') {
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
    margin-bottom: 80px;

    &__tags {
      padding: 0 14px;
      .van-tag {
        margin-right: 5px;
      }
    }

    .edit-btn {
      width: 90%;
      margin: 0 auto;
    }
  }
</style>
