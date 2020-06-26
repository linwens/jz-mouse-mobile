<template>
  <div>
    <span v-if="btnText" class="txt-btn--green" @click="dialogVisible = true">{{ btnText }}</span>
    <svg-icon v-else icon-class="upload" class="cp" @click="dialogVisible = true" />
    <!-- 上传 -->
    <van-popup
      v-model="dialogVisible"
      get-container="body"
      position="bottom"
      class="p10"
    >
      <van-uploader
        v-model="fileList"
        multiple
        :deletable="false"
        :max-size="3 * 1024 * 1024"
        :before-read="beforeRead"
        :after-read="afterRead"
        :before-delete="beforeDel"
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
import { Popup, Toast, Uploader, Dialog } from 'vant'
import { delFile, uploadFiles } from '@/api/cmn'
import { getToken } from '@/utils/auth'
import request from '@/utils/request'

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
      fileList: [],
      // cacheUrl: []
    }
  },
  created() {
    // this.getParams()
  },
  methods: {
    beforeRead(file) {
      console.log('beforeRead===', file)
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        Toast('请上传 jpg/png 格式图片')
        return false
      }
      return true
    },
    afterRead(file) {
      console.log('afterRead===', file)
      file.status = 'uploading'
      file.message = '上传中...'

      // 上传服务器
      const formData = new FormData()
      formData.append('files', file.file)

      request({
        url: `/sysfile/uploads/${this.bizType}/${this.id}`,
        method: 'POST',
        data: formData
      }).then((res) => {
        console.log('uploadFiles====', res)
        file.status = 'success'
        file.message = '上传成功'
        Toast('图片上传成功!')
      }).catch(function() {
        file.status = 'failed'
        file.message = '上传失败'
      }).finally((res) => {
        console.log('uploadFiles==finally==', res)
      })
    },
    beforeDel(file) {
      console.log('del===', file)
      Dialog.confirm({
        title: '警告',
        message: `是否确认删除当前图片 ${file.file.name}?`,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delFile(file.fileId)
      }).then(() => {
        Toast.success('删除成功')
      }).catch(function() {
      })
    }
  }
}
</script>

<style lang="scss">

</style>
