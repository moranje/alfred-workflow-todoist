import { Notification } from '@/workflow'
import compose from 'stampit'

/** @hidden */
export const Writable: workflow.WritableFactory = compose({
  /**
   * @constructor
   */
  init(this: workflow.WritableInstance) {
    // Private methods
    this.object = (arg: Object) => JSON.stringify(arg)
  },

  methods: {
    /**
     * Write to stdout.
     *
     * @param {any[]} params
     */
    write(this: workflow.WritableInstance, ...params: any[]) {
      const args: any[] = params.length > 0 ? params : [this]

      const mapped: string[] = args.map((arg: any) => {
        if (arg instanceof Error) return Notification(arg).write()

        if (typeof arg === 'object') return this.object(arg)

        if (arg == null) return ''

        return arg
      })

      return console.log(...mapped)
    }
  }
})
