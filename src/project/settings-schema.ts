/**
 * @hidden
 */
export interface Schema {
  [index: string]: string | string[] | null | undefined | Properties
  $schema: string
  title: string
  description: string
  type: string
  properties: Properties
  required?: (string)[] | null
}

/**
 * @hidden
 */
export interface Properties {
  [index: string]: Token | Language | MaxItems | Uuid | AnonymousStatistics
  token: Token
  language: Language
  max_items: MaxItems
  uuid: Uuid
  anonymous_statistics: AnonymousStatistics
}

/**
 * @hidden
 */
export interface Token {
  description: string
  explanation: string
  type: string
  pattern: string
}

/**
 * @hidden
 */
export interface Language {
  description: string
  explanation: string
  type: string
  enum?: (string)[] | null
}

/**
 * @hidden
 */
export interface MaxItems {
  description: string
  explanation: string
  type: string
  minimum: number
  maximum: number
}

/**
 * @hidden
 */
export interface Uuid {
  description: string
  explanation: string
  type: string
  pattern: string
  format: string
}

/**
 * @hidden
 */
export interface AnonymousStatistics {
  description: string
  explanation: string
  type: string
}

export const Schema: Schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Settings',
  description: 'Alfred Workflow Todoist settings',
  type: 'object',
  properties: {
    token: {
      description: 'A todoist API token',
      explanation: 'Must be a valid todoist token (40 chars and only 0-9 and a-f)',
      type: 'string',
      pattern: '(?:^[0-9a-fA-F]{40}$)|^$'
    },

    language: {
      description: 'A todoist language',
      explanation: 'Must be one of: en, da, pl, zh, ko, de, pt, ja, it, fr, sv, ru, es, nl',
      type: 'string',
      enum: ['en', 'da', 'pl', 'zh', 'ko', 'de', 'pt', 'ja', 'it', 'fr', 'sv', 'ru', 'es', 'nl']
    },

    max_items: {
      description: 'The number of list items shown',
      explanation: 'Must be a number between 1 and 20',
      type: 'number',
      minimum: 1,
      maximum: 20
    },

    cache_timeout: {
      description: 'Time until next cache refresh (seconds)',
      explanation: 'Must be a number between 1 and 604800',
      type: 'number',
      minimum: 1,
      maximum: 604800
    },

    uuid: {
      description: 'A unique identifier',
      explanation: 'This should be left unchanged',
      type: 'string',
      pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
      format: 'uuid'
    },

    anonymous_statistics: {
      description: 'Usage information',
      explanation: 'Can either be true of false',
      type: 'boolean'
    }
  },
  required: ['token', 'language', 'max_items', 'uuid', 'anonymous_statistics']
}
