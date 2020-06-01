// 路由跳转
export const goPage = {
  methods: {
    goPage(r, obj) { // r 是路由json里的name,不是path
      this.$router.push({ name: r, params: obj })
    }
  }
}

// 路由跳转返回
export const goBack = {
  methods: {
    goBack() {
      this.$router.back()
    }
  }
}