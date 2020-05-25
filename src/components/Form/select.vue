<template>
  <div>
    <van-button type="default">
      文字
      <svg-icon icon-class="select-icon" class="fs10" />
    </van-button>
    <!-- 弹出 -->
    <van-popup v-model="show" position="top" :style="{ height: '30%' }">
      <van-picker
        title="标题"
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
import {
  Button,
  Popup,
  Picker,
  Toast,
} from 'vant';

export default {
  name: 'FormSelect',
  components: {
    'van-button': Button,
    'van-popup': Popup,
    'van-picker': Picker,
  },
  props: {
    options: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      show: false,
      btnText: '',
      columns: ['我的小鼠', '实验室小鼠', '实验室人员'],
    };
  },
  created() {
    this.btnText = this.columns[0]; // 默认展示第一个选项的内容
  },
  methods: {
    showOptions() {
      this.show = true;
    },
    onConfirm(value, index) {
      Toast(`当前值：${value}, 当前索引：${index}`);
    },
    onChange(picker, value, index) {
      Toast(`当前值：${value}, 当前索引：${index}`);
    },
    onCancel() {
      Toast('取消');
    },
  },
};
</script>

<style>

</style>
