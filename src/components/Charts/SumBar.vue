<template>
  <div class="w-100 df s-jcc s-aic bg-gray pt10 pb10 pos-r">
    <slot name="posaEle" />
    <div :id="id" :class="className" :style="{height:height,width:width, 'min-height': '500px'}" />
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { countMice } from '@/api/home'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'sumBar'
    },
    id: {
      type: String,
      default: 'sumBar'
    },
    type: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '98%'
    },
    height: {
      type: String,
      default: '98%'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    type(n, o) {
      this.getCountMice()
    }
  },
  mounted() {
    this.getCountMice()
  },
  beforeDestroy() {
    console.log('销毁')
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    // 获取柱状图信息
    getCountMice() {
      countMice(this.type).then((res) => {
        console.log(res)
        const { data } = res
        this.initChart(data)
      })
    },
    initChart(data) {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.showLoading()
      const femaleSum = []
      const maleSum = []
      const xData = []
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        femaleSum.push(item.femaleNum)
        maleSum.push(item.maleNum)
        // xData.push(`${item.name}\n${item.varietiesName ? item.varietiesName : ''}`)
        xData.push([
          item.name,
          item.varietiesName ? item.varietiesName : ''
        ])
      }
      // var xData = (() => {
      //   var list = []
      //   for (var i = 1; i < 13; i++) {
      //     list.push(data.name)
      //   }
      //   return list
      // })()

      this.chart.hideLoading()
      this.chart.setOption({
        backgroundColor: '#fff',
        title: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          borderWidth: 0,
          top: 110,
          bottom: 150,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '4%',
          top: '8%',
          textStyle: {
            color: '#90979c'
          },
          data: ['雌', '雄']
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0,
            rotate: 40,

            formatter(value, index) {
              // 数组拆分拼接
              const arr = value.split(',')
              const a = arr[0].length > 10 ? arr[0].slice(0, 10) + '...' : arr[0]
              const b = arr[1].length > 10 ? arr[1].slice(0, 10) + '...' : arr[1]
              return [
                '{a|' + a + '}',
                '{b|' + b + '}'
              ].join('\n')
            },

            rich: {
              a: {},
              b: {
                fontWeight: 'bold'
              }
            }
          },
          data: xData
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 40,
          end: 60,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'
          },
          textStyle: {
            color: '#fff'
          },
          borderColor: '#90979c'
        }, {
          type: 'inside',
          disabled: true,
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [
          {
            name: '雌',
            type: 'bar',
            stack: '总量',
            barMaxWidth: 35,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: '#9A68B4',
                label: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  },
                  position: 'inside',
                  formatter: function(p) {
                    return p.value > 0 ? (p.value) : ''
                  }
                }
              }
            },
            data: femaleSum
          },
          {
            name: '雄',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#58A2FB',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'inside',
                  formatter: function(p) {
                    return p.value > 0 ? (p.value) : ''
                  }
                }
              }
            },
            data: maleSum
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss">

</style>
