@preprocessor typescript

@{%import lexer from '@/lib/todoist/lexer';%}

# Use moo tokenizer
@lexer lexer

Query ->
  Content (Element Content):* {%
    ([first, rest]) => {
      return [first, ...[].concat(...rest)].filter(el => el);
    }
  %}

Element ->
  Project {% id %}
  | Label {% id %}
  | Priority {% id %}
  | Date {% id %}
  | Section {% id %}
  | Filter {% id %}

Project ->
  %pound %name %braceOpen %tid %braceClose {%
    ([_, name, __, id]) => {
      return {
        name: name.value,
        type: 'project',
        id: +id.value
      };
    }
  %}
  | %pound %name %braceOpen %tid {%
    ([_, name, __, id]) => {
      return {
        name: name.value,
        type: 'project',
        id: +id.value
      };
    }
  %}
  | %pound %name %braceOpen {%
    ([_, name]) => {
      return {
        name: name.value,
        type: 'project',
        id: null
      };
    }
  %}
  | %pound %name {%
    ([_, name]) => {
      return {
        name: name.value,
        type: 'project',
        id: null
      };
    }
  %}
  | %pound %bracketOpen %name %bracketClose %braceOpen %tid %braceClose {%
    ([_, __, name, ___, id]) => {
      return {
        name: name.value,
        type: 'project',
        id: +id.value
      };
    }
  %}
  | %pound %bracketOpen %name %bracketClose %braceOpen %tid {%
    ([_, __, name, ___, id]) => {
      return {
        name: name.value,
        type: 'project',
        id: +id.value
      };
    }
  %}
  | %pound %bracketOpen %name %bracketClose %braceOpen {%
    ([_, __, name]) => {
      return {
        name: name.value,
        type: 'project',
        id: null
      };
    }
  %}
  | %pound %bracketOpen %name %bracketClose {%
    ([_, __, name]) => {
      return {
        name: name.value,
        type: 'project',
        id: null
      };
    }
  %}
  | %pound %bracketOpen %name {%
    ([_, __, name]) => {
      return {
        name: name.value,
        type: 'project',
        id: null
      };
    }
  %}
  | %pound %bracketOpen {%
    ([_, __]) => {
      return {
        name: '',
        type: 'project',
        id: null
      };
    }
  %}
  | %pound {%
    () => {
      return {
        name: '',
        type: 'project',
        id: null
      };
    }
  %}

Label ->
  %at %name %braceOpen %tid %braceClose {%
    ([_, name, __, id]) => {
      return {
        name: name.value,
        type: 'label',
        id: +id.value
      };
    }
  %}
  | %at %name %braceOpen %tid {%
    ([_, name, __, id]) => {
      return {
        name: name.value,
        type: 'label',
        id: +id.value
      };
    }
  %}
  | %at %name %braceOpen {%
    ([_, name]) => {
      return {
        name: name.value,
        type: 'label',
        id: null
      };
    }
  %}
  | %at %name {%
    ([_, name]) => {
      return {
        name: name.value,
        type: 'label',
        id: null
      };
    }
  %}
  | %at {%
    () => {
      return {
        name: '',
        type: 'label',
        id: null
      };
    }
  %}

Priority ->
  %priority {%
    ([priority]) => {
      return {
        priority: +priority.value.substring(1),
        type: 'priority'
      };
    }
  %}
  | %doubleExclamation %number {%
    ([_, number]) => {
      return {
        priority: +number.value,
        type: 'priority'
      };
    }
  %}
  | %doubleExclamation {%
    () => {
      return {
        priority: undefined,
        type: 'priority'
      };
    }
  %}

Section ->
  %colon %name %braceOpen %tid %braceClose {%
    ([_, name, __, id]) => {
      return {
        name: name.value,
        type: 'section',
        id: +id.value
      };
    }
  %}
  | %colon %name %braceOpen %tid {%
    ([_, name, __, id]) => {
      return {
        name: name.value,
        type: 'section',
        id: +id.value
      };
    }
  %}
  | %colon %name %braceOpen {%
    ([_, name]) => {
      return {
        name: name.value,
        type: 'section',
        id: null
      };
    }
  %}
  | %colon %name {%
    ([_, name]) => {
      return {
        name: name.value,
        type: 'section',
        id: null
      };
    }
  %}
  | %colon %bracketOpen %name %bracketClose %braceOpen %tid %braceClose {%
    ([_, __, name, ___, id]) => {
      return {
        name: name.value,
        type: 'section',
        id: +id.value
      };
    }
  %}
  | %colon %bracketOpen %name %bracketClose %braceOpen %tid {%
    ([_, __, name, ___, id]) => {
      return {
        name: name.value,
        type: 'section',
        id: +id.value
      };
    }
  %}
  | %colon %bracketOpen %name %bracketClose %braceOpen {%
    ([_, __, name]) => {
      return {
        name: name.value,
        type: 'section',
        id: null
      };
    }
  %}
  | %colon %bracketOpen %name %bracketClose {%
    ([_, __, name]) => {
      return {
        name: name.value,
        type: 'section',
        id: null
      };
    }
  %}
  | %colon %bracketOpen %name {%
    ([_, __, name]) => {
      return {
        name: name.value,
        type: 'section',
        id: null
      };
    }
  %}
  | %colon %bracketOpen {%
    ([_, __]) => {
      return {
        name: '',
        type: 'section',
        id: null
      };
    }
  %}
  | %colon {%
    () => {
      return {
        name: '',
        type: 'section',
        id: null
      };
    }
  %}

Date ->
  %comma %date {%
    ([_, date]) => {
      return {
        value: date.value.trim(),
        type: 'date'
      };
    }
  %}
  | %comma {%
    () => {
      return {
        value: '',
        type: 'date'
      };
    }
  %}

Filter ->
  %filterStart %filter %filterEnd {%
    ([_, filter]) => {
      return {
        value: filter.value,
        type: 'filter'
      }
    }
  %}
  | %filterStart %filter {%
    ([_, filter]) => {
      return {
        value: filter.value,
        type: 'incomplete-filter'
      }
    }
  %}
  | %filterStart %filterEnd {%
    () => {
      return {
        value: '',
        type: 'filter'
      }
    }
  %}
  | %filterStart {%
    () => {
      return {
        value: '',
        type: 'incomplete-filter'
      }
    }
  %}

Content ->
  ContentPartial:* {%
    ([text]) => {
      if (text[0] == null) {
        return null;
      }

      return {
        value: text.map((partial: any) => partial.value).join(''),
        type: 'content'
      }
    }
  %}

ContentPartial ->
  %content {% id %}
