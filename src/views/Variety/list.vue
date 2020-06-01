<template>
  <div class="variety-list">
    <!-- 列表 -->
    <main-list>
      <template>
        <collapse>
          <template slot="title">
            <div class="df s-aic xs-collapse__content--multiple">
              <span>XR-120/2</span>
              <span>张三</span>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>创建时间：<span>2020-01-22 12:22:10</span></p>
            </div>
          </template>
          <template slot="footer">
            <span class="txt-btn--green fs14">详情</span>
            <span class="txt-btn--red fs14 ml15 mr8">删除</span>
          </template>
        </collapse>
      </template>
    </main-list>
    <bottom-btn @confirm="submit">
      <template slot="confirm">
        <add-variety class="w150" />
      </template>
    </bottom-btn>
  </div>
</template>

<script>
import MainList from '@/components/List/index.vue'
import Collapse from '@/components/Collapse/index.vue'
import BottomBtn from '@/components/BottomBtn/index.vue'
import AddVariety from '@/components/Dialogs/AddVariety.vue'
import { delDelMouse, fetchList } from '@/api/delList'
import { Button, Form, Field } from 'vant'

export default {
  name: 'VarietyList',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-field': Field,
    AddVariety,
    MainList,
    Collapse,
    BottomBtn
  },
  data() {
    return {
      varietyForm: {
        name: '',
        varietyTime: 0
      }
    }
  },
  methods: {
    submit() {}
  }
}
</script>

<style lang="scss">
  .variety-list {
    padding-top: 16px;
  }
</style>