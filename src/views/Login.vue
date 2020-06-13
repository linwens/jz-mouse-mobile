<template>
  <div class="login-container">
    <div class="title-container">
      <h3 class="title">Login Form</h3>
    </div>

    <div class="tips">
      <span style="margin-right:20px;">用户名: admin / editor</span>
      <span> 密码: 随意</span>
    </div>

    <van-form @submit="handleLogin">
      <van-field
        v-model="loginForm.username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, validator: validateUsername, message: '请填写用户名' }]"
      />
      <van-field
        v-model="loginForm.password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, validator: validatePassword, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button :loading="loading" round block type="info" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import {
  Button,
  Form,
  Field
} from 'vant'

export default {
  name: 'Login',
  components: {
    'van-button': Button,
    'van-form': Form,
    'van-field': Field
  },
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // 校验用户名
    validateUsername(value) {
      return validUsername(value)
    },
    // 校验密码
    validatePassword(value) {
      return value.length >= 6
    },
    handleLogin() {
      this.loading = true
      this.$store.dispatch('user/login', this.loginForm).then(() => {
        this.$router.push({ path: this.redirect || '/' })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>
