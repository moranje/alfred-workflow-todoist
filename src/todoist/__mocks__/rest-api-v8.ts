import compose from 'stampit'

export const TaskAdapter = compose({
  methods: {
    init(args: any) {
      Object.assign(this, args)
    }
  }
})

export const ProjectAdapter = compose({
  methods: {
    init(args: any) {
      Object.assign(this, args)
    }
  }
})

export const LabelAdapter = compose({
  methods: {
    init(args: any) {
      Object.assign(this, args)
    }
  }
})
