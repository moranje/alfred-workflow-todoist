// @ts-ignore: no declaration for v4 yet
import md5 from 'md5'
import compose from 'stampit'

export interface Writable {
  write: (...params: any[]) => void
  error: (arg: Error) => string
  object: (arg: Object) => string
}

export interface Item {
  uid: string
  arg: string
  type: string
  valid: boolean
  autocomplete: string
  title: string
  subtitle: string
  icon: { path: string }
}

export interface List extends Writable {
  items: Item[]
}

export interface View {
  upperCase: (text: string) => string
  lowerCase: (text: string) => string
  sentenceCase: (text: string) => string
  when: (condition: any, truthy: string, falsy: string) => string
  ws: (quantity: number) => string
  template: (
    fn: (
      {
        upperCase,
        lowerCase,
        sentenceCase,
        ws,
        when
      }: {
        upperCase: (text: string) => string
        lowerCase: (text: string) => string
        sentenceCase: (text: string) => string
        when: (condition: any, truthy: string, falsy: string) => string
        ws: (quantity: number) => string
      }
    ) => string
  ) => string
}

export const Writable = compose({
  init(this: Writable) {
    // Private methods
    this.error = (arg: Error) => {
      let type = arg.name.charAt(0).toUpperCase() + arg.name.substring(1) || 'Error'
      return `${type}: ${arg.message}\nStack: ${arg.stack}`
    }
    this.object = (arg: Object) => JSON.stringify(arg)
  },

  methods: {
    write(this: Writable, ...params: any[]) {
      const args: any[] = params.length > 0 ? params : [this]

      const mapped: string[] = args.map((arg: any) => {
        if (arg instanceof Error) return this.error(arg)

        if (typeof arg === 'object') return this.object(arg)

        if (arg == null) return ''

        return arg
      })

      return console.log.apply(null, mapped)
    }
  }
})

export const Item = compose(
  Writable,
  {
    init(
      this: Item,
      {
        uid = '',
        arg = '',
        type = 'default',
        valid = true,
        autocomplete = '',
        title = '',
        subtitle = '',
        icon = { path: 'icon.png' }
      }
    ) {
      Object.assign(this, {
        arg: typeof 'object' ? JSON.stringify(arg) : arg,
        type,
        valid,
        autocomplete,
        title,
        subtitle,
        icon
      })

      this.uid = uid || md5(this.title + this.subtitle)
    }
  }
)

export const List = compose(
  Writable,
  {
    props: {
      items: []
    },

    init(this: List, { items = [] }: { items: any }) {
      this.items = items || []
    }
  }
)

export const View = compose({
  init(this: View) {
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
    template(this: View, fn: () => string) {
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

export const Query = compose({
  // init() {},

  methods: {}
})

export const Notification = compose(Writable)
