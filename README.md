ALFRED TODOIST WORKFLOW
=======================

Add and search [Todoist](https://todoist.com/) tasks straight from [Alfred](https://www.alfredapp.com). It uses Todoist `v7` API.

| Jump to: | [Prerequisites](#prerequisites) | [Installation](#installation) | [Add Tasks](#add-tasks) | [Search and Browse Tasks](#search-and-browse-tasks) | [Configuration](#configuration) |
|:--------:|:-------------------------------:|:-----------------------------:|:-----------------------:|:---------------------------------------------------:|:-------------------------------:|

Prerequisites
-------------

-	For this workflow to work you need version `3.x` of Alfred and a powerpack licence.
-	For adding projects or labels to a new task and for searching for a task, the project uses use Node.js. If you want these features, an installation command is provided.

Installation
------------

[Download](https://github.com/moranje/alfred-workflow-todoist/raw/master/dist/Alfred%20Workflow%20Todoist.alfredworkflow) and import workflow.

For updates use the `t:update` command.

Add Tasks
---------

<!-- Renew photo to(gif?) -->

![](https://raw.githubusercontent.com/moranje/alfred-workflow-todoist/master/images/add-task.gif)

### Alfred command

`todo {task}, {date}, {project}`

Example: *todo Get things done, tomorrow @ 9, work*  
Example: *todo Build tree house #home !!2 @15min, tomorrow @ 9*  
\* *#project @label and !!priority will be parsed from anywhere in the text*

#### Task

Can be any string as long as there are no comma's in it. Markdown in the string will be parsed (in the Todoist app), but anything else won't.

#### Date

See the [Todoist documentation](https://support.todoist.com/hc/en-us/articles/205325931-Dates-and-Times) for supported date formats.

#### Project\*

Add task to an existing project. If no project is selected the task will be added to your inbox. Use either the hashtag notation `#project` (preferred) or the comma-separated 3rd `{project}` argument. Project names are case insensitive and (for now) can't contain any whitespace characters.

#### Labels\*

You can add labels to your tasks using the `@` character. Label names are case insensitive and can't contain any whitespace characters.

#### Priority

A number between `1` and `4`, where `1` is the lowest and `4` would be the highest priority.

\* *Relies on node.js to work*

Search and Browse Tasks
-----------------------

<!-- Renew photo (gif?) -->

![](https://raw.githubusercontent.com/moranje/alfred-workflow-todoist/master/images/search-tasks.gif)

### Alfred command

`todos {query}`

### Query

Any search query one character or longer. Uses fuzzy search to find the tasks.

Example: `todos car` => returns (because of fuzzy search):  
- *Rent car*  
- *New cat recipe's*  
- *Cut Gras tomorrow*

Configuration
-------------

Some magic will happen when you run the `t` command, like creation of files and refreshing of todoist data cache. Other than that use it to configure the workflow.

### Alfred commands

`t:token {api token}` (no default)  
Example: *t:token 2d2e2a334c5f36e7a7c43b46e*

`t:language {language}` (default: en)  
Example: *t:language nl*

`t:items {max list items}` (default: 9)  
Example: *t:items 9*

`t:update`  
Example: *t:update*

`t:node`  
Example: *t:node*

#### Token\*

Your Todoist api token, get it from Todoist Preferences => Account => API-token (should be 40 characters)

#### Language

This is relevant for parsing date strings ('tomorrow @ 9pm', in `en`). Valid languages are: `en`, `da`, `pl`, `zh`, `ko`, `de`, `pt`, `ja`, `it`, `fr`, `sv`, `ru`, `es`, `nl`.

#### Max Items to Show

This parameter limits the amount of tasks shown when using the `todo` command. Node.js is **required** for listing todos

#### Check for updates

Checks current version against latest online version and download if a newer version is available.

#### Node.js

Node.js is required for listing todo's. Working with JSON API's in batch is no fun and the JavaScript force is strong in my, yet none of the other forces (ruby, PHP, python etc.) are. If you decide you want this feature there is an install function included. This will install **[Node.js](https://nodejs.org/en/)** as well as a package manager called **[Homebrew](https://brew.sh/index_nl.html)** to install Node (all other ways of installing node require admin permissions or leave files on your computer). This has the added benefit of making it easy to uninstall as well.

Example: *t:nodejs* => ENTER

**Uninstall Node (terminal):**  
*brew uninstall node*

**Uninstall Homebrew (terminal):**  
*ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"*

\* *Required*

Changelog
---------

View [CHANGELOG](https://github.com/moranje/alfred-workflow-todoist/blob/master/CHANGELOG.md)

License
-------

The MIT License (MIT)

Copyright (c) 2017 [Martien Oranje](https://github.com/moranje)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
