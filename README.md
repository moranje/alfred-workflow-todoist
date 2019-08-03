[![Build Status](https://travis-ci.org/moranje/alfred-workflow-todoist.svg?branch=master)](https://travis-ci.org/moranje/alfred-workflow-todoist)
[![Coverage Status](https://coveralls.io/repos/github/moranje/alfred-workflow-todoist/badge.svg)](https://coveralls.io/github/moranje/alfred-workflow-todoist) ![](https://img.shields.io/librariesio/github/moranje/alfred-workflow-todoist.svg) [![CodeFactor](https://www.codefactor.io/repository/github/moranje/alfred-workflow-todoist/badge)](https://www.codefactor.io/repository/github/moranje/alfred-workflow-todoist) ![GitHub Releases (by Asset)](https://img.shields.io/github/downloads/moranje/alfred-workflow-todoist/latest/Alfred.Workflow.Todoist.alfredworkflow.svg)

# ALFRED TODOIST WORKFLOW

Add and search [Todoist](https://todoist.com/) tasks straight from [Alfred](https://www.alfredapp.com). It uses Todoist stable `v1` [REST API](https://developer.todoist.com/rest/v1).

| [Getting started](#getting-started) | [Installation](#installation) | [Configuration](#configuration) | [Usage](#usage) | [Contributing](#contributing) |
| :---------------------------------: | :---------------------------: | :-----------------------------: | :-------------: | :---------------------------: |


## Getting started

For this workflow to work you need:

- Alfred version `3.x` and a powerpack licence.
- [Node.js](https://nodejs.org/en/download/) version `10.0.0` or up

Note that the workflow expects node to be installed in the default location(s), i.e. `/usr/local/bin` or `/usr/bin`. See [installation notes](#Non---standard-node-installation) below on how to make the workflow work with non-standard node installations.

## Installation

[Download](https://github.com/moranje/alfred-workflow-todoist/releases/latest/download/Alfred.Workflow.Todoist.alfredworkflow) and import workflow.

### Non-standard node installation

If you have installed node.js in a non-standard way (e.g. through **nvm** or **homebrew**), you may need to do either of the following to make the workflow work:

**Create symlink to current node version:**

1. In the terminal, navigate to /usr/local/bin
`cd /usr/local/bin`
2. Create symlink to current node version
`ln -s $(which node) node`
(note, if you're using a different shell - fish, zsh, etc. - you may need to make slight changes to make the command work).

This method should work with different versions of nvm (including changing to other versions), as long as you don't remove the symlinked node version (or the symlink itself of course).

**Manually add node path to the workflow:**

1. In the terminal, reveal the path to your node installation
`which node`
2. copy the output, but omit the executeable
(e.g.
`/Users/{user}/.nvm/versions/node/v11.6.0/bin`, not
`/Users/{user}/.nvm/versions/node/v11.6.0/bin/node`)
3. navigate to the workflow in Alfred Preferences
*Alfred Preferences* -> *Workflows*-tab
4. open all objects in the workflow, one at a time, find wherever the path is exported and add your node path to the beginning – i.e. find all instances of
`export PATH="$PATH:/usr/local/bin:/usr/bin"`
and add your node path, resulting in
`export PATH="$PATH:/Users/{user}/.nvm/versions/node/v11.6.0/bin:/usr/local/bin:/usr/bin"`
(observe the colons separating the statements)

**Observe**, this method will have to be repeated whenever the workflow is updated.

### Debug

If the workflow doesn't work as expected, perform the following to get a clue about the issue:

1. Navigate to the workflow in *Alfred Preferences* -> *Workflows*-tab
2. Enable *Debug mode* (button in the top-right corner of the screen)
3. Watch for messages in the bottom log-pane when using the workflow.

If the error messages outputs node errors, either make sure you have the appropriate node version or follow the steps [above](#Non---standard-node-installation) to enable the workflow with a non-standard node installation.

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
| _project_  | Either `#personal` or `#[next actions]` | Use either the hashtag notation or bracket notation if the project name has spaces in it. The project name is case sensitive.        |
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

*_Important_*

For date parsing the work the date needs to be the only thing after the comma.

The reason for this is that multilanguage date string parsing is hard, and Todoist has already solved this problem. But in order to have Todoist read the date the workflow needs to present it a string that holds just the date. The workflow does this by having the date string between a comma and the end of the string.

## Documentation

Read the [docs](https://moranje.github.io/alfred-workflow-todoist).

## Changelog

View [CHANGELOG.md](https://github.com/moranje/alfred-workflow-todoist/blob/master/CHANGELOG.md)

## Contributing

### Instructions

- Fork and clone the repo

  *git clone https://github.com/YOUR-USERNAME/alfred-worflow-todoist*

- Install dependencies

  *npm install*

- Symlink to project workflow folder

  *npm run setup:dev*

### Build

Create a new build with

`npm run build`

Create a distributable package (.alfredworkflow) after the build step with

`npm run build:workflow`


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

[Code of Conduct](https://github.com/moranje/alfred-workflow-todoist/blob/master/code-of-conduct.md)

## License

[License MIT](https://github.com/moranje/alfred-workflow-todoist/blob/master/LICENSE) © [Martien Oranje](https://github.com/moranje)
