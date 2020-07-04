<template>
  <div class="mouse-cage pos-r" :class="{'isChoiced': cageId == choosedCage}" @click="disabled ? null : chooseCage()">
    <div class="mouse-cage__header df s-jcsa s-aic">
      <div class="mouse-cage__number df s-jcc">
        <p>{{ allData.cageNo }}<i>笼位</i></p>
        <p>{{ allData.roomNo }}<i>房间</i></p>
        <p>{{ allData.shelvesNo }}<i>架号</i></p>
      </div>
      <div class="mouse-cage__man">
        负责人
        <van-button size="mini" @click="shift ? chageMan() : null">
          {{ allData.operatorName }}
          <svg-icon v-if="shift" icon-class="shift" class="cl-green" />
        </van-button>
      </div>
      <div class="mouse-cage__status">
        <span :class="{'isIdle': isIdle}">闲置</span>
        <span :class="{'isExpt': isExpt}">实验</span>
        <span :class="{'isBreed': isBreed}">繁育</span>
      </div>
    </div>
    <div class="mouse-cage__list df s-jcfs">
      <div class="list__title df s-fdc s-aic s-jcfs">
        <div class="list__title--female df s-fdc s-aic s-jcc">
          <svg-icon icon-class="female" class="fs30 mb4" />
          <span class="fs12">{{ femaleSum.length }}只</span>
        </div>
        <div class="list__title--male df s-fdc s-aic s-jcc">
          <svg-icon icon-class="male" class="fs30 mb4" />
          <span class="fs12">{{ maleSum.length }}只</span>
        </div>
      </div>
      <div class="list__content">
        <van-checkbox-group v-model="checkList" @change="taggleMouse">
          <div v-if="femaleSum.length > 0" class="list__content--female df s-jcfs s-aic ofh">
            <div
              v-for="item in femaleSum"
              :key="item.miceInfoId"
              class="mouse__item ta-c"
              :class="{'isChoiced': (item.miceInfoId == curMouseId)}"
            >
              <div class="pos-r">
                <van-checkbox shape="square" checked-color="#00CB7C" icon-size="12px" :disabled="checkBoxStatus(item.miceStatus, item.miceInfoId)" class="mouse__checkbox" :name="item" />
                <div @click.stop="taggle(item.miceInfoId)">
                  <svg-icon icon-class="mouse" class="fs40" :style="{ 'color': item.color }" />
                  <p>{{ item.geneName }}</p>
                  <span class="item__miceNo dib">{{ item.miceNo }}</span>
                  <i class="pos-a item__sign mouse__item--female">{{ item.sign }}</i>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="list__content--female" />
          <div v-if="maleSum.length > 0" class="list__content--male df s-jcfs s-aic ofh">
            <div
              v-for="item in maleSum"
              :key="item.miceInfoId"
              class="mouse__item ta-c"
              :class="{'isChoiced': (item.miceInfoId == curMouseId)}"
            >
              <div class="pos-r">
                <van-checkbox shape="square" checked-color="#00CB7C" icon-size="12px" :disabled="checkBoxStatus(item.miceStatus, item.miceInfoId)" class="mouse__checkbox" :name="item" />
                <div @click.stop="taggle(item.miceInfoId)">
                  <svg-icon icon-class="mouse" class="fs40" :style="{ 'color': item.color }" />
                  <p>{{ item.geneName }}</p>
                  <span class="item__miceNo dib">{{ item.miceNo }}</span>
                  <i class="pos-a item__sign mouse__item--male">{{ item.sign }}</i>
                </div>
              </div>
            </div>
          </div>
        </van-checkbox-group>
      </div>
    </div>
    <!-- 选择笼位时的蒙版 -->
    <div v-if="isChoosingCage" class="mouse-cage__mark pos-a" />
    <!-- 更换负责人弹窗 -->
    <van-dialog
      v-model="manDialog"
      title="更换负责人"
      get-container="body"
      show-cancel-button
      confirm-button-text="确定"
      confirm-button-color="#FF6358"
      @confirm="changeMan"
    >
      <p class="cl-black fs14" style="padding: 8px 14px;">当前负责人: {{ allData.operatorName }}</p>
      <van-form ref="mansForm" class="mb20">
        <van-select
          :cur-val-num.sync="mansForm.userId"
          btn-text="更换为"
          :columns="persons"
          key-text="userName"
          val-text="userId"
          :placeholder.sync="mansForm.placeholder"
        />
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import { getMouseInfo, getMouseExpInfo } from '@/api/mouse'
import { getUsers } from '@/api/home'
import { changeOperator } from '@/api/cmn'
import VanSelect from '@/components/Form/VanSelect.vue'
import {
  Button,
  Form,
  Checkbox,
  CheckboxGroup,
  Dialog,
  Toast
} from 'vant'

export default {
  name: 'MouseCage',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-checkbox': Checkbox,
    'van-checkbox-group': CheckboxGroup,
    [Dialog.Component.name]: Dialog.Component,
    VanSelect
  },
  props: {
    // 需要的状态needType
    needType: {
      type: String,
      default: ''
    },
    // 鼠笼所需所有信息
    allData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 鼠笼是否可点击
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否可切换负责人
    shift: {
      type: Boolean,
      default: true
    },
    // 是否在移笼
    isActive: {
      type: Boolean,
      default: false
    },
    // 是否在选择笼位
    isChoosingCage: {
      type: Boolean,
      default: false
    },
    // 鼠笼id
    cageId: {
      type: Number,
      default: 0
    },
    // 当前选中的鼠笼id
    choosedCage: {
      type: Number,
      default: 0
    },
    // 选中的小鼠
    choicedList: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 当前选中小鼠的id
    curMouseId: {
      type: Number,
      default: 0
    },
    // 选中的小鼠信息
    curMouse: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 选中的小鼠实验信息
    curMouseExpt: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 已经被选了的老鼠,不可选
    cantChoiceMouses: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      curId: '',
      // 更换负责人
      manDialog: false,
      mansForm: {
        placeholder: '请输入新的负责人',
        userId: null
      },
      persons: [], // 负责人选择项
      // 鼠笼checkbox
      checkList: [],
      // 选择笼位
      choiceCage: false
    }
  },
  computed: {
    isIdle() {
      const mouseArr = this.allData.miceInfoByMiceCageQueryVO
      const isIdle = mouseArr.filter((el) => {
        return el.miceStatus === 1
      })
      return isIdle.length > 0
    },
    isExpt() {
      const mouseArr = this.allData.miceInfoByMiceCageQueryVO
      const isExpt = mouseArr.filter((el) => {
        return el.miceStatus === 3
      })
      return isExpt.length > 0
    },
    isBreed() {
      const mouseArr = this.allData.miceInfoByMiceCageQueryVO
      const isBreed = mouseArr.filter((el) => {
        return el.miceStatus === 2
      })
      return isBreed.length > 0
    },
    maleSum() { // 雄鼠数量
      const mouseArr = this.allData.miceInfoByMiceCageQueryVO
      const males = mouseArr.filter((el) => {
        return el.gender === 0
      })
      return males
    },
    femaleSum() { // 雌鼠数量
      const mouseArr = this.allData.miceInfoByMiceCageQueryVO
      const females = mouseArr.filter((el) => {
        return el.gender === 1
      })
      return females
    }
  },
  watch: {
    'choicedList.mouses'(n, o) {
      if (!n) { // 选中小鼠项情况，checkList也清空
        this.$set(this, 'checkList', [])
      } else {
        this.$set(this, 'checkList', n)
      }
    }
  },
  methods: {
    // 获取负责人列表
    getPersons() {
      getUsers().then((res) => {
        this.$set(this, 'persons', res.data)
      })
    },
    // 设置当前小鼠是否可选
    checkBoxStatus(status, id) {
      let noWay = false
      if (status === 2 && this.needType === 'noBreed') {
        noWay = true
      }
      if (status === 3 && this.needType === 'noExpt') {
        noWay = true
      }

      return !this.isActive || noWay || this.cantChoiceMouses.indexOf(String(id)) > -1
    },
    taggle(id) {
      this.curId = this.curMouseId
      if (this.curId === id) { // 再次点击取消选框
        this.curId = null
        this.$emit('update:curMouseId', null)
      } else {
        this.curId = id
        this.$emit('update:curMouseId', id)

        getMouseInfo(this.curId).then((res) => {
          console.log(res)
          this.$emit('update:curMouse', res.data)
        })
        getMouseExpInfo(this.curId).then((res) => {
          console.log('getMouseExpInfo', res)
          this.$emit('update:curMouseExpt', res.data[0] || {}) // 取第一条数据
        })
      }
      console.log(`===22==${id}||||${this.curId}|||${this.curMouseId}`)
    },
    // 切换负责人
    chageMan() {
      this.getPersons()
      this.manDialog = true
    },
    changeMan() {
      changeOperator({
        cageId: this.cageId,
        userId: this.mansForm.userId
      }).then((res) => {
        const newData = JSON.parse(JSON.stringify(this.allData))
        const curOperator = this.persons.filter((el) => {
          return el.userId === this.mansForm.userId
        })
        newData.operatorName = curOperator.userName
        newData.operator = curOperator.userId
        this.$emit('update:allData', newData)
        Toast.success('切换负责人成功')
        this.manDialog = false
        this.$refs['mansForm'].resetValidation()
        this.$emit('refresh')
      })
    },
    // 多选框选中小鼠
    taggleMouse(val) {
      // 避免一个笼子两个异性鼠直接选中导致的bug
      if (val === this.choicedList.mouses) return
      console.log('cage-11---', this.checkList)
      const newOne = this.checkList[this.checkList.length - 1]
      // 如果是添加繁育组时选择实验组小鼠
      if (this.needType === 'noBreed' && newOne && newOne.miceStatus === 3) {
        const _self = this
        Dialog.confirm({
          title: '警告',
          message: '该小鼠处于实验中，添加进繁育列表后将会从实验组中移除，是否继续操作？',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        }).catch(function() {
          _self.checkList.pop()
        })
      }
      console.log('cage-22---', this.checkList)
      this.$emit('update:choicedList', {
        cid: this.cageId,
        mouses: this.checkList
      })
    },
    // 选择鼠笼
    chooseCage() {
      if (this.cageId !== this.choosedCage) {
        this.$emit('update:choosedCage', this.cageId)
        // 切换鼠笼的时候，取消别的鼠笼的选中小鼠
        const mouseArr = this.allData.miceInfoByMiceCageQueryVO
        const ids = mouseArr.map((el) => {
          return el.miceInfoId
        })
        console.log(this.curMouseId)
        if (ids.indexOf(this.curMouseId) === -1) {
          this.curId = null
          this.$emit('update:curMouseId', null)
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .mouse-cage {
    width: 100%;
    height: 234px;
    border: 2px solid #D6D6D6;
    margin-bottom: 16px;

    &.isChoiced {
      border-color: #00CB7C;
      border-width: 2px;
    }

    // &+&{
    //   margin-left: 16px;
    // }

    &__header {
      height: 48px;
      background: #F0F0F0;
      border-bottom: 1px solid #D6D6D6;
      font-size: 14px;
      color: #333;
    }
    &__number {
      > p {
        margin-right: 4px;
        text-align: center;
        font-weight: bold;
        font-size: 12px;
      }
      > p > i {
        display: block;
        color: #666;
        font-weight: normal;
      }
    }

    &__list {
      height: calc( 100% - 48px );
    }

    &__mark {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.1);
      z-index: 2;
      border-width: 2px;
      border-style: solid;
      border-color: rgba(0, 0, 0, 0.1);

      &.isChoiced {
        border-color: #00CB7C;
      }
    }

    .list__title {
      height: 100%;
      &--female, &--male {
        width: 56px;
        height: 50%;
      }
    }

    .list__content {
      width: calc( 100% - 60px );
      padding: 10px 0;
      .van-checkbox-group {
        height: 100%;
      }
      &--female, &--male {
        height: 50%;
        min-height: 50%;
        overflow-x: auto;
      }
    }

    .mouse__item {
      width: 80px;
      height: 74px;
      padding: 0 13px;
      margin-right: 3px;
      box-sizing: border-box;
      border-width: 2px;
      border-style: solid;
      border-color: #fff;
      border-radius: 4px;
      font-size: 14px;
      color: #333;
      cursor: pointer;

      .mouse__checkbox {
        position: absolute;
        left: -12px;
        top: 1px;
      }

      .van-checkbox__label {
        display: none;
      }
      &.isChoiced {
        border-color: #00CB7C;
      }

      &--female {
        background-color: #9A68B4;
      }

      &--male {
        background-color: #58A2FB;
      }

      p {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      span.item__miceNo {
        width: 68px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        font-size: 12px;
        color: #999;
      }

      i.item__sign {
        top: 17px;
        right: -3px;
        width: 18px;
        height: 18px;
        line-height: 18px;
        border-radius: 10px;
        font-size: 12px;
        color: #fff;
      }
    }

    .fs40 {
      font-size: 40px;
    }

    &__status {
      span::before {
        content: '●';
        color: #D6D6D6
      }
    }
    .isIdle{
      &::before {
        content: '●';
        color: #F6AC2D
      }
    }
    .isExpt{
      &::before {
        content: '●';
        color: #58A2FB;
      }
    }
    .isBreed{
      &::before {
        content: '●';
        color: #00CB7C;
      }
    }
  }
</style>
