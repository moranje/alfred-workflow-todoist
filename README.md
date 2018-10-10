[![Build Status](https://travis-ci.org/moranje/alfred-workflow-todoist.svg?branch=master)](https://travis-ci.org/moranje/alfred-workflow-todoist) [![Coverage Status](https://coveralls.io/repos/github/moranje/alfred-workflow-todoist/badge.svg)](https://coveralls.io/github/moranje/alfred-workflow-todoist)

# ALFRED TODOIST WORKFLOW

Add and search [Todoist](https://todoist.com/) tasks straight from [Alfred](https://www.alfredapp.com). It uses Todoist `v8` REST API.

| Jump to: | [Prerequisites](#prerequisites) | [Installation](#installation) | [Add Tasks](#add-tasks) | [Search and Browse Tasks](#search-and-browse-tasks) | [Configuration](#configuration) |
| :------: | :-----------------------------: | :---------------------------: | :---------------------: | :-------------------------------------------------: | :-----------------------------: |


## Prerequisites

- For this workflow to work you need version `3.x` of Alfred and a powerpack licence.
- [Node.js](https://nodejs.org/en/download/)

## Installation

[Download](https://github.com/moranje/alfred-workflow-todoist/raw/master/dist/Alfred%20Workflow%20Todoist.alfredworkflow) and import workflow.

For updates use the `todo:update` command.

## Add Tasks

### Alfred command

`todo {task}, {date}`

Example: _todo Get things done, tomorrow @ 9_  
Example: _todo Build tree house #home !!2 @15min, tomorrow @ 9_

#### Task

Can be any string as long as there are no comma's in it. Markdown in the string will be parsed (in the Todoist app), but anything else won't.

#### Date

See the [Todoist documentation](https://support.todoist.com/hc/en-us/articles/205325931-Dates-and-Times) for supported date formats.

#### Project\*

Add task to an existing project. If no project is selected the task will be added to your inbox. Use either the hashtag notation `#project` or if the project has spaces in it `#[in box]`. Project names are case insensitive.

#### Labels\*

You can add labels to your tasks using the `@` character. Label names are case insensitive and can't contain any whitespace characters.

#### Priority

A number between `1` and `4`, where `1` is the highest and `4` would be the lowest (and default) priority.

## Search and Browse Tasks

### Alfred command

`todos {query}`

### Query

Any search query one character or longer. Uses fuzzy search to find the tasks.

Example: `todos car` => returns (because of fuzzy search):

- _Rent_ **car**
- _New_ **ca**_t_ **r**_ecipe's_
- **C**_ut Gr_**a**_s tomo_**r**_row_

## Configuration

Some magic will happen when you run the `t` command, like creation of files and refreshing of todoist data cache. Other than that use it to configure the workflow.

### Alfred commands

`todo:setting token {api token}` (no default)  
Example: _todo:setting token 2d2e2a334c5f36e7a7c43b46e_

`todo:setting language {language}` (default: en)  
Example: _todo:setting language nl_

`todo:setting items {max list items}` (default: 9)  
Example: _todo:setting items 9_

`todo:setting cache_timeout {time in seconds}` (default: 3600)  
Example: _todo:setting cache_timeout 13_

`todo:setting anonymous_statistics {true or false}` (default: true)  
Example: _todo:setting anonymous_statistics false_

#### Token\*

Your Todoist api token, get it from Todoist Preferences => Account => API-token (should be 40 characters)

#### Language

This is relevant for parsing date strings ('tomorrow @ 9pm', in `en`). Valid languages are: `en`, `da`, `pl`, `zh`, `ko`, `de`, `pt`, `ja`, `it`, `fr`, `sv`, `ru`, `es`, `nl`.

#### Max Items to Show

This parameter limits the amount of tasks shown when using the `todo` command. Node.js is **required** for listing todos

## Changelog

View [CHANGELOG.md](https://github.com/moranje/alfred-workflow-todoist/blob/master/CHANGELOG.md)

## License

The MIT License (MIT)

Copyright (c) 2018 [Martien Oranje](https://github.com/moranje)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
