[![Build Status](https://travis-ci.org/moranje/alfred-workflow-todoist.svg?branch=alpha)](https://travis-ci.org/moranje/alfred-workflow-todoist)
[![CodeFactor](https://www.codefactor.io/repository/github/moranje/alfred-workflow-todoist/badge/alpha)](https://www.codefactor.io/repository/github/moranje/alfred-workflow-todoist/overview/alpha)
[![codecov](https://codecov.io/gh/moranje/alfred-workflow-todoist/branch/alpha/graph/badge.svg)](https://codecov.io/gh/moranje/alfred-workflow-todoist/branch/alpha)
[![GitHub Pre-Releases (by Asset)](https://img.shields.io/github/downloads-pre/moranje/alfred-workflow-todoist/latest/Alfred.Workflow.Todoist.alfredworkflow)](https://github.com/moranje/alfred-workflow-todoist/releases)
![GitHub](https://img.shields.io/github/license/moranje/alfred-workflow-todoist)
![GitHub (Pre-)Release Date](https://img.shields.io/github/release-date-pre/moranje/alfred-workflow-todoist)

# ALFRED TODOIST WORKFLOW

Add and search [Todoist](https://todoist.com/) tasks straight from [Alfred](https://www.alfredapp.com). It uses Todoist stable `v1` [REST API](https://developer.todoist.com/rest/v1).

| [Getting started](#getting-started) | [Installation](#installation) | [Usage](#usage) | [Configuration](#configuration) | [Contributing](#contributing) |
| :---------------------------------: | :---------------------------: | :-------------: | :-----------------------------: | :---------------------------: |


## Getting started

For this workflow to work you need:

- Alfred version `3.x` or `4.x` and a powerpack licence.
- [Node.js](https://nodejs.org/en/download/) version `10.x` or up

Note that the workflow expects node to be installed in the default location(s), i.e. `/usr/local/bin` or `/usr/bin`. See [installation notes](#Non---standard-node-installation) below on how to make the workflow work with non-standard node installations.

## Installation

[Download](https://github.com/moranje/alfred-workflow-todoist/releases) and import workflow.

### Non-standard node installation

If you have installed node.js in a non-standard way (e.g. through **nvm** or **homebrew**), you may need to do either of the following to make the workflow work:

**Create symlink to current node version:**

1. In the terminal, navigate to /usr/local/bin<br>
   `cd /usr/local/bin`
2. Create symlink to current node version<br>
   `ln -s $(which node) node`<br>
   (note, if you're using a different shell - fish, zsh, etc. - you may need to make slight changes to make the command work).

This method should work with different versions of nvm (including changing to other versions), as long as you don't remove the symlinked node version (or the symlink itself of course).

The downside is having problems switching between versions because most processes will default to the symlinked version.

**Manually add node path to the workflow:**

1. In the terminal, reveal the path to your node installation `which node`
2. Copy the output, but omit the executable (e.g. `/Users/{user}/.nvm/versions/node/v11.6.0/bin`, not `/Users/{user}/.nvm/versions/node/v11.6.0/bin/node`)
3. Navigate to the workflow in Alfred Preferences _Alfred Preferences_ -> _Workflows_-tab
4. Click "Configure workflow and variables" in the top right corner and edit the node_path variable with the node path followed by a colon i.e. `/Users/{user}/.nvm/versions/node/v11.6.0/bin:`

**Observe**, variable will have to be updated whenever node version changes.

#### Node flags

If you need to enable any node.js command-line flags, you can with

1. Navigate to the workflow in Alfred Preferences _Alfred Preferences_ -> _Workflows_-tab
2. Click "Configure workflow and variables" in the top right corner and edit the node_flag variable with the command-line flag i.e. `--experimental-worker --experimental-modules`

### Debug

If the workflow doesn't work as expected, perform the following to get a clue about the issue:

1. Navigate to the workflow in _Alfred Preferences_ -> _Workflows_-tab
2. Enable _Debug mode_ (button in the top-right corner of the screen)
3. Watch for messages in the bottom log-pane when using the workflow.

If the error messages outputs node errors, either make sure you have the appropriate node version or follow the steps [above](#Non---standard-node-installation) to enable the workflow with a non-standard node installation.

## Usage

### Task string

| Name       | Notation                   | Explanation                                                                                                                                                             |
| ---------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _task_     | Any text except `,`        | The task title.                                                                                                                                                         |
| _project_  | Either `#personal<1>`      | Use either the hashtag notation or bracket notation if the project name has spaces in it. The project name is case sensitive.                                           |
| _label_    | `@15_min<2>`               | [Label](https://get.todoist.help/hc/en-us/articles/205195042) names can't contain any whitespace characters. _This is a premium feature_.                               |
| _priority_ | Either `p2` or `!!2`       | A value between `1` (urgent) and `4` (normal)                                                                                                                           |
| _section_  | `#personal<1>::section<4>` | A project [section](https://get.todoist.help/hc/en-us/articles/360003788739). Can only come after parent project.                                                       |
| _filter_   | `"@15_min #personal"`      | Filter through Todoist. [Read the docs](https://get.todoist.help/hc/en-us/articles/205248842-Filters). _This is a premium feature_. \*NOT implemented yet in the alpha. |
| _date_     | A date string              | See the [Todoist documentation](https://support.todoist.com/hc/en-us/articles/205325931-Dates-and-Times) for supported date formats.                                    |

### Search for tasks

`todos {task_string}`

Any search query one character or longer. Uses fuzzy search to find the tasks. `Projects`, `labels`, `priorities` and `sections` can also be used to filter tasks further.

Example: `todos car` => returns (because of fuzzy search):

- _Rent_ **car**
- _New_ **ca**_t_ **r**_ecipe's_
- **C**_ut Gr_**a**_s tomo_**r**_row_

### Create task

`todo {task_string}`

Example: _todo Get things done, tomorrow @ 9_
Example: _todo Build tree house #home !!2 @15min, tomorrow @ 9_

_*Important*_

For date parsing the work the date needs to be the only thing after the comma.

The reason for this is that multilanguage date string parsing is hard, and Todoist has already solved this problem. But in order to have Todoist read the date the workflow needs to present it a string that holds just the date. The workflow does this by having the date string between a comma and the end of the string.

## Configuration

| Name                   | Input                                                                                                                        | Explanation                                                                                                                                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _token_                | `^[0-9a-fA-F]{40}$` (default empty)                                                                                          | The todoist API token.                                                                                                                                                                                                                             |
| _language_             | `da`, `de`, `en`, `es`, `fi`, `fr`, `it`, `ja`, `ko`, `nl`, `pl`, `pt_BR`, `ru`, `sv`, `tr`, `zh_CN`, `zh_TW` (default `en`) | The language for natural language date processing (by todoist) and to calculate time to complete a task.                                                                                                                                           |
| _max_items_            | A number between `1` and `20`, defaults to `9`                                                                               | The amount of task items to show in a search.                                                                                                                                                                                                      |
| _cache_timeout_        | A positive number (default 2629743, a month)                                                                                 | The time (in seconds) for the cache to timeout. Affects all other resources (`projects`, `labels` and `sections`).                                                                                                                                 |
| _cache_timeout_tasks_  | A positive number (default 604800, a week)                                                                                   | the time (in seconds) for the `tasks` cache to timeout.                                                                                                                                                                                            |
| _filter_wrapper_       | Either `"`, `'` or `` ` `` (defaults to `"`).                                                                                | The character to enclose search filters in. Adjust this if you really need to use quotes in your tasks.                                                                                                                                            |
| _update_checks_        | A positive number (default 604800, a week)                                                                                   | The time (in seconds). To check for a new workflow update.                                                                                                                                                                                         |
| _pre_releases_         | Either `true` or `false`. Defaults to `false`                                                                                | Wether to receive prerease (`alpha` and `beta`) update notifications                                                                                                                                                                               |
| _anonymous_statistics_ | `true` or `false` (default `true`)                                                                                           | This is used to track erros through Sentry.io. When an unexpected error happens in the workflow it is stored in sentry. Extra measures are in place to make sure personal information (like the api token or task details) are not send to Sentry. |
| _log_level_            | Either `silent`, `error`, `warn`, `info`, `debug` or `trace`. Defaults to `error`.                                           | Get more info in the logs.                                                                                                                                                                                                                         |

`todo:setting token {api token}`

Example: _todo:setting token 2d2e2a334c5f36e7a7c43b46e_

`todo:setting language {language}`

Example: _todo:setting language nl_

`todo:setting cache_timeout {time in seconds}`

Example: _todo:setting cache_timeout 13_

`todo:setting anonymous_statistics {true or false}`

Example: _todo:setting anonymous_statistics false_

## Documentation

Read the [docs](https://moranje.github.io/alfred-workflow-todoist).

## Changelog

View [CHANGELOG.md](https://github.com/moranje/alfred-workflow-todoist/blob/master/CHANGELOG.md)

## Contributing

### Instructions

- Fork and clone the repo

  _git clone <https://github.com/YOUR-USERNAME/alfred-worflow-todoist>_

- Install dependencies

  _npm install_

- Symlink to project workflow folder

  _npm run setup:dev_

### Build

Create a new build with

`npm run build`

Create a distributable package (.alfredworkflow) after the build step with

`npm run build:workflow`

### Run tests

Run Jest test suite with:

`npm run test:unit`

Or run a watcher with

`npm run test:unit:watch`

### Commits

For commits the project follows the `angular commit guidelines` and uses `semantic release` to automate builds, semver version updates and changelog creation. The way to make sure this all works is to run:

`npm run commit`

Which guides you through the motions.

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/moranje/alfred-workflow-todoist/issues). You can also take a look at the [contributing guide](https://github.com/moranje/alfred-workflow-todoist/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## Code of conduct

[Code of Conduct](https://github.com/moranje/alfred-workflow-todoist/blob/master/code-of-conduct.md)

## License

Copyright © 2020 [M. Oranje](https://github.com/moranje).<br /> This project is [MIT](https://github.com/moranje/alfred-workflow-todoist/blob/master/LICENSE) licensed.
