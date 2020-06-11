<template>
  <div>
    <van-select
      btn-type="button"
      :cur-val.sync="treeType"
      btn-text="请选择类型"
      :columns="[
        {
          label: '父母记录',
          value: 0
        },
        {
          label: '子鼠记录',
          value: 1
        }
      ]"
    />
    <van-button round size="mini" color="#00CB7C" type="primary" @click="goDetail">查看详情</van-button>
    <div :id="miceId" :class="className" :style="{height:height,width:width, 'min-height': '500px'}" />
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import VanSelect from '@/components/Form/VanSelect.vue'
import { getMouseTree, getMouseChildrenTree, getMouseState } from '@/api/mouse'
import { Button, Toast } from 'vant'

// 根据当前后端返回的数据结构，递归家谱树
function recur(data, parent) { // data是对象
  if (data.children.length === 0 && parent) {
    if (parent.fatherId === data.id) {
      return {
        name: `父鼠${data.miceNo}`,
        value: data.id
      }
    }
    if (parent.motherId === data.id) {
      return {
        name: `母鼠${data.miceNo}`,
        value: data.id
      }
    }
  } else {
    data = {
      name: `小鼠 ${data.miceNo}`,
      value: data.id,
      fatherId: data.fatherId,
      motherId: data.motherId,
      children: data.children
    }
    for (let i = 0; i < data.children.length; i++) {
      data.children[i] = recur(data.children[i], data)
    }
  }
  return data
}

export default {
  name: 'FamilyTree',
  components: {
    'van-button': Button,
    VanSelect
  },
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'fTree'
    },
    miceId: {
      type: Number,
      default: 0
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      chart: null,
      curMouse: '',
      curMouseStatus: null, // 小鼠是否删除
      treeType: 0 // 查看那种家谱树
    }
  },
  watch: {
    miceId(n, o) {
      if (this.treeType === 0) {
        this.getTreeData()
      } else {
        this.treeType = 0
      }
    },
    treeType(n, o) {
      if (n === 0) {
        this.getTreeData()
      } else {
        this.getChildrenData()
      }
    }
  },
  mounted() {
    if (this.miceId) {
      this.getTreeData()
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    // 销毁家谱树
    disposeTree() {
      if (this.chart) {
        this.chart.dispose()
        this.chart = null
      }
    },
    // 查看小鼠详情
    goDetail() {
      if (this.curMouse) {
        if (this.curMouseStatus) {
          Toast.fail('小鼠已删除')
        } else {
          this.$router.push({ name: 'mouseEdit', params: { id: this.curMouse }})
        }
      } else {
        Toast.fail('请先点击小鼠')
      }
    },
    // 获取子集鼠信息
    getChildrenData() {
      getMouseChildrenTree({
        descendant: this.miceId
      }).then((res) => {
        const { data } = res
        const rslt = {
          name: `小鼠${this.miceNo}`,
          value: this.miceId,
          children: []
        }
        if (data && data[0] && data[0].children && data[0].children.length > 0) {
          for (let i = 0; i < data[0].children.length; i++) {
            rslt.children.push({
              name: `子鼠${data[0].children[i].miceNo}`,
              value: data[0].children[i].id
            })
          }
        }
        this.initChart(rslt, 'radial')
      })
    },
    // 获取父级鼠信息
    getTreeData() {
      getMouseTree({
        descendant: this.miceId
      }).then((res) => {
        const { data } = res
        // 计算结果
        const rslt = recur(data[0])
        console.log(rslt)
        this.initChart(rslt)
      })
    },
    initChart(data, layoutType) {
      this.disposeTree()
      this.chart = echarts.init(document.getElementById(this.miceId))
      this.chart.showLoading()
      this.chart.hideLoading()
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter: '{c}' // 控制标签展示的内容：{b}数据名；{c}数据值
        },
        series: [
          {
            type: 'tree',
            layout: layoutType || 'orthogonal',
            name: 'familyTree',
            data: [data],

            top: 'middle',
            left: 'center',
            bottom: '2%',
            right: '10%',
            width: '80%',
            height: '80%',
            roam: true, // 开启鼠标拖动和缩放

            symbolSize: 8, // 圈圈大小
            orient: 'TB', // 布局方向：上到下
            initialTreeDepth: 0, // 初始展开的层级深度：0只展示根节点
            label: {
              normal: {
                position: 'top',
                verticalAlign: 'middle',
                align: 'left',
                distance: 8
                // rotate: -90,
              }
            },
            lineStyle: {
              curveness: 0.5 // 连线的曲率
            },
            leaves: {
              label: {
                normal: {
                  position: 'bottom',
                  verticalAlign: 'middle',
                  align: 'center'
                  // rotate: -90,
                }
              }
            },

            expandAndCollapse: true,

            animationDuration: 550, // 初始动画的时长
            animationDurationUpdate: 750 // 数据更新动画的时长
          }
        ]
      })
      // 绑定点击事件
      const self = this
      this.chart.on('click', {
        seriesName: 'familyTree'
      }, function(e) {
        console.log('e=====>', e)
        self.curMouse = e.value
        getMouseState(e.value).then((res) => {
          this.curMouseStatus = res.data
        })
      })
    }
  }
}
</script>

<style lang="scss">

</style>
