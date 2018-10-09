import compose from 'stampit'

export const Notification = compose({
  init(args: any) {
    Object.assign(this, args)
  },

  methods: {
    write() {
      console.log(this)
    }
  }
})
