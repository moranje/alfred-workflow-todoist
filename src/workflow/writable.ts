import { Notification } from '@/workflow';
import compose from 'stampit';

/**
 * A way to autmatically format stdout input
 *
 * @exports Writable
 */
export const Writable = compose({
  /**
   * @constructor
   */
  init(this: workflow.Writable) {
    // Private methods
    this.object = (arg: Object) => JSON.stringify(arg)
  },

  methods: {
    /**
     * Write to stdout.
     *
     * @param {any[]} params
     */
    write(this: workflow.Writable, ...params: any[]) {
      const args: any[] = params.length > 0 ? params : [this]

      const mapped: string[] = args.map((arg: any) => {
        // @ts-ignore: should implement a real AlfreError
        if (arg instanceof Error) return Notification(arg).write()

        if (typeof arg === 'object') return this.object(arg)

        if (arg == null) return ''

        return arg
      })

      return console.log.apply(null, mapped)
    }
  }
})
