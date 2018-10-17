import compose from 'stampit';

export const View = compose({
  /**
   * @constructor
   */
  init(this: workflow.View) {
    this.upperCase = (text: string) => text.toUpperCase()

    this.lowerCase = (text: string) => text.toLowerCase()

    this.sentenceCase = (text: string) => text.charAt(0).toUpperCase() + text.substring(1)

    this.when = (condition: any, truthy: string, falsy: string) => {
      if (typeof condition === 'string' && !condition.trim()) return falsy

      if (condition) return truthy

      return falsy
    }

    this.ws = (count: number = 1) => {
      return ' '.repeat(count)
    }
  },

  methods: {
    /**
     * Creates a string template
     *
     * @param {Function} fn A function which has access to bound template
     *    helpers
     * @returns string
     */
    template(this: workflow.View, fn: () => string) {
      return fn.call(this, {
        upperCase: this.upperCase,
        lowerCase: this.lowerCase,
        sentenceCase: this.sentenceCase,
        ws: this.ws,
        when: this.when
      })
    }
  }
})
