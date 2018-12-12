[![Build Status](https://travis-ci.org/moranje/alfred-workflow-todoist.svg?branch=master)](https://travis-ci.org/moranje/alfred-workflow-todoist)
[![Coverage Status](https://coveralls.io/repos/github/moranje/alfred-workflow-todoist/badge.svg)](https://coveralls.io/github/moranje/alfred-workflow-todoist) [![Greenkeeper badge](https://badges.greenkeeper.io/moranje/alfred-workflow-todoist.svg)](https://greenkeeper.io/)

# ALFRED TODOIST WORKFLOW

Add and search [Todoist](https://todoist.com/) tasks straight from [Alfred](https://www.alfredapp.com). It uses Todoist `v8` [REST API](https://developer.todoist.com/rest/v8/).

| [Getting started](#getting-started) | [Installation](#installation) | [Configuration](#configuration) | [Usage](#usage) | [Contributing](#contributing) |
| :---------------------------------: | :---------------------------: | :-----------------------------: | :-------------: | :---------------------------: |


## Getting started

- For this workflow to work you need version `3.x` of Alfred and a powerpack licence.
- [Node.js](https://nodejs.org/en/download/). If you install node.js in a non-standard way be advised that the workflow expects the binary to be in `/usr/local/bin` or `/usr/bin`

## Installation

[Download](https://github.com/moranje/alfred-workflow-todoist/raw/master/dist/Alfred%20Workflow%20Todoist.alfredworkflow) and import workflow.

## Configuration

| Name                   | Notation                                                                                          | Explanation                                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| _token_                | `^[0-9a-fA-F]{40}$` (default empty)                                                               | The todoist API token.                                                                                                                    |
| _language_             | `en`, `da`, `pl`, `zh`, `ko`, `de`, `pt`, `ja`, `it`, `fr`, `sv`, `ru`, `es`, `nl` (default `en`) | The language for natural language date processing (by todoist) and to calculate time to complete a task.                                  |
| _cache_timeout_        | A positive number (default `3600`, an hour)                                                       | The time (in seconds) until the cache is refreshed (until that time todoist information is stored locally to make things a little faster) |
| _anonymous_statistics_ | `true` or `false` (default `true`)                                                                | Doesn't do much at the moment but I intent to use it to track installs                                                                    |

`todo:setting token {api token}`

Example: _todo:setting token 2d2e2a334c5f36e7a7c43b46e_

`todo:setting language {language}`

Example: _todo:setting language nl_

`todo:setting cache_timeout {time in seconds}`

Example: _todo:setting cache_timeout 13_

`todo:setting anonymous_statistics {true or false}`

Example: _todo:setting anonymous_statistics false_

## Usage

| Name       | Notation                                | Explanation                                                                                                                          |
| ---------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| _task_     | Any text except `,`                     | The task title.                                                                                                                      |
| _date_     | A date string                           | See the [Todoist documentation](https://support.todoist.com/hc/en-us/articles/205325931-Dates-and-Times) for supported date formats. |
| _project_  | Either `#personal` or `#[next actions]` | Use either the hashtag notation or bracket notation if the project name has spaces in it. The project name is case insensitive.      |
| _label_    | `@label`                                | Label names can't contain any whitespace characters. Labels are case insensitive.                                                    |
| _priority_ | Either `p2` or `!!2`                    | A value between `1` (urgent) and `4` (normal)                                                                                        |

### Search for tasks

`todos {query}`

### Query

Any search query one character or longer. Uses fuzzy search to find the tasks.

Example: `todos car` => returns (because of fuzzy search):

- _Rent_ **car**
- _New_ **ca**_t_ **r**_ecipe's_
- **C**_ut Gr_**a**_s tomo_**r**_row_

### Create task

`todo {task}, {date}`

Example: _todo Get things done, tomorrow @ 9_
Example: _todo Build tree house #home !!2 @15min, tomorrow @ 9_

## Documentation

Read the [docs](https://moranje.github.io/alfred-workflow-todoist).

## Changelog

View [CHANGELOG.md](https://github.com/moranje/alfred-workflow-todoist/blob/master/CHANGELOG.md)

## Contributing

### Instructions

```md
- Fork and clone the repo
- Install dependacies
- Symlink to project workflow folder

  git clone https://github.com/YOUR-USERNAME/alfred-worflow-todoist
  npm install
  npm run setup:dev
```

### Build

Create a new build with

`npm run build`

### Run tests

Run Jest test suite with:

`npm run test`
`npm run test:prod`

Or run a watcher with

`npm run test:watch`

### Commits

For commits I follow the `angular commit guidelines` and use `semantic release` to automate builds, semver version updates and changelog creation. The way to make sure this all works is to run:

`npm run commit`

Which guides you through the motions

## Code of conduct

[code-of-conduct.md](https://github.com/moranje/alfred-workflow-todoist/blob/master/code-of-conduct.md)

## License

[License MIT](https://github.com/moranje/alfred-workflow-todoist/blob/master/LICENSE) © [Martien Oranje](https://github.com/moranje)
