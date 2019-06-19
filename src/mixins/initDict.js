import { getDictDetail } from '@/api/dict'

export default {
  data() {
    return {
      dicts: []
    }
  },
  methods: {
    async getDict(name) {
      return new Promise((resolve, reject) => {
        const params = new URLSearchParams()
        params.append('name', name)
        getDictDetail(params).then(res => {
          console.log(res)
          this.dicts = res.data.data
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
