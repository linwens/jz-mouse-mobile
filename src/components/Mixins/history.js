
import { mapGetters } from 'vuex'

export const inputRemenber = {
  computed: {
    ...mapGetters([
      'inputHistory'
    ])
  },
  methods: {
    history(key) {
      const rslt = this.inputHistory[key]
      return function(queryString, cb) {
        cb(rslt)
      }
    }
  }
}
