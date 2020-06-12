<template>
  <div></div>
</template>

<script>
import ViewFiles from '@/components/ViewFiles'
import ChooseVariety from '@/components/Dialogs/ChooseVariety'
import AddGenesBtn from '@/components/Dialogs/AddGenes'
import UploadBtn from '@/components/Dialogs/Upload'

export default {
  name: 'AddMouse',
  components: {
    ChooseVariety,
    ViewFiles,
    UploadBtn,
    AddGenesBtn
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
      curVariety: '',
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
      const newVariety = JSON.parse(n)
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
        this.$router.push({ name: 'mouseCage', params: this.form })
      }
    },
    // 校验表单
    checkForm() {
      if (!this.form.vid) {
        this.$message.error('未选择品系')
        return false
      }
      if (!this.form.genotypes) {
        this.$message.error('未选择基因型')
        return false
      }
      if (!this.form.maleMiceNum && !this.form.femaleMiceNum) {
        this.$message.error('小鼠数量不能为0')
        return false
      }
      // if (!this.form.weight) {
      //   this.$message.error('未输入体重')
      //   return false
      // }
      // if (!this.form.birthDate) {
      //   this.$message.error('未选择出生日期')
      //   return false
      // }
      // if (!this.form.pureHeterozygote && this.form.pureHeterozygote !== 0) {
      //   console.log(this.form.pureHeterozygote)
      //   this.$message.error('未确定纯/杂合子')
      //   return false
      // }
      // if (!this.form.color) {
      //   this.$message.error('未选择颜色')
      //   return false
      // }
      // if (!this.form.separateCageRemindTime) {
      //   this.$message.error('未设置分笼时间')
      //   return false
      // }
      // if (!this.form.phenotypicIdentificationRemindTime) {
      //   this.$message.error('未设置表型鉴定时间')
      //   return false
      // }
      return true
    }
  }
}
</script>

<style>

</style>
