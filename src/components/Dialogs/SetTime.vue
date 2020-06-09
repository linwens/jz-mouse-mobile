<template>
  <div>
    <el-button :type="type" :size="size" @click="setTimeDialog = true">{{ btnText }}</el-button>
    <!-- 设置时间弹窗 -->
    <el-dialog
      title="设置时间"
      :visible.sync="setTimeDialog"
      append-to-body
      width="500px"
    >
      <div>
        <el-form ref="setTimeForm" :model="setTimeForm" label-position="left" size="mini">
          <el-form-item
            label="类型:"
            label-width="80px"
            class="mb8"
            prop="tags"
          >
            <el-select
              v-model="setTimeForm.operationType"
              placeholder="请选择类型"
              size="small"
              class="w250"
            >
              <el-option label="检测时间" :value="0" />
              <el-option label="处理时间" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="时间:"
            label-width="80px"
            class="w250"
          >
            <div class="df s-jcsb w250">
              <el-date-picker
                v-model="setTimeForm.time"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="timestamp"
                placeholder="选择日期时间"
              />
              <!-- <el-form-item prop="handleDate" class="mb0">
                <el-date-picker
                  v-model="setTimeForm.handleDate"
                  class="mb0"
                  style="width: 133px;"
                  size="small"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
              <el-form-item prop="handleTime" class="mb0">
                <el-time-picker
                  v-model="setTimeForm.handleTime"
                  style="width: 113px;"
                  size="small"
                  placeholder="选择时间"
                />
              </el-form-item> -->
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="setTimeDialog = false">取 消</el-button>
        <el-button type="primary" size="small" @click="setTime()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { setExptTime } from '@/api/experiment'

export default {
  name: 'SetTime',
  props: {
    id: {
      type: Number,
      default: null
    },
    btnText: {
      type: String,
      default: '设置时间'
    },
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      // 设置时间
      setTimeDialog: false,
      setTimeForm: {
        operationType: null,
        time: null
      }
    }
  },
  methods: {
    setTime() {
      this.$refs['setTimeForm'].validate((valid) => {
        if (valid) {
          this.setTimeDialog = false
          // 提交成功后触发done
          const { id: userId } = this.$store.getters.info
          setExptTime({
            createTime: Math.floor(+new Date() / 1000),
            experimentId: this.id,
            operationId: userId,
            remindState: 0,
            operationType: this.setTimeForm.operationType,
            time: Math.floor(this.setTimeForm.time / 1000)
          }).then((res) => {
            this.$message.success('设置时间成功')
            if (res.data) {
              this.$emit('done', {
                type: this.setTimeForm.operationType,
                time: Math.floor(this.setTimeForm.time / 1000)
              })
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>
