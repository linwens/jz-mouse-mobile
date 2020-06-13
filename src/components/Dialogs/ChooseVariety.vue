<template>
  <div class="dib">
    <span v-if="!disabled" class="txt-btn--green fs14" @click="show = true">选择品系</span>
    <!-- 弹出 -->
    <van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
      <van-picker
        title="选择品系"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
        @change="onChange"
      />
    </van-popup>
  </div>
</template>

<script>
import { varietiesList } from '@/api/variety'
import {
  Popup,
  Picker,
  Toast
} from 'vant'

export default {
  name: 'ChooseVariety',
  components: {
    'van-popup': Popup,
    'van-picker': Picker
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    curVariety: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      varietyData: [], // 品系总数据
      columns: [], // 品系名称的列表
      show: false
    }
  },
  created() {
    varietiesList().then((res) => {
      this.varietyData = res.data.records
      this.columns = this.varietyData.map(el => {
        return el.varietiesName
      })
    })
  },
  methods: {
    onConfirm(value, index) {
      console.log(`当前值：${value}, 当前索引：${index}`);
      const curData = this.varietyData.filter(el => {
        return el.varietiesName === value
      })[0]
      this.$emit('update:curVariety', curData)
      this.show = false
    },
    onChange(picker, value, index) {
      console.log(`当前值：${value}, 当前索引：${index}`);
    },
    onCancel() {
      Toast('取消');
      this.show = false
    },
  }

}
</script>

<style>

</style>