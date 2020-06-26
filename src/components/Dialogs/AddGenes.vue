<template>
  <div class="dib">
    <van-button :class="btnWidthClass" round size="small" color="#00CB7C" :plain="plain" type="primary" @click="addGenesDialog = true">{{ btnText }}</van-button>
    <!-- 新增基因弹窗 -->
    <van-dialog
      v-model="addGenesDialog"
      title="新增基因型"
      get-container="body"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="#FF6358"
      @confirm="doAddGenes"
    >
      <van-form :show-error-message="false" class="mt20 mb20">
        <van-field
          v-model="addGensForm.geneName"
          required
          label="基因型名称"
          placeholder="请输入基因型名称"
          :rules="[{ required: true, message: '基因型名称不能为空' }]"
        />
        <van-field
          v-model="addGensForm.miceCondition"
          label="饲养条件"
          placeholder="请输入饲养条件"
        />
        <van-field
          v-model="addGensForm.status"
          label="健康状态"
          placeholder="请输入健康状态"
        />
        <van-field
          v-model="addGensForm.color"
          label="毛色"
          placeholder="请输入毛色"
        />
        <van-field
          v-model="addGensForm.area"
          label="应用领域"
          placeholder="请输入应用领域"
        />
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import { addNewGenes } from '@/api/genes'
import { inputRemenber } from '@/components/Mixins/history'
import { Button, Dialog, Form, Field } from 'vant'

export default {
  name: 'VarietyEdit',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-field': Field,
    [Dialog.Component.name]: Dialog.Component
  },
  mixins: [inputRemenber],
  props: {
    plain: {
      type: Boolean,
      default: true
    },
    btnWidthClass: {
      type: String,
      default: 'w75'
    },
    btnText: {
      type: String,
      default: '新增'
    },
    genesData: {
      type: String,
      default: ''
    },
    // 品系id
    varietiesId: {
      type: null,
      default: null
    },
    // 品系名称
    varietiesName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 新增基因型
      addGenesDialog: false,
      // 新增基因型表单
      addGensForm: {
        geneName: '',
        miceCondition: '',
        status: '',
        color: '',
        area: ''
      }
    }
  },
  methods: {
    doAddGenes() {
      this.addGenesDialog = false
      const { source, geneName, miceCondition, status, color, area } = this.addGensForm
      addNewGenes({
        area,
        color,
        createUser: this.$store.getters.info.id,
        geneName,
        miceCondition,
        source,
        status,
        varietiesId: this.varietiesId
      }).then((res) => {
        console.log(res)
        this.addGensForm.id = res.data
        this.$emit('update:genesData', JSON.stringify(this.addGensForm))
      })
    }
  }
}
</script>

<style lang="scss">
</style>
