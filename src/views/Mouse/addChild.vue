<template>
  <div class="add-child">
    <van-form>
      <van-field v-model="form.fatherId" label="父鼠编号" />
      <van-field v-model="form.motherId" label="母鼠编号" />
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
          :rules="[{ required: true, message: '请输入饲养条件' }]"
        />
        <van-field
          v-model="currentGene.status"
          readonly
          label="健康状态"
          placeholder="请输入健康状态"
          :rules="[{ required: true, message: '请输入健康状态' }]"
        />
        <van-field
          v-model="currentGene.color"
          readonly
          label="毛色"
          placeholder="请输入毛色"
          :rules="[{ required: true, message: '请输入毛色' }]"
        />
        <van-field
          v-model="currentGene.area"
          readonly
          label="应用领域"
          placeholder="请输入应用领域"
          rows="2"
          autosize
          type="textarea"
          :rules="[{ required: true, message: '请输入应用领域' }]"
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
      <van-field v-model="form.miceNo" label="编号" />
      <div class="file--span fs14">
        <span>状态 闲置</span>
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
      >
        <template slot="placeholder">
          <p></p>
        </template>
      </van-select>
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
      <van-field
        v-model="currentGene.geneName"
        label="笼位号"
        placeholder="请输入笼位号名称"
      />
      <div class="cage-box">
        <van-field
          v-model="currentGene.geneName"
          label="笼位号"
          placeholder="请输入笼位号名称"
        />
        <van-field
          v-model="currentGene.miceCondition"
          label="房间号"
          placeholder="请输入房间号"
        />
        <van-field
          v-model="currentGene.status"
          label="架号"
          placeholder="请输入架号"
        />
      </div>
      <div class="file--span fs14">
        <p>附件：<span class="txt-btn--green">查看附件</span><span class="txt-btn--green ml18">上传附件</span></p>
      </div>
    </van-form>
    <bottom-btn @confirm="onSubmit" />
  </div>
</template>

<script>
import BottomBtn from '@/components/BottomBtn/index.vue'
import VanSelect from '@/components/Form/VanSelect.vue'
import TimeSelect from '@/components/Form/TimeSelect.vue'
import ViewFiles from '@/components/ViewFiles'
import ChooseVariety from '@/components/Dialogs/ChooseVariety'
import AddGenesBtn from '@/components/Dialogs/AddGenes'
import GenesChoose from '@/components/Dialogs/GenesChoose'
import UploadBtn from '@/components/Dialogs/Upload'
import { Button, Form, Field, Toast } from 'vant'
import { addMouse } from '@/api/mouse'
import { getLisByGeneId, getLisByVariety } from '@/api/genes'

export default {
  name: 'AddChild',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-field': Field,
    BottomBtn,
    ChooseVariety,
    VanSelect,
    TimeSelect,
    ViewFiles,
    UploadBtn,
    AddGenesBtn,
    GenesChoose
  },
  data() {
    return {
      // 总表单
      form: {
        vid: '',
        genotypes: null,
        maleMiceNum: 0,
        femaleMiceNum: 0,
        weight: null,
        birthDate: +new Date(),
        pureHeterozygote: null,
        color: '#00CB7C',
        separateCageRemindTime: null,
        separateCageRemindFlag: 0,
        phenotypicIdentificationRemindTime: null,
        phenotypicIdentificationRemindFlag: 0,
        fatherId: 0,
        motherId: 0,
        deathStatus: 0,
        delFlag: 0,
        miceNo: '',
        sign: '',
        status: 1 // 0:无，1：闲置，2：繁育，3：实验,4:手动处死5,实验处死
      },
      cacheFilesList: [],
      // 品系选择
      curVariety: '',
      varietiesName: '',
      varietiesId: '',
      father: {},
      mother: {},
      // 基因型选择
      genesType: 1,
      genes: '',
      // 当前选择的基因型
      currentGene: {
        varietiesName: '',
        geneName: '',
        miceCondition: '',
        status: '',
        color: '',
        area: ''
      },
      // 鼠笼信息
      cage: {}
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
      const newVariety = JSON.parse(n)
      this.varietiesName = newVariety.varietiesName
      this.varietiesId = newVariety.id
      if (this.genesType === 4) {
        this.getNewGenesByVariety()
      }
    },
    genesType(n, o) {
      if (n === 1 || n === 3) {
        this.currentGene.geneName = this.father.geneName
        this.form.genotypes = this.father.genotypes
        this.varietiesName = this.father.varietiesName
        this.varietiesId = this.father.vid
      }
      if (n === 2) {
        this.currentGene.geneName = this.mother.geneName
        this.form.genotypes = this.mother.genotypes
        this.varietiesName = this.mother.varietiesName
        this.varietiesId = this.mother.vid
      }
      if (n === 4) { // WT
        this.getNewGenesByVariety()
        return
      }
      if (n === 0 || n === 5) {
        this.currentGene.geneName = ''
        this.form.genotypes = 0
      }
      this.getGenesInfo()
    },
    genes(n, o) {
      const newGenes = JSON.parse(n)
      this.form.genotypes = newGenes.id
      this.fillGenes(newGenes)
    }
  },
  created() {
    const cacheChildMouse = this.$store.getters.addingChildMouse
    console.log(cacheChildMouse)
    const parents = cacheChildMouse.parents || []
    const cage = cacheChildMouse.cage || {}
    if (parents.length === 2) {
      this.father = parents.filter((el) => {
        return el.gender === 0
      })[0]
      this.mother = parents.filter((el) => {
        return el.gender === 1
      })[0]
    }
    this.$set(this, 'cage', cage)
    const { vid, varietiesName, genotypes, geneName  } = this.father
    this.varietiesName = varietiesName
    this.varietiesId = vid
    this.form.genotypes = genotypes
    this.currentGene.geneName = geneName
    console.log(this.father, this.mother, this.cage)
    this.getGenesInfo()
  },
  methods: {
    // 根据品系id重新拿基因型列表,填充WT基因型
    getNewGenesByVariety() {
      getLisByVariety({
        id: this.varietiesId
      }).then((res) => {
        const { data } = res
        const WT = data.filter((el) => {
          return el.geneName === 'WT'
        })[0]
        this.fillGenes(WT)
      })
    },
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
    goBack() {
      this.$store.dispatch('app/clearChildMouses')
      this.$router.back()
    },
    goChoose(obj) {
      this.$router.push({ name: 'mouseCage', params: obj })
    },
    // 获取基因型具体信息
    getGenesInfo() {
      getLisByGeneId(this.form.genotypes).then((res) => {
        if (!res.data) {
          this.fillGenes()
        } else {
          this.fillGenes(res.data)
        }
      })
    },
    // 填充基因型信息
    fillGenes(res) {
      if (!res) {
        for (const key in this.currentGene) {
          this.currentGene[key] = ''
        }
      } else {
        const { geneName, miceCondition, status, color, area } = res

        this.currentGene.geneName = geneName
        this.currentGene.miceCondition = miceCondition
        this.currentGene.status = status
        this.currentGene.color = color
        this.currentGene.area = area
      }
    },
    // 提交
    onSubmit() {
      const { id: userId } = this.$store.getters.info
      const params = Object.assign({}, this.form, {
        createTime: Math.floor(+new Date() / 1000),
        birthDate: this.form.birthDate / 1000,
        separateCageRemindTime: this.form.separateCageRemindTime / 1000,
        phenotypicIdentificationRemindTime: this.form.phenotypicIdentificationRemindTime / 1000,
        createUser: userId,
        operator: userId,
        fatherId: this.father.miceInfoId,
        motherId: this.mother.miceInfoId,
        cid: this.father.cid,
        vid: this.varietiesId
      })
      addMouse(params).then(res => {
        Toast.success('新增子鼠成功')
        this.$store.dispatch('app/clearChildMouses')
        this.goBack()
      })
    }
  }
}
</script>

<style lang="scss">
  .add-child {
    margin-bottom: 80px;
  }
  .genes-box, .cage-box {
    width: 90%;
    margin: 0 auto;
    background-color: #F6F6F6;
    .van-cell {
      background-color: #F6F6F6;
    }
  }

</style>
