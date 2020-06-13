<template>
  <div class="mouse-add">
    <van-form>
      <van-field
        v-model="varietiesName"
        label="品系"
        disabled
        placeholder="请选择品系"
        :rules="[{ required: true, message: '请选择品系' }]"
      >
        <template #button>
          <choose-variety :cur-variety.sync="curVariety" />
        </template>
      </van-field>
      <div class="genes-box">
        <van-field
          v-model="currentGene.geneName"
          readonly
          label="基因型"
          placeholder="请输入基因型名称"
          :rules="[{ required: true, message: '请输入基因型名称' }]"
        />
        <van-field
          v-model="currentGene.miceCondition"
          readonly
          label="饲养条件"
          placeholder="请输入饲养条件"
        />
        <van-field
          v-model="currentGene.status"
          readonly
          label="健康状态"
          placeholder="请输入健康状态"
        />
        <van-field
          v-model="currentGene.color"
          readonly
          label="毛色"
          placeholder="请输入毛色"
        />
        <van-field
          v-model="currentGene.area"
          readonly
          label="应用领域"
          placeholder="请输入应用领域"
          rows="2"
          autosize
          type="textarea"
        />
        <div class="df s-jcfe s-aic pb10">
          <genes-choose :id="varietiesId" btn-text="选择" class="mr16" :genes.sync="genes" />
          <add-genes-btn
            :varieties-id="varietiesId"
            :varieties-name="varietiesName"
            :genes-data.sync="genes"
          />
        </div>
      </div>
      <van-field v-model="form.femaleMiceNum" label="数量">
        <template #extra>
          <span>只(雌)</span>
        </template>
      </van-field>
      <van-field v-model="form.maleMiceNum">
        <template #extra>
          <span>只(雄)</span>
        </template>
      </van-field>
      <van-field v-model="form.weight" label="体重">
        <template #extra>
          <span>g</span>
        </template>
      </van-field>
      <time-select btn-text="出生日期" :time.sync="form.birthDate">
        <template slot="placeholder">
          <p>请选择出生日期</p>
        </template>
      </time-select>
      <div class="df s-aic">
        <van-field v-model="weekAge" label="周龄">
          <template #extra>
            <span>周</span>
          </template>
        </van-field>
        <van-field v-model="dayAge">
          <template #extra>
            <span>天</span>
          </template>
        </van-field>
      </div>
      <van-select
        :cur-val-num.sync="form.pureHeterozygote"
        btn-text="纯/杂合子"
        :columns="[
          {
            label: '纯合子',
            value: 0
          },
          {
            label: '杂合子',
            value: 1
          },
          {
            label: '未测试',
            value: 2
          }
        ]"
      />
      <div class="file--span fs14">
        <span>展示颜色：00000</span>
      </div>
      <time-select btn-text="分笼时间" :time.sync="form.separateCageRemindTime">
        <template slot="placeholder">
          <p>请选择分笼时间</p>
        </template>
      </time-select>
      <van-select
        btn-text="分笼提醒"
        :cur-val-num.sync="form.separateCageRemindFlag"
        :columns="[
          {
            label: '是',
            value: 0
          },
          {
            label: '否',
            value: 1
          }
        ]"
      >
        <template slot="placeholder">
          <p>是否开启处理时间提醒</p>
        </template>
      </van-select>
      <time-select btn-text="表型鉴定时间" :time.sync="form.phenotypicIdentificationRemindTime">
        <template slot="placeholder">
          <p>请选择表型鉴定时间</p>
        </template>
      </time-select>
      <van-select
        btn-text="表型鉴定提醒"
        :cur-val-num.sync="form.phenotypicIdentificationRemindFlag"
        :columns="[
          {
            label: '是',
            value: 0
          },
          {
            label: '否',
            value: 1
          }
        ]"
      >
        <template slot="placeholder">
          <p>是否开启表型鉴定时间提醒</p>
        </template>
      </van-select>
      <div class="file--span fs14">
        <p>附件：<span class="txt-btn--green">查看附件</span><span class="txt-btn--green ml18">上传附件</span></p>
      </div>
    </van-form>
    <bottom-btn>
      <template slot="confirm">
        <van-button class="w150" round size="small" color="#32C985" type="info" @click="goChoose()">下一步(去选笼子)</van-button>
      </template>
    </bottom-btn>
  </div>
</template>

<script>
import BottomBtn from '@/components/BottomBtn/index.vue'
import VanSelect from '@/components/Form/VanSelect.vue'
import TimeSelect from '@/components/Form/TimeSelect.vue'
// import ViewFiles from '@/components/ViewFiles'
import ChooseVariety from '@/components/Dialogs/ChooseVariety'
import AddGenesBtn from '@/components/Dialogs/AddGenes'
import GenesChoose from '@/components/Dialogs/GenesChoose'
// import UploadBtn from '@/components/Dialogs/Upload'
import { Button, Form, Field, Toast } from 'vant'

export default {
  name: 'AddMouse',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-field': Field,
    BottomBtn,
    ChooseVariety,
    VanSelect,
    TimeSelect,
    AddGenesBtn,
    GenesChoose
    // ViewFiles,
    // UploadBtn,
  },
  data() {
    return {
      // 总表单
      form: {
        vid: '',
        genotypes: null,
        maleMiceNum: null,
        femaleMiceNum: null,
        weight: null,
        birthDate: null,
        pureHeterozygote: null,
        color: '#58A2FB',
        separateCageRemindTime: null,
        separateCageRemindFlag: 0,
        phenotypicIdentificationRemindTime: null,
        phenotypicIdentificationRemindFlag: 0,
        fatherId: 0,
        files: [],
        motherId: 0,
        deathStatus: 0,
        delFlag: 0,
        miceNo: '',
        sign: '',
        status: 1 // 0:无，1：闲置，2：繁育，3：实验,4:手动处死5,实验处死
      },
      cacheFilesList: [],
      // 品系选择
      curVariety: {},
      varietiesName: '',
      varietiesId: '',
      // 基因型选择
      genes: '',
      // 当前选择的基因型
      currentGene: {
        varietiesName: '',
        geneName: '',
        miceCondition: '',
        status: '',
        color: '',
        area: ''
      }
    }
  },
  computed: {
    // 周龄，不存数据库
    weekAge() {
      if (!this.form.birthDate) return 0
      const duration = +new Date() - this.form.birthDate
      const weeks = duration / 1000 / 60 / 60 / 24 / 7
      return Math.floor(weeks)
    },
    // 天
    dayAge() {
      if (!this.form.birthDate) return 0
      const duration = +new Date() - this.form.birthDate
      const days = duration / 1000 / 60 / 60 / 24 % 7
      return Math.floor(days) + 1
    }
  },
  watch: {
    curVariety(n, o) {
      const newVariety = n
      this.varietiesName = newVariety.varietiesName
      this.varietiesId = newVariety.id
    },
    genes(n, o) {
      const newGenes = JSON.parse(n)
      this.form.genotypes = newGenes.id
      this.fillGenes(newGenes)
    }
  },
  created() {
    const cacheMouseInfo = this.$store.getters.cacheMouseInfo
    if (Object.keys(cacheMouseInfo).length !== 0) {
      this.$set(this, 'form', cacheMouseInfo.common)
      this.$set(this, 'cacheFilesList', cacheMouseInfo.files)
      this.$set(this, 'currentGene', cacheMouseInfo.genes)
      this.varietiesName = cacheMouseInfo.varietiesName
      this.varietiesId = cacheMouseInfo.varietiesId
    }
  },
  methods: {
    // 上传成功回填url
    fillFilesUrl(data, fileList) {
      this.$set(this.form, 'files', data)
      // 填充文件查看列表
      const list = []
      for (let i = 0; i < data.length; i++) {
        const { name: fileName, type: bizType } = fileList[i].raw
        list.push({
          fileName,
          bizType,
          path: data[i]
        })
      }
      console.log('list', list)
      this.$set(this, 'cacheFilesList', list)
    },
    // 选择品系 or 基因型
    chooseVarity() {
      this.varietyDialog = true
    },
    fillVarity() {
      this.varietyDialog = false
      // 填充品系
    },
    // 选择基因型
    chooseGenes() {
      this.genesDialog = true
    },
    // 新增基因型
    addGenes() {
      this.addGenesDialog = true
    },
    // 填充基因型信息
    fillGenes(res) {
      const { geneName, miceCondition, status, color, area } = res
      this.currentGene.geneName = geneName
      this.currentGene.miceCondition = miceCondition
      this.currentGene.status = status
      this.currentGene.color = color
      this.currentGene.area = area
    },
    goBack() {
      this.$router.back()
      this.$store.dispatch('app/clearMouseInfo')
    },
    goChoose(obj) {
      this.form.vid = this.varietiesId
      if (this.checkForm()) {
        this.$store.dispatch('app/cacheMouseInfo', {
          varietiesName: this.varietiesName,
          varietiesId: this.varietiesId,
          genes: this.currentGene,
          files: this.cacheFilesList,
          common: this.form
        })
        this.$router.push({ name: 'MouseCage', params: this.form })
      }
    },
    // 校验表单
    checkForm() {
      if (!this.form.vid) {
        Toast.fail('未选择品系')
        return false
      }
      if (!this.form.genotypes) {
        Toast.fail('未选择基因型')
        return false
      }
      if (!this.form.maleMiceNum && !this.form.femaleMiceNum) {
        Toast.fail('小鼠数量不能为0')
        return false
      }
      // if (!this.form.weight) {
      //   Toast.fail('未输入体重')
      //   return false
      // }
      // if (!this.form.birthDate) {
      //   Toast.fail('未选择出生日期')
      //   return false
      // }
      // if (!this.form.pureHeterozygote && this.form.pureHeterozygote !== 0) {
      //   console.log(this.form.pureHeterozygote)
      //   Toast.fail('未确定纯/杂合子')
      //   return false
      // }
      // if (!this.form.color) {
      //   Toast.fail('未选择颜色')
      //   return false
      // }
      // if (!this.form.separateCageRemindTime) {
      //   Toast.fail('未设置分笼时间')
      //   return false
      // }
      // if (!this.form.phenotypicIdentificationRemindTime) {
      //   Toast.fail('未设置表型鉴定时间')
      //   return false
      // }
      return true
    }
  }
}
</script>

<style lang="scss">
  .mouse-add {
    margin-bottom: 80px;
  }
  .genes-box {
    width: 90%;
    margin: 0 auto;
    background-color: #F6F6F6;
    .van-cell {
      background-color: #F6F6F6;
    }
  }
</style>
