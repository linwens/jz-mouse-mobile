<template>
  <div class="home">
    <!-- 顶部栏 -->
    <top-bar :active-key="0">
      <template>
        <div class="w-100 df s-jcsb s-aic">
          <xs-select class="ml17" />
        </div>
      </template>
    </top-bar>
    <!-- bar -->
    <sum-bar id="1" :show="activeName === 'mine'" :type="barType" />
    <!-- 列表筛选 -->
    <div class="home__filters df s-fww s-jcsb s-aic">
      <van-select
        btn-type="button"
        btn-width-class="w80"
        :cur-val-num.sync="myMouseForm.operator"
        btn-text="负责人"
        :columns="persons"
        key-text="userName"
        val-text="userId"
      />
      <van-select
        btn-type="button"
        btn-width-class="w80"
        :cur-val-num.sync="myMouseForm.varietiesId"
        btn-text="品系"
        :columns="varietiesOpts"
        key-text="varietiesName"
        val-text="id"
      />
      <van-select
        btn-type="button"
        btn-width-class="w80"
        :cur-val-num.sync="myMouseForm.genotypes"
        btn-text="基因型"
        :columns="genesOpts"
        key-text="geneName"
        val-text="id"
      />
      <van-button plain size="small" type="info" @click="filterDialog = true">
        <van-icon name="filter-o" />更多
      </van-button>
    </div>
    <p class="mt12 ml14 fs14 cl-grey-9">总计：<span class="cl-black">{{ page.total }} 条数据</span></p>
    <!-- 列表 -->
    <main-list immediate-check :offset="5" :is-loading="tableLoading" @load="getList" @refresh="getList(1)">
      <template>
        <collapse v-for="item in tableData" :key="item.id" :footer="false">
          <template slot="title">
            <div class="df s-aic xs-collapse__content--multiple">
              <span>{{ item.varietiesName }}</span>
              <span>{{ item.geneName }}</span>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>编号：<span>{{ item.miceNo }}</span></p>
              <p>负责人：<span>{{ item.operator }}</span></p>
            </div>
            <div class="df s-aic">
              <p>纯/杂合子：<span>{{ item.pureHeterozygote }}</span></p>
              <p>性别：<span>{{ item.gender }}</span></p>
            </div>
            <div class="df s-aic">
              <p>周龄：<span>{{ item.birthDate }}</span></p>
              <p>状态：
                <span v-if="item.status === 1" class="isIdle">闲置</span>
                <span v-else-if="item.status === 2" class="isBreed">繁育</span>
                <span v-else-if="item.status === 3" class="isExpt">实验</span>
                <span v-else-if="item.status === 4">手动处死</span>
                <span v-else-if="item.status === 5">实验处死</span>
                <span v-else>无</span>
              </p>
            </div>
            <div class="df s-aic">
              <p>笼位号：<span>{{ item.cageNo }}</span></p>
              <p>家谱记录：<span class="txt-btn--green">查看</span></p>
            </div>
            <div class="df s-aic">
              <p>检测结果：<span class="txt-btn--green">查看</span></p>
            </div>
          </template>
        </collapse>
      </template>
    </main-list>
    <!-- 更多筛选项 -->
    <van-popup
      v-model="filterDialog"
      title="筛选"
      position="bottom"
      :style="{ height: '40%' }"
      closeable
      get-container="body"
    >
      <div class="filter-popup df s-fww s-jcc s-aic">
        <div class="w-100 df s-jcsb filter__col">
          <van-select
            btn-type="button"
            btn-width-class="w150"
            :cur-val-num.sync="myMouseForm.operator"
            btn-text="负责人"
            :columns="persons"
            key-text="userName"
            val-text="userId"
          />
          <van-select
            btn-type="button"
            btn-width-class="w150"
            :cur-val-num.sync="myMouseForm.varietiesId"
            btn-text="品系"
            :columns="varietiesOpts"
            key-text="varietiesName"
            val-text="id"
          />
        </div>
        <div class="w-100 df s-jcsb filter__col">
          <van-select
            btn-type="button"
            btn-width-class="w150"
            :cur-val-num.sync="myMouseForm.genotypes"
            btn-text="基因型"
            :columns="genesOpts"
            key-text="geneName"
            val-text="id"
          />
          <van-select
            btn-type="button"
            btn-width-class="w150"
            :cur-val-num.sync="myMouseForm.pureHeterozygote"
            btn-text="纯/杂合子"
            :columns="[
              {
                label: '纯合子',
                value: 0
              },
              {
                label: '杂合子',
                value: 1
              },
              {
                label: '未测试',
                value: 2
              }
            ]"
          />
        </div>
        <div class="w-100 df s-jcsb filter__col">
          <van-select
            btn-type="button"
            btn-width-class="w150"
            :cur-val-num.sync="myMouseForm.gender"
            btn-text="性别"
            :columns="[
              {
                label: '雌',
                value: 1
              },
              {
                label: '雄',
                value: 0
              }
            ]"
          />
          <van-select
            btn-type="button"
            btn-width-class="w150"
            :cur-val-num.sync="myMouseForm.status"
            btn-text="状态"
            :columns="[
              {
                label: '闲置',
                value: 1
              },
              {
                label: '繁育',
                value: 2
              },
              {
                label: '实验',
                value: 3
              },
              {
                label: '手动处死',
                value: 4
              },
              {
                label: '实验处死',
                value: 5
              }
            ]"
          />

        </div>
        <div class="w-100 df s-jcsb filter__col">
          <van-select
            btn-type="button"
            btn-width-class="w150"
            :cur-val.sync="JSON.stringify(weekRange)"
            btn-text="周龄"
            :columns="[
              {
                label: '4周以下',
                value: JSON.stringify([null, 4])
              },
              {
                label: '4-8周',
                value: JSON.stringify([4, 8])
              },
              {
                label: '8-12周',
                value: JSON.stringify([8, 12])
              },
              {
                label: '12周以上',
                value: JSON.stringify([12, null])
              },
              {
                label: '自定义',
                value: 'custom'
              }
            ]"
            @done="selectWeekRange"
          />
          <span v-if="weekRange === 'custom'" class="fs12">自定义周龄：{{ weekRangeForm.startWeek }}-{{ weekRangeForm.endWeek }}周</span>
        </div>
      </div>
      <div class="bottom-btn df s-jcsa s-aic">
        <van-button class="w150" round color="#F6AC2D" type="info" size="small" @click="reset">重置</van-button>
        <van-button class="w150" round color="#32C985" size="small" type="info" @click="filterDialog = false">搜索</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
// @ is an alias to /src
import MainList from '@/components/List/index.vue'
import Collapse from '@/components/Collapse/index.vue'
import TopBar from '@/components/TopBar/index.vue'
import VanSelect from '@/components/Form/VanSelect.vue'
import FormSelect from '@/components/Form/select.vue'
import SumBar from '@/components/Charts/SumBar'
// import ViewFiles from '@/components/ViewFiles'
import { fetchList, getUsers } from '@/api/home'
import { varietiesList } from '@/api/variety'
import { getLisByVariety } from '@/api/genes'
import { mapGetters } from 'vuex'
import { Icon, Button, Toast, Popup } from 'vant'

export default {
  name: 'Home',
  components: {
    'van-icon': Icon,
    'van-button': Button,
    'van-popup': Popup,
    'xs-select': FormSelect,
    VanSelect,
    TopBar,
    SumBar,
    // ViewFiles,
    Collapse,
    MainList
  },
  data() {
    return {
      // 筛选相关
      filterDialog: false,
      // 关于周龄
      weekRange: [],
      weekRangeDialog: false,
      weekRangeForm: {
        startWeek: 0,
        endWeek: 0
      },
      // 筛选条件
      myMouseForm: { // 我的小鼠
        gender: null,
        pureHeterozygote: null,
        status: null,
        varietiesId: null,
        operator: null,
        genotypes: null,
        startTime: null,
        endTime: null
      },
      exptMouseForm: { // 实验室小鼠
        gender: null,
        pureHeterozygote: null,
        status: null,
        varietiesId: null,
        operator: null,
        genotypes: null,
        startTime: null,
        endTime: null
      },
      activeName: 'mine',
      barType: 'currentVarieties',
      barTypeBtn: '人员',
      tableLoading: false,
      noMore: false,
      page: {
        total: 0, // 总页数
        page: 1, // 当前页数
        limit: 10 // 每页显示多少条
      },
      tableData: [],
      persons: [], // 负责人选择项
      varietiesOpts: [], // 品系选择项
      genesOpts: [] // 基因型选择项
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  watch: {
    'myMouseForm.varietiesId'(n, o) {
      // 基因型列表
      if (!n) {
        this.genesOpts = []
        this.getList(1)
        return
      }
      getLisByVariety({
        id: n
      }).then((res) => {
        this.genesOpts = res.data
      })
      this.getList(1)
    },
    'myMouseForm.genotypes'(n, o) {
      this.getList(1)
    },
    'myMouseForm.gender'(n, o) {
      this.getList(1)
    },
    'myMouseForm.pureHeterozygote'(n, o) {
      this.getList(1)
    },
    'myMouseForm.status'(n, o) {
      this.getList(1)
    },
    'myMouseForm.operator'(n, o) {
      this.getList(1)
    },
    'exptMouseForm.varietiesId'(n, o) {
      // 基因型列表
      if (!n) {
        this.genesOpts = []
        this.getList(1)
        return
      }
      getLisByVariety({
        id: n
      }).then((res) => {
        this.genesOpts = res.data
      })
      this.getList(1)
    },
    'exptMouseForm.genotypes'(n, o) {
      this.getList(1)
    },
    'exptMouseForm.gender'(n, o) {
      this.getList(1)
    },
    'exptMouseForm.pureHeterozygote'(n, o) {
      this.getList(1)
    },
    'exptMouseForm.status'(n, o) {
      this.getList(1)
    },
    'exptMouseForm.operator'(n, o) {
      this.getList(1)
    }
  },
  created() {
    this.getPersons()
    // this.myMouseForm.operator = this.$store.getters.info.id
    // 获取品系
    varietiesList().then(res => {
      this.$set(this, 'varietiesOpts', res.data.records)
    }).finally(() => {
      this.tableLoading = false
    })
  },
  methods: {
    // 重置筛选条件
    reset() {
      const MAP = {
        mine: 'myMouseForm',
        expt: 'exptMouseForm'
      }
      const obj = this[MAP[this.activeName]]
      for (const key of Object.keys(obj)) {
        if (this.activeName === 'mine' && key !== 'operator') {
          obj[key] = null
        }
        if (this.activeName === 'expt' && key !== 'status') {
          obj[key] = null
        }
      }
      // 清空周龄
      this.$set(this, 'weekRange', [])
      this.getList()
    },
    // 选择周龄范围
    selectWeekRange(val) {
      const MAP = {
        mine: 'myMouseForm',
        expt: 'exptMouseForm'
      }
      console.log('========', val)
      if (val === 'custom') {
        this.weekRangeDialog = true
      } else {
        if (!val) {
          this[MAP[this.activeName]].startTime = null
          this[MAP[this.activeName]].endTime = null
          this.getList()
          return
        }
        const parseVal = JSON.parse(val)
        // 注意周龄是到今天算的，所以后面的值算开始时间
        this[MAP[this.activeName]].startTime = parseVal[1] ? parseVal[1] : 0
        this[MAP[this.activeName]].endTime = parseVal[0] ? parseVal[0] : 0
        this.getList()
      }
    },
    // 确定周龄范围
    okRange() {
      const MAP = {
        mine: 'myMouseForm',
        expt: 'exptMouseForm'
      }
      if (!this.weekRangeForm.startWeek && !this.weekRangeForm.endWeek) {
        Toast.fail('至少输入一个值')
      } else if (this.weekRangeForm.startWeek > this.weekRangeForm.endWeek) {
        Toast.fail('起始周龄不得大于结束周龄')
      } else {
        const { startWeek, endWeek } = this.weekRangeForm
        this[MAP[this.activeName]].startTime = endWeek
        this[MAP[this.activeName]].endTime = startWeek
        this.getList()
        this.weekRangeDialog = false
      }
    },
    // 获取负责人列表
    getPersons() {
      getUsers().then((res) => {
        this.$set(this, 'persons', res.data)
      })
    },
    handleClick(tab, event) {
      console.log(tab, this.activeName)
      this.barType = this.activeName === 'mine' ? 'currentVarieties' : 'allVarieties'
      this.getList()
    },
    handleRefreshChange() {
      this.getList()
    },
    // 获取列表
    getList(page) {
      if (page === 1) { // 如果展示第一页，先清列表
        this.tableData = []
      }
      const params = this.activeName === 'mine' ? this.myMouseForm : this.exptMouseForm
      this.tableLoading = true

      fetchList(Object.assign({}, params, {
        current: page || this.page.page,
        size: this.page.limit
      })).then(res => {
        this.tableData = this.tableData.concat(res.data.records)
        if (this.page.page >= res.data.pages) {
          this.noMore = true
        } else {
          this.page.page = res.data.current + 1
        }
        this.page.total = res.data.total
      }).finally(() => {
        this.tableLoading = false
      })
    },
    // 计算周龄
    calcWeek(birthDate) {
      if (!birthDate) {
        return '0周0天'
      }
      const duration = +new Date() - birthDate * 1000
      const weeks = Math.floor(duration / 1000 / 60 / 60 / 24 / 7)
      const days = Math.floor(duration / 1000 / 60 / 60 / 24 % 7)

      return `${weeks}周${days}天`
    },
    // 实验小鼠柱状图，切换负责人
    changeMan() {
      this.barTypeBtn = this.barTypeBtn === '人员' ? '小鼠' : '人员'
      this.barType = this.barType === 'operator' ? 'allVarieties' : 'operator'
    }
  }
}
</script>
<style lang="scss">
  .home__filters {
    padding: 8px 14px;
  }

  .filter-popup {
    margin-top: 40px;
    div.filter__col {
      padding: 8px 14px;
    }
  }
  .test-box{
    width: 200px;
    height: 50px;
    background-color: red;
  }
  .isIdle{
    &::before {
      content: '●';
      color: #F6AC2D
    }
  }
  .isExpt{
    &::before {
      content: '●';
      color: #58A2FB;
    }
  }
  .isBreed{
    &::before {
      content: '●';
      color: #00CB7C;
    }
  }
</style>
