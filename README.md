# ALFRED TODOIST WORKFLOW
Add tasks to your [Todoist](https://todoist.com/ "Todoist") inbox or list upcoming tasks straight from [Alfred](https://www.alfredapp.com "Alfred"). I nicked the idea from [Ruben Schmidtmann](https://github.com/rubenschmidtmann "Ruben Schmidtmann")'s [todoist-alfred-workflow](https://github.com/rubenschmidtmann/todoist-alfred-workflow "todoist-alfred-workflow"), and further expanded on it. It uses Todoist `v7` API. For this workflow to work you need version `3.x` of Alfred.

The task listing feature, adding project and labels to tasks relies on javascript (sorry no PHP, perl of ruby foo) which means it needs node.js to function (OSX javascript proved to be clunky for modules and file io). The task adding feature should work on any Mac OSX version.

## Installation
[Download](https://github.com/moranje/alfred-workflow-todoist/raw/master/dist/Alfred%20Workflow%20Todoist.alfredworkflow) and import workflow.

## COMMAND `t` 
Some magic will happen when you run the `t` command, like creation of files and refreshing of todoist data cache. Other than that use it to configure the workflow.

**One Time Config**  
`t:token {api token}` (no default)  
Example: _t:token 2d2e2a334c5f36e7a7c43b46e_

`t:language {language}` (default: en)  
Example: _t:language nl_

`t:items {max list items}` (default: 9)  
Example: _t:items 9_

### Token*
Your Todoist api token, get it from Todoist Preferences => Account => API-token (should be 40 characters)

### Language
This is relevant for parsing date strings ('tomorrow @ 9pm', in `en`). Valid languages are: `en`, `da`, `pl`, `zh`, `ko`, `de`, `pt`, `ja`, `it`, `fr`, `sv`, `ru`, `es`, `nl`.

### Max List Items
This parameter limits the amount of tasks shown when using the `todo` command. Node.js is **required** for listing todos

### Node.js
Node.js is required for listing todo's. Working with JSON API's in batch is no fun and the JavaScript force is strong in my, yet none of the other forces (ruby, PHP, python etc.) are. If you decide you want this feature there is an install function included. This will install **Node.js** as well as a package manager called **Homebrew** to install Node (all other ways of installing node require admin permissions or leave files on your computer). This has the added benefit of making it easy to uninstall as well.

Example: _t:nodejs_ => ENTER  

**Uninstall Node (terminal):**  
_brew uninstall node_  

**Uninstall Homebrew (terminal):**  
_ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"_  

\* _Required_  

## COMMAND `todo`
![](https://raw.githubusercontent.com/moranje/alfred-workflow-todoist/master/images/add-task.png "Add a task to your Todoist Inbox")  

**Add a task**  
`todo {task}, {date}, {project}` _{priority} and {labels} can go anywhere_  
Example: _todo Get stuff done, tomorrow @ 9, work_  
Example: _todo Build tree house, tomorrow @ 9, home !!2_  
Example: _todo Get milk, tomorrow @ 9, home @on_road @5min  

### Task
Can be any string as long as there are no comma's in it. Markdown in the string will be parsed, but anything else won't.

### Date
See the [Todoist documentation](https://support.todoist.com/hc/en-us/articles/205325931-Dates-and-Times "Todoist documentation") for supported date formats.

### Project*
Add task to an existing project. If no project is selected the task will be added to your inbox.

### Labels*
You can now add labels to your tasks. Any string that has a `@` before it will be checked against your existing labels. If it matches (case insensitive) the label will be added. The labels can be added anywhere in the todo command so these are all valid:  
Example: _todo Get stuff done, tomorrow @ 9, work @delayed_  
Example: _todo Get stuff done , tomorrow @ 9 @delayed, work_  
Example: _todo Get stuff done @delayed, tomorrow @ 9, work @delayed_  

### Priority
A number between 1 and 4, where 1 is the lowest and 4 would be the highest priority. The priority tags can be added anywhere in the todo command so these are all valid:  
Example: _todo Get stuff done, tomorrow @ 9, work !!2_  
Example: _todo Get stuff done , tomorrow @ 9 !!2, work_  
Example: _todo Get stuff done !!2, tomorrow @ 9, work_  

\* _Relies on node.js to work_  

### Hacks
Use a comma to separate the parameters, leading or trailing whitespace is ignored. If you wish to change the delimiter with which the parameters (task, date and priority) are separated, you'll need to change a line in the bash script. For instance if you'd like to use ';' as a delimiter, change:  
```bash
IFS=',' read -r -a items <<< "$query"
```  
to:  
```bash
IFS=':' read -r -a items <<< "$query"
```  

## COMMAND `todos`
![](https://raw.githubusercontent.com/moranje/alfred-workflow-todoist/master/images/list-tasks.png "List your Todoist tasks ")  

**List tasks (and mark done)**  
`todos` (+ navigate and hit ENTER)  

**Search tasks (and mark done)**  
`todos + {query}` (+ navigate and hit ENTER)  

### Query
Any search query one character or longer. Uses fuzzy search to find the tasks.  

Example: _todos car_ => finds (because of fuzzy search):  
* _Rent car_
* _New cat recipe's_
* _Cut Gras tomorrow_

## Changelog
View [CHANGELOG.md](https://github.com/moranje/alfred-workflow-todoist/blob/master/CHANGELOG.md "Changelog")

## License
The MIT License (MIT)

Copyright (c) 2016 [Martien Oranje](https://github.com/moranje)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
