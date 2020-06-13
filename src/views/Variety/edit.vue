<template>
  <div class="variety-edit">
    <van-form>
      <van-field
        v-model="addGensForm.varietiesName"
        label="品系"
        disabled
        placeholder="请选择品系"
        :rules="[{ required: true, message: '请选择品系' }]"
      >
        <template #button>
          <choose-variety :cur-variety.sync="curVariety" :disabled="optType === 'modify'" />
        </template>
      </van-field>
      <van-field
        v-model="addGensForm.geneName"
        label="基因型"
        placeholder="请输入基因型名称"
        :rules="[{ required: true, message: '请输入基因型名称' }]"
      />
      <van-field
        v-model="addGensForm.miceCondition"
        label="饲养条件"
        placeholder="请输入饲养条件"
        :rules="[{ required: true, message: '请输入饲养条件' }]"
      />
      <van-field
        v-model="addGensForm.status"
        label="健康状态"
        placeholder="请输入健康状态"
        :rules="[{ required: true, message: '请输入健康状态' }]"
      />
      <van-field
        v-model="addGensForm.color"
        label="毛色"
        placeholder="请输入毛色"
        :rules="[{ required: true, message: '请输入毛色' }]"
      />
      <van-field
        v-model="addGensForm.area"
        label="应用领域"
        placeholder="请输入应用领域"
        rows="2"
        autosize
        type="textarea"
        :rules="[{ required: true, message: '请输入应用领域' }]"
      />
    </van-form>
    <bottom-btn @confirm="onSubmit" />
  </div>
</template>

<script>
import ChooseVariety from '@/components/Dialogs/ChooseVariety'
import BottomBtn from '@/components/BottomBtn/index.vue'
import { goBack } from '@/components/Mixins/goPage'
import { addNewGenes, editGenes } from '@/api/genes'
import { Form, Field, Toast } from 'vant'

export default {
  name: 'VarietyEdit',
  components: {
    'van-form': Form,
    'van-field': Field,
    BottomBtn,
    ChooseVariety
  },
  mixins: [goBack],
  data() {
    return {
      curVariety: null, // 当前选中的品系
      varietiesId: '',
      optType: 'add', // 操作方式
      addGensForm: {
        varietiesName: '',
        geneName: '',
        miceCondition: '',
        status: '',
        color: '',
        area: ''
      }
    }
  },
  watch: {
    curVariety(n, o) {
      const newVariety = n
      this.varietiesId = newVariety.id
      if (newVariety.isSystem === 1) { // 渲染内置基因型
        this.$set(this, 'addGensForm', newVariety.miceGeneVO)
        this.$set(this.addGensForm, 'varietiesName', newVariety.varietiesName)
        this.$set(this.addGensForm, 'geneName', '') // 基因型空掉
      } else {
        this.$set(this, 'addGensForm', newVariety)
      }
    }
  },
  created() {
    console.log(this.$route.params)
    if (this.$route.params.miceGeneId) {
      this.optType = 'modify'
      this.curVariety = this.$route.params
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    // 提交
    onSubmit() {
      console.log('this.optType', this.optType)
      const apiType = this.optType === 'modify' ? editGenes : addNewGenes
      const { miceGeneId: id, source, geneName, miceCondition, status, color, area, state } = this.addGensForm
      apiType({
        id,
        source,
        varietiesId: this.varietiesId,
        geneName,
        miceCondition,
        status,
        color,
        area,
        state,
        userId: this.$store.getters.info.id
      }).then((res) => {
        Toast.success(this.optType === 'modify' ? '编辑成功' : '新增成功')
        this.goBack()
      })
    }
  }
}
</script>

<style lang="scss">
  .variety-edit {
    .add-btn {
      width: 90%;
      margin: 0 auto;
    }
  }
</style>