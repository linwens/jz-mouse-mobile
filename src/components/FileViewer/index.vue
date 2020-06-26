<template>
  <div class="dib">
    <van-button class="mr10" round size="small" hairline color="#333" :plain="plain" :disabled="disabled" type="primary" @click="dialogVisible = true">{{ btnText }}</van-button>
    <van-image-preview v-if="type === 'img'" v-model="dialogVisible" :images="[fileUrl]" />
    <div v-if="type === 'pdf'">
      <van-dialog
        v-model="dialogVisible"
        title="pdf文件查看"
        get-container="body"
        confirm-button-text="确定"
        confirm-button-color="#FF6358"
      >
        <embed
          :src="fileUrl"
          style="width: 100%; height: 100%"
        >
      </van-dialog>
    </div>
    <!-- <div v-if="type === 'img'">
      <van-image-preview v-model="dialogVisible" :images="fileUrl" />
    </div> -->
    <div v-if="type === 'office'">
      <van-dialog
        v-model="dialogVisible"
        title="office文件查看"
        get-container="body"
        confirm-button-text="确定"
        confirm-button-color="#FF6358"
      >
        <iframe
          frameborder="0"
          :src="'https://view.officeapps.live.com/op/view.aspx?src=' + officeUrl"
          width="100%"
          height="100%"
        />
      </van-dialog>
    </div>
  </div>
</template>

<script>
import { Button, Dialog, ImagePreview } from 'vant'
export default {
  name: 'FileViewer',
  components: {
    'van-button': Button,
    [ImagePreview.Component.name]: ImagePreview.Component,
    [Dialog.Component.name]: Dialog.Component
  },
  props: {
    plain: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
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
