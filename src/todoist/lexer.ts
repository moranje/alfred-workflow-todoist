import moo from 'moo'
import escape from 'escape-string-regexp'

// Includes numbers, lowercase letters an titlecase letters
// Generaterd with: https://apps.timwhitlock.info/js/regex#
const ALL_SCRIPTS =
  '[0-9A-Za-zªµºÀ-ÖØ-öø-ƺƼ-ƿǄ-ʓʕ-ʯͰ-ͳͶ-ͷͻ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԣԱ-Ֆա-և٠-٩۰-۹߀-߉०-९০-৯੦-੯૦-૯୦-୯௦-௯౦-౯೦-೯൦-൯๐-๙໐-໙༠-༩၀-၉႐-႙Ⴀ-Ⴥ០-៩᠐-᠙᥆-᥏᧐-᧙᭐-᭙᮰-᮹᱀-᱉᱐-᱙ᴀ-ᴫᵢ-ᵷᵹ-ᶚḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℴℹℼ-ℿⅅ-ⅉⅎↃ-ↄⰀ-Ⱞⰰ-ⱞⱠ-Ɐⱱ-ⱼⲀ-ⳤⴀ-ⴥ꘠-꘩Ꙁ-ꙟꙢ-ꙭꚀ-ꚗꜢ-ꝯꝱ-ꞇꞋ-ꞌ꣐-꣙꤀-꤉꩐-꩙ﬀ-ﬆﬓ-ﬗ０-９Ａ-Ｚａ-ｚ]|\ud801[\udc00-\udc4f\udca0-\udca9]|\ud835[\udc00-\udc54\udc56-\udc9c\udc9e-\udc9f\udca2\udca5-\udca6\udca9-\udcac\udcae-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd1e-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd52-\udea5\udea8-\udec0\udec2-\udeda\udedc-\udefa\udefc-\udf14\udf16-\udf34\udf36-\udf4e\udf50-\udf6e\udf70-\udf88\udf8a-\udfa8\udfaa-\udfc2\udfc4-\udfcb\udfce-\udfff]'
const SEPARATORS = new RegExp(`(?:${ALL_SCRIPTS}|_|-)+`)
const WHITESPACE = new RegExp(`(?:${ALL_SCRIPTS}|_| |-)+`)

/** @hidden */
const lexer = moo.states({
  main: {
    // @ts-ignore: not yet in typescript definition
    content: moo.fallback,

    pound: { match: /#/, push: 'project' },
    at: { match: /@/, push: 'label' },
    doubleExclamation: { match: /!!/, push: 'priority' },
    plus: { match: /\+/, push: 'person' },
    comma: { match: /,/, push: 'date' },
    priority: /p[1-4]/
  },

  project: {
    open: { match: /\[/, next: 'projectWithSpaces' },
    name: { match: SEPARATORS, pop: 1 }
  },

  projectWithSpaces: {
    close: { match: /\]/, pop: 1 },
    name: WHITESPACE
  },

  label: {
    name: { match: SEPARATORS, pop: 1 }
  },

  priority: {
    number: { match: /[1-4]/, pop: 1 }
  },

  person: {
    name: { match: SEPARATORS, pop: 1 }
  },

  date: {
    date: { match: /.+/, pop: 1 }
  }
})

export default lexer
