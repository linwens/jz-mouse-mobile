
export const calcWeek = {
  methods: {
    // 计算周龄
    calcWeek(birthDate) {
      console.log('计算周龄==222=', birthDate)
      if (!birthDate) {
        return '0周0天'
      }
      const duration = +new Date() - birthDate * 1000
      const weeks = Math.floor(duration / 1000 / 60 / 60 / 24 / 7)
      const days = Math.floor(duration / 1000 / 60 / 60 / 24 % 7) + 1 // 当天出生算一天

      return `${weeks}周${days}天`
    }
  }
}
