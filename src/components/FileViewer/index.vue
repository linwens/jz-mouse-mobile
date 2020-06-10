<template>
  <div class="dib">
    <el-button type="text" size="mini" @click="dialogVisible = true">{{ btnText }}</el-button>
    <div v-if="type === 'pdf'">
      <el-dialog
        title="pdf文件查看"
        append-to-body
        fullscreen
        custom-class="mouse__preview"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <embed
          :src="fileUrl"
          style="width: 100%; height: 100%"
        >
      </el-dialog>
    </div>
    <div v-if="type === 'img'">
      <el-dialog
        title="图片查看"
        append-to-body
        fullscreen
        custom-class="mouse__preview"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <el-image
          style="width: 100px; height: 100px"
          :src="fileUrl"
          :preview-src-list="[fileUrl]"
        />
      </el-dialog>
    </div>
    <div v-if="type === 'office'">
      <el-dialog
        title="office文件查看"
        fullscreen
        :visible.sync="dialogVisible"
        width="30%"
        custom-class="mouse__preview"
      >
        <iframe
          frameborder="0"
          :src="'https://view.officeapps.live.com/op/view.aspx?src=' + officeUrl"
          width="100%"
          height="100%"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    btnText: {
      type: String,
      default: '查看'
    },
    fileUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      type: '',
      officeUrl: ''
    }
  },
  created() {
    this.getType(this.fileUrl)
  },
  methods: {
    // 获取类型
    getType(url) {
      let URL = url.match(/[^/?]*\?+/g)[0] // 渠道url里 最后一个 / 与 ? 之间的值
      URL = URL.slice(0, URL.length - 1)
      const type = URL.match(/\.[^\.]+$/g)[0].slice(1)
      const pattImg = new RegExp(/(jpg|png|jpeg)/g)
      const pattOffice = new RegExp(/(docx|xlsx|pptx)/g)
      if (pattImg.test(type)) {
        this.type = 'img'
      } else if (pattOffice.test(type)) {
        this.type = 'office'
        this.officeUrl = encodeURIComponent(this.fileUrl)
      } else {
        this.type = type
      }
      console.log('type==', this.type)
    }
  }
}
</script>

<style lang="scss">
  .mouse__preview{
    .el-dialog__body{
      height: calc( 100% - 54px);
    }
  }
</style>
