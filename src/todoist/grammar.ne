@preprocessor typescript

@{% import lexer from './lexer'; %}

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
  | Person {% id %}
  | Date {% id %}

Project ->
  %pound %name {%
    ([_, name]) => {
      return {
        name: name.value,
        type: 'project',
        toString() {
          return `${this.name}`;
        }
      };
    }
  %}
  | %pound %open %name %close {%
    ([_, __, name]) => {
      return {
        name: name.value,
        type: 'project',
        toString() {
          return `${this.name}`;
        }
      };
    }
  %}
  | %pound %open %name {%
    ([_, __, name]) => {
      return {
        name: name.value,
        type: 'project',
        toString() {
          return `${this.name}`;
        }
      };
    }
  %}
  | %pound %open {%
    ([_, __]) => {
      return {
        name: '',
        type: 'project',
        toString() {
          return `${this.name}`;
        }
      };
    }
  %}
  | %pound {%
    ([_]) => {
      return {
        name: '',
        type: 'project',
        toString() {
          return `${this.name}`;
        }
      };
    }
  %}

Label ->
   %at %name {%
    ([_, label]) => {
      return {
        name: label.value,
        type: 'label',
        toString() {
          return `${this.name}`;
        }
      };
    }
  %}
  | %at {%
    ([_]) => {
      return {
        name: '',
        type: 'label',
        toString() {
          return `${this.name}`;
        }
      };
    }
  %}

Priority ->
  %priority {%
    ([priority]) => {
      return {
        value: priority.value.substring(1),
        type: 'priority',
        toString() {
          return `${this.value}`;
        }
      };
    }
  %}
  | %doubleExclamation %number {%
    ([_, priority]) => {
      return {
        value: priority.value,
        type: 'priority',
        toString() {
          return `${this.value}`;
        }
      };
    }
  %}
  | %doubleExclamation {%
    ([_]) => {
      return {
        value: '4',
        type: 'priority',
        toString() {
          return `${this.value}`;
        }
      };
    }
  %}

Person ->
  %plus %name {%
    ([_, person]) => {
      return {
        name: person.value,
        type: 'person',
        toString() {
          return `${this.name}`;
        }
      };
    }
  %}
  | %plus {%
    ([_]) => {
      return {
        name: '',
        type: 'person',
        toString() {
          return `${this.name}`;
        }
      };
    }
  %}

Date ->
  %comma %date {%
    ([_, date]) => {
      return {
        value: date.value.trim(),
        type: 'date',
        toString() {
          return `${this.value}`;
        }
      };
    }
  %}
  | %comma {%
    ([_]) => {
      return {
        value: '',
        type: 'date',
        toString() {
          return `${this.value}`;
        }
      };
    }
  %}

Content ->
  ContentPartial:* {%
    ([text]) => {
      if (text[0] == null) {
        return null;
      }

      return {
        type: 'content',
        value: text.map((partial: any) => partial.value).join(''),
        toString() {
          return `${this.value}`;
        }
      }
    }
  %}

ContentPartial ->
  %content {% id %}
