<template>
  <div></div>
</template>

<script>
import ViewFiles from '@/components/ViewFiles'
import ChooseVariety from '@/components/Dialogs/ChooseVariety'
import AddGenesBtn from '@/components/Dialogs/AddGenes'
import UploadBtn from '@/components/Dialogs/Upload'
import { addMouse } from '@/api/mouse'
import { getLisByGeneId, getLisByVariety } from '@/api/genes'

export default {
  name: 'AddChild',
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
        this.$message.success('新增子鼠成功')
        this.$store.dispatch('app/clearChildMouses')
        this.goBack()
      })
    }
  }
}
</script>

<style>

</style>
