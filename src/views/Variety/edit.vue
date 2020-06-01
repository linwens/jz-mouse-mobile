<template>
  <div class="variety-edit">
    <van-form>
      <van-field
        v-model="genesForm.varietiesName"
        label="品系"
        disabled
        placeholder="请选择品系"
        :rules="[{ required: true, message: '请选择品系' }]"
      >
        <template #button>
          <choose-variety :cur-variety.sync="choicedVariety"></choose-variety>
        </template>
      </van-field>
      <van-field
        v-model="genesForm.geneName"
        label="基因型"
        placeholder="请输入基因型名称"
        :rules="[{ required: true, message: '请输入基因型名称' }]"
      />
      <van-field
        v-model="genesForm.miceCondition"
        label="饲养条件"
        placeholder="请输入饲养条件"
        :rules="[{ required: true, message: '请输入饲养条件' }]"
      />
      <van-field
        v-model="genesForm.status"
        label="健康状态"
        placeholder="请输入健康状态"
        :rules="[{ required: true, message: '请输入健康状态' }]"
      />
      <van-field
        v-model="genesForm.color"
        label="毛色"
        placeholder="请输入毛色"
        :rules="[{ required: true, message: '请输入毛色' }]"
      />
      <van-field
        v-model="genesForm.area"
        label="应用领域"
        placeholder="请输入应用领域"
        rows="2"
        autosize
        type="textarea"
        :rules="[{ required: true, message: '请输入应用领域' }]"
      />
    </van-form>
    <bottom-btn @confirm="submit" />
  </div>
</template>

<script>
import ChooseVariety from '@/components/Dialogs/ChooseVariety'
import BottomBtn from '@/components/BottomBtn/index.vue'
import { goBack } from '@/components/Mixins/goPage'
import { addNewGenes, editGenes } from '@/api/genes'
import { Button, Form, Field, Toast } from 'vant'

export default {
  name: 'VarietyEdit',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-field': Field,
    BottomBtn,
    ChooseVariety
  },
  mixins: [goBack],
  data() {
    return {
      choicedVariety: null, // 选中的品系
      varietiesId: '',
      optType: 'add', // 操作方式
      genesForm: {
        name: '',
        varietyTime: 0
      }
    }
  },
  watch: {
    choicedVariety(n, o) {
      console.log('选择了品系')
      const newVariety = n
      this.varietiesId = newVariety.id
      this.$set(this, 'genesForm', newVariety)
    }
  },
  created() {
    console.log(this.$route.params)
    if (this.$route.params.miceGeneId) {
      this.optType = 'modify'
      this.curVariety = JSON.stringify(this.$route.params)
    }
  },
  methods: {
    // 提交
    submit() {
      console.log('this.optType', this.optType)
      const apiType = this.optType === 'modify' ? editGenes : addNewGenes
      const { miceGeneId: id, source, geneName, miceCondition, status, color, area, state } = this.genesForm
      
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
        // 存储输入过的值
        // this.$store.dispatch('user/setInputHistory', {
        //   geneName,
        //   miceCondition,
        //   status,
        //   color,
        //   area
        // })
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