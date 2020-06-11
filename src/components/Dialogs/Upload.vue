<template>
  <div>
    <span v-if="btnText" class="txt-btn--green" @click="dialogVisible = true">{{ btnText }}</span>
    <svg-icon v-else icon-class="upload" class="cp" @click="dialogVisible = true" />
    <!-- 上传 -->
    <van-popup
      v-model="dialogVisible"
      get-container="body"
      position="bottom"
    >
      <van-uploader
        v-model="fileList"
        multiple
        max-count="5"
      />
    </van-popup>
    <!-- <el-dialog
      title="上传文件"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="actionUrl"
        :headers="{
          Authorization: getToken()
        }"
        name="files"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="5"
        :file-list="fileList"
        :auto-upload="false"
        :on-exceed="handleExceed"
        :on-success="handleSuccess"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">可上传jpg/png、pdf、Excel、Word文件</div>
      </el-upload>
    </el-dialog> -->
  </div>
</template>

<script>
import { Button, Popup, Toast, Uploader, Dialog } from 'vant'
import { getToken } from '@/utils/auth'

export default {
  name: 'UploadFile',
  components: {
    'van-uploader': Uploader,
    'van-popup': Popup
  },
  props: {
    id: {
      type: Number,
      default: null
    },
    type: {
      type: String,
      default: ''
    },
    btnText: {
      type: String,
      default: ''
    },
    bizType: { // 上传文件对应的业务类型
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      // 根据是否传了id 走不同的上传接口
      actionUrl: this.id ? `${process.env.VUE_APP_BASE_API}/sysfile/uploads/${this.bizType}/${this.id}` : `${process.env.VUE_APP_BASE_API}/sysfile/uploadFiles`,
      fileList: [],
      cacheUrl: []
    }
  },
  created() {
    // this.getParams()
  },
  methods: {
    submitUpload() { // 上传文件
      this.$refs.upload.submit()
    },
    getToken,
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      Toast.fail(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleSuccess(response, file, fileList) {
      Toast.clear()
      Toast.success('文件上传成功')
      console.log('上传成功返回...', this.id, response)
      console.log(response, file, fileList)
      if (!this.id && response.data.length > 0) {
        console.log(this.cacheUrl, fileList)
        // 因为设计稿只有一个上传按钮，所以没法做手动上传，就无法一次性传多张图，只能多次传单张图，为了确保done调用获得的data是全部
        if (response.data.length <= fileList.length) {
          this.cacheUrl.push(response.data[0])
        }
        if (this.cacheUrl.length === fileList.length) {
          console.log('触发done')
          this.$emit('done', this.cacheUrl, fileList)
          this.dialogVisible = false
          this.fileList = []
        }
      }
      if (this.id) {
        this.dialogVisible = false
        this.fileList = []
      }
    },
    beforeRemove(file, fileList) {
      return Dialog.confirm({
        message: `确定移除 ${file.name}？`,
      }).then(() => {
        return true
      }).catch(() => {
        return false
      })
    }
  }
}
</script>

<style lang="scss">

</style>
