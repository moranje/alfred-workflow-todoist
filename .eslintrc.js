module.exports = {
  env: {
    es6: true,
    node: true,
    'jest/globals': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['simple-import-sort', 'jsdoc', 'security', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:jsdoc/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:security/recommended',
    'plugin:jest/all',
  ],
  settings: {
    jsdoc: {
      ignorePrivate: true,
    },
  },
  rules: {
    'no-warning-comments': [
      process.env.PRE_COMMIT ? 'error' : 'warn',
      {
        terms: ['todo', 'fixme'],
        location: 'start',
      },
    ],
    'simple-import-sort/sort': 'error',
    '@typescript-eslint/ban-ts-ignore': 'warn',
    camelcase: 'off',
    '@typescript-eslint/camelcase': [
      'error',
      {
        allow: [
          'project_id',
          'label_ids',
          'section_id',
          'due_string',
          'due_date',
          'due_datetime',
          'due_lang',
          'comment_count',
          'max_items',
          'cache_timeout',
          'anonymous_statistics',
          'filter_wrapper',
          'update_checks',
          'pre_releases',
          'log_level',
          'last_update',
        ],
      },
    ],
    '@typescript-eslint/member-ordering': [
      'warn',
      {
        default: [
          'signature',
          'private-static-field',
          'protected-static-field',
          'public-static-field',
          'private-instance-field',
          'protected-instance-field',
          'public-instance-field',
          'private-abstract-field',
          'protected-abstract-field',
          'public-abstract-field',
          'private-field',
          'protected-field',
          'public-field',
          'abstract-field',
          'static-field',
          'instance-field',
          'field',
          'constructor',
          'private-static-method',
          'protected-static-method',
          'public-static-method',
          'private-instance-method',
          'protected-instance-method',
          'public-instance-method',
          'private-abstract-method',
          'protected-abstract-method',
          'public-abstract-method',
          'private-method',
          'protected-method',
          'public-method',
          'abstract-method',
          'static-method',
          'instance-method',
          'method',
        ],
      },
    ],
    'jsdoc/check-alignment': 1,
    'jsdoc/check-examples': 0,
    'jsdoc/check-indentation': 1,
    'jsdoc/check-param-names': 0,
    'jsdoc/check-property-names': 1,
    'jsdoc/check-syntax': 1,
    'jsdoc/check-tag-names': 1,
    'jsdoc/check-types': 1,
    'jsdoc/check-values': 1,
    'jsdoc/newline-after-description': 1,
    'jsdoc/no-types': [
      1,
      {
        contexts: ['any'],
      },
    ],
    'jsdoc/no-undefined-types': 0,
    'jsdoc/require-description-complete-sentence': 1,
    'jsdoc/require-description': 1,
    'jsdoc/require-example': 0,
    'jsdoc/require-file-overview': 0,
    'jsdoc/require-hyphen-before-param-description': 0,
    'jsdoc/require-jsdoc': [
      1,
      {
        publicOnly: true,
      },
    ],
    'jsdoc/require-param-description': 1,
    'jsdoc/require-param-name': 1,
    'jsdoc/require-param-type': 0,
    'jsdoc/require-param': 1,
    'jsdoc/require-returns-check': 1,
    'jsdoc/require-returns-description': 1,
    'jsdoc/require-returns-type': 0,
    'jsdoc/require-returns': 1,
    'jsdoc/valid-types': 1,
    'eslint-comments/disable-enable-pair': 0,
  },
};