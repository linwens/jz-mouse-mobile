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
        <collapse>
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
    <bottom-btn @confirm="submit" />
  </div>
</template>

<script>
import MainList from '@/components/List/index.vue'
import Collapse from '@/components/Collapse/index.vue'
import BottomBtn from '@/components/BottomBtn/index.vue'
import VanSelect from '@/components/Form/VanSelect.vue'
import TimeSelect from '@/components/Form/TimeSelect.vue'
import { delDelMouse, fetchList } from '@/api/delList'
import { Button, Form, Field, Tag, Cell } from 'vant'

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
  data() {
    return {
      exptForm: {
        name: '',
        exptTime: 0
      }
    }
  },
  methods: {
    submit() {}
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
