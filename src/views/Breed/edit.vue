<template>
  <div class="breed-edit">
    <van-form>
      <van-field
        v-model="breedForm.name"
        label="繁育组名称"
        placeholder="请输入繁育组名称"
        :rules="[{ required: true, message: '请输入繁育组名称' }]"
      />
      <time-select btn-text="开始时间" :time.sync="breedForm.breedTime">
        <template slot="placeholder">
          <p>请选择开始时间</p>
        </template>
      </time-select>
    </van-form>
    <div class="add-btn df s-jcfe s-aic pt13 pb11">
      <van-button class="w90" hairline round size="small" color="#32C985" type="info">添加</van-button>
    </div>
    <!-- 列表 -->
    <main-list>
      <template>
        <collapse>
          <template slot="title">
            <div class="df s-aic del-list__item-title">
              <span>实验组ADEG</span>
            </div>
          </template>
          <template slot="content">
            <div class="df s-aic">
              <p>编号：<span>023</span></p>
              <p>周龄：<span>0周6天</span></p>
            </div>
            <div class="df s-aic">
              <p>性别：<span>雄</span></p>
              <p>体重：<span>10g</span></p>
            </div>
            <div class="df s-aic">
              <p>毛色：<span>灰色</span></p>
              <p>健康状况：<span>健康无异常</span></p>
            </div>
            <div class="df s-aic">
              <p>受孕时间：<span class="txt-btn--green">设置</span></p>
            </div>
          </template>
          <template slot="footer">
            <van-button class="w75 mr10" plain hairline round size="small" color="#333" type="info">查看</van-button>
            <van-button class="w75" plain hairline round size="small" color="#EB5444" type="info">删除</van-button>
          </template>
        </collapse>
      </template>
    </main-list>
    <bottom-btn @confirm="submit" />
  </div>
</template>

<script>
import MainList from '@/components/List/index.vue'
import Collapse from '@/components/Collapse/index.vue'
import BottomBtn from '@/components/BottomBtn/index.vue'
import TimeSelect from '@/components/Form/TimeSelect.vue'
import { delDelMouse, fetchList } from '@/api/delList'
import { Button, Form, Field } from 'vant'

export default {
  name: 'BreedEdit',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-field': Field,
    TimeSelect,
    MainList,
    Collapse,
    BottomBtn
  },
  data() {
    return {
      breedForm: {
        name: '',
        breedTime: 0
      }
    }
  },
  methods: {
    submit() {}
  }
}
</script>

<style lang="scss">
  .breed-edit {
    .add-btn {
      width: 90%;
      margin: 0 auto;
    }
  }
</style>