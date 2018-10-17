import { CACHE_PATH, SETTINGS_PATH } from '@/project/references';

let settings = {}
let cache = []
try {
  settings = require(SETTINGS_PATH)
  cache = require(CACHE_PATH)
} catch (err) {
  // Do nothing
}

export let files = {
  settings,
  cache
}
