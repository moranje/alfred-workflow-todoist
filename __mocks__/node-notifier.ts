export default {
  notify(options: { open: string }, fn: any) {
    options.open = ''
    fn(null, options)
  },

  on(name: string, fn: any) {
    fn({}, { open: '' })
  }
}
